const parse = require('../../data/types');
const { toPronote } = require('../../data/objects');
const { toPronoteDate } = require('../../data/dates');
const { fromPronoteHours } = require('../../data/dates');

const navigate = require('./navigate');

const PAGE_NAME = 'PagePresence';
const TAB_ID = 19;
const ACCOUNTS = ['student', 'parent'];

async function getAbsences(session, user, period, from, to)
{
    const absences = await navigate(session, user, PAGE_NAME, TAB_ID, ACCOUNTS, {
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

    if (!absences) {
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
        events: parse(absences.listeAbsences, a => parseEvent(a), false),
        subjects: parse(absences.Matieres, ({
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
        recaps: parse(absences.listeRecapitulatifs, ({ NombreTotal, NbrHeures, NombreNonJustifie }) => ({
            count: NombreTotal,
            unjustifiedCount: NombreNonJustifie,
            hours: fromPronoteHours(NbrHeures)
        })),
        sanctions: parse(absences.listeSanctionUtilisateur) // TODO: Check values
    };
}

function parseEvent(a)
{
    switch (a.page.Absence) {
    case 13:
        return {
            type: 'absence',
            ...parseAbsence(a)
        };
    case 14:
        return {
            type: 'delay',
            ...parseDelay(a)
        };
    case 41:
        return {
            type: 'punishment',
            ...parsePunishment(a)
        };
    case 45:
        return {
            type: 'other',
            ...parseOther(a)
        };
    default:
        return {
            type: 'unknown',
            ...a
        };
    }
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
        reasons: parse(a.listeMotifs)
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
        reasons: parse(a.listeMotifs)
    };
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
        giver: parse(a.demandeur),
        isSchedulable: a.estProgrammable,
        reasons: parse(a.listeMotifs),
        schedule: parse(a.programmation, ({ date, placeExecution, duree }) => ({
            date: parse(date),
            position: placeExecution,
            duration: duree
        })),
        nature: a.nature && parse(a.nature, ({ estProgrammable, estAvecARParent }) => ({
            isSchedulable: estProgrammable,
            requiresParentsMeeting: estAvecARParent
        }))
    }
}

function parseOther(a)
{
    return {
        date: parse(a.date),
        giver: parse(a.demandeur, ({ estProfPrincipal, mail }) => ({
            isHeadTeacher: estProfPrincipal,
            mail
        })),
        comment: a.commentaire,
        read: a.estLue,
        subject: parse(a.matiere)
    };
}

module.exports = getAbsences;
