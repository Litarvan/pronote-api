const jsdom = require('jsdom');

const aten = require('./aten');
const util = require('../util');

async function login({ username, password, url })
{
    console.log(`Logging in '${username}' for '${url}' using Nantes CAS`);

    let jar = new jsdom.CookieJar();

    let dom = await util.getDOM({
        url: `https://cas3.e-lyco.fr/access/login?service=${encodeURIComponent(url)}`,
        jar
    });

    let params = util.getParams(dom);
    params['origin'] = 'https://ats-idp.ac-nantes.fr/SAML/FIM';
    params['action'] = 'selection';
    dom = await util.getDOM({
        url: `https://cas3.e-lyco.fr/discovery/WAYF`,
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
        atenURL: 'https://ats-idp.ac-nantes.fr/login/'
    });

    return util.extractStart(dom);
}

module.exports = login;