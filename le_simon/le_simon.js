// Ce fichier gere la logique de l'application Le Simon  

// Comme toute les application ,  sont code html , css, et javascript doivent avoir le meme nom que son dossier,
// qui a lui porte le nom du data-appname de l'icone de l'app 

let highscore = 0;

// gestion de la logique de la page d'acceuil / selection de difficulté
const difficultyButtons = document.querySelectorAll('#easy, #medium, #hard');
const difficultySections = document.querySelectorAll('.easy, .medium, .hard, .difficulty');

difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('button--press')
        setTimeout(() => {
          button.classList.toggle('button--press')
          difficultySections.forEach(section => {
              if (section.classList.contains(button.id)) document.querySelector(`.${button.id}`).classList.add('visible');
              else section.classList.remove('visible');
          })
        }, 300)
    })
})

// gestion du retour a la page d'acceuil
document.querySelectorAll('.simon_back').forEach(back => {
    back.addEventListener('click',() => {
        difficultySections.forEach(section => {
            if (section.classList.contains('difficulty')) section.classList.add('visible');
            else section.classList.remove('visible');
        });
    });
})


// ce projet est recuperer d'un ancien (https://dexlovecraft.github.io/Le-Simon/)
// l'ancien projet suivais une logique multipages , 
// AlexXP etant une single pages application , le code a du etre adapter
// Ce fichier le_simon.js contient donc en un seul fichier le code de difficulty.js gameeasy.js gamemedium.js gamehard.js.
// cela creer un fichier monolitique a forte répétition. 


// ceci est le code pour la difficulté facile 

// declaration des variable du mode facile 

let userSequenceInputEasy = [] // liste des entrée du joueur 
let sequenceAnswerEasy = [] // liste du resultat attendu
let buttonsEasy = document.getElementsByClassName('button-easy')
const colorsEasy = ['red-easy', 'yellow-easy', 'blue-easy', 'green-easy']
let roundStepEasy = 3 
let numberOfClickEasy = -1
let scoreEasy = 0
let numberOfsequenceEasy = 0
let highscoreEasy = scoreEasy


// Rempli la liste d'input attendu (sequenceAnswerEasy) d'une suite de nombre aléatoire correspondant au bouton.
const getRandomIntEasy = () => {
    return sequenceAnswerEasy.push(Math.floor(Math.random() * 4));   
} 

// prends un nombre et fait s'illuminer le bouton correspondant
const randomFlashEasy = (index) => {
    setTimeout(() => {
      buttonsEasy[sequenceAnswerEasy[index]].classList.toggle('button--light')
        setTimeout(() =>{
          buttonsEasy[sequenceAnswerEasy[index]].classList.toggle('button--light')
        },600)
      }, 1150 * index + 1)
  }


// Lance une nouvelle partie en verifiant ou en est le joueur dans la partie 
// si on depasse 7 etape, on relance une partie (replayGameEasy)
// autrement on continue lance une nouvelle manche (sequenceEasy)
const newGameEasy = (Step) => {
    if (Step <= 3){
      sequenceAnswerEasy = []
        for(let i = 0; i != 3; i++){
            getRandomIntEasy()
        }
        sequenceEasy(sequenceAnswerEasy)
        
    }
    else if (Step > 7){
      replayGameEasy()
    }
    else{
        getRandomIntEasy()
        sequenceEasy(sequenceAnswerEasy)
    }
}

// On prends la liste de nmbre que l'on attends du joueur (sequenceAnswerEasy) et l'on declenche l'illumination des bouton (randomFlashEasy) dans l'ordre et un a la fois
// une foi tout les bouton illuminé on lance la partie (gameEasy) 
const sequenceEasy = (list) => {
    for (let nbr in list){
        randomFlashEasy(nbr)
    }
    setTimeout(() => {
       gameEasy()
    },1100 * roundStepEasy)
}


// a chaque clique si dans les element attendu (sequenceAnswerEasy) corresponde pas a l'element donner (userSequenceInputEasy) , il perd
// sinon  on laisse l'utilisateur cliquer sur les bouton jusqu'a ce qu'il ai autant d'input de l'utilisateur que d'etape a la manche
// Ensuite on verifie si les input de l'utilisateur son les meme qu'attendu
// si oui , il gagne et on ajout une etape , si non il perd et on retourne au nombre d'etape de base
const verifEasy = () => {
  if(sequenceAnswerEasy[numberOfClickEasy] !== userSequenceInputEasy[numberOfClickEasy]){
    roundStepEasy = 3
    numberOfClickEasy = -1
    loseEasy()
  }
  else if(userSequenceInputEasy.length == roundStepEasy){
    if(userSequenceInputEasy.every((value, index) => value === sequenceAnswerEasy[index])){
      numberOfClickEasy = -1
      roundStepEasy = roundStepEasy + 1
      winEasy()
    }
    else{
      roundStepEasy = 3
      numberOfClickEasy = -1
      loseEasy()
    }
  }
}

