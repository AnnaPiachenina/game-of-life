let grid;
let isRunning = false;

function startGame(initialGrid) {
  grid = initialGrid;
  isRunning = true;
  runGame();
}

function stopGame() {
  isRunning = false;
}

function runGame() {
  if (!isRunning) return;

  const newGrid = grid.map(row => [...row]);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const neighbors = countNeighbors(i, j);
      if (grid[i][j]) {
        newGrid[i][j] = neighbors === 2 || neighbors === 3;
      } else {
        newGrid[i][j] = neighbors === 3;
      }
    }
  }

  postMessage({ type: 'update', grid: newGrid });
  grid = newGrid;
  setTimeout(runGame, 100);
}

function countNeighbors(row, col) {
  const neighborsOffsets = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  return neighborsOffsets.reduce((count, [offsetRow, offsetCol]) => {
    const newRow = row + offsetRow;
    const newCol = col + offsetCol;

    if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
      return count + (grid[newRow][newCol] ? 1 : 0);
    }

    return count;
  }, 0);
}

onmessage = (event) => {
  const { type, grid } = event.data;

  switch (type) {
    case 'start':
      startGame(grid);
      break;
    case 'stop':
      stopGame();
      break;
    default:
      break;
  }
};
