const srcDir            = require('app-root-path');
const error_handler     = require(`${srcDir}/modules/error_handler`);
const app               = require(`${srcDir}/app`);

process.on('unhandledRejection', error => {
    error_handler('unhandled error in process:', error);
});

process.on('SIGTERM', function () {
    process.exit(0);
});

process.on('SIGNIN', function () {
    process.exit(0);
});

(async () => {
    try {
        await app.init();
    } catch (error) {
        error_handler(error);
    }
})();

