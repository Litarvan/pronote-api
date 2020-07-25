const request = require('../request');

async function getId(session, username, fromCas)
{
    const { donnees: id } = await request(session, 'Identification', {
        donnees: {
            genreConnexion: 0,
            genreEspace: session.target.id,
            identifiant: username,
            pourENT: fromCas,
            enConnexionAuto: false,
            demandeConnexionAuto: false,
            demandeConnexionAppliMobile: false,
            demandeConnexionAppliMobileJeton: false,
            uuidAppliMobile: '',
            loginTokenSAV: ''
        }
    });

    return {
        scramble: id.alea,
        challenge: id.challenge
    };
}

module.exports = getId;
