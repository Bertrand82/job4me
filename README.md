# BgOffreEmploiRepondeur

Ce projet vise à automatiser la création de lettres de motivation personnalisées et de CV à partir d'une offre d'emploi et d'un profil utilisateur. 

L'utilisateur colle une offre d'emploi et fournit son CV (fichier PDF ou texte copié/collé). 

L'IA génère alors une lettre de motivation adaptée, et peut éventuellement adapter le CV selon les exigences du poste et la personnalité du candidat. 

Les documents générés peuvent être copiés, téléchargés ou envoyés automatiquement à un destinataire.

## TODO

-- DONE Récupérer les prompts IA pour la génération de lettres et CV.
-- repenser design personalisation
-- permettre un rebouclage en rajoutant des consignes 
-- Archivage local
-- Utilser purge css
## Architecture Fonctionnelle

### 1. **ComponentCV**
- **Rôle** : Récupération et affichage du CV
- **Fonctionnalités** :
  - Import du CV en PDF ou zone de texte pour copier/coller le contenu
  - Extraction des informations clés (expérience, compétences, formation)
  - Option de personnalisation/adaptation du CV en fonction de l'offre

### 2. **ComponentOE (Offre d'Emploi)**
- **Rôle** : Zone de saisie de l’offre d’emploi
- **Fonctionnalités** :
  - Zone de texte pour copier/coller l'offre
  - Extraction des mots-clés, compétences demandées, missions

### 3. **ComponentIA**
- **Rôle** : Génération de la lettre de motivation
- **Fonctionnalités** :
  - Champs pour saisir des paramètres de personnalité ou de style (ex : créatif, sérieux, dynamique)
  - Génération automatique de la lettre de motivation à partir du CV, de l'offre et des paramètres
  - Possibilité d’ajuster le texte généré avant validation

### 4. **Gestion du CV personnalisé**
- **Fonctionnalités** :
  - Adaptation automatique du CV en fonction de l'offre (mise en avant des compétences pertinentes)
  - Suggestions de modifications

### 5. **Archivage**
- **Options** :
  - Sauvegarde des lettres et CV générés en local (navigateur, fichiers)
  - Sauvegarde automatisée sur Google Drive (via API OAuth)
  - Intégration possible avec une base de données pour suivi des candidatures

### 6. **Exportation / Envoi**
- **Fonctionnalités** :
  - Copier/coller facile des documents générés
  - Téléchargement en PDF ou Word
  - Envoi automatique par email (SMTP/API Gmail)
  - Historique des envois

---

## Fonctionnalités complémentaires à envisager

- **Gestion multi-profils** : permettre d'enregistrer plusieurs CV/personnalités par utilisateur.
- **Tableau de bord des candidatures** : suivi des offres, lettres envoyées, réponses reçues.
- **Suggestions automatiques** : recommandations sur les points à améliorer dans le CV ou la lettre.
- **Intégration LinkedIn** : récupération automatique d’expériences.
- **Support multilingue** : génération de lettres et CV dans plusieurs langues.
- **Confidentialité** : gestion des données personnelles et options de suppression.

---

## Stack technique (proposition)

- **Frontend** : Angular
- **Backend** : firebase, java spring
- **IA** : Gemini
- **PDF** : pdf.js, pdf-lib pour parsing/génération
- **Base de données** :  Firebase
- **Archivage** : Intégration Google Drive API, stockage local
- **Authentification** : Google OAuth pour accès Drive

## Schéma de l'application (exemple)

```
Utilisateur
   |
   |--- [Saisie Offre] --> ComponentOE
   |--- [Upload/Coller CV] --> ComponentCV
   |--- [Paramètres Perso] --> ComponentIA
                       |
                       |--- [Génération Lettre & CV personnalisé]
                       |--- [Archivage] <--> [Google Drive / Local / BDD]
                       |--- [Export/Envoi]
```

