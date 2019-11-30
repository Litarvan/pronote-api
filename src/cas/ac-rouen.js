const fs = require('fs');

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const request = require('../request');
const util = require('../util');

async function login({ username, password, url })
{
    console.log(`Logging in '${username}' for '${url}' using Rouen CAS`);

    let jar = new jsdom.CookieJar();
    let dom = await getDOM({
        url: 'https://nero.l-educdenormandie.fr/Shibboleth.sso/Login?entityID=urn:fi:ac-rouen:ts-EDUC-Normandie:1:0&target=',
        jar,
        runScripts: true,
        hook: (window) => {
            window.eval(fs.readFileSync('./jsencrypt.min.js') + '; window.JSEncrypt = JSEncrypt;');
        }
    });

    dom.window.document.getElementById('user').value = username;
    dom.window.document.getElementById('password').value = password;

    dom.window.eval('creerCookie(document.getElementById(\'user\'), document.getElementById(\'password\'));');

    let result = await submitForm({
        dom,
        jar
    });

    await submitForm({
        dom: result,
        jar
    });

    await getDOM({
        url: 'https://nero.l-educdenormandie.fr/c/portal/nero/access',
        jar
    });

    dom = await getDOM({
        url,
        jar,
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

function submitForm({ dom, jar, asIs })
{
    let url = dom.window.document.getElementsByTagName('form')[0].action;

    if (url.indexOf('/') === -1)
    {
        url = 'https://sso-ent.ac-rouen.fr/login/' + url;
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

    if (result.indexOf('<script>$(function() { startup() });</script>') !== -1)
    {
        result = result.replace('<script>$(function() { startup() });</script>', '').replace('console.log(user+" "+pwd);', '');
    }

    return new JSDOM(result, {
        runScripts: runScripts ? 'dangerously' : 'outside-only',
        beforeParse(window) { hook(window) },
        cookieJar: jar
    });
}

module.exports = login;
