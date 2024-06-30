const { errorsCodes } = require("../../utils/codes");


function errorTypeSelector(pattern) {
    const patterns = pattern["details"][0]["type"].split(".");

    if (patterns.includes("string") && patterns.includes("base")) {
        return errorsCodes.JSON_INVALID_DATA_TYPE;
    } else {
        return errorsCodes.JSON_MISSING_PARAMETERS;
    }
}

module.exports = { errorTypeSelector }
