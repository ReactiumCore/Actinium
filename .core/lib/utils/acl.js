const op = require('object-path');
const _ = require('underscore');
const { AclTargets } = require('./');

const getACL = async (perms = [], readCap, writeCap, groupACL) => {
    if (!groupACL || !(groupACL instanceof Parse.ACL)) {
        groupACL = new Parse.ACL(groupACL);
    }

    if (perms.length < 1) return groupACL;

    const aclTargets = await AclTargets({
        master: true,
        params: { fresh: true },
    });

    const allRoles = _.indexBy(aclTargets.roles, 'name');

    let readRoles = [];
    if (readCap) {
        readRoles = _.compact(
            Actinium.Capability.roles(readCap).map(name =>
                op.get(allRoles, name),
            ),
        );
    }

    let writeRoles = [];
    if (writeCap) {
        writeRoles = _.compact(
            Actinium.Capability.roles(writeCap).map(name =>
                op.get(allRoles, name),
            ),
        );
    }

    const permission = _.groupBy(perms, 'permission');
    const writePerms = _.groupBy(op.get(permission, 'write', []), 'type');
    const readPerms = _.groupBy(op.get(permission, 'read', []), 'type');

    // public read
    op.get(readPerms, 'public', []).forEach(publicAccess => {
        const allowed = op.has(publicAccess, 'allow')
            ? !!publicAccess.allow
            : true;
        groupACL.setPublicReadAccess(allowed);
    });

    // role read
    op.get(readPerms, 'role', [])
        .concat(readRoles)
        .forEach(roleObj => {
            if (op.has(roleObj, 'name')) {
                const allowed = op.has(roleObj, 'allow')
                    ? !!roleObj.allow
                    : true;
                const role = roleObj.name;
                if (role === 'anonymous') groupACL.setPublicReadAccess(allowed);
                else groupACL.setRoleReadAccess(role, allowed);
            }
        });

    // user read
    op.get(readPerms, 'user', []).forEach(userObj => {
        if (op.has(userObj, 'objectId')) {
            const allowed = op.has(userObj, 'allow') ? !!userObj.allow : true;
            groupACL.setReadAccess(userObj.objectId, allowed);
        }
    });

    // public write
    op.get(readPerms, 'public', []).forEach(publicAccess => {
        const allowed = op.has(publicAccess, 'allow')
            ? !!publicAccess.allow
            : true;
        groupACL.setPublicWriteAccess(allowed);
    });

    // role write
    op.get(writePerms, 'role', [])
        .concat(writeRoles)
        .forEach(roleObj => {
            if (op.has(roleObj, 'name')) {
                const allowed = op.has(roleObj, 'allow')
                    ? !!roleObj.allow
                    : true;
                const role = roleObj.name;

                if (role === 'anonymous')
                    groupACL.setPublicWriteAccess(allowed);
                else groupACL.setRoleWriteAccess(role, allowed);
            }
        });

    // user write
    op.get(writePerms, 'user', []).forEach(userObj => {
        if (op.has(userObj, 'objectId')) {
            const allowed = op.has(userObj, 'allow') ? !!userObj.allow : true;
            groupACL.setWriteAccess(userObj.objectId, allowed);
        }
    });

    return groupACL;
};

module.exports = getACL;
