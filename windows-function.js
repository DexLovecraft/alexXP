/*
    ce fichier contient toute la logique de alexXP, 
    l'allumage, l'ouverture et la fermeture d'application , le comportement des fenetre, gestion des evenement aleatoire ... 
    La logique des application est codé dans leus propre fichier (ex : ./le_simon/le_simon.js)
*/

// requete pour verifié qu'un fichier existe 
function filePathExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    if (http.status == 404) {
        return console.log(url + " file path don't exist")
    }
    return http.status != 404;
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
const startMenu = document.querySelector('.start_menu');
const windows = document.querySelector('.windows');
const offScreen = document.querySelector('.off_screen');
const viewport = document.querySelector('.viewport');

var bootup_sound = new Audio('./sound/bootup_sound.mp3');
bootup_sound.volume = 0.25

// on verifie la presence du cookie en veille, si il est present , on va directement sur alexXP (windows) 
const enveille = getCookie('enveille');
if (enveille == 'true' && offScreen.classList.contains('visible')) {
        offScreen.classList.remove('visible');
        windows.classList.add('visible');
}

// gestion du bouton On 
document.querySelector('.power-button').addEventListener('click', function() {
    const randomNumber = Math.floor(Math.random() * 10) + 1; // chiffre aléatoire entre 1 et 10, comportemetn different en fonction du resultat (ex : 1 = blue screen)
    console.log('Nombre tiré :', randomNumber);
    if (randomNumber == 1 && offScreen.classList.contains('visible')) { // comportement blue screen
        offScreen.classList.remove('visible');
        document.querySelector('.blue_screen').classList.add('visible');
        setTimeout(() => {
            document.querySelector('.blue_screen').classList.remove('visible');
            offScreen.classList.add('visible');
            windows.classList.remove('visible');
        }, 1250);
    }
    else if (offScreen.classList.contains('visible')) { // comportement par default 
        offScreen.classList.remove('visible');
        windows.classList.add('visible');
        bootup_sound.play();
        setCookieHours( // on creer un cookie en veille pour pas avoir a redemarrer a chaque refresh
            'enveille',
            'true',          
            8,                  
        );
    }
});

// gestion apparition menu demarer 
document.getElementById('start_button').addEventListener('click', function() { 
    startMenu.classList.toggle('visible');
});

// gestion du bouton enteindre, on met l'ecran off screen , on ferme toutes les app et retire les racourcie de la barre des tache 
document.getElementById('turn_off_button').addEventListener('click', function() {
        offScreen.classList.add('visible');
        document.querySelector('body').classList.add("off")
        windows.classList.remove('visible');
        startMenu.classList.remove('visible');
        document.querySelectorAll('.app').forEach(app => {
            if (app.classList.contains('visible')) app.classList.remove('visible');
            if (document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`)) document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`).remove();
        });
});


// Fonction injection du code d'une app 
async function loadApp(appPath , appname) {
    const resp = await fetch(appPath); // on va chercher l'app 
    if (!resp.ok) throw new Error('Impossible de charger le site');
    const html = await resp.text();
    const app = document.createElement('div'); // on creer l'app on lui donne dynamiquement les class et l'attribut data,
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
    if (!document.querySelector(`link[href="./${appname}/${appname}.css]`) && filePathExists(`./${appname}/${appname}.css`)) {
        const style = document.createElement('link');
        style.rel = 'stylesheet'
        style.href = `./${appname}/${appname}.css`;
        document.querySelector('head').appendChild(style)
    }
    if (!document.querySelector(`script[src="./${appname}/${appname}.js]`) && filePathExists(`./${appname}/${appname}.js`)){
        const script = document.createElement('script');
        script.src = `./${appname}/${appname}.js`;
        document.querySelector("html").appendChild(script);
    }
}


