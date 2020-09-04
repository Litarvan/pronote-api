const jsdom = require('jsdom');

const { getDOM, getParams, extractStart } = require('./api');
const aten = require('./types/aten');

async function login(url, account, username, password)
{
    const jar = new jsdom.CookieJar();

    let dom = await getDOM({
        url: `https://fip.itslearning.com/SP/bn/login?service=${encodeURIComponent(url)}`,
        jar
    });

    const params = getParams(dom);
    params.origin = 'urn:fi:ac-caen:ts:1.0';

    dom = await getDOM({
        url: 'https://cas.itslearning.com/ds-bn/WAYF',
        jar,
        data: params,
        runScripts: true,
        hook: aten.hook
    });

    dom = await aten.submit({
        dom,
        jar,
        username,
        password,
        atenURL: 'https://teleservices.ac-caen.fr/login/'
    });

    return extractStart(dom);
}

module.exports = login;
