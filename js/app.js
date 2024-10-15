/*-------------------------------- Constants --------------------------------*/
const loopsPositions = {
  green: [1, 51],
  yellow: [14, 12],
  blue: [27, 25],
  red: [40, 38]
}
const safePositions = { green: 48, yellow: 9, blue: 22, red: 35 }
// const gameModes = ['individuals', 'Teams', 'PC', 'PC Team']
const playersSequence = ['green', 'yellow', 'blue', 'red']

/*---------------------------- Variables (state) ----------------------------*/
let turn = 0
let scores = { green: 0, yellow: 0, blue: 0, red: 0 }
let playersName = { green: '', yellow: '', blue: '', red: '' }
// let gameMode = 0
let playersFreeButtons = { green: [], yellow: [], blue: [], red: [] }
//let playersEndButtons = { green: [], yellow: [], blue: [], red: [] }
let diceNumber = 0
let playersNumbers = 4
let color = playersSequence[turn]
let winner = false
let message = `Lets Start with ${color} player`

/*------------------------ Cached Element References ------------------------*/
const sqrs = document.querySelectorAll('.sqr')
/* const greenEnds = document.querySelectorAll('.green-end')
const yellowEnds = document.querySelectorAll('.yellow-end')
const blueEnds = document.querySelectorAll('.blue-end')
const redEnds = document.querySelectorAll('.red-end') */
const dice = document.querySelector('#diceBtn')
const diceImage = document.querySelector('#diceImage')
const gameMsg = document.querySelector('#gameMsg')
const divDiceImage = document.querySelector('#divDiceImage')
const playersNoBtn = document.querySelector('#playersNo')
const otherTurnBtn = document.querySelector('#otherTurn')
const newGameBtn = document.querySelector('#newGame')

console.log('playersNoBtn: ', playersNoBtn.innerHTML)
/*-------------------------------- Functions --------------------------------*/

const init = () => {
  updateScores()
  updateHomes()
  updateBoard()
  turn = 0
  scores = { green: 0, yellow: 0, blue: 0, red: 0 }
  playersFreeButtons = { green: [], yellow: [], blue: [], red: [] }
  diceNumber = 0
  playersNumbers = 2
  color = playersSequence[turn]
  winner = false
  message = `Lets Start with ${color} player`
  gameMsg.textContent = message
  gameMsg.className = `players-scores ${color}-status-bg`
  divDiceImage.className = `${color}-status-bg`
  playersNoBtn.innerHTML = 'Initialize with 4 players'
  playersNoBtn.name = '4'
}

const updateScores = () => {
  playersSequence.forEach((color) => {
    document.querySelector(`#${color}-status`).textContent = 0
  })
}

const updateBoard = () => {
  sqrs.forEach((sqr) => {
    sqr.textContent = ''
  })
}

const updateHomes = () => {
  let homeBtns = document.querySelectorAll(`.${color}-home-token-btn`)
  homeBtns.forEach((homeBtn) => {
    homeBtn.classList.add(`${color}-home-bg`)
    homeBtn.classList.remove(`${color}-home-token-btn`)
    homeBtn.classList.remove('home-btns-token')
  })

  let endBtns = document.querySelectorAll(`.${color}-end-bg`)
  endBtns.forEach((endBtn) => {
    endHomes.classList.add(`${color}-end`)
    endHomes.classList.remove(`${color}-end-bg`)
  })
}

const initPlayers = () => {
  updateScores()
  updateHomes()
  updateBoard()
  turn = 0
  scores = { green: 0, yellow: 0, blue: 0, red: 0 }
  playersFreeButtons = { green: [], yellow: [], blue: [], red: [] }
  diceNumber = 0
  playersNumbers = playersNoBtn.name
  color = playersSequence[turn]
  winner = false
  message = `Lets Start with ${color} player`
  gameMsg.textContent = message
  gameMsg.className = `players-scores ${color}-status-bg`
  divDiceImage.className = `${color}-status-bg`
  playersNoBtn.name = playersNoBtn.name == '2' ? '4' : '2'
  playersNoBtn.innerHTML = `Initialize with ${playersNoBtn.name} players`

  console.log(playersNoBtn)
  console.log('initPlayers')
}

