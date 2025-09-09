/*
    ce fichier contient toute la logique de alexXP, 
    l'allumage, l'ouverture et la fermeture d'application , le comportement des fenetre, gestion des evenement aleatoire ... 
    La logique des application est codé dans leus propre fichier (ex : ./le_simon/le_simon.js)
*/

// requete pour verifié qu'un fichier existe 
async function filePathExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.status === 404) {
            console.log(url + " file path don't exist");
            return false;
        }
        return true;
    } catch (e) {
        console.log(url + " file path don't exist");
        return false;
    }
}

// gestion du cookie, qui evite de devoir redemarrer a chaque refresh
/**
 * @param {string} name   .
 * @param {string} value  
 * @param {number} hours  
 * @param {Object} [options] 
 */
function setCookieHours(name, value, hours, options = {}) {
  const encode = encodeURIComponent;


  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000); 

  let cookie = `${encode(name)}=${encode(value)}`;
  cookie += `; expires=${date.toUTCString()}`;          
  cookie += `; path=${options.path ?? '/'}`;           

  if (options.domain)   cookie += `; domain=${options.domain}`;
  if (options.secure)   cookie += '; Secure';
  if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;

  document.cookie = cookie;
}

function getCookie(name) {
  const decode = decodeURIComponent;
  const cookies = document.cookie.split('; ');
  for (const c of cookies) {
    const [k, v] = c.split('=');
    if (decode(k) === name) return decode(v);
  }
  return null;
}


// declaration des element du dom principaux 
let loadeadApps = document.querySelectorAll('.app');
const startMenu = document.querySelector('.start_menu');
const alexXP = document.querySelector('.alexXP');
const offScreen = document.querySelector('.off_screen');
const blueScreen = document.querySelector('.blue_screen');
const viewport = document.querySelector('.viewport');
const bootupSound = new Audio('./sound/bootup_sound.mp3');
bootupSound.volume = 0.25

// on verifie la presence du cookie en veille, si il est present , on va directement sur alexXP 
if (getCookie('in_sleep') == 'true' && offScreen.classList.contains('visible')) {
        offScreen.classList.remove('visible');
        alexXP.classList.add('visible');
}

// gestion du bouton On 
const turnOn = () => {
    const randomNumber = Math.floor(Math.random() * 10) + 1; // chiffre aléatoire entre 1 et 10, comportemetn different en fonction du resultat (ex : 1 = blue screen)
    console.log('Nombre tiré :', randomNumber);
    if (randomNumber == 1 && offScreen.classList.contains('visible')) { // comportement blue screen
        offScreen.classList.remove('visible');
        blueScreen.classList.add('visible');
        setTimeout(() => {
            blueScreen.classList.remove('visible');
            offScreen.classList.add('visible');
            alexXP.classList.remove('visible');
        }, 1250);
    }
    else if (offScreen.classList.contains('visible')) { // comportement par default 
        offScreen.classList.remove('visible');
        alexXP.classList.add('visible');
        bootupSound.play();
        setCookieHours( // on creer un cookie en veille pour pas avoir a redemarrer a chaque refresh
            'in_sleep',
            'true',          
            8,                  
        );
    }
}

