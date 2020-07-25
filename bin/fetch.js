#!/usr/bin/env node

const pronote = require('..');

if (process.argv.length < 5) {
    console.log('Syntax: pronote-fetch <URL> <username> <password> [cas/type(ex: parent)]');
    return;
}

const [,, url, username, password, cas = 'none'] = process.argv;

async function fetch()
{
    const session = await pronote.login(url, username, password, cas);
    console.log(`Logged as '${session.user.name}' (${session.user.studentClass.name})`);

    // TODO
}

fetch().catch(err => {
    if (err.code === pronote.errors.WRONG_CREDENTIALS.code) {
        return console.error('Invalid credentials, did you chose the right CAS ?');
    }

    console.error(err);
});
