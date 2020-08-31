const path = require('path');

const fs = require('fs').promises;
const { graphql, buildSchema } = require('graphql');

const http = require('./http');
const context = require('./context');
const date = require('./date');
const { login, logout, getSession } = require('./auth');

async function start(host, port)
{
    const file = path.join(__dirname, 'schema.graphql');
    const content = await fs.readFile(file);
    const schema = buildSchema(content.toString());

    Object.assign(schema._typeMap.Date, date);

    await http(host, port, {
        graphql: ({ query, variables }, token) => handle(token, schema, query, context, variables),
        login: params => login(params),
        logout: (_, token) => logout(token)
    });
}

async function handle(token, schema, query, context, variables)
{
    if (!token) {
        throw {
            http: 401,
            message: 'Missing \'Token\' header'
        };
    }

    if (!query) {
        throw {
            http: 400,
            message: 'Missing \'query\' field or \'Content-Type: application/json\' header'
        };
    }

    const session = getSession(token);

    if (session) {
        return await graphql(schema, query, context(session), null, variables);
    }

    throw {
        http: 401,
        message: 'Unknown session token'
    };
}

module.exports = start;
