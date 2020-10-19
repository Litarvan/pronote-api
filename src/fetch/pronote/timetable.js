const parse = require('../../data/types');
const { toPronote, fromPronote } = require('../../data/objects');

const navigate = require('./navigate');

const PAGE_NAME = 'PageEmploiDuTemps';
const TAB_ID = 16;
const ACCOUNTS = ['student', 'parent'];

async function getTimetable(session, user, week)
{
    const student = toPronote(session.user);
    const timetable = await navigate(session, user, PAGE_NAME, TAB_ID, ACCOUNTS, {
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

    if (!timetable || !timetable.ListeCours) {
        return null;
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
            content: parse(ListeContenus),
            hasHomework: AvecTafPublie,
            isCancelled: !!estAnnule,
            isDetention: !!estRetenue
        }))),
        // I was unable to witness a filled "absences.joursCycle", so didn't include it
        breaks: parse(timetable.recreations, ({ place }) => ({
            position: place
        }))
    };
}

async function getFilledDaysAndWeeks(session, user)
{
    const daysData = await navigate(session, user, PAGE_NAME + '_DomainePresence', TAB_ID, ACCOUNTS, {
        Ressource: toPronote(session.user)
    });

    if (!daysData) {
        return null;
    }

    return {
        filledWeeks: parse(daysData.Domaine),
        filledDays: parse(daysData.joursPresence)
    }
}

module.exports = {
    getTimetable,
    getFilledDaysAndWeeks
};
