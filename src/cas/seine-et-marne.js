const openent = require('./generics/openent');

module.exports = (url, account, username, password) => openent({
    url,
    username,
    password,

    target: 'https://ent77.seine-et-marne.fr/'
});
