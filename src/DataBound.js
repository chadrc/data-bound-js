
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
        return null;
    }
}

DataBoundUtils.propStringRegex = new RegExp(/\$\{ *~?[\w.]+\w *}/);