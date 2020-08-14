const parse = require('../data/types');
const { toPronote, fromPronote } = require('../data/objects');

const navigate = require('./navigate');

const PAGE_NAME = 'PageEmploiDuTemps';
const TAB_ID = 16;

async function getTimetable(session, week) {
    const student = toPronote(session.user);
    const timetable = await navigate(session, PAGE_NAME, TAB_ID, {
        avecAbsencesEleve: false, // TODO: Test what those parameters do
        avecAbsencesRessource: true,
        avecConseilDeClasse: true,
        avecDisponibilites: true,
        avecInfosPrefsGrille: true,
        avecRessourceLibrePiedHoraire: false,
        estEDTPermanence: false,
        numeroSemaine: week, // *Clown emoji*
        NumeroSemaine: week,
        ressource: student,
        Ressource: student
    });

    if (!timetable) {
        return [];
    }

    let iCalURL = null;
    if (timetable.avecExportICal) {
        const id = timetable.ParametreExportiCal;
        iCalURL = `${session.server}ical/Edt.ics?icalsecurise=${id}&version=${session.params.version}`;
    }

    return {
        hasCancelledLessons: timetable.avecCoursAnnule,
        iCalURL,
        lessons: timetable.ListeCours.map(o => fromPronote(o, ({
            place, duree, DateDuCours, CouleurFond, ListeContenus, AvecTafPublie, Statut, estAnnule, estRetenue
        }) => ({
            position: place,
            duration: duree,
            date: parse(DateDuCours),
            status: Statut,
            color: CouleurFond,
            content: parse(ListeContenus).pronoteMap(),
            hasHomework: AvecTafPublie,
            isCancelled: !!estAnnule,
            isDetention: !!estRetenue
        }))),
        // I was unable to witness a filled "absences.joursCycle", so didn't include it
        breaks: parse(timetable.recreations).pronoteMap(({ place }) => ({
            position: place
        }))
    };
}

async function getFilledDaysAndWeeks(session) {
    const daysData = await navigate(session, PAGE_NAME + '_DomainePresence', TAB_ID, {
        Ressource: toPronote(session.user)
    });

    return {
        filledWeeks: parse(daysData.Domaine) || [],
        filledDays: parse(daysData.joursPresence) || []
    }
}

module.exports = {
    getTimetable,
    getFilledDaysAndWeeks
};
