const axios = require('axios');
const cipher = require('./cipher');

function initPronote({ session, url, espace, sessionID, noAES })
{
    session.root = url;
    session.session = sessionID;
    session.espace = espace;
    session.disableAES = noAES || false;
}

async function pronote({ session, name, content })
{
    session.requestID += 2;

    if (session.signEleve)
    {
        if (!content._Signature_)
        {
            content._Signature_ = {};
        }

        content._Signature_.membre = session.signEleve;
    }

    let order = cipher.cipher({
        session,

        string: session.requestID,
        compress: false
    });

    let url = `${session.root}appelfonction/${session.espace}/${session.session}/${order}`;

    let body = {
        nom: name,
        numeroOrdre: order,
        session: parseInt(session.session, 10)
    };

    if (session.disableAES)
    {
        body['donneesSec'] = content;
    }
    else
    {
        body['donneesSec'] = cipher.cipher({
            session,

            string: JSON.stringify(content),
            compress: true
        });
    }

    let result = await http({
        url: url,
        body: JSON.stringify(body),
        method: 'POST'
    });

    if (result.Erreur) {
        const { Titre, Message } = result.Erreur;
        throw { title: Titre, message: Message };
    }

    cipher.updateIV(session);

    if (!session.disableAES)
    {
        result = result.donneesSec;

        result = JSON.parse(cipher.decipher({
            session,

            string: result,
            compress: true
        }));

        return result;
    }

    return result.donneesSec;
}

async function http({ url, body, data, method = 'GET', binary, jar = null, followRedirects = true })
{
    let cookies = '';
    if (jar !== null)
    {
        jar.toJSON().cookies.forEach(cookie => cookies += cookie.key + '=' + cookie.value + '; ');

        if (cookies.length !== 0)
        {
            cookies = cookies.substring(0, cookies.length - 2);
        }
    }

    let params = '';
    if (data)
    {
        for (let k in data)
        {
            let v = data[k];
            params += `${k}=${encodeURIComponent(v)}&`
        }

        params = params.substring(0, params.length - 1);
    }

    let content = {
        url,
        method: method.toLowerCase(),
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0',
            'Content-Type': body !== undefined ? 'application/json' : (params !== '' && method !== 'GET' ? 'application/x-www-form-urlencoded' : ''),
            'Cookie': cookies
        },
        maxRedirects: 0,
        validateStatus(status) {
            return status === 401 || (status >= 200 && status <= 302)
        }
    };

    if (binary)
    {
        content['responseType'] = 'arraybuffer';
    }

    if (params !== '')
    {
        if (method.toUpperCase() === 'GET')
        {
            content.url += '?' + params;
        }
        else
        {
            content.data = params;
        }
    }
    else
    {
        content.data = body;
    }

    let response = await axios(content);

    if (response.headers['set-cookie'] && jar !== null)
    {
        await (new Promise((accept, reject) => response.headers['set-cookie'].forEach(cookie => jar.setCookie(cookie, url, (err, _) => err ? reject(err) : accept()))));
    }

    if (response.headers['location'] && followRedirects)
    {
        let location = response.headers['location'];

        if (!location.startsWith('http'))
        {
            let noProtocol = url.substring(url.indexOf('/') + 2);
            let root = url.substring(0, url.indexOf('/')) + '//' + noProtocol.substring(0, noProtocol.indexOf('/'));

            location = root + location;
        }

        return await http({
            url: location,
            jar
        });
    }
    else
    {
        return response.data;
    }
}

module.exports = {
    http,
    pronote,
    initPronote
};
