const fs = require('fs');
const path = require('path');

const jsdom = require('jsdom');

const errors = require('../../errors');
const { getDOM, submitForm, extractStart } = require('../api');

// eslint-disable-next-line no-sync
const jsEncrypt = fs.readFileSync(path.join(__dirname, 'jsencrypt.min.js'));

async function login({ url, account, username, password, startURL, atenURL, postSubmit })
{
    if (!startURL.startsWith('http')) {
        if (startURL.startsWith('/')) {
            startURL = startURL.substring(1);
        }

        startURL = `https://${atenURL}/${startURL}`;
    }

    const jar = new jsdom.CookieJar();
    const dom = await getDOM({
        url: startURL,
        jar,
        runScripts: true,
        hook
    });

    await submit({ dom, jar, username, password, atenURL });

    if (postSubmit) {
        await postSubmit({ dom, jar });
    }

    return extractStart(await getDOM({
        url: url + account.value + '.html',
        jar,
        asIs: true
    }));
}

async function submit({ dom, jar, username, password, atenURL })
{
    dom.window.document.getElementById('user').value = username;
    dom.window.document.getElementById('password').value = password;

    dom.window.eval('creerCookie(document.getElementById(\'user\'), document.getElementById(\'password\'));');

    const result = await submitForm({
        dom,
        jar,
        actionRoot: `https://${atenURL}/login/`
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
    login,
    submit,
    hook
};
