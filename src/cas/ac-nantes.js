const jsdom = require('jsdom');

const { getParams, getDOM, extractStart } = require('./api');
const aten = require('./generics/aten');

async function login(url, account, username, password)
{
    const jar = new jsdom.CookieJar();

    let dom = await getDOM({
        url: `https://cas3.e-lyco.fr/access/login?service=${encodeURIComponent(url)}`,
        jar
    });

    const params = getParams(dom);
    params.origin = 'https://ats-idp.ac-nantes.fr/SAML/FIM';
    params.action = 'selection';
    dom = await getDOM({
        url: 'https://cas3.e-lyco.fr/discovery/WAYF',
        jar,
        data: params,
        runScripts: true,
        hook: aten.hook
    });

    dom = await aten.submit({
        dom,
        jar,
        username,
        password,
        atenURL: 'https://ats-idp.ac-nantes.fr/login/'
    });

    return extractStart(dom);
}

module.exports = login;
