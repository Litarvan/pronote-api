const request = require('../request');

const parse = require('../data/types');
const navigate = require('./navigate');

const PAGE_NAME = 'DernieresEvaluations';
const TAB_ID = 201;

async function getSkill(session, period) {

    const result = {
        skill: [],
        skill_N: 0,
    };

    const skills = await navigate(session, PAGE_NAME, TAB_ID, {
        periode: period
    });

    if (skills == null) return result;

    skills.listeEvaluations.V.forEach(skill => {
        let subjectId = skill.matiere.V.N;
        let subjectIndex = result.skill.findIndex(x => x.id === subjectId);

        if (subjectIndex == -1) {
            result.skill.push({
                name: skill.matiere.V.L,
                id: skill.matiere.V.N,
                prof: skill.individu.V.L,
                Evaluations: []
            });
        }
    });

    skills.listeEvaluations.V.forEach(skill => {
        let subjectId = skill.matiere.V.N;
        let subjectIndex = result.skill.findIndex(x => x.id === subjectId);

        const skillArray = [];
        result.skill_N++;
        skill.listeNiveauxDAcquisitions.V.forEach(skill=> {
            skillArray.push({
                id: skill.domaine.V.N,
                name: skill.domaine.V.L,
                value: skill.L,
                abbreviation: skill.abbreviation
            })
        })
        result.skill[subjectIndex].Evaluations.push({
            id: skill.N,
            name: skill.L,
            coefficient: skill.coefficient,
            time: parse(skill.date.V),
            period: (period, skill.periode.V.L),
            competences: skillArray
        });
    });

    return result;
}

module.exports = {
    getSkill
};
