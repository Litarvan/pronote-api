const request = require('../request');
const util = require('../util');

async function login({ username, password, url })
{
    console.log(`Logging in '${username}' for '${url}' using regular login`);

    let html = await request.http({
        url: url + 'eleve.html?login=true',
        method: 'GET'
    });

    console.log(`Logged in '${username}'`);

    return util.extractStart(html);
}

module.exports = login;