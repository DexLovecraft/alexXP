------------------------------------------------
Projet AlexXP - Documentation Technique

# 📑 Table des matières
1. [Introduction](#1-introduction)  
2.1 [Architecture](#21-architecture)  
2.2 [Arborescence](#22-arborescence)  
3. [Technologies](#3-technologies)  
4. [Datation du code](#4-datation-du-code)  
5. [Fonctionnalités](#5-fonctionnalités)  
6.1 [Points Forts ](#61-points-forts)  
6.2 [Pistes d'amélioration](#62-pistes-damélioration)  
7. [Crédits](#7-crédits)  

------------------------------------------------
## 1. Introduction

Ce projet est un portfolio interactif, sous forme d'une recréation d'une version HTML / CSS / JS de Windows XP.  
Accessible à ce lien : https://dexlovecraft.github.io/alexXP/  
Il me sert de vitrine technologique pour montrer aux recruteurs mes compétences, et certains de mes anciens projets.  
Pour les RH l'application note est ouverte par défaut, présentant le projet de manière simple.  
Pour les directeurs techniques un lien redirige vers le repo git du projet et ce README.  

Cette documentation a été mise à jour le 10/09/2025.  

------------------------------------------------
------------------------------------------------

## 2.1. Architecture 

L'architecture du projet a été pensée pour la modularité et l'optimisation.  

Voici le schéma :  

```
/alexXP  
 │ // code de "l'os"  
 │── index.html  
 │── style.css  
 │── script.js  
 │ // Dossier des applications  
 │── /app  
 │    │── app.html  
 │    │── app.css  
 │    │── app.js  
 │    │── /app_img
 │    │── /app_file
 │  
 │ // dossier général d’assets  
 │── /img  
 │── /sound


Le corps logique se base sur cette architecture.  
Par exemple pour créer une nouvelle application, comme le Simon :  
on code sa structure le_simon.html, son style le_simon.css, et sa logique le_simon.js  
on met cela dans un dossier le_simon.  
On crée une desktop icon avec un attribut HTML data_appname le_simon.  
Le Simon est implémenté dans l'OS. Et la structure, le style et le script seront chargés au besoin de l’utilisateur via l'icône.  

## 2.2. Arborescence
Voici l'arborescence actuelle du projet.  

```
/alexXP  
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
------------------------------------------------

## 3. Technologies  

La *stack technique* est :  

- HTML 5 :  
    Structure sémantique privilégiée.  
- CSS 3 :  
    Responsive fait intégralement grâce aux valeurs relatives, dans un conteneur obligatoirement en 16/9.  
    Disposition des éléments faite en position, flexbox, et grid.  
    Utilisation de keyframes.  
- JavaScript ES6+  
    Fonctions fléchées, const et let privilégiés.  
    Logique OS pensée en modularité maximale.  
    Code commenté.  

L'approche utilisée est une approche de *Single Page Application*, permettant de ne jamais rafraîchir la page entière, et d’accéder aux applications dans la même page, permettant les interactions "OS".  

*Lazy loading* : les applications (Convertisseur, CV, Internet, etc.) et sites web (Dex's Gallery, Oh My Food, Booki) sont chargés dynamiquement via `fetch()` uniquement lorsqu’ils sont demandés, afin de réduire le temps de chargement initial et optimiser les performances.  

Les images ont été compressées puis converties en *WebP*, seuls les SVG diffèrent de cette méthode.  

Site actuellement heberger et mis en ligne via github pages 

------------------------------------------------
------------------------------------------------

## 4. Datation du code

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
------------------------------------------------

## 5. Fonctionnalités  

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
------------------------------------------------

## 6.1 Points forts

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

## 6.2. Pistes d'amélioration

- Factorisation possible à plusieurs endroits.  
- Réécrire le_simon.js, le code a été adapté mais il souffre du manque d'expérience à sa création.  
- Meilleure utilisation de la sémantique au sein des fichiers HTML.  
- Améliorer l'accessibilité via des balises aria.  

------------------------------------------------
------------------------------------------------

##  7. Crédits  

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
