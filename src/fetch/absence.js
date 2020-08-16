// eslint-disable-file camelcase
const parse = require('../data/types');
const navigate = require('./navigate');

const { fromPronote } = require('./../data/objects');

const PAGE_NAME = 'PagePresence';
const TAB_ID = 19;

async function getAbsence(session, period, from, to) {

    const result = {
        OtherEvent: [],
        Punishment: [],
        Delay: [],
        Absence: [],
        OtherEventN: 0,
        PunishmentN: 0,
        DelayN: 0,
        AbsenceN: 0
    };


    const absences = await navigate(session, PAGE_NAME, TAB_ID, {
        DateDebut: {
            _T: 7,
            V: from
        },
        DateFin: {
            _T: 7,
            V: to
        },
        periode: period
    });

    if (absences === null) {
        return result;
    }

    for (const absence of absences.listeAbsences.V) {
        const returnAbsence = getType(absence);
        result[returnAbsence.name].push(returnAbsence.data);
    }

    result.OtherEventN = result.OtherEvent.length;
    result.PunishmentN = result.Punishment.length;
    result.DelayN = result.Delay.length;
    result.AbsenceN = result.Absence.length;

    return result;
}

function getType(absence) {

    const absenceType = absence.page.Absence;

    const data = {
        name: '',
        data: []
    }

    switch (absenceType) {
    case 45:
        data.name = 'OtherEvent';
        data.data = getType45(absence);
        break;
    case 41:
        data.name = 'Punishment';
        data.data = getType41(absence);
        break;
    case 14:
        data.name = ('Delay');
        data.data = (getType14(absence));
        break;
    case 13:
        data.name = 'Absence';
        data.data = getType13(absence);
        break;
    default:
        // eslint-disable-next-line no-console
        console.log(absence)
    }

    return data;
}

function getType45(absence) {
    return {
        name: absence.L,
        id: absence.N,
        date: parse(absence.date),
        giver: {
            name: absence.demandeur.V.L,
            headTeacher: absence.demandeur.V.estProfPrincipal,
            mail: absence.demandeur.V.mail
        },
        comment: absence.commentaire,
        read: absence.estLue,
        subject: fromPronote(parse(absence.matiere))
    };
}

function getType13(absence) {
    const reasons = [];
    for (const reason of absence.listeMotifs.V) {
        if (reason === null) {
            continue;
        }
        reasons.push(fromPronote(reason));
    }

    return {
        from: parse(absence.dateDebut),
        to: parse(absence.dateFin),
        opened: absence.ouverte,
        solved: absence.reglee,
        justified: absence.justifie,
        hours: absence.NbrHeures,
        days: absence.NbrJours,
        reason: reasons
    }
}

function getType41(absence) {

    const reasons = [];
    const programmations = [];

    for (const reason of absence.listeMotifs.V) {
        if (reason === null) {
            continue;
        }
        reasons.push(fromPronote(reason));
    }

    for (const programmation of absence.programmation.V) {
        if (programmation === null) {
            continue;
        }
        programmations.push(fromPronote(programmation));
    }

    return {
        date: parse(absence.dateDemande),
        isExclusion: absence.estUneExclusion,
        isNotDuringLesson: absence.horsCours,
        homework: absence.travailAFaire,
        isBoundToIncident: absence.estLieAUnIncident,
        circumstances: absence.circonstances,
        duration: absence.duree,
        giver: {
            name: absence.demandeur.V.L
        },
        isSchedulable: absence.estProgrammable,
        reason: reasons,
        schedule: programmations,
        nature: {
            name: absence.nature.V.L,
            id: absence.nature.V.N,
            isSchedulable: absence.nature.V.estProgrammable,
            isWithARParent: absence.nature.V.estAvecARParent
        }
    }
}

function getType14(absence) {

    const reasons = [];
    for (const reason of absence.listeMotifs.V) {
        if (reason === null) {
            continue;
        }
        reasons.push(fromPronote(reason));
    }

    return {
        date: parse(absence.date),
        solved: absence.reglee,
        justified: absence.justifie,
        justification: absence.justification,
        duration: absence.duree,
        reason: reasons
    }
}

module.exports = {
    getAbsence
};
