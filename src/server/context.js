module.exports = session => ({
    params: () => session.params,
    user: () => session.user,

    timetable: ({ from, to }) => session.timetable(from, to),
    marks: ({ period }) => session.marks(period),
    evaluations: ({ period }) => session.evaluations(period),
    absences: ({ period }) => session.absences(period),
    infos: () => session.infos(),
    homeworks: ({ from, to }) => session.homeworks(from, to),
    menu: ({ from, to }) => session.menu(from, to)
});