// gestion du bouton enteindre, on met l'ecran off screen , on ferme toutes les app et retire les racourcie de la barre des tache 
const turnOff = () => {
        offScreen.classList.add('visible');
        document.querySelector('body').classList.add("off")
        alexXP.classList.remove('visible');
        startMenu.classList.remove('visible');
        if (loadeadApps.length < 1) return;
        loadeadApps.forEach(app => {
            const app_taskbar = document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`);
            if (app.classList.contains('visible')) app.classList.remove('visible');
            if (app_taskbar) app_taskbar.remove();
        });
}

// Fonction injection du code d'une app 
async function loadApp(appname) {

    const filePath = `./${appname}/${appname}`
    const resp = await fetch( `${filePath}.html`); // on va chercher l'app 
    if (!resp.ok) throw new Error('Impossible de charger le site');
    const html = await resp.text();

    // on creer l'app on lui donne dynamiquement les class et l'attribut data,
    const app = document.createElement('div'); 
    app.classList.add(`app`);
    app.classList.add(`${appname}`);
    app.classList.add(`visible`);
    app.dataset.appname = appname;
    app.innerHTML = html // on lui donne le html de son fichier  // la met au premier plan // et l'ajoute sur le bureau 
    app.style.zIndex = 2;
    document.querySelector(".desktop").appendChild(app);

    /* -- le code suivant charge le css et le js de l'app, pour pouvoir demander au client de chargé au besoin les ressources -- 
     on verifie 1. si un lien vers le css / js de l'app qu'on ouvre est present 
     2. si le fichier existe 
     si il existe et n'est pas present, on creer une balsie link / script et l'ajoute au dom 
     */
    if (!document.querySelector(`link[href="${filePath}.css]`) && await filePathExists(`${filePath}.css`)) {
        const style = document.createElement('link');
        style.rel = 'stylesheet'
        style.href = `${filePath}.css`;
        document.querySelector('head').appendChild(style)
    }
    if (!document.querySelector(`script[src="${filePath}.js]`) && await filePathExists(`${filePath}.js`)){
        const script = document.createElement('script');
        script.src = `${filePath}.js`;
        document.querySelector("html").appendChild(script);
    }
}


// Gestion des icon du bureau 
async function openApp (appname) {
    //si l'app n'a jamais été chargé , on load app 
    if (!document.querySelector(`.app[data-appname=${appname}]`)) await loadApp(appname);       
    // sinon on la rends simplement visible 
    else {
        document.querySelector(`.app[data-appname=${appname}]`).classList.toggle("visible");
        document.querySelector(`.app[data-appname=${appname}]`).style.zIndex = 2;
    }
    appComportement() // on recharge le comportement des apps 
}

// Initiateur de racourci de barre des tache 
const footerWindowCreation = (app) => {
    if (!app.classList.contains('visible')) return; 
    if (!document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`)) {
        const new_app_taskbar = document.createElement('div');
        new_app_taskbar.setAttribute('data-appname', app.dataset.appname || 'App');
        new_app_taskbar.className = 'footer_window cover';
        const footerImg = document.querySelector(`.desktop_icon[data-appname="${app.dataset.appname}"] .desktop_icon_img`).cloneNode();
        footerImg.alt = app.dataset.appname || 'App Icon';
        footerImg.className = 'footer_icon';
        new_app_taskbar.appendChild(footerImg);
        const footerText = document.createElement('p');
        footerText.className = 'footer_text';
        footerText.textContent = document.querySelector(`.desktop_icon[data-appname="${app.dataset.appname}"] .desktop_icon_text`).textContent || 'App';
        new_app_taskbar.appendChild(footerText);
        document.querySelector(".footer_items.left").appendChild(new_app_taskbar);
        document.querySelectorAll('.footer_window').forEach(app_taskbar => {
        app_taskbar.classList.remove('focus')})
        document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`).classList.add('focus');
    }
}

// fonction pour perdre le focus du racourcie de la barre des tache quand on clique en dehors de la fenetre 
const loseFocus = (e) => {
    if (e.target !== e.currentTarget) return;
    document.querySelectorAll('.footer_window').forEach(app_taskbar => {
        app_taskbar.classList.remove('focus');
    });
}

const getFocus = (app) => {
    // on remet l'app au premier plan 
    loadeadApps.forEach(otherApp => { otherApp.style.zIndex = otherApp === app ? 2 : 1; });
    // et on remet le focus sur la seul fenetre de l'app ou l'on a clique 
    document.querySelectorAll('.footer_window').forEach(app_taskbar => {
    app_taskbar.classList.remove('focus')})
    if ( document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`)) document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`).classList.add('focus');
}
 
// fonction ferme l'application 
const closeApp = (app, appWindow) => {
    if (appWindow.classList.contains('visible')) {
        appWindow.classList.remove('visible');
        document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`).remove();
}}

// fonction on reduit (ferme mais on garde le racourcie)
const minimize = (e, app, appWindow) => {
    e.stopPropagation();
    if (appWindow.classList.contains('visible')) {
        document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`).classList.remove('focus');
        appWindow.classList.remove('visible')
}}

// fonction qui lorsqu'on clique sur le racourcie de la barre des tache lui remet le focus, rouvre la fenetre de l'app correspondante
//  et remet l'application au premier plan
const unminimize = (app, app_taskbar) => {
    document.querySelectorAll('.footer_window').forEach(other_app_taskbar => {
        if (other_app_taskbar === app_taskbar) other_app_taskbar.classList.add('focus');
        else other_app_taskbar.classList.remove('focus');
    });
    if (!document.querySelector(`.app[data-appname="${app_taskbar.dataset.appname}"]`).classList.contains('visible')) {
        document.querySelector(`.app[data-appname="${app_taskbar.dataset.appname}"]`).classList.add('visible')
    }
    app.style.zIndex = app_taskbar.dataset.appname === app.dataset.appname ? 2 : 1;;
}

// Au clique si pas en plein ecran , on met en plein ecran, si en plein ecran on reduit en reprenant la dernier postion connu 
const maximise = (appWindow, new_left, new_top) => {
    if (!appWindow.classList.contains('app_maximized')) {
        appWindow.classList.add('app_maximized')
        appWindow.style.left = `0px`;
        appWindow.style.top = `0px`;
    }
    else {
        appWindow.classList.remove('app_maximized')
        appWindow.style.left = `${new_left}`;
        appWindow.style.top = `${new_top}`;
    }
}

