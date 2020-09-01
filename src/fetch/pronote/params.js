const parse = require('../../data/types');
const { fromPronote } = require('../../data/objects');

const request = require('../../request');

const { getUUID } = require('../../cipher');

async function getParams(session)
{
    const { donnees: params } = await request(session, 'FonctionParametres', {
        donnees: { Uuid: getUUID(session, session.aesIV) }
    });

    const general = params.General;
    return {
        navigatorId: params.identifiantNav,
        fonts: parse(params.listePolices, false).map(o => o.L),
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
        supportedLanguages: parse(general.listeLangues, false).map(({ langID, description }) => ({
            id: langID,
            name: description
        })),
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
        halfWorkingDays: general.DemiJourneesOuvrees.map(parse),
        frequenciesRanges: general.DomainesFrequences.map(parse),
        frequenciesLabels: general.LibellesFrequences,
        defaultMarkMax: parse(general.BaremeNotation),
        allowedAnnotations: parse(general.listeAnnotationsAutorisees),
        acquisitionLevels: parse(general.ListeNiveauxDAcquisitions, ({
            listePositionnements, positionJauge, actifPour, abbreviation, raccourci,
            couleur, ponderation, nombrePointsBrevet, estAcqui, estNotantPourTxReussite
        }) => ({
            positions: parse(listePositionnements, ({ abbreviation, abbreviationAvecPrefixe }) => ({
                shortName: abbreviation,
                shortNameWithPrefix: abbreviationAvecPrefixe
            }), 'count'),
            triggerPosition: positionJauge,
            activeFor: parse(actifPour),
            shortName: abbreviation,
            shortPath: raccourci,
            color: couleur,
            weighting: parse(ponderation),
            brevetPoints: parse(nombrePointsBrevet),
            acquired: estAcqui,
            countsForSuccess: estNotantPourTxReussite
        }), 'count'),
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
        publicHolidays: parse(general.listeJoursFeries, ({ dateDebut, dateFin }) => ({
            from: parse(dateDebut),
            to: parse(dateFin)
        })),
        displaySequences: general.afficherSequences,
        firstHour: parse(general.PremiereHeure),
        hours: parse(general.ListeHeures, ({ A }) => ({
            round: A === undefined
        }), 'count'),
        endHours: parse(general.ListeHeuresFin, ({ A }) => ({
            round: A === undefined
        }), 'count'),
        sequences: general.sequences,
        periods: general.ListePeriodes.map(p => fromPronote(p, ({ G, periodeNotation, dateDebut, dateFin }) => ({
            kind: G === 1 ? 'trimester' : (G === 2 ? 'semester' : (G === 3 ? 'year' : 'other')),
            notationPeriod: periodeNotation,
            from: parse(dateDebut),
            to: parse(dateFin)
        }), false)),
        logo: parse(general.logo),
        breaks: parse(general.recreations, ({ place }) => ({
            position: place
        })),
        appCookieName: general.nomCookieAppli
    };
}

module.exports = getParams;
