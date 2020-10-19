const { fork } = require('child_process');
const { join } = require('path');

const DEMO_URL = 'https://demo.index-education.net/pronote/';
const DEMO_USERNAME = 'demonstration';
const DEMO_PASSWORD = 'pronotevs';

function test(type)
{
    fork(join(__dirname, 'fetch.js'), [DEMO_URL, DEMO_USERNAME, DEMO_PASSWORD, 'none', type], { stdio: 'inherit' });
}

['student', 'parent'].forEach(test);
