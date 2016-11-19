
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

    renderWithContext(context, selfContext, rootContext) {
        let renderStr = this.originalStr;
        for (let i=0; i<this.matches.length; i++) {
            let value;
            let prop = this.matches[i].prop;
            let parts = prop.split('.');
            let ctx;
            if (this.matches[i].rootRef) {
                ctx = rootContext;
            } else if (this.matches[i].selfRef) {
                ctx = selfContext;
            } else {
                ctx = context;
            }

            for (let j=0; j<parts.length; j++) {
                let currentProp = parts[j];
                value = ctx[currentProp];
                if (value instanceof Function) {
                    value = value();
                }
                ctx = value;
            }
            renderStr = renderStr.replace(this.matches[i].match, value);
        }
        return renderStr;
    }
}