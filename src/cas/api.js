const { JSDOM } = require('jsdom');

const errors = require('../errors');
const http = require('../http');

function submitForm({ dom, jar, asIs, runScripts, hook, method = 'POST', actionRoot, extraParams })
{
    let url = dom.window.document.getElementsByTagName('form')[0].action;

    if (url.startsWith('/'))
    {
        url = url.substring(1);
    }

    if (url.indexOf('http') === -1)
    {
        url = actionRoot + url;
    }

    const params = getParams(dom, extraParams);

    const data = {
        url,
        jar,
        asIs,
        followRedirects: true,
        runScripts,
        hook,
        data: params,
        method
    };

    return getDOM(data);
}

function getParams(dom, extra = {})
{
    const params = {};

    Array.prototype.forEach.call(
        dom.window.document.getElementsByTagName('input'),
        input => (input.name !== '' ? params[input.name] = input.value : '')
    );

    return { ...params, ...extra };
}

async function getDOM({ url, jar, method = 'GET', data = '', runScripts, hook, followRedirects, asIs })
{
    let result = await http({
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
        result = result
            .replace('<script>$(function() { startup() });</script>', '')
            .replace('console.log(user+" "+pwd);', '');
    }

    return new JSDOM(result, {
        runScripts: runScripts ? 'dangerously' : 'outside-only',
        beforeParse(window) {
            if (hook) {
                hook(window)
            }
        },
        cookieJar: jar
    });
}


function extractStart(html)
{
    if (html.includes('Votre adresse IP est provisoirement suspendue')) { // Top 10 anime betrayals
        throw errors.BANNED.drop();
    }

    if (html.includes('Le site n\'est pas disponible')) {
        throw errors.CLOSED.drop();
    }

    if (!html.includes('PRONOTE')) {
        throw errors.WRONG_CREDENTIALS.drop();
    }

    html = html.replace(/ /ug, '').replace(/\n/ug, '');

    const from = 'Start(';
    const to = ')}catch';

    const start = html.substring(html.indexOf(from) + from.length, html.indexOf(to));
    const json = start.
        replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/gu, '"$2": ').
        replace(/'/gu, '"');

    return JSON.parse(json);
}

module.exports = {
    submitForm,
    getDOM,
    getParams,
    extractStart
};
