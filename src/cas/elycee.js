const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const request = require('../request');
const util = require('../util');

async function login({ username, password, url }, { name, idp })
{
    console.log(`Logging in '${username}' for '${url}' using ELycee CAS (to ${name})`);

    let jar = new jsdom.CookieJar();
    let dom = await getDOM({
        url: `https://cas.elycee.rhonealpes.fr/login?service=${encodeURIComponent(url)}`,
        jar
    });

    let params = getParams(dom);
    params['selection'] = idp;

    dom = await submitForm({
        dom: await getDOM({
            url: `https://cas.elycee.rhonealpes.fr/login`,
            jar,
            data: params
        }),
        jar
    });

    params = getParams(dom);
    params['username'] = username;
    params['password'] = password;

    dom = await getDOM({
        url: 'https://cas.elycee.rhonealpes.fr/login',
        method: 'POST',
        jar,
        data: params,
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

function submitForm({ dom, jar, followRedirects, asIs })
{
    let url = dom.window.document.getElementsByTagName('form')[0].action;

    if (url.indexOf('http') === -1)
    {
        url = 'https://cas.elycee.rhonealpes.fr/' + url;
    }

    let params = getParams(dom);

    let data = {
        url,
        jar,
        asIs,
        followRedirects,

        data: params,
        method: 'POST'
    };

    return getDOM(data);
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
