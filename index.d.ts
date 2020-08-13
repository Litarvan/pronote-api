import * as forge from 'node-forge';

// High-level API

export interface PronoteSession
{
    id: number,
    server: string,
    target: PronoteTarget,

    request: number,

    aesKey: forge.util.ByteBuffer,
    aesIV: forge.util.ByteBuffer,
    publicKey: forge.pki.Key,

    disableAES: boolean,
    disableCompress: boolean,

    signData: any,

    params: PronoteParams,
    user: PronoteUser,

    timetable(from?: Date, to?: Date): Promise<Timetable>
    marks(period?: String): Promise<Marks>
}

export interface PronoteTarget
{
    name: string,
    id: number
}

export function login(url: string, username: string, password: string, cas?: string): Promise<PronoteSession>;

export namespace errors {
    const PRONOTE: PronoteError;
    const UNKNOWN_CAS: PronoteError;
    const BANNED: PronoteError;
    const WRONG_CREDENTIALS: PronoteError;
}

export interface PronoteError
{
    code: number,
    message: string
}

export interface PronoteObject
{
    id: string, // N
    name: string // L
}

export interface PronoteParams
{
    navigatorId?: string, // identifiantNav
    fonts: Array<string>, // listePolices
    withMember: boolean, // avecMembre
    forNewCaledonia: boolean, // pourNouvelleCaledonie
    loginImageId: number, // genreImageConnexion
    loginImageUrl: string, // urlImageConnexion
    cssLogo: string, // logoProduitCss
    theme: number, // Theme
    serverTime: Date, // DateServeurHttp
    mobileURL: string, // URLMobile
    mobileSupport: boolean, // AvecEspaceMobile
    title: string, // Nom
    indexEducationWebsite: string, // General.urlSiteIndexEducation
    version: string, // General.versionPN
    versionFull: string, // General.version
    year: number, // General.millesime
    language: PronoteLanguage, // General.language
    supportedLanguages: Array<PronoteLanguage>, // General.listeLangues
    infoPage: string, // General.lienMentions
    hasForum: boolean, // General.avecForum
    helpURL: string, // General.UrlAide
    videosURL: string, // General.urlAccesVideos
    twitterURL: string, // General.urlAccesTwitter
    withLoginOptions: boolean, // General.AvecChoixConnexion
    establishment: string, // General.NomEtablissement
    displayWeeks: string, // General.afficherSemainesCalendaires
    schoolYear: string, // General.AnneeScolaire
    firstCycle: Date, // General.DateDebutPremierCycle
    firstDay: Date, // General.PremiereDate
    firstMonday: Date, // General.PremierLundi
    lastDay: Date, // General.DerniereDate
    ticksPerDay: number, // General.PlacesParJour
    ticksPerHour: number, // General.PlacesParHeure
    sequenceDuration: number, // General.DureeSequence
    ticksForHalfDayAbsence: number, // General.PlaceDemiJourneeAbsence
    hasLunch: boolean, // General.activationDemiPension
    lunchStart: number, // General.debutDemiPension
    lunchEnd: number, // General.finDemiPension
    withPlainAfternoonHours: boolean, // General.AvecHeuresPleinesApresMidi
    firstOrLastWorkingDay: Date, // General.JourOuvre
    workingDays: Array<number>, // General.JoursOuvres
    lunchDays: Array<number>, // General.JoursDemiPension
    parentsChat: boolean, // General.ActivationMessagerieEntreParents
    workingDaysPerCycle: number, // General.joursOuvresParCycle
    firstDayOfWeek: number, // General.premierJourSemaine
    timetableGridsInCycle: number, // General.grillesEDTEnCycle
    workingDaysCycle: Array<number>, // General.setOfJoursCycleOuvre
    halfWorkingDays: Array<Array<number>>, // General.DemiJourneesOuvrees
    frequenciesRanges: Array<Array<number>>, // General.DomainesFrequences
    frequenciesLabels: Array<string>, // General.LibellesFrequences
    defaultMarkMax: number, // General.BaremeNotation
    allowedAnnotations: Array<number>, // General.listeAnnotationsAutorisees
    acquisitionLevels: Array<PronoteAcquisitionLevel>, // General.ListeNiveauxDAcquisitions
    displayAcquisitionShortLabel: boolean, // General.AfficherAbbreviationNiveauDAcquisition
    withEvaluationHistory: boolean, // General.AvecEvaluationHistorique
    withoutIntermediaryLevelAutoValidation: boolean, // General.SansValidationNivIntermediairesDsValidAuto
    onlySchoolYearEvaluationsInAutoValidation: false, // General.NeComptabiliserQueEvalsAnneeScoDsValidAuto
    CECRLLevelsSupport?: boolean, // General.AvecGestionNiveauxCECRL
    langActivityColor?: string, // General.couleurActiviteLangagiere
    minMarkMCQ: number, // General.minBaremeQuestionQCM
    maxMarkMCQ: number, // General.maxBaremeQuestionQCM
    maxPointsMCQ: number, // General.maxNbPointQCM
    skillsGridLabelSize: number, // General.tailleLibelleElementGrilleCompetence
    homeworkCommentSize: number, // General.tailleCommentaireDevoir
    officeEnabled: boolean, // General.O365_Actif
    officeFederatedMode: boolean, // General.O365_ModeFederated
    officeTutorial: string, // General.O365_UrlTuto_Office
    oneDriveTutorial: string, // General.O365_UrlTuto_OneDrive
    connexionInfoRetrieval: boolean, // General.AvecRecuperationInfosConnexion
    font: string, // General.Police
    fontSize: number, // General.TaillePolice
    attachedStudents: boolean, // General.AvecElevesRattaches
    phoneMask: string, // General.maskTelephone
    maxECTS: number, // General.maxECTS
    maxAppreciationSizes: Array<number>, // General.TailleMaxAppreciation
    publicHolidays: Array<PronoteHoliday>, // General.listeJoursFeries
    displaySequences: boolean, // General.afficherSequences
    firstHour: Date, // General.PremiereHeure
    hours: Array<PronoteHour>, // General.ListeHeures
    endHours: Array<PronoteHour>, // General.ListeHeuresFin
    sequences: Array<string>, // General.sequences
    periods: Array<PronotePeriod>, // General.ListePeriodes
    logo: number, // General.logo
    breaks: Array<PronoteBreak>, // General.recreations
    appCookieName: string // General.nomCookieAppli
}