---
## À compléter / discuter

- Préciser les besoins en matière de confidentialité et de gestion des données.
- Définir les critères de personnalisation (ton, niveau de formalité, etc.).
- Choisir les technologies d'IA et d'intégration (APIs).
- Valider les modalités d’archivage et d’envoi (besoin de logs, suivi, etc.).

## Development server

To start a local development server, run:

## Noms possibles :
CandidAI
JobLetter
CVBoostAI
LettrAI
MotivatorAI
EmploiGenius
JobMatchAI
LettrePro
BoostMonCV
JobWriter
LettreMagique
PitchMe
EmploiExpress
Motiv’IA
CandiMate
MyMotivationBot
CVSmart
MotivaJob
Candidature+
RapidJobApp

## Stratégie marketing


1. Ciblage
   Étudiants, jeunes diplômés, demandeurs d’emploi, personnes en reconversion, établissements scolaires, coachs emploi.
2. Acquisition
   SEO : blog et guides sur la recherche d’emploi, CV, lettres, IA.
   Réseaux sociaux : LinkedIn (posts experts, carrousels, témoignages), TikTok/Instagram (vidéos démos, challenges).
   Influence/partenariats : micro-influenceurs, coachs, écoles.
   Presse : articles sur l’IA appliquée à l’emploi dans médias tech, éducation, RH.
   Référencement plateformes : job boards, annuaires d’outils IA, app stores.
3. Activation/Conversion
   Offre d’essai : X lettres gratuites à l’inscription.
   Gamification : badges, progression, challenges (ex : “1 candidature/jour”).
   Upsell in-app dès la limite gratuite atteinte.
   Landing pages ciblées par persona (étudiant, reconversion, RH, etc).
4. Rétention
   Emailing intelligent : rappels, conseils personnalisés, nouveautés.
   Tableau de bord suivi candidatures.
   Notifications de suivi (“Avez-vous eu une réponse ?”).
   Nouveautés régulières (ex : nouveaux modèles de lettres, langues).
5. Viralité
   Parrainage : bonus pour invitations réussies.
   Partage facile de réussite (“J’ai trouvé un job via BgOffreEmploiRepondeur !” sur LinkedIn).


## Points d'attention
- Gestion multi-profils : un utilisateur peut gérer plusieurs CV/lettres (ex : pour différents types de postes), ce qui favorise la rétention.
- Historique et archivage : retrouver facilement toutes ses candidatures, suivi des réponses, exportation avancée.
- Coaching intégré : analyse automatique du marché des offres, recommandations d’amélioration de profil, support vidéo/chat avec experts emploi.
- Communauté : espace d’entraide, partage de candidatures réussies, forums de questions/réponses.
- Marketplace : accès à des modèles premium, à des services de correction humaine, à des ateliers en ligne.
-  Intégrations : Devenir indispensable dans le parcours candidat
   - Les candidats ne veulent pas multiplier les outils: c’est la capacité à s’intégrer dans leur environnement qui fera la différence.
   - Les intégrations accélèrent l’adoption, augmentent la valeur perçue, et ouvrent des marchés B2B.
     - Comment ?
       - Import LinkedIn: récupération automatique des expériences, certifications, formations.
       - Connecteurs job boards: import/export automatique d’offres d’emploi (Indeed, Pôle Emploi, Welcome to the Jungle…).
       - Envoi direct: candidatures envoyées directement depuis l’application, tracking des ouvertures.
       - google Drive/Dropbox : archivage automatique, recherche facile dans ses documents.
       - Intégrations écoles/ATS : connexion avec les logiciels RH, plateformes d’orientation, CRM de candidatures.
       - API ouverte : permettre à d’autres outils d’utiliser les fonctionnalités IA (ex : intégration dans un intranet étudiant, une plateforme de e-learning…).

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```
## install lib

```bash
npm install pdfjs-dist

```
## Building

To build the project run:


```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
