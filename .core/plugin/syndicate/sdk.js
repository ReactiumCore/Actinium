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

/**
 * @apiDefine Syndicate_Client_create
 * @apiDescription Create a content syndication client record, which includes a refresh token for issuing
 * new access tokens.
 * @apiParam {Object} request The request containing params and sessionToken.
 * @apiParam {Object} options Parse options for creating the client.
 * @apiParam (params) {String} client name of the client accessing the API.
 * @apiParam (params) {ParseUser} [user] Used if no sessionToken provided.
 * @apiExample SDK
Actinium.Client.create({
    sessionToken,
    params: {
        client: 'My syndication client',
    },
}, Actinium.Utils.MasterOptions())
.then(({ token: refreshToken, objectId: clientId }) => {
    // later use refreshToken to issue accessToken
})
* @apiExample Cloud
Actinium.Cloud.run('syndicate-client-create', {
  client: 'My Syndicate client'
}).then(({ token: refreshToken, objectId: clientId }) => {
   // later use refreshToken to issue accessToken
})
 */
/**
 * @apiUse Syndicate_Client_create
 * @api {Asynchronous} Syndicate.Client.create(req,options) Syndicate.Client.create()
 * @apiName Syndicate.Client.create
 * @apiGroup Actinium
 */
Client.create = async (req, options) => {
    options = options || Actinium.Utils.CloudRunOptions(req);

    const { params } = req;
    if (!Actinium.Utils.CloudHasCapabilities(req, ['SyndicateClient.create']))
        throw new Error('Permission denied creating new syndication client.');

    let user = await Actinium.Utils.UserFromSession(options);
    user = user ? user : op.get(params, 'user', {});

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

/**
 * @apiDefine Syndicate_Client_retrieve
 * @apiDescription Retrieve one syndication client record by objectId
 * @apiParam (params) objectId the id of the client
 */
/**
 * @apiUse Syndicate_Client_retrieve
 * @api {Asynchronous} Syndicate.Client.retrieve(req,options) Syndicate.Client.retrieve()
 * @apiName Syndicate.Client.retrieve
 * @apiGroup Actinium
 */
Client.retrieve = async (req, options) => {
    options = options || Actinium.Utils.CloudRunOptions(req);

    const { params } = req;
    const id = op.get(params, 'objectId');

    if (!id) throw new Error('objectId required.');
    const syndClient = new Parse.Object(CLIENT);
    syndClient.id = id;
    await syndClient.fetch(options);

    return Actinium.Utils.serialize(syndClient);
};

/**
 * @apiDefine Syndicate_Client_delete
 * @apiDescription Delete one syndication client record by objectId
 * @apiParam (params) objectId the id of the client
 */
/**
 * @apiUse Syndicate_Client_delete
 * @api {Asynchronous} Syndicate.Client.delete(req,options) Syndicate.Client.delete()
 * @apiName Syndicate.Client.delete
 * @apiGroup Actinium
 */
Client.delete = async (req, options) => {
    options = options || Actinium.Utils.CloudRunOptions(req);
    const { params } = req;
    const id = op.get(params, 'objectId');

    if (!id) throw new Error('objectId required.');
    const syndClient = new Parse.Object(CLIENT);
    syndClient.id = id;
    return syndClient.destroy(options);
};
Client.destroy = Client.delete;

/**
 * @apiDefine Syndicate_Client_token
 * @apiDescription Retrieve a new access token for a client, for use with other syndication REST calls.
 * @apiParam {Object} request The request containing request params.
 * @apiParam (params) {String} token the refresh token associate with the client.
 * @apiExample SDK
Actinium.Client.token({
    params: {
        // Secret refresh token
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpkaWxsaWNrIiwiY2xpZW50IjoiYXBpIHRlc3QiLCJpYXQiOjE1OTE3MTUzMjJ9.pdttR2PPmDzDg6zzy5TEHcp2rkuYgNiqaZjahBITv4Y',
    },
})
.then(({ token: accessToken }) => {
    // access token is used for remote api call, and will expire
})
* @apiExample POST /functions/syndicate-client-token
{
    "_ApplicationId": "Actinium",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpkaWxsaWNrIiwiY2xpZW50IjoiYXBpIHRlc3QiLCJpYXQiOjE1OTE3MTUzMjJ9.pdttR2PPmDzDg6zzy5TEHcp2rkuYgNiqaZjahBITv4Y"
}
 */
/**
 * @apiUse Syndicate_Client_token
 * @api {Asynchronous} Syndicate.Client.token(req) Syndicate.Client.token()
 * @apiName Syndicate.Client.token
 * @apiGroup Actinium
 */
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

/**
 * @apiDefine Syndicate_Client_verify
 * @apiDescription Verify an access token (See if it is expired)
 * @apiParam {Object} request The request containing request params.
 * @apiParam (params) {String} token the API access token from syndicate-client-token
 * @apiExample SDK
// from previous token() call
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpkaWxsaWNrIiwiY2xpZW50IjoiYXBpIHRlc3QiLCJpYXQiOjE1OTE3MTgyODMsImV4cCI6MTU5MTcxODM0M30.R1ASB71ab-TwZVi9OuB6ovOcTsC5SOpJ4UqPUzvcnKs';
Actinium.Client.verify({
    params: {
        // Possibly expired access token
        token: accessToken
    },
})
.then((payload = false) => {
    // if not valid, fetch a new one from refreshToken (created with client)
    if (!payload) return Actinium.Client.token({ params: { token: refreshToken } }).then(({token}) => token);
    return accessToken;
})
.then(accessToken => {
    // use accessToken
})
* @apiExample POST /functions/syndicate-client-verify
{
    "_ApplicationId": "Actinium",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpkaWxsaWNrIiwiY2xpZW50IjoiYXBpIHRlc3QiLCJpYXQiOjE1OTE3MTgyODMsImV4cCI6MTU5MTcxODM0M30.R1ASB71ab-TwZVi9OuB6ovOcTsC5SOpJ4UqPUzvcnKs"
}
 */
/**
 * @apiUse Syndicate_Client_verify
 * @api {Asynchronous} Syndicate.Client.token(req) Syndicate.Client.token()
 * @apiName Syndicate.Client.token
 * @apiGroup Actinium
 */
Client.verify = async req => {
    // bypass token check
    if (Actinium.Utils.CloudHasCapabilities(req, ['Syndicate.Client']))
        return true;

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

/**
 * @apiDefine Syndicate_Client_list
 * @apiDescription List syndication clients
 */
/**
 * @apiUse Syndicate_Client_list
 * @apiUse HookedQuery
 * @api {Asynchronous} Syndicate.Client.list(req,options) Syndicate.Client.list()
 * @apiName Syndicate.Client.list
 * @apiGroup Actinium
 */
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

/**
 * @apiDefine Syndicate_Content_types
 * @apiDescription Get list of syndicated types
 */
/**
 * @apiUse Syndicate_Content_types
 * @api {Asynchronous} Syndicate.Content.types(req,options) Syndicate.Content.types()
 * @apiName Syndicate.Content.types
 * @apiGroup Actinium
 */
Content.types = async req => {
    const token = await Client.verify(req);
    if (!token) throw new Error('Permission denied.');

    const options = Actinium.Utils.MasterOptions();
    const synTypes = await Actinium.Setting.get('Syndicate.types', []);
    const { types } = await Actinium.Type.list({}, options);
    return types.filter(type => op.get(synTypes, type.machineName));
};

/**
 * @apiDefine Syndicate_Content_list
 * @apiDescription Get list of syndicated list
 */
/**
 * @apiUse Syndicate_Content_list
 * @api {Asynchronous} Syndicate.Content.list(req,options) Syndicate.Content.list()
 * @apiName Syndicate.Content.list
 * @apiGroup Actinium
 */
Content.list = async req => {
    const token = await Client.verify(req);
    if (!token) throw new Error('Permission denied.');

    const masterOptions = Actinium.Utils.MasterOptions();
    return Actinium.Content.list(req.params, masterOptions);
};

/**
 * @apiDefine Syndicate_Content_media_directories
 * @apiDescription Get list of media directories
 */
/**
 * @apiUse Syndicate_Content_media_directories
 * @api {Asynchronous} Syndicate.Content.mediaDirectories(req,options) Syndicate.Content.mediaDirectories()
 * @apiName Syndicate.Content.mediaDirectories
 * @apiGroup Actinium
 */
Content.mediaDirectories = async req => {
    const token = await Client.verify(req);
    if (!token) throw new Error('Permission denied.');

    const masterOptions = Actinium.Utils.MasterOptions();
    return Actinium.Utils.hookedQuery(
        req.params,
        masterOptions,
        'MediaDirectory',
        'syndicate-media-directories-query',
        'syndicate-media-directories-output',
    );
};

/**
 * @apiDefine Syndicate_Content_media
 * @apiDescription Get syndicated list of media
 */
/**
 * @apiUse Syndicate_Content_media
 * @api {Asynchronous} Syndicate.Content.media(req,options) Syndicate.Content.media()
 * @apiName Syndicate.Content.media
 * @apiGroup Actinium
 */
Content.media = async req => {
    const token = await Client.verify(req);
    if (!token) throw new Error('Permission denied.');

    const masterOptions = Actinium.Utils.MasterOptions();
    return Actinium.Utils.hookedQuery(
        req.params,
        masterOptions,
        'Media',
        'syndicate-media-query',
        'syndicate-media-output',
    );
};

const Syndicate = {
    Client,
    Content,
};

module.exports = Syndicate;
