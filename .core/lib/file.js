import fs from 'fs-extra';
import path from 'node:path';
import { getArrayBuffer } from './utils/file-api.js';

class ActiniumFile extends Parse.File {
    constructor(name, data, type) {
        super(encodeURIComponent(name), data, type);
    }

    mediaURL() {
        return decodeURIComponent(
            String(this.url()).replace(
                `${ENV.PUBLIC_SERVER_URI}${ENV.PARSE_MOUNT}/files/${ENV.APP_ID}/`,
                '/media/',
            ),
        );
    }
}

/**
 * @api {Function} File.create(filePath,targetPath) File.create()
 * @apiVersion 3.1.2
 * @apiGroup Actinium
 * @apiName File.create
 * @apiDescription Create a new parse file from disk. Returns a Parse.File object that has been saved to storage.
 * @apiParam {String} filePath Full path to file.
 * @apiParam {String} [targetPath=''] the "directory" relative path prefix to add to the filename (url encoded). This is useful for
 * saving the file to a specific location in S3 or FSAdapter path.
 * @apiParam {String} [targetFileName] if provided, will be the filename of the stored file, otherwise the base filename of the source
 * file will be used.
 */
ActiniumFile.create = async (filePath, targetPath = '', targetFileName) => {
    if (fs.existsSync(filePath)) {
        const filename = path.basename(filePath);
        const target = [
            targetPath,
            targetFileName ? targetFileName : filename,
        ].join('/');

        const { result, mimetype } = await getArrayBuffer(filePath);
        const file = new ActiniumFile(
            target,
            { base64: result.toString('base64') },
            mimetype,
        );
        return file.save();
    }

    throw new Error(`${filePath} does not exist`);
};

export default ActiniumFile;
