const fs = require('fs');
const path = require('path');

const errors = require('../errors');
const { submitForm } = require('./api');

// eslint-disable-next-line no-sync
const jsEncrypt = fs.readFileSync(path.join(__dirname, 'jsencrypt.min.js'));

async function submit({ dom, jar, username, password, atenURL })
{
    dom.window.document.getElementById('user').value = username;
    dom.window.document.getElementById('password').value = password;

    dom.window.eval('creerCookie(document.getElementById(\'user\'), document.getElementById(\'password\'));');

    const result = await submitForm({
        dom,
        jar,
        actionRoot: atenURL
    });

    if (result.window.document.getElementById('aten-auth')) {
        throw errors.WRONG_CREDENTIALS.drop();
    }

    return submitForm({
        dom: result,
        jar,
        asIs: true
    });
}

function hook(window)
{
    window.eval(jsEncrypt + '; window.JSEncrypt = JSEncrypt;');
}

module.exports = {
    submit,
    hook
};
