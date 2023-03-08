function getDiv (row, col) {
  return document.querySelector(
    ['.top', '.center', '.bottom'][row] + ['.left', '.middle', '.right'][col]
  )
}
function markDisplay (row, col, mark) {
  const div = getDiv(row, col)
  div.textContent = mark
  div.classList.remove('unmarked')
  marks[row][col] = mark
}
function playerClicked (row, col) {
  markDisplay(row, col, playerMark)
  if (!checkForGameOver()) {
    computerPlay()
  }
}
function computerPlay () {
  // needs better AI!
  let row = 1
  let col = 1
  while (marks[row][col] !== '') {
    row = Math.floor(Math.random() * 3)
    col = Math.floor(Math.random() * 3)
  }
  markDisplay(row, col, computerMark)
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
    winner = winner[0]
    switch (winner) {
      case computerMark:
        console.log('Computer Wins')
        break
      case playerMark:
        console.log('Player Wins')
        break
    }
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
    console.log('Drawn Game')
  }
  return boardFull
}
const marks = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
]
const playerMark = 'X'
const computerMark = 'O'

if (Math.floor(Math.random() * 2) === 0) computerPlay()

const board = document.querySelector('.board')
board.addEventListener('click', e => {
  const classList = e.target.classList
  if (classList.contains('unmarked')) {
    const row = classList.contains('top') ? 0 : classList.contains('bottom') ? 2 : 1
    const col = classList.contains('left') ? 0 : classList.contains('right') ? 2 : 1
    playerClicked(row, col)
  }
})
