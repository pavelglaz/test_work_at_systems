const fs     = require('fs');
const path   = require('path');
const srcDir = require('app-root-path');

const validator = require(`${srcDir}/modules/validator`);
const response  = require(`${srcDir}/modules/response`);
const {
    STATUS_BR,
    ERROR_MSG_BR,
    STATUS_SE,
    ERROR_MSG_SE,
    TYPE_BAD_REQUEST,
} = response;

const validatorsDir = `${srcDir}/validators`;

module.exports = async (req, res, next) => {
    let logContext = [
        'Request validator:',
        'request_id=',
        req.id,
    ];

    try {
        if (!req.validatorSchema) {
            const filePath = path.join(validatorsDir, `/${req.url}.js`);

            if (!fs.existsSync(filePath)) {
                console.debug(...logContext, `path: "${filePath}" file not found`);
                return next();
            }

            req.validatorSchema = require(filePath);
        }

        let errorsDistinct = [];

        try {
            await validator.async(req.body, req.validatorSchema);
        } catch (errors) {
            errorsDistinct = Object.keys(errors).map(reason => ({reason, message : errors[reason][0]}));
        }

        if (errorsDistinct.length <= 0) {
            return next();
        }

        const result = response.create(STATUS_BR).setError(ERROR_MSG_BR, {violations: errorsDistinct}, TYPE_BAD_REQUEST);
        
        res.status(response.CODE_BR).send(result.obj());
    } catch (error) {
        console.error(...logContext, error);

        const result = response.create(STATUS_SE).setError(ERROR_MSG_SE);

        res.status(response.CODE_BR).send(result.obj());
    }
};
