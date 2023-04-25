import FileAPI from 'file-api';

const { File, FileReader } = FileAPI;

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

export const getDataURL = (filePath) => getFileAs(filePath);
export const getArrayBuffer = (filePath) =>
    getFileAs(filePath, 'readAsArrayBuffer');
export const getBinaryString = (filePath) =>
    getFileAs(filePath, 'readAsBinaryString');
export const getText = (filePath, encoding) =>
    getFileAs(filePath, 'readAsBinaryString', encoding);
