const request = require('../../request');

async function keepAlive(session)
{
    await request(session, 'Presence');
}

module.exports = keepAlive;
