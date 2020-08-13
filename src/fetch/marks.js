const request = require('../request');

const parse = require('../data/types');
const navigate = require('./navigate');

const PAGE_NAME = 'DernieresNotes';
const TAB_ID = 198;

async function getMarks(session, period) {

    const result = {
        marks: [],
        averages: {},
        marks_N: 0
    };

    const marks = await navigate(session, PAGE_NAME, TAB_ID, {
        Periode: period
    });

    if (marks.moyGenerale) {
        result.averages = {
            student: parse(marks.moyGenerale),
            studentClass: parse(marks.moyGeneraleClasse)
        };
    }

    result.marks = marks.listeServices.V.map(subject => {
        return {
            name: subject.L,
            id: subject.N,
            average: parse(subject.moyEleve),
            studentClassAverage: parse(subject.moyClasse),
            maxAverage: parse(subject.moyMax),
            minAverage: parse(subject.moyMin),
            marks: []
        };
    });

    result.marks_N = marks.listeDevoirs.V.length;

    marks.listeDevoirs.V.forEach(mark => {
        let subjectId = mark.service.V.N;
        let subjectIndex = result.marks.findIndex(x => x.id === subjectId);

        const value = parse(mark.note);

        result.marks[subjectIndex].marks.push({
            id: mark.N,
            subject: mark.service.V.L,
            title: mark.commentaire,
            value,
            away: value === -1 || isNaN(value) || value === null || value === undefined,
            max: parse(mark.bareme),
            average: parse(mark.moyenne),
            coefficient: mark.coefficient,
            higher: parse(mark.noteMax),
            lower: parse(mark.noteMin),
            time: parse(mark.date),
            period: (period, mark.periode.V.L)
        });
    });

    return result;
}

module.exports = {
    getMarks
};
