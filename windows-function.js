// this file is for all "windows" function like open, close, minimize, maximize... 
// each app has its own js file for its specific functions 
// like app.js for app app, notepad.js for notepad app...
// this file is for general functions that can be used by all apps
// like open, close, minimize, maximize...

const onChange = () => {
    if (document.querySelectorAll('.app') < 1) {
        return;
    }
    else {
        appComportement()
    } 
}

function UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    if (http.status == 404) {
        return console.log(url + " file path don't exist")
    }
    return http.status != 404;
}


/**
 * Définit un cookie qui expire après un certain nombre d'heures.
 * 
 * @param {string} name   - Nom du cookie.
 * @param {string} value  - Valeur du cookie.
 * @param {number} hours  - Durée de vie en heures (12 h ici).
 * @param {Object} [options] - Options supplémentaires (path, domain, secure, sameSite…).
 */
function setCookieHours(name, value, hours, options = {}) {
  const encode = encodeURIComponent;

  // Calcul de la date d'expiration
  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000); // heures → millisecondes

  // Construction de la chaîne du cookie
  let cookie = `${encode(name)}=${encode(value)}`;
  cookie += `; expires=${date.toUTCString()}`;          // expiration
  cookie += `; path=${options.path ?? '/'}`;           // chemin par défaut

  // Options facultatives
  if (options.domain)   cookie += `; domain=${options.domain}`;
  if (options.secure)   cookie += '; Secure';
  if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;

  // On écrit le cookie
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


//here is for the dom const 
const startMenu = document.querySelector('.start_menu');
const windows = document.querySelector('.windows');
const offScreen = document.querySelector('.off_screen');
const viewport = document.querySelector('.viewport');
const apps = document.querySelectorAll('.app');
var bootup_sound = new Audio('./sound/bootup_sound.mp3');
bootup_sound.volume = 0.25

if (offScreen.classList.contains('visible')) {
    document.querySelector('body').classList.add("off")
}

//automaticly turn on the windows page if the cookie "en veille" exist
const enveille = getCookie('enveille');
if (enveille == 'true' && offScreen.classList.contains('visible')) {
        offScreen.classList.remove('visible');
        document.querySelector('body').classList.remove("off")
        windows.classList.add('visible');
}

//turn on the windows page from off screen 
document.querySelector('.power-button').addEventListener('click', function() {
    const randomNumber = Math.floor(Math.random() * 10) + 1; // 1 ≤ randomNumber ≤ 10
    console.log('Nombre tiré :', randomNumber);
    if (randomNumber == 1 && offScreen.classList.contains('visible')) {
        offScreen.classList.remove('visible');
        document.querySelector('body').classList.remove("off");
        document.querySelector('.blue_screen').classList.add('visible');
        document.querySelector('body').classList.add("blue")
        setTimeout(() => {
            document.querySelector('.blue_screen').classList.remove('visible');
            document.querySelector('body').classList.remove("blue");
            offScreen.classList.add('visible');
            document.querySelector('body').classList.add("off")
            windows.classList.remove('visible');
        }, 1250);
    }
    else if (offScreen.classList.contains('visible')) {
        offScreen.classList.remove('visible');
        document.querySelector('body').classList.remove("off")
        windows.classList.add('visible');
        bootup_sound.play();
        setCookieHours(
            'enveille',
            'true',          // nom du cookie
            12,                   // durée de vie en heures
        );
    }
});



// show start menu
document.getElementById('start_button').addEventListener('click', function() { 
    startMenu.classList.toggle('visible');
});

// turn off the pages, back to first log in config  
document.getElementById('turn_off_button').addEventListener('click', function() {
        offScreen.classList.add('visible');
        document.querySelector('body').classList.add("off")
        windows.classList.remove('visible');
        startMenu.classList.remove('visible');
        apps.forEach(app => {
            if (app.classList.contains('visible')) {
                app.classList.remove('visible');
            }
            if (document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`)) {
                document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`).remove();
            }
            
        });
});

