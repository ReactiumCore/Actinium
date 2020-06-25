'use strict';

var _ParseFile = Parse.File;

var _ParseObject = Parse.Object;

var _ParseRelation = Parse.Relation;

function unsavedChildren(obj, allowDeepUnsaved) {
    const encountered = {
        objects: {},
        files: [],
    };

    const identifier = obj.className + ':' + obj._getId();

    encountered.objects[identifier] = obj.dirty() ? obj : true;
    const attributes = obj.attributes;

    for (const attr in attributes) {
        if (typeof attributes[attr] === 'object') {
            traverse(attributes[attr], encountered, false, !!allowDeepUnsaved);
        }
    }

    const unsaved = [];

    for (const id in encountered.objects) {
        if (id !== identifier && encountered.objects[id] !== true) {
            unsaved.push(encountered.objects[id]);
        }
    }

    return unsaved.concat(encountered.files);
}

function traverse(obj, encountered, shouldThrow, allowDeepUnsaved) {
    if (obj instanceof _ParseObject) {
        if (!obj.id && shouldThrow) {
            throw new Error('Cannot create a pointer to an unsaved Object.');
        }

        const identifier = obj.className + ':' + obj._getId();

        if (!encountered.objects[identifier]) {
            encountered.objects[identifier] = obj.dirty() ? obj : true;
            const attributes = obj.attributes;

            for (const attr in attributes) {
                if (typeof attributes[attr] === 'object') {
                    traverse(
                        attributes[attr],
                        encountered,
                        !allowDeepUnsaved,
                        allowDeepUnsaved,
                    );
                }
            }
        }

        return;
    }

    if (obj instanceof _ParseFile) {
        if (!obj.url() && encountered.files.indexOf(obj) < 0) {
            encountered.files.push(obj);
        }

        return;
    }

    if (obj instanceof _ParseRelation) {
        return;
    }

    if (Array.isArray(obj)) {
        obj.forEach(el => {
            if (typeof el === 'object') {
                traverse(el, encountered, shouldThrow, allowDeepUnsaved);
            }
        });
    }

    for (const k in obj) {
        if (typeof obj[k] === 'object') {
            traverse(obj[k], encountered, shouldThrow, allowDeepUnsaved);
        }
    }
}

module.exports = unsavedChildren;
