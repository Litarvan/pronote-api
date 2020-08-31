/* eslint camelcase: off */

const jsdom = require('jsdom');

const { getDOM, getParams, submitForm, extractStart } = require('./api');

async function login(url, account, username, password)
{
    const jar = new jsdom.CookieJar();
    let dom = await getDOM({
        url: `https://www.toutatice.fr/casshib/shib/toutatice/login?service=${encodeURIComponent(url)}`,
        jar
    });

    let params = getParams(dom);
    params._saml_idp = 'eleve-1';

    dom = await getDOM({
        url: 'https://www.toutatice.fr/wayf/Ctrl',
        jar,
        method: 'POST',
        data: params
    });

    params = getParams(dom);
    params.j_username = username;
    params.j_password = password;

    dom = await getDOM({
        url: 'https://www.toutatice.fr' + dom.window.document.getElementsByTagName('form')[0].action,
        jar,
        method: 'POST',
        data: params
    });

    dom = await submitForm({
        dom,
        jar,
        asIs: true
    });

    return extractStart(username, dom);
}

module.exports = login;
