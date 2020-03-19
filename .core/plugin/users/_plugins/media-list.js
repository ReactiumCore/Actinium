const op = require('object-path');
const { MasterOptions, serialize } = require(`${ACTINIUM_DIR}/lib/utils`);

module.exports = async req => {
    if (!Actinium.Plugin.isActive('Users')) return;
    const mediaObj = serialize(req.object);
    const {
        file,
        filename,
        objectId,
        thumbnail,
        type,
        updatedAt,
        url,
        user,
    } = mediaObj;
    if (!user) return;

    const metaObj = {
        file,
        filename,
        thumbnail,
        type,
        updatedAt,
        url,
    };

    const key = ['media', objectId];
    const meta = { objectId: user.objectId, [key]: metaObj };

    Actinium.User.Meta.update(meta, MasterOptions());
};
