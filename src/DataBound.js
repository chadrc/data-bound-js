
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

    static extractConditionalAttr(attributes, prefix) {
        let info = {
            conditionAttr: null,
            conditionPropString: null,
            conditionMethod: (value) => {return value;}
        };
        for (let i=0; i<attributes.length; i++) {
            let attr = attributes[i];
            if (attr.name.startsWith(prefix)) {
                info.conditionAttr = attr;
                info.conditionPropString = new DataBoundPropString(attr.nodeValue);
                if (info.conditionPropString.matches.length == 0) {
                    info.conditionPropString = null;
                }
                let condition = attr.name.slice(prefix.length);
                info.conditionMethod = DataBoundUtils.booleanConditionalAttributes[condition];
                if (!info.conditionMethod) {
                    console.warn("Unknown conditional attribute '", condition,
                        "' used for boolean attribute '", info.attrName, "'.");
                    this.conditionMethod = (value) => {return value;};
                }
                break;
            }
        }
        return info;
    }

    static registerDBObject(obj) {
        if (DataBoundUtils.debugMode) {
            obj.dataBoundId = DataBoundUtils.boundObjectCounter++;
            DataBoundUtils.objectList.push(obj);
        }
    }

    static getDBObjectById(id) {
        if (!DataBoundUtils.debugMode) {
            return "DataBoundJS is not in debug mode.";
        }

        if (id >= 0 && id < DataBoundUtils.objectList.length) {
            return DataBoundUtils.objectList[id];
        }
        return null;
    }

    static bindElement(domElement, creator) {
        let elementBinding = null;
        if (domElement.attributes["data-bound-array"]) {
            elementBinding = new DataBoundElementArray(domElement);
        } else if (domElement.attributes["data-bound-if"]) {
            elementBinding = new DataBoundIfNode(domElement);
        } else {
            elementBinding = new DataBoundElement(domElement, creator);
        }
        return elementBinding;
    }
}

DataBoundUtils.debugMode = false;
DataBoundUtils.objectList = [];
DataBoundUtils.boundObjectCounter = 1;

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
    }
};

DataBoundUtils.propStringRegex = new RegExp(/\$\{ *(~(?!\.))?[\w.]+\w *}/g);

class DataBoundPropString {
    constructor(str) {
        DataBoundUtils.registerDBObject(this);
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
            value = value instanceof Function ? value(dataBoundContext) : value;
            renderStr = renderStr.replace(this.matches[i].match, value);
        }
        return renderStr;
    }
}

class DataBoundAttribute {
    constructor(attrNode) {
        DataBoundUtils.registerDBObject(this);
        this.node = attrNode;
        this.propString = new DataBoundPropString(attrNode.nodeValue);
    }

    get isBound() {
        return this.propString.matches.length > 0;
    }

    renderWithContext(context, dataBoundContext, rootContext) {
        this.node.nodeValue = this.propString.renderWithContext(context, dataBoundContext, rootContext);
    }
}

class DataBoundTextNode {
    constructor(textNode) {
        DataBoundUtils.registerDBObject(this);
        this.node = textNode;
        this.propString = new DataBoundPropString(textNode.nodeValue);
    }

    get isBound() {
        return this.propString.matches.length > 0;
    }

    renderWithContext(context, dataBoundContext, rootContext) {
        this.node.nodeValue = this.propString.renderWithContext(context, dataBoundContext, rootContext);
    }
}

