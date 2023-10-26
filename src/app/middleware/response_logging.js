module.exports = (response, req, res, next) => {
    let logInfo = ['api.response', ...req.log_context, 'response_code=', response.code];

    if (response.code && response.code !== 200) {
        logInfo.push('response=', JSON.stringify(response.obj()));  
    }

    return next();
};
