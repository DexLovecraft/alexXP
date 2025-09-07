let easyButton = document.getElementById('easy')
let mediumButton = document.getElementById('medium')
let hardButton = document.getElementById('hard')

let highscore = 0 



const easyMode = () => {
    easyButton.classList.toggle('button--press')
     setTimeout(() => {
        easyButton.classList.toggle('button--press')
        document.querySelector(`.easy`).classList.add('visible')
        document.querySelector(`.medium`).classList.remove('visible')
        document.querySelector(`.hard`).classList.remove('visible')
        document.querySelector(`.difficulty`).classList.remove('visible')
     }, 300)
}

const mediumMode = () => {
    mediumButton.classList.toggle('button--press')
     setTimeout(() => {
        mediumButton.classList.toggle('button--press')
        document.querySelector(`.easy`).classList.remove('visible')
        document.querySelector(`.medium`).classList.add('visible')
        document.querySelector(`.hard`).classList.remove('visible')
        document.querySelector(`.difficulty`).classList.remove('visible')
     }, 300)
     
}

const hardMode = () => {
    hardButton.classList.toggle('button--press')
     setTimeout(() => {
        hardButton.classList.toggle('button--press')
        document.querySelector(`.easy`).classList.remove('visible')
        document.querySelector(`.medium`).classList.remove('visible')
        document.querySelector(`.hard`).classList.add('visible')
        document.querySelector(`.difficulty`).classList.remove('visible')
     }, 300)
}

const eventTrigger = () => {
    if (easyButton !== null){
        easyButton.addEventListener('click', easyMode)
    }
    if (mediumButton !== null){
        mediumButton.addEventListener('click', mediumMode)
    }
    if (hardButton !== null){
        hardButton.addEventListener('click', hardMode)
    }
}

document.querySelectorAll('.simon_back').forEach(back => {
    back.addEventListener('click',() => {
        document.querySelector(`.easy`).classList.remove('visible')
        document.querySelector(`.medium`).classList.remove('visible')
        document.querySelector(`.hard`).classList.remove('visible')
        document.querySelector(`.difficulty`).classList.add('visible')
    })
})

eventTrigger()


// Declaration of variables 

let userSequenceInputEasy = [] // user input list
let sequenceAnswerEasy = [] // list to compare with input
let buttonsEasy = document.getElementsByClassName('button-easy') // DOM element useful fot functions
const colorsEasy = ['red-easy', 'yellow-easy', 'blue-easy', 'green-easy']
let roundStepEasy = 3 
let numberOfClickEasy = -1
let scoreEasy = 0
let numberOfsequenceEasy = 0
let highscoreEasy = highscore// game mechanics variable 
const difficultyLenghtEasy = 7
//functions declaration


// Function to random a list of number, push into sequenceAnswerEasy
const getRandomIntEasy = (max) => {
    return sequenceAnswerEasy.push(Math.floor(Math.random() * max));   
} 

// Function who flash button with the random generated number
const randomFlashEasy = (index) => {
    setTimeout(() => {
      buttonsEasy[sequenceAnswerEasy[index]].classList.toggle('button--light')
        setTimeout(() =>{
          buttonsEasy[sequenceAnswerEasy[index]].classList.toggle('button--light')
        },600)
      }, 1150 * index + 1)
  }


// Trigger function to the game who check in which phase of game user is 
const newGameEasy = (Step) => {
    if (Step <= 3){
      sequenceAnswerEasy = []
        for(let i = 0; i != 3; i++){
            getRandomIntEasy(4)
        }
        sequenceEasy(sequenceAnswerEasy)
        
    }
    else if (Step > difficultyLenghtEasy){
      replayEasy()
    }
    else{
        getRandomIntEasy(4)
        sequenceEasy(sequenceAnswerEasy)
    }
}

//function that call random Flash and after lauch the game
const sequenceEasy = (list) => {
    for (let nbr in list){
        randomFlashEasy(nbr)
    }
    setTimeout(() => {
       gameEasy()
    },1100 * roundStepEasy)
}

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

//the two function if the user win or lose at the game. that flash the easy in function and they both trigger newGameEasy but with different reinit. 
const loseEasy = () => {
  eventRemoverEasy()
  document.getElementsByClassName('le_simon_main')[0].classList.toggle('easy--false')
  setTimeout(() =>{
      document.getElementsByClassName('le_simon_main')[0].classList.toggle('easy--false')
    },300)
    userSequenceInputEasy = []
   sequenceAnswerEasy = []
   if(scoreEasy > highscoreEasy){
      highscoreEasy = highscore
   }
   scoreEasy = 0 
   numberOfsequenceEasy = 0
   scoreDisplayEasy()
   setTimeout(() => {
    newGameEasy(roundStepEasy)
  },1500)
}

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

