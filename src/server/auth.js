const { v4: uuid } = require('uuid');

const auth = require('../auth');

const sessions = {};

async function login({ url, username, password, cas, account })
{
    if (!url || !username || !password) {
        throw {
            http: 400,
            message: 'Missing \'url\', or \'username\', or \'password\', or header \'Content-Type: application/json\''
        };
    }

    const token = uuid();
    sessions[token] = await auth.login(url, username, password, cas, account);

    return { token };
}

// eslint-disable-next-line no-unused-vars
async function logout(_, token)
{
    delete sessions[token];
    return { success: true };
}

function getSession(token)
{
    return sessions[token];
}

module.exports = { login, logout, getSession };