const dragAndDropStart = (e, appWindow, state) => {
    // si on clique sur le header , qu'on fait clic gauche et que l'application n'est pas en plein ecran
    if (e.target !== e.currentTarget) return; 
    if (e.button !== 0 || appWindow.classList.contains('app_maximized')) return;

    // on commence le movement 
    state.moving = true;
    
    // on recupere la position du curseur sur la page
    state.startCursorLeft = e.clientX;
    state.startCursorTop = e.clientY;

    // et la position de la fenetre 
    state.startWindowLeft = appWindow.offsetLeft;
    state.startWindowTop = appWindow.offsetTop;
}

const dragAndDropEnd = (app, state) => {
    state.moving = false;
    loadeadApps.forEach(otherApp => {
        otherApp.style.zIndex = (otherApp === app) ? 2 : 1;
    });
}

const dragAndDropMove = (e, app, appWindow, state) => {
    if (!state.moving) return;
    loadeadApps.forEach(otherApp => { otherApp.style.zIndex = (otherApp === app) ? 2 : 1; }); // on met au premier plan 

    // on calcul la nouvelle position du curseur 
    const newCursorLeft = e.clientX - state.startCursorLeft;
    const newCursorTop = e.clientY - state.startCursorTop;

    // et notre nouvelle position est egal a la position de la fenetre de base plus notre nouvelle position. 
    new_left = state.startWindowLeft + newCursorLeft;
    new_top  = state.startWindowTop + newCursorTop;

    // On defini l'espace ou la fenetre peux bouger 
    const min_x = 0;
    const min_y = 0;
    // la largeur de viewport (la fenetre en 16/9) moins la largeur de l'app 
    const max_x = viewport.clientWidth  - app.offsetWidth; 
    // la hauteur de viewport (la fenetre en 16/9) moins la hauteur de l'app moins la hauteur de la barre des tache
    const max_y = viewport.clientHeight - app.offsetHeight - viewport.clientHeight * 0.0352; 

    // on verifie notre nouvelle position, si on depasse le min on applique le min et si on depasse le max on applique le max
    new_left = `${Math.min(Math.max(new_left, min_x), max_x)}px`;
    new_top  = `${Math.min(Math.max(new_top,  min_y), max_y)}px`;

    // on change le css de la fenetre 
    appWindow.style.left = `${new_left}`;
    appWindow.style.top  = `${new_top}`;
}
 
// Fonction general qui appelle les fonction des application.  
const appComportement = () => {
    loadeadApps = document.querySelectorAll(".app");
    if (loadeadApps.length < 1) return; // verification qu'il y a au minimum une application de chargé
    loadeadApps.forEach(app => { // pour chaque app on : 

        // declare ses element du dom
        const minimizeButton = document.querySelector(`.app[data-appname="${app.dataset.appname}"] .header_button-minimize`)
        const maximizeButton = document.querySelector(`.app[data-appname="${app.dataset.appname}"] .header_button-maximize`)
        const closeButton = document.querySelector(`.app[data-appname="${app.dataset.appname}"] .header_button-close`)
        const appWindow = document.querySelector(`.app[data-appname="${app.dataset.appname}"]`)
        const appHeader = document.querySelector(`.app[data-appname="${app.dataset.appname}"] .app_header`)
        // on recupere sa position au demarage 
        let newLeft = window.getComputedStyle(app).getPropertyValue('left');
        let newTop = window.getComputedStyle(app).getPropertyValue('top');
        const state = { // declare l'etat pour le drag and drop 
            moving: false,
            startCursorLeft: 0,
            startCursorTop: 0,
            startWindowLeft: 0,
            startWindowTop: 0,
            newLeft,
            newTop
        };
        footerWindowCreation(app) // on creer son racourcie dans la barre des tache
        
        // on appelle nos fonction de comportement 
        document.querySelectorAll('.footer_window').forEach(app_taskbar => {
            app_taskbar.addEventListener('click', () => {unminimize(app, app_taskbar)})
        })
        app.addEventListener('click', () => { getFocus(app) });
        alexXP.addEventListener('click', (e) => { loseFocus(e) });
        closeButton.addEventListener('click', () => { closeApp(app,appWindow) });
        minimizeButton.addEventListener('click', (e) => {minimize(e, app, appWindow)});
        maximizeButton.addEventListener('click', () => { maximise(appWindow, newLeft, newTop)});        
        
        appHeader.addEventListener('pointerdown', (e) => { dragAndDropStart(e, appWindow, state)  });
        document.addEventListener('pointerup', () => { dragAndDropEnd(app, state) });
        document.addEventListener('pointermove', (e) => {dragAndDropMove(e, app, appWindow, state)})
    })
}

// on appelle nos ecouteur 
document.querySelector('.power-button').addEventListener('click', turnOn);
document.getElementById('turn_off_button').addEventListener('click', turnOff);
document.getElementById('start_button').addEventListener('click', () => { startMenu.classList.toggle('visible'); });
document.querySelectorAll('.desktop_icon').forEach(icon => {
    icon.addEventListener('dblclick', () => {openApp(icon.dataset.appname)});    
});

openApp('note')