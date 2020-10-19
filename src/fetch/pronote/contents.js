const parse = require('../../data/types');
const { fromPronote } = require('../../data/objects');

const navigate = require('./navigate');

const PAGE_NAME = 'PageCahierDeTexte';
const TAB_ID = 89;
const ACCOUNTS = ['student', 'parent'];

async function getContents(session, user, fromWeek = 1, toWeek = null)
{
    if (!toWeek || toWeek < fromWeek) {
        toWeek = fromWeek;
    }

    const contents = await navigate(session, user, PAGE_NAME, TAB_ID, ACCOUNTS, {
        domaine: {
            _T: 8,
            V: `[${fromWeek}..${toWeek}]`
        }
    });

    if (!contents) {
        return null;
    }

    return {
        lessons: parse(contents.ListeCahierDeTextes, ({
            cours, verrouille, listeGroupes, Matiere, CouleurFond, listeProfesseurs, Date, DateFin,
            listeContenus, listeElementsProgrammeCDT
        }) => ({
            lesson: parse(cours),
            locked: verrouille,
            groups: parse(listeGroupes), // TODO: Check values
            subject: parse(Matiere),
            color: CouleurFond,
            teachers: parse(listeProfesseurs),
            from: parse(Date),
            to: parse(DateFin),
            content: parse(listeContenus, ({
                descriptif, categorie, parcoursEducatif, ListePieceJointe, training
            }) => ({
                description: parse(descriptif),
                category: parse(categorie),
                path: parcoursEducatif,
                files: parse(ListePieceJointe),
                training: parse(training).ListeExecutionsQCM.map(o => fromPronote(o)) // TODO: Check values
            })),
            skills: parse(listeElementsProgrammeCDT)
        })),
        resources: (({ listeRessources, listeMatieres }) => ({
            resources: parse(listeRessources), // TODO: Check values
            subjects: parse(listeMatieres) // TODO: Check values
        }))(parse(contents.ListeRessourcesPedagogiques)),
        // TODO: Check values
        numericalResources: parse(parse(contents.ListeRessourcesNumeriques).listeRessources)
    };
}

module.exports = getContents;
