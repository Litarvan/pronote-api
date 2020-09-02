const jsdom = require('jsdom');

const { getDOM, submitForm, extractStart } = require('./api');
const aten = require('./aten');

async function login({ url, username, password, casUrl, idp, atenURL })
{
    if (!idp.includes('parent_eleve')) {
        idp += '_parent_eleve';
    }

    const jar = new jsdom.CookieJar();
    let dom = await getDOM({
        url: `${casUrl}login?selection=${idp}&service=${encodeURIComponent(url)}`,
        jar
    });

    if (atenURL) {
        dom = await submitForm({
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

        dom = await submitForm({
            actionRoot: casUrl,
            dom,
            jar,
            asIs: true
        });
    }

    return extractStart(dom);
}

module.exports = login;
