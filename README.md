# Pronote API - PLEASE READ ME

## Peut être utilisé avec N'IMPORTE QUEL LANGAGE de prog, pas besoin de skills en JS

API Pronote **2020** complète et plutôt stable avec intégration de nombreux CAS (connexion avec comptes spéciaux pour les régions).

_Note :_ La connexion via compte parent est supportée

## Données renvoyées

- **Emploi du temps** complet de la semaine en cours + prochaine, ordonné, avec timestamp précis pour chaque cours et semaine,
et marquage des profs absents et cours annulés
- **Devoirs** (si dispo) de la semaine en cours + prochaine, ordonnés, avec timestamp précis et fichiers joints
- **Notes** de tous les trimestres avec moyenne de chaque matière et moyenne générale (de la classe et de l'élève)
- **Bulletins** (si dispo) de tous les trimestres
- **Fichiers** partagés
- **Menu de la Cantine** (si dispo)
- **Informations**
- **Infos de l'élève** (nom + classe + avatar)

## Comptes région supportés

**Uniquement dans le cas où vous ne pouvez PAS vous connecter directement par Pronote, mais devez passer par une interface régionale spéciale**

**Si vous pouvez vous connecter directement sur l'interface de Pronote, l'API devrait fonctionner PEU IMPORTE VOTRE ACADÉMIE**

Sinon, l'API propose de se connecter à Pronote avec des comptes des académies suivantes :

- Académie de Lyon
- Académie de Montpellier
- Académie de Toulouse
- Académie de Grenoble
- Académie de Rouen
- Académie de Rennes
- Académie de Clermont-Ferrand
- Académie de Reims
- Académie de Nancy-Metz
- Académie de Strasbourg
- Académie de Caen
- Académie d'Orleans-Tours
- Académie de Besançon
- Académie de Nantes
- ENT "Île de France"

## Utilisation

C'est un mini serveur HTTP qui peut donc être appelé via n'importe que langage de programmation, il suffit
d'une ou deux requêtes POST.

Mise en route du serveur (requiert Node.JS) :
```bash 
$ npm i
$ node index.js
```

Utilisation :

Requête `POST` sur `http://127.0.0.1:21727/` avec en corps :
```json
{
  "type": "fetch",
  "username": "Nom d'utilisateur",
  "password": "Mot de passe",
  "url": "Url du serveur Pronote (avec / à la fin, et sans eleve.html)",
  "cas": "Nom d'un fichier dans src/cas sans .js, exemple 'ac-montpellier', ou 'none' si connexion directe (ou juste ne pas renseigner le field)" 
}
``` 

Pour séparer la partie authentification de la partie récupération des données (util pour afficher un message différent),
il est possible de faire deux fois cette requête une fois avec "type": "login", puis avec "type": "fetch" (dans les deux requêtes
les autres paramètres doivent être les mêmes). 

La requête fetch renvoie un JSON avec toutes les informations reçues : [**Exemple de sortie de l'application**](https://gist.github.com/Litarvan/ec666fa544f6d036e515867d0f266ca7)

## Clients

L'API peut être utilisée depuis n'importe que langage (une simple requête POST et un parser JSON suffisent), ça n'empêche pas qu'il est utile dans
certains langages d'avoir des objets pour parser ça correctement. Des clients sont donc disponibles dans certains
langages (n'hésitez pas à en faire pour d'autres langages au besoin).

- [Client Java](https://github.com/Litarvan/pronote-api-client-java)
