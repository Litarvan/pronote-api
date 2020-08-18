const ACCOUNTTYPE = ['Student'];
const STUDENT = { type: 'STUDENT', accountPage: 'eleve.html?login=true' };


function getAccountType(acountype) {
    let result;

    switch (acountype.toLowerCase()) {
    case 'student':
    default:
        result = STUDENT;
        break;
    }
    return result
}

module.exports = {
    getAccountType,
    ACCOUNTTYPE,
    STUDENT
};
