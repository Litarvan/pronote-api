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

    const contents = await navigate(session, PAGE_NAME, TAB_ID, ACCOUNTS, {
        domaine: {
            _T: 8,
            V: `[${fromWeek}..${toWeek}]`
        }
    });

    if (!contents) {
        return null;
    }

    const obj =  parse(contents.ListeTravauxAFaire).pronoteMap(({
            descriptif, PourLe, TAFFait, niveauDifficulte, duree, cahierDeTextes, cours, DonneLe,
            Matiere, CouleurFond, ListePieceJointe
        }) => ({
            lesson: parse(cours).pronote(),
            subject: parse(Matiere).pronote(),
            color: CouleurFond,
            givenAt: parse(DonneLe),
            for: parse(PourLe)
        }))
    return obj
}

module.exports = getHomeworks;
