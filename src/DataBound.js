
class DataBoundUtils {
    static extractPropsFromString(propStr) {
        let match = propStr.match(DataBoundUtils.propStringRegex);
        if (match && match.length > 0) {
            let props = [];
            for (let i=0; i<match.length; i++) {
                let m = match[i];
                let p = match[i].slice(2, -1).trim();
                let rootRef = false;
                let selfRef = false;
                if (p.startsWith(".")) {
                    selfRef = true;
                    p = p.slice(1);
                } else if (p.startsWith("~")) {
                    rootRef = true;
                    p = p.slice(1);
                }
                props.push({match: m, prop: p, rootRef: rootRef, selfRef: selfRef})
            }
            return props;
        }
        return [];
    }
}

DataBoundUtils.booleanAttributeNameList = [
    "checked",
    "selected",
    "disabled",
    "hidden",
    "readonly",
    "multiple",
    "ismap",
    "defer",
    "declare",
    "noresize",
    "nowrap",
    "noshade",
    "compact"
];

DataBoundUtils.booleanConditionalAttributes = {
    'eq': (contextVal, conditionVal) => {
        return contextVal == conditionVal;
    },
    'neq': (contextVal, conditionVal) => {
        return contextVal != conditionVal;
    },
    'lt': (contextVal, conditionVal) => {
        return contextVal < conditionVal;
    },
    'lte': (contextVal, conditionVal) => {
        return contextVal <= conditionVal;
    },
    'gt': (contextVal, conditionVal) => {
        return contextVal > conditionVal;
    },
    'gte': (contextVal, conditionVal) => {
        return contextVal >= conditionVal;
    },
    'not': (contextVal) => {
        return !contextVal;
    },
    'mod-zero': (contextVal, conditionVal) => {
        return contextVal % conditionVal == 0;
    }
};

DataBoundUtils.propStringRegex = new RegExp(/\$\{ *(~(?!\.))?[\w.]+\w *}/g);

class DataBoundPropString {
    constructor(str) {
        this.originalStr = str;
        this.matches = DataBoundUtils.extractPropsFromString(str);
    }

    getValueWithContext(propIndex, context, dataBoundContext, rootContext) {
        if (propIndex >= this.matches.length) {
            return; // undefined
        }

        let value;
        let match = this.matches[propIndex];
        let prop = match.prop;
        let parts = prop.split('.');
        let ctx;
        if (match.rootRef) {
            ctx = rootContext;
        } else if (match.selfRef) {
            ctx = dataBoundContext;
        } else {
            ctx = context;
        }

        this.lastContextUsed = ctx;

        for (let j=0; j<parts.length; j++) {
            let currentProp = parts[j];
            if (ctx != null && currentProp in ctx) {
                value = ctx[currentProp];
            } else {
                return; // undefined
            }

            ctx = value;
        }
        return value;
    }

    getPropName(propIndex) {
        if (propIndex < this.matches.length) {
            return this.matches[propIndex].prop;
        }
    }

    renderWithContext(context, dataBoundContext, rootContext) {
        let renderStr = this.originalStr;
        for (let i=0; i<this.matches.length; i++) {
            let value = this.getValueWithContext(i, context, dataBoundContext, rootContext);
            value = value instanceof Function ? value(dataBoundContext) : value
            renderStr = renderStr.replace(this.matches[i].match, value);
        }
        return renderStr;
    }
}

class DataBoundAttribute {
    constructor(attrNode) {
        this.node = attrNode;
        this.propString = new DataBoundPropString(attrNode.nodeValue);
    }

    renderWithContext(context, dataBoundContext, rootContext) {
        this.node.nodeValue = this.propString.renderWithContext(context, dataBoundContext, rootContext);
    }
}

class DataBoundTextNode {
    constructor(textNode) {
        this.node = textNode;
        this.propString = new DataBoundPropString(textNode.nodeValue);
    }

    renderWithContext(context, dataBoundContext, rootContext) {
        this.node.nodeValue = this.propString.renderWithContext(context, dataBoundContext, rootContext);
    }
}

class DataBoundBooleanAttribute {
    constructor(attrNode) {
        this.nodeOwner = attrNode.ownerElement;
        this.attrName = attrNode.nodeName;
        this.propString = new DataBoundPropString(attrNode.nodeValue);
        attrNode.nodeValue = '';
        this.conditionMethod = (value) => {return value;};
        this.conditionAttr = null;
        this.conditionPropString = null;

        for (let i=0; i<this.nodeOwner.attributes.length; i++) {
            let attr = this.nodeOwner.attributes[i];
            let conditionAttrPrefix = 'data-bound-' + this.attrName + '-';
            if (attr.name.startsWith(conditionAttrPrefix)) {
                this.conditionAttr = attr;
                this.conditionPropString = new DataBoundPropString(attr.nodeValue);
                if (this.conditionPropString.matches.length == 0) {
                    this.conditionPropString = null;
                }
                let condition = attr.name.slice(conditionAttrPrefix.length);
                this.conditionMethod = DataBoundUtils.booleanConditionalAttributes[condition];
                if (!this.conditionMethod) {
                    console.warn("Unknown conditional attribute '", condition,
                        "' used for boolean attribute '", this.attrName, "'.");
                    this.conditionMethod = (value) => {return value;};
                }
                break;
            }
        }
    }

