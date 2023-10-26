const srcDir = require('app-root-path');

const BaseHttpApi             = require(`${srcDir}/modules/base_http_api`);

const service_name = 'trending.bid';
const url          = process.env.TRENDING || 'https://trending.bid';
const headers      = {
    'Content-Type' : 'application/json',
};

class TrendingApi extends BaseHttpApi {
    get_profile(data, options) {
        return this.request(`api/user/getprofile`, BaseHttpApi.METHODS.GET, data, {...options, retry : 1});
    }
}

module.exports = new TrendingApi(service_name, url, headers);
