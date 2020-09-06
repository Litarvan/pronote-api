module.exports = session => ({
    params: () => session.params,
    user: () => session.user,

    timetable: ({ from, to }) => session.timetable(from, to),
    marks: ({ period }) => session.marks(period),
    evaluations: ({ period }) => session.evaluations(period),
    absences: ({ period, from, to }) => session.absences(period, from, to),
    infos: () => session.infos(),
    contents: ({ from, to }) => session.contents(from, to),
    homeworks: ({ from, to }) => session.homeworks(from, to),
    menu: ({ from, to }) => session.menu(from, to),

    keepAlive: async () => {
        await session.keepAlive();
        return true;
    },

    setKeepAlive: async ({ enabled }) => {
        await session.setKeepAlive(enabled);
        return enabled;
    }
});
