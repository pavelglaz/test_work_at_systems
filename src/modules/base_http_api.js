const srcDir = require('app-root-path');
const axios  = require('axios');
const polly  = require('polly-js');

const errorHandler = require(`${srcDir}/modules/axios_error_handler`);

const {URL}        = require('url');
const https        = require('https');

const TIMEOUT_IN_MILLISECONDS = 20000;

class BaseHttpApi {
    constructor(
      service_name,
      url,
      headers,
    ) {
        this.name          = service_name;
        this.url           = url;
        this.logContext    = [`${this.name}:`];
        this.timeout       = TIMEOUT_IN_MILLISECONDS;
        this.axios_options = {
            httpsAgent : new https.Agent({}),
        };
        this.headers       = headers;
    }

    async request(endpoint, method, data, options = {}) {
        let response = false;
        let err      = false;

        const headers = {
            ...this.headers,
            ...(options.headers) ? options.headers : {},
        };
        
        const timeout = options.timeout ? options.timeout : this.timeout;

        const logContext = [...this.logContext, 'endpoint=', endpoint, 'request=', JSON.stringify(data), 'options=', JSON.stringify(options)];

        const url = new URL(endpoint, `${this.url}`).href;

        try {
            response = await polly()
              .handle(error =>
                [
                    'ECONNREFUSED',
                    'ETIMEDOUT',
                    'ECONNABORTED',
                ]
                  .includes(error.code))
              .retry(options.retry || 0)
              .executeForPromise(async (info) => {
                  const source = axios.CancelToken.source();
                  setTimeout(() => {
                      source.cancel('Timeout');
                  }, timeout);

                  try {
                      const res = await axios({
                          method,
                          url,
                          data,
                          headers,
                          cancelToken : source.token,
                          timeout,
                          ...this.axios_options,
                          ...options.axios_options,
                      });

                      if (options.on_axios_response) {
                          return options.on_axios_response(res, info);
                      }

                      return res;
                  } catch (error) {
                      err = error;

                      if (axios.isCancel(error)) {
                          err      = new Error('Timeout');
                          err.code = 'ETIMEDOUT';
                      }

                      if (error.config && error.config.httpsAgent) {
                          delete error.config.httpsAgent;
                      }

                      throw err;
                  }
              });
        } catch (error) {
            err      = error;
            response = errorHandler(error);
        } finally {
            const logData = {
                request_id   : options.traceId,
                endpoint,
                method,
                request      : data,
                http_status  : response ? response.status : null,
                response     : response ? response.data : null,
                errorCode    : err ? err.code : null,
                errorMessage : err ? err.message : null,
            };
            console.log(this.name, JSON.stringify(logData));
        }
        console.log(...logContext, 'response=', JSON.stringify(response.data));

        return response.data;
    }
}

BaseHttpApi.METHODS = {
    POST : 'post',
    GET  : 'get',
};

module.exports = BaseHttpApi;