class DataBoundConditional {
    constructor(attributes, prefix) {
        DataBoundUtils.registerDBObject(this);
        this.conditionAttr = null;
        this.conditionPropString = null;
        this.conditionMethod = (value) => {return value;};

        for (let i=0; i<attributes.length; i++) {
            let attr = attributes[i];
            if (attr.name.startsWith(prefix)) {
                this.conditionAttr = attr;
                this.conditionPropString = new DataBoundPropString(attr.nodeValue);
                if (this.conditionPropString.matches.length == 0) {
                    this.conditionPropString = null;
                }
                let condition = attr.name.slice(prefix.length);
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

    getValueWithContext(context, dataBoundContext, rootContext) {
        let conditionValue = null;
        if (this.conditionAttr) {
            if (this.conditionPropString) {
                conditionValue = this.conditionPropString.renderWithContext(context, dataBoundContext, rootContext);
            } else {
                conditionValue = this.conditionAttr.nodeValue;
            }
        }
        return conditionValue;
    }
}

class DataBoundBooleanAttribute {
    constructor(attrNode) {
        DataBoundUtils.registerDBObject(this);
        this.nodeOwner = attrNode.ownerElement;
        this.attrName = attrNode.nodeName;
        this.propString = new DataBoundPropString(attrNode.nodeValue);
        attrNode.nodeValue = '';
        let conditionAttrPrefix = 'data-bound-' + this.attrName + '-';
        this.boundConditional = new DataBoundConditional(this.nodeOwner.attributes, conditionAttrPrefix);
    }

    get isBound() {
        return this.propString.matches.length > 0;
    }

    renderWithContext(context, dataBoundContext, rootContext) {
        if (this.propString.matches.length > 0) {
            let contextValue = this.propString.getValueWithContext(0, context, dataBoundContext, rootContext);
            let conditionValue = this.boundConditional.getValueWithContext(context, dataBoundContext, rootContext);
            if (this.boundConditional.conditionMethod(contextValue, conditionValue)) {
                this.nodeOwner.setAttribute(this.attrName, '');
            } else {
                this.nodeOwner.removeAttribute(this.attrName);
            }
        }
    }
}

class DataBoundMethodAttribute {
    constructor(attrNode) {
        DataBoundUtils.registerDBObject(this);
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

    get isBound() {
        return this.propString.matches.length > 0;
    }

    renderWithContext(context, dataBoundContext, rootContext) {
        this.lastBoundContext = dataBoundContext;
        this.method = this.propString.getValueWithContext(0, context, dataBoundContext, rootContext);
        if (this.method && this.method instanceof Function) {
            this.nodeOwner.setAttribute('data-bound-method-' + this.attrName,
                this.propString.lastContextUsed.constructor.name + "." + this.propString.getPropName(0));
        } else {
            this.nodeOwner.setAttribute('data-bound-method-' + this.attrName, "[No Bound Method]");
        }
    }

    eventCall(event) {
        if (this.method instanceof Function) {
            this.method(event, this.lastBoundContext);
        }
    }
}

class DataBoundElement {
    constructor(element, creatingElement) {
        DataBoundUtils.registerDBObject(this);
        this.domElement = element;
        this.bindings = [];
        this.refs = {};
        this.subContexts = creatingElement ? creatingElement.subContexts : [];

        for (let i=0; i<this.domElement.attributes.length; i++) {
            let attr = this.domElement.attributes[i];
            let binding = null;
            if (DataBoundUtils.booleanAttributeNameList.indexOf(attr.name) >= 0) {
                binding = new DataBoundBooleanAttribute(attr);
            } else if (attr.name.startsWith("on")) {
                binding = new DataBoundMethodAttribute(attr);
            } else {
                binding = new DataBoundAttribute(attr);
            }
            if (binding.isBound) {
                this.bindings.push(binding);
            }
        }

        for (let i=0; i<this.domElement.childNodes.length; i++) {
            let node = this.domElement.childNodes[i];
            switch (node.nodeType) {
                case 1: // ELEMENT NODE
                    if (node.attributes["data-bound-context"]) {
                        let subContext = new DataBoundSubContext(node);
                        let contextName = node.getAttribute("id");

                        this.subContexts.push(subContext);
                        if (contextName) {
                            this.subContexts[contextName] = this.subContexts[this.subContexts.length-1];
                        }
                        break;
                    }

                    let elementBinding = DataBoundUtils.bindElement(node, this);

                    if (node.attributes["data-bound-ref"]) {
                        let refName = node.getAttribute("data-bound-ref") || node.getAttribute("id");
                        if (refName) {
                            this.refs[refName] = elementBinding;
                        } else {
                            console.warn("Data bound reference used without value or id value.");
                        }
                    }

                    if (elementBinding.isBound && !node.attributes["data-bound-ignore"]) {
                        this.bindings.push(elementBinding);
                    }
                    break;
                case 3: // TEXT NODE
                    let textBinding = new DataBoundTextNode(node);
                    if (textBinding.isBound) {
                        this.bindings.push(textBinding);
                    }
                    break;
            }
        }
    }

    get isBound() {
        return this.bindings.length > 0;
    }

    renderWithContext(context, dataBoundContext, rootContext,
                      extendContext, extendDataBoundContext, extendRootContext) {
        if (!rootContext) {
            rootContext = context;
        }

        let newContext = null;
        if (extendDataBoundContext && dataBoundContext) {
            dataBoundContext.element = this.domElement;
            dataBoundContext.boundElement = this;
            newContext = dataBoundContext;
        } else {
            newContext = {
                parent: dataBoundContext,
                boundElement: this,
                element: this.domElement
            };
        }

        for(let i=0; i<this.bindings.length; i++) {
            let b = this.bindings[i];
            b.renderWithContext(context, newContext, rootContext, false, true, false);
        }

        for(let i=0; i<this.subContexts.length; i++) {
            let sub = this.subContexts[i];
            sub.rootContext = rootContext;
        }
    }
}

class DataBoundSubContext {
    constructor(element) {
        DataBoundUtils.registerDBObject(this);
        this.domElement = element;
        this.boundElement = DataBoundUtils.bindElement(element);
        this.currentRootContext = null;
    }

    set rootContext(context) {
        this.currentRootContext = context;
    }

    renderWithContext(context) {
        this.boundElement.renderWithContext(context, null, this.currentRootContext);
    }
}

class DataBoundIfNode {
    constructor(element) {
        DataBoundUtils.registerDBObject(this);
        this.domElement = element;
        this.propString = new DataBoundPropString(this.domElement.attributes["data-bound-if"].nodeValue);
        this.domElement.removeAttribute("data-bound-if");
        this.boundElement = new DataBoundElement(this.domElement);
        this.baseElement = this.domElement.parentElement;
        this.anchorNode = document.createComment("DataBoundIfNode: [No Condition Set]");
        this.baseElement.insertBefore(this.anchorNode, this.domElement);
        this.elementInDom = true;
        this.boundConditional = new DataBoundConditional(this.domElement.attributes, "data-bound-if-");
    }

    get isBound() {
        return this.propString.matches.length > 0;
    }

    renderWithContext(context, dataBoundContext, rootContext) {
        if (dataBoundContext) {
            dataBoundContext.element = this.domElement;
            dataBoundContext.boundElement = this.boundElement;
        } else {
            dataBoundContext = {
                element: this.domElement,
                boundElement: this.boundElement
            }
        }

        let value = this.propString.getValueWithContext(0, context, dataBoundContext, rootContext);
        if (value instanceof Function) {
            value = value(dataBoundContext);
        }

        let conditionValue = this.boundConditional.getValueWithContext(context, dataBoundContext, rootContext);
        this.anchorNode.data = "DataBoundIfNode: " +
            context.constructor.name + "." + this.propString.getPropName(0);

        if (this.boundConditional.conditionMethod(value, conditionValue)) {
            if (!this.elementInDom) {
                this.baseElement.insertBefore(this.domElement, this.anchorNode);
                this.elementInDom = true;
            }
        } else {
            if (this.elementInDom) {
                this.baseElement.removeChild(this.domElement);
                this.elementInDom = false;
            }
        }

        if (this.elementInDom) {
            this.boundElement.renderWithContext(context, dataBoundContext, rootContext, false, true, false);
        }
    }
}

class DataBoundElementArray {
    constructor(element) {
        DataBoundUtils.registerDBObject(this);
        this.domElement = element;
        this.propString = new DataBoundPropString(this.domElement.attributes["data-bound-array"].nodeValue);
        this.domElement.removeAttribute("data-bound-array");
        this.baseElement = this.domElement.parentElement;
        this.anchorNode = document.createComment("DataBoundElementArray: [No Context]");
        this.baseElement.insertBefore(this.anchorNode, this.domElement);
        this.baseElement.removeChild(this.domElement);
        this.elementArray = [];
    }

    get isBound() {
        return this.propString.matches.length > 0;
    }

    renderWithContext(context, dataBoundContext, rootContext) {
        let contextArray = this.propString.getValueWithContext(0, context, dataBoundContext, rootContext);
        if (!(contextArray instanceof Array)) {
            this.anchorNode.data = "DataBoundElementArray: [No Context]";
            if (contextArray) {
                throw "Cannot render a DataBoundElementArray with non-Array type.";
            } else {
                // null and undefined are allowed values, but still can't render, so just return
                return;
            }
        }

        this.anchorNode.data = "DataBoundElementArray: " +
            context.constructor.name + "." + this.propString.getPropName(0);

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
                    let boundElement = DataBoundUtils.bindElement(clone);
                    this.elementArray.push(boundElement);
                    this.baseElement.insertBefore(clone, this.anchorNode);
                }
            }
        }

        for (let i=0; i<this.elementArray.length; i++) {
            let child = this.elementArray[i];
            let childDataBoundContext = {
                dataBoundIndex: i,
                arrayContext: context,
                contextValue: contextArray[i],
                parent: dataBoundContext
            };
            child.renderWithContext(contextArray[i], childDataBoundContext, rootContext, false, true, false);
        }
    }
}