const jsdom = require('jsdom');
const util = require('../util');

async function login({ username, password, url })
{
    console.log(`Logging in '${username}' for '${url}' using ENT 77 CAS`);

    let jar = new jsdom.CookieJar();
    let dom = await util.getDOM({
        url: "https://ent77.seine-et-marne.fr/auth/login",
        jar,
        method: 'POST',
        data: {
            email: username,
            password: password,
            callback: "/cas/login?service=" + encodeURIComponent(url)
        },
        asIs: true
    });

    return util.tryExtractStart(username, dom);
}

module.exports = login;
