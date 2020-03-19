const op = require('object-path');
const { MasterOptions } = require(`${ACTINIUM_DIR}/lib/utils`);

module.exports = async (contentObj, typeObj, isNew) => {
    if (!Actinium.Plugin.isActive('Users')) return;

    const user = op.has(contentObj, 'user')
        ? await Actinium.User.retrieve({ objectId: contentObj.user.objectId })
        : false;

    if (!user) return;

    const { slug, status, title, updatedAt, objectId: contentID } = contentObj;
    const { collection, machineName, objectId: typeID, type } = typeObj;

    const metaObj = {
        action: isNew ? 'created' : 'updated',
        collection,
        contentID,
        machineName,
        slug,
        status,
        title,
        typeID,
        type,
        updatedAt,
        url: `/admin/content/${type}/${slug}`,
    };

    const key = ['content', typeID, contentID];
    const meta = { objectId: user.objectId, [key]: metaObj };

    Actinium.User.Meta.update(meta, MasterOptions());
};
