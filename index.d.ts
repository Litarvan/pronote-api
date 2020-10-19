import * as forge from 'node-forge';

// High-level API

/**
 * Une session Pronote
 *
 * Peut être ouverte via les fonctions {@link login}, ou {@link loginParent}.
 * Ouverte par l'une de ces fonctions, le champ {@link params} est garanti d'être rempli.
 *
 * La session dure quelques dizaines de minutes, sauf si {@link setKeepAlive}(true) est appelé,
 * elle dure alors indéfiniment jusqu'à que {@link setKeepAlive}(false) soit appelé ou le
 * programme fermé.
 */
export abstract class PronoteSession
{
    /**
     * Créé une nouvelle session.
     *
     * Ce constructeur doit normalement être appelé par {@link login} plutôt que manuellement, sauf si
     * vous savez ce que vous faites.
     *
     * @param options Les options d'instanciation
     */
    constructor(options: PronoteSessionOptions)

    /**
     * ID unique de la session donné par Pronote, sous la forme d'une suite de 7 chiffres.
     */
    id: number

    /**
     * URL de l'instance Pronote depuis laquelle la session a été ouverte.
     * Exemple : 'https://demo.index-education.net/pronote/'
     */
    server: string

    /**
     * Type du compte de la session, défini automatiquement par le constructeur
     */
    type: PronoteAccountType


    /**
     * ID de la dernière requête effectuée, augmenté de 2 avant chaque requête. -1 signifiant qu'aucune requête
     * n'a été encore envoyée, car 1 sera le premier ID.
     */
    request: number

    /**
     * Si la session est gardée en vie en permanence ou non. Désactivé par défaut, cette valeur mise à jour
     * lors de l'utilisation de {@link setKeepAlive}.
     */
    isKeptAlive: boolean


    /**
     * La clé AES utilisée pour le chiffrement. Elle est assignée lors du processus d'authentification
     * à la clé donnée par Pronote dans la réponse de la requête 'Authentification', et est utilisée ensuite
     * pour toutes les opérations de chiffrement (sauf si une autre clé est donnée dans des cas particuliers).
     */
    aesKey?: forge.util.ByteBuffer

    /**
     * Vecteur d'initialisation (VI, donc IV en anglais) de chiffrement, généré aléatoirement par la fonction
     * {@link login} lors de la création d'une session, et utilisé dans toutes les opérations de chiffrement.
     */
    aesIV: forge.util.ByteBuffer

    /**
     * Clé publique de l'instance Pronote depuis laquelle la session a été ouverte, construite à partir de
     * l'exposant et du modulo donné par Pronote directement dans la page.
     */
    publicKey: forge.pki.Key


    /**
     * Si les requêtes doivent être chiffrées ou non. Ce paramètre est activé si l'instance Pronote est en HTTPS.
     */
    disableAES: boolean

    /**
     * Si les requêtes doivent être compressées ou non. Ce paramètre est visiblement activé avec {@link disableAES}.
     */
    disableCompress: boolean


    /**
     * Paramètres de l'instance depuis laquelle la session a été ouverte, correspond au résultat de la requête
     * 'FonctionParametres' qui est la première requête envoyée à Pronote.
     */
    params?: PronoteParams


    /**
     * Envoi une requête de présence à Pronote, remettant à zero la durée de vie de la session
     */
    keepAlive(): Promise<void>

    /*
     * Déconnecte la session de Pronote. Après l'appel de cette fonction, toute requête à Pronote sera
     * refusée par ce dernier.
     */
    logout(): Promise<void>

    /**
     * Active le maintien en vie de la session. Dès que ce paramètre est défini à `true`, l'API enverra
     * des requêtes de présence à Pronote à l'intervalle défini. Tant que ce paramètre n'est pas défini à `false`
     * le programme fermé, ou une erreur renvoyée, les requêtes continueront d'être envoyées et la session
     * sera maintenue indéfiniment.
     *
     * @param enabled Si oui ou non le maintien de la session doit être activé
     * @param onError Une action à effectuer en cas d'erreur. Dans tous les cas, une erreur arrêtera le maintien.
     * @param rate L'intervalle auquel envoyer les requêtes, par défaut 2 minutes (le même que Pronote).
     */
    setKeepAlive(enabled: boolean, onError?: (error: any) => void, rate?: number);
}

/**
 * Une session élève
 *
 * Peut être ouverte par {@link login} ou instanciée manuellement.
 * Ouverte par {@link login}, le champ {@link user} est garanti d'être rempli.
 */
export class PronoteStudentSession extends PronoteSession
{
    /**
     * Informations de l'utilisateur connecté via la session, correspond au résultat de la requête
     * 'ParametresUtilisateur' envoyée après une authentification réussie.
     */
    user?: PronoteStudentUser


    /**
     * Récupère les cours situés dans l'intervalle de temps donnée.
     *
     * Attention : Par défaut, une Date en JavaScript est initialisée à minuit si l'heure n'est pas donnée,
     * mettre par exemple en 'to' le Mercredi 2 Septembre, ne renverra donc aucun des cours de ce jour.
     *
     * Rappelez-vous aussi que le champ du mois dans les dates est décalé de 1 en arrière, et seulement
     * ce champ. Pour initialiser une Date au Mercredi 2 Septembre, il faut donc faire `new Date(2020, 8, 2);`.
     *
     * @param from La date à partir de laquelle récupérer les cours. Par défaut la Date actuelle
     * @param to La date jusqu'à laquelle récupérer les cours. Par défaut 'from' + 1 jour
     *
     * @return La liste des cours situés entre les deux dates données. Si l'onglet de l'emploi du temps n'est pas
     * disponible, `null` sera renvoyé.
     */
    timetable(from?: Date, to?: Date): Promise<Array<Lesson> | null>

