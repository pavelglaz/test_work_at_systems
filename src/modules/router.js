const srcDir   = require('app-root-path');
const {Router} = require('express');
const fs       = require('fs');
const handler  = require(`${srcDir}/app/middleware/handler`);

const prepareArgs = (args) => {
    const endpointFun = args.pop();

    args.push(handler(endpointFun));

    return args;
};

const methods = [
    'all',
    'post',
    'get',
];

methods.forEach(method => {
    const prevFun = Router[method];

    if (!prevFun) {
        return true;
    }

    Router[method] = function (...args) {
        args = prepareArgs(args);
        prevFun.bind(this)(...args);
    };

    return true;
});

Router.useDir = function (path) {
    fs.readdirSync(path).forEach((endpoint) => {
        if (fs.lstatSync(`${path}/${endpoint}`).isDirectory()) {
            this.useDir(`${path}/${endpoint}`);
            return;
        }

        this.use(require(`${path}/${endpoint}`));
    });
};

module.exports = Router;
