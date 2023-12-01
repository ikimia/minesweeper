const gameElement = document.getElementById("game");
const boardElement = document.createElement("div");
boardElement.id = "board";
gameElement.appendChild(boardElement);
const gameOverElement = document.createElement("div");
gameOverElement.id = "gameOver";
boardElement.appendChild(gameOverElement);

const rows = 8;
const columns = 6;
const minesCount = 10;

let numbersUncovered = 0;
let flagsUncovered = 0;
let mineIndexes = new Set();

function initGame() {
  numbersUncovered = 0;
  flagsUncovered = 0;
  mineIndexes = new Set();
  while (mineIndexes.size < minesCount) {
    mineIndexes.add(Math.floor(Math.random() * rows * columns));
  }
}

function checkWin() {
  if (
    flagsUncovered === minesCount &&
    numbersUncovered + flagsUncovered === rows * columns
  ) {
    gameOverElement.classList.add("win");
  }
}

function countSurroundingMines(i) {
  const currentRow = Math.floor(i / columns);
  const currentColumn = i % columns;
  let surroundingMinesCount = 0;
  for (let r = currentRow - 1; r <= currentRow + 1; r++) {
    if (r === -1 || r === rows) continue;
    for (let c = currentColumn - 1; c <= currentColumn + 1; c++) {
      if (c === -1 || c === columns) continue;
      const inspectedIndex = r * columns + c;
      if (mineIndexes.has(inspectedIndex)) {
        surroundingMinesCount += 1;
      }
    }
  }
  return surroundingMinesCount;
}

function addEventListeners(squareElement, i) {
  let timeoutHandler = -1;
  squareElement.addEventListener("pointerdown", () => {
    if (
      squareElement.classList.contains("mine") ||
      squareElement.dataset.count != null
    )
      return;
    squareElement.classList.add("active");
    timeoutHandler = setTimeout(() => {
      squareElement.classList.remove("active");
      squareElement.classList.add("flag");
      flagsUncovered += 1;
      checkWin();
    }, 500);
  });
  squareElement.addEventListener("pointerout", () => {
    if (!squareElement.classList.contains("active")) return;
    squareElement.classList.remove("active");
    clearTimeout(timeoutHandler);
  });
  squareElement.addEventListener("pointerup", () => {
    if (!squareElement.classList.contains("active")) return;
    squareElement.classList.remove("active");
    clearTimeout(timeoutHandler);
    if (squareElement.classList.contains("flag")) {
      squareElement.classList.remove("flag");
      flagsUncovered -= 1;
      return;
    }
    if (mineIndexes.has(i)) {
      squareElement.classList.add("mine");
      gameOverElement.classList.add("lose");
      return;
    }
    squareElement.dataset.count = countSurroundingMines(i);
    numbersUncovered += 1;
    checkWin();
  });
}

const squareElements = [];
for (let i = 0; i < rows * columns; i++) {
  const squareElement = document.createElement("div");
  squareElement.classList.add("square");
  addEventListeners(squareElement, i);
  squareElement.style.gridRow = Math.floor(i / columns) + 1;
  squareElement.style.gridColumn = (i % columns) + 1;
  squareElements.push(squareElement);
}
boardElement.append(...squareElements);

boardElement.style.gridTemplateRows = `repeat(${rows}, auto)`;
boardElement.style.gridTemplateColumns = `repeat(${columns}, auto)`;

gameOverElement.addEventListener("click", () => {
  document.querySelectorAll(".square").forEach((square) => {
    delete square.dataset.count;
    square.classList.remove("mine", "flag");
    initGame();
    gameOverElement.classList.remove("win", "lose");
  });
});

initGame();
