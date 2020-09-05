const wayf = require('./generics/wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    username,
    password,

    startURL: 'https://cas3.e-lyco.fr/access/',
    wayfURL: 'https://cas3.e-lyco.fr/discovery/',
    atenURL: 'ats-idp.ac-nantes.fr',

    extraParams: {
        origin: 'https://ats-idp.ac-nantes.fr/SAML/FIM',
        action: 'selection'
    }
});
