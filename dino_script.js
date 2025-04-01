const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const dino = {
  x: 50,
  y: 150,
  width: 40,
  height: 60,
  jumping: false,
  jumpHeight: 100,
  jumpCount: 0,
};

const cactus = {
  x: canvas.width,
  y: 150,
  width: 30,
  height: 50,
  speed: 5,
};

let score = 0;
let gameLoop;
let gameStarted = false;

function drawDino() {
  ctx.fillStyle = "green";
  ctx.fillRect(dino.x, dino.y - dino.height, dino.width, dino.height);
}

function drawCactus() {
  ctx.fillStyle = "red";
  ctx.fillRect(cactus.x, cactus.y - cactus.height, cactus.width, cactus.height);
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function drawStartScreen() {
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText(
    "Press Space to Start",
    canvas.width / 2 - 120,
    canvas.height / 2
  );
}

function jump() {
  if (!dino.jumping) {
    dino.jumping = true;
    dino.jumpCount = 0;
  }
}

function update() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update dino position
  if (dino.jumping) {
    dino.jumpCount++;
    if (dino.jumpCount < 15) {
      dino.y -= 5;
    } else if (dino.jumpCount < 30) {
      dino.y += 5;
    } else {
      dino.jumping = false;
      dino.y = 150;
    }
  }

  // Update cactus position
  cactus.x -= cactus.speed;
  if (cactus.x < -cactus.width) {
    cactus.x = canvas.width;
    score++;
  }

  // Check collision
  if (
    dino.x < cactus.x + cactus.width &&
    dino.x + dino.width > cactus.x &&
    dino.y > cactus.y - cactus.height
  ) {
    gameOver();
  }

  // Draw game objects
  drawDino();
  drawCactus();
  drawScore();
}

function gameOver() {
  cancelAnimationFrame(gameLoop);
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText(
    `Game Over! Score: ${score}`,
    canvas.width / 2 - 100,
    canvas.height / 2
  );
  ctx.font = "20px Arial";
  ctx.fillText(
    "Press Space to Restart",
    canvas.width / 2 - 80,
    canvas.height / 2 + 40
  );
  gameStarted = false;
}

function gameLoopFunction() {
  update();
  gameLoop = requestAnimationFrame(gameLoopFunction);
}

function startGame() {
  gameStarted = true;
  score = 0;
  cactus.x = canvas.width;
  gameLoopFunction();
}

// Event listeners
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    if (!gameStarted) {
      startGame();
    } else {
      jump();
    }
  }
});

// Initial draw of start screen
drawStartScreen();