// Gestion des icon du bureau 
document.querySelectorAll('.desktop_icon').forEach(icon => {
    icon.addEventListener('dblclick', async () => {
        //si l'app n'a jamais été chargé , on load app 
        if (!document.querySelector(`.app[data-appname=${icon.dataset.appname}]`)) await loadApp(`./${icon.dataset.appname}/${icon.dataset.appname}.html`, icon.dataset.appname);       
        // sinon on la rends simplement visible 
        else {
            document.querySelector(`.app[data-appname=${icon.dataset.appname}]`).classList.toggle("visible");
            document.querySelector(`.app[data-appname=${icon.dataset.appname}]`).style.zIndex = 2;
        }
        appComportement() // on recharge le comportement des apps 
    });    
})

// fonction pour perdre le focus du racourcie de la barre des tache quand on clique en dehors de la fenetre 
windows.addEventListener('click', function(e) {
    if (e.target !== e.currentTarget) return;
    document.querySelectorAll('.footer_window').forEach(footerWindow => {
        footerWindow.classList.remove('focus');
    });
});

// Fonction general qui contient les fonction des application.  
const appComportement = () => {
    if (document.querySelectorAll('.app') < 1) return; // verification qu'il y a au minimum une application de chargé
    const apps = document.querySelectorAll('.app'); // on declare nos application chargé

    // fonction qui lorsqu'on clique sur le racourcie de la barre des tache lui remet le focus, rouvre la fenetre de l'app correspondante
    //  et remet l'application au premier plan
    function unminimize () {
        document.querySelectorAll('.footer_window').forEach(footerWindow => {
            footerWindow.addEventListener('click', function() {
                document.querySelectorAll('.footer_window').forEach(otherFooterWindow => {
                    if (otherFooterWindow === footerWindow) otherFooterWindow.classList.add('focus');
                    else otherFooterWindow.classList.remove('focus');
                });
                if (!document.querySelector(`.app[data-appname="${footerWindow.dataset.appname}"]`).classList.contains('visible')) {
                    document.querySelector(`.app[data-appname="${footerWindow.dataset.appname}"]`).classList.add('visible')
                }
                apps.forEach(app => { app.style.zIndex = footerWindow.dataset.appname === app.dataset.appname ? 2 : 1; });
            })
        })
    };

    // Initiateur de racourci de barre des tache 
    const footerWindowCreation = () => {
        apps.forEach(app => {
            if (!app.classList.contains('visible')) return; 
            if (!document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`)) {
                const footerWindow = document.createElement('div');
                footerWindow.setAttribute('data-appname', app.dataset.appname || 'App');
                footerWindow.className = 'footer_window cover';
                const footerImg = document.querySelector(`.desktop_icon[data-appname="${app.dataset.appname}"] .desktop_icon_img`).cloneNode();
                footerImg.alt = app.dataset.appname || 'App Icon';
                footerImg.className = 'footer_icon';
                footerWindow.appendChild(footerImg);
                const footerText = document.createElement('p');
                footerText.className = 'footer_text';
                footerText.textContent = document.querySelector(`.desktop_icon[data-appname="${app.dataset.appname}"] .desktop_icon_text`).textContent || 'App';
                footerWindow.appendChild(footerText);
                document.querySelector(".footer_items.left").appendChild(footerWindow);
                document.querySelectorAll('.footer_window').forEach(footerWindow => {
                footerWindow.classList.remove('focus')})
                document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`).classList.add('focus');
            }
        });
        unminimize();
    }
    
    // forEach pour tout les fonction necessaire a chaque app 
    document.querySelectorAll('.app').forEach(app => {
        
        // on recupere la position de la fenetre au demarage 
        let newLeft = window.getComputedStyle(app).getPropertyValue('left');
        let newTop = window.getComputedStyle(app).getPropertyValue('top');

        // declaration des element du dom des app 
        const minimize_button = document.querySelector(`.app[data-appname="${app.dataset.appname}"] .header_button-minimize`)
        const maximize_button = document.querySelector(`.app[data-appname="${app.dataset.appname}"] .header_button-maximize`)
        const close_button = document.querySelector(`.app[data-appname="${app.dataset.appname}"] .header_button-close`)
        const app_window = document.querySelector(`.app[data-appname="${app.dataset.appname}"]`)
        const app_header = document.querySelector(`.app[data-appname="${app.dataset.appname}"] .app_header`)

    
        app.addEventListener('click', function() {
            // on remet l'app au premier plan 
            apps.forEach(otherApp => { otherApp.style.zIndex = otherApp === app ? 2 : 1; });
            // et on remet le focus sur la seul fenetre de l'app ou l'on a clique 
            document.querySelectorAll('.footer_window').forEach(footerWindow => {
            footerWindow.classList.remove('focus')})
            if ( document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`)) document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`).classList.add('focus');
        });
        
        // fonction ferme l'application 
        close_button.addEventListener('click', function() {
            if (app_window.classList.contains('visible')) {
                app_window.classList.remove('visible');
                document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`).remove();
        }});

        // fonction on reduit (ferme mais on garde le racourcie)
        minimize_button.addEventListener('click', function(e) {
            e.stopPropagation();
            if (app_window.classList.contains('visible')) {
                document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`).classList.remove('focus');
                app_window.classList.remove('visible')
        }});

        // Au clique si pas en plein ecran , on met en plein ecran, si en plein ecran on reduit en reprenant la dernier postion connu 
        maximize_button.addEventListener('click', function() {
            if (!app_window.classList.contains('app_maximized')) {
                app_window.classList.add('app_maximized')
                app_window.style.left = `0px`;
                app_window.style.top = `0px`;
            }
            else {
                app_window.classList.remove('app_maximized')
                app_window.style.left = `${newLeft}`;
                app_window.style.top = `${newTop}`;
            }
        }); 

        // declaration des variable du drag and drop 

        let moving = false;
        // coordonnées du curseur au moment du down
        let startCursorX = 0;
        let startCursorY = 0;

        // position de la fenêtre au moment du down
        let startWindowX = 0;
        let startWindowY = 0;

        app_header.addEventListener('pointerdown', e => {
            // si on clique sur le header , qu'on fait clic gauche et que l'application n'est pas en plein ecran
            if (e.target !== e.currentTarget && e.button !== 0 || app_window.classList.contains('app_maximized')) return;

            // on commence le movement 
            moving = true;
            
            // on recupere la position du curseur sur la page
            startCursorX = e.clientX;
            startCursorY = e.clientY;

            // et la position de la fenetre 
            startWindowX = app_window.offsetLeft;
            startWindowY = app_window.offsetTop;
        });

        // quand on relache le clic, on stop le mouvement , et on met au premier plan 
        document.addEventListener('pointerup', () => {
            moving = false;
            apps.forEach(otherApp => {
                otherApp.style.zIndex = (otherApp === app) ? 2 : 1;
            });
        });

        // et quand se bouge 
        document.addEventListener('pointermove', e => {
            if (!moving) return;
            apps.forEach(otherApp => { otherApp.style.zIndex = (otherApp === app) ? 2 : 1; }); // on met au premier plan 
 
            // on calcul la nouvelle position du curseur 
            const newCursorX = e.clientX - startCursorX;
            const newCursorY = e.clientY - startCursorY;

            // et notre nouvelle position est egal a la position de la fenetre de base plus notre nouvelle position. 
            newLeft = startWindowX + newCursorX;
            newTop  = startWindowY + newCursorY;

            // On defini l'espace ou la fenetre peux bouger 
            const minX = 0;
            const minY = 0;
            // la largeur de viewport (la fenetre en 16/9) moins la largeur de l'app 
            const maxX = viewport.clientWidth  - app.offsetWidth; 
            // la hauteur de viewport (la fenetre en 16/9) moins la hauteur de l'app moins la hauteur de la barre des tache
            const maxY = viewport.clientHeight - app.offsetHeight - viewport.clientHeight * 0.0352; 

            // on verifie notre nouvelle position, si on depasse le min on applique le min et si on depasse le max on applique le max
            newLeft = `${Math.min(Math.max(newLeft, minX), maxX)}px`;
            newTop  = `${Math.min(Math.max(newTop,  minY), maxY)}px`;
        
            // on change le css de la fenetre 
            app_window.style.left = `${newLeft}`;
            app_window.style.top  = `${newTop}`;
        });
    });
    footerWindowCreation() // on creer notre racourcie
}
