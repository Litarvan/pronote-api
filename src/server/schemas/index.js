const path = require('path');
const fs = require('fs');

const { buildSchema } = require('graphql');

const date = require('../date');

const SCHEMAS = ['student', 'parent'];

function readFile(name)
{
    return new Promise(resolve => {
        const file = path.join(__dirname, name);
        // eslint-disable-next-line node/prefer-promises/fs
        fs.readFile(file, (_err, content) => {
            resolve(content.toString());
        });
    })
}

async function readSchema(common, name)
{
    const content = await readFile(name + '.graphql');
    const schema = buildSchema(common + '\n' + content);

    Object.assign(schema._typeMap.Date, date);

    return schema;
}

async function getSchemas()
{
    const common = await readFile('common.graphql');
    const result = {};

    for (const schema of SCHEMAS) {
        result[schema] = await readSchema(common, schema);
    }

    return result;
}

module.exports = getSchemas;
