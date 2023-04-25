import slugify from 'slugify';

export default (name) => {
    if (!name) return '';
    return slugify(name, {
        replacement: '_', // replace spaces with replacement
        remove: /[^A-Za-z0-9_\s]/g, // regex to remove characters
        lower: true, // result in lower case
    });
};
