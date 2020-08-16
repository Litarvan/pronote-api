const parse = require('../data/types');
const { toPronote } = require('../data/objects');

const navigate = require('./navigate');

const PAGE_NAME = 'DernieresEvaluations';
const TAB_ID = 201;

async function getEvaluations(session, period)
{
    const evaluations = await navigate(session, PAGE_NAME, TAB_ID, {
        periode: period.name ? toPronote(period) : period
    });

    if (!evaluations) {
        return null;
    }

    return parse(evaluations.listeEvaluations).pronoteMap(({
        listeNiveauxDAcquisitions, listePaliers, matiere, individu, coefficient, descriptif, date, periode
    }) => ({
        title: descriptif,
        acquisitionLevels: parse(listeNiveauxDAcquisitions).pronoteMap(({
            abbreviation, ordre, pilier, coefficient, domaine, item
        }) => ({
            position: ordre,
            value: abbreviation,
            pillar: parse(pilier).pronote(({ strPrefixes }) => ({
                prefixes: strPrefixes.split(', ')
            })),
            coefficient,
            domain: parse(domaine).pronote(),
            item: item && parse(item).pronote() || null
        })),
        levels: parse(listePaliers).pronoteMap(),
        subject: parse(matiere).pronote(({ couleur, ordre, serviceConcerne }) => ({
            position: ordre,
            service: parse(serviceConcerne).pronote(),
            color: couleur
        })),
        teacher: parse(individu).pronote(),
        coefficient,
        date: parse(date),
        period: parse(periode).pronote()
    }));
}

module.exports = getEvaluations;
