const axioRequest = require('./axioRequest')

async function http({ url, body, data, method = 'GET', binary, jar = null, followRedirects = true }) {
    const response = await axioRequest({
        url,
        body,
        data,
        method,
        binary,
        jar
    })

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

function getOrigin(url) {
    const noProtocol = url.substring(url.indexOf('/') + 2);
    return url.substring(0, url.indexOf('/')) + '//' + noProtocol.substring(0, noProtocol.indexOf('/'));
}

module.exports = http;
