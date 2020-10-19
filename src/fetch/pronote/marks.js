const parse = require('../../data/types');
const { toPronote } = require('../../data/objects');

const navigate = require('./navigate');

const PAGE_NAME = 'DernieresNotes';
const TAB_ID = 198;
const ACCOUNTS = ['student', 'parent'];

async function getMarks(session, user, period)
{
    const marks = await navigate(session, user, PAGE_NAME, TAB_ID, ACCOUNTS, {
        Periode: period.name ? toPronote(period) : period
    });

    if (!marks) {
        return null;
    }

    const result = {};

    if (marks.moyGenerale) {
        result.studentAverage = parse(marks.moyGenerale);
        result.studentAverageScale = parse(marks.baremeMoyGenerale);
        result.defaultStudentAverageScale = parse(marks.baremeMoyGeneraleParDefaut);
    }

    if (marks.moyGeneraleClasse) {
        result.studentClassAverage = parse(marks.moyGeneraleClasse);
    }

    return {
        ...result,
        subjects: marks.avecDetailService && parse(marks.listeServices, ({
            ordre, estServiceEnGroupe,
            moyEleve, baremeMoyEleve, baremeMoyEleveParDefaut, moyClasse, moyMax, moyMin,
            couleur
        }) => ({
            position: ordre,
            isGroupSubject: estServiceEnGroupe,
            studentAverage: parse(moyEleve),
            studentAverageScale: parse(baremeMoyEleve),
            defaultStudentAverageScale: parse(baremeMoyEleveParDefaut),
            studentClassAverage: parse(moyClasse),
            maxAverage: parse(moyMax),
            minAverage: parse(moyMin),
            color: couleur
        })) || [],
        marks: marks.avecDetailDevoir && parse(marks.listeDevoirs, ({
            note, bareme, baremeParDefaut, date, service, periode, moyenne, estEnGroupe, noteMax, noteMin,
            commentaire, coefficient
        }) => ({
            subject: parse(service, ({ couleur }) => ({
                color: couleur
            })),
            title: commentaire,
            value: parse(note),
            scale: parse(bareme),
            average: parse(moyenne),
            defaultScale: parse(baremeParDefaut),
            coefficient,
            min: parse(noteMin) || -1,
            max: parse(noteMax) || -1,
            date: parse(date),
            period: parse(periode),
            isGroupMark: estEnGroupe
        })) || []
    };
}

module.exports = getMarks;
