const request = require('../../request');

const parse = require('../../data/types');
const { getFileURL } = require('../../data/files');
const { fromPronote } = require('../../data/objects');

async function getUser(session)
{
    const { donnees: user } = await request(session, 'ParametresUtilisateur');
    const { data, authorizations } = getSpecificData(session, user);

    const res = user.ressource;
    const aut = user.autorisations;

    return {
        ...fromPronote(res),
        ...data,
        establishmentsInfo: parse(user.listeInformationsEtablissements, ({ Logo, Coordonnees }) => ({
            logoID: parse(Logo),
            address: [Coordonnees.Adresse1, Coordonnees.Adresse2],
            postalCode: Coordonnees.CodePostal,
            postalLabel: Coordonnees.LibellePostal,
            city: Coordonnees.LibelleVille,
            province: Coordonnees.Province,
            country: Coordonnees.Pays,
            website: Coordonnees.SiteInternet
        })),
        userSettings: (({ version, EDT, theme, Communication }) => ({
            version,
            timetable: {
                displayCanceledLessons: EDT.afficherCoursAnnules,
                invertAxis: EDT.axeInverseEDT,
                invertWeeklyPlanAxis: EDT.axeInversePlanningHebdo,
                invertDayPlanAxis: EDT.axeInversePlanningJour,
                invertDay2PlanAxis: EDT.axeInversePlanningJour2,
                dayCount: EDT.nbJours,
                resourceCount: EDT.nbRessources,
                daysInTimetable: EDT.nbJoursEDT,
                sequenceCount: EDT.nbSequences
            },
            theme: theme.theme,
            unreadDiscussions: Communication.DiscussionNonLues
        }))(user.parametresUtilisateur),
        sessionAuthorizations: {
            twitterManagement: user.autorisationsSession.fonctionnalites.gestionTwitter,
            expandedAttestation: user.autorisationsSession.fonctionnalites.attestationEtendue
        },
        authorizations: {
            discussions: aut.AvecDiscussion,
            teachersDiscussions: aut.AvecDiscussionProfesseurs,
            timetableVisibleWeeks: parse(aut.cours.domaineConsultationEDT),
            canEditLessons: parse(aut.cours.domaineModificationCours),
            hideClassParts: aut.cours.masquerPartiesDeClasse,
            maxEstablishmentFileSize: aut.tailleMaxDocJointEtablissement,
            editPassword: aut.compte.avecSaisieMotDePasse,
            editPersonalInfo: aut.compte.avecInformationsPersonnelles,
            canPrint: aut.autoriserImpression,
            ...authorizations
        },
        minPasswordSize: user.reglesSaisieMDP.min,
        maxPasswordSize: user.reglesSaisieMDP.max,
        passwordRules: parse(user.reglesSaisieMDP.regles),
        kioskAccess: user.autorisationKiosque,
        tabs: user.listeOnglets.map(parseTab),
        hiddenTabs: user.listeOngletsInvisibles,
        notifiedTabs: user.listeOngletsNotification
    };
}

function parseTab({ G: id, Onglet: subs })
{
    return { id, subs: (subs || []).map(parseTab) };
}

function getSpecificData(session, data)
{
    switch (session.type.name)
    {
    case 'student':
        return getStudentData(session, data);
    case 'parent':
        return getParentData(session, data);
    case 'teacher':

        break;
    case 'administration':

        break;
    default:
        return {};
    }
}

function getStudentData(session, data)
{
    return {
        data: getStudent(session, data.ressource),
        authorizations: {
            maxUserWorkFileSize: data.autorisations.tailleMaxRenduTafEleve
        }
    };
}

function getStudent(session, res)
{
    const avatar = {};
    if (res.avecPhoto) {
        avatar.avatar = getFileURL(session, {
            id: res.N,
            name: 'photo.jpg'
        });
    }

    return {
        ...fromPronote(res),
        establishment: parse(res.Etablissement),
        ...avatar,
        studentClass: fromPronote(res.classeDEleve),
        classHistory: parse(res.listeClassesHistoriques, ({ AvecNote, AvecFiliere }) => ({
            hadMarks: AvecNote,
            hadOptions: AvecFiliere
        })),
        groups: parse(res.listeGroupes),
        tabsPillars: parse(res.listeOngletsPourPiliers, ({ listePaliers }) => ({
            levels: parse(listePaliers, ({ listePiliers }) => ({
                pillars: parse(listePiliers, ({ estPilierLVE, estSocleCommun, Service }) => ({
                    isForeignLanguage: estPilierLVE,
                    isCoreSkill: estSocleCommun,
                    subject: Service && parse(Service)
                }))
            }))
        }), 'tab'),
        tabsPeriods: parse(res.listeOngletsPourPeriodes, ({ listePeriodes, periodeParDefaut }) => ({
            periods: parse(listePeriodes, ({ GenreNotation }) => ({
                isCorePeriod: GenreNotation === 1
            })),
            defaultPeriod: parse(periodeParDefaut)
        }), 'tab')
    };
}

function getParentData(session, data)
{
    const res = data.ressource;
    const aut = data.autorisations;

    return {
        data: {
            isDelegate: res.estDelegue,
            isBDMember: res.estMembreCA,
            canDiscussWithManagers: res.avecDiscussionResponsables,
            absencesReasons: parse(data.listeMotifsAbsences),
            delaysReasons: parse(data.listeMotifsRetards),
            classDelegates: parse(res.listeClassesDelegue),
            students: res.listeRessources.map(r => fromPronote(r, ({ listeSessions }) => ({
                ...getStudent(session, r),
                sessions: parse(listeSessions, ({ date, strHeureDebut, strHeureFin }) => ({
                    from: getDateWithHours(parse(date), strHeureDebut),
                    to: getDateWithHours(parse(date), strHeureFin)
                }))
            })))
        },
        authorizations: {
            staffDiscussion: aut.AvecDiscussionPersonnels,
            parentsDiscussion: aut.AvecDiscussionParents,
            editStudentPassword: aut.compte.avecSaisieMotDePasseEleve,
            editCoordinates: aut.compte.avecSaisieInfosPersoCoordonnees,
            editAuthorizations: aut.compte.avecSaisieInfosPersoAutorisations
        }
    };
}

function getDateWithHours(date, hours)
{
    const h = hours.indexOf('h');

    date.setHours(date.getHours() + ~~hours.substring(0, h));
    date.setMinutes(date.getMinutes() + ~~hours.substring(h));

    return date;
}

module.exports = getUser;
