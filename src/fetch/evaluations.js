const parse = require('../data/types');
const { fromPronote, toPronote } = require('../data/objects');

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
            pillar: fromPronote(parse(pilier), ({ strPrefixes }) => ({
                prefixes: strPrefixes.split(', ')
            })),
            coefficient,
            domain: fromPronote(parse(domaine)),
            item: item && fromPronote(parse(item)) || null
        })),
        levels: parse(listePaliers).pronoteMap(),
        subject: fromPronote(parse(matiere), ({ couleur, ordre, serviceConcerne }) => ({
            position: ordre,
            service: fromPronote(parse(serviceConcerne)),
            color: couleur
        })),
        teacher: fromPronote(parse(individu)),
        coefficient,
        date: parse(date),
        period: fromPronote(parse(periode))
    }));
}

module.exports = getEvaluations;
