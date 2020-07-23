#!/usr/bin/env node

const pronote = require('..');

if (process.argv.length < 5) {
    console.log('Syntax: pronote-api-server [port (default: 21727)] [host (default: 0.0.0.0)]');
    return;
}

const [,, port = '21727', host = '0.0.0.0'] = process.argv;