    /**
     * Récupère les notes et, si disponibles, les moyennes générales de l'utilisateur et de sa classe, dans
     * la période donnée.
     *
     * @param period La période depuis laquelle récupérer les notes et les moyennes. Par défaut le trimestre
     * dans lequel on est, ou le premier si on est hors période.
     *
     * @return Toutes les notes de cette période par matière, avec les moyennes de ces dernières, et si disponibles,
     * les moyennes générales de l'utilisateur et de sa classe. Si l'onglet des notes n'est pas disponible,
     * `null` sera renvoyé.
     */
    marks(period?: PronotePeriod | String): Promise<Marks | null>

    /**
     * Récupère la liste des évaluations ayant eu lieu dans la période donnée.
     *
     * @param period La période depuis laquelle récupérer les notes et les moyennes. Par défaut le trimestre
     * dans lequel on est, ou le premier si on est hors période.
     *
     * @return Toutes les évaluations de cette période rangée par matière. Si l'onglet des évaluations n'est pas
     * disponible, `null` sera renvoyé.
     */
    evaluations(period?: PronotePeriod | String): Promise<Array<EvaluationsSubject> | null>

    /**
     * Récupère la liste des évènements tels que les absences, punitions, retenues, ou autre.
     *
     * Il est possible de mettre 'from' et 'to' de sorte à couvrir toute l'année, tant que 'period' est défini à
     * `null` ou au premier trimestre. Cela renverra alors bien les évènements de toute l'année.
     *
     * @param period La période depuis laquelle récupérer les évènements. Par défaut le trimestre dans lequel on
     * est, ou le premier si on est hors période.
     * @param from À partir de quand récupérer les évènements
     * @param to Jusqu'à quand récupérer les évènements
     *
     * @return La liste des évènements de cette période rangés par types. Si l'onglet des évènements n'est pas
     * disponible, `null` sera renvoyé.
     */
    absences(period?: PronotePeriod | String, from?: Date, to?: Date): Promise<Absences | null>

    /**
     * Récupère la liste de toutes les informations disponibles.
     *
     * @return La liste des informations. Si l'onglet des informations n'est pas disponible, `null` sera renvoyé.
     */
    infos(): Promise<Array<Info> | null>

    /**
     * Récupère les contenus des cours situés dans l'intervalle de temps donnée.
     *
     * Attention : Par défaut, une Date en JavaScript est initialisée à minuit si l'heure n'est pas donnée,
     * mettre par exemple en 'to' le Mercredi 2 Septembre, ne renverra le contenu d'aucun des cours de ce jour.
     *
     * Rappelez-vous aussi que le champ du mois dans les dates est décalé de 1 en arrière, et seulement
     * ce champ. Pour initialiser une Date au Mercredi 2 Septembre, il faut donc faire `new Date(2020, 8, 2);`.
     *
     * @param from La date à partir de laquelle récupérer le contenu des cours. Par défaut la Date actuelle
     * @param to La date jusqu'à laquelle récupérer le contenu des cours. Par défaut 'from' + 1 jour
     *
     * @return La liste des devoirs situés entre les deux dates données. Si l'onglet du contenu des cours n'est
     * pas disponible, `null` sera renvoyé.
     */
    contents(from?: Date, to?: Date): Promise<Array<LessonContent> | null>

    /**
     * Récupère les devoirs situés dans l'intervalle de temps donnée.
     *
     * Attention : Par défaut, une Date en JavaScript est initialisée à minuit si l'heure n'est pas donnée,
     * mettre par exemple en 'to' le Mercredi 2 Septembre, ne renverra donc aucun des devoirs de ce jour.
     *
     * Rappelez-vous aussi que le champ du mois dans les dates est décalé de 1 en arrière, et seulement
     * ce champ. Pour initialiser une Date au Mercredi 2 Septembre, il faut donc faire `new Date(2020, 8, 2);`.
     *
     * @param from La date à partir de laquelle récupérer les devoirs. Par défaut la Date actuelle
     * @param to La date jusqu'à laquelle récupérer les devoirs. Par défaut 'from' + 1 jour
     *
     * @return La liste des devoirs situés entre les deux dates données. Si l'onglet des devoirs n'est pas
     * disponible, `null` sera renvoyé.
     */
    homeworks(from?: Date, to?: Date): Promise<Array<Homework> | null>

    /**
     * Récupère les menus de la cantine des repas situés dans l'intervalle de temps donnée.
     *
     * Attention : Par défaut, une Date en JavaScript est initialisée à minuit si l'heure n'est pas donnée,
     * donc en sachant que les dates renvoyées par Pronote des menus seront aussi fixées à minuit, cela signifie que
     * mettre par exemple en 'to' le Mercredi 2 Septembre renverra aussi le menu de ce jour.
     *
     * Rappelez-vous aussi que le champ du mois dans les dates est décalé de 1 en arrière, et seulement
     * ce champ. Pour initialiser une Date au Mercredi 2 Septembre, il faut donc faire `new Date(2020, 8, 2);`.
     *
     * @param from La date à partir de laquelle récupérer les menus. Par défaut la Date actuelle
     * @param to La date jusqu'à laquelle récupérer les menus. Par défaut 'from' + 23 heures
     *
     * @return La liste des menus des repas situés entre les deux dates données. Si l'onglet du menu n'est pas
     * disponible, `null` sera renvoyé.
     */
    menu(from?: Date, to?: Date): Promise<Array<MenuDay> | null>
}

/**
 * Une session parent
 *
 * Peut être ouverte par {@link login} ou instanciée manuellement.
 * Ouverte par {@link login}, le champ {@link user} est garanti d'être rempli.
 */
export class PronoteParentSession extends PronoteSession
{
    /**
     * Informations de l'utilisateur connecté via la session, correspond au résultat de la requête
     * 'ParametresUtilisateur' envoyée après une authentification réussie.
     */
    user?: PronoteParentUser