async function loadApp(url , appname) {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Impossible de charger le site');
    const html = await resp.text();
    const app = document.createElement('div');
    app.classList.add(`app`);
    app.classList.add(`${appname}`);
    app.classList.add(`visible`);
    app.dataset.appname = appname;
    app.innerHTML = html
    app.style.zIndex = 2;
    document.querySelector(".desktop").appendChild(app);
    if (!document.querySelector(`link[href="/${appname}/${appname}.css]`) && UrlExists(`/${appname}/${appname}.css`)) {
        const style = document.createElement('link');
        style.rel = 'stylesheet'
        style.href = `/${appname}/${appname}.css`;
        document.querySelector('head').appendChild(style)
    }
    if (!document.querySelector(`script[src="/${appname}/${appname}.js]`) && UrlExists(`/${appname}/${appname}.js`)){
        const script = document.createElement('script');
        script.src = `/${appname}/${appname}.js`;
        document.querySelector(".desktop").appendChild(script);
    }
}


document.querySelectorAll('.desktop_icon').forEach(icon => {
    icon.addEventListener('dblclick', async () => {
        if (!document.querySelector(`.app[data-appname=${icon.dataset.appname}]`)) {
            await loadApp(`/${icon.dataset.appname}/${icon.dataset.appname}.html`, icon.dataset.appname);
                
        }
        else {
            document.querySelector(`.app[data-appname=${icon.dataset.appname}]`).classList.toggle("visible");
        }
        onChange()
    });    
})

windows.addEventListener('click', function(e) {
    if (e.target !== e.currentTarget) return;
    document.querySelectorAll('.footer_window').forEach(footerWindow => {
        footerWindow.classList.remove('focus');
    });
});

