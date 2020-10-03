const wayf = require('./generics/wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    username,
    password,

    startURL: 'https://fip.itslearning.com/SP/bn/',
    wayfURL: 'https://fip.itslearning.com/ds-bn/',
    atenURL: 'teleservices.ac-caen.fr',

    extraParams: {
        origin: 'urn:fi:ac-caen:ts:1.0'
    }
});
