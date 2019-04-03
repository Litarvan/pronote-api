const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const request = require('../request');
const util = require('../util');

async function login({ username, password, url })
{
    console.log(`Logging in '${username}' for '${url}' using Toutatice CAS`);

    let jar = new jsdom.CookieJar();
    let dom = await getDOM({
        url: `https://www.toutatice.fr/casshib/shib/toutatice/login?service=${encodeURIComponent(url)}`,
        jar
    });

    let params = getParams(dom);
    params['_saml_idp'] = 'eleve-1';

    dom = await getDOM({
        url: 'https://www.toutatice.fr/wayf/Ctrl',
        jar,
        method: 'POST',
        data: params
    });

    params = getParams(dom);
    params['j_username'] = username;
    params['j_password'] = password;

    dom = await getDOM({
        url: 'https://www.toutatice.fr' + dom.window.document.getElementsByTagName('form')[0].action,
        jar,
        method: 'POST',
        data: params
    });

    dom = await getDOM({
        url: dom.window.document.getElementsByTagName('form')[0].action,
        jar,
        method: 'POST',
        data: getParams(dom),
        asIs: true
    });

    if (dom.indexOf('PRONOTE') === -1)
    {
        console.log(`Wrong IDs for '${username}'`);
        throw 'Mauvais Identifiants';
    }

    console.log(`Logged in '${username}'`);

    return util.extractStart(dom);
}

function getParams(dom)
{
    let params = {};

    Array.prototype.forEach.call(dom.window.document.querySelectorAll('input, button[type=submit]'), input => input.name !== '' ? params[input.name] = input.value : '');

    return params;
}

async function getDOM({ url, jar, method = 'GET', data = '', runScripts, hook = () => {}, followRedirects, asIs })
{
    let result = await request.http({
        url,
        method,
        data,
        jar,
        followRedirects
    });

    if (asIs)
    {
        return result;
    }

    return new JSDOM(result, {
        runScripts: runScripts ? 'dangerously' : 'outside-only',
        beforeParse(window) { hook(window) },
        cookieJar: jar
    });
}

module.exports = login;
