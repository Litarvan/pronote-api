const openent = require('./openent');

module.exports = (url, account, username, password) => openent({
    url,
    username,
    password,

    target: 'https://ent.iledefrance.fr/'
});
