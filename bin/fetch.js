#!/usr/bin/env node

/* eslint no-console: off */

const fs = require('fs').promises;
const pronote = require('..');

if (process.argv.length < 5) {
    console.log('Syntax: pronote-fetch <URL> <username> <password> [cas(ex: none)] [AccountType (ex: Student)]');
    return;
}

const [,, url, username, password, cas = 'none', accountType] = process.argv;

async function fetch()
{
    let result;
    switch (accountType)
    {
    case 'parent':
        result = await parent();
        break;
    default:
        result = await student();
        break;
    }

    await fs.writeFile('result.json', JSON.stringify(result, null, 4));

    console.log('Wrote \'result.json\'');
}

async function student()
{
    const session = await pronote.login(url, username, password, cas);
    console.log(`Logged as student '${session.user.name}' (${session.user.studentClass.name})`);

    const { from, to } = getFetchDate(session);

    const timetable = await session.timetable(from, to);
    const marks = await session.marks();
    const evaluations = await session.evaluations();
    const absences = await session.absences();
    const infos = await session.infos();
    const contents = await session.contents(from, to);
    const homeworks = await session.homeworks(from, to);
    const menu = await session.menu(from, to);
    const files = await session.files();

    return {
        name: session.user.name,
        studentClass: session.user.studentClass.name,
        avatar: session.user.avatar,

        timetable, marks, evaluations, absences,
        infos, contents, homeworks, menu, files
    };
}

async function parent()
{
    const session = await pronote.loginParent(url, username, password, cas);
    console.log(`Logged as parent '${session.user.name}' (${session.user.students.length} students)`);

    const { from, to } = getFetchDate(session);

    const students = [];
    for (const student of session.user.students) {
        console.log(`Fetching data of user '${student.name}' (${student.studentClass.name})`);

        const timetable = await session.timetable(student, from, to);
        const marks = await session.marks(student);
        const evaluations = await session.evaluations(student);
        const absences = await session.absences(student);
        const infos = await session.infos(student);
        const contents = await session.contents(student, from, to);
        const homeworks = await session.homeworks(student, from, to);
        const menu = await session.menu(student, from, to);
        const files = await session.files(student);

        students.push({
            name: student.name,
            studentClass: student.studentClass.name,
            avatar: student.avatar,

            timetable, marks, evaluations, absences,
            infos, contents, homeworks, menu, files
        });
    }

    return {
        name: session.user.name,
        students
    };
}

function getFetchDate(session)
{
    let from = new Date();
    if (from < session.params.firstDay) {
        from = session.params.firstDay;
    }

    const to = new Date(from.getTime());
    to.setDate(to.getDate() + 15);

    return { from, to };
}

fetch().catch(err => {
    if (err.code === pronote.errors.WRONG_CREDENTIALS.code) {
        return console.error('Invalid credentials, did you chose the right CAS ?');
    }

    if (err.code !== undefined) {
        console.error(`ERROR: [${err.code}] ${err.message}`);
    } else {
        console.error(err);
    }
});
