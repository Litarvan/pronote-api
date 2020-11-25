const { getPeriodBy } = require('../data/periods');
const { withId, checkDuplicates } = require('../data/id');

const getEvaluations = require('./pronote/evaluations');

async function evaluations(session, user, period = null, type = null)
{
    const evaluations = await getEvaluations(session, user, getPeriodBy(session, period, type));
    if (!evaluations) {
        return null;
    }

    const result = [];

    if (!evaluations) {
        return null;
    }

    for (const evaluation of evaluations) {
        let subject = result.find(s => s.name === evaluation.subject.name);
        if (!subject) {
            const { position, name, color } = evaluation.subject;
            subject = {
                position,
                name,
                teacher: evaluation.teacher.name,
                color,
                evaluations: []
            };

            result.push(subject);
        }

        subject.evaluations.push(withId({
            name: evaluation.name,
            date: evaluation.date,
            coefficient: evaluation.coefficient,
            levels: evaluation.acquisitionLevels.map(({ name, position, value, item, domain, pillar }) => ({
                name: item && item.name || domain.name,
                position,
                value: {
                    short: value,
                    long: name
                },
                prefixes: !pillar.prefixes[0] ? [] : pillar.prefixes
            }))
        }, ['name', 'date'], subject.name));
    }

    result.forEach(s => checkDuplicates(s.evaluations));

    result.sort((a, b) => a.position - b.position);
    result.forEach(s => {
        s.evaluations.forEach(e => {
            e.levels.sort((a, b) => a.position - b.position);
            e.levels.forEach(l => delete l.position);
        });

        return delete s.position;
    });

    return result;
}

module.exports = evaluations;