// Si il perd, on lui indique via une toggle de class , Puis on reinitialise les input utilisateur et le score  
const loseEasy = () => {
  eventRemoverEasy()
  document.getElementsByClassName('le_simon_main')[0].classList.toggle('easy--false')
  setTimeout(() =>{
      document.getElementsByClassName('le_simon_main')[0].classList.toggle('easy--false')
    },300)
    userSequenceInputEasy = []
   sequenceAnswerEasy = []
   if(scoreEasy > highscore){
      highscore = highscoreEasy
   }
   scoreEasy = 0 
   numberOfsequenceEasy = 0
   scoreDisplayEasy()
   setTimeout(() => {
    newGameEasy(roundStepEasy)
  },1500)
}

// Si il gagne, on lui indique via une toggle de class , Puis on reinitialise les input et on update le score 
const winEasy = () => {
  eventRemoverEasy()
    document.getElementsByClassName('le_simon_main')[0].classList.toggle('easy--true')
    setTimeout(() =>{
      document.getElementsByClassName('le_simon_main')[0].classList.toggle('easy--true')
    },300)
    userSequenceInputEasy = []
    scoreEasy = (scoreEasy + (100 * (roundStepEasy - 1)))
    scoreDisplayEasy()
    setTimeout(() => {
      newGameEasy(roundStepEasy)
    },1500)
}

// quand on atteint 7 etape, on reintialise la partie, mais en augmentant le score 
const replayGameEasy = () => {
  roundStepEasy = 3
  scoreEasy = scoreEasy * 2
  numberOfsequenceEasy = numberOfsequenceEasy + 1 
  scoreDisplayEasy()
  userSequenceInputEasy = []
  sequenceAnswerEasy = []
  setTimeout(() => {
    newGameEasy(roundStepEasy)
  },1500)
}

// gestion des bouton , illumination et verification de l'input , en rentrant le nombre correspondant dans la liste d'input
const colorClickEasy = (color) => {
  const index = colorsEasy.indexOf(color)
  if (index === -1) {
    return
  }

  const button = document.querySelector(`#${color}`)
  button.classList.toggle('button--light')
  button.classList.toggle('button--press')

  setTimeout(() => {
    button.classList.toggle('button--light')
    button.classList.toggle('button--press')
  }, 200)

  userSequenceInputEasy.push(index)
  numberOfClickEasy = numberOfClickEasy + 1
  verifEasy()
}

// accede a la logique bouton du bouton ou l'on clique
const handleColorButtonClickEasy = (event) => {
  colorClickEasy(event.target.id)
}


// Sert a activé les evenement de click sur les boton (anti triche) 
const gameEasy = () => {
  for (const color of colorsEasy) {
    const button = document.querySelector(`#${color}`)
    if (button !== null) {
      button.addEventListener('click', handleColorButtonClickEasy)
    }
  }
}

// fonction pour retirer les evenement de click sur les bouton 
const eventRemoverEasy = () => {
  for (const color of colorsEasy) {
    const button = document.querySelector(`#${color}`)
    if (button !== null) {
      button.removeEventListener('click', handleColorButtonClickEasy)
    }
  }
}

// Affiche le score
const scoreDisplayEasy = () => {
  document.getElementsByClassName('score__number')[0].innerHTML = scoreEasy
  document.getElementsByClassName('step__number')[0].innerHTML = numberOfsequenceEasy
  document.getElementsByClassName('highscore__number')[0].innerHTML = highscore
} 

// lance une nouvelle partie 
scoreDisplayEasy()
setTimeout(() => {
  newGameEasy(roundStepEasy)
}, 2000)



// ceci est le code pour la difficulté moyen 

// declaration des variable du mode moyen 

let userSequenceInputMedium = [] // liste des entrée du joueur 
let sequenceAnswerMedium = [] // liste du resultat attendu
let buttonsMedium = document.getElementsByClassName('button-medium') 
const colorsMedium = ['red-medium', 'yellow-medium', 'blue-medium', 'green-medium', 'orange-medium', 'purple-medium', 'pink-medium', 'teal-medium', 'maroon-medium']
let roundStepMedium = 3 
let numberOfClickMedium = -1
let scoreMedium = 0
let numberOfsequenceMedium = 0
let highscoreMedium = scoreMedium // game mechanics variable for medium

