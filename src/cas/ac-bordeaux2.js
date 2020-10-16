const aten = require('./generics/aten');

module.exports = (url, account, username, password) => aten.login({
    url,
    account,
    username,
    password,

    startURL: '/sso/SSO?SPEntityID=https://ent2d.ac-bordeaux.fr/shibboleth',
    atenURL: 'idp-fim-ts.ac-bordeaux.fr'
});
