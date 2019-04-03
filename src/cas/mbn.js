const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const request = require('../request');
const util = require('../util');

async function login({ username, password, url }, { name, idp })
{
    console.log(`Logging in '${username}' for '${url}' using MBN CAS (to ${name})`);

    let jar = new jsdom.CookieJar();
    let dom = await getDOM({
        url: `https://cas.monbureaunumerique.fr/login?service=${encodeURIComponent(url)}`,
        jar
    });

    const params = getParams(dom);
    params['selection'] = idp;

    dom = await submitForm({
        dom: await getDOM({
            url: `https://cas.monbureaunumerique.fr/login`,
            jar,
            data: params
        }),
        jar,
        forLogin: true
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
        jar,
        followRedirects: false
    });

    dom = await getDOM({
        url,
        jar,
        asIs: true
    });

    require('fs').writeFileSync('./saml.html', dom);

    if (dom.indexOf('SAML') !== -1)
    {
        console.log('SAML détécté');
        dom = await submitForm({
            dom: new JSDOM(dom, {
                cookieJar: jar
            }),
            jar,
            asIs: true
        });

        require('fs').writeFileSync('./dom.html', dom);
    }
    else
    {
        console.log('SAML non détécté');
    }

    if (dom.indexOf('PRONOTE') === -1)
    {
        console.log(`Wrong IDs for '${username}'`);
        throw 'Mauvais Identifiants';
    }

    console.log(`Logged in '${username}'`);

    return util.extractStart(dom);
}

function submitForm({ dom, jar, forLogin, followRedirects, asIs })
{
    let url = dom.window.document.getElementsByTagName('form')[0].action;

    if (url.indexOf('http') === -1)
    {
        url = 'https://cas.monbureaunumerique.fr/' + url;
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

    if (forLogin)
    {
        data['runScripts'] = true;
        data['hook'] = (window) => {
            window.eval(fs.readFileSync('./jsencrypt.min.js') + '; window.JSEncrypt = JSEncrypt;');
        };
    }

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
