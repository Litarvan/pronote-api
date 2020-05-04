const jsdom = require('jsdom');
const util = require('../util');

async function login({ username, password, url }) {
    console.log(`Logging in '${username}' for '${url}' using Toutatice CAS`);

    let jar = new jsdom.CookieJar();
    let dom = await util.getDOM({
        url: `https://www.toutatice.fr/casshib/shib/toutatice/login?service=${encodeURIComponent(url)}`,
        jar
    });

    // let params = util.getParams(dom);
    // params['_saml_idp'] = 'eleve-1';


    dom = await util.getDOM({
        url: dom.window.document.getElementById('img-responsive'),
        jar
    });

    dom.window.document.getElementById('username').value = username;
    dom.window.document.getElementById('password').value = password;

    dom = await util.submitForm({
        dom,
        jar,
        actionRoot: 'https://educonnect.education.gouv.fr/',
        extraParams: {
            '_eventId_proceed': ''
        }
    });

    if (!dom.window.document.querySelector('input[name=SAMLResponse]')) {
        console.log(`Wrong IDs for '${username}'`);
        throw 'Mauvais identifiants';
    }

    await util.submitForm({
        dom,
        jar
    });

    console.log(`Logged in '${username}'`);

    return util.extractStart(await util.getDOM({
        url,
        jar,
        asIs: true
    }));
}

module.exports = login;

// dom = await util.getDOM({
//     url: 'https://www.toutatice.fr/wayf/Ctrl',
//     jar,
//     method: 'POST',
//     data: params
// });

// params = util.getParams(dom);
// params['j_username'] = username;
// params['j_password'] = password;

// dom = await util.getDOM({
//     url: 'https://www.toutatice.fr' + dom.window.document.getElementsByTagName('form')[0].action,
//     jar,
//     method: 'POST',
//     data: params
// });

// dom = await util.submitForm({
//     dom,
//     jar,
//     asIs: true
// });

// return util.tryExtractStart(username, dom);
// }

// module.exports = login;