    /**
     * Récupère les cours d'un élève situé dans l'intervalle de temps donnée.
     *
     * Attention : Par défaut, une Date en JavaScript est initialisée à minuit si l'heure n'est pas donnée,
     * mettre par exemple en 'to' le Mercredi 2 Septembre, ne renverra donc aucun des cours de ce jour.
     *
     * Rappelez-vous aussi que le champ du mois dans les dates est décalé de 1 en arrière, et seulement
     * ce champ. Pour initialiser une Date au Mercredi 2 Septembre, il faut donc faire `new Date(2020, 8, 2);`.
     *
     * @param student L'élève dont il faut récupérer les cours
     * @param from La date à partir de laquelle récupérer les cours. Par défaut la Date actuelle
     * @param to La date jusqu'à laquelle récupérer les cours. Par défaut 'from' + 1 jour
     *
     * @return La liste des cours situés entre les deux dates données. Si l'onglet de l'emploi du temps n'est pas
     * disponible, `null` sera renvoyé.
     */
    timetable(student: PronoteStudent, from?: Date, to?: Date): Promise<Array<Lesson> | null>

    /**
     * Récupère les notes d'un élève et, si disponibles, les moyennes générales de l'élève et de sa classe, dans
     * la période donnée.
     *
     * @param student L'élève dont il faut récupérer les ,ptes
     * @param period La période depuis laquelle récupérer les notes et les moyennes. Par défaut le trimestre
     * dans lequel on est, ou le premier si on est hors période.
     *
     * @return Toutes les notes de cette période par matière, avec les moyennes de ces dernières, et si disponibles,
     * les moyennes générales de l'utilisateur et de sa classe. Si l'onglet des notes n'est pas disponible,
     * `null` sera renvoyé.
     */
    marks(student: PronoteStudent, period?: PronotePeriod | String): Promise<Marks | null>

    /**
     * Récupère la liste des évaluations d'un élève ayant eu lieu dans la période donnée.
     *
     * @param student L'élève dont il faut récupérer les évaluations
     * @param period La période depuis laquelle récupérer les notes et les moyennes. Par défaut le trimestre
     * dans lequel on est, ou le premier si on est hors période.
     *
     * @return Toutes les évaluations de cette période rangée par matière. Si l'onglet des évaluations n'est pas
     * disponible, `null` sera renvoyé.
     */
    evaluations(student: PronoteStudent, period?: PronotePeriod | String): Promise<Array<EvaluationsSubject> | null>

    /**
     * Récupère la liste des évènements d'un élève tels que les absences, punitions, retenues, ou autre.
     *
     * Il est possible de mettre 'from' et 'to' de sorte à couvrir toute l'année, tant que 'period' est défini à
     * `null` ou au premier trimestre. Cela renverra alors bien les évènements de toute l'année.
     *
     * @param student L'élève dont il faut récupérer les évènements
     * @param period La période depuis laquelle récupérer les évènements. Par défaut le trimestre dans lequel on
     * est, ou le premier si on est hors période.
     * @param from À partir de quand récupérer les évènements
     * @param to Jusqu'à quand récupérer les évènements
     *
     * @return La liste des évènements de cette période rangés par types. Si l'onglet des évènements n'est pas
     * disponible, `null` sera renvoyé.
     */
    absences(student: PronoteStudent, period?: PronotePeriod | String, from?: Date, to?: Date): Promise<Absences | null>

    /**
     * Récupère la liste de toutes les informations disponibles destinées à un élève.
     *
     * @param student L'élève dont il faut récupérer les informations
     *
     * @return La liste des informations. Si l'onglet des informations n'est pas disponible, `null` sera renvoyé.
     */
    infos(student: PronoteStudent): Promise<Array<Info> | null>

    /**
     * Récupère les contenus des cours d'un élève situés dans l'intervalle de temps donnée.
     *
     * Attention : Par défaut, une Date en JavaScript est initialisée à minuit si l'heure n'est pas donnée,
     * mettre par exemple en 'to' le Mercredi 2 Septembre, ne renverra le contenu d'aucun des cours de ce jour.
     *
     * Rappelez-vous aussi que le champ du mois dans les dates est décalé de 1 en arrière, et seulement
     * ce champ. Pour initialiser une Date au Mercredi 2 Septembre, il faut donc faire `new Date(2020, 8, 2);`.
     *
     * @param student L'élève dont il faut récupérer le contenu des cours
     * @param from La date à partir de laquelle récupérer le contenu des cours. Par défaut la Date actuelle
     * @param to La date jusqu'à laquelle récupérer le contenu des cours. Par défaut 'from' + 1 jour
     *
     * @return La liste des devoirs situés entre les deux dates données. Si l'onglet du contenu des cours n'est
     * pas disponible, `null` sera renvoyé.
     */
    contents(student: PronoteStudent, from?: Date, to?: Date): Promise<Array<LessonContent> | null>

    /**
     * Récupère les devoirs d'un élève situés dans l'intervalle de temps donnée.
     *
     * Attention : Par défaut, une Date en JavaScript est initialisée à minuit si l'heure n'est pas donnée,
     * mettre par exemple en 'to' le Mercredi 2 Septembre, ne renverra donc aucun des devoirs de ce jour.
     *
     * Rappelez-vous aussi que le champ du mois dans les dates est décalé de 1 en arrière, et seulement
     * ce champ. Pour initialiser une Date au Mercredi 2 Septembre, il faut donc faire `new Date(2020, 8, 2);`.
     *
     * @param student L'élève dont il faut récupérer les devoirs
     * @param from La date à partir de laquelle récupérer les devoirs. Par défaut la Date actuelle
     * @param to La date jusqu'à laquelle récupérer les devoirs. Par défaut 'from' + 1 jour
     *
     * @return La liste des devoirs situés entre les deux dates données. Si l'onglet des devoirs n'est pas
     * disponible, `null` sera renvoyé.
     */
    homeworks(student: PronoteStudent, from?: Date, to?: Date): Promise<Array<Homework> | null>

