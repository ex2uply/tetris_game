const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const nextCanvas = document.getElementById("next-piece");
const nextCtx = nextCanvas.getContext("2d");

// UI Elements
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const linesElement = document.getElementById("lines");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");

const BLOCK_SIZE = 30;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Game state
let board = Array(BOARD_HEIGHT)
  .fill()
  .map(() => Array(BOARD_WIDTH).fill(0));
let currentPiece = null;
let nextPiece = null;
let score = 0;
let level = 1;
let lines = 0;
let gameRunning = false;
let gamePaused = false;
let gameInterval = null;

// Tetromino shapes and colors
const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  L: [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  J: [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
};

const COLORS = {
  I: "#00f0f0",
  O: "#f0f000",
  T: "#a000f0",
  L: "#f0a000",
  J: "#0000f0",
  S: "#00f000",
  Z: "#f00000",
};

class Piece {
  constructor(shape, color) {
    this.shape = shape;
    this.color = color;
    this.x = Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2);
    this.y = 0;
  }
}

function createNewPiece() {
  const shapes = Object.keys(SHAPES);
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  return new Piece(SHAPES[randomShape], COLORS[randomShape]);
}

function drawBoard() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid lines
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;

  for (let x = 0; x <= BOARD_WIDTH; x++) {
    ctx.beginPath();
    ctx.moveTo(x * BLOCK_SIZE, 0);
    ctx.lineTo(x * BLOCK_SIZE, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= BOARD_HEIGHT; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * BLOCK_SIZE);
    ctx.lineTo(canvas.width, y * BLOCK_SIZE);
    ctx.stroke();
  }

  // Draw placed pieces
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board[y][x]) {
        drawBlock(ctx, x * BLOCK_SIZE, y * BLOCK_SIZE, board[y][x]);
      }
    }
  }
}

function drawBlock(context, x, y, color) {
  // Draw minimal 2D block
  context.fillStyle = color;
  context.fillRect(x + 1, y + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
}

function adjustBrightness(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

function drawPiece() {
  if (!currentPiece) return;

  currentPiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        drawBlock(
          ctx,
          (currentPiece.x + x) * BLOCK_SIZE,
          (currentPiece.y + y) * BLOCK_SIZE,
          currentPiece.color
        );
      }
    });
  });
}

function drawNextPiece() {
  if (!nextPiece) return;

  nextCtx.fillStyle = "#000";
  nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

  const blockSize = 20;
  const offsetX =
    (nextCanvas.width - nextPiece.shape[0].length * blockSize) / 2;
  const offsetY = (nextCanvas.height - nextPiece.shape.length * blockSize) / 2;

  nextPiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        drawBlock(
          nextCtx,
          offsetX + x * blockSize,
          offsetY + y * blockSize,
          nextPiece.color
        );
      }
    });
  });
}

function isValidMove(piece, newX, newY) {
  return piece.shape.every((row, dy) => {
    return row.every((value, dx) => {
      let nextX = newX + dx;
      let nextY = newY + dy;
      return (
        value === 0 ||
        (nextX >= 0 &&
          nextX < BOARD_WIDTH &&
          nextY >= 0 &&
          nextY < BOARD_HEIGHT &&
          !board[nextY][nextX])
      );
    });
  });
}

function rotatePiece() {
  if (!currentPiece) return;

  const newShape = currentPiece.shape[0].map((_, i) =>
    currentPiece.shape.map((row) => row[i]).reverse()
  );

  if (
    isValidMove(
      { ...currentPiece, shape: newShape },
      currentPiece.x,
      currentPiece.y
    )
  ) {
    currentPiece.shape = newShape;
  }
}

function mergePiece() {
  if (!currentPiece) return;

  currentPiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
      }
    });
  });
}

function clearLines() {
  let linesCleared = 0;

  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (board[y].every((cell) => cell !== 0)) {
      board.splice(y, 1);
      board.unshift(Array(BOARD_WIDTH).fill(0));
      linesCleared++;
      y++;
    }
  }

  if (linesCleared > 0) {
    lines += linesCleared;
    score += linesCleared * 100 * level;
    level = Math.floor(lines / 10) + 1;

    updateUI();
  }
}

