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

function cipher(session, data, { key, compress })
{
    data = forge.util.encodeUtf8('' + data);
    if (compress && !session.disableCompress) {
        data = deflate(data);
    }

    const cipher = createCipher(session, key);
    cipher.update(new forge.util.ByteBuffer(data));

    return cipher.finish() && cipher.output.toHex();
}

function decipher(session, data, { compress, scrambled, key, asBytes })
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

function createCipher(session, key)
{
    if (!key) {
        key = session.publicKey;
    }

    const cipher = forge.cipher.createDecipher('AES-CBC', forge.md.md5.create().update(key.bytes()).digest());
    const iv = session.aesIV.length() ? forge.md.md5.create().update(session.aesIV.bytes()).digest() : new forge.util.ByteBuffer();

    cipher.start({ iv });

    return cipher;
}

function deflate(data)
{
    return pako.deflateRaw(new forge.util.ByteBuffer(data).toHex(), { level: 6, to: 'string' });
}

function inflate(data)
{
    return pako.inflateRaw(data, { to: 'string' });
}

module.exports = {
    initCipher,

    cipher,
    decipher
};