    /**
     * Récupère les menus de la cantine d'un élève des repas situés dans l'intervalle de temps donnée.
     *
     * Attention : Par défaut, une Date en JavaScript est initialisée à minuit si l'heure n'est pas donnée,
     * donc en sachant que les dates renvoyées par Pronote des menus seront aussi fixées à minuit, cela signifie que
     * mettre par exemple en 'to' le Mercredi 2 Septembre renverra aussi le menu de ce jour.
     *
     * Rappelez-vous aussi que le champ du mois dans les dates est décalé de 1 en arrière, et seulement
     * ce champ. Pour initialiser une Date au Mercredi 2 Septembre, il faut donc faire `new Date(2020, 8, 2);`.
     *
     * @param student L'élève dont il faut récupérer les menus
     * @param from La date à partir de laquelle récupérer les menus. Par défaut la Date actuelle
     * @param to La date jusqu'à laquelle récupérer les menus. Par défaut 'from' + 23 heures
     *
     * @return La liste des menus des repas situés entre les deux dates données. Si l'onglet du menu n'est pas
     * disponible, `null` sera renvoyé.
     */
    menu(student: PronoteStudent, from?: Date, to?: Date): Promise<Array<MenuDay> | null>
}

/**
 * Valeurs acceptées pour désigner un des types de comptes disponibles. Pour l'instant seul 'student' est supporté.
 */
type PronoteAccountTypeName = 'student' | 'parent' | 'teacher' | 'attendant' | 'company' | 'administration';

/**
 * Type de compte auquel il est possible de se connecter via Pronote. Pour l'instant seul le comptes élèves
 * sont supportés.
 */
export interface PronoteAccountType
{
    name: PronoteAccountTypeName,
    value: string,
    id: number
}

/**
 * Ouvre une nouvelle session élève à l'instance Pronote donnée, et s'y connecte.
 *
 * Par défaut, ouvrir une session à l'aide de cette fonction ne maintien pas la session en vie. Pour la maintenir
 * plus longtemps que le temps par défaut (quelques dizaines de minutes), utilisez {@link PronoteSession.setKeepAlive}.
 *
 * @param url URL de l'instance Pronote à laquelle se connecter, exemple : https://demo.index-education.net/pronote/
 * @param username Nom d'utilisateur
 * @param password Mot de passe de l'utilisateur
 * @param cas Nom du CAS à utiliser si besoin. Si vous vous connectez usuellement à Pronote directement par leur
 * interface, vous pouvez laisser ce champ vide (ou mettre 'none'). En revanche, si lors de la connexion à Pronote
 * vous êtes redirigé vers une interface de votre académie, vous devez alors choisir le CAS qui correspond. La valeur
 * de ce champ correspond au nom d'un fichier de src/cas/ sans le .js. Par exemple 'ac-montpellier'. Si votre
 * académie n'est pas supportée, vous pouvez ouvrir une issue sur le dépôt GitHub du projet.
 *
 * @return La session créée et authentifiée. Ses champs 'params' et 'user' sont donc forcément non-vides.
 */
export function login(url: string, username: string, password: string, cas?: string): Promise<PronoteStudentSession>;

/**
 * Ouvre une nouvelle session parent à l'instance Pronote donnée, et s'y connecte.
 *
 * Par défaut, ouvrir une session à l'aide de cette fonction ne maintien pas la session en vie. Pour la maintenir
 * plus longtemps que le temps par défaut (quelques dizaines de minutes), utilisez {@link PronoteSession.setKeepAlive}.
 *
 * @param url URL de l'instance Pronote à laquelle se connecter, exemple : https://demo.index-education.net/pronote/
 * @param username Nom d'utilisateur
 * @param password Mot de passe de l'utilisateur
 * @param cas Nom du CAS à utiliser si besoin. Si vous vous connectez usuellement à Pronote directement par leur
 * interface, vous pouvez laisser ce champ vide (ou mettre 'none'). En revanche, si lors de la connexion à Pronote
 * vous êtes redirigé vers une interface de votre académie, vous devez alors choisir le CAS qui correspond. La valeur
 * de ce champ correspond au nom d'un fichier de src/cas/ sans le .js. Par exemple 'ac-montpellier'. Si votre
 * académie n'est pas supportée, vous pouvez ouvrir une issue sur le dépôt GitHub du projet.
 *
 * @return La session créée et authentifiée. Ses champs 'params' et 'user' sont donc forcément non-vides.
 */
export function loginParent(url: string, username: string, password: string, cas?: string): Promise<PronoteParentSession>;


/**
 * La liste des CAS disponibles, et donc des valeurs acceptées pour le champ 'cas' de la fonction {@link login}.
 */
export const casList: Array<string>;

/**
 * Tente de trouver le nom de CAS associé à l'URL de l'instance Pronote donnée. Renvoie `null` si introuvable.
 *
 * @param url L'URL de l'instance Pronote dont laquelle trouver le CAS par lequel il faut passer pour s'y connecter.
 *
 * @return Le nom du CAS à mettre, ou une liste des noms des CAS possibles, ou `null` si introuvable.
 */
export function getCAS(url: string): Promise<string | string[] | null>;

// Données géographiques concernant un établissement.
export interface EtablissementGeoData {
    /**
     * URL Pronote de l'établissement
     */
    url: string;
    /**
     * Nom de l'établissement
     */
    nomEtab: string;
    /**
     * Latitude de l'établissement
     */
    lat: string;
    /**
     * Longitude de l'établissement
     */
    long: string;
    /**
     * Code postal de l'établissement
     */
    cp: string;
}

/**
 * Trouve les établissements à proximité des coordonnées géographiques données.
 *
 * @param lat Latitude de la localisation
 * @param long Longitude de la localisation
 */
export function geo(lat: number|string, long: number|string): Promise<EtablissementGeoData>;

