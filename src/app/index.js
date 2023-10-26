require('dotenv').config();

const srcDir        = require('app-root-path');
const api           = require('express')();
const body_parser   = require('body-parser');
const cookie_parser = require('cookie-parser');

const router = require(`${srcDir}/modules/router`)();
const request_validator = require(`${srcDir}/app/middleware/request_validator`);
const not_found = require(`${srcDir}/app/middleware/not_found`);
const request_id = require(`${srcDir}/app/middleware/request_id`);
const request_logging = require(`${srcDir}/app/middleware/request_logging`);
const response_logging  = require(`${srcDir}/app/middleware/response_logging`);

class App {
    async init() {
        this.startServer();
    }

    startServer() {
        router.use(body_parser.json());
        router.use(cookie_parser());

        router.use(request_id);
        router.use(request_logging);
        router.use(request_validator);
        
        router.useDir(`${srcDir}/app/endpoints`);

        router.use(not_found);
        router.use(response_logging);

        api.use("/", router);

        const server = api.listen(process.env.PORT, () => console.log(`API started on port ${process.env.PORT} 👍`));
        server.keepAliveTimeout = 61 * 1000;
        server.headersTimeout = 65 * 1000;
    }
}

module.exports = new App();