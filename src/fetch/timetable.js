const request = require('../request');
const parse = require('../types');
const navigate = require('./navigate');

const PAGE_NAME = 'PageEmploiDuTemps';
const TAB_ID = 16;

async function getTimetable(session, date = Date.now())
{
    const week = getSchoolWeek(session, date);
    const student = {
        N: session.user.id
        // Pronote also gives name (L) and gid? (G), but it works without
        // If at anytime this request gets denied, try giving them too
    };

    const { donnees: daysData } = await request(session, PAGE_NAME + '_DomainePresence', {
        _Signature_: {
            onglet: TAB_ID
        },
        donnees: {
            Ressource: student
        }
    });

    const timetable = await navigate(session, PAGE_NAME, TAB_ID, {
        avecAbsencesEleve: false,
        avecAbsencesRessource: true,
        avecConseilDeClasse: true,
        avecDisponibilites: true,
        avecInfosPrefsGrille: true,
        avecRessourceLibrePiedHoraire: false,
        estEDTPermanence: false,
        numeroSemaine: week, // *clown emoji*
        NumeroSemaine: week,
        ressource: student,
        Ressource: student
    });

    const weeks = parse(daysData.Domaine);
    const days = parse(daysData.JoursPresence);

    const result = {};

    if (timetable.avecExportICal) {
        result.iCal = `${session.server}ical/Edt.ics?icalsecurise=${timetable.ParametreExportiCal}&version=${session.params.version}`;
    }

    return result;
}

function getSchoolWeek(session, date)
{
    const firstWeek = getWeek(session.params.firstDay);
    const week = getWeek(date);

    if (week >= firstWeek) {
        return week - firstWeek + 1;
    }

    return 52 - (firstWeek - week) + 1; // Trust me this works
}

function getWeek(date)
{
    const firstDay = new Date((new Date()).getFullYear(), 0, 1);
    return Math.ceil( (((date - firstDay) / 86400000) + firstDay.getDay() + 1) / 7);
}

module.exports = getTimetable;