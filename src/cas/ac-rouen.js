const jsdom = require('jsdom');

const aten = require('./aten');
const util = require('../util');

async function login({ username, password, url })
{
    console.log(`Logging in '${username}' for '${url}' using Rouen CAS`);

    let jar = new jsdom.CookieJar();
    let dom = await util.getDOM({
        url: 'https://nero.l-educdenormandie.fr/Shibboleth.sso/Login?entityID=urn:fi:ac-rouen:ts-EDUC-Normandie:1:0&target=',
        jar,
        runScripts: true,
        hook: aten.hook
    });

    await aten.submit({ dom, jar, username, password, atenURL: 'https://sso-ent.ac-rouen.fr/login/' });

    await util.getDOM({
        url: 'https://nero.l-educdenormandie.fr/c/portal/nero/access',
        jar
    });

    dom = await util.getDOM({
        url,
        jar,
        asIs: true
    });

    return util.tryExtractStart(username, dom);
}

module.exports = login;
