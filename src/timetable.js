/* eslint no-unused-vars: off */

const { toPronoteWeek } = require('./data/weeks');
const { getFilledDaysAndWeeks, getTimetable } = require('./fetch/timetable');

async function timetable(session, from = Date.now(), to = null)
{
    if (!to) {
        to = from;
    }

    const { filledWeeks, filledDays } = await getFilledDaysAndWeeks(session);

    const fromWeek = toPronoteWeek(session, from);
    const toWeek = toPronoteWeek(session, to);

    const weeks = [];
    for (let i = fromWeek; i <= toWeek; i++) {
        for (let j = 0; j < filledWeeks.length; j++) {
            if (filledWeeks[j] === i) {
                weeks.push(i);
                break;
            }
        }
    }

    const result = [];
    for (const week of weeks) {
        const timetable = await getTimetable(session, week);
        result.push(getTimetableWeek(session, timetable));

        // TODO: Filter days based on filledDays
    }

    return result;
}

function getTimetableWeek(session, table) {
    const result = {};

    // ...

    if (table.iCalId) {
        result.iCal = `${session.server}ical/Edt.ics?icalsecurise=${table.iCalId}&version=${session.params.version}`;
    }

    return result;
}

module.exports = timetable;
