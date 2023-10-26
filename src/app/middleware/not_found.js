const srcDir = require('app-root-path');
const response = require(`${srcDir}/modules/response`);

module.exports = (req, res) => {
    const result = response.create(response.STATUS_NF).setError(`Not found ${req.method} ${req.originalUrl}`);
    res.status(response.CODE_NF).send(result.obj());
};
