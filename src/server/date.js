const { GraphQLScalarType, Kind } = require('graphql');

module.exports = new GraphQLScalarType({
    name: 'Date',
    description: 'Equivalent of the JS Date type',

    parseValue(value) {
        return new Date(value);
    },
    serialize(value) {
        return value.getTime();
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return new Date(parseInt(ast.value));
        }

        return new Date(ast.value);
    }
});
