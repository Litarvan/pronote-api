const { cipher, decipher } = require('./cipher');
const http = require('./http');

async function request(session, name, content)
{
    session.request += 2;

    if (session.signData) {
        if (!content._Signature_) {
            content._Signature_ = {};
        }

        content._Signature_.membre = session.signData;
    }

    const order = cipher(session, session.request);
    const url = `${session.server}appelfonction/${session.target.id}/${session.id}/${order}`;

    const result = await http({
        url,
        method: 'POST',
        body: {
            nom: name,
            numeroOrdre: order,
            session: session.id,
            donneesSec: session.disableAES ? content : cipher(session, JSON.stringify(content), { compress: true })
        }
    });

    if (result.Erreur) {
        const { Titre, Message } = result.Erreur;
        throw { title: Titre, message: Message };
    }

    if (!session.aesIV.length()) {
        session.aesIV = session.aesTempIV;
    }

    if (!session.disableAES) {
        return JSON.parse(decipher(session, result.donneesSec, { compress: true }));
    }

    return result.donneesSec;
}

module.exports = request;