const getRandomIntMedium = () => {
    return sequenceAnswerMedium.push(Math.floor(Math.random() * 9));   
} 

// prends un nombre et fait s'illuminer le bouton correspondant
const randomFlashMedium = (index) => {
    setTimeout(() => {
      buttonsMedium[sequenceAnswerMedium[index]].classList.toggle('button--light')
        setTimeout(() =>{
          buttonsMedium[sequenceAnswerMedium[index]].classList.toggle('button--light')
        },600)
      }, 1150 * index + 1)
  }


// Lance une nouvelle partie en verifiant ou en est le joueur dans la partie 
// si on depasse 9 etape, on relance une partie (replayGameMedium)
// autrement on continue lance une nouvelle manche (sequenceMedium)
const newGameMedium = (Step) => {
    if (Step <= 3){
      sequenceAnswerMedium = []
        for(let i = 0; i != 3; i++){
            getRandomIntMedium()
        }
        sequenceMedium(sequenceAnswerMedium)
        
    }
    else if (Step > 9){
      replayGameMedium()
    }
    else{
        getRandomIntMedium()
        sequenceMedium(sequenceAnswerMedium)
    }
}

// On prends la liste de nmbre que l'on attends du joueur (sequenceAnswerMedium) et l'on declenche l'illumination des bouton (randomFlashMedium) dans l'ordre et un a la fois
// une foi tout les bouton illuminé on lance la partie (gameMedium) 
const sequenceMedium = (list) => {
    for (let nbr in list){
        randomFlashMedium(nbr)
    }
    setTimeout(() => {
       gameMedium()
    },1100 * roundStepMedium)
}


// a chaque clique si dans les element attendu (sequenceAnswerMedium) corresponde pas a l'element donner (userSequenceInputMedium) , il perd
// sinon  on laisse l'utilisateur cliquer sur les bouton jusqu'a ce qu'il ai autant d'input de l'utilisateur que d'etape a la manche
// Ensuite on verifie si les input de l'utilisateur son les meme qu'attendu
// si oui , il gagne et on ajout une etape , si non il perd et on retourne au nombre d'etape de base
const verifMedium = () => {
  if(sequenceAnswerMedium[numberOfClickMedium] !== userSequenceInputMedium[numberOfClickMedium]){
    roundStepMedium = 3
    numberOfClickMedium = -1
    loseMedium()
  }
  else if(userSequenceInputMedium.length == roundStepMedium){
    if(userSequenceInputMedium.every((value, index) => value === sequenceAnswerMedium[index])){
      numberOfClickMedium = -1
      roundStepMedium = roundStepMedium + 1
      winMedium()
    }
    else{
      roundStepMedium = 3
      numberOfClickMedium = -1
      loseMedium()
    }
  }
}

// Si il perd, on lui indique via une toggle de class , Puis on reinitialise les input utilisateur et le score  
const loseMedium = () => {
  eventRemoverMedium()
  document.getElementsByClassName('le_simon_main')[0].classList.toggle('medium--false')
  setTimeout(() =>{
      document.getElementsByClassName('le_simon_main')[0].classList.toggle('medium--false')
    },300)
    userSequenceInputMedium = []
   sequenceAnswerMedium = []
   if(scoreMedium > highscore){
      highscore = highscoreMedium
   }
   scoreMedium = 0 
   numberOfsequenceMedium = 0
   scoreDisplayMedium()
   setTimeout(() => {
    newGameMedium(roundStepMedium)
  },1500)
}

// Si il gagne, on lui indique via une toggle de class , Puis on reinitialise les input et on update le score 
const winMedium = () => {
  eventRemoverMedium()
    document.getElementsByClassName('le_simon_main')[0].classList.toggle('medium--true')
    setTimeout(() =>{
      document.getElementsByClassName('le_simon_main')[0].classList.toggle('medium--true')
    },300)
    userSequenceInputMedium = []
    scoreMedium = (scoreMedium + (100 * (roundStepMedium - 1)))
    scoreDisplayMedium()
    setTimeout(() => {
      newGameMedium(roundStepMedium)
    },1500)
}

