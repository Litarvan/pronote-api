module.exports = ({ username, password, url }) => require('./kdecole-wayf')({
    username,
    password,
    url,

    acName: 'Lille',
    casUrl: 'https://cas.savoirsnumeriques62.fr/',
    idp: 'ATS_parent_eleve',
    atenURL: 'https://teleservices.ac-lille.fr/login/'
});
