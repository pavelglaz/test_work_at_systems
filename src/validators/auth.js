const srcDir = require('app-root-path');

const {
    ERRORS,
    TYPES,
} = require(`${srcDir}/modules/consts`);

module.exports = {
    PHPSESSID: {
        presence: {
            message: ERRORS.MUST_NOT_BE_EMPTY,
        },
        type: {
            type: TYPES.STRING,
            message: ERRORS.MUST_BE_STRING,
        },
    },
};