function updateUI() {
  scoreElement.textContent = score.toLocaleString();
  levelElement.textContent = level;
  linesElement.textContent = lines;
}

function gameOver() {
  gameRunning = false;
  clearInterval(gameInterval);

  // Create game over overlay
  const overlay = document.createElement("div");
  overlay.className = "game-over";
  overlay.innerHTML = `
        <div class="game-over-content">
            <h2>Game Over!</h2>
            <p>Final Score: ${score.toLocaleString()}</p>
            <p>Level: ${level}</p>
            <p>Lines: ${lines}</p>
            <button class="btn btn-primary" onclick="resetGame()">Play Again</button>
        </div>
    `;
  document.body.appendChild(overlay);
}

function resetGame() {
  // Remove game over overlay if exists
  const overlay = document.querySelector(".game-over");
  if (overlay) {
    overlay.remove();
  }

  board = Array(BOARD_HEIGHT)
    .fill()
    .map(() => Array(BOARD_WIDTH).fill(0));
  score = 0;
  level = 1;
  lines = 0;
  gameRunning = false;
  gamePaused = false;

  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }

  currentPiece = null;
  nextPiece = null;

  updateUI();
  drawBoard();
  drawNextPiece();

  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  gamePaused = false;

  if (!currentPiece) {
    currentPiece = createNewPiece();
    nextPiece = createNewPiece();
  }

  gameInterval = setInterval(update, Math.max(100, 1000 - (level - 1) * 50));

  startBtn.disabled = true;
  pauseBtn.disabled = false;
}

function pauseGame() {
  if (!gameRunning) return;

  if (gamePaused) {
    gamePaused = false;
    gameInterval = setInterval(update, Math.max(100, 1000 - (level - 1) * 50));
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
  } else {
    gamePaused = true;
    clearInterval(gameInterval);
    pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
  }
}

function update() {
  if (!gameRunning || gamePaused) return;

  if (isValidMove(currentPiece, currentPiece.x, currentPiece.y + 1)) {
    currentPiece.y++;
  } else {
    mergePiece();
    clearLines();
    currentPiece = nextPiece;
    nextPiece = createNewPiece();

    if (!isValidMove(currentPiece, currentPiece.x, currentPiece.y)) {
      gameOver();
      return;
    }
  }

  drawBoard();
  drawPiece();
  drawNextPiece();
}

// Event Listeners
document.addEventListener("keydown", (event) => {
  // Prevent default behavior for game keys to avoid scrolling
  if (
    ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "q", "e"].includes(
      event.key
    )
  ) {
    event.preventDefault();
  }

  if (!gameRunning || gamePaused) return;

  switch (event.key) {
    case "ArrowLeft":
      if (isValidMove(currentPiece, currentPiece.x - 1, currentPiece.y)) {
        currentPiece.x--;
      }
      break;
    case "ArrowRight":
      if (isValidMove(currentPiece, currentPiece.x + 1, currentPiece.y)) {
        currentPiece.x++;
      }
      break;
    case "ArrowDown":
      if (isValidMove(currentPiece, currentPiece.x, currentPiece.y + 1)) {
        currentPiece.y++;
        score += 1;
        updateUI();
      }
      break;
    case " ":
      while (isValidMove(currentPiece, currentPiece.x, currentPiece.y + 1)) {
        currentPiece.y++;
        score += 2;
      }
      update();
      break;
    case "ArrowUp":
    case "q":
    case "e":
      rotatePiece();
      break;
  }
  drawBoard();
  drawPiece();
});

// Button event listeners
startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);
resetBtn.addEventListener("click", resetGame);

// Initialize game
function initGame() {
  updateUI();
  drawBoard();
  drawNextPiece();
  pauseBtn.disabled = true;
}

// Start the game when page loads
window.addEventListener("load", initGame);
