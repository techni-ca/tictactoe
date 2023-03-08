function getDiv (row, col) {
  let elementClass = ''
  switch (row) {
    case 0:
      elementClass += '.top'
      break
    case 1:
      elementClass += '.center'
      break
    case 2:
      elementClass += '.bottom'
      break
  }
  switch (col) {
    case 0:
      elementClass += '.left'
      break
    case 1:
      elementClass += '.middle'
      break
    case 2:
      elementClass += '.right'
      break
  }
  const div = document.querySelector(elementClass)
  return div
}
function getRow (div) {
  if (div.classList.contains('top')) return 0
  if (div.classList.contains('center')) return 1
  if (div.classList.contains('bottom')) return 2
}
function getCol (div) {
  if (div.classList.contains('left')) return 0
  if (div.classList.contains('middle')) return 1
  if (div.classList.contains('right')) return 2
}
function markDisplay (div, xoro) {
  div.textContent = xoro
  div.classList.toggle('unmarked')
}
function playerClicked (div) {
  if (div.classList.contains('unmarked')) {
    markDisplay(div, 'O')
    marked++
    marks[getRow(div)][getCol(div)] = 'O'
    checkForWin()
    computerPlay()
  }
}
function computerPlay () {
  while (marked < 9) {
    const row = Math.floor(Math.random() * 3)
    const col = Math.floor(Math.random() * 3)
    if (marks[row][col] === '') {
      markDisplay(getDiv(row, col), 'X')
      marked++
      marks[row][col] = 'X'
      checkForWin()
      return
    }
  }
}
function checkSame (a, b, c) {
  if (a === b && a === c) {
    return a
  }
  return ''
}
function checkRow (n) {
  const returnValue = checkSame(marks[n][0], marks[n][1], marks[n][2])
  if (returnValue !== '') {
    for (let i = 0; i < 3; i++) {
      const div = getDiv(n, i)
      div.classList.add(`win${returnValue}`)
    }
  }
  return returnValue
}
function checkCol (n) {
  const returnValue = checkSame(marks[0][n], marks[1][n], marks[2][n])
  if (returnValue !== '') {
    for (let i = 0; i < 3; i++) {
      const div = getDiv(i, n)
      div.classList.add(`win${returnValue}`)
    }
  }
  return returnValue
}
function checkD1 () {
  const returnValue = checkSame(marks[0][0], marks[1][1], marks[2][2])
  if (returnValue !== '') {
    getDiv(0, 0).classList.add(`win${returnValue}`)
    getDiv(1, 1).classList.add(`win${returnValue}`)
    getDiv(2, 2).classList.add(`win${returnValue}`)
  }
  return returnValue
}
function checkD2 () {
  const returnValue = checkSame(marks[0][2], marks[1][1], marks[2][0])
  if (returnValue !== '') {
    getDiv(0, 2).classList.add(`win${returnValue}`)
    getDiv(1, 1).classList.add(`win${returnValue}`)
    getDiv(2, 0).classList.add(`win${returnValue}`)
  }
  return returnValue
}
function checkForWin () {
  let winner = ''
  let rowwin = ''
  let colwin = ''
  for (let i = 0; i < 3; i++) {
    if (rowwin === '') rowwin = checkRow(i)
    if (colwin === '') colwin = checkCol(i)
  }
  const d1win = checkD1()
  const d2win = checkD2()

  winner = rowwin
  if (winner === '') winner = colwin
  if (winner === '') winner = d1win
  if (winner === '') winner = d2win

  if (winner !== '') {
    console.log(`${winner} wins`)
  } else if (marked === 9) {
    console.log("cat's game")
  } else {
    return
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (marks[i][j] === '') {
        markDisplay(getDiv(i, j), ' ')
        marks[i][j] = ' '
      }
    }
  }
  marked = 9
}
const marks = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
]
let marked = 0

if (Math.floor(Math.random() * 2) === 0) computerPlay()

const board = document.querySelector('.board')
board.addEventListener('click', e => {
  playerClicked(e.target)
})
