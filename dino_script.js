// Dino Game with Extension Features
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let dino = {
  x: 50,
  y: 260,
  width: 40,
  height: 40,
  velocityY: 0,
  gravity: 0.9,
  isJumping: false,
  isInvincible: false,
  jumpTimer: 0,
};

let score = 0;
let obstacles = [];
let powerUps = [];
let gameSpeed = 5;
let frameCount = 0;
let lastObstacleX = 0;

let isGameOver = false;
let nightMode = false;
let jumpPressed = false;

const MAX_JUMP_TIME = 5;

const dinoImage = new Image();
dinoImage.src =
  "https://upload.wikimedia.org/wikipedia/commons/3/3b/Chromium_T-Rex-error-offline.svg";

const birdImage = new Image();
birdImage.src = "https://cdn-icons-png.flaticon.com/512/616/616408.png";

const cactusImage = new Image();
cactusImage.src = "https://cdn-icons-png.flaticon.com/512/1362/1362336.png";

const rockImage = new Image();
rockImage.src = "https://cdn-icons-png.flaticon.com/512/7053/7053536.png";

const starImage = new Image();
starImage.src = "https://cdn-icons-png.flaticon.com/512/1828/1828884.png";

function spawnObstacle() {
  const minDistance = 100;

  if (
    obstacles.length > 0 &&
    obstacles[obstacles.length - 1].x > canvas.width - minDistance
  ) {
    return;
  }

  const type = Math.random();
  let newObstacle;

  if (type < 0.4) {
    newObstacle = {
      x: canvas.width,
      y: 270,
      width: 30,
      height: 30,
      type: "cactus",
    };
  } else if (type < 0.7) {
    newObstacle = {
      x: canvas.width,
      y: 200,
      width: 40,
      height: 40,
      type: "bird",
    };
  } else {
    newObstacle = {
      x: canvas.width,
      y: 260,
      width: 50,
      height: 40,
      type: "rock",
    };
  }

  obstacles.push(newObstacle);
  lastObstacleX = newObstacle.x;
}

function spawnPowerUp() {
  powerUps.push({
    x: canvas.width,
    y: 200,
    width: 30,
    height: 30,
    type: "star",
  });
}

function update() {
  if (isGameOver) return;

  frameCount++;
  score += 1;

  if (score % 100 === 0) gameSpeed += 0.5;

  if (jumpPressed && dino.isJumping && dino.jumpTimer < MAX_JUMP_TIME) {
    dino.velocityY = -10;
    dino.jumpTimer++;
  }

  dino.velocityY += dino.gravity;
  dino.y += dino.velocityY;

  if (dino.y >= 260) {
    dino.y = 260;
    dino.isJumping = false;
    dino.jumpTimer = 0;
  }

  const spawnRate = Math.max(20, 100 - gameSpeed * 5); // Minimum interval of 20 frames
  if (frameCount % Math.floor(spawnRate) === 0) spawnObstacle();

  if (frameCount % 500 === 0) spawnPowerUp();

  obstacles.forEach((obs, index) => {
    obs.x -= gameSpeed;
    if (obs.x + obs.width < 0) obstacles.splice(index, 1);

    if (
      !dino.isInvincible &&
      dino.x < obs.x + obs.width &&
      dino.x + dino.width > obs.x &&
      dino.y < obs.y + obs.height &&
      dino.y + dino.height > obs.y
    ) {
      triggerGameOver();
    }
  });

  powerUps.forEach((pwr, index) => {
    pwr.x -= gameSpeed;
    if (pwr.x + pwr.width < 0) powerUps.splice(index, 1);

    if (
      dino.x < pwr.x + pwr.width &&
      dino.x + dino.width > pwr.x &&
      dino.y < pwr.y + pwr.height &&
      dino.y + dino.height > pwr.y
    ) {
      dino.isInvincible = true;
      document.getElementById("invincibleNotice").classList.remove("hidden");

      setTimeout(() => {
        dino.isInvincible = false;
        document.getElementById("invincibleNotice").classList.add("hidden");
      }, 3000);

      powerUps.splice(index, 1);
    }
  });

  nightMode = document.body.classList.contains("dark-mode");
  document.getElementById("scoreDisplay").textContent = `Score: ${score}`;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = nightMode ? "#111" : "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);

  obstacles.forEach((obs) => {
    if (obs.type === "bird")
      ctx.drawImage(birdImage, obs.x, obs.y, obs.width, obs.height);
    else if (obs.type === "rock")
      ctx.drawImage(rockImage, obs.x, obs.y, obs.width, obs.height);
    else if (obs.type === "cactus")
      ctx.drawImage(cactusImage, obs.x, obs.y, obs.width, obs.height);
    else {
      ctx.fillStyle = "red";
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
  });

  powerUps.forEach((pwr) => {
    ctx.drawImage(starImage, pwr.x, pwr.y, pwr.width, pwr.height);
  });
}

function gameLoop() {
  update();
  draw();
  if (!isGameOver) requestAnimationFrame(gameLoop);
}

function triggerGameOver() {
  isGameOver = true;
  document.getElementById("gameOverScreen").classList.remove("hidden");
  document.getElementById("finalScore").textContent = `Final Score: ${score}`;
}

function restartGame() {
  score = 0;
  gameSpeed = 5;
  frameCount = 0;
  dino.y = 260;
  dino.velocityY = 0;
  dino.isJumping = false;
  dino.jumpTimer = 0;
  dino.isInvincible = false;
  isGameOver = false;
  obstacles = [];
  powerUps = [];
  document.getElementById("gameOverScreen").classList.add("hidden");
  gameLoop();
}

function startJump() {
  if (!dino.isJumping) {
    dino.isJumping = true;
    dino.jumpTimer = 0;
    dino.velocityY = -10;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    if (!isGameOver) {
      if (!jumpPressed) startJump();
      jumpPressed = true;
    }
    if (isGameOver && e.code === "Space") restartGame();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    jumpPressed = false;
  }
});

document.addEventListener("touchstart", () => {
  if (!isGameOver) {
    startJump();
    jumpPressed = true;
  } else restartGame();
});

document.addEventListener("touchend", () => {
  jumpPressed = false;
});

gameLoop();
