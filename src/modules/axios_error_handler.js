module.exports = (error) => {
    const {request, response, config} = error;
    if (!request && !response) {
        throw error;
    }

    const logRequest = {
        endpoint: config.url,
        data: JSON.parse(config.data),
        headers: config.headers,
    };

    if (typeof response != 'object' || typeof response.data != 'object') {
        throw error;
    }

    const logResponse = {
        status: response.status,
        data: response.data,
        headers: response.headers,
    };

    console.error('axios.error', error.code, error.message, 'request=', JSON.stringify(logRequest), 'response=', JSON.stringify(logResponse));
    return response;
};
