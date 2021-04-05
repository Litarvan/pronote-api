const jsdom = require('jsdom');

const { getDOM, submitForm, extractStart } = require('../api');
const edu = require('./educonnect');

async function login({ url, account, username, password, casUrl, idp })
{

    const jar = new jsdom.CookieJar();

    // Select EduConnect
    let dom = await getDOM({
        url: `https://${casUrl}/login?&selection=${idp}&service=${url}&submit=Valider`,
        jar,
        followRedirects: true
    });


    // Send SAML Request to EduConnect
    dom = await submitForm({
        dom,
        jar
    });

    await edu({ dom, jar, username, password });

    return extractStart(await getDOM({ url: url + account.value + '.html', jar, asIs: true }));
}

module.exports = login;
