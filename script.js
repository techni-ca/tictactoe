const domInteraction = (() => {
  const boardElement = document.querySelector('.board')
  const tokens = ['X', 'O']
  document.querySelector('.player0').querySelector('.token').textContent =
    tokens[0]
  document.querySelector('.player1').querySelector('.token').textContent =
    tokens[1]
  document.querySelectorAll('.token').forEach(query => {
    query.addEventListener('click', e => {
      tokenClick(e)
    })
  })
  document.querySelectorAll('.name').forEach(query => {
    query.addEventListener('click', e => {
      nameClick(e)
    })
  })
  function tokenClick (event) {
    const tokenIndex = event.target.parentElement.className.slice(-1)
    const oldToken = tokens[tokenIndex]
    const newToken = prompt('Change mark to what?', oldToken)
    if (
      newToken === null ||
      newToken.length !== 1 ||
      tokens.includes(newToken) ||
      newToken === ' '
    ) {
      return
    }
    tokens[tokenIndex] = newToken
    document
      .querySelector(`.player${tokenIndex}`)
      .querySelector('.token').textContent = newToken
    document.querySelectorAll('.marked').forEach(square => {
      if (square.textContent === oldToken) square.textContent = newToken
    })
    showCurrentPlayer(currentPlayer)
  }
  function nameClick (event) {
    const playerNo = event.target.parentElement.className.slice(-1)
    const oldName = players[playerNo].getName()
    const newName = prompt('Change name to what?', oldName)
    if (
      newName === null ||
      newName.length < 1 ||
      newName.length > 8
    ) {
      return
    }
    players[playerNo].setName(newName)
    document
      .querySelector(`.player${playerNo}`)
      .querySelector('.name').textContent = newName
    clickOff()
    players[currentPlayer].play()
  }
  function clickListener (event) {
    const classList = event.target.classList
    if (classList.contains('unmarked')) {
      clickOff()
      // prettier-ignore
      const row = classList.contains('top') ? 0 : classList.contains('bottom') ? 2 : 1
      // prettier-ignore
      const col = classList.contains('left') ? 0 : classList.contains('right') ? 2 : 1
      if (!board.placeMark({ row, col })) {
        players[1 - currentPlayer].play()
      }
    }
  }
  function getDiv (row, col) {
    return document.querySelector(
      ['.top', '.center', '.bottom'][row] + ['.left', '.middle', '.right'][col]
    )
  }
  function restart () {
    const winDiv = document.querySelector('.winner')
    winDiv.classList.add('hide')
    winDiv.classList.remove('show')
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const div = getDiv(i, j)
        div.classList.remove('win0')
        div.classList.remove('win1')
        div.classList.remove('marked')
        div.classList.add('hoverless')
        div.textContent = ''
      }
    }
    board.clear()
    firstPlayer = 1 - firstPlayer
    players[firstPlayer].play()
  }
  function displayMark (row, col) {
    const div = getDiv(row, col)
    div.textContent = tokens[currentPlayer]
    div.classList.remove('unmarked')
    div.classList.remove('hoverless')
    div.classList.add('marked')
  }
  function winRow (row) {
    for (let i = 0; i < 3; i++) {
      getDiv(row, i).classList.add(`win${currentPlayer}`)
    }
    gameWon()
  }
  function winCol (col) {
    for (let i = 0; i < 3; i++) {
      getDiv(i, col).classList.add(`win${currentPlayer}`)
    }
    gameWon()
  }
  function winDownDiag () {
    getDiv(0, 0).classList.add(`win${currentPlayer}`)
    getDiv(1, 1).classList.add(`win${currentPlayer}`)
    getDiv(2, 2).classList.add(`win${currentPlayer}`)
    gameWon()
  }
  function winUpDiag () {
    getDiv(2, 0).classList.add(`win${currentPlayer}`)
    getDiv(1, 1).classList.add(`win${currentPlayer}`)
    getDiv(0, 2).classList.add(`win${currentPlayer}`)
    gameWon()
  }
  function gameWon () {
    const unmarked = document.querySelectorAll('.unmarked')
    unmarked.forEach(div => {
      div.classList.remove('unmarked')
    })
  }
  function clickOn () {
    // change all hoverless to unmarked
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const div = getDiv(i, j)
        div.classList.replace('hoverless', 'unmarked')
      }
    }
    boardElement.addEventListener('click', clickListener)
  }
  function clickOff () {
    // change all unmarked to hoverless
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const div = getDiv(i, j)
        div.classList.replace('unmarked', 'hoverless')
      }
    }
    boardElement.removeEventListener('click', clickListener)
  }
  function showScore (playerNo, score) {
    document
      .querySelector(`.player${playerNo}`)
      .querySelector('.score').textContent = score
  }
  function showName (playerNo, name) {
    document
      .querySelector(`.player${playerNo}`)
      .querySelector('.name').textContent = name
  }

  function reportWinner (playerNo) {
    showCurrentPlayer(null)
    const winDiv = document.querySelector('.winner')
    const nameDiv = winDiv.firstElementChild
    if (playerNo === null) {
      nameDiv.textContent = 'NOBODY'
    } else {
      nameDiv.textContent = `${players[playerNo].getName()} (${tokens[playerNo]})`
    }
    winDiv.classList.remove('hide')
    winDiv.classList.add('show')
    document.querySelector('.restart').addEventListener('click', restart)
  }
  function showCurrentPlayer (playerNo) {
    const div = document.querySelector('.player')
    if (playerNo === null) {
      div.textContent = ''
    } else {
      div.textContent = `Current Player: ${players[playerNo].getName()} (${tokens[playerNo]})`
    }
  }

  return {
    displayMark,
    winRow,
    winCol,
    winDownDiag,
    winUpDiag,
    clickOn,
    showScore,
    showName,
    reportWinner,
    showCurrentPlayer,
    restart
  }
})()

