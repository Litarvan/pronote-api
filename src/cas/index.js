/* eslint-disable array-element-newline */

const find = require('./find');

const CAS = [
    'ac-besancon', 'ac-bordeaux', 'ac-caen', 'ac-clermont', 'ac-dijon',
    'ac-grenoble', 'ac-lille', 'ac-limoges', 'ac-lyon', 'ac-montpellier',
    'ac-nancy-metz', 'ac-nantes', 'ac-orleans-tours', 'ac-poitiers',
    'ac-reims', 'ac-rouen', 'ac-strasbourg', 'ac-toulouse', 'Eure-Normandie',

    'agora06', 'arsene76',

    'haute-garonne', 'hdf', 'iledefrance', 'seine-et-marne', 'somme', 'lyceeconnecte', 'ljr-munich',

    'toutatice', 'laclasse',

    'none'
];

module.exports = {
    getCAS: find,
    list: CAS
};

for (const cas of CAS) {
    // eslint-disable-next-line node/global-require
    module.exports[cas] = require('./' + cas);
}

