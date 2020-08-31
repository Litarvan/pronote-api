const errors = require('./errors');

const ACCOUNTS = [
    { name: 'student', value: 'eleve', id: 3 },
    { name: 'parent', value: 'parent', id: 2 },
    { name: 'teacher', value: 'professeur', id: 1 },
    { name: 'attendant', value: 'accompagnant', id: 25 },
    { name: 'company', value: 'entreprise', id: 4 },
    { name: 'administration', value: 'viescolaire', id: 13 }
];

function getAccountType(type)
{
    for (const account of ACCOUNTS) {
        if (account.name === type) {
            return account;
        }
    }

    throw errors.UNKNOWN_ACCOUNT.drop(type);
}

module.exports = getAccountType;
