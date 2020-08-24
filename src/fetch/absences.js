const parse = require('../data/types');
const { toPronote } = require('../data/objects');
const { fromPronote } = require('./../data/objects');
const { toPronoteDate } = require('../data/dates');

const navigate = require('./navigate');
const { fromPronoteHours } = require('../data/dates');

const PAGE_NAME = 'PagePresence';
const TAB_ID = 19;

async function getAbsences(session, period, from, to)
{
    const absences = await navigate(session, PAGE_NAME, TAB_ID, {
        DateDebut: {
            _T: 7,
            V: toPronoteDate(from)
        },
        DateFin: {
            _T: 7,
            V: toPronoteDate(to)
        },
        periode: period.name ? toPronote(period) : period
    });

    if (absences === null) {
        return null;
    }

    return {
        authorizations: (a => ({
            absences: a.absence,
            fillAbsenceReason: a.saisieMotifAbsence,
            delays: a.retard,
            fillDelayReason: a.saisieMotifRetard,
            punishments: a.punition,
            exclusions: a.exclusion,
            sanctions: a.sanction,
            conservatoryMesures: a.mesureConservatoire,
            infirmary: a.infirmerie,
            mealAbsences: a.absenceRepas,
            internshipAbsences: a.absenceInternat,
            observations: a.observation,
            incidents: a.incident,
            totalHoursMissed: a.totalHeuresManquees
        }))(absences.autorisations),
        events: parse(absences.listeAbsences).pronoteMap(a => parseEvent(a), false),
        subjects: parse(absences.Matieres).pronoteMap(({
            P, regroupement, dansRegroupement, suivi, absence, excluCours, excluEtab
        }) => ({
            position: P,
            group: regroupement,
            inGroup: dansRegroupement,
            hoursAssisted: suivi / 3600,
            hoursMissed: absence / 3600,
            lessonExclusions: excluCours,
            establishmentExclusions: excluEtab
        })),
        recaps: parse(absences.listeRecapitulatifs).pronoteMap(({ NombreTotal, NbrHeures, NombreNonJustifie }) => ({
            count: NombreTotal,
            unjustifiedCount: NombreNonJustifie,
            hours: fromPronoteHours(NbrHeures)
        })),
        sanctions: parse(absences.listeSanctionUtilisateur).pronoteMap() // TODO: Check values
    };
}

function parseEvent(a)
{
    switch (a.page.Absence) {
    case 45:
        return {
            type: 'other',
            ...parseOther(a)
        };
    case 41:
        return {
            type: 'punishment',
            ...parsePunishment(a)
        };
    case 14:
        return {
            type: 'delay',
            ...parseDelay(a)
        };
    case 13:
        return {
            type: 'absence',
            ...parseAbsence(a)
        };
    default:
        return {
            type: 'unknown',
            ...a
        };
    }
}

function parseOther(a)
{
    return {
        date: parse(a.date),
        giver: parse(a.demandeur).pronote(({ estProfPrincipal, mail }) => ({
            isHeadTeacher: estProfPrincipal,
            mail
        })),
        comment: a.commentaire,
        read: a.estLue,
        subject: fromPronote(parse(a.matiere))
    };
}

function parseAbsence(a)
{
    return {
        from: parse(a.dateDebut),
        to: parse(a.dateFin),
        opened: a.ouverte,
        solved: a.reglee,
        justified: a.justifie,
        hours: fromPronoteHours(a.NbrHeures),
        days: a.NbrJours,
        reasons: parse(a.listeMotifs).pronoteMap()
    }
}

function parsePunishment(a)
{
    return {
        date: parse(a.dateDemande),
        isExclusion: a.estUneExclusion,
        isNotDuringLesson: a.horsCours,
        homework: a.travailAFaire,
        isBoundToIncident: a.estLieAUnIncident,
        circumstances: a.circonstances,
        duration: a.duree,
        giver: {
            name: a.demandeur.V.L
        },
        isSchedulable: a.estProgrammable,
        reasons: parse(a.listeMotifs).pronoteMap(),
        schedule: parse(a.programmation).pronoteMap(({ date, placeExecution, duree }) => ({
            date: parse(date),
            position: placeExecution,
            duration: duree
        })),
        nature: a.nature && parse(a.nature).pronote(({ estProgrammable, estAvecARParent }) => ({
            isSchedulable: estProgrammable,
            requiresParentsMeeting: estAvecARParent
        }))
    }
}

function parseDelay(a)
{
    return {
        date: parse(a.date),
        solved: a.reglee,
        justified: a.justifie,
        justification: a.justification,
        duration: a.duree,
        reasons: parse(a.listeMotifs).pronoteMap()
    };
}

module.exports = getAbsences;
