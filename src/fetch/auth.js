const request = require('../request');
const { cipher } = require('../cipher');

async function fetchAuth(session, challenge, key)
{
    const { donnees: auth } = await request(session, 'Authentification', {
        donnees: {
            connexion: 0,
            challenge: cipher(session, challenge, { key }),
            espace: session.target.id
        }
    });

    return auth.cle;
}

module.exports = fetchAuth;