/**
 * Liste des erreurs pouvant être renvoyées par l'API.
 */
export namespace errors {
    /**
     * Code : -1
     * Indique une erreur générique renvoyée par Pronote.
     */
    const PRONOTE: PronoteErrorType;

    /**
     * Code : 1
     * Indique que le CAS demandé n'existe pas.
     */
    const UNKNOWN_CAS: PronoteErrorType;

    /**
     * Code : 2
     * Indique que votre adresse I.P. a été bannie de l'instance Pronote suite à une requête non autorisée. Si vous
     * obtenez cette erreur sans avoir fait de manipulation spéciale, merci d'ouvrir une issue sur la page GitHub
     * du projet.
     */
    const BANNED: PronoteErrorType;

    /**
     * Code : 3
     * Indique que vos identifiants ne sont pas bons. Il est possible que vous ayez besoin d'un CAS.
     */
    const WRONG_CREDENTIALS: PronoteErrorType;

    /**
     * Code : 4
     * Indique que le type de compte donné n'existe pas. Les valeurs possibles sont 'student', 'parent',
     * 'teacher', 'attendant', 'company', et 'administration'.
     */
    const UNKNOWN_ACCOUNT: PronoteErrorType;

    /**
     * Code : 5
     * Indique que la session a expirée, vous devriez peut-être utiliser {@link PronoteSession.setKeepAlive} ?
     */
    const SESSION_EXPIRED: PronoteErrorType;

    /**
     * Code : 6
     * Indique que votre adresse I.P. a été bannie de l'instance Pronote en raison d'un nombre trop élevé
     * de requêtes erronées. Si vous obtenez cette erreur sans avoir fait de manipulation spéciale ou échoué un trop
     * grand nombre de requête d'authentification, merci d'ouvrir une issue sur la page GitHub du projet.
     */
    const RATE_LIMITED: PronoteErrorType;

    /**
     * Code : 7
     * Indique que l'instance est actuellement fermée, pour maintenance ou car la rentrée n'a pas encore eu
     * lieu.
     */
    const CLOSED: PronoteErrorType;
}

/**
 * Type d'erreur pouvant être renvoyé par l'API.
 */
export interface PronoteErrorType
{
    /**
     * Code unique de l'erreur, voir {@link errors}
     */
    code: number

    /**
     * Instancie l'erreur.
     *
     * @param args Arguments demandés par le type d'erreur en question.
     */
    drop(...args: any): PronoteError
}

/**
 * Une erreur renvoyée par l'API.
 */
export interface PronoteError
{
    /**
     * Code unique du type d'erreur en question
     */
    code: number,

    /**
     * Message descriptif (en anglais) de l'erreur, ou message donné par Pronote (en français) si c'est une erreur
     * générique (erreur 'PRONOTE' : code -1).
     */
    message: string
}

/**
 * Leçon de l'emploi du temps.
 */
export interface Lesson
{
    /**
     * Date et horaire précis auquel commence le cours
     */
    from: Date,

    /**
     * Date et horaire précis auquel se termine le cours
     */
    to: Date,

    /**
     * Indique si c'est une retenue et non un cours
     */
    isDetention: boolean,

    /**
     * Dans le cas où un cours en remplace un autre, il arrive souvent que les deux cours soient présents dans
     * l'emploi du temps (mais superposés sur le site). Ce paramètre est à true s'il existe un ou plusieurs autre
     * cours au même horaire et à la même date que celui-ci.
     */
    hasDuplicate: boolean,

    /**
     * Matière du cours si disponible (pas le cas pour une retenue)
     */
    subject?: string,

    /**
     * Professeur assigné au cours si disponible (ou surveillant de la retenue)
     */
    teacher?: string,

    /**
     * Salle du cours si disponible
     */
    room?: string,

    /**
     * Information supplémentaire sur le cours donnée par Pronote. Exemple de valeurs : "Prof absent",
     * "Cours annulé", etc.
     * Determine les valeurs 'isAway' et 'isCancelled'.
     */
    status?: string,

    /**
     * Indique si le professeur est absent. Ne peut pas être à `true` en même temps que `isCancelled`.  Est à `null`
     * dans le cas d'une retenue.
     */
    isAway?: boolean,

    /**
     * Indique que le cours est annulé (par exemple parce qu'il est déplacé). Ne peut pas être à `true` en même
     * temps que `isAway`. Est à `null` dans le cas d'une retenue.
     */
    isCancelled?: boolean,

    /**
     * Couleur du cours dans l'emploi du temps. Est à `null` dans le cas d'une retenue.
     */
    color?: string
}

/**
 * Réponse à la requête des notes
 */
export interface Marks
{
    /**
     * Liste des matières avec ses moyennes et ses notes
     */
    subjects: Array<MarksSubject>,

    /**
     * Moyennes générales de l'élève et de sa classe si disponibles
     */
    averages: MarksAverages
}

/**
 * Notes et moyennes d'une matière
 */
export interface MarksSubject
{
    /**
     * Nom de la matière
     */
    name: string,

    /**
     * Moyennes de la matière dans la période demandé
     */
    averages: MarksSubjectAverages,

    /**
     * Couleur de la matière
     */
    color: string,

    /**
     * Notes de la matière pour la période demandée
     */
    marks: Array<Mark>
}

/**
 * Moyennes générales
 */
export interface MarksAverages
{
    /**
     * Moyenne générale de l'élève.
     * N'est pas défini si l'instance Pronote n'en autorise pas la consultation.
     */
    student?: number,

    /**
     * Moyenne générale de la classe.
     * N'est pas défini si l'instance Pronote n'en autorise pas la consultation.
     */
    studentClass?: number
}

/**
 * Moyennes d'une matière
 */
export interface MarksSubjectAverages
{
    /**
     * Moyenne de l'élève dans la matière
     */
    student: number,

