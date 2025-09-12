
------------------------------------------------
Projet AlexXP - Documentation Technique

# 📑 Table des matières
1. [Introduction](#1-introduction)  
2. [Technologies](#2-technologies)  
3. [Front-End](#31-architecture)         
   3.1. [Architecture](#31-architecture)  
   3.2. [Arborescence](#32-arborescence)  
4. [Ops](#41-deploiement)  
   4.1. [Déploiement](#41-deploiement)  
   4.2. [Serveur](#42-serveur)  
5. [Datation du code](#5-datation-du-code)  
6. [Fonctionnalités](#6-fonctionnalités)  
7. [Analyse](#71-points-forts)     
   7.1. [Points forts](#71-points-forts)  
   7.2. [Pistes d'amélioration](#72-pistes-damelioration)  
8. [Crédits](#8-crédits)  

------------------------------------------------

## 1. Introduction

Ce projet est un portfolio interactif, sous la forme d’une recréation de Windows XP en **HTML / CSS / JS**.  
Accessible à ce lien : https://portfolio.alexbalmes.dev  
Il me sert de vitrine technologique pour présenter mes compétences aux recruteurs, ainsi que certains de mes anciens projets.  

- Pour les RH : l’application *note* est ouverte par défaut, présentant le projet de manière simple.  
- Pour les directeurs techniques : un lien redirige vers le repo GitHub du projet et ce README.  

Cette documentation a été mise à jour le 12/09/2025.  

------------------------------------------------
## 2. Technologies  

La stack technique est :  

- **Front-end**  
  - HTML5  
  - CSS3  
  - JavaScript (ES6+)  

- **Déploiement (CI/CD)**  
  - Node.js  
  - Gulp  
  - GitHub Actions  

- **Serveur (Docker)**  
  - **Proxy & SSL**  
    - nginx-proxy (reverse proxy & routage)  
    - acme-companion (certificats SSL Let's Encrypt automatisés)  
  - **Site web**  
    - nginx:alpine (serveur statique léger)  
  - **Monitoring**  
    - Grafana (visualisation)  
    - Prometheus (collecte de métriques)  
    - blackbox-exporter  

**Front :**  
L’approche utilisée est celle d’une *Single Page Application*, ce qui permet de ne jamais rafraîchir la page entière.  
Les applications (Convertisseur, CV, Internet, etc.) et sites web (Dex's Gallery, Oh My Food, Booki) sont accessibles directement dans la même page, reproduisant des interactions de type "OS".  

*Lazy loading* : les applications et sites web sont chargés dynamiquement via `fetch()` uniquement lorsqu’ils sont demandés, afin de réduire le temps de chargement initial et d’optimiser les performances.  

Les images ont été compressées puis converties en *WebP* (hors SVG).  

**Déploiement :**  
CI/CD via **GitHub Actions**. Les fichiers sont traités avec **Gulp**, puis envoyés par SSH vers un utilisateur Linux aux droits limités.  
Le code est développé sur `main` et déployé sur la branche `prod`.  

**Serveur :**  
L’architecture serveur est simple :  
- Un **proxy** fournit les certificats et gère le routage vers les sites.  
- Un **conteneur dédié** sert le portfolio.  
- Un autre conteneur effectue le **monitoring** des informations de base.  

La logique est spécialisée et compartimentée, mais la portabilité est légèrement réduite par ce processus.  

------------------------------------------------
## 3. Front-end  
### 3.1. Architecture  

L’architecture du front a été pensée pour la modularité et l’optimisation.  
Voici le schéma : 
```
/root  
  │── /src  
	 │ // code de "l'os"  
	 │── index.html  
	 │── style.css  
	 │── script.js 
	 │ 
	 │ // Dossier des applications  
	 │── /[app]  
	 │    │── [app].html  
	 │    │── [app].css  
	 │    │── [app].js  
	 │    │── /img
	 │    │── /file
	 │  
	 │ // dossier général d’assets  
	 │── /img  
	 │── /sound
```


Cette architecture, si elle est respectée, permet d’implémenter une nouvelle application `[app]` simplement :  
- Créer les fichiers `[app]` et les placer dans un dossier du même nom.  
- Ajouter une icône sur le bureau dans `index.html` avec un attribut `data-appname="[app]"`.  

L’application est alors intégrée, et le comportement de sa fenêtre est automatiquement pris en charge sans modification du script principal. Il ne reste plus qu’à coder son contenu.  

### 3.2. Arborescence  

Voici l’arborescence actuelle du front-end :  


```
/root
  │──/src   
	 │── index.html  
	 │── style.css  
	 │── alexXP.js  
	 │  
	 │── /note  
	 │    │── note.html  
	 │    │── note.css  
	 │  
	 │── /cv  
	 │    │── cv.html  
	 │    │── cv.css  
	 │    │── cv_alex_balmes.pdf  
	 │  
	 │── /convertisseur  
	 │    │── convertisseur.html  
	 │    │── convertisseur.css  
	 │    │── convertisseur.js  
	 │    │── /img 
	 │  
	 │── /le_simon  
	 │    │── le_simon.html  
	 │    │── le_simon.css  
	 │    │── le_simon.js 
	 │    │── /img  
	 │  
	 │── /internet  
	 │    │── internet.html  
	 │    │── internet.css  
	 │    │── internet.js  
	 │    │── /img 
	 │    │── /website  
	 │          │── booki  
	 │          │     │── booki.html  
	 │          │     │── booki.css  
	 │          │     │── /img  
	 │          │  
	 │          │── ohmyfood  
	 │          │     │── ohmyfood.html  
	 │          │     │── ohmyfood.css  
	 │          │     │── /pages  
	 │          │     │    │── delice_menu.html  
	 │          │     │    │── francaise_menu.html  
	 │          │     │    │── note_menu.html  
	 │          │     │    │── palette_menu.html  
	 │          │     │  
	 │          │     │── /img  
	 │          │  
	 │          │── gallery  
	 │          │     │── gallery.html  
	 │          │     │── gallery.css  
	 │          │     │── /img  
	 │          │  
	 │          │── home  
	 │                │── home.html            
	 │
	 │── /img  
	 │── /sound  
 ```

------------------------------------------------
## 4. Ops  

### 4.1. Déploiement  

Le déploiement est mis en place en parallèle du dossier source, selon l’arborescence :  
```
/root
  │── src/
  │── .github/
  │    │── workflows
  │        │── deploy.yml
  │
  │── nodes_modules/
  │── .gitignore
  │── gulpfile.js
  │── package.json
  │── package-lock.json     
```
Le déploiement se déclenche automatiquement lors d’un push sur la branche `prod` du repository et suit les étapes suivantes :  

1. Installation de **Node.js** et **Gulp**.  
2. Exécution de `npm run build`, qui lance le `gulpfile`.  
3. Minification des fichiers de code de `src/`, copie des assets, et génération d’un dossier `dist/`.  
4. Connexion en SSH à l’utilisateur Linux `deploy` (droits limités) du serveur.  
5. Dépôt du contenu de `dist/` dans `container/html/`, où écoute **nginx**.  

### 4.2. Serveur  

Le serveur est une **infrastructure conteneurisée sous Ubuntu, orchestrée avec Docker**.  
Il repose sur trois groupes de conteneurs : deux nécessaires, et un utile.  

- **Proxy & SSL (nécessaires)**  
  - *nginx-proxy* : reverse proxy qui reçoit les requêtes entrantes (ports 80/443) et les redirige vers les bons services, notamment le conteneur du portfolio à l’adresse `portfolio.alexbalmes.dev`.  
  - *acme-companion* : extension du proxy qui génère et renouvelle automatiquement les certificats SSL via *Let’s Encrypt*.  
  - Ensemble, ils assurent le **routage** et la **sécurisation HTTPS** du site.  

- **Site (nécessaire)**  
  - *nginx:alpine* : conteneur léger qui héberge et sert le **front-end statique** (le projet AlexXP).  
  - C’est ce service qui répond aux requêtes utilisateur après passage par le proxy.  

- **Monitoring (utile)**  
  - Stack basée sur Grafana et Prometheus.  
  - Fournit une **surveillance continue** et facilite la maintenance.  

------------------------------------------------
## 5. Datation du code

Ce projet étant un portfolio, beaucoup de code a été récupéré d'anciens projets.  
Les éléments récupérés sont : le Convertisseur, le Simon, Booki, Oh My Food, et Dex's Gallery.  

- `Booki (2022)` : Premier projet étudiant de mon BAC +2 en HTML / CSS, basé sur une maquette fournie par l'école. Le code a été très peu retravaillé lors de l'implémentation.  

- `Oh My Food (2022)` : Second projet de mon BAC +2, fourni sur une maquette Figma par l'école. Le projet était développé en HTML et SCSS. Pour le bien de ce projet j'ai récupéré le code CSS compilé. Hors cette étape d'adaptation, le code a lui aussi été peu retravaillé.  

- `Le Simon (2023)` : Le Simon était un projet personnel créé sur mon temps libre pendant mon BAC +2, pendant que j'apprenais le JavaScript.  
Le projet avait une architecture différente, j'ai dû le réadapter à la logique d'app d'AlexXP. Cependant cette réadaptation n'a pas résolu les problèmes de répétition de code du projet original.  

- `Convertisseur Aéro (2024)` : Ce projet était très différent de sa version dans AlexXP, un CSS bien moins poussé, une implémentation du JavaScript différente. Il a été lourdement retravaillé pour devenir la version actuelle.  

- `Dex's Gallery (2025)` : Dans une logique d'apprentissage et de test j'ai essayé de mettre en ligne un site et un serveur avec Nginx et Ngrok. C'était un projet orienté "sysAdmin" dont Dex's Gallery a servi de support. Présentant des fonctionnalités dynamiques, il n'en reste dans AlexXP que l'exercice de style en HTML / CSS.  

Les autres éléments ont quant à eux été spécifiquement développés pour ce projet. Le développement d'AlexXP a commencé le `3 septembre 2025`.  

------------------------------------------------

## 6. Fonctionnalités  

- *Gestion de l'alimentation du PC* :  
    * Démarrer, éteindre, et cookie "en veille" pour ne pas passer par l'étape démarrage à chaque visite / refresh.  
    * Gestion de comportements aléatoires, basée sur un nombre choisi à l'allumage (ex. Blue Screen).  

- *Gestion de la fenêtre d'application* :  
    * Ouvrir les apps.  
    * Fermer les apps.  
    * Minimiser et agrandir les apps.  
    * Mise en plein écran.  
    * Déplacement des fenêtres d'application, limité à l'espace du "bureau".  
    * Superposition d'apps.  
    * Gestion de la mise au premier plan dynamique.  
    * Gestion Lazy Load des apps.  

- *Gestion de la barre de tâches* :  
    * Création d'un raccourci à l'ouverture.  
    * Gestion parallèle du raccourci par rapport au comportement des apps.  
    * Gestion de l'affichage du menu start.  

- *Fonctions Convertisseur* :  
    * Menu de navigation.  
    * Conversion d'altitude mètre <--> pieds.  
    * Conversion vitesse mètre par seconde <--> nœud.  
    * Calcul de Mach.  
    * Calcul de QFE.  
    * Gestion d'un "easter egg" A380.  

- *Fonctions Le Simon* :  
    * Navigation menu > jeu > menu.  
    * Gestion de difficultés de jeu.  
    * Création d'une séquence aléatoire d'allumage de boutons.  
    * Écoute du comportement utilisateur et comparaison dynamique des inputs par rapport à la séquence attendue, avec feedback.  
    * Gestion d'un affichage de score et d'un highscore partagé.  

- *Fonctionnalités Internet* :  
    * Affichage de sites web.  
    * Gestion Lazy Load des pages.  
    * Implémentation de sites multipages.  
    * Historique de navigation complet lors du clic sur retour.  

------------------------------------------------

## 7.1 Points forts

- *Modularité du système*  
    * Applications isolées dans leurs propres fichiers. Si correctement nommées, on crée l'icône avec un appname défini du même nom que le dossier et fichiers. Et ça fonctionne.  
    * Sites web à la modularité similaire.  

- *Fichier "OS" alexXP.js*  
    * Tout le cœur du site géré au même endroit.  
    * Conçu avec une attention particulière à la propreté et qualité du code. Fonctions spécialisées, commentaires systématiques, nommage cohérent et explicite.  

- *Optimisation*  
    * Lazy Load : Ressources HTML, CSS et JS des apps et des sites web chargées à la demande de l'utilisateur.  
    * Compression des images et extension WebP systématique.  

- *Cohérence et lisibilité*  
    * Utilisation la plus régulière possible du camelCase.  
    * Utilisation de const et let.  
    * Découpage par fonctions explicites et spécialisées.  

## 7.2. Pistes d'amélioration

- Factorisation possible à plusieurs endroits.  
- Réécrire le_simon.js, le code a été adapté mais il souffre du manque d'expérience à sa création.  
- Meilleure utilisation de la sémantique au sein des fichiers HTML.  
- Améliorer l'accessibilité via des balises aria.  

------------------------------------------------

##  8. Crédits  

Certaines maquettes et assets (Booki, Oh My Food) m'ont été fournis par OpenClassrooms dans le cadre de mon diplôme de développeur web. https://openclassrooms.com/fr/  

Les images de Dex's Gallery ont toutes été téléchargées sur Unsplash https://unsplash.com/fr.  

Le design de Windows XP étant très développé et complexe, */certaines parties seulement/* de la structure *HTML* et certaines propriétés *CSS* ont été recopiées d'un projet d'un autre développeur 'Sh1zuku', et de son projet winXP https://winxp.vercel.app/, puis réadaptées à mes besoins JS, ma méthode de responsive, et ma structure Single Page Application JavaScript ES6+ vanilla.    

Les sons (boot-up, plane) ont été téléchargés sur https://www.myinstants.com/fr/index/fr/  

Le développeur du site (https://dexlovecraft.github.io/alexXP/) est moi-même Alex Balmes.  

Liens :  
LinkedIn : https://www.linkedin.com/in/alex-balmes-9029a5203/  
Github : https://github.com/DexLovecraft  
Mail : alex.balmes.pro@proton.me  

Alex Balmes - 2025  
