const forge = require('node-forge');

function initCipher(session, keyModulus, keyExponent)
{
    session.aesKey = new forge.util.ByteBuffer();
    session.aesIV = new forge.util.ByteBuffer();
    session.aesTempIV = new forge.util.ByteBuffer(forge.random.generate(16));

    session.publicKey = forge.pki.rsa.setPublicKey(
        new forge.jsbn.BigInteger(keyModulus, 16),
        new forge.jsbn.BigInteger(keyExponent, 16)
    );
}

function cipher(session, data, { key, compress } = {})
{
    data = forge.util.encodeUtf8('' + data);
    if (compress && !session.disableCompress) {
        data = deflate(data);
    }

    const cipher = createCipher(session, key);
    cipher.update(new forge.util.ByteBuffer(data));

    return cipher.finish() && cipher.output.toHex();
}

function decipher(session, data, { compress, scrambled, key, asBytes } = {})
{
    const cipher = createCipher(session, key);
    cipher.update(new forge.util.ByteBuffer(forge.util.hexToBytes(data)));

    let result = cipher.finish() && cipher.output.bytes();
    if (compress && !session.disableCompress) {
        result = inflate(result);
    }

    result = forge.util.decodeUtf8(result);

    if (scrambled) {
        const unscrambled = new Array(result.length);
        for (let i = 0; i < result.length; i += 1) {
            if (i % 2 === 0) {
                unscrambled.push(result.charAt(i));
            }
        }

        return unscrambled.join('');
    }

    if (asBytes) {
        const buffer = new forge.util.ByteBuffer();
        const split = result.split(',');

        for (let i = 0; i < split.length; i++) {
            buffer.putInt(parseInt(split[i]));
        }

        return buffer;
    }

    return result;
}

function createCipher(session, key, decipher)
{
    if (!key) {
        key = session.aesKey;
    }

    const cipher = forge.cipher[decipher ? 'createDecipher' : 'createCipher']('AES-CBC', md5(key));
    const iv = session.aesIV.length() ? md5(session.aesIV) : new forge.util.ByteBuffer();

    cipher.start({ iv });

    return cipher;
}

function md5(buffer)
{
    return forge.md.md5.create().update(buffer.bytes()).digest();
}

function deflate(data)
{
    return pako.deflateRaw(new forge.util.ByteBuffer(data).toHex(), { level: 6, to: 'string' });
}

function inflate(data)
{
    return pako.inflateRaw(data, { to: 'string' });
}

function getUUID(session)
{
    return forge.util.encode64(session.publicKey.encrypt((session.aesTempIV || session.aesIV).bytes()), 64);
}

module.exports = {
    initCipher,

    cipher,
    decipher,
    getUUID
};
