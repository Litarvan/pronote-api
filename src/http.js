const axios = require('axios');

async function http({ url, body, data, method = 'GET', binary, jar = null, followRedirects = true })
{
    let userAgent = 'Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0';
    if (url.includes('teleservices.ac-nancy-metz.fr')) {
        userAgent = 'FuckTheUselessProtection/1.0';
    }

    const params = encodeParams(data);
    const content = {
        url,
        method: method.toLowerCase(),
        headers: {
            'User-Agent': userAgent,
            'Content-Type': body !== undefined
                ? 'application/json'
                : (params !== '' && method !== 'GET' ? 'application/x-www-form-urlencoded' : ''),
            'Cookie': encodeCookies(jar)
        },
        maxRedirects: 0,
        validateStatus(status) {
            return status === 401 || (status >= 200 && status <= 302)
        }
    };

    if (binary) {
        content.responseType = 'arraybuffer';
    }

    if (params) {
        if (method.toUpperCase() === 'GET') {
            content.url += '?' + params;
        } else {
            content.data = params;
        }
    } else if (body) {
        content.data = body;
    }

    const response = await axios(content);
    if (response.headers['set-cookie'] && jar !== null)
    {
        await updateCookies(response, jar, url);
    }

    if (response.headers.location && followRedirects) {
        let location = response.headers.location;
        if (!location.startsWith('http')) {
            location = getOrigin(url) + location;
        }

        if (followRedirects === 'get') {
            return location;
        }

        return await http({
            url: location,
            jar
        });
    }

    return response.data;
}

function encodeCookies(jar)
{
    if (!jar) {
        return '';
    }

    let cookies = '';
    jar.toJSON().cookies.forEach(cookie => cookies += cookie.key + '=' + cookie.value + '; ');

    if (cookies.length !== 0) {
        cookies = cookies.substring(0, cookies.length - 2);
    }

    return cookies;
}

function encodeParams(data)
{
    if (!data) {
        return '';
    }

    let params = '';
    for (const k of Object.keys(data)) {
        const v = data[k];
        params += `${k}=${encodeURIComponent(v)}&`
    }

    return params.substring(0, params.length - 1)
}

function updateCookies(response, jar, url)
{
    return new Promise((accept, reject) => {
        response.headers['set-cookie'].forEach(cookie => {
            jar.setCookie(cookie, url, err => (err ? reject(err) : accept()));
        });
    });
}

function getOrigin(url)
{
    const noProtocol = url.substring(url.indexOf('/') + 2);
    return url.substring(0, url.indexOf('/')) + '//' + noProtocol.substring(0, noProtocol.indexOf('/'));
}

module.exports = http;
