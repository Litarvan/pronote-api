const parse = require('../../data/types');
const { fromPronote } = require('../../data/objects');

const navigate = require('./navigate');

const PAGE_NAME = 'PageCahierDeTexte';
const TAB_ID = 88;
const ACCOUNTS = ['student'];

async function getHomeworks(session, fromWeek = 1, toWeek = null)
{
    if (!toWeek || toWeek < fromWeek) {
        toWeek = fromWeek;
    }

    const homeworks = await navigate(session, PAGE_NAME, TAB_ID, ACCOUNTS, {
        domaine: {
            _T: 8,
            V: `[${fromWeek}..${toWeek}]`
        }
    });

    if (!homeworks) {
        return null;
    }

    const obj =  parse(homeworks.ListeTravauxAFaire).pronoteMap(({
            descriptif, PourLe, TAFFait, niveauDifficulte, duree, cahierDeTextes, cours, DonneLe,
            Matiere, CouleurFond, ListePieceJointe
        }) => ({
            lesson: parse(cours).pronote(),
            subject: parse(Matiere).pronote(),
            color: CouleurFond,
            givenAt: parse(DonneLe),
            for: parse(PourLe),
            done: TAFFait,
            difficultyLevel: niveauDifficulte,
            description: parse(descriptif),
            files: parse(ListePieceJointe).pronoteMap()
        }))
    return obj
}

module.exports = getHomeworks;
