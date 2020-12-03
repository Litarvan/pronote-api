const aten = require('./generics/aten');

module.exports = (url, account, username, password) => aten.login({
    url,
    account,
    username,
    password,

    // eslint-disable-next-line max-len
    startURL: '/login/ct_logon_vk.jsp?CT_ORIG_URL=%2Fsso%2FSSO%3FSPEntityID%3Durn%3Afi%3Aent%3Alille-hdf-ts%3A1.0%26TARGET%3Dhttps%3A%2F%2Fwww.enthdf.fr%2F&ct_orig_uri=%2Fsso%2FSSO%3FSPEntityID%3Durn%3Afi%3Aent%3Alille-hdf-ts%3A1.0%26TARGET%3Dhttps%3A%2F%2Fwww.enthdf.fr%2F',
    atenURL: 'teleservices.ac-lille.fr'
});