export interface PronoteLanguage
{
    id: number, // langID
    name: string // langue
}

export interface PronoteAcquisitionLevel extends PronoteObject
{
    count: number, // G
    positions: Array<PronoteAcquisitionLevelPositions>, // listePositionnements
    triggerPosition: number, // positionJauge
    activeFor: Array<number>, // actifPour
    shortName: string, // abbreviation
    shortPath: string, // raccourci
    color?: string, // couleur
    weighting?: number, // ponderation
    brevetPoints?: number, // nombrePointsBrevet
    acquired?: boolean, // estAcqui
    countsForSuccess?: boolean // estNotantPourTxReussite
}

export interface PronoteAcquisitionLevelPositions
{
    name: string, // L
    count: number, // G
    shortName: string, // abbreviation
    shortNameWithPrefix?: string // abbreviationAvecPrefixe
}

export interface PronoteHoliday extends PronoteObject
{
    from: Date, // dateDebut
    to: Date // dateFin
}

export interface PronoteHour
{
    name: string, // L
    count: number, // G
    round: boolean // A
}

export interface PronotePeriod extends PronoteObject
{
    type: 'trimester' | 'semester' | 'year' | 'other', // G (1, 2, 3, *)
    notationPeriod: number, // periodeNotation
    from: Date, // dateDebut
    to: Date // dateFin
}

export interface PronoteBreak
{
    name: string, // L
    position: number // place
}

export interface PronoteUser extends PronoteObject
{
    establishment: PronoteObject, // ressource.Etablissement
    hasAvatar: boolean, // ressource.avecPhoto
    studentClass: PronoteObject, // ressource.classeDEleve
    classHistory: Array<PronoteClassHistoryElement>, // ressource.listeClassesHistoriques
    groups: Array<PronoteObject>, // ressource.listeGroupes
    tabsPillars: Array<PronoteTabPillars>, // ressource.listeOngletsPourPiliers
    tabsPeriods: Array<PronoteTabPeriods>, // ressource.listeOngletsPourPeriodes
    establishmentsInfo: Array<PronoteEstablishmentInfo>, // ressource.listeInformationsEtablissements
    userSettings: PronoteUserSettings, // ressource.parametresUtilisateur
    sessionAuthorizations: PronoteSessionAuthorizations, // user.autorisationsSession.fonctionnalites
    authorizations: PronoteUserAuthorizations, // autorisations
    minPasswordSize: number, // reglesSaisieMDP.min
    maxPasswordSize: number, // reglesSaisieMDP.max
    passwordRules: Array<number>, // reglesSaisieMDP.regles
    kioskAccess: boolean, // autorisationKiosque
    tabs: Array<PronoteTab>, // listeOnglets
    hiddenTabs: Array<number>, // listeOngletsInvisibles
    notifiedTabs: Array<number>, // lisetOngletsNotification
}

export interface PronoteClassHistoryElement extends PronoteObject
{
    hadMarks: boolean, // AvecNote
    hadOptions: boolean // AvecFiliere
}

export interface PronoteTabPillars
{
    tab: number, // G
    levels: Array<PronotePillarLevel> // listePaliers
}

export interface PronotePillarLevel extends PronoteObject
{
    pillars: Array<PronotePillar> // listePiliers
}

export interface PronotePillar extends PronoteObject
{
    isForeignLanguage: boolean, // estPilierLVE
    isCoreSkill: boolean, // estSocleCommun
    subject: PronoteObject // Service
}

export interface PronoteTabPeriods
{
    tab: number, // G
    periods: Array<PronoteTabPeriod>, // listePeriodes
    defaultPeriod: string // periodeParDefault.L
}

