
class DataBoundUtils {
    static extractPropFromString(propStr) {
        let match = propStr.match(DataBoundUtils.propStringRegex);
        if (match && match.length > 0) {
            return {match: match[0], prop: match[0].slice(2, -1).trim()};
        }
        return null;
    }
}

DataBoundUtils.propStringRegex = new RegExp(/\$\{ *~?[\w.]+\w *}/);