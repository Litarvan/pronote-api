/* eslint no-unused-vars: off */

const request = require('../request');

const parse = require('../data/types');
const { toPronote } = require('../data/objects');

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

    return {

    };
}

async function getFilledDaysAndWeeks(session) {
    const { donnees: daysData } = await request(session, PAGE_NAME + '_DomainePresence', {
        _Signature_: {
            onglet: TAB_ID
        },
        donnees: {
            Ressource: toPronote(session.user)
        }
    });

    return {
        filledWeeks: parse(daysData.Domaine),
        filledDays: parse(daysData.joursPresence)
    }
}

module.exports = {
    getTimetable,
    getFilledDaysAndWeeks
};