const appComportement = () => {
    const apps = document.querySelectorAll('.app');
    function unminimize () {
    document.querySelectorAll('.footer_window').forEach(footerWindow => {
    footerWindow.addEventListener('click', function() {
        document.querySelectorAll('.footer_window').forEach(otherFooterWindow => {
        if (otherFooterWindow === footerWindow) {otherFooterWindow.classList.add('focus')}
        else {otherFooterWindow.classList.remove('focus');}
        });
        if (!document.querySelector(`.app[data-appname="${footerWindow.dataset.appname}"]`).classList.contains('visible')) {
            document.querySelector(`.app[data-appname="${footerWindow.dataset.appname}"]`).classList.add('visible')
        }
        apps.forEach(app => {
            if (footerWindow.dataset.appname === app.dataset.appname) {
                app.style.zIndex = 2;
            } else {
                app.style.zIndex = 1;
            }
        });
    })})
};

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
            }});
            unminimize();
    }

    document.querySelectorAll('.app').forEach(app => {
    let newLeft = window.getComputedStyle(app).getPropertyValue('left');
    let newTop = window.getComputedStyle(app).getPropertyValue('top');
    let xNull = 0
    let yNull = 0


    const minimize_button = document.querySelector(`.app[data-appname="${app.dataset.appname}"] .header_button-minimize`)
    const maximize_button = document.querySelector(`.app[data-appname="${app.dataset.appname}"] .header_button-maximize`)
    const close_button = document.querySelector(`.app[data-appname="${app.dataset.appname}"] .header_button-close`)
    const app_window = document.querySelector(`.app[data-appname="${app.dataset.appname}"]`)
    const app_header = document.querySelector(`.app[data-appname="${app.dataset.appname}"] .app_header`)



    app.addEventListener('click', function() {
        apps.forEach(otherApp => {
            if (otherApp === app) {
                otherApp.style.zIndex = 2;
            } else {
                otherApp.style.zIndex = 1;
            }
        });
        document.querySelectorAll('.footer_window').forEach(footerWindow => {
        footerWindow.classList.remove('focus')})
        if ( document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`)) {
            document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`).classList.add('focus');
        }
        
    });
    

    close_button.addEventListener('click', function() {
        if (app_window.classList.contains('visible')) {
            document.querySelector(`link[href="/${app.dataset.appname}/${app.dataset.appname}.css]`)
            document.querySelector(`script[src="/${app.dataset.appname}/${app.dataset.appname}.js]`)
            app_window.classList.remove('visible');
            document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`).remove();
            onChange()
    }});

    minimize_button.addEventListener('click', function(e) {
        e.stopPropagation();
        if (app_window.classList.contains('visible')) {
            document.querySelector(`.footer_window[data-appname="${app.dataset.appname}"]`).classList.remove('focus');
            app_window.classList.remove('visible')
    }});

    maximize_button.addEventListener('click', function() {
        if (!app_window.classList.contains('app_maximized')) {
            app_window.classList.add('app_maximized')
            app_window.style.left = `${xNull}px`;
            app_window.style.top = `${yNull}px`;
        }
        else {
            app_window.classList.remove('app_maximized')
            app_window.style.left = `${newLeft}`;
            app_window.style.top = `${newTop}`;
        }
    }); 
    let moving = false;

    // coordonnées du curseur au moment du down
    let startCursorX = 0;
    let startCursorY = 0;

    // position de la fenêtre au moment du down
    let startWindowX = 0;
    let startWindowY = 0;

    app_header.addEventListener('pointerdown', e => {
        // on veut cliquer exactement sur le header, pas sur ses enfants
        if (e.target !== e.currentTarget) return;
        if (e.button !== 0 || app_window.classList.contains('app_maximized')) return;

        moving = true;

        // 1️⃣ mémoriser la position du curseur (clientX/Y = coordonnées du viewport)
        startCursorX = e.clientX;
        startCursorY = e.clientY;

        // 2️⃣ mémoriser la position actuelle de la fenêtre
        //   - on utilise offsetLeft/offsetTop qui renvoient les valeurs réelles,
        //     même si le style.left/top n’est pas encore défini.
        startWindowX = app_window.offsetLeft;
        startWindowY = app_window.offsetTop;

        // mettre la fenêtre au premier plan pendant le drag
        app.style.zIndex = 9;
    });

    /* -------------------------------------------------------------
    Le bouton de relâchement (pointerup) et le leave restent identiques
    ------------------------------------------------------------- */
    document.addEventListener('pointerup', () => {
        moving = false;
        apps.forEach(otherApp => {
            otherApp.style.zIndex = (otherApp === app) ? 2 : 1;
        });
    });

    document.addEventListener('pointerleave', () => {
        moving = false;
    });

    /* -------------------------------------------------------------
    Déplacement (pointermove)
    ------------------------------------------------------------- */
    document.addEventListener('pointermove', e => {
        if (!moving) return;

        // garder la fenêtre au premier plan pendant le drag
        apps.forEach(otherApp => {
            otherApp.style.zIndex = (otherApp === app) ? 99 : 1;
        });

        // delta du curseur depuis le moment du down
        const dx = e.clientX - startCursorX;
        const dy = e.clientY - startCursorY;

        // nouvelle position brute (base + delta)
        newLeft = startWindowX + dx;
        newTop  = startWindowY + dy;

        // ---------------------------------------------------------
        // Contrainte aux bords du viewport (évite que la fenêtre disparaisse)
        // ---------------------------------------------------------
        const minX = 0;
        const minY = 0;
        const maxX = viewport.clientWidth  - app.offsetWidth;
        const maxY = viewport.clientHeight - app.offsetHeight - viewport.clientHeight * 0.0352;

        newLeft = `${Math.min(Math.max(newLeft, minX), maxX)}px`;
        newTop  = `${Math.min(Math.max(newTop,  minY), maxY)}px`;

        // appliquer
        app_window.style.left = `${newLeft}`;
        app_window.style.top  = `${newTop}`;
    });
});
footerWindowCreation()
}
