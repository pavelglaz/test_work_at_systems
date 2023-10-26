const redis = require('async-redis');

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    retry_strategy: function (options) {
        console.error(`Redis reconnecting to [${process.env.REDIS_HOST}:${process.env.REDIS_PORT}] | attempts ${options.attempt
        } | total retry time ${options.total_retry_time} | error: ${options.error}`);
        return options.attempt < 10 ? Math.min(options.attempt * 777, 5000) : undefined;
    }
})

client.on("connect", function () {
    console.log(`Redis connection on [${process.env.REDIS_HOST}:${process.env.REDIS_PORT}] established`);
});

client.on("end", function () {
    console.log(`Redis connection on [${process.env.REDIS_HOST}:${process.env.REDIS_PORT}] closed`);
});

module.exports = client;
