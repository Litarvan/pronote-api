const { JSDOM } = require('jsdom');
const request = require('./request');

Date.prototype.getWeek = function()
{
    let d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    let dayNum = d.getUTCDay() || 7;

    d.setUTCDate(d.getUTCDate() + 4 - dayNum);

    let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
};

function parseDate(string)
{
    let date = new Date();
    let split = string.split(' ');

    let day = split[0].split('/');

    date.setFullYear(~~day[2], (~~day[1]) - 1, ~~day[0]);
    date.setMilliseconds(0);

    if (split.length > 1)
    {
        let time = split[1].split(':');

        date.setHours(~~time[0]);
        date.setMinutes(~~time[1]);
        date.setSeconds(~~time[2]);
    }
    else
    {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
    }

    return getTime(date);
}

function parseMark(string)
{
    return string === 'Abs' ? -1 : parseFloat(string.replace(',', '.'));
}

function parsePeriod(string)
{
    return ~~string.substring(string.length - 1);
}

function decodeHTML(string)
{
    let entities = {
        'amp': '&',
        'apos': '\'',
        'lt': '<',
        'gt': '>',
        'quot': '"',
        'nbsp': '\xa0'
    };

    string = string.replace( /&([a-z]+);/ig, (match, entity) => {
        entity = entity.toLowerCase();
        if (entities.hasOwnProperty(entity))
        {
            return entities[entity];
        }

        return match;
    });

    return string.replace(/&#(\d+);/g, (match, dec) => {
        return String.fromCharCode(dec);
    });
}

function tryExtractStart(username, html)
{
    if (html.indexOf('PRONOTE') === -1)
    {
        console.log(`Wrong IDs for '${username}'`);
        throw 'Mauvais Identifiants';
    }

    console.log(`Logged in '${username}'`);

    return extractStart(html);
}

function extractStart(html)
{
    html = html.replace(new RegExp(' ', 'g'), '').replace(new RegExp('\n', 'g'), '');

    let from = "Start(";
    let to = ")}catch";

    return asJSON(html.substring(html.indexOf(from) + from.length, html.indexOf(to)));
}

function asJSON(json)
{
    return JSON.parse(json.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ').replace(new RegExp("'", 'g'), '"'));
}

function getTime(date)
{
    let offset = 0;
    if (process.env.OFFSET) {
        offset = -60 * 60 * 1000;
    }

    return date.getTime() + offset;
}

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

    let params = getParams(dom, extraParams);

    let data = {
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
    let params = { ...extra };

    Array.prototype.forEach.call(
        dom.window.document.getElementsByTagName('input'),
        input => input.name !== '' ? params[input.name] = input.value : ''
    );

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


module.exports = {
    parseDate,
    parsePeriod,
    parseMark,
    decodeHTML,
    extractStart,
    tryExtractStart,
    asJSON,
    getTime,
    submitForm,
    getParams,
    getDOM
};
