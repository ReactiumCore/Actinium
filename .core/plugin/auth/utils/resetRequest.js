const slugify = require('slugify');
const hb = require('handlebars');
const moment = require('moment');
const uuid = require('uuid/v4');
const path = require('path');
const fs = require('fs');

const COLLECTION = Parse.User;

module.exports = async req => {
    const { master } = req;

    if (!master) {
        throw new Error('Permission denied');
        return;
    }

    const { email } = req.params;

    if (!email) {
        throw new Error('email is a required parameter');
        return;
    }

    // Get the user object
    let user = await new Parse.Query(COLLECTION)
        .equalTo('email', email)
        .first({ useMasterKey: true });

    if (!user) {
        throw new Error(`unable to find user with email address: ${email}`);
        return;
    }

    const token = uuid();

    // Set the token
    const TokenObj = await new Parse.Object('Token').save(
        {
            expireAt: moment()
                .add(15, 'minutes')
                .toDate(),
            value: token,
            user,
        },
        { useMasterKey: true },
    );

    // Email context
    const APPID = Actinium.Setting.get('app.name', 'Reactium Admin');
    const LOGO = Actinium.Setting.get(
        'app.logo',
        'https://cdn.reactium.io/reactium-logo.png',
    );
    const FROM = Actinium.Setting.get(
        'email.forgot.from',
        'no-reply@reactium.io',
    );
    const TEMPLATE_HTML = Actinium.Setting.get(
        'email.forgot.html',
        path.join(__dirname, 'template-request-html.hbs'),
    );
    const TEMPLATE_TEXT = Actinium.Setting.get(
        'email.forgot.text',
        path.join(__dirname, 'template-request-text.hbs'),
    );
    const SUBJECT = Actinium.Setting.get(
        'email.forgot.subject',
        `${APPID} Password Reset`,
    );

    const context = {
        APPID,
        logo: LOGO,
        subject: SUBJECT,
        host: req.headers.origin,
        email: slugify(`${email}`),
        token,
    };

    const options = {
        subject: SUBJECT,
        from: FROM,
        to: email,
    };

    const sources = {
        html: TEMPLATE_HTML,
        text: TEMPLATE_TEXT,
    };

    await Actinium.Hook.run('reset-request-context', context);

    for (const prop in sources) {
        const source = fs.readFileSync(sources[prop], 'utf8');
        const template = hb.compile(source);
        let content = template(context);

        await Actinium.Hook.run(`reset-request-email-${prop}`, content);

        options[prop] = content;
    }

    // Send email
    return Actinium.Mail.send(options);
};