const initTurn = () => {
  updateHomes()
  updateBoard()
  turn = 0
  playersFreeButtons = { green: [], yellow: [], blue: [], red: [] }
  diceNumber = 0
  color = playersSequence[turn]
  winner = false
  message = `Lets Start with ${color} player`
  gameMsg.textContent = message
  gameMsg.className = `players-scores ${color}-status-bg`
  divDiceImage.className = `${color}-status-bg`
}

// the main function to handle player turn
const handlePlayerTurn = () => {
  dice.disabled = true
  generateDice() // generate a dice number
  let freeBtnsFounded = checkFreeButtons() // check players free buttons. if there is, wait to handle clicking a button
  if (!freeBtnsFounded) {
    let prevColor = color
    switchPlayerTurn()
    updateMessage('noFree', prevColor)
  } else {
    updateMessage('waiting')
  }
}

const updateMessage = (code = '', prevColor = '') => {
  if (code == 'noFree') {
    message = `☺ Sorry, No free Buttons for you ${prevColor}, it's ${color} time to play`
  } else if (code == 'waiting') {
    message = `Waiting for your smart move ${color}`
  } else if (code == 'clickDise') {
    message = `Click generate a number to go ${color}`
  } else if (code == 'meAgain') {
    message = `I am Here again as second turn, I'm ${color}`
  } else if (code == 'winner') {
    message = `Trust me, I'm '${color}' and i've won this turn`
  } else {
    message = code
  }
  gameMsg.textContent = message
}
// generate random numnber from 1 to 6
const generateDice = () => {
  diceNumber = Math.floor(Math.random() * 6) + 1
  diceImage.src = `./img/dice-${diceNumber}.png`
}

// Check players free buttons
const checkFreeButtons = () => {
  let foundFree = false
  // if diceNumber = 6 , add event listener to any player home buttons with any of playersFreeButtons and can be moved. wait for click
  if (diceNumber === 6) {
    // check home buttons
    let homeBtns = document.querySelectorAll(`.${color}-home-bg`)

    homeBtns.forEach((homeBtn) => {
      foundFree = true
      homeBtn.addEventListener('click', handleButtonClick)
      homeBtn.style.cursor = 'pointer'
    })

    // check free buttons
    let freeBtns = playersFreeButtons[color]
    if (freeBtns.length) {
      for (let i = 0; i < freeBtns.length; i++) {
        let remainSqrs = freeBtns[i].loop
        let endingSqrs = freeBtns[i].ending
        if (remainSqrs + endingSqrs >= diceNumber) {
          foundFree = true
          document
            .querySelector(`#sqr${freeBtns[i].position}-${color}-btn`)
            .addEventListener('click', handleButtonClick)
          document.querySelector(
            `#sqr${freeBtns[i].position}-${color}-btn`
          ).style.cursor = 'pointer'
        }
      }
    }
  } else {
    // else if any of playersFreeButtons and can be moved, add event listener. wait for click
    let freeBtns = playersFreeButtons[color]
    if (freeBtns.length) {
      for (let i = 0; i < freeBtns.length; i++) {
        let remainSqrs = freeBtns[i].loop
        let endingSqrs = freeBtns[i].ending
        if (remainSqrs + endingSqrs >= diceNumber) {
          foundFree = true
          // if (remainSqrs >= 0) {
          let test = document.querySelectorAll(
            `#sqr${freeBtns[i].position}-${color}-btn`
          )
          console.log(test)

          document
            .querySelector(`#sqr${freeBtns[i].position}-${color}-btn`)
            .addEventListener('click', handleButtonClick)
          document.querySelector(
            `#sqr${freeBtns[i].position}-${color}-btn`
          ).style.cursor = 'pointer'
          /* } else {
            document
              .querySelector(
                `#sqr${turnColor[0]}${freeBtns[i].position}-${Color}-btn`
              )
              .addEventListener('click', handleButtonClick)
            document.querySelector(
              `#sqr${turnColor[0]}${freeBtns[i].position}-${Color}-btn`
            ).style.cursor = 'pointer'
          } */
        }
      }
    }
  }
  return foundFree
}