const board = (() => {
  const state = [[], [], []]
  clear()
  function clear () {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        state[i][j] = null
      }
    }
  }
  function placeMark (move) {
    state[move.row][move.col] = currentPlayer
    domInteraction.displayMark(move.row, move.col)
    let gameWon = false
    if (winsRow(move)) {
      gameWon = true
      domInteraction.winRow(move.row)
    }
    if (winsCol(move)) {
      gameWon = true
      domInteraction.winCol(move.col)
    }
    if (winsDownDiag(move)) {
      gameWon = true
      domInteraction.winDownDiag()
    }
    if (winsUpDiag(move)) {
      gameWon = true
      domInteraction.winUpDiag()
    }
    if (gameWon) {
      domInteraction.reportWinner(currentPlayer)
      players[currentPlayer].win()
      return true
    }
    if (state.join().length === 17) {
      currentPlayer = null
      domInteraction.reportWinner(null)
      return true
    }
    return false
  }

  function winsCol (move, playerNo = currentPlayer) {
    for (let i = 0; i < 3; i++) {
      if (i !== move.row && state[i][move.col] !== playerNo) {
        return false
      }
    }
    return true
  }
  function winsRow (move, playerNo = currentPlayer) {
    for (let i = 0; i < 3; i++) {
      if (i !== move.col && state[move.row][i] !== playerNo) {
        return false
      }
    }
    return true
  }
  function winsDownDiag (move, playerNo = currentPlayer) {
    if (move.row !== move.col) return false
    for (let i = 0; i < 3; i++) {
      if (i !== move.row && state[i][i] !== playerNo) {
        return false
      }
    }
    return true
  }
  function winsUpDiag (move, playerNo = currentPlayer) {
    if (move.row + move.col !== 2) return false
    for (let i = 0; i < 3; i++) {
      if (i !== move.row && state[i][2 - i] !== playerNo) {
        return false
      }
    }
    return true
  }
  function isWinningMove (move, playerNo) {
    return (
      winsRow(move, playerNo) ||
      winsCol(move, playerNo) ||
      winsDownDiag(move, playerNo) ||
      winsUpDiag(move, playerNo)
    )
  }
  function findWinningMove (playerNo = currentPlayer) {
    const winningMoves = []
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (state[row][col] === null && isWinningMove({ row, col }, playerNo)) {
          winningMoves.push({ row, col })
        }
      }
    }
    if (winningMoves.length === 0) {
      return null
    }
    return winningMoves[Math.floor(Math.random() * winningMoves.length)]
  }
  function bestMove () {
    let nextMove = findWinningMove()

    if (nextMove === null) {
      nextMove = findWinningMove(1 - currentPlayer)
    }

    if (nextMove === null) {
      let row
      let col
      do {
        row = Math.floor(Math.random() * 3)
        col = Math.floor(Math.random() * 3)
      } while (state[row][col] !== null)
      nextMove = { row, col }
    }
    return nextMove
  }
  return Object.assign({
    placeMark,
    bestMove,
    clear
  })
})()

function player (playerNo, name) {
  let score = 0
  domInteraction.showName(playerNo, name)
  function win () {
    currentPlayer = null
    score++
    domInteraction.showScore(playerNo, score)
  }
  function setName (newName) {
    name = newName
  }
  function getName () {
    return name
  }
  function autoMove () {
    board.placeMark(board.bestMove())
    if (currentPlayer !== null) {
      players[1 - playerNo].play()
    }
  }
  function play () {
    currentPlayer = playerNo
    domInteraction.showCurrentPlayer(playerNo)
    if (name === 'COMPUTER') {
      setTimeout(function () {
        autoMove()
      }, 1000)
    } else {
      domInteraction.clickOn()
    }
  }
  return Object.assign({
    play,
    playerNo,
    win,
    getName,
    setName
  })
}

const players = [player(0, 'PLAYER'), player(1, 'COMPUTER')]

let currentPlayer
let firstPlayer = Math.floor(Math.random() * 2)
players[firstPlayer].play()