// quand on atteint 9 etape, on reintialise la partie, mais en augmentant le score 
const replayGameMedium = () => {
  roundStepMedium = 3
  scoreMedium = scoreMedium * 2
  numberOfsequenceMedium = numberOfsequenceMedium + 1 
  scoreDisplayMedium()
  userSequenceInputMedium = []
  sequenceAnswerMedium = []
  setTimeout(() => {
    newGameMedium(roundStepMedium)
  },1500)
}

// gestion des bouton , illumination et verification de l'input , en rentrant le nombre correspondant dans la liste d'input
const colorClickMedium = (color) => {
  const index = colorsMedium.indexOf(color)
  if (index === -1) {
    return
  }

  const button = document.querySelector(`#${color}`)
  button.classList.toggle('button--light')
  button.classList.toggle('button--press')

  setTimeout(() => {
    button.classList.toggle('button--light')
    button.classList.toggle('button--press')
  }, 200)

  userSequenceInputMedium.push(index)
  numberOfClickMedium = numberOfClickMedium + 1
  verifMedium()
}

// accede a la logique bouton du bouton ou l'on clique
const handleColorButtonClickMedium = (event) => {
  colorClickMedium(event.target.id)
}


// Sert a activé les evenement de click sur les boton (anti triche) 
const gameMedium = () => {
  for (const color of colorsMedium) {
    const button = document.querySelector(`#${color}`)
    if (button !== null) {
      button.addEventListener('click', handleColorButtonClickMedium)
    }
  }
}

// fonction pour retirer les evenement de click sur les bouton 
const eventRemoverMedium = () => {
  for (const color of colorsMedium) {
    const button = document.querySelector(`#${color}`)
    if (button !== null) {
      button.removeEventListener('click', handleColorButtonClickMedium)
    }
  }
}

// Affiche le score
const scoreDisplayMedium = () => {
  document.getElementsByClassName('score__number')[1].innerHTML = scoreMedium
  document.getElementsByClassName('step__number')[1].innerHTML = numberOfsequenceMedium
  document.getElementsByClassName('highscore__number')[1].innerHTML = highscore
} 

// lance une nouvelle partie 
scoreDisplayMedium()
setTimeout(() => {
  newGameMedium(roundStepMedium)
}, 2000)



// ceci est le code pour la difficulté moyen 

// declaration des variable du mode moyen 

let userSequenceInputHard = [] // liste des entrée du joueur 
let sequenceAnswerHard = [] // liste du resultat attendu
let buttonsHard = document.getElementsByClassName('button-hard') 
const colorsHard = [
  'red-hard', 'yellow-hard', 'blue-hard', 'green-hard', 'orange-hard', 'purple-hard', 'pink-hard', 'teal-hard',
  'maroon-hard', 'grey-hard', 'bordeaux-hard', 'plum-hard', 'pine-green-hard', 'sky-blue-hard', 'duck-blue-hard', 'gold-hard'
]
let roundStepHard = 3 
let numberOfClickHard = -1
let scoreHard = 0
let numberOfsequenceHard = 0
let highscoreHard = scoreHard
const difficultyLenghtHard = 11
const getRandomIntHard = () => {
    return sequenceAnswerHard.push(Math.floor(Math.random() * 16));   
} 

// prends un nombre et fait s'illuminer le bouton correspondant
const randomFlashHard = (index) => {
    setTimeout(() => {
      buttonsHard[sequenceAnswerHard[index]].classList.toggle('button--light')
        setTimeout(() =>{
          buttonsHard[sequenceAnswerHard[index]].classList.toggle('button--light')
        },600)
      }, 1150 * index + 1)
  }


// Lance une nouvelle partie en verifiant ou en est le joueur dans la partie 
// si on depasse 11 etape, on relance une partie (replayGameHard)
// autrement on continue lance une nouvelle manche (sequenceHard)
const newGameHard = (Step) => {
    if (Step <= 3){
      sequenceAnswerHard = []
        for(let i = 0; i != 3; i++){
            getRandomIntHard()
        }
        sequenceHard(sequenceAnswerHard)
        
    }
    else if (Step > 11){
      replayGameHard()
    }
    else{
        getRandomIntHard()
        sequenceHard(sequenceAnswerHard)
    }
}

// On prends la liste de nmbre que l'on attends du joueur (sequenceAnswerHard) et l'on declenche l'illumination des bouton (randomFlashHard) dans l'ordre et un a la fois
// une foi tout les bouton illuminé on lance la partie (gameHard) 
const sequenceHard = (list) => {
    for (let nbr in list){
        randomFlashHard(nbr)
    }
    setTimeout(() => {
       gameHard()
    },1100 * roundStepHard)
}


