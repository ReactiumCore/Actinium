const op = require('object-path');
const SyndicateClient = {};
const axios = require('axios');

SyndicateClient.settings = async () => {
    const SyndicateClient = await Actinium.Setting.get('SyndicateClient');
    return {
        appId: op.get(SyndicateClient, 'appId'),
        host: op.get(SyndicateClient, 'host'),
        token: op.get(SyndicateClient, 'token'),
        cron: op.get(SyndicateClient, 'cron', '*/30 * * * *'),
        enabled: op.get(SyndicateClient, 'enabled', false),
    };
};

SyndicateClient.test = async req => {
    if (
        !Actinium.Utils.CloudHasCapabilities(req, [
            'setting.SyndicateClient-get',
        ])
    )
        throw new Error('Permission Denied');

    const {
        appId: _ApplicationId,
        host,
        token,
    } = await Actinium.SyndicateClient.settings();

    // get access token
    try {
        const response = await axios.post(
            `${host}/functions/syndicate-client-token`,
            {
                _ApplicationId,
                token,
            },
        );

        return !!op.get(response, 'data.result.token');
    } catch (error) {
        return false;
    }
};

module.exports = SyndicateClient;
