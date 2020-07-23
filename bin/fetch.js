#!/usr/bin/env node

const pronote = require('..');

if (process.argv.length < 5) {
    console.log('Syntax: pronote-fetch <URL> <username> <password> [cas/type(ex: parent)]');
    return;
}

const [,, url, username, password, cas = 'eleve'] = process.argv;
