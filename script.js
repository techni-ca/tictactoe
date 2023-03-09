function getDiv (row, col) {
  return document.querySelector(
    ['.top', '.center', '.bottom'][row] + ['.left', '.middle', '.right'][col]
  )
}
function markDisplay (row, col, mark) {
  const div = getDiv(row, col)
  div.textContent = mark
  div.classList.remove('unmarked')
  div.classList.add('marked')
  marks[row][col] = mark
}
function playerClicked (row, col) {
  markDisplay(row, col, playerMark)
  if (!checkForGameOver()) {
    computerPlay()
  }
}
function findWinningMove (mark) {
  const winningMoves = []
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (marks[row][col] === '') {
        // do all other squares on this row contain mark?
        let winningMove = true
        for (let i = 0; i < 3; i++) {
          if ((i !== row) && (marks[i][col] !== mark)) {
            winningMove = false
          }
        }
        // do all other squares on this col contain mark?
        if (winningMove === false) {
          winningMove = true
          for (let i = 0; i < 3; i++) {
            if ((i !== col) && (marks[row][i] !== mark)) {
              winningMove = false
            }
          }
        }
        // do all other squares on the down diagonal contain mark?
        if ((winningMove === false) && (row === col)) {
          winningMove = true
          for (let i = 0; i < 3; i++) {
            if ((i !== row) && (marks[i][i] !== mark)) {
              winningMove = false
            }
          }
        }
        // do all other squares on the up diagonal contain mark?
        if ((winningMove === false) && (row + col === 2)) {
          winningMove = true
          for (let i = 0; i < 3; i++) {
            if ((i !== row) && (marks[i][2 - i] !== mark)) {
              winningMove = false
            }
          }
        }
        if (winningMove) {
          winningMoves.push({ row, col })
        }
      }
    }
  }
  if (winningMoves.length === 0) {
    return null
  }
  return winningMoves[Math.floor(Math.random() * winningMoves.length)]
}
function computerPlay () {
  // needs better AI!
  let nextMove = findWinningMove(computerMark)
  if (nextMove === null) {
    nextMove = findWinningMove(playerMark)
  }
  if (nextMove === null) {
    let row
    let col
    do {
      row = Math.floor(Math.random() * 3)
      col = Math.floor(Math.random() * 3)
    } while (marks[row][col] !== '')
    markDisplay(row, col, computerMark)
  } else {
    markDisplay(nextMove.row, nextMove.col, computerMark)
  }
  checkForGameOver()
}
function markWon (row, col, winner) {
  getDiv(row, col).classList.add(`win${winner}`)
}
function checkSame (a, b, c) {
  return a === b && a === c ? a : ''
}
function checkRow (n) {
  const winner = checkSame(marks[n][0], marks[n][1], marks[n][2])
  if (winner !== '') {
    for (let i = 0; i < 3; i++) {
      markWon(n, i, winner)
    }
  }
  return winner
}
function checkCol (n) {
  const winner = checkSame(marks[0][n], marks[1][n], marks[2][n])
  if (winner !== '') {
    for (let i = 0; i < 3; i++) {
      markWon(i, n, winner)
    }
  }
  return winner
}
function checkDiagonalDown () {
  const winner = checkSame(marks[0][0], marks[1][1], marks[2][2])
  if (winner !== '') {
    for (let i = 0; i < 3; i++) {
      markWon(i, i, winner)
    }
  }
  return winner
}
function checkDiagonalUp () {
  const winner = checkSame(marks[0][2], marks[1][1], marks[2][0])
  if (winner !== '') {
    for (let i = 0; i < 3; i++) {
      markWon(i, 2 - i, winner)
    }
  }
  return winner
}
function checkForGameOver () {
  // check for a winner
  let winner = checkDiagonalDown() + checkDiagonalUp()
  for (let i = 0; i < 3; i++) {
    winner += checkRow(i) + checkCol(i)
  }
  if (winner !== '') {
    const winDiv = document.querySelector('.winner')
    const nameDiv = winDiv.firstElementChild
    switch (winner[0]) {
      case computerMark:
        nameDiv.textContent = 'COMPUTER'
        break
      case playerMark:
        nameDiv.textContent = 'PLAYER'
        break
    }
    winDiv.classList.remove('hide')
    winDiv.classList.add('show')
    score[winner[0]]++
    updateScores()
    // make the board unreactive
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (marks[i][j] === '') {
          markDisplay(i, j, ' ')
        }
      }
    }
    return true
  }

  // check for full board
  const boardFull = marks.join().length === 17
  if (boardFull) {
    const winDiv = document.querySelector('.winner')
    winDiv.firstElementChild.textContent = 'NOBODY'
    winDiv.classList.remove('hide')
    winDiv.classList.add('show')
  }
  return boardFull
}
function updateScores () {
  const playerScore = document.querySelector('.player').querySelector('.score')
  const computerScore = document
    .querySelector('.computer')
    .querySelector('.score')
  playerScore.textContent = score[playerMark]
  computerScore.textContent = score[computerMark]
}
const marks = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
]
const playerMark = 'X'
const computerMark = 'O'
const score = []
score[playerMark] = 0
score[computerMark] = 0
let computerStarted = Math.floor(Math.random() * 2) === 0
if (computerStarted) computerPlay()

const board = document.querySelector('.board')
board.addEventListener('click', e => {
  const classList = e.target.classList
  if (classList.contains('unmarked')) {
    /* eslint-disable */
    const row = classList.contains('top')
      ? 0
      : classList.contains('bottom')
      ? 2
      : 1
    const col = classList.contains('left')
      ? 0
      : classList.contains('right')
      ? 2
      : 1
    /* eslint-enable */
    playerClicked(row, col)
  }
})
const restart = document.querySelector('.restart')
restart.addEventListener('click', e => {
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
      marks[i][j] = ''
    }
  }
  computerStarted = !computerStarted
  if (computerStarted) computerPlay()
})
