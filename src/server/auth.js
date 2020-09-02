const { v4: uuid } = require('uuid');

const { loginStudent, loginParent } = require('../auth');

const sessions = {};

async function login({ url, username, password, cas, account = 'student' })
{
    if (!url || !username || !password) {
        throw {
            http: 400,
            message: 'Missing \'url\', or \'username\', or \'password\', or header \'Content-Type: application/json\''
        };
    }

    let func;
    switch (account) {
    case 'student':
        func = loginStudent;
        break;
    case 'parent':
        func = loginParent;
        break;
    default:
        throw {
            http: 400,
            message: `Unknown account type '${account}'`
        };
    }

    const token = uuid();
    sessions[token] = await func(url, username, password, cas);

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
