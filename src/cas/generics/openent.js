const jsdom = require('jsdom');

const { getDOM, extractStart } = require('../api');

async function login({ url, username, password, target })
{
    return extractStart(await getDOM({
        url: `https://${target}/auth/login`,
        jar: new jsdom.CookieJar(),
        method: 'POST',
        data: {
            email: username,
            password,
            callback: '/cas/login?service=' + encodeURIComponent(url)
        },
        asIs: true
    }));
}

module.exports = login;
