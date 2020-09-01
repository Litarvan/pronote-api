const { getPeriodBy } = require('../data/periods');
const getMarks = require('./pronote/marks');

async function marks(session, period = null)
{
    const marks = await getMarks(session, getPeriodBy(session, period));
    const result = {
        subjects: [],
        averages: {}
    };

    if (!marks) {
        return result;
    }

    if (marks.studentAverage) {
        result.averages.student = marks.studentAverage / marks.studentAverageScale * 20;
    }
    if (marks.studentClassAverage) {
        result.averages.studentClass = marks.studentClassAverage;
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

        const res = {};

        if (mark.value >= 0) {
            res.value = mark.value;
        } else {
            res.isAway = true;
        }

        if (mark.average >= 0) {
            res.min = mark.min;
            res.max = mark.max;
            res.average = mark.average;
        }

        subject.marks.push({
            title: mark.title,
            ...res,
            scale: mark.scale,
            coefficient: mark.coefficient,
            date: mark.date,
            isAway: mark.isAway
        });
    }

    return result;
}

module.exports = marks;
