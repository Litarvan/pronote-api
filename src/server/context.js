function common(session) {
    return {
        params: () => session.params,
        user: () => session.user,

        keepAlive: async () => {
            await session.keepAlive();
            return true;
        },
        logout: async () => {
            await session.logout();
            return true;
        },

        setKeepAlive: async ({ enabled }) => {
            await session.setKeepAlive(enabled);
            return enabled;
        }
    };
}

function student(session) {
    return {
        timetable: ({ from, to }) => session.timetable(from, to),
        marks: ({ period }) => session.marks(period),
        evaluations: ({ period }) => session.evaluations(period),
        absences: ({ period, from, to }) => session.absences(period, from, to),
        infos: () => session.infos(),
        contents: ({ from, to }) => session.contents(from, to),
        homeworks: ({ from, to }) => session.homeworks(from, to),
        menu: ({ from, to }) => session.menu(from, to)
    };
}

function parent(session) {
    function getStudent(student) {
        for (const s of session.user.students) {
            if (s.id === student || s.name === student) {
                return s;
            }
        }

        return null;
    }

    return {
        timetable: ({ student, from, to }) => session.timetable(getStudent(student), from, to),
        marks: ({ student, period }) => session.marks(getStudent(student), period),
        evaluations: ({ student, period }) => session.evaluations(getStudent(student), period),
        absences: ({ student, period, from, to }) => session.absences(getStudent(student), period, from, to),
        infos: ({ student }) => session.infos(getStudent(student)),
        contents: ({ student, from, to }) => session.contents(getStudent(student), from, to),
        homeworks: ({ student, from, to }) => session.homeworks(getStudent(student), from, to),
        menu: ({ student, from, to }) => session.menu(getStudent(student), from, to)
    };
}

function getContext(session) {
    const result = common(session);

    switch (session.type.name) {
    case 'student':
        return { ...result, ...student(session) };
    case 'parent':
        return { ...result, ...parent(session) };
    default:
        return result;
    }
}

module.exports = getContext;
