const ACCOUNTTYPE = ['student', 'parent'];
const STUDENT = { type: 'STUDENT', accountPage: 'eleve.html?login=true' };
const PARENT = { type: 'PARENT', accountPage: 'parent.html?login=true' };
const PROFESSOR = { type: 'PROFESSOR', accountPage: 'professeur.html?login=true' };
const ATTENDANT = { type: 'ATTENDANT', accountPage: 'accompagnant.html?login=true' };
const COMPANY = { type: 'COMPANY', accountPage: 'entreprise.html?login=true' };
const SCHOOLLIFE = { type: 'SCHOOLLIFE', accountPage: 'viescolaire.html?login=true' };

function getAccountType(acountype) {
    let result;

    switch (acountype.toLowerCase()) {
    case 'parent':
        result = PARENT;
        break;
    case 'professor':
        result = PROFESSOR;
        break;
    case 'attendant':
        result = ATTENDANT;
        break;
    case 'company':
        result = COMPANY;
        break;
    case 'schoollife':
        result = SCHOOLLIFE;
        break;
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
    STUDENT,
    PARENT,
    PROFESSOR,
    ATTENDANT,
    COMPANY,
    SCHOOLLIFE
};
