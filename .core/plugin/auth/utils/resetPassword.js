const slugify = require('slugify');
const op = require('object-path');
const hb = require('handlebars');
const moment = require('moment');
const uuid = require('uuid/v4');
const path = require('path');
const fs = require('fs');

module.exports = async req => {
    const { token, password } = req.params;

    // Get the user from the token if the token is less than 15 minutes old.
    const rec = await new Parse.Query('Token')
        .equalTo('value', token)
        .include('user')
        .greaterThanOrEqualTo(
            'expireAt',
            new Date()
        )
        .first({ useMasterKey: true });

    if (!rec) {
        throw new Error('Invalid password reset token');
        return;
    }

    // Update the password
    const user = rec.get('user');
    user.setPassword(password);
    await user.save(null, { useMasterKey: true });

    // Send email about the change
    const { email, objectId, username } = user.toJSON();

    // Email context
    const SETTINGS = {
        app: Actinium.Setting.get('app', {}),
        email: Actinium.Setting.get('email', {}),
    };

    const APPID = op.get(SETTINGS, 'app.name', 'Reactium Admin');
    const LOGO = op.get(
        SETTINGS,
        'app.logo',
        'https://cdn.reactium.io/reactium-logo.png',
    );
    const FROM = op.get(SETTINGS, 'email.forgot.from', 'no-reply@reactium.io');
    const TEMPLATE_HTML = op.get(
        SETTINGS,
        'email.reset.html',
        path.join(__dirname, 'template-reset-html.hbs'),
    );
    const TEMPLATE_TEXT = op.get(
        SETTINGS,
        'email.reset.text',
        path.join(__dirname, 'template-reset-text.hbs'),
    );
    const SUBJECT = op.get(
        SETTINGS,
        'email.forgot.subject',
        `${APPID} Password Reset`,
    );

    const context = {
        APPID,
        logo: LOGO,
        subject: SUBJECT,
        host: req.headers.origin,
        email: slugify(`${email}`),
        username,
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

    await Actinium.Hook.run('reset-context', context);

    for (const prop in sources) {
        const source = fs.readFileSync(sources[prop], 'utf8');
        const template = hb.compile(source);
        let content = template(context);

        await Actinium.Hook.run(`reset-email-${prop}`, content);

        options[prop] = content;
    }

    // Send email
    await Actinium.Mail.send(options);

    // Delete the token
    await rec.destroy({ useMasterKey: true });

    return Promise.resolve({ username, email, objectId });
};
