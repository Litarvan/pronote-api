const errors = require('../../errors');
const { submitForm } = require('../api');

async function login({ dom, jar, username, password }) {
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

    return await submitForm({ dom, jar, followRedirects: false });
}

module.exports = login;
