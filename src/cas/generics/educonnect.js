const errors = require('../../errors');
const { getDOM, submitForm, extractStart } = require('../api');

async function login({ dom, jar, url, account, username, password })
{
    dom.window.document.getElementById('username').value = username;
    dom.window.document.getElementById('password').value = password;

    dom = await submitForm({
        dom,
        jar,
        actionRoot: 'https://educonnect.education.gouv.fr/',
        extraParams: {
            '_eventId_proceed': ''
        }
    });

    if (!dom.window.document.querySelector('input[name=SAMLResponse]')) {
        throw errors.WRONG_CREDENTIALS.drop();
    }

    await submitForm({ dom, jar });

    return extractStart(await getDOM({
        url: url + account.value + '.html',
        jar,
        asIs: true
    }));
}

module.exports = login;