    renderWithContext(context, dataBoundContext, rootContext) {
        if (this.propString.matches.length > 0) {
            let contextValue = this.propString.getValueWithContext(0, context, dataBoundContext, rootContext);
            let conditionValue = null;
            if (this.conditionAttr) {
                if (this.conditionPropString) {
                    conditionValue = this.conditionPropString.renderWithContext(context, dataBoundContext, rootContext);
                } else {
                    conditionValue = this.conditionAttr.nodeValue;
                }
            }
            if (this.conditionMethod(contextValue, conditionValue)) {
                this.nodeOwner.setAttribute(this.attrName, '');
            } else {
                this.nodeOwner.removeAttribute(this.attrName);
            }
        }
    }
}

class DataBoundMethodAttribute {
    constructor(attrNode) {
        this.nodeOwner = attrNode.ownerElement;
        this.attrName = attrNode.nodeName;
        if (!this.attrName.startsWith("on")) {
            throw "DataBoundMethodAttribute can only be bound to an attribute that begins with 'on'.";
        }

        this.propString = new DataBoundPropString(attrNode.nodeValue);
        this.eventName = this.attrName.slice(2);
        this.nodeOwner.addEventListener(this.eventName, this.eventCall.bind(this));
        this.nodeOwner.removeAttribute(this.attrName);
    }

    renderWithContext(context, dataBoundContext, rootContext) {
        this.lastBoundContext = dataBoundContext;
        this.method = this.propString.getValueWithContext(0, context, dataBoundContext, rootContext);
        this.nodeOwner.setAttribute('data-bound-method-' + this.attrName,
            this.propString.lastContextUsed.constructor.name + "." + this.propString.getPropName(0));
    }

    eventCall(event) {
        if (this.method instanceof Function) {
            this.method(event, this.lastBoundContext);
        }
    }
}

class DataBoundElement {
    constructor(element) {
        this.domElement = element;
        this.bindings = [];

        for (let i=0; i<this.domElement.attributes.length; i++) {
            let attr = this.domElement.attributes[i];
            if (DataBoundUtils.booleanAttributeNameList.indexOf(attr.name) >= 0) {
                this.bindings.push(new DataBoundBooleanAttribute(attr));
            } else if (attr.name.startsWith("on")) {
                this.bindings.push(new DataBoundMethodAttribute(attr));
            } else {
                this.bindings.push(new DataBoundAttribute(attr));
            }
        }

        for (let i=0; i<this.domElement.childNodes.length; i++) {
            let node = this.domElement.childNodes[i];
            switch (node.nodeType) {
                case 1: // ELEMENT NODE
                    this.bindings.push(new DataBoundElement(node));
                    break;
                case 3: // TEXT NODE
                    this.bindings.push(new DataBoundTextNode(node));
                    break;
            }
        }
    }

    renderWithContext(context, dataBoundContext, rootContext) {
        for(let i=0; i<this.bindings.length; i++) {
            let b = this.bindings[i];
            b.renderWithContext(context, dataBoundContext, rootContext);
        }
    }
}

class DataBoundElementArray {
    constructor(element) {
        this.domElement = element;
        this.propString = new DataBoundPropString(this.domElement.attributes["data-bound-element-array"].nodeValue);
        this.domElement.removeAttribute("data-bound-element-array");
        this.baseElement = this.domElement.parentElement;
        this.anchorElement = document.createElement("data-bound-array-anchor");
        this.baseElement.insertBefore(this.anchorElement, this.domElement);
        this.baseElement.removeChild(this.domElement);
        this.elementArray = [];
    }

    renderWithContext(context, dataBoundContext, rootContext) {
        this.anchorElement.setAttribute("data-bound-array",
            context.constructor.name + "." + this.propString.getPropName(0));
        let contextArray = this.propString.getValueWithContext(0, context, dataBoundContext, rootContext);
        if (!(contextArray instanceof Array)) {
            throw "Cannot render a DataBoundElementArray with non-Array type.";
        }

        if (contextArray.length != this.elementArray.length) {
            if (contextArray.length < this.elementArray.length) {
                // Remove Nodes
                let removed = this.elementArray.splice(contextArray.length,
                    this.elementArray.length - contextArray.length);

                for (let i=0; i<removed.length; i++) {
                    this.baseElement.removeChild(removed[i].domElement);
                }
            } else if (contextArray.length > this.elementArray.length) {
                // Add Nodes
                let dif = contextArray.length - this.elementArray.length;
                for (let i=0; i<dif; i++) {
                    let clone = this.domElement.cloneNode(true);
                    let boundElement = new DataBoundElement(clone);
                    this.elementArray.push({domElement: clone, boundElement: boundElement});
                    this.baseElement.insertBefore(clone, this.anchorElement);
                }
            }
        }


        for (let i=0; i<this.elementArray.length; i++) {
            let child = this.elementArray[i];
            let childDataBoundContext = {
                dataBoundIndex: i,
                parentContext: context,
                itemValue: contextArray[i],
                dataBoundContext: dataBoundContext
            };
            child.boundElement.renderWithContext(contextArray[i], childDataBoundContext, rootContext);
        }
    }
}