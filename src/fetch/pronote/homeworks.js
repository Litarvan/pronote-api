const parse = require('../../data/types');

const navigate = require('./navigate');

const PAGE_NAME = 'PageCahierDeTexte';
const TAB_ID = 88;
const ACCOUNTS = ['student', 'parent'];

async function getHomeworks(session, user, fromWeek = 1, toWeek = null)
{
    if (!toWeek || toWeek < fromWeek) {
        toWeek = fromWeek;
    }

    const homeworks = await navigate(session, user, PAGE_NAME, TAB_ID, ACCOUNTS, {
        domaine: {
            _T: 8,
            V: `[${fromWeek}..${toWeek}]`
        }
    });

    if (!homeworks) {
        return null;
    }

    return parse(homeworks.ListeTravauxAFaire, ({
        descriptif, PourLe, TAFFait, niveauDifficulte, duree, cours, DonneLe,
        Matiere, CouleurFond, ListePieceJointe
    }) => ({
        description: parse(descriptif),
        lesson: parse(cours),
        subject: parse(Matiere),
        givenAt: parse(DonneLe),
        for: parse(PourLe),
        done: TAFFait,
        difficultyLevel: niveauDifficulte,
        duration: duree,
        color: CouleurFond,
        files: parse(ListePieceJointe)
    }));
}

module.exports = getHomeworks;
