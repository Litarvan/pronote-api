# Pronote API - LISEZ MOI ABSOLUMENT

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/Litarvan/pronote-api/Node.js%20linting%20and%20testing/master?label=tests&logo=github&style=flat-square)
[![MIT license](https://img.shields.io/badge/license-MIT-lightgray?style=flat-square)](LICENSE)
[![Latest release](https://img.shields.io/github/v/release/Litarvan/pronote-api?color=darkgreen&include_prereleases&label=Latest%20release&style=flat-square)](https://github.com/Litarvan/pronote-api/releases)
[![NPM release](https://img.shields.io/npm/v/pronote-api?style=flat-square)](https://npmjs.org/package/pronote-api)

API Pronote **2020/2021** complète et plutôt stable avec intégration de nombreux CAS (connexion avec comptes spéciaux pour les régions).

Disponible en tant que :
- Librairie Node.JS [via NPM](https://www.npmjs.com/package/pronote-api) (note : **support TypeScript** complet)
- Serveur GraphQL (donc depuis **n'importe que langage**), [voir instructions](#serveur-graphql)

**Nouveauté 2020/2021 : [Session conservable](#conserver-la-session)**

## Données récupérables

- Infos Pronote, établissement et utilisateur
- Emploi du temps
- Devoirs
- Notes
- Compétences/évaluations
- Absences/punitions/retenues
- Informations
- Menu de la cantine
- Fichiers

À chaque fois, il est possible de choisir quelle période voire quelle intervalle de jours récupérer précisément.

## Comptes région supportés

**Uniquement dans le cas où vous ne pouvez PAS vous connecter directement par Pronote, mais devez passer par une interface régionale spéciale**

**Si vous pouvez vous connecter directement sur l'interface de Pronote, l'API devrait fonctionner PEU IMPORTE VOTRE ACADÉMIE**

Sinon, l'API propose de se connecter à Pronote avec des comptes des académies suivantes :

<details>
  <summary>CAS list</summary>
  
    - Académie d'Orleans-Tours (CAS : ac-orleans-tours, URL : "ent.netocentre.fr")
    - Académie de Besançon (CAS : ac-besancon, URL : "cas.eclat-bfc.fr")
    - Académie de Bordeaux (CAS : ac-bordeaux, URL : "mon.lyceeconnecte.fr")
    - Académie de Bordeaux 2 (CAS : ac-bordeaux2, URL : "ent2d.ac-bordeaux.fr")
    - Académie de Caen (CAS : ac-caen, URL : "fip.itslearning.com")
    - Académie de Clermont-Ferrand (CAS : ac-clermont, URL : "cas.ent.auvergnerhonealpes.fr")
    - Académie de Dijon (CAS : ac-dijon, URL : "cas.eclat-bfc.fr")
    - Académie de Grenoble (CAS : ac-grenoble, URL : "cas.ent.auvergnerhonealpes.fr")
    - Académie de la Loire (CAS : cybercolleges42, URL : "cas.cybercolleges42.fr")
    - Académie de Lille (CAS : ac-lille, URL : "cas.savoirsnumeriques62.fr")
    - Académie de Lille (CAS : ac-lille2, URL : "teleservices.ac-lille.fr")
    - Académie de Limoges (CAS : ac-limoges, URL : "mon.lyceeconnecte.fr")
    - Académie de Lyon (CAS : ac-lyon, URL : "cas.ent.auvergnerhonealpes.fr)
    - Académie de Marseille (CAS : atrium-sud, URL : "atrium-sud.fr")
    - Académie de Montpellier (CAS : ac-montpellier, URL : "cas.mon-ent-occitanie.fr")
    - Académie de Nancy-Metz (CAS : ac-nancy-metz, URL : "cas.monbureaunumerique.fr")
    - Académie de Nantes (CAS : ac-nantes, URL : "cas3.e-lyco.fr")
    - Académie de Poitiers (CAS : ac-poitiers, URL : "mon.lyceeconnecte.fr")
    - Académie de Reims (CAS : ac-reims, URL : "cas.monbureaunumerique.fr")
    - Académie de Rouen (Arsene76) (CAS : arsene76, URL : "cas.arsene76.fr")
    - Académie de Rouen (CAS : ac-rouen, URL : "nero.l-educdenormandie.fr")
    - Académie de Strasbourg (CAS : ac-strasbourg, URL : "cas.monbureaunumerique.fr")
    - Académie de Toulouse (CAS : ac-toulouse, URL : "cas.mon-ent-occitanie.fr")
    - Académie du Val-d'Oise (CAS : ac-valdoise, URL : "cas.moncollege.valdoise.fr")
    - ENT "Agora 06" (Nice) (CAS : agora06, URL : "cas.agora06.fr")
    - ENT "Haute-Garonne" (CAS : haute-garonne, URL : "cas.ecollege.haute-garonne.fr")
    - ENT "Hauts-de-France" (CAS : hdf, URL : "enthdf.fr")
    - ENT "La Classe" (Lyon) (CAS : laclasse, URL : "www.laclasse.com")
    - ENT "Lycee Connecte" (Nouvelle-Aquitaine) (CAS : lyceeconnecte, URL : "mon.lyceeconnecte.fr")
    - ENT "Seine-et-Marne" (CAS : seine-et-marne, URL : "ent77.seine-et-marne.fr")
    - ENT "Somme" (CAS : somme, URL : "college.entsomme.fr")
    - ENT "Portail Famille" (Orleans Tours) (CAS : portail-famille, URL : "seshat.ac-orleans-tours.fr:8443")
    - ENT "Toutatice" (Rennes) (CAS : toutatice, URL : "www.toutatice.fr")
    - ENT "Île de France" (CAS : iledefrance, URL : "ent.iledefrance.fr")
    - ENT "Paris Classe Numerique" (CAS : parisclassenumerique, URL : "ent.parisclassenumerique.fr")
    - ENT "Lycee Jean Renoir Munich" (CAS : ljr-munich, URL : "cas.kosmoseducation.com")
    - ENT "L'Eure en Normandie" (CAS : eure-normandie, URL : "cas.ent27.fr")  
</details>


## Utilisation

### Librairie

```
$ npm i --save pronote-api
```

```javascript
const pronote = require('pronote-api');

// Exemple
const url = 'https://demo.index-education.net/pronote/';
const username = 'demonstration';
const password = 'pronotevs';

async function main()
{
    const session = await pronote.login(url, username, password/*, cas*/);
    
    console.log(session.user.name); // Affiche le nom de l'élève
    console.log(session.user.studentClass.name); // Affiche la classe de l'élève
    
    const timetable = await session.timetable(); // Récupérer l'emploi du temps d'aujourd'hui
    const marks = await session.marks(); // Récupérer les notes du trimestre
    
    console.log(`L'élève a ${timetable.length} cours aujourd'hui`); 
    console.log(`et a pour l'instant une moyenne de ${marks.averages.student} ce trimestre.`);
    
    // etc. les fonctions utilisables sont 'timetable', 'marks', 'contents', 'evaluations', 'absences', 
    // 'homeworks', 'infos', et 'menu', sans oublier les champs 'user' et 'params' qui regorgent d'informations.
}

main().catch(err => {
    if (err.code === pronote.errors.WRONG_CREDENTIALS.code) {
        console.error('Mauvais identifiants');    
    } else {
        console.error(err);
    }
});
```

#### TypeScript

```typescript
import { login } from 'pronote-api';

async function main()
{
    const session = await login(url, username, password/*, cas*/);
    // ... Voir l'exemple JavaScript
}
```

### Serveur GraphQL

```
$ npm i -g pronote-api
$ pronote-api-server
```

**Note : Toutes les requêtes nécessitent la présence du header `Content-Type: application/json`**

Pour commencer, il faut se connecter avec une requête `POST` sur `/auth/login` contenant :
```json
{
    "url": "URL de l'instance Pronote",
    "username": "Nom d'utilisateur",
    "password": "Mot de passe",
    "cas": "CAS (facultatif)"
}
```

Le serveur renverra alors une réponse de cette forme :
```json
{
    "token": "UN TOKEN DE SESSION"  
}
```

Retenez le Token, et vous pourrez appeler `POST /auth/logout` et `POST /graphql` **avec en Header `Token: LETOKEN`**,
pour cette dernière le contenu doit être un JSON avec un field `query` contenant votre requête GraphQL.

Exemple, pour récupérer les salles des cours du Mercredi 2 Septembre :
```graphql
{
    timetable(from: "2020-09-02") {
        room   
    }
}
```
Le schéma parent des requêtes et mutations se trouve [à cet endroit](https://github.com/Litarvan/pronote-api/blob/master/src/server/schemas/parent.graphql)

Le schéma élèves des requêtes et mutations se trouve [à cet endroit](https://github.com/Litarvan/pronote-api/blob/master/src/server/schemas/student.graphql)

Le schéma commun des requêtes et mutations se trouve [à cet endroit](https://github.com/Litarvan/pronote-api/blob/master/src/server/schemas/common.graphql) 

### Au secours je n'arrive pas à m'y connecter

Par défaut le serveur est ouvert sur `127.0.0.1`, vous ne pouvez donc vous y connecter que depuis la même machine
et avec cette adresse. Pour le lancer le serveur sur une autre adresse ou un autre port, utilisez
`pronote-api-server PORT HOST`

**ATTENTION : Il n'est pas prévu et probablement peu sécurisé d'ouvrir le serveur sur l'extérieur**

## Conserver la session

Une des nouvelles fonctionnalités de l'API est le fait de pouvoir garder la session envie indéfiniment.
Il suffit pour ça d'utiliser la fonction `session.setKeepAlive(true);` (ou la mutation `mutation { setKeepAlive(enabled: true) }`).

**ATTENTION : Les sessions dureront à l'infini tant que `session.setKeepAlive(false);` ne sera pas appelé ou le programme arrêté
(dans le cas du serveur, `mutation { setKeepAlive(enabled: false) }` appelé, `/auth/logout` exécuté ou le serveur arrêté).**

## API bas niveau

Il est très possible que quelque chose dont vous ayez besoin ne soit pas renvoyé par l'API, pas de panique. L'API bas
niveau permet d'accéder à tout : Les fonctions 'fetch' exportées (fetchHomeworks, fetchTimetable, etc.) permettent
de récupérer la réponse complète de Pronote simplement traduite sans traitement supplémentaire.

Si jamais une requête dont vous avez besoin n'est pas exportée, vous pouvez utiliser la fonction 'request' qui permet
de faire facilement une requête à Pronote. Et si vous voulez outrepasser/modifier la partie authentification, vous
pouvez manuellement créer une session.
