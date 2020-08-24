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

    timetable(from?: Date, to?: Date): Promise<Array<Lesson>>
    marks(period?: PronotePeriod | String): Promise<Marks>
    evaluations(period?: PronotePeriod | String): Promise<Array<EvaluationsSubject>>
    absences(period?: PronotePeriod | String): Promise<Absences>
    infos(): Promise<Array<Info>>
    homeworks(from?: Date, to?: Date): Promise<Array<Homework>>
    menu(from?: Date, to?: Date): Promise<Array<MenuDay>>
}

export interface PronoteTarget
{
    name: string,
    id: number
}

export function login(url: string, username: string, password: string, cas?: string, accountType?: string): Promise<PronoteSession>;

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

export interface Lesson
{
    from: Date,
    to: Date,
    isDetention: boolean,
    hasDuplicate: boolean,
    subject?: string,
    teacher?: string,
    room?: string,
    isAway: boolean,
    isCancelled: boolean,
    color?: string
}

export interface Marks
{
    subjects: Array<MarksSubject>,
    averages: MarksAverages
}

export interface MarksSubject
{
    name: string,
    averages: MarksSubjectAverages,
    color: string,
    marks: Array<Mark>
}

export interface MarksAverages
{
    student: number,
    studentClass: number
}

export interface MarksSubjectAverages extends MarksAverages
{
    min: number,
    max: number
}

export interface Mark
{
    title: string,
    value?: number,
    scale: number,
    average: number,
    coefficient: number,
    min: number,
    max: number,
    date: Date,
    isAway: boolean
}

export interface EvaluationsSubject
{
    name: string,
    teacher: string,
    color: string,
    evaluations: Array<Evaluation>
}

export interface Evaluation
{
    name: string,
    date: Date
    levels: Array<EvaluationLevel>,
}

export interface EvaluationLevel
{
    name: string,
    value: EvaluationLevelValue,
    prefixes: Array<string>
}

export interface EvaluationLevelValue
{
    short: string,
    long: string
}

export interface Absences
{
    absences: Array<Absence>,
    delays: Array<Delay>,
    punishments: Array<Punishment>,
    other: Array<OtherEvent>,
    totals: Array<SubjectAbsences>
}

export interface Absence
{
    from: Date,
    to: Date,
    justified: boolean,
    solved: boolean,
    hours: number,
    reason?: string
}

export interface Delay
{
    date: Date,
    justified: boolean,
    solved: boolean,
    justification: string,
    minutesMissed: number,
    reason?: string
}

export interface Punishment
{
    date: Date,
    isExclusion: boolean,
    isDuringLesson: boolean,
    homework: string,
    circumstances: string,
    giver: string,
    reason?: string,
    detention?: Detention
}

export interface Detention
{
    from: Date,
    to: Date
}

export interface OtherEvent
{
    kind: string,
    date: Date,
    giver: string,
    comment: string,
    subject?: string
}

export interface SubjectAbsences
{
    subject: string,
    hoursAssisted: null,
    hoursMissed: string,
    subs?: Array<SubjectAbsences>
}

export interface Info
{
    date: Date,
    title: string,
    author: string,
    content: string,
    files: Array<File>
}

export interface Homework
{
    subject: string,
    teachers: Array<string>,
    from: Date,
    to: Date,
    color: string,
    title: string,
    description: string,
    files: Array<File>,
    category: string
}

export interface File
{
    name: string,
    url: string
}

export interface MenuDay
{
    date: Date,
    meals: Array<Array<Array<MenuMealEntry>>>
}

export interface MenuMealEntry
{
    name: string,
    labels: Array<MenuMealLabel>
}

