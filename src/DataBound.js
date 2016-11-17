
class DataBoundUtils {
    static extractPropFromString(propStr) {
        let match = propStr.match(DataBoundUtils.propStringRegex);
        if (match && match.length > 0) {
            return match[0].trim().slice(2, -1).trim();
        }
        return "";
    }
}

DataBoundUtils.propStringRegex = new RegExp(/\$\{ *~?[\w.]+\w *}/);