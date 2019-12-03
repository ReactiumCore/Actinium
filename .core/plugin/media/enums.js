module.exports = {
    COLLECTION: {
        DIRECTORY: 'MediaDirectory',
        MEDIA: 'Media',
        UPLOAD: 'MediaUpload',
    },
    ERRORS: {
        DIRECTORY: 'directory is a required parameter.',
        DUPLICATE_DIRECTORY: 'directory already exists',
        FILE: 'filename is a required parameter',
        FILE_DELETE: 'Unable to delete file',
        PERMISSION: 'Permission denied',
    },
    STATUS: {
        COMPLETE: 'complete',
        QUEUED: 'queued',
        UPLOADING: 'uploading',
    },
};
