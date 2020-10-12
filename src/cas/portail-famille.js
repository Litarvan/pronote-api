const aten = require('./generics/aten');

module.exports = (url, account, username, password) => aten.login({
    url,
    account,
    username,
    password,

    startURL: 'https://seshat.ac-orleans-tours.fr:8443/identite/discovery?idp_ident=urn:fi:ac-orleans_EXT:ts:1.0',
    atenURL: 'portail-famille.ac-orleans-tours.fr'
});