const handleButtonClick = (clickedBtn) => {
  removeListeners()
  let sorry = movePlayerBtn(clickedBtn)
  checkForWinner()
  if (!winner) {
    switchPlayerTurn(sorry)
    // updateMessage('clickDise')
  } else {
    scores[color]++
    document.querySelector(`.${color}-status-bg`).textContent = scores[color]
    updateMessage('winner')
  }
}

const removeListeners = () => {
  let homeBtns = document.querySelectorAll(`.${color}-home-bg`)
  let tokenHomeBtns = document.querySelectorAll(`.${color}-home-token-btn`)
  let playerBtns = document.querySelectorAll(`.${color}-player-btn`)
  homeBtns.forEach((btn) => {
    btn.removeEventListener('click', handleButtonClick)
    btn.style.cursor = ''
  })
  tokenHomeBtns.forEach((btn) => {
    btn.removeEventListener('click', handleButtonClick)
    btn.style.cursor = ''
  })
  playerBtns.forEach((btn) => {
    btn.removeEventListener('click', handleButtonClick)
    btn.style.cursor = ''
  })
}

const movePlayerBtn = (clickedBtn) => {
  let sorry = false
  let isHomeBtn = clickedBtn.target.classList.contains(`${color}-home-bg`)

  // generate new button
  newElement = document.createElement('div')
  newElement.classList.add('players-btns')
  newElement.classList.add(`${color}-btn`)
  newElement.classList.add(`${color}-player-btn`)
  newElement.title = `${color}`
  newElement.style['animation'] = 'zoom-in'
  newElement.style['animation-duration'] = '0.7s'
  newElement.style['animation-timing-function'] = 'ease'

  // home btn clicked !
  if (isHomeBtn) {
    clickedBtn.target.classList.remove(`${color}-home-bg`)
    clickedBtn.target.classList.add(`${color}-home-token-btn`)
    clickedBtn.target.classList.add('home-btns-token')

    let start = loopsPositions[color][0]
    let sqrName = `#sqr${start}`

    // check if there is other btns in same square
    sorry = checkOtherBtns(sqrName)

    // new element id, name
    newElement.id = `sqr${start}-${color}-btn`
    newElement.name = start

    // append child to the square
    // document.querySelector(sqrName).textContent = ''
    document.querySelector(sqrName).appendChild(newElement)

    // add btn details to the player free btns list
    playersFreeButtons[color].push({ position: start, loop: 50, ending: 6 })
  } else {
    // not a home btn
    let btnDetails = playersFreeButtons[color].find((btn) => {
      return btn.position == clickedBtn.target.name
    })
    let btnIndex = playersFreeButtons[color].findIndex((btn) => {
      return btn.position == clickedBtn.target.name
    })

    // remove old btn
    let prevSqrBtn = document.querySelector(`#sqr${btnDetails.position}`)
    prevSqrBtn.removeChild(prevSqrBtn.firstElementChild)

    if (btnDetails.loop < diceNumber) {
      console.log('btnDetails:', btnDetails)

      // check ending
      let newPosition = btnDetails.loop + btnDetails.ending - diceNumber
      let positionName = `${color[0]}${newPosition}`
      let sqrName = `#sqr${positionName}`
      console.log('newPosition:', newPosition)
      console.log('positionName:', positionName)
      console.log('sqrName:', sqrName)
      if (newPosition > 0) {
        // new element id, name
        newElement.id = `sqr${positionName}-${color}-btn`
        newElement.name = `${positionName}`

        // append child to the square
        // document.querySelector(sqrName).textContent = ''
        document.querySelector(sqrName).appendChild(newElement)

        // update btn details to the player free btns list
        playersFreeButtons[color][btnIndex].ending = newPosition
        playersFreeButtons[color][btnIndex].loop = 0
        playersFreeButtons[color][btnIndex].position = `${positionName}`
        console.log('playersFreeButtons:', playersFreeButtons[color][btnIndex])
      } else {
        // end reached
        changeEndButton()

        // update btn details to the player free btns list
        playersFreeButtons[color][btnIndex].ending = 0
        playersFreeButtons[color][btnIndex].loop = 0
        playersFreeButtons[color][btnIndex].position = `finidhed`
        console.log('playersFreeButtons:', playersFreeButtons[color][btnIndex])
      }
    } else {
      // check new position, update playersfreebuttons.loop
      let newPosition = (clickedBtn.target.name + diceNumber) % 52
      newPosition = newPosition == 0 ? 52 : newPosition
      let sqrName = `#sqr${newPosition}`

      // check if there is other btns in same square
      sorry = checkOtherBtns(sqrName)

      // new element id, name
      newElement.id = `sqr${newPosition}-${color}-btn`
      newElement.name = newPosition

      // append child to the square
      // document.querySelector(sqrName).textContent = ''
      document.querySelector(sqrName).appendChild(newElement)

      // update btn details to the player free btns list
      playersFreeButtons[color][btnIndex].loop = btnDetails.loop - diceNumber
      playersFreeButtons[color][btnIndex].position = newPosition
    }
  }
  return sorry
}

