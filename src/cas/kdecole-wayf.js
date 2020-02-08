const jsdom = require('jsdom');

const aten = require('./aten');
const util = require('../util');

async function login({ username, password, url, acName, casUrl, idp, atenURL })
{
    console.log(`Logging in '${username}' for '${url}' using ${acName} CAS`);

    let jar = new jsdom.CookieJar();
    let dom = await util.getDOM({
        url: `${casUrl}login?selection=${idp.includes('parent_eleve') ? idp : idp + '_parent_eleve'}&service=${encodeURIComponent(url)}`,
        jar
    });

    if (atenURL) {
        dom = await util.submitForm({
            dom,
            jar,
            runScripts: !!atenURL,
            hook: atenURL && aten.hook,
            actionRoot: casUrl
        });

        dom = await aten.submit({ dom, jar, username, password, atenURL });
    } else {
        dom.window.document.getElementById('username').value = username;
        dom.window.document.getElementById('password').value = password;

        dom = await util.submitForm({
            actionRoot: casUrl,
            dom,
            jar,
            asIs: true
        });
    }

    return util.tryExtractStart(username, dom);
}

module.exports = login;
