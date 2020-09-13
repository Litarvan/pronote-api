const openent = require('./generics/openent');

module.exports = (url, account, username, password) => openent({
    url,
    account,
    username,
    password,

    target: 'college.entsomme.fr'
});
