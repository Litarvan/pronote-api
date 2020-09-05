const aten = require('./generics/aten');

module.exports = (url, account, username, password) => aten.login({
    url,
    account,
    username,
    password,

    startURL: '/sso/SSO?SPEntityID=https%3A%2F%2Fmon.lyceeconnecte.fr%2Fauth%2Fsaml%2Fmetadata%2Fidp.xml',
    atenURL: 'teleservices.ac-limoges.fr'
});