const checkOtherBtns = (sqrName) => {
  let sorry = { founded: false, color: '' }
  let tempSqr = document.querySelector(sqrName).children
  if (tempSqr.length) {
    let btnColor = tempSqr[0].id.split('-')[1]
    if (btnColor != color) {
      sorry.founded = true
      sorry.color = btnColor
      let homeSqr = document.querySelector(`.${btnColor}-home-token-btn`)
      homeSqr.classList.add(`${btnColor}-home-bg`)
      homeSqr.classList.remove(`${btnColor}-home-token-btn`)
      homeSqr.classList.remove('home-btns-token')
      document.querySelector(`.${tempSqr[0].id}`).remove()
    }
  }
  return sorry
}

const changeEndButton = () => {
  let endHomes = document.querySelector(`.${color}-end`)
  console.log(endHomes)
  endHomes.classList.remove(`${color}-end`)
  endHomes.classList.add(`${color}-end-bg`)
}

const checkForWinner = () => {
  let allEndBtns = document.querySelectorAll(`.${color}-end-bg`)
  if (allEndBtns.length == 4) {
    winner = true
  }
}

// switch turn to next player
const switchPlayerTurn = (sorry = '') => {
  if (diceNumber != 6) {
    if (sorry.founded) {
      updateMessage(
        `Sorry ${sorry.color} for kicking you out, it's my turn again`
      )
    } else {
      if (playersNumbers === 2) {
        turn = (turn + 2) % 4
      } else {
        turn = (turn + 1) % 4
      }
    }
  } else if (diceNumber == 6) {
    if (sorry.founded) {
      updateMessage(
        `Sorry ${sorry.color} for kicking you out, it's my turn again`
      )
    } else {
      updateMessage('meAgain')
    }
  }

  color = playersSequence[turn]
  dice.disabled = false
  gameMsg.className = `players-scores ${color}-status-bg`
  divDiceImage.className = `${color}-status-bg`
  console.log(color)
}

/*----------------------------- Event Listeners -----------------------------*/
dice.addEventListener('click', handlePlayerTurn)

playersNoBtn.addEventListener('click', initPlayers)
otherTurnBtn.addEventListener('click', initTurn)
newGameBtn.addEventListener('click', init)

init(2)