// a chaque clique si dans les element attendu (sequenceAnswerHard) corresponde pas a l'element donner (userSequenceInputHard) , il perd
// sinon  on laisse l'utilisateur cliquer sur les bouton jusqu'a ce qu'il ai autant d'input de l'utilisateur que d'etape a la manche
// Ensuite on verifie si les input de l'utilisateur son les meme qu'attendu
// si oui , il gagne et on ajout une etape , si non il perd et on retourne au nombre d'etape de base
const verifHard = () => {
  if(sequenceAnswerHard[numberOfClickHard] !== userSequenceInputHard[numberOfClickHard]){
    roundStepHard = 3
    numberOfClickHard = -1
    loseHard()
  }
  else if(userSequenceInputHard.length == roundStepHard){
    if(userSequenceInputHard.every((value, index) => value === sequenceAnswerHard[index])){
      numberOfClickHard = -1
      roundStepHard = roundStepHard + 1
      winHard()
    }
    else{
      roundStepHard = 3
      numberOfClickHard = -1
      loseHard()
    }
  }
}

// Si il perd, on lui indique via une toggle de class , Puis on reinitialise les input utilisateur et le score  
const loseHard = () => {
  eventRemoverHard()
  document.getElementsByClassName('le_simon_main')[0].classList.toggle('hard--false')
  setTimeout(() =>{
      document.getElementsByClassName('le_simon_main')[0].classList.toggle('hard--false')
    },300)
    userSequenceInputHard = []
   sequenceAnswerHard = []
   if(scoreHard > highscore){
      highscore = highscoreHard
   }
   scoreHard = 0 
   numberOfsequenceHard = 0
   scoreDisplayHard()
   setTimeout(() => {
    newGameHard(roundStepHard)
  },1500)
}

// Si il gagne, on lui indique via une toggle de class , Puis on reinitialise les input et on update le score 
const winHard = () => {
  eventRemoverHard()
    document.getElementsByClassName('le_simon_main')[0].classList.toggle('hard--true')
    setTimeout(() =>{
      document.getElementsByClassName('le_simon_main')[0].classList.toggle('hard--true')
    },300)
    userSequenceInputHard = []
    scoreHard = (scoreHard + (100 * (roundStepHard - 1)))
    scoreDisplayHard()
    setTimeout(() => {
      newGameHard(roundStepHard)
    },1500)
}

// quand on atteint 11 etape, on reintialise la partie, mais en augmentant le score 
const replayGameHard = () => {
  roundStepHard = 3
  scoreHard = scoreHard * 2
  numberOfsequenceHard = numberOfsequenceHard + 1 
  scoreDisplayHard()
  userSequenceInputHard = []
  sequenceAnswerHard = []
  setTimeout(() => {
    newGameHard(roundStepHard)
  },1500)
}

// gestion des bouton , illumination et verification de l'input , en rentrant le nombre correspondant dans la liste d'input
const colorClickHard = (color) => {
  const index = colorsHard.indexOf(color)
  if (index === -1) {
    return
  }

  const button = document.querySelector(`#${color}`)
  button.classList.toggle('button--light')
  button.classList.toggle('button--press')

  setTimeout(() => {
    button.classList.toggle('button--light')
    button.classList.toggle('button--press')
  }, 200)

  userSequenceInputHard.push(index)
  numberOfClickHard = numberOfClickHard + 1
  verifHard()
}

// accede a la logique bouton du bouton ou l'on clique
const handleColorButtonClickHard = (event) => {
  colorClickHard(event.target.id)
}


// Sert a activé les evenement de click sur les boton (anti triche) 
const gameHard = () => {
  for (const color of colorsHard) {
    const button = document.querySelector(`#${color}`)
    if (button !== null) {
      button.addEventListener('click', handleColorButtonClickHard)
    }
  }
}

// fonction pour retirer les evenement de click sur les bouton 
const eventRemoverHard = () => {
  for (const color of colorsHard) {
    const button = document.querySelector(`#${color}`)
    if (button !== null) {
      button.removeEventListener('click', handleColorButtonClickHard)
    }
  }
}

// Affiche le score
const scoreDisplayHard = () => {
  document.getElementsByClassName('score__number')[2].innerHTML = scoreHard
  document.getElementsByClassName('step__number')[2].innerHTML = numberOfsequenceHard
  document.getElementsByClassName('highscore__number')[2].innerHTML = highscore
} 

// lance une nouvelle partie 
scoreDisplayHard()
setTimeout(() => {
  newGameHard(roundStepHard)
}, 2000)

