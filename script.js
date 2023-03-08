function markDisplay (row, col, xoro) {
  let elementClass = ''
  switch (row) {
    case 1:
      elementClass += '.top'
      break
    case 2:
      elementClass += '.center'
      break
    case 3:
      elementClass += '.bottom'
      break
  }
  switch (col) {
    case 1:
      elementClass += '.left'
      break
    case 2:
      elementClass += '.middle'
      break
    case 3:
      elementClass += '.right'
      break
  }

  const div = document.querySelector(elementClass)
  div.textContent = xoro
}
markDisplay(1, 1, 'X')
markDisplay(1, 2, 'O')
markDisplay(1, 3, 'X')
markDisplay(2, 1, 'O')
markDisplay(2, 2, 'X')
markDisplay(2, 3, 'O')
markDisplay(3, 1, 'X')
markDisplay(3, 2, 'O')
markDisplay(3, 3, 'X')
