/* eslint no-unused-vars: off */

const { getSkill } = require('./fetch/skill');
const { toPronote } = require('./data/objects');

async function skill(session, periodString = null)
{
    const result = {
        skill_N: 0,
        skill: []
    };
    const periods = session.params.periods;

    for (const period of periods) {

        if (periodString) {
            if (period.name != periodString) continue;
        }

        const periodPronote = toPronote({
            id: period.id,
            name: period.name,
            G: 2
        });

        const skill = await getSkill(session, periodPronote);

        if (skill.skill.length > 0)
        {
            result.skill_N =  result.skill_N + skill.skill_N;
            result['skill'].push({ period: period.id, ...skill });
        }
    }

    return result;
}

module.exports = skill;
