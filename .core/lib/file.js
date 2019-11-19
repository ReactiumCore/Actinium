module.exports = class ActiniumFile extends Parse.File {
    constructor(name, data, type) {
        super(encodeURIComponent(name), data, type);
    }
};
