class StdOutLoggerAdapter {
    constructor(options) {}
    log(level, message) {
        BOOT(message);
    }
}

module.exports = StdOutLoggerAdapter;
