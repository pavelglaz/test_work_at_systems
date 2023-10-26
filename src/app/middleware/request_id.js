const {uuid} = require('uuidv4');

module.exports = (req, res, next) => {
    req.id = uuid();
    return next();
};
