const domInteraction = (() => {
  const boardElement = document.querySelector('.board')
  function clickListener (event) {
    const classList = event.target.classList
    if (classList.contains('unmarked')) {
      clickOff()
      // prettier-ignore
      const row = classList.contains('top') ? 0 : classList.contains('bottom') ? 2 : 1
      // prettier-ignore
      const col = classList.contains('left') ? 0 : classList.contains('right') ? 2 : 1
      if (!board.placeMark({ row, col, token: currentPlayer })) {
        if (nextPlayer !== null) players[nextPlayer].play()
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
        div.classList.remove('winX')
        div.classList.remove('winO')
        div.classList.remove('marked')
        div.classList.add('unmarked')
        div.textContent = ''
      }
    }
    board.clear()
    firstPlayer = (firstPlayer === 'X') ? 'O' : 'X'
    players[firstPlayer].play()
  }
  function displayMark (move) {
    const div = getDiv(move.row, move.col)
    div.textContent = move.token
    div.classList.remove('unmarked')
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
    boardElement.addEventListener('click', clickListener)
  }
  function clickOff () {
    boardElement.removeEventListener('click', clickListener)
  }
  function showScore (name, score) {
    if (name === 'PLAYER') {
      const playerScore = document
        .querySelector('.player')
        .querySelector('.score')
      playerScore.textContent = score
    } else {
      const computerScore = document
        .querySelector('.computer')
        .querySelector('.score')
      computerScore.textContent = score
    }
  }
  function reportWinner (token) {
    const winDiv = document.querySelector('.winner')
    const nameDiv = winDiv.firstElementChild
    if (token === null) {
      nameDiv.textContent = 'NOBODY'
    } else {
      nameDiv.textContent = players[token].name
    }
    winDiv.classList.remove('hide')
    winDiv.classList.add('show')
    document.querySelector('.restart').addEventListener('click', restart)
  }
  return {
    displayMark,
    winRow,
    winCol,
    winDownDiag,
    winUpDiag,
    clickOn,
    showScore,
    reportWinner,
    restart
  }
})()

const board = (() => {
  const state = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
  function clear () {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        state[i][j] = ''
      }
    }
  }
  function placeMark (move) {
    state[move.row][move.col] = move.token
    domInteraction.displayMark(move)
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
      players[move.token].win()
      domInteraction.reportWinner(move.token)
      return true
    }
    if (state.join().length === 17) {
      nextPlayer = null
      domInteraction.reportWinner(null)
      return true
    }
    return false
  }

  function winsCol (move) {
    for (let i = 0; i < 3; i++) {
      if (i !== move.row && state[i][move.col] !== move.token) {
        return false
      }
    }
    return true
  }
  function winsRow (move) {
    for (let i = 0; i < 3; i++) {
      if (i !== move.col && state[move.row][i] !== move.token) {
        return false
      }
    }
    return true
  }
  function winsDownDiag (move) {
    if (move.row !== move.col) return false
    for (let i = 0; i < 3; i++) {
      if (i !== move.row && state[i][i] !== move.token) {
        return false
      }
    }
    return true
  }
  function winsUpDiag (move) {
    if (move.row + move.col !== 2) return false
    for (let i = 0; i < 3; i++) {
      if (i !== move.row && state[i][2 - i] !== move.token) {
        return false
      }
    }
    return true
  }
  function isWinningMove (move) {
    return (
      winsRow(move) || winsCol(move) || winsDownDiag(move) || winsUpDiag(move)
    )
  }
  function findWinningMove (token) {
    const winningMoves = []
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (state[row][col] === '' && isWinningMove({ row, col, token })) {
          winningMoves.push({ row, col, token })
        }
      }
    }
    if (winningMoves.length === 0) {
      return null
    }
    return winningMoves[Math.floor(Math.random() * winningMoves.length)]
  }
  function bestMove (forToken, againstToken) {
    let nextMove = findWinningMove(forToken)

    if (nextMove === null) {
      nextMove = findWinningMove(againstToken)
      if (nextMove !== null) {
        nextMove.token = forToken
      }
    }

    if (nextMove === null) {
      let row
      let col
      do {
        row = Math.floor(Math.random() * 3)
        col = Math.floor(Math.random() * 3)
      } while (state[row][col] !== '')
      nextMove = { row, col, token: forToken }
    }
    return nextMove
  }
  return Object.assign({
    placeMark,
    bestMove,
    clear
  })
})()

function player (name, token, enemyToken) {
  let score = 0
  function win () {
    nextPlayer = null
    score++
    domInteraction.showScore(name, score)
  }
  function autoMove () {
    board.placeMark(board.bestMove(token, enemyToken))
    console.log()
    if (nextPlayer !== null) players[nextPlayer].play()
  }
  function play () {
    currentPlayer = token
    nextPlayer = enemyToken
    if (name === 'COMPUTER') {
      autoMove()
    } else {
      autoMove()
      // domInteraction.clickOn()
    }
  }
  return Object.assign({
    play,
    token,
    win,
    name,
    autoMove
  })
}

const players = {
  X: player('PLAYER', 'X', 'O'),
  O: player('COMPUTER', 'O', 'X')
}
let nextPlayer
let currentPlayer
let firstPlayer = (Math.random < 0.5) ? 'X' : 'O'
players[firstPlayer].play()
