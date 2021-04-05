const educonnect = require('./generics/kdecole-educonnect');

module.exports = (url, account, username, password) => educonnect({
    url,
    account,
    username,
    password,

    casUrl: 'cas.monbureaunumerique.fr',
    idp: 'EDU'
});
