const jsdom = require('jsdom');
const axioRequest = require('../axioRequest')

const { getDOM, submitForm, extractStart } = require('./api');
const educonnect = require('./generics/educonnect');
const querystring = require('querystring');
const http = require('../http');

async function login(url, account, username, password) {
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
    dom = await educonnect({ dom, jar, url, account, username, password });

    let redirectURL = dom.window.document.getElementsByTagName('a')[0].href

    let response = await axioRequest({
        url: redirectURL,
        jar
    })

    redirectURL = getOrigin(redirectURL) + response.headers.location

    const parsed = querystring.parse(redirectURL.split('?')[1])
    const conversation = parsed.conversation
    const sessionid = parsed.sessionid

    // eslint-disable-next-line max-len
    redirectURL = `${getOrigin(redirectURL)}/idp/Authn/RemoteUser?conversation=${conversation}&redirectToLoaderRemoteUser=0&sessionid=${sessionid}`

    response = await axioRequest({
        url: redirectURL,
        jar
    })
    // eslint-disable-next-line max-len
    const remoteUserParsed = response.data.match(/<conversation>(.+)<\/conversation><uidInSession>(.+)<\/uidInSession>/u)

    const remoteUserConversation = remoteUserParsed[1]
    const uidInSession = remoteUserParsed[2]

    // eslint-disable-next-line max-len
    redirectURL = `${getOrigin(redirectURL)}/idp/Authn/RemoteUser?conversation=${remoteUserConversation}&uidInSession=${uidInSession}&sessionid=${sessionid}`

    response = await http({
        url: redirectURL,
        jar,
        followRedirects: true
    })

    return extractStart(await getDOM({
        url: `${url}${account.value}.html`,
        jar,
        asIs: true
    }))
}

function getOrigin(url) {
    const noProtocol = url.substring(url.indexOf('/') + 2);
    return url.substring(0, url.indexOf('/')) + '//' + noProtocol.substring(0, noProtocol.indexOf('/'));
}

module.exports = login;
