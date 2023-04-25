class StdOutLoggerAdapter {
    constructor(options) {}
    log(level, message) {
        BOOT(message);
    }
}

export default StdOutLoggerAdapter;
