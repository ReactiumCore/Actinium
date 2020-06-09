const op = require('object-path');
const _ = require('underscore');
const PLUGIN_SCHEMA = require('./schema');
const CLIENT = op.get(PLUGIN_SCHEMA, 'SyndicateClient.collection');
const SYNDICATE = op.get(PLUGIN_SCHEMA, 'Syndicate.collection');
const Enums = require('./enums');
const jwt = require('jsonwebtoken');

const getSecrets = () => {
    const DEFAULT_ACCESS_SECRET = op.get(Enums, 'DEFAULT_ACCESS_SECRET');
    const ACCESS_SECRET = op.get(ENV, 'ACCESS_SECRET', DEFAULT_ACCESS_SECRET);
    const DEFAULT_REFRESH_SECRET = op.get(Enums, 'DEFAULT_REFRESH_SECRET');
    const REFRESH_SECRET = op.get(
        ENV,
        'REFRESH_SECRET',
        DEFAULT_REFRESH_SECRET,
    );

    return {
        ACCESS_SECRET,
        REFRESH_SECRET,
    };
};

const Client = {};

Client.create = async (req, options) => {
    const { params } = req;
    if (!Actinium.Utils.CloudHasCapabilities(req, ['SyndicateClient.create']))
        throw new Error('Permission denied creating new syndication client.');

    const user = await Actinium.Utils.UserFromSession(options);
    if (!user) throw new Error('User required to create syndication client.');

    const client = op.get(params, 'client');
    if (!client)
        throw new Error('Client label required to create syndication client.');

    const username = user.get('username');

    const { REFRESH_SECRET } = getSecrets();
    const refreshToken = jwt.sign(
        {
            username,
            client,
        },
        REFRESH_SECRET,
    );

    const syndClient = new Parse.Object(CLIENT);
    syndClient.set('user', user);
    syndClient.set('client', client);
    syndClient.set('token', refreshToken);
    await syndClient.save(null, options);

    return Actinium.Utils.serialize(syndClient);
};

Client.retrieve = async (req, options) => {
    const { params } = req;
    const id = op.get(params, 'objectId');

    if (!id) throw new Error('objectId required.');
    const syndClient = new Parse.Object(CLIENT);
    syndClient.id = id;
    await syndClient.fetch(options);

    return Actinium.Utils.serialize(syndClient);
};

Client.delete = async (req, options) => {
    const { params } = req;
    const id = op.get(params, 'objectId');

    if (!id) throw new Error('objectId required.');
    const syndClient = new Parse.Object(CLIENT);
    syndClient.id = id;
    return syndClient.destroy(options);
};
Client.destroy = Client.delete;

Client.token = async req => {
    const options = Actinium.Utils.MasterOptions();
    const { params } = req;
    const { token } = params;

    if (!token) throw new Error('Missing refresh token.');

    // verify refresh token
    const { REFRESH_SECRET, ACCESS_SECRET } = getSecrets();
    const payload = await new Promise((resolve, reject) => {
        jwt.verify(token, REFRESH_SECRET, (err, payload) => {
            if (err) reject('Refresh token invalid');
            resolve(payload);
        });
    });

    const clientQuery = new Parse.Query(CLIENT);
    clientQuery.equalTo('token', token);
    clientQuery.equalTo('client', payload.client);
    const client = await clientQuery.find(options);

    if (!client) throw new Error('Client not found.');

    // Generate Access Token
    const accessToken = jwt.sign(
        { username: payload.username, client: payload.client },
        ACCESS_SECRET,
        {
            expiresIn: Enums.token_expiration,
        },
    );

    return { token: accessToken };
};

Client.verify = async req => {
    const { params } = req;
    const { token } = params;

    if (!token) throw new Error('Missing access token.');

    const { ACCESS_SECRET } = getSecrets();
    const payload = await new Promise(resolve => {
        jwt.verify(token, ACCESS_SECRET, (err, payload) => {
            if (err) resolve(false);
            resolve(payload);
        });
    });

    return payload;
};

Client.list = async (req, options) => {
    const { params } = req;
    if (!Actinium.Utils.CloudHasCapabilities(req, ['SyndicateClient.retrieve']))
        throw new Error('Permission denied retrieving syndication clients.');

    return Actinium.Utils.hookedQuery(
        params,
        options,
        CLIENT,
        'syndicate-client-query',
        'syndicate-client-list',
    );
};

const Content = {};

const Syndicate = {
    Client,
    Content,
};

module.exports = Syndicate;
