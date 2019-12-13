# Pronote API - PLEASE READ ME

## Peut être utilisé avec N'IMPORTE QUEL LANGAGE de prog, pas besoin de skills en JS

API Pronote **2020** complète et plutôt stable avec intégration de nombreux CAS (connexion avec comptes spéciaux pour les régions).

Pour toute question ou demande d'ajout d'un CAS (n'hésitez pas à demander je fais ça vite), voire si besoin d'explications sur
le fonctionnement de Pronote : `Litarvan#0420`

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

- Rien (connexion directe Pronote)
- Académie de Montpellier
- Académie de Grenoble
- Académie de Reims
- Académie de Rouen
- Mon Bureau Numérique
- Toutatice (Bretagne)

Encore une fois, cette liste peut être agrandie : n'hésitez pas à me contacter, je afis ça rapidement

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
