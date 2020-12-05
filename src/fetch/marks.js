const { getPeriodBy } = require('../data/periods');
const { withId, checkDuplicates } = require('../data/id');

const getMarks = require('./pronote/marks');

async function marks(session, user, period = null, type = null)
{
    const marks = await getMarks(session, user, getPeriodBy(session, period, type));
    if (!marks) {
        return null;
    }

    const result = {
        subjects: [],
        averages: {}
    };

    if (marks.studentAverage) {
        result.averages.student = Number((marks.studentAverage / marks.studentAverageScale * 20).toFixed(2));
    }
    if (marks.studentClassAverage) {
        result.averages.studentClass = Number(marks.studentClassAverage.toFixed(2));
    }

    for (const subject of marks.subjects.sort((a, b) => a.order - b.order)) {
        result.subjects.push({
            name: subject.name,
            averages: {
                student: subject.studentAverage / subject.studentAverageScale * 20,
                studentClass: subject.studentClassAverage,
                max: subject.maxAverage,
                min: subject.minAverage
            },
            color: subject.color,
            marks: []
        });
    }

    for (const mark of marks.marks) {
        const subject = result.subjects.find(s => s.name === mark.subject.name);
        if (!subject) {
            continue;
        }

        const res = {
            isAway: mark.value < 0
        };

        if (!res.isAway) {
            res.value = mark.value;
        }

        if (mark.average >= 0) {
            res.min = mark.min;
            res.max = mark.max;
            res.average = mark.average;
        }

        subject.marks.push(withId({
            title: mark.title,
            ...res,
            scale: mark.scale,
            coefficient: mark.coefficient,
            date: mark.date
        }, ['title', 'date'], subject.name));
    }

    result.subjects.forEach(s => checkDuplicates(s.marks));

    return result;
}

module.exports = marks;