//after user reach seven good input in a row, this function restart the game at three step with addition of score.
const replayEasy = () => {
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

const handleColorButtonClickEasy = (event) => {
  colorClickEasy(event.target.id)
}

const gameEasy = () => {
  for (const color of colorsEasy) {
    const button = document.querySelector(`#${color}`)
    if (button !== null) {
      button.addEventListener('click', handleColorButtonClickEasy)
    }
  }
}

const eventRemoverEasy = () => {
  for (const color of colorsEasy) {
    const button = document.querySelector(`#${color}`)
    if (button !== null) {
      button.removeEventListener('click', handleColorButtonClickEasy)
    }
  }
}

//Display scdore on web page
const scoreDisplayEasy = () => {
  document.getElementsByClassName('score__number')[0].innerHTML = scoreEasy
  document.getElementsByClassName('step__number')[0].innerHTML = numberOfsequenceEasy
  document.getElementsByClassName('highscore__number')[0].innerHTML = highscore
} 

//launch of new game
scoreDisplayEasy()
setTimeout(() => {
  newGameEasy(roundStepEasy, difficultyLenghtEasy)
}, 2000)




// Declaration of variables for medium difficulty
let userSequenceInputMedium = [] // user input list for medium
let sequenceAnswerMedium = [] // list to compare with input for medium
let buttonsMedium = document.getElementsByClassName('button-medium') // DOM element for medium
const colorsMedium = ['red-medium', 'yellow-medium', 'blue-medium', 'green-medium', 'orange-medium', 'purple-medium', 'pink-medium', 'teal-medium', 'maroon-medium']
let roundStepMedium = 3 
let numberOfClickMedium = -1
let scoreMedium = 0
let numberOfsequenceMedium = 0
let highscoreMedium = highscore // game mechanics variable for medium
const difficultyLengthMedium = 9

//functions declaration


// Function to random a list of number, push into sequenceAnswerMedium
const getRandomIntMedium = (max) => {
    return sequenceAnswerMedium.push(Math.floor(Math.random() * max));   
} 

// Function who flash button with the random generated number
const randomFlashMedium = (index) => {
    setTimeout(() => {
      buttonsMedium[sequenceAnswerMedium[index]].classList.toggle('button--light')
        setTimeout(() =>{
          buttonsMedium[sequenceAnswerMedium[index]].classList.toggle('button--light')
        },600)
      }, 1150 * index + 1)
  }


// Trigger function to the game who check in which phase of game user is 
const newGameMedium = (Step) => {
    if (Step <= 3){
      sequenceAnswerMedium = []
        for(let i = 0; i != 3; i++){
            getRandomIntMedium(9)
        }
  
        sequenceMedium(sequenceAnswerMedium)
        
    }
    else if (Step > difficultyLengthMedium){
      replayMedium()
    }
    else{
        getRandomIntMedium(9)
        
        sequenceMedium(sequenceAnswerMedium)
    }
}

//function that call random Flash and after lauch the game
const sequenceMedium = (list) => {
    for (let nbr in list){
        randomFlashMedium(nbr)
    }
    setTimeout(() => {
       gameMedium()
    },1100 * roundStepMedium)
}

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

//the two function if the user win or lose at the game. that flash the medium in function and they both trigger newGame but with different reinit. 
const loseMedium = () => {
  eventRemoverMedium()
  document.getElementsByClassName('le_simon_main')[0].classList.toggle('medium--false')
  setTimeout(() =>{
      document.getElementsByClassName('le_simon_main')[0].classList.toggle('medium--false')
    },300)
    userSequenceInputMedium = []
   sequenceAnswerMedium = []
   if(scoreMedium > highscoreMedium){
      highscoreMedium = highscore
   }
   scoreMedium = 0 
   numberOfsequenceMedium = 0
   scoreDisplayMedium()
   setTimeout(() => {
    newGameMedium(roundStepMedium)
  },1500)
}

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

//after user reach seven good input in a row, this function restart the game at three step with addition of score.
const replayMedium = () => {
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

const handleColorButtonClickMedium = (event) => {
  colorClickMedium(event.target.id)
}

const gameMedium = () => {
  for (const color of colorsMedium) {
    const button = document.querySelector(`#${color}`)
    if (button !== null) {
      button.addEventListener('click', handleColorButtonClickMedium)
    }
  }
}

const eventRemoverMedium = () => {
  for (const color of colorsMedium) {
    const button = document.querySelector(`#${color}`)
    if (button !== null) {
      button.removeEventListener('click', handleColorButtonClickMedium)
    }
  }
}

//Display score on web page
const scoreDisplayMedium = () => {
  document.getElementsByClassName('score__number')[0].innerHTML = scoreMedium
  document.getElementsByClassName('step__number')[0].innerHTML = numberOfsequenceMedium
  document.getElementsByClassName('highscore__number')[0].innerHTML = highscore
} 

//launch of new game
scoreDisplayMedium()
setTimeout(() => {
  newGameMedium(roundStepMedium, difficultyLengthMedium)
}, 2000)




// Declaration of variables 

let userSequenceInputHard = [] // user input list
let sequenceAnswerHard = [] // list to compare with input
let buttonsHard = document.getElementsByClassName('button-hard') // DOM element useful fot functions
const colorsHard = [
  'red-hard', 'yellow-hard', 'blue-hard', 'green-hard', 'orange-hard', 'purple-hard', 'pink-hard', 'teal-hard',
  'maroon-hard', 'grey-hard', 'bordeaux-hard', 'plum-hard', 'pine-green-hard', 'sky-blue-hard', 'duck-blue-hard', 'gold-hard'
]
let roundStepHard = 3 
let numberOfClickHard = -1
let scoreHard = 0
let numberOfsequenceHard = 0
let highscoreHard = highscore
const difficultyLenghtHard = 11
//functions declaration


// Function to random a list of number, push into sequenceAnswerHard
const getRandomIntHard = (max) => {
    return sequenceAnswerHard.push(Math.floor(Math.random() * max));   
} 

// Function who flash button with the random generated number
const randomFlashHard = (index) => {
    setTimeout(() => {
      buttonsHard[sequenceAnswerHard[index]].classList.toggle('button--light')
        setTimeout(() =>{
          buttonsHard[sequenceAnswerHard[index]].classList.toggle('button--light')
        },600)
      }, 1150 * index + 1)
  }


// Trigger function to the game who check in which phase of game user is 
const newGameHard = (Step) => {
    if (Step <= 3){
      sequenceAnswerHard = []
        for(let i = 0; i != 3; i++){
            getRandomIntHard(16)
        }

        sequenceHard(sequenceAnswerHard)
        
    }
    else if (Step > difficultyLenghtHard){
      replayHard()
    }
    else{
        getRandomIntHard(16)
        sequenceHard(sequenceAnswerHard)
    }
}

//function that call random Flash and after lauch the game
const sequenceHard = (list) => {
    for (let nbr in list){
        randomFlashHard(nbr)
    }
    setTimeout(() => {
       gameHard()
    },1100 * roundStepHard)
}

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

//the two function if the user win or lose at the game. that flash the background in function and they both trigger newGame but with different reinit. 
const loseHard = () => {
  eventRemoverHard()
  document.getElementsByClassName('le_simon_main')[0].classList.toggle('hard--false')
  setTimeout(() =>{
      document.getElementsByClassName('le_simon_main')[0].classList.toggle('hard--false')
    },300)
    userSequenceInputHard = []
   sequenceAnswerHard = []
   if(scoreHard > highscoreHard){
      highscoreHard = highscore
   }
   scoreHard = 0 
   numberOfsequenceHard = 0
   scoreDisplayHard()
   setTimeout(() => {
    newGameHard(roundStepHard)
  },1500)
}

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

//after user reach seven good input in a row, this function restart the game at three step with addition of score.
const replayHard = () => {
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

const handleColorButtonClickHard = (event) => {
  colorClickHard(event.target.id)
}

const gameHard = () => {
  for (const color of colorsHard) {
    const button = document.querySelector(`#${color}`)
    if (button !== null) {
      button.addEventListener('click', handleColorButtonClickHard)
    }
  }
}

const eventRemoverHard = () => {
  for (const color of colorsHard) {
    const button = document.querySelector(`#${color}`)
    if (button !== null) {
      button.removeEventListener('click', handleColorButtonClickHard)
    }
  }
}

//Display score on web page
const scoreDisplayHard = () => {
  document.getElementsByClassName('score__number')[0].innerHTML = scoreHard
  document.getElementsByClassName('step__number')[0].innerHTML = numberOfsequenceHard
  document.getElementsByClassName('highscore__number')[0].innerHTML = highscore
} 

//launch of new game
scoreDisplayHard()
setTimeout(() => {
  newGameHard(roundStepHard, difficultyLenghtHard)
}, 2000)
