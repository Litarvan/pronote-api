const parse = require('../../data/types');
const { fromPronote } = require('../../data/objects');

const navigate = require('./navigate');

const PAGE_NAME = 'PageCahierDeTexte';
const TAB_ID = 89;
const ACCOUNTS = ['student'];

async function getContents(session, fromWeek = 1, toWeek = null)
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

    return {
        lessons: parse(contents.ListeCahierDeTextes).pronoteMap(({
            cours, verrouille, listeGroupes, Matiere, CouleurFond, listeProfesseurs, Date, DateFin,
            listeContenus, listeElementsProgrammeCDT
        }) => ({
            lesson: parse(cours).pronote(),
            locked: verrouille,
            groups: parse(listeGroupes).pronoteMap(), // TODO: Check values
            subject: parse(Matiere).pronote(),
            color: CouleurFond,
            teachers: parse(listeProfesseurs).pronoteMap(),
            from: parse(Date),
            to: parse(DateFin),
            content: parse(listeContenus).pronoteMap(({
                descriptif, categorie, parcoursEducatif, ListePieceJointe, training
            }) => ({
                description: parse(descriptif, null, true),
                htmlDescription: parse(descriptif),
                category: parse(categorie).pronote(),
                path: parcoursEducatif,
                files: parse(ListePieceJointe).pronoteMap(),
                training: parse(training).ListeExecutionsQCM.map(o => fromPronote(o)) // TODO: Check values
            })),
            skills: parse(listeElementsProgrammeCDT).pronoteMap()
        })),
        resources: (({ listeRessources, listeMatieres }) => ({
            resources: parse(listeRessources).pronoteMap(), // TODO: Check values
            subjects: parse(listeMatieres).pronoteMap() // TODO: Check values
        }))(parse(contents.ListeRessourcesPedagogiques)),
        // TODO: Check values
        numericalResources: parse(parse(contents.ListeRessourcesNumeriques).listeRessources).pronoteMap()
    };
}

module.exports = getContents;
