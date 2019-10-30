class StdOutLoggerAdapter {
    constructor(options) {}
    log(level, message) {
        LOG(message);
    }
}

module.exports = StdOutLoggerAdapter;
