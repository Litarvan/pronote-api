const forge = require('node-forge'); // REQUIRES 0.6.33 AND NOT LATER
const pako = require('pako');

function createSession()
{
    return {
        requestID: -1,

        cleAES: new forge.util.ByteBuffer(),
        ivAES: new forge.util.ByteBuffer(),
        ivAESTemp: new forge.util.ByteBuffer(forge.random.generate(16))
    };
}

function init({ session, exposant, modulo, noCompress })
{
    session.rsa = forge.pki.rsa.setPublicKey(new forge.jsbn.BigInteger(modulo, 16), new forge.jsbn.BigInteger(exposant, 16));
    session.disableCompress = noCompress || false;
}

function getUUID(session)
{
    return forge.util.encode64(session.rsa.encrypt(session.ivAESTemp.bytes()), 64);
}

function setLoginKey(session, username, password, alea, cas)
{
    /*

    ObjetMoteurConnexion.prototype.getMotDePasse = function(aPourVisu) {
            var lMotDePasse = this.motDePasse.GetLibelle();
            if (lMotDePasse && !this.pourENT && (this.motDePasse.GetGenre() > 0)) {
                lMotDePasse = lMotDePasse.toLowerCase();
            }©
            return aPourVisu && this.avecStockageMDP && !!lMotDePasse ? '********' : aPourVisu && !!lMotDePasse ? lMotDePasse : !!lMotDePasse ? forge.md.sha256.create().update(this.alea).update(forge.util.encodeUtf8(lMotDePasse)).digest().toHex().toUpperCase() : '';
        };

     */

    let pass = forge.md.sha256.create().update(alea || '').update(forge.util.encodeUtf8(password)).digest().toHex().toUpperCase();
    session.loginKey = new forge.util.ByteBuffer(forge.util.encodeUtf8((cas ? '' : username.toLowerCase()) + pass));
}

function getLoginKey(session)
{
    return session.loginKey;
}

function updateIV(session)
{
    session.ivAES = session.ivAESTemp;
}

function updateKey(session, key)
{
    session.cleAES = decipher({
        session,

        string: key,
        compress: false,
        alea: false,
        rsaKey: session.loginKey,
        bytes: true
    });
}

function cipher({ session, string, compress, rsaKey })
{
    if (rsaKey === undefined)
    {
        rsaKey = session.cleAES;
    }

    string = forge.util.encodeUtf8('' + string);

    //let original = string;

    if (compress && !session.disableCompress)
    {
        string = new forge.util.ByteBuffer(string).toHex();
        string = pako.deflateRaw(string, {
            level: 6,
            to: 'string'
        })
    }

    let key = forge.md.md5.create().update(rsaKey.bytes()).digest();
    let iv = session.ivAES.length() ? forge.md.md5.create().update(session.ivAES.bytes()).digest() : new forge.util.ByteBuffer();

    let cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({
        iv: iv
    });
    cipher.update(new forge.util.ByteBuffer(string));

    return cipher.finish() && cipher.output.toHex();
    /*let result = cipher.finish() && cipher.output.toHex();
    return forge.md.md5.create().update(original).update(rsaKey.bytes()).digest().toHex().toUpperCase() + result;*/
}

function decipher({ session, string, compress, alea, rsaKey, bytes })
{
    if (rsaKey === undefined)
    {
        rsaKey = session.cleAES;
    }

    /*let md5 = string.substr(0, 32).toUpperCase();
    string = string.slice(32);*/

    let key = forge.md.md5.create().update(rsaKey.bytes()).digest();
    let iv = session.ivAES.length() ? forge.md.md5.create().update(session.ivAES.bytes()).digest() : new forge.util.ByteBuffer();

    let cipher = forge.cipher.createDecipher('AES-CBC', key);
    cipher.start({
        iv: iv
    });
    cipher.update(new forge.util.ByteBuffer(forge.util.hexToBytes(string)));

    let result = cipher.finish() && cipher.output.bytes();

    if (compress && !session.disableCompress)
    {
        result = pako.inflateRaw(result, {
            to: 'string'
        })
    }

    /*let toCompare = forge.md.md5.create().update(result).update(rsaKey.bytes()).digest().toHex().toUpperCase();

    if (md5 !== toCompare)
    {
        console.error(`MD5 DOESN'T MATCH : ${md5} != ${toCompare}`);
        throw new Error('Bad response');
    }*/

    result = forge.util.decodeUtf8(result);

    if (alea)
    {
        let withoutAlea = new Array(result.length);

        for (let i = 0; i < result.length; i += 1)
        {
            if (i % 2 === 0)
            {
                withoutAlea.push(result.charAt(i));
            }
        }

        return withoutAlea.join('');
    }

    if (bytes)
    {
        let buffer = new forge.util.ByteBuffer();
        let split = result.split(',');

        for (let i = 0; i < split.length; i++)
        {
            buffer.putInt(parseInt(split[i]));
        }

        result = buffer;
    }

    return result;
}

module.exports = {
    createSession,
    init,
    getUUID,
    setLoginKey,
    getLoginKey,
    updateIV,
    updateKey,
    cipher,
    decipher
};
