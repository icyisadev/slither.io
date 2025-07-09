// Assume these are globally accessible or passed around
// For simplicity, I'm declaring them globally here for demonstration.
let mySnake = []; // Your array of snake objects
let FOOD = []; // Your array of food objects
let index = 0; // Your food index
let die = false; // Your game over flag
let minScore = 10; // Example minScore
let names = ["Player1", "Player2", "Player3"]; // Example names array
let gameCanvas;
let ctx;
let gameOverScreen;
let currentScoreDisplay;
let highScoreDisplay;
let playAgainButton;

let HIGH_SCORE = 0; // To store the high score

// Initialize your game elements (e.g., in a setup or init function)
function initializeGame() {
  gameCanvas = document.getElementById("gameCanvas");
  ctx = gameCanvas.getContext("2d");
  // Set canvas dimensions (adjust as needed for your game)
  gameCanvas.width = 800;
  gameCanvas.height = 600;

  gameOverScreen = document.getElementById("gameOverScreen");
  currentScoreDisplay = document.getElementById("currentScore");
  highScoreDisplay = document.getElementById("highScore");
  playAgainButton = document.getElementById("playAgainButton");

  playAgainButton.addEventListener("click", resetGame);

  // Load high score from localStorage (if available)
  if (localStorage.getItem("highScore")) {
    HIGH_SCORE = parseInt(localStorage.getItem("highScore"));
    highScoreDisplay.textContent = HIGH_SCORE;
  }

  resetGame(); // Start the game for the first time
}

// Dummy functions for demonstration (replace with your actual game logic)
function range(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function snake(name, gameRef, score, x, y) {
  this.name = name;
  this.gameRef = gameRef;
  this.score = score;
  this.size = 20; // Example size
  this.v = [{ x: x, y: y }]; // Example initial snake body part
  this.color = `hsl(${Math.random() * 360}, 70%, 50%)`; // Random color
  this.v.length = Math.max(1, Math.floor(score / 5)); // Initial length based on score
}

snake.prototype.draw = function () {
  this.v.forEach((segment) => {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(segment.x, segment.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
  });
};

snake.prototype.update = function () {
  // Simulate snake movement
  const head = { x: this.v[0].x, y: this.v[0].y };
  // Example movement (replace with your actual movement logic)
  head.x += (Math.random() - 0.5) * 5;
  head.y += (Math.random() - 0.5) * 5;
  this.v.unshift(head);
  if (this.v.length > Math.floor(this.score / 5) + 1) {
    this.v.pop();
  }
};

function food(gameRef, size, x, y) {
  this.gameRef = gameRef;
  this.size = size;
  this.x = x;
  this.y = y;
  this.value = 10; // Example food value
}

food.prototype.draw = function () {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
  ctx.fill();
};

function randomXY(max) {
  return Math.random() * max;
}
const XX = 800; // Example max X coordinate
const YY = 600; // Example max Y coordinate
function getSize() {
  return Math.max(XX, YY);
}

// Main game loop (simplified for demonstration)
function gameLoop() {
  if (die) {
    return; // Stop the loop if the game is over
  }

  // Clear canvas
  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  // Update and draw snakes
  mySnake.forEach((s) => {
    s.update();
    s.draw();
  });

  // Update and draw food
  FOOD.forEach((f) => {
    f.draw();
  });

  checkDie();

  requestAnimationFrame(gameLoop);
}

function checkDie() {
  for (let i = 0; i < mySnake.length; i++) {
    // Check for collisions with other snakes (excluding self-collision from mySnake[i].v.length)
    for (let j = 0; j < mySnake.length; j++) {
      if (i !== j) {
        let kt = true;
        for (let k = 0; k < mySnake[j].v.length; k++) {
          if (
            range(
              mySnake[i].v[0].x,
              mySnake[i].v[0].y,
              mySnake[j].v[k].x,
              mySnake[j].v[k].y
            ) < mySnake[i].size
          ) {
            kt = false;
            break; // No need to check further segments of this snake
          }
        }
        if (!kt) {
          for (let k = 0; k < mySnake[i].v.length; k += 5) {
            FOOD[index] = new food(
              this,
              this.getSize() / (2 + Math.random() * 2),
              mySnake[i].v[k].x + (Math.random() - 0.5) * mySnake[i].size, // Randomize food drop slightly
              mySnake[i].v[k].y + (Math.random() - 0.5) * mySnake[i].size
            );
            FOOD[index].value = 0.4 * mySnake[i].score / (mySnake[i].v.length / 5);
            index = (index + 1) % FOOD.length; // Use modulo for circular buffer
          }

          if (i !== 0) {
            mySnake[i] = new snake(
              names[Math.floor(Math.random() * names.length)],
              this,
              Math.max(
                Math.floor(mySnake[0].score > 10 * minScore ? mySnake[0].score / 10 : minScore),
                mySnake[i].score / 10
              ),
              this.randomXY(XX),
              this.randomXY(YY)
            );
          } else {
            handleGameOver(Math.floor(mySnake[i].score));
            return; 
          }
        }
      }
    }
  }
}

function handleGameOver(score) {
  die = true; 
  currentScoreDisplay.textContent = score;

  if (score > HIGH_SCORE) {
    HIGH_SCORE = score;
    localStorage.setItem("highScore", HIGH_SCORE); 
  }
  highScoreDisplay.textContent = HIGH_SCORE;

  gameOverScreen.style.display = "flex"; 
}

function resetGame() {
  die = false; // Reset the game over flag
  gameOverScreen.style.display = "none"; 

  mySnake = [];
  FOOD = [];
  index = 0;



  gameLoop();
}

document.addEventListener("DOMContentLoaded", initializeGame);