const jsdom = require('jsdom');

const { getDOM, submitForm } = require('./api');
const educonnect = require('./generics/educonnect');

async function login(url, account, username, password)
{
    const jar = new jsdom.CookieJar();
    let dom = await getDOM({
        url: 'https://www.toutatice.fr/portail/auth/pagemarker/2/MonEspace',
        jar
    });

    dom = await submitForm({
        dom,
        jar,
        actionRoot: 'https://www.toutatice.fr/wayf/',
        extraParams: {
            // eslint-disable-next-line camelcase
            _saml_idp: 'educonnect'
        }
    });

    return educonnect({ dom, jar, url, account, username, password });
}

module.exports = login;
