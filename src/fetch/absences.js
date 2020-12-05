const { getPeriodBy } = require('../data/periods');
const { withId, checkDuplicates } = require('../data/id');

const getAbsences = require('./pronote/absences');

// eslint-disable-next-line complexity
async function absences(session, user, period = null, from = null, to = null, type = null)
{
    const result = {
        absences: [],
        delays: [],
        punishments: [],
        other: [],
        totals: []
    };

    const p = getPeriodBy(session, !period && !type && from && to ? 'Trimestre 1' : period, type);
    const absences = await getAbsences(session, user, p, from || p.from, to || p.to);
    if (!absences) {
        return null;
    }

    for (const event of absences.events) {
        // eslint-disable-next-line default-case
        switch (event.type) {
        case 'absence':
            result.absences.push(withId({
                from: event.from,
                to: event.to,
                justified: event.justified,
                solved: event.solved,
                hours: event.hours,
                reason: event.reasons.length && event.reasons[0].name || ''
            }, ['from', 'to']));
            break;
        case 'delay':
            result.delays.push(withId({
                date: event.date,
                justified: event.justified,
                solved: event.solved,
                justification: event.justification,
                minutesMissed: event.duration,
                reason: event.reasons.length && event.reasons[0].name || ''
            }, ['data', 'minutesMissed']));
            break;
        case 'punishment':
            // eslint-disable-next-line no-case-declarations
            let detention = null;
            if (event.nature.type === 1) {
                const schedule = event.schedule[0];
                const hour = session.params.firstHour.getHours() + schedule.position / session.params.ticksPerHour;

                const from = new Date(schedule.date.getTime());
                const to = new Date(schedule.date.getTime());

                from.setHours(from.getHours() + hour);
                to.setHours(to.getHours() + hour);
                to.setMinutes(to.getMinutes() + schedule.duration);

                detention = { from, to };
            }

            result.punishments.push(withId({
                date: event.date,
                isExclusion: event.isExclusion,
                isDuringLesson: !event.isNotDuringLesson,
                homework: event.homework,
                circumstances: event.circumstances,
                giver: event.giver.name,
                reason: event.reasons.length && event.reasons[0].name || '',
                detention
            }, ['data']));
            break;
        case 'other':
            result.other.push(withId({
                kind: event.name,
                date: event.date,
                giver: event.giver.name,
                comment: event.comment,
                subject: event.subject && event.subject.name || null
            }, ['kind', 'date']));
            break;
        }
    }

    Object.values(result).forEach(checkDuplicates);

    if (absences.subjects) {
        for (const subject of absences.subjects) {
            if (subject.inGroup) {
                continue;
            }

            const res = parseSubject(subject);
            if (subject.group) {
                res.subs = absences.subjects.filter(s => s.inGroup === subject.group).map(s => parseSubject(s));
            }

            result.totals.push(res);
        }
    }

    return result;
}

function parseSubject(subject) {
    return {
        subject: subject.name,
        hoursAssisted: subject.hoursAssisted,
        hoursMissed: subject.hoursMissed
    };
}

module.exports = absences;
