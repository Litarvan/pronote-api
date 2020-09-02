const parse = require('../../data/types');
const { toPronote } = require('../../data/objects');

const navigate = require('./navigate');

const PAGE_NAME = 'DernieresEvaluations';
const TAB_ID = 201;
const ACCOUNTS = ['student', 'parent'];

async function getEvaluations(session, user, period)
{
    const evaluations = await navigate(session, user, PAGE_NAME, TAB_ID, ACCOUNTS, {
        periode: period.name ? toPronote(period) : period
    });

    if (!evaluations) {
        return null;
    }

    return parse(evaluations.listeEvaluations, ({
        listeNiveauxDAcquisitions, listePaliers, matiere, individu, coefficient, descriptif, date, periode
    }) => ({
        title: descriptif,
        acquisitionLevels: parse(listeNiveauxDAcquisitions, ({
            abbreviation, ordre, pilier, coefficient, domaine, item
        }) => ({
            position: ordre,
            value: abbreviation,
            pillar: parse(pilier, ({ strPrefixes }) => ({
                prefixes: strPrefixes.split(', ')
            })),
            coefficient,
            domain: parse(domaine),
            item: item && parse(item) || null
        })),
        levels: parse(listePaliers),
        subject: parse(matiere, ({ couleur, ordre, serviceConcerne }) => ({
            position: ordre,
            service: parse(serviceConcerne),
            color: couleur
        })),
        teacher: parse(individu),
        coefficient,
        date: parse(date),
        period: parse(periode)
    }));
}

module.exports = getEvaluations;
