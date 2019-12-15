const jsdom = require('jsdom');

const aten = require('./aten');
const util = require('../util');

async function login({ username, password, url, acName, baseURL, idp, atenURL })
{
    console.log(`Logging in '${username}' for '${url}' using ${acName} CAS`);

    let jar = new jsdom.CookieJar();
    let dom = await util.getDOM({
        url: `${baseURL}login?selection=${idp}_parent_eleve&service=${encodeURIComponent(url)}`,
        jar
    });

    dom = await util.submitForm({
        dom,
        jar,
        runScripts: true,
        hook: aten.hook
    });

    dom = await aten.submit({ dom, jar, username, password, atenURL: atenURL + 'login/' });

    return util.tryExtractStart(username, dom);
}

module.exports = login;
