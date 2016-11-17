
class DataBoundUtils {
    static extractPropsFromString(propStr) {
        let match = propStr.match(DataBoundUtils.propStringRegex);
        if (match && match.length > 0) {
            let props = [];
            for (let i=0; i<match.length; i++) {
                props.push({match: match[i], prop: match[i].slice(2, -1).trim()})
            }
            return props;
        }
        return [];
    }
}

DataBoundUtils.propStringRegex = new RegExp(/\$\{ *~?[\w.]+\w *}/g);

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
            if (prop.startsWith("~")) {
                value = rootContext[prop.slice(1)];
            } else if (prop.startsWith(".")) {
                value = selfContext[prop.slice(1)];
            } else {
                value = context[prop];
            }
            renderStr = renderStr.replace(this.matches[i].match, value);
        }
        return renderStr;
    }
}