const request = require('../../request');

async function logout(session)
{
    await request(session, 'SaisieDeconnexion');
}

module.exports = logout;
