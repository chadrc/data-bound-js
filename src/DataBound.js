
class DataBoundUtils {
    static extractPropFromString(propStr) {
        let regex = new RegExp(/ *\$\{ *[\w.]+ *} */);
        let match = propStr.match(regex);
        if (match && match.length > 0) {
            return match[0].trim().slice(2, -1).trim();
        }
        return null;
    }
}