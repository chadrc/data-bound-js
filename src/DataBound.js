
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

        for (let j=0; j<parts.length; j++) {
            let currentProp = parts[j];
            if (ctx != null && currentProp in ctx) {
                value = ctx[currentProp];
            } else {
                value = 'undefined';
                break;
            }

            if (value instanceof Function) {
                value = value();
            }
            ctx = value;
        }
        return value;
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

class DataBoundBooleanAttribute {
    constructor(node) {
        this.nodeOwner = node.ownerElement;
        this.attrName = node.nodeName;
        this.propString = new DataBoundPropString(node.nodeValue);
        node.nodeValue = '';
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