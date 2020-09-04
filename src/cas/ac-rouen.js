const jsdom = require('jsdom');

const { getDOM, extractStart } = require('./api');
const aten = require('./generics/aten');

async function login(url, account, username, password)
{
    const jar = new jsdom.CookieJar();
    const dom = await getDOM({
        // eslint-disable-next-line max-len
        url: 'https://nero.l-educdenormandie.fr/Shibboleth.sso/Login?entityID=urn:fi:ac-rouen:ts-EDUC-Normandie:1:0&target=',
        jar,
        runScripts: true,
        hook: aten.hook
    });

    await aten.submit({ dom, jar, username, password, atenURL: 'https://sso-ent.ac-rouen.fr/login/' });

    await getDOM({
        url: 'https://nero.l-educdenormandie.fr/c/portal/nero/access',
        jar
    });

    return extractStart(await getDOM({
        url: url + account.value + '.html',
        jar,
        asIs: true
    }));
}

module.exports = login;
