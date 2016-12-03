
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

            // if (value instanceof Function) {
            //     value = value();
            // }
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
    }

    renderWithContext(context, dataBoundContext, rootContext) {
        if (this.propString.matches.length > 0) {
            let contextValue = this.propString.getValueWithContext(0, context, dataBoundContext, rootContext);
            if (contextValue) {
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