const { cipher, decipher } = require('./cipher');
const errors = require('./errors');
const http = require('./http');

async function request(session, name, content = {})
{
    session.request += 2;

    const order = cipher(session, session.request);
    const url = `${session.server}appelfonction/${session.type.id}/${session.id}/${order}`;

    let data = content;
    if (!session.disableAES) {
        data = cipher(session, JSON.stringify(content), { compress: true });
    }

    const result = await http({
        url,
        method: 'POST',
        body: {
            nom: name,
            numeroOrdre: order,
            session: session.id,
            donneesSec: data
        }
    });

    if (result.Erreur) {
        const { Titre, Message } = result.Erreur;

        if (Titre.startsWith('La page a expiré !')) {
            throw errors.SESSION_EXPIRED.drop();
        }
        if (Message.startsWith('Vous avez dépassé le nombre')) {
            throw errors.RATE_LIMITED.drop();
        }

        throw errors.PRONOTE.drop({ title: Titre, message: Message });
    }

    if (!session.disableAES) {
        return JSON.parse(decipher(session, result.donneesSec, { compress: true }));
    }

    return result.donneesSec;
}

module.exports = request;
