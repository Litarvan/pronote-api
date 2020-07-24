const http = require('../http');
const { extractStart } = require('./api');

async function login(url)
{
    return extractStart(await http({ url: url + 'eleve.html?login=true' }));
}

module.exports = login;
