const srcDir   = require('app-root-path');
const Response = require(`${srcDir}/modules/response`);

module.exports = (endpointFun) => {
    return async (req, res, next) => {
        try {
            return await endpointFun(req, res, next);
        } catch (error) {
            console.error(error);

            return next(Response.create(Response.STATUS_SE));
        }
    };
};

