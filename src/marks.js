/* eslint no-unused-vars: off */

const { getMarks } = require('./fetch/marks');
const { toPronote } = require('./data/objects');

async function Absence(session, periodString = null)
{
    const result = {
        marks_N: 0,
        marks: []
    };
    const periods = session.params.periods;

    for (const period of periods) {

        if (periodString) {
            if (period.name != periodString) continue;
        }

        const periodPronote = toPronote({
            id: period.id,
            name: period.name
        });

        const marks = await getMarks(session, periodPronote);

        if (marks.marks.length > 0)
        {
            result.marks_N =  result.marks_N + marks.marks_N;
            result['marks'].push({ period: period.id, ...marks });
        }
    }

    return result;
}

module.exports = Absence;
