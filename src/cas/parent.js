const request = require('../request');
const util = require('../util');

async function login({ username, password, url })
{
    console.log(`'${username}' for '${url}' is using parent login`);

    let html = await request.http({
        url: url + 'parent.html?login=true',
        method: 'GET'
    });

    return util.extractStart(html);
}

module.exports = login;
