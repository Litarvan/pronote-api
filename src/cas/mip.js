const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const request = require('../request');
const util = require('../util');

async function login({ username, password, url })
{
    console.log(`Logging in '${username}' for '${url}' using ENT MIP`);

    url = url + 'eleve.html';

    let jar = new jsdom.CookieJar();
    let dom = await getDOM({
        url: `https://cas.entmip.fr/login?service=${encodeURIComponent(url)}`,
        jar
    });

    url = dom.window.document.getElementsByTagName('form')[0].action;

    if (url.indexOf('/') < 1)
    {
        url = 'https://cas.entmip.fr' + url;
    }

    dom = await getDOM({
        url,
        jar,
        data: {
            username,
            password,
            lt: dom.window.document.querySelector('input[name=lt]').value,
            idp: dom.window.document.querySelector('input[name=idp]').value,
            _eventId: dom.window.document.querySelector('input[name=_eventId]').value
        },
        followRedirects: true,
        asIs: true,
        method: 'POST'
    });

    if (dom.indexOf('PRONOTE') === -1)
    {
        console.log(`Wrong IDs for '${username}'`);
        throw 'Mauvais Identifiants';
    }

    console.log(`Logged in '${username}'`);

    return util.extractStart(dom);
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
        url,
        runScripts: runScripts ? 'dangerously' : 'outside-only',
        beforeParse(window) { hook(window) },
        cookieJar: jar
    });
}

module.exports = login;