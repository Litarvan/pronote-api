const jsdom = require('jsdom');

const { getDOM, extractStart } = require('./api');

async function login({ url, username, password, target })
{
    const jar = new jsdom.CookieJar();
    const dom = await getDOM({
        url: url + 'auth/login',
        jar,
        method: 'POST',
        data: {
            email: username,
            password,
            callback: '/cas/login?service=' + encodeURIComponent(url)
        },
        asIs: true
    });

    return extractStart(username, dom);
}

module.exports = login;
