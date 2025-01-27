const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const BLOCK_SIZE = 30;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Tetromino shapes and colors
const SHAPES = {
    I: [[1, 1, 1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1]],
    L: [[1, 0], [1, 0], [1, 1]],
    J: [[0, 1], [0, 1], [1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]]
};

const COLORS = {
    I: '#00f0f0',
    O: '#f0f000',
    T: '#a000f0',
    L: '#f0a000',
    J: '#0000f0',
    S: '#00f000',
    Z: '#f00000'
};

let board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
let currentPiece = null;
let score = 0;

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
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board[y][x]) {
                ctx.fillStyle = board[y][x];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
            }
        }
    }
}

function drawPiece() {
    ctx.fillStyle = currentPiece.color;
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                ctx.fillRect(
                    (currentPiece.x + x) * BLOCK_SIZE,
                    (currentPiece.y + y) * BLOCK_SIZE,
                    BLOCK_SIZE - 1,
                    BLOCK_SIZE - 1
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
    const newShape = currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map(row => row[i]).reverse()
    );

    if (isValidMove({ ...currentPiece, shape: newShape }, currentPiece.x, currentPiece.y)) {
        currentPiece.shape = newShape;
    }
}

function mergePiece() {
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
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(BOARD_WIDTH).fill(0));
            linesCleared++;
            y++;
        }
    }

    if (linesCleared > 0) {
        score += linesCleared * 100;
        scoreElement.textContent = score;
    }
}

function gameOver() {
    alert(`Game Over! Score: ${score}`);
    board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
    score = 0;
    scoreElement.textContent = score;
    startGame();
}

function update() {
    if (isValidMove(currentPiece, currentPiece.x, currentPiece.y + 1)) {
        currentPiece.y++;
    } else {
        mergePiece();
        clearLines();
        currentPiece = createNewPiece();

        if (!isValidMove(currentPiece, currentPiece.x, currentPiece.y)) {
            gameOver();
        }
    }

    drawBoard();
    drawPiece();
}

document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowLeft':
            if (isValidMove(currentPiece, currentPiece.x - 1, currentPiece.y)) {
                currentPiece.x--;
            }
            break;
        case 'ArrowRight':
            if (isValidMove(currentPiece, currentPiece.x + 1, currentPiece.y)) {
                currentPiece.x++;
            }
            break;
        case 'ArrowDown':
            if (isValidMove(currentPiece, currentPiece.x, currentPiece.y + 1)) {
                currentPiece.y++;
            }
            break;
        case ' ':
            while (isValidMove(currentPiece, currentPiece.x, currentPiece.y + 1)) {
                currentPiece.y++;
            }
            update();
            break;
        case 'ArrowUp':
        case 'q':
        case 'e':
            rotatePiece();
            break;
    }
    drawBoard();
    drawPiece();
});

function startGame() {
    currentPiece = createNewPiece();
    setInterval(update, 1000);
}

startGame();
