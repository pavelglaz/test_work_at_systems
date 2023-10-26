module.exports = (...args) => {
    console.error(...args);

    return process.exit(1);
};
