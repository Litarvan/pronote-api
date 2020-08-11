const request = require('../request');
const parse = require('../data/types');
const { getUUID } = require('../cipher');

async function getParams(session, iv)
{
    const { donnees: params } = await request(session, 'FonctionParametres', {
        donnees: { Uuid: getUUID(session, iv || session.aesIV) }
    });

    const general = params.General;
    return {
        navigatorId: params.identifiantNav,
        fonts: parse(params.listePolices).map(o => o.L),
        withMember: params.avecMembre,
        forNewCaledonia: params.pourNouvelleCaledonie,
        loginImageId: params.genreImageConnexion,
        loginImageUrl: params.urlImageConnexion,
        cssLogo: params.logoProduitCss,
        theme: params.Theme,
        serverTime: parse(params.DateServeurHttp),
        mobileURL: params.URLMobile,
        mobileSupport: params.AvecEspaceMobile,
        title: params.Nom,
        indexEducationWebsite: parse(general.urlSiteIndexEducation),
        version: general.versionPN,
        versionFull: general.version,
        year: ~~general.millesime,
        language: { id: general.langID, name: general.langue },
        supportedLanguages: parse(general.listeLangues).map(({ langID, description }) => ({ id: langID, name: description })),
        infoPage: general.lienMentions,
        hasForum: general.avecForum,
        helpURL: parse(general.UrlAide),
        videosURL: parse(general.urlAccesVideos),
        twitterURL: parse(general.urlAccesTwitter),
        withLoginOptions: general.AvecChoixConnexion,
        establishment: general.NomEtablissement,
        displayWeeks: general.afficherSemainesCalendaires,
        schoolYear: general.AnneeScolaire,
        firstCycle: parse(general.dateDebutPremierCycle),
        firstDay: parse(general.PremiereDate),
        firstMonday: parse(general.PremierLundi),
        lastDay: parse(general.DerniereDate),
        ticksPerDay: general.PlacesParJour,
        ticksPerHour: general.PlacesParHeure,
        sequenceDuration: general.DureeSequence,
        ticksForHalfDayAbsence: general.PlaceDemiJourneeAbsence,
        hasLunch: general.activationDemiPension,
        lunchStart: general.debutDemiPension,
        lunchEnd: general.finDemiPension,
        withPlainAfternoonHours: general.AvecHeuresPleinesApresMidi,
        firstOrLastWorkingDay: parse(general.JourOuvre),
        workingDays: parse(general.JoursOuvres),
        lunchDays: parse(general.JoursDemiPension),
        parentsChat: general.ActivationMessagerieEntreParents,
        workingDaysPerCycle: general.joursOuvresParCycle,
        firstDayOfWeek: general.premierJourSemaine,
        timetableGridsInCycle: general.grillesEDTEnCycle,
        workingDaysCycle: parse(general.setOfJoursCycleOuvre),
        halfWorkingDays: general.DemiJourneesOuvrees.map(o => parse(o)),
        frequenciesRanges: general.DomainesFrequences.map(o => parse(o)),
        frequenciesLabels: general.LibellesFrequences,
        defaultMarkMax: parse(general.BaremeNotation),
        allowedAnnotations: parse(general.listeAnnotationsAutorisees),
        acquisitionLevels: parse(general.ListeNiveauxDAcquisitions).map(
            ({ L, N, G, listePositionnements, positionJauge, actifPour, abbreviation, raccourci,
                 couleur, ponderation, nombrePointsBrevet, estAcqui, estNotantPourTxReussite }) => ({
                id: N,
                name: L,
                count: G,

                positions: parse(listePositionnements).map(({ G, L, abbreviation, abbreviationAvecPrefixe }) => ({
                    name: L,
                    count: G,
                    shortName: abbreviation,
                    shortNameWithPrefix: abbreviationAvecPrefixe
                })),
                triggerPosition: positionJauge,
                activeFor: parse(actifPour),
                shortName: abbreviation,
                shortPath: raccourci,
                color: couleur,
                weighting: parse(ponderation),
                brevetPoints: parse(nombrePointsBrevet),
                acquired: estAcqui,
                countsForSuccess: estNotantPourTxReussite
            })
        ),
        displayAcquisitionShortLabel: general.AfficherAbbreviationNiveauDAcquisition,
        withEvaluationHistory: general.AvecEvaluationHistorique,
        withoutIntermediaryLevelAutoValidation: general.SansValidationNivIntermediairesDsValidAuto,
        onlySchoolYearEvaluationsInAutoValidation: general.NeComptabiliserQueEvalsAnneeScoDsValidAuto,
        CECRLLevelsSupport: general.AvecGestionNiveauxCECRL,
        langActivityColor: general.couleurActiviteLangagiere,
        minMarkMCQ: general.minBaremeQuestionQCM,
        maxMarkMCQ: general.maxBaremeQuestionQCM,
        maxPointsMCQ: general.maxNbPointQCM,
        skillsGridLabelSize: general.tailleLibelleElementGrilleCompetence,
        homeworkCommentSize: general.tailleCommentaireDevoir,
        officeEnabled: general.O365_Actif,
        officeFederatedMode: general.O365_ModeFederated,
        officeTutorial: parse(general.O365_UrlTuto_Office),
        oneDriveTutorial: parse(general.O365_UrlTuto_OneDrive),
        connexionInfoRetrieval: general.AvecRecuperationInfosConnexion,
        font: general.Police,
        fontSize: general.TaillePolice,
        attachedStudents: general.AvecElevesRattaches,
        phoneMask: general.maskTelephone,
        maxECTS: general.maxECTS,
        maxAppreciationSizes: general.TailleMaxAppreciation,
        publicHolidays: parse(general.listeJoursFeries).map(({ L, N, dateDebut, dateFin }) => ({
            id: N, name: L,
            from: parse(dateDebut), to: parse(dateFin)
        })),
        displaySequences: general.afficherSequences,
        firstHour: parse(general.PremiereHeure),
        hours: parse(general.ListeHeures).map(({ G, L, A }) => ({
            name: L, count: G, round: A === undefined
        })),
        endHours: parse(general.ListeHeuresFin).map(({ G, L, A }) => ({
            name: L, count: G, round: A === undefined
        })),
        sequences: general.sequences,
        periods: general.ListePeriodes.map(({ L, N, G, periodeNotation, dateDebut, dateFin }) => ({
            id: N,
            name: L,
            type: G === 1 ? 'trimester' : (G === 2 ? 'semester' : (G === 3 ? 'year' : 'other')),
            notationPeriod: periodeNotation,
            from: parse(dateDebut),
            to: parse(dateFin)
        })),
        logo: parse(general.logo),
        breaks: parse(general.recreations).map(({ L, place }) => ({
            name: L, position: place
        })),
        appCookieName: general.nomCookieAppli
    };
}

module.exports = getParams;