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
    const session = await pronote.login(url, username, password, cas, accountType);
    console.log(`Logged as '${session.user.name}' (${session.user.studentClass.name})`);

    let from = new Date();
    if (from < session.params.firstDay) {
        from = session.params.firstDay;
    }

    const to = new Date(from.getTime());
    to.setDate(to.getDate() + 15);

    const timetable = await session.timetable(from, to);
    const marks = await session.marks();
    const evaluations = await session.evaluations();
    const absences = await session.absences();
    const infos = await session.infos();
    const contents = await session.contents(from, to);
    const homeworks = await session.homeworks(from, to);
    const menu = await session.menu(from, to);

    const result = {
        name: session.user.name,
        studentClass: session.user.studentClass.name,
        avatar: session.user.avatar,

        timetable, marks, evaluations, absences,
        infos, contents, homeworks, menu
    };

    await fs.writeFile('result.json', JSON.stringify(result, null, 4));

    console.log('Wrote \'result.json\'');
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
