const axios = require('axios');

async function axioRequest({ url, body, data, method = 'GET', binary, jar = null }) {
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
    const response = await axios(content)

    if (response.headers['set-cookie'] && jar !== null) {
        await updateCookies(response, jar, url);
    }

    return response;
}

function updateCookies(response, jar, url) {
    return new Promise((accept, reject) => {
        response.headers['set-cookie'].forEach(cookie => {
            jar.setCookie(cookie, url, err => (err ? reject(err) : accept()));
        });
    });
}

function encodeCookies(jar) {
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

function encodeParams(data) {
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


module.exports = axioRequest
