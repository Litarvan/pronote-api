const wayf = require('./generics/wayf');

module.exports = (url, account, username, password) => wayf({
    url,
    username,
    password,

    startURL: 'https://fip.itslearning.com/SP/bn/',
    wayfURL: 'https://cas.itslearning.com/ds-bn/',
    atenURL: 'https://teleservices.ac-caen.fr/',

    extraParams: {
        origin: 'urn:fi:ac-caen:ts:1.0'
    }
});
