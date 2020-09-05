const aten = require('./generics/aten');
const { getDOM } = require('./api');

module.exports = (url, account, username, password) => aten.login({
    url,
    account,
    username,
    password,

    // eslint-disable-next-line max-len
    startURL: 'https://nero.l-educdenormandie.fr/Shibboleth.sso/Login?entityID=urn:fi:ac-rouen:ts-EDUC-Normandie:1:0&target=',
    atenURL: 'sso-ent.ac-rouen.fr',

    postSubmit: ({ jar }) => getDOM({
        url: 'https://nero.l-educdenormandie.fr/c/portal/nero/access',
        jar
    })
});
