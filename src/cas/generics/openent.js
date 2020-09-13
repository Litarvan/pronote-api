const jsdom = require('jsdom');

const http = require('../../http');
const { getDOM, extractStart } = require('../api');

async function login({ url, account, username, password, target })
{
    const location = await http({ url, followRedirects: 'get' });

    let service = encodeURIComponent(url);
    if (location.startsWith('http') && location.includes('service=')) {
        service = location.substring(location.indexOf('=') + 1);
    }

    const jar = new jsdom.CookieJar();

    await getDOM({
        url: `https://${target}/auth/login`,
        jar,
        method: 'POST',
        data: {
            email: username,
            password,
            callback: `/cas/login?service=${service}`
        }
    });

    return extractStart(await getDOM({ url: url + account.value + '.html', jar, asIs: true }));
}

module.exports = login;
