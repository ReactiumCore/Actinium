const { File, FileReader } = require('file-api');
const getFileAs = (filePath, type = 'readAsDataURL', encoding) => {
    const file = new File(filePath);
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = () => {
            reader.abort();
            reject();
        };

        reader.onload = () =>
            resolve({
                mimetype: file.type,
                result: reader.result,
            });

        reader[type](file, encoding);
    });
};

const getDataURL = filePath => getFileAs(filePath);
const getArrayBuffer = filePath => getFileAs(filePath, 'readAsArrayBuffer');
const getBinaryString = filePath => getFileAs(filePath, 'readAsBinaryString');
const getText = (filePath, encoding) =>
    getFileAs(filePath, 'readAsBinaryString', encoding);

module.exports = {
    getDataURL,
    getArrayBuffer,
    getBinaryString,
    getText,
};
