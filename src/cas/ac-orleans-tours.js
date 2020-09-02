const jsdom = require('jsdom');

const errors = require('../errors');
const { getDOM, submitForm, extractStart } = require('./api');

async function login(url, account, username, password)
{
    const jar = new jsdom.CookieJar();
    let dom = await getDOM({
        url: 'https://lycees.netocentre.fr/portail/f/welcome/normal/render.uP',
        jar
    });

    dom = await getDOM({
        url: dom.window.document.getElementById('portalCASLoginLink').href + '&idpId=parentEleveEN-IdP',
        jar
    });

    dom.window.document.getElementById('username').value = username;
    dom.window.document.getElementById('password').value = password;

    dom = await submitForm({
        dom,
        jar,
        actionRoot: 'https://educonnect.education.gouv.fr/',
        extraParams: {
            '_eventId_proceed': ''
        }
    });

    if (!dom.window.document.querySelector('input[name=SAMLResponse]')) {
        throw errors.WRONG_CREDENTIALS.drop();
    }

    await submitForm({
        dom,
        jar
    });

    return extractStart(await getDOM({
        url: url + account.value + '.html',
        jar,
        asIs: true
    }));
}

module.exports = login;
