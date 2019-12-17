module.exports = ({ username, password, url }) => require('./kdecole-wayf')({
    username,
    password,
    url,

    acName: 'Nancy-Metz',
    casUrl: 'https://cas.monbureaunumerique.fr/',
    idp: 'NAN-ME-ATS',
    atenURL: 'https://teleservices.ac-nancy-metz.fr/login/'
});
