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
    console.log(session); // TODO
}

fetch().catch(err => console.error(err));
