function getCallStack() {
    const oldPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const stack = new Error().stack;
    Error.prepareStackTrace = oldPrepareStackTrace;
    return stack;
}

function getCallerFile() {
    const stack = getCallStack();
    return stack[3] ? stack[3].getFileName() : undefined;
}

module.exports = {
    getCallStack,
    getCallerFile,
};
