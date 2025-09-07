
const altitude_button = document.getElementById('altitude')
const speed_button = document.getElementById('speed')
const mach_button = document.getElementById('mach')
const QFE_button = document.getElementById('QFE')
var takeoff_sound = new Audio('./alexXP/takeoff_sound.mp3');

altitude_button.addEventListener('click', function() {
    document.querySelector('.altitude').classList.add('visible');
    document.querySelector('.speed').classList.remove('visible');
    document.querySelector('.QFE_container').classList.remove('visible');
    document.querySelector('.mach').classList.remove('visible');
})

speed_button.addEventListener('click', function() {
    document.querySelector('.speed').classList.add('visible');
    document.querySelector('.altitude').classList.remove('visible');
    document.querySelector('.QFE_container').classList.remove('visible');
    document.querySelector('.mach').classList.remove('visible');
})     

mach_button.addEventListener('click', function() {
    document.querySelector('.mach').classList.add('visible');
    document.querySelector('.altitude').classList.remove('visible');
    document.querySelector('.speed').classList.remove('visible');
    document.querySelector('.QFE_container').classList.remove('visible');
})

QFE_button.addEventListener('click', function() {
    document.querySelector('.QFE_container').classList.add('visible');
    document.querySelector('.altitude').classList.remove('visible');
    document.querySelector('.speed').classList.remove('visible');
    document.querySelector('.mach').classList.remove('visible');
})


let Temperature = {0: 15, 500 : 11.8, 1000 : 8.5, 1500 : 5.3, 2000 : 2.0, 2500 : -1.3, 3000: -4.5, 3500: -7.8, 4000: -11.0, 4500: -14.3, 5000: -17.5, 5500: -20.8, 6000: -24.0, 6500: -27.3, 7000: -30.5, 7500: -33.8, 8000: -37.0, 8500: -40.3, 9000: -43.5, 9500: -46.8, 10000: -50.0, 10500: -53.3,11000: -56.5}

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
let dataTemperature = 0
let speed = 1.944

const temperatureConversion = (altitudeMeters) => {
    const alt = Number(altitudeMeters);
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

const altitudeConversion = (e, type) => {
    let altitudeMeter = 0
    if (type == "foot") {
        altitudeMeter = e.target.value*0.3048
        altitudeMetricInput.value = altitudeMeter.toFixed(0)
    }
    else if (type == "meter"){
        altitudeMeter = e.target.value
        altitudeFootInput.value = (e.target.value/0.3048).toFixed(0)
    }
}

const speedConversion = (e, type) => {
    if (type == "knots") {
        speed = e.target.value
        speedMetricInput.value = e.target.value/1.944.toFixed(0)
    }
    else if (type == "meter"){
        speed = e.target.value*1.944
        speedKnotsInput.value = speed.toFixed(0)
    }
}

const QFEOperation = () => {
    QFEInput.value = (QNHInput.value-(QFEaltitudeInput.value*0.3048)/9.3).toFixed(0)
}

const machOperation = () => {
    
    const speedKnots = Number(machKnotsInput.value);
    const altitude   = Number(machAltInput.value);

    if (!speedKnots || !altitude) {
        machResultInput.value = ''; 
        return;
    }
    const tempK = temperatureConversion(altitude);
    const a = 39 * Math.sqrt(tempK);  
    const mach = speedKnots / a;
    machResultInput.value = mach.toFixed(2);
};
const speedOperation = (e, temperature) => {
    speed = e.target.value*(39*Math.sqrt(temperature))
    speedKnotsInput.value = speed.toFixed(0)
    speedMetricInput.value = (speed/1.944).toFixed(0)
}

document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => e.preventDefault());
});

speedKnotsInput.addEventListener('input', (e) => {speedConversion(e, "knots")})
speedMetricInput.addEventListener('input', (e) => {speedConversion(e, "meter")})
altitudeFootInput.addEventListener('input', (e) => {altitudeConversion(e, "foot")})
altitudeMetricInput.addEventListener('input',(e) => {altitudeConversion(e, "meter")})
machAltInput.addEventListener('input', machOperation);
machKnotsInput.addEventListener('input', machOperation);
QNHInput.addEventListener('input', ()=>{
    if(QNHInput && QFEaltitudeInput != undefined){
        QFEOperation()
    }
})
QFEaltitudeInput.addEventListener('input', ()=>{
    if(QNHInput && QFEaltitudeInput != undefined){
        QFEOperation()
    }
})

//easter egg 
let clickcount = 0

document.querySelector(".altitude img").addEventListener('click', function(e) {
    clickcount++;
    if (clickcount === 5) {
        document.querySelector('.a380').classList.add("animation"); 
        takeoff_sound.play();
    }
    document.querySelector('.a380').addEventListener("animationend", (event) => { 
        document.querySelector('.a380').classList.remove("animation");
        clickcount = 0;
    })
});