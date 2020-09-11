const { getDOM, getParams, extractStart } = require('./api');

const LOGIN_URL = 'https://www.laclasse.com/sso/login';

async function login(url, account, username, password)
{
    const service = encodeURIComponent(url);

    return extractStart(await getDOM({
        url: LOGIN_URL,
        method: 'POST',
        data: {
            service,
            state: getParams(await getDOM({ url: `${LOGIN_URL}?service=${service}` })).state,
            username,
            password
        },
        asIs: true
    }));
}

module.exports = login;
