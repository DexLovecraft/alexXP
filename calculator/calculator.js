// Ce fichier gere la logique de l'application Calculator 

// Comme toute les application ,  sont code html , css, et javascript doivent avoir le meme nom que son dossier,
// qui a lui porte le nom du data-appname de l'icone de l'app 

// Script supression de "submit" pour tout les fomrulaire , puisque javascript gerer dynamiquement (çi dessous)
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => e.preventDefault());
});

// Gestion des interaction du menu navigation 
// lorsqu'on clique sur un bouton la section dans .main_calculator prends la class visible , toute les autre se la font retirer 
const navButtons = document.querySelectorAll('#altitude, #speed, #mach, #QFE')
const navSections = document.querySelectorAll('.altitude, .speed, .mach, .QFE')

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        navSections.forEach(section => {
            if (section.classList.contains(button.id)) document.querySelector(`.${button.id}`).classList.add('visible');
            else section.classList.remove('visible');
        })
    })
})

// dictionaire {Altitude : Temperature} utilisé pour le calcul des mach 
let Temperature = {
    0: 15,
    500 : 11.8,
    1000 : 8.5, 
    1500 : 5.3, 
    2000 : 2.0, 
    2500 : -1.3, 
    3000: -4.5, 
    3500: -7.8, 
    4000: -11.0, 
    4500: -14.3, 
    5000: -17.5, 
    5500: -20.8, 
    6000: -24.0, 
    6500: -27.3, 
    7000: -30.5, 
    7500: -33.8, 
    8000: -37.0, 
    8500: -40.3, 
    9000: -43.5, 
    9500: -46.8, 
    10000: -50.0, 
    10500: -53.3,
    11000: -56.5
}

// Decalration des variable utilisé dans .main_calculator
const speedMetricInput = document.getElementById('speed_form_metric')
const speedKnotsInput = document.getElementById('speed_form_knots')
const altitudeMetricInput = document.getElementById('altitude_form_metric')
const altitudeFootInput = document.getElementById('altitude_form_foot')
const machAltInput   = document.getElementById('mach_altitude_form_metric');
const machKnotsInput = document.getElementById('mach_speed_form_knots');
const machResultInput = document.getElementById('mach_result');
const QNHInput = document.getElementById('QFE_form_QNH')
const QFEaltitudeInput = document.getElementById('QFE_form_alt-in-ft')
let QFEInput = document.getElementById('QFE_form_QFE') 

// gestion de la variable temperature pour le calcul de la vitesse en mach
const temperatureConversion = (altitude) => {
    const alt = Number(altitude);
    let key;

    if (alt > 11000) key = 11000;
    else if (alt <= 0) key = 0;
    else {
        const candidates = Object.keys(Temperature)
            .map(Number)
            .filter(k => k <= alt && k > alt - 500);
        key = Math.max(...candidates);  
    }
    return Temperature[key] + 273.15;
};

// Logique de la section altitude 
const altitudeConversion = (e, type) => {
    let altitudeMeter = 0
    switch (type) {
        case 'foot' : 
            altitudeMeter = e.target.value*0.3048
            altitudeMetricInput.value = altitudeMeter.toFixed(0)
            break;
        case 'meter' : 
            altitudeMeter = e.target.value
            altitudeFootInput.value = (e.target.value/0.3048).toFixed(0)
            break; 
    }   
}

// Logique de la section Speed 
const speedConversion = (e, type) => {
    switch (type) {
        case 'knots' :
            speedMetricInput.value = e.target.value/1.944.toFixed(0)
            break;
        case 'meter' : 
            let speed = e.target.value*1.944
            speedKnotsInput.value = speed.toFixed(0)
            break; 
    }
}

// Logique de la section QFE 
const QFEOperation = () => {
    QFEInput.value = (QNHInput.value-(QFEaltitudeInput.value*0.3048)/9.3).toFixed(0)
}

// Logique de la section Mach  
const machOperation = () => {
    
    const speedKnots = Number(machKnotsInput.value);
    const altitude   = Number(machAltInput.value);

    if (!speedKnots || !altitude) {
        machResultInput.value = ''; 
        return;
    }

    const tempKelvin = temperatureConversion(altitude);
    const soundSpeedKnots  = 39 * Math.sqrt(tempKelvin);  
    const mach = speedKnots / soundSpeedKnots;
    machResultInput.value = mach.toFixed(2);
};

// Lance la conversion de vitesse lorsque un des champs est changer 
speedKnotsInput.addEventListener('input', (e) => {speedConversion(e, "knots")})
speedMetricInput.addEventListener('input', (e) => {speedConversion(e, "meter")})

// Lance la conversion d'altitude lorsque un des champs est changer 
altitudeFootInput.addEventListener('input', (e) => {altitudeConversion(e, "foot")})
altitudeMetricInput.addEventListener('input',(e) => {altitudeConversion(e, "meter")})

// Lance le calcul des mach lorsque un des champs est changer 
machAltInput.addEventListener('input', machOperation);
machKnotsInput.addEventListener('input', machOperation);

// Lance le calcul du QFE lorsque un des champs est changer et si les deux son remplis  
QNHInput.addEventListener('input', ()=>{ if (QNHInput && QFEaltitudeInput != undefined) QFEOperation(); })
QFEaltitudeInput.addEventListener('input', ()=>{ if (QNHInput && QFEaltitudeInput != undefined) QFEOperation(); })
    
    
// declaration pour easter egg ( a380.png qui passe en faisant un bruit apres 5 clique sur l'image dans .altitude )
var takeoff_sound = new Audio('../sound/takeoff_sound.mp3');
let clickcount = 0

//fonction easter egg
document.querySelector(".altitude img").addEventListener('click', () => {
    clickcount++;
    if (clickcount === 5) {
        document.querySelector('.a380').classList.add("animation"); 
        takeoff_sound.play();
    }
    document.querySelector('.a380').addEventListener("animationend", () => { 
        document.querySelector('.a380').classList.remove("animation");
        clickcount = 0;
    })
});