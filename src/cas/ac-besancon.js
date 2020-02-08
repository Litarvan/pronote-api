module.exports = ({ username, password, url }) => require('./kdecole-wayf')({
    username,
    password,
    url,

    acName: 'Besançon',
    casUrl: 'https://cas.eclat-bfc.fr/',
    idp: 'BESANC-ATS_parent_eleve_2D',
    atenURL: 'https://teleservices.ac-besancon.fr/login/'
});
