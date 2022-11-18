const Enums = {
    cache: {
        dataLoading: 1000 * 90,
    },
    priority: {
        highest: -1000,
        high: -500,
        neutral: 0,
        low: 500,
        lowest: 1000,
    },
    weight: {
        highest: 1000,
        high: 500,
        neutral: 0,
        low: -500,
        lowest: -1000,
    },
    logLevels: {
        DEBUG: 1000,
        INFO: 500,
        BOOT: 0,
        WARN: -500,
        ERROR: -1000,
    },
    parseLogLevels: {
        DEBUG: 'verbose',
        INFO: 'info',
        BOOT: 'error',
        WARN: 'error',
        ERROR: 'error',
    },
};

export default Enums;
