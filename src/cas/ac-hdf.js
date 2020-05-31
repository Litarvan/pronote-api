const jsdom = require('jsdom');
const util = require('../util');

async function login({ username, password, url })
{
    console.log(`Logging in '${username}' for '${url}' using HDF CAS`);

    let jar = new jsdom.CookieJar();
    let dom = await util.getDOM({
        url: "https://enthdf.fr/auth/login",
        jar,
        method: 'POST',
        data: {
            email: username,
            password: password,
            callback: "/cas/login?service=" + encodeURIComponent(url + 'eleve.html')
        },
        asIs: true
    });

    return util.tryExtractStart(username, dom);
}

module.exports = login;