    /**
     * Moyenne de la classe dans la matière
     */
    studentClass: number,

    /**
     * Moyenne la plus basse obtenue par un élève dans la classe
     */
    min: number,

    /**
     * Moyenne la plus haute obtenue par un élève dans la classe
     */
    max: number
}

/**
 * Note obtenue par l'élève
 */
export interface Mark
{

    /**
     * ID de la note
     */
    id: string,

    /**
     * Description de la note
     */
    title: string,

    /**
     * La note elle même, ou `null` si l'élève était absent.
     */
    value?: number,

    /**
     * L'échelle de la note (donc la note maximale possible, exemple '20' si la note est sur 20).
     */
    scale: number,

    /**
     * Moyenne de la classe. Valeur absente si tout le monde était absent
     */
    average?: number,

    /**
     * Coefficient de la note
     */
    coefficient: number,

    /**
     * Note la plus basse obtenue dans la classe. Valeur absente si tout le monde était absent
     */
    min?: number,

    /**
     * Note la plus haute obtenue dans la classe. Valeur absente si tout le monde était absent
     */
    max?: number,

    /**
     * Date de l'évaluation qui a entraîné cette note (supposément)
     */
    date: Date,

    /**
     * Si l'élève est marqué comme absent ou non noté
     */
    isAway: boolean
}

/**
 * Liste des évaluations d'une matière
 */
export interface EvaluationsSubject
{
    /**
     * Nom de la matière
     */
    name: string,

    /**
     * Professeur de la matière
     */
    teacher: string,

    /**
     * Couleur de la matière
     */
    color: string,

    /**
     * Liste des évaluations de la matière
     */
    evaluations: Array<Evaluation>
}

/**
 * Évaluation
 */
export interface Evaluation
{
    /**
     * ID de l'évaluation
     */
    id: string,

    /**
     * Nom de l'évaluation
     */
    name: string,

    /**
     * Date à laquelle l'évaluation a eu lieu
     */
    date: Date,

    /**
     * Coefficient de l'évaluation
     */
    coefficient: number,

    /**
     * Niveaux d'évaluations notés
     */
    levels: Array<EvaluationLevel>,
}

/**
 * Niveau noté lors d'une évaluation
 */
export interface EvaluationLevel
{
    /**
     * Nom du niveau
     */
    name: string,

    /**
     * Évaluation obtenue au niveau
     */
    value: EvaluationLevelValue,

    /**
     * Préfixes du niveau (ex: 'D1', 'D2.3')
     */
    prefixes: Array<string>
}

/**
 * Valeur obtenue à un niveau d'une évaluation
 */
export interface EvaluationLevelValue
{
    /**
     * Nom court (ex: 'A')
     */
    short: string,

    /**
     * Nom long (ex: 'Très bonne maîtrise')
     */
    long: string
}

/**
 * Liste des évènements de vie scolaire
 */
export interface Absences
{
    /**
     * Absences
     */
    absences: Array<Absence>,

    /**
     * Retards
     */
    delays: Array<Delay>,

    /**
     * Punitions
     */
    punishments: Array<Punishment>,

    /**
     * 'Autre évènements', littéralement
     */
    other: Array<OtherEvent>,

    /**
     * Total des absences pour chaque matière
     */
    totals: Array<SubjectAbsences>
}

/**
 * Absence à un cours
 */
export interface Absence
{
    /**
     * Début du premier cours manqué ou lorsque le cours a été quitté
     */
    from: Date,

    /**
     * Fin du dernier cours manqué ou lorsque l'élève est revenu en cours
     */
    to: Date,

    /**
     * Si l'absence a été justifiée
     */
    justified: boolean,

    /**
     * Si l'absence a été réglée
     */
    solved: boolean,

    /**
     * Nombre d'heures manquées
     */
    hours: number,

    /**
     * Raison donnée pour l'absence après justification
     */
    reason?: string
}

/**
 * Retard à un cours
 */
export interface Delay
{
    /**
     * Date et horaire du cours où le retard a eu lieu
     */
    date: Date,

    /**
     * Si le retard a été justifié
     */
    justified: boolean,

    /**
     * Si le retard a été réglé
     */
    solved: boolean,

    /**
     * Justification du retard (visiblement tout le temps vide, voir {@link reason} pour la raison donnée)
     */
    justification: string,

    /**
     * Nombre de minutes de cours manquées
     */
    minutesMissed: number,

    /**
     * Raison donnée pour le retard avant ou après justification
     */
    reason?: string
}

/**
 * Punition donnée à l'élève
 */
export interface Punishment
{
    /**
     * Date et moment auquel la punition a été donnée
     */
    date: Date,

    /**
     * Si la punition a lieu a une exclusion
     */
    isExclusion: boolean,

    /**
     * Si la punition a été donnée suite à un évènement ayant eu lieu pendant un cours
     */
    isDuringLesson: boolean,

    /**
     * Si un devoir a été donné en tant que punition
     */
    homework: string,

    /**
     * Les circonstances ayant donné lieu à la punition
     */
    circumstances: string,

    /**
     * Le professeur ou personnel de l'école ayant donné la punition
     */
    giver: string,

    /**
     * Motif de la punition
     */
    reason?: string,

    /**
     * Si la punition a donné lieu a une retenue, si oui la retenue en question, sinon le champ est absent.
     */
    detention?: Detention
}

/**
 * Une retenue donnée suite à une punition
 */
export interface Detention
{
    /**
     * Date et horaire précis de début de la retenue
     */
    from: Date,

    /**
     * Date et horaire précis de fin de la retenue
     */
    to: Date
}

/**
 * Autre évènement de vie scolaire
 */
export interface OtherEvent
{
    /**
     * Type d'évènement (exemple : 'Leçon non apprise')
     */
    kind: string,

    /**
     * Date à laquelle a eu lieu l'évènement
     */
    date: Date,