export interface MenuMealLabel
{
    name: string,
    color: string
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
export function fetchTimetable(session: PronoteSession, date?: Date): Promise<PronoteTimetable>;
export function fetchTimetableDaysAndWeeks(session: PronoteSession): Promise<PronoteTimetableDaysAndWeeks>;
export function fetchMarks(session: PronoteSession, period?: PronotePeriod): Promise<PronoteMarks>;
export function fetchEvaluations(session: PronoteSession, period?: PronotePeriod): Promise<Array<PronoteEvaluation>>;
export function fetchAbsences(session: PronoteSession, period?: PronotePeriod, from?: Date, to?: Date): Promise<PronoteAbsences>;
export function fetchInfos(session: PronoteSession): Promise<PronoteInfos>;
export function fetchHomeworks(session: PronoteSession, fromWeek?: number, toWeek?: number): Promise<PronoteHomeworks>;
export function fetchMenu(session: PronoteSession, date?: Date): Promise<PronoteMenu>;

export function navigate(session: PronoteSession, page: string, tab: number, data?: any): Promise<any>;

export function toPronoteWeek(session: PronoteSession, date: Date): number;
export function toUTCWeek(date: Date): number;
export function toPronoteDay(session: PronoteSession, date: Date): number;
export function fromPronoteDay(session: PronoteSession, date: number): Date;
export function toPronoteDate(date: Date): string;

export function getFileURL(session: PronoteSession, file: PronoteObject): string;

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

export interface PronoteTimetable
{
    hasCancelledLessons: boolean, // avecCoursAnnule
    iCalURL: string, // @params.server + ical/Edt.ics?icalsecurise= + ParametreExportiCal + &version= + @params.version
    lessons: Array<PronoteLesson>,
    breaks: Array<PronoteBreak>
}

export interface PronoteLesson extends PronoteObject
{
    position: number, // place
    duration: number, // duree
    date: Date, // DateDuCours
    status?: string, // Statut
    color?: string, // CouleurFond
    content: Array<PronoteObject>,
    hasHomework: boolean, // AvecTafPublie
    isCancelled: boolean, // estAnnule
    isDetention: boolean // estRetenue
}

export interface PronoteTimetableDaysAndWeeks
{
    filledWeeks: Array<number>, // Domaine
    filledDays: Array<number> // joursPresence
}

export interface PronoteMarks
{
    studentAverage?: number, // moyGenerale
    studentAverageScale?: number, // baremeMoyGenerale
    defaultStudentAvergeScale?: number, // baremeMoyGeneraleParDefaut
    studentClassAverage?: number, // moyGeneraleClasse
    subjects: Array<PronoteMarksSubject>, // listeServices
    marks: Array<PronoteMark> // listeDevoirs
}

export interface PronoteMarksSubject extends PronoteObject
{
    position: number, // ordre
    isGroupSubject: boolean, // estServiceEnGroupe
    studentAverage: number, // moyEleve
    studentAverageScale: number, // baremeMoyEleve
    defaultStudentAverageScale: number, // baremeMoyEleveParDefaut
    studentClassAverage: number, // moyClasse
    maxAverage: number, // moyMax
    minAverage: number, // moyMin
    color: string // couleur
}

export interface PronoteMark extends PronoteObject
{
    subject: PronoteObject, // service
    title: string, // commentaire
    value: number, // note
    average: number, // moyenne
    scale: number, // bareme
    defaultScale: number, // baremeParDefaut
    coefficient: number, // coefficient
    max: number, // noteMax
    min: number, // noteMin
    date: number, // date
    period: PronoteObject, // periode
    isAway: boolean, // note == '|1'
    isGroupMark: boolean // estEnGroupe
}

export interface PronoteEvaluation extends PronoteObject
{
    title: string, // descriptif
    acquisitionLevels: Array<PronoteEvaluationAcquisitionLevel>, // listeNiveauxDAcquisitions
    levels: Array<PronoteObject>, // listePaliers
    subject: PronoteEvaluationSubject, // matiere
    teacher: PronoteObject, // individu
    coefficient: number, // coefficient
    date: Date, // date
    period: PronoteObject // periode
}

export interface PronoteEvaluationAcquisitionLevel extends PronoteObject
{
    position: number, // order
    value: string, // abbreviation
    pillar: PronoteEvaluationPillar, // pilier
    coefficient: number, // coefficient
    domain: PronoteObject, // domaine
    item: PronoteObject // item
}

export interface PronoteEvaluationPillar extends PronoteObject
{
    prefixes: Array<string> // strPrefixes
}

export interface PronoteEvaluationSubject extends PronoteObject
{
    position: number, // order
    service: PronoteObject, // serviceConcerne
    color: string // couleur
}

export interface PronoteAbsences
{
    authorizations: PronoteAbsencesAuthorizations, // autorisations
    events: Array<PronoteAbsence | PronoteDelay | PronotePunishment | PronoteOtherEvent | PronoteEvent>, // listeAbsences
    subjects: Array<PronoteSubjectAbsences>, // Matieres
    recaps: Array<PronoteAbsenceRecap>, // listeRecapitulatifs
    sanctions: Array<PronoteObject> // listeSanctionUtilisateur
}

export interface PronoteAbsencesAuthorizations
{
    absences: boolean, // absence
    fillAbsenceReason: boolean, // saisieMotifAbsence
    delays: boolean, // retard
    fillDelayReason: boolean, // saisieMotifRetard
    punishments: boolean, // punition
    exclusions: boolean, // exclusion
    sanctions: boolean, // sanction
    conservatoryMesures: boolean, // mesureConservatoire
    infirmary: boolean, // infirmerie
    mealAbsences: boolean, // absenceRepas
    internshipAbsences: boolean, // absenceInternat
    observations: boolean, // observation
    incidents: boolean, // incident
    totalHoursMissed: boolean // totalHeuresManquees
}

export interface PronoteEvent extends PronoteObject
{
    type: 'absence' | 'delay' | 'punishment' | 'other' | 'unknown'
}

export interface PronoteAbsence extends PronoteEvent
{
    from: Date, // dateDebut
    to: Date, // dateFin
    opened: boolean, // ouverte
    solved: boolean, // reglee
    justified: boolean, // justifie
    hours: number, // NbrHeures
    days: number, // NbrJours
    reasons: Array<PronoteObject> // listeMotifs
}

export interface PronoteDelay extends PronoteEvent
{
    date: Date, // date
    solved: boolean, // reglee
    justified: boolean, // justifie
    justification: string, // justification
    duration: number, // duree
    reasons: Array<PronoteObject> // listeMotifs
}

export interface PronotePunishment extends PronoteEvent
{
    date: Date, // dateDemande
    isExclusion: boolean, // estUneExclusion
    giver: PronoteObject, // demandeur
    isSchedulable: boolean, // estProgrammable
    reasons: Array<PronoteObject>, // listeMotifs
    schedule: Array<PronotePunishmentSchedule>, // programmation
    nature: PronotePunishmentNature
}

export interface PronotePunishmentSchedule extends PronoteObject
{
    date: Date, // date,
    position: number, // placeExecution
    duration: number // duree
}

export interface PronotePunishmentNature extends PronoteObject
{
    isSchedulable: boolean, // estProgrammable
    requiresParentsMetting: boolean // estAvecARParent
}

export interface PronoteOtherEvent extends PronoteEvent
{
    date: Date, // date
    giver: PronoteOtherEventGiver, // demandeur
    comment: string, // commentaire
    read: boolean, // estLue
    subject: PronoteObject // matiere
}

export interface PronoteOtherEventGiver extends PronoteObject
{
    isHeadTeacher: boolean, // estProfPrincipal
    mail: string // mail
}

export interface PronoteSubjectAbsences extends PronoteObject
{
    position: number, // P
    group: number, // regroupement
    inGroup: number, // dansRegroupement
    hoursAssisted: number, // suivi / 3600
    hoursMissed: number, // absence / 3600
    lessonExclusions: number, // excluCours
    establishmentExclusions: number // excluEtab
}

export interface PronoteAbsenceRecap extends PronoteObject
{
    count: number, // NombreTotal
    unjustifiedCount: number, // NombreNonJustifie
    hours: number // NbrHeures
}

export interface PronoteInfos
{
    categories: Array<PronoteInfoCategory>,
    infos: Array<PronoteInfo>
}

export interface PronoteInfoCategory extends PronoteObject
{
    isDefault: boolean // estDefaut
}

export interface PronoteInfo extends PronoteObject
{
    date: Date, // dateDebut
    author: PronoteObject, // elmauteur
    content: Array<PronoteInfoContent> // listeQuestions
}

export interface PronoteInfoContent extends PronoteObject
{
    text: PronoteObject, // texte
    files: Array<PronoteObject> // listePiecesJointes
}

export interface PronoteHomeworks
{
    homeworks: Array<PronoteHomework>, // ListeCahierDeTextes
    resources: PronoteHomeworksResources, // ListeRessourcesPedagogiques
    numericalResources: Array<PronoteObject> // ListeRessourcesNumeriques
}

export interface PronoteHomework extends PronoteObject
{
    lesson: PronoteObject, // cours
    locked: boolean, // verrouille
    groups: Array<PronoteObject>, // listeGroupes
    subject: PronoteObject, // Matiere
    color: string, // CouleurFond
    teachers: Array<PronoteObject>, // listeProfesseurs
    from: Date, // Date
    to: Date, // DateFin
    content: Array<PronoteHomeworkContent>, // listeContenus
    skills: Array<PronoteObject> // listeElementsProgrammeCDT
}

export interface PronoteHomeworkContent extends PronoteObject
{
    description: string, // descriptif
    category: PronoteObject, // categorie
    path: number, // parcoursEducatif
    files: Array<PronoteObject>, // ListePieceJointe
    training: Array<PronoteObject> // training.V.ListeExecutionsQCM
}

export interface PronoteHomeworksResources
{
    resources: Array<PronoteObject>, // listeRessources
    subjects: Array<PronoteObject> // listeMatieres
}

export interface PronoteMenu
{
    hasLunch: boolean, // AvecRepasMidi
    hasDiner: boolean, // AvecRepasSoir
    filledWeeks: Array<number>, // DomaineDePresence
    menus: Array<PronoteMenuDay>, // ListeJours
}

export interface PronoteMenuDay
{
    date: Date, // Date
    meals: Array<PronoteMenuMeal> // ListeRepas
}

export interface PronoteMenuMeal extends PronoteObject
{
    content: Array<PronoteMenuMealContent> // ListePlats
}

export interface PronoteMenuMealContent extends PronoteObject
{
    lines: Array<PronoteMenuMealLine> // ListeAliments
}

export interface PronoteMenuMealLine extends PronoteObject
{
    labels: Array<PronoteMenuLabel> // listeLabelsAlimentaires
}

export interface PronoteMenuLabel extends PronoteObject
{
    color: string // couleur
}

