module.exports = (req, res, next) => {
    if (req.log_context) {
        return next();
    }

    req.log_context = [
        'request_id=', req.id,
        'method=', req.method,
        'endpoint=', req.originalUrl,
    ];

    let logInfo = ['api.call', ...req.log_context];

    if (req.body) {
        logInfo.push('request_data=', JSON.stringify(req.body));
    }

    if (req.meta) {
        logInfo.push('request_meta=', JSON.stringify(req.meta));
    }

    console.log(...logInfo);

    return next();
};
