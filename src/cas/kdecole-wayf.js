const jsdom = require('jsdom');
const util = require('../util');

async function login({ username, password, url, acName, casUrl, idp })
{
    console.log(`Logging in '${username}' for '${url}' using ${acName} CAS`);

    let jar = new jsdom.CookieJar();
    let dom = await util.getDOM({
        url: `${casUrl}login?selection=${idp}_parent_eleve&service=${encodeURIComponent(url)}`,
        jar
    });

    dom.window.document.getElementById('username').value = username;
    dom.window.document.getElementById('password').value = password;

    const result = await util.submitForm({
        actionRoot: casUrl,
        dom,
        jar,
        asIs: true
    });

    return util.tryExtractStart(username, result);
}

module.exports = login;
