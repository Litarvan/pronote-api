const jsdom = require('jsdom');

const http = require('../../http');
const { getDOM, extractStart } = require('../api');

async function login({ url, username, password, target })
{
    const location = await http({ url, followRedirects: 'get' });

    let service = encodeURIComponent(url);
    if (location.startsWith('http') && location.includes('service=')) {
        service = location.substring(location.indexOf('=') + 1);
    }

    return extractStart(await getDOM({
        url: `https://${target}/auth/login`,
        jar: new jsdom.CookieJar(),
        method: 'POST',
        data: {
            email: username,
            password,
            callback: `/cas/login?service=${service}`
        },
        asIs: true
    }));
}

module.exports = login;