export interface PronoteTabPeriod extends PronoteObject
{
    isCorePeriod: boolean // GenreNotation === 1
}

export interface PronoteEstablishmentInfo extends PronoteObject
{
    logoID: number, // Logo
    address: Array<string>, // Coordonnees.Adresse1, Coordonnees.Adresse2,
    postalCode: string, // Coordonnees.CodePostal
    postalLabel: string, // Coordonnees.LibellePostal
    city: string, // Coordonnees.LibelleVille
    province: string, // Coordonnees.Province
    country: string, // Coordonnees.Pays
    website: string, // Coordonnees.SiteInternet
}

export interface PronoteUserSettings
{
    version: number, // version
    timetable: PronoteUserTimetableSettings, // EDT
    theme: number, // theme.theme
    unreadDiscussions: boolean, // Communication.DiscussionNonLues
}

export interface PronoteUserTimetableSettings
{
    displayCanceledLessons: boolean, // afficherCoursAnnules
    invertAxis: boolean, // axeInverseEDT
    invertWeeklyPlanAxis: boolean, // axeInversePlanningHebdo
    invertDayPlanAxis: boolean, // axeInversePlanningJour
    invertDay2PlanAxis: boolean, // axeInversePlanningJour2
    dayCount: number, // nbJours
    resourceCount: number, // nbRessources
    daysInTimetable: number, // nbJoursEDT
    sequenceCount: number // nbSequences
}

export interface PronoteSessionAuthorizations
{
    twitterManagement: boolean, // gestionTwitter
    expandedAttestation: boolean // attestationEtendue
}

export interface PronoteUserAuthorizations
{
    discussions: boolean, // AvecDiscussion
    teachersDiscussions: boolean, // AvecDiscussionProfesseurs
    timetableVisibleWeeks: Array<number>, // cours.domaineConsultationEDT
    canEditLessons: Array<number>, // cours.domaineModificationCours
    hideClassParts: boolean, // cours.masquerPartiesDeClasse
    maxEstablishmentFileSize: number, // tailleMaxDocJointEtablissement
    maxUserWorkFileSize: number, // tailleMaxRenduTafEleve
    hasPassword: boolean, // compte.avecSaisieMotDePasse
    hasPersonalInfo: boolean, // compte.avecInformationsPersonnelles
    canPrint: boolean // compte.autoriserImpression
}

export interface PronoteTab
{
    id: number, // G
    subs: Array<PronoteTab> // Onglet
}

export interface Timetable
{
    iCal: string, // @server + /ical/Edt.ics?icalsecurise= + ParametreExportiCal + &version= + @params.version

}

export interface Marks
{
    iCal: [],

}

// Low-level API (if you need to use this, you can, but it may mean I've forgotten a use case, please open an issue!)

export function createSession(options: CreateSessionOptions): PronoteSession;

export function cipher(session: PronoteSession, data: any, options?: CipherOptions): string;
export function decipher(session: PronoteSession, data: any, options?: DecipherOptions): string | forge.util.ByteBuffer;

export function getStart(url: string, username: string, password: string, cas: string): Promise<PronoteStartParams>;
export function auth(session: PronoteSession): Promise<PronoteUser>;

export function fetchParams(session: PronoteSession, iv: forge.util.ByteBuffer): Promise<PronoteParams>;
export function fetchId(session: PronoteSession, username: string, fromCas: boolean): Promise<PronoteIdResponse>;
export function fetchAuth(session: PronoteSession, challenge: string, key: forge.util.ByteBuffer): Promise<string>;
export function fetchUser(session: PronoteSession): Promise<PronoteUser>;
export function fetchTimetable(session: PronoteSession, date?: Date): Promise<Timetable>;
export function fetchTimetableDaysAndWeeks(session: PronoteSession): Promise<TimetableDaysAndWeeks>;
export function fetchMarks(session: PronoteSession, period?: String): Promise<Marks>;

export function navigate(session: PronoteSession, page: string, tab: number, data?: any): Promise<any>;

export function request(session: PronoteSession, name: string, content: any): Promise<any>;

export interface CreateSessionOptions
{
    serverURL: string,
    sessionID: number,
    type: number,

    disableAES: boolean,
    disableCompress: boolean,

    keyModulus: string,
    keyExponent: string
}

export interface CipherOptions
{
    key?: forge.pki.Key,
    compress?: boolean
}

export interface DecipherOptions extends CipherOptions
{
    scrambled?: boolean,
    asBytes?: boolean
}

export interface PronoteStartParams
{
    h: string, // Session ID (number)
    a: number, // Session type (3 = student, ...)

    sCrA: boolean, // Disable AES
    sCoA: boolean, // Disable compression

    MR: string, // Public key modulus (as BigInt string)
    ER: string, // Public key exponent (as BigInt string)

    // There are more, but undocumented (feel free to open a P.R.!)
}

export interface PronoteIdResponse
{
    scramble: string, // alea
    challenge: string // challenge
}

export interface TimetableDaysAndWeeks
{
    filledWeeks: Array<number>, // Domaine
    filledDays: Array<number> // joursPresence
}