    /**
     * Le professeur ou personnel de l'école ayant rapporté l'évènement
     */
    giver: string,

    /**
     * Commentaire fait sur l'évènement
     */
    comment: string,

    /**
     * Matière liée à l'évènement (peut ne pas exister)
     */
    subject?: string
}

/**
 * Nombre d'heures manquées dans une matière
 */
export interface SubjectAbsences
{
    /**
     * Nom de la matière
     */
    subject: string,

    /**
     * Nombre d'heure auquel l'élève a assisté
     */
    hoursAssisted: number,

    /**
     * Nombre d'heure que l'élève a manqué
     */
    hoursMissed: number,

    /**
     * Si la matière est un "groupe", les sous-matières du groupe, sinon le champ est absent.
     */
    subs?: Array<SubjectAbsences>
}

/**
 * Information
 */
export interface Info
{
    /**
     * Date à laquelle l'information a été annoncée
     */
    date: Date,

    /**
     * Titre de l'information
     */
    title: string,

    /**
     * Auteur de l'information
     */
    author: string,

    /**
     * Contenu de l'information
     */
    content: string,

    /**
     * Contenu de l'information en HTML
     */
    htmlContent: string,

    /**
     * Fichiers attachés à l'information
     */
    files: Array<File>
}

/**
 * Contenu d'un cours
 */
export interface LessonContent
{
    /**
     * Matière du cours
     */
    subject: string,

    /**
     * Professeurs liés au cours
     */
    teachers: Array<string>,

    /**
     * Horaire précise de début du cours
     */
    from: Date,

    /**
     * Horaire précise de fin du cours
     */
    to: Date,

    /**
     * Couleur de la matière du cours
     */
    color: string,

    /**
     * Titre du contenu
     */
    title: string,

    /**
     * Description du contenu
     */
    description: string,

    /**
     * Description du contenu en HTML
     */
    htmlDescription: string,

    /**
     * Fichiers attachés au contenu
     */
    files: Array<File>,

    /**
     * Catégorie du contenu
     */
    category: string
}

/**
 * Contenu d'un devoir
 */
export interface Homework
{
    /**
     * Description du devoir
     */
    description: string,

    /**
     * Description du devoir en HTML
     */
    htmlDescription: string,

    /**
     * Matière du cours du devoir
     */
    subject: string,

    /**
     * Horaire précise à laquelle le devoir a été donné
     */
    givenAt: Date,

    /**
     * Horaire précise à laquelle le devoir doit être rendu
     */
    for: Date,

    /**
     * Si le travail a été marqué comme "fait" ou non
     */
    done: boolean,

    /**
     * Couleur de la matière du devoir
     */
    color: string,

    /**
     * Fichiers attachés au devoir
     */
    files: Array<File>
}

/**
 * Un fichier attaché par exemple à une information, un devoir, ou au contenu d'un cours
 */
export interface File
{
    /**
     * Nom du fichier avec son extension
     */
    name: string,

    /**
     * URL directe du fichier
     */
    url: string
}

/**
 * Menus des repas d'un jour de la semaine
 */
export interface MenuDay
{
    /**
     * Date du jour en question
     */
    date: Date,

    /**
     * Plats des groupes des menus des repas du jour
     */
    meals: Array<Array<Array<MenuMealEntry>>>
}

/**
 * Plat d'un menu
 */
export interface MenuMealEntry
{
    /**
     * Nom du plat
     */
    name: string,

    /**
     * Labels du plat (exemple : bio)
     */
    labels: Array<MenuMealLabel>
}

/**
 * Label d'un plat (exemple : bio)
 */
export interface MenuMealLabel
{
    /**
     * Nom du label
     */
    name: string,

    /**
     * Couleur du label
     */
    color: string
}

// Low-level API (if you need to use this, you can, but it may mean I've forgotten a use case, please open an issue!)

export function cipher(session: PronoteSession, data: any, options?: CipherOptions): string;
export function decipher(session: PronoteSession, data: any, options?: DecipherOptions): string | forge.util.ByteBuffer;

export function getStart(url: string, username: string, password: string, cas: string, type?: PronoteAccountTypeName | PronoteAccountType): Promise<PronoteStartParams>;
export function auth(session: PronoteSession): Promise<void>;

export function fetchParams(session: PronoteSession, iv: forge.util.ByteBuffer): Promise<PronoteParams>;
export function fetchId(session: PronoteSession, username: string, fromCas: boolean): Promise<PronoteIdResponse>;
export function fetchAuth(session: PronoteSession, challenge: string, key: forge.util.ByteBuffer): Promise<string>;
export function fetchUser(session: PronoteSession): Promise<PronoteUser<any>>;
export function fetchTimetable(session: PronoteSession, date?: Date): Promise<PronoteTimetable>;
export function fetchTimetableDaysAndWeeks(session: PronoteSession): Promise<PronoteTimetableDaysAndWeeks>;
export function fetchMarks(session: PronoteSession, period?: PronotePeriod): Promise<PronoteMarks>;
export function fetchEvaluations(session: PronoteSession, period?: PronotePeriod): Promise<Array<PronoteEvaluation>>;
export function fetchAbsences(session: PronoteSession, period?: PronotePeriod, from?: Date, to?: Date): Promise<PronoteAbsences>;
export function fetchInfos(session: PronoteSession): Promise<PronoteInfos>;
export function fetchContents(session: PronoteSession, fromWeek?: number, toWeek?: number): Promise<PronoteLessonsContents>;
export function fetchHomeworks(session: PronoteSession, fromWeek?: number, toWeek?: number): Promise<Array<PronoteHomework>>;
export function fetchMenu(session: PronoteSession, date?: Date): Promise<PronoteMenu>;

export function navigate(session: PronoteSession, page: string, tab: number, data?: any): Promise<any>;
export function keepAlive(session: PronoteSession): Promise<void>;

