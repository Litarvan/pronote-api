/* eslint no-unused-vars: off */

const { getAbsence } = require('./fetch/absence');
const { toPronote } = require('./data/objects');

async function Absence(session, periodString = null)
{
    const result = [];
    const periods = session.params.periods;

    for (const period of periods) {

        if (periodString) {
            if (period.name !== periodString) {
                continue;
            }
        }
        if (period.type === 'year' || period.type === 'other') {
            continue;
        }

        const periodPronote = toPronote({
            id: period.id,
            name: period.name
        });

        const from = period.from.getUTCDate() + '/' + period.from.getMonth() + '/' + period.from.getFullYear() + ' 23:50:0';
        const to = period.to.getUTCDate() + '/' + period.to.getMonth() + '/' + period.to.getFullYear() + ' 23:50:0';

        const absence = await getAbsence(session, periodPronote, from, to);

        if (absence.Absence_N !== 0 || absence.Delay_N !== 0 || absence.Punishment_N !== 0 || absence.OtherEvent_N !== 0) {
            result.push({ period: period.id, periodName: period.name, ...absence });
        }
    }

    return result;
}

module.exports = Absence;
