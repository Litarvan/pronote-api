const request = require('../request');
const parse = require('../data/types');

async function getUser(session)
{
    const { donnees: user } = await request(session, 'ParametresUtilisateur');

    const res = user.ressource;
    const establishment = parse(res.Etablissement);

    return {
        id: res.N,
        name: res.L,
        establishment: {
            id: establishment.N,
            name: establishment.L
        },
        hasAvatar: res.avecPhoto,
        studentClass: {
            id: res.classeDEleve.N,
            name: res.classeDEleve.L
        },
        classHistory: parse(res.listeClassesHistoriques).map(({ L, N, AvecNote, AvecFiliere }) => ({
            id: N,
            name: L,
            hadMarks: AvecNote,
            hadOptions: AvecFiliere
        })),
        groups: parse(res.listeGroupes).map(({ L, N }) => ({ id: N, name: L })),
        tabsPillars: parse(res.listeOngletsPourPiliers).map(({ G, listePaliers }) => ({
            tab: G,
            levels: parse(listePaliers).map(({ L, N, listePiliers }) => ({
                id: N,
                name: L,
                pillars: parse(listePiliers).map(({ L, N, estPilierLVE, estSocleCommun, Service }) => ({
                    id: L,
                    name: N,
                    isForeignLanguage: estPilierLVE,
                    isCoreSkill: estSocleCommun,
                    subject: Service && (({ N, L }) => ({ id: N, name: L }))(parse(Service))
                }))
            }))
        })),
        tabsPeriods: parse(res.listeOngletsPourPeriodes).map(({ G, listePeriodes, periodeParDefaut }) => ({
            tab: G,
            periods: parse(listePeriodes).map(({ L, N, GenreNotation }) => ({
                id: N,
                name: L,
                isCorePeriod: GenreNotation === 1
            })),
            defaultPeriod: parse(periodeParDefaut).L
        })),
        establishmentsInfo: parse(user.listeInformationsEtablissements).map(({ L, N, Logo, Coordonnees }) => ({
            id: N,
            name: L,
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
        authorizations: (a => ({
            discussions: a.AvecDiscussion,
            teachersDiscussions: a.AvecDiscussionProfesseurs,
            timetableVisibleWeeks: parse(a.cours.domaineConsultationEDT),
            canEditLessons: parse(a.cours.domaineModificationCours),
            hideClassParts: a.cours.masquerPartiesDeClasse,
            maxEstablishmentFileSize: a.tailleMaxDocJointEtablissement,
            maxUserWorkFileSize: a.tailleMaxRenduTafEleve,
            hasPassword: a.compte.avecSaisieMotDePasse,
            hasPersonalInfo: a.compte.avecInformationsPersonnelles,
            canPrint: a.autoriserImpression
        }))(user.autorisations),
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

module.exports = getUser;
