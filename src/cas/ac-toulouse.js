const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const request = require('../request');
const util = require('../util');

async function login({ username, password, url })
{
    console.log(`Logging in '${username}' for '${url}' using Toulouse CAS`);

    let jar = new jsdom.CookieJar();
    let dom = await getDOM({
        url: `https://cas.mon-ent-occitanie.fr/login?selection=TOULO-ENT_parent_eleve&service=${encodeURIComponent(url)}`,
        jar
    });

    dom.window.document.getElementById('username').value = username;
    dom.window.document.getElementById('password').value = password;

    const result = await submitForm({
        dom,
        jar,
        asIs: true
    });

    console.log(`Logged in '${username}'`);

    return util.extractStart(result);
}

function submitForm({ dom, jar, asIs })
{
    let url = dom.window.document.getElementsByTagName('form')[0].action;

    if (url.startsWith('/'))
    {
        url = url.substring(1);
    }

    if (url.indexOf('/') === -1)
    {
        url = 'https://cas.mon-ent-occitanie.fr/' + url;
    }

    let params = getParams(dom);

    let data = {
        url,
        jar,
        asIs,
        followRedirects: true,

        data: params,
        method: 'POST'
    };

    return getDOM(data);
}

function getParams(dom)
{
    let params = {};

    Array.prototype.forEach.call(dom.window.document.getElementsByTagName('input'), input => input.name !== '' ? params[input.name] = input.value : '');

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