export function toPronoteWeek(session: PronoteSession, date: Date): number;
export function toUTCWeek(date: Date): number;
export function toPronoteDay(session: PronoteSession, date: Date): number;
export function fromPronoteDay(session: PronoteSession, date: number): Date;
export function toPronoteDate(date: Date): string;

export function getFileURL(session: PronoteSession, file: PronoteObject): string;

export function request(session: PronoteSession, name: string, content: any): Promise<any>;

export interface PronoteSessionOptions
{
    serverURL: string,
    sessionID: number,
    type: PronoteAccountTypeName | PronoteAccountType,

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

    e: string, // One time use username after CAS auth
    f: string, // One time use password after CAS auth

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
    onlySchoolYearEvaluationsInAutoValidation: boolean, // General.NeComptabiliserQueEvalsAnneeScoDsValidAuto
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

export interface PronoteUser<A extends PronoteUserAuthorizations> extends PronoteObject
{
    establishmentsInfo: Array<PronoteEstablishmentInfo>, // ressource.listeInformationsEtablissements
    userSettings: PronoteUserSettings, // ressource.parametresUtilisateur
    sessionAuthorizations: PronoteSessionAuthorizations, // user.autorisationsSession.fonctionnalites
    authorizations: A, // autorisations
    minPasswordSize: number, // reglesSaisieMDP.min
    maxPasswordSize: number, // reglesSaisieMDP.max
    passwordRules: Array<number>, // reglesSaisieMDP.regles
    kioskAccess: boolean, // autorisationKiosque
    tabs: Array<PronoteTab>, // listeOnglets
    hiddenTabs: Array<number>, // listeOngletsInvisibles
    notifiedTabs: Array<number>, // lisetOngletsNotification
}

export interface PronoteStudentUser extends PronoteStudent, PronoteUser<PronoteStudentAuthorizations>
{
}

export interface PronoteStudent extends PronoteObject
{
    establishment: PronoteObject, // ressource.Etablissement

    /**
     * URL de l'avatar de l'utilisateur, si disponible
     */
    avatar?: string, // ressource.avecPhoto && photo.jpg (ressource.N)

    /**
     * Classe de l'utilisateur
     */
    studentClass: PronoteObject, // ressource.classeDEleve
    classHistory: Array<PronoteClassHistoryElement>, // ressource.listeClassesHistoriques
    groups: Array<PronoteObject>, // ressource.listeGroupes
    tabsPillars: Array<PronoteTabPillars>, // ressource.listeOngletsPourPiliers
    tabsPeriods: Array<PronoteTabPeriods>, // ressource.listeOngletsPourPeriodes
}

export interface PronoteStudentAuthorizations extends PronoteUserAuthorizations
{
    maxUserWorkFileSize: number // tailleMaxRenduTafEleve
}

export interface PronoteParentUser extends PronoteUser<PronoteParentAuthorizations>
{
    isDelegate: boolean, // estDelegue
    isBDMember: boolean, // estMembreCA
    canDiscussWithManagers: boolean, // avecDiscussionResponsables
    absencesReasons: Array<PronoteObject>, // listeMotifsAbsences
    delaysReasons: Array<PronoteObject>, // listeMotifsRetards
    classDelegates: Array<PronoteObject>, // listeClassesDelegue
    students: Array<PronoteStudent>
}

export interface PronoteParentAuthorizations extends PronoteUserAuthorizations
{
    staffDiscussion: boolean, // AvecDiscussionPersonnels
    parentsDiscussion: boolean, // AvecDiscussionParents
    editStudentPassword: boolean, // avecSaisieMotDePasseEleve
    editCoordinates: boolean, // avecSaisieInfosPersoCoordonnees
    editAuthorizations: boolean // avecSaisieInfosPersoAutorisations
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
    defaultPeriod?: PronoteObject // periodeParDefault
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
    editPassword: boolean, // compte.avecSaisieMotDePasse
    editPersonalInfo: boolean, // compte.avecInformationsPersonnelles
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
    id: string, //Id Notes
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
    isGroupMark: boolean // estEnGroupe
}

export interface PronoteEvaluation extends PronoteObject
{
    id: string,
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
    text: string, // texte
    files: Array<PronoteObject> // listePiecesJointes
}

export interface PronoteLessonsContents
{
    lessons: Array<PronoteLessonContent>, // ListeCahierDeTextes
    resources: PronoteLessonsContentsResources, // ListeRessourcesPedagogiques
    numericalResources: Array<PronoteObject> // ListeRessourcesNumeriques
}

export interface PronoteLessonContent extends PronoteObject
{
    lesson: PronoteObject, // cours
    locked: boolean, // verrouille
    groups: Array<PronoteObject>, // listeGroupes
    subject: PronoteObject, // Matiere
    color: string, // CouleurFond
    teachers: Array<PronoteObject>, // listeProfesseurs
    from: Date, // Date
    to: Date, // DateFin
    content: Array<PronoteLessonContentEntry>, // listeContenus
    skills: Array<PronoteObject> // listeElementsProgrammeCDT
}

export interface PronoteLessonContentEntry extends PronoteObject
{
    description: string, // descriptif
    category: PronoteObject, // categorie
    path: number, // parcoursEducatif
    files: Array<PronoteObject>, // ListePieceJointe
    training: Array<PronoteObject> // training.V.ListeExecutionsQCM
}

export interface PronoteLessonsContentsResources
{
    resources: Array<PronoteObject>, // listeRessources
    subjects: Array<PronoteObject> // listeMatieres
}

export interface PronoteHomework
{
    description: string, // descriptif
    lesson: PronoteObject, // cours
    subject: PronoteObject, // Matiere
    givenAt: Date, // DonneLe
    for: Date, // PourLe
    done: boolean, // TAFFait
    difficultyLevel: number, // niveauDifficulte
    duration: number, // duree
    color: string, // CouleurFond
    files: Array<PronoteObject> // ListePieceJointe
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

