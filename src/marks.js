const { getPeriodBy } = require('./data/periods');
const getMarks = require('./fetch/marks');

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
        if (!mark.isAway) {
            res.value = mark.value;
        }

        subject.marks.push({
            title: mark.title,
            ...res,
            scale: mark.scale,
            average: mark.average,
            coefficient: mark.coefficient,
            min: mark.min,
            max: mark.max,
            date: mark.date,
            isAway: mark.isAway
        });
    }

    return result;
}

module.exports = marks;
