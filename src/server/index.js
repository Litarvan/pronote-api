const { graphql } = require('graphql');

const http = require('./http');
const context = require('./context');
const getSchemas = require('./schemas');
const { login, logout, getSession } = require('./auth');

async function start(host, port)
{
    const schemas = await getSchemas();

    await http(host, port, {
        graphql: ({ query, variables }, token) => handle(token, schemas, query, context, variables),
        login: params => login(params),
        logout: (_, token) => logout(token)
    });
}

async function handle(token, schemas, query, context, variables)
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
    if (!session) {
        throw {
            http: 401,
            message: 'Unknown session token'
        };
    }

    const schema = schemas[session.type.name];
    return await graphql(schema, query, context(session), null, variables);
}

module.exports = start;
