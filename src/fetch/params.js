const request = require('../request');

async function getParams(session)
{
    const params = await request(session, 'FonctionParametres');
    console.log(params); // TODO
}

module.exports = getParams;
