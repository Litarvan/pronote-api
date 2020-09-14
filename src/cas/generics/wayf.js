const jsdom = require('jsdom');

const { getParams, getDOM, extractStart } = require('../api');
const aten = require('./aten');

async function login({ url, username, password, startURL, wayfURL, atenURL, extraParams })
{
    const jar = new jsdom.CookieJar();

    let dom = await getDOM({
        url: `${startURL}login?service=${encodeURIComponent(url)}`,
        jar
    });

    dom = await getDOM({
        url: `${wayfURL}WAYF`,
        jar,
        data: { ...getParams(dom), ...extraParams },
        runScripts: true,
        hook: aten.hook
    });

    dom = await aten.submit({
        dom,
        jar,
        username,
        password,
        atenURL
    });

    return extractStart(dom);
}

module.exports = login;
