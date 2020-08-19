const http = require('../http');
const { extractStart } = require('./api');

async function login(url, accountPage)
{
    return extractStart(await http({ url: url + accountPage }));
}

module.exports = login;
