const jsdom = require('jsdom');

const aten = require('./aten');
const util = require('../util');

async function login({ username, password, url })
{
    console.log(`Logging in '${username}' for '${url}' using Rouen CAS`);

    let jar = new jsdom.CookieJar();

    let dom = await util.getDOM({
        url: `https://fip.itslearning.com/SP/bn/login?service=${encodeURIComponent(url)}`,
        jar
    });

    let params = util.getParams(dom);
    params['origin'] = 'urn:fi:ac-caen:ts:1.0';

    dom = await util.getDOM({
        url: `https://cas.itslearning.com/ds-bn/WAYF`,
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

    return util.extractStart(dom);
}

module.exports = login;
