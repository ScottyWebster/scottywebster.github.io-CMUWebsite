import { useEffect, useRef, useState } from "react";

export default function Dino() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState({
    isGameOver: false,
    isInvincible: false,
    isJumping: false,
    isGrounded: true,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Game Variables
    let dino = {
      x: 50,
      y: 260,
      width: 40,
      height: 40,
      velocityY: 0,
      gravity: 1000,
      isJumping: false,
      isInvincible: false,
      jumpDuration: 0,
    };
    let localScore = 0;
    let obstacles = [];
    let powerUps = [];
    let gameSpeed = 5;
    let isGameOver = false;
    let jumpPressed = false;
    let scoreTimer = 0;
    let isGrounded = true;
    let timesJumped = 0;
    let lastTime = performance.now();
    let obstacleTimer = 0;
    let powerUpTimer = 0;

    const MAX_JUMP_TIME = 0.15;
    const JUMP_VELOCITY = -400;

    // Load Images
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

    const spawnObstacle = () => {
      const minDistance = 150;
      if (
        obstacles.length > 0 &&
        obstacles[obstacles.length - 1].x > canvas.width - minDistance
      )
        return;
      const type = Math.random();
      if (type < 0.4)
        obstacles.push({
          x: canvas.width,
          y: 270,
          width: 30,
          height: 30,
          type: "cactus",
        });
      else if (type < 0.7)
        obstacles.push({
          x: canvas.width,
          y: 200,
          width: 40,
          height: 40,
          type: "bird",
        });
      else
        obstacles.push({
          x: canvas.width,
          y: 260,
          width: 50,
          height: 50,
          type: "rock",
        });
    };

    const update = (deltaTime) => {
      if (isGameOver) return;

      scoreTimer += deltaTime;
      if (scoreTimer >= 0.1) {
        localScore += 1;
        setScore(localScore);
        scoreTimer = 0;
      }

      gameSpeed = 5 + localScore / 200;

      if (dino.y >= 260) {
        dino.y = 260;
        dino.velocityY = 0;
        isGrounded = true;
      } else {
        isGrounded = false;
      }

      if (jumpPressed && !dino.isJumping && isGrounded) {
        dino.isJumping = true;
        dino.jumpDuration = 0;
        dino.velocityY = JUMP_VELOCITY;
      }

      if (
        dino.isJumping &&
        jumpPressed &&
        dino.jumpDuration < MAX_JUMP_TIME &&
        timesJumped < 2
      ) {
        dino.velocityY = JUMP_VELOCITY;
        dino.jumpDuration += deltaTime;
      }

      if (dino.velocityY > 0 && dino.y >= 260) dino.isJumping = false;

      dino.velocityY += dino.gravity * deltaTime;
      dino.y += dino.velocityY * deltaTime;

      if (isGrounded && !jumpPressed) {
        dino.isJumping = false;
        dino.jumpDuration = 0;
        timesJumped = 0;
      }

      // Sync specific states to React for UI updates (throttled to avoid re-rendering every frame)
      setGameState((prev) => {
        if (
          prev.isJumping !== dino.isJumping ||
          prev.isGrounded !== isGrounded ||
          prev.isInvincible !== dino.isInvincible
        ) {
          return {
            ...prev,
            isJumping: dino.isJumping,
            isGrounded,
            isInvincible: dino.isInvincible,
          };
        }
        return prev;
      });

      obstacleTimer += deltaTime;
      powerUpTimer += deltaTime;

      if (obstacleTimer >= Math.max(0.3, 1.5 - gameSpeed * 0.05)) {
        spawnObstacle();
        obstacleTimer = 0;
      }
      if (powerUpTimer >= 10) {
        powerUps.push({
          x: canvas.width,
          y: 200,
          width: 30,
          height: 30,
          type: "star",
        });
        powerUpTimer = 0;
      }

      obstacles.forEach((obs, index) => {
        obs.x -= gameSpeed * deltaTime * 60;
        if (obs.x + obs.width < 0) obstacles.splice(index, 1);
        if (
          !dino.isInvincible &&
          dino.x < obs.x + obs.width &&
          dino.x + dino.width > obs.x &&
          dino.y < obs.y + obs.height &&
          dino.y + dino.height > obs.y
        ) {
          isGameOver = true;
          setGameState((prev) => ({ ...prev, isGameOver: true }));
        }
      });

      powerUps.forEach((pwr, index) => {
        pwr.x -= gameSpeed * deltaTime * 60;
        if (pwr.x + pwr.width < 0) powerUps.splice(index, 1);
        if (
          dino.x < pwr.x + pwr.width &&
          dino.x + dino.width > pwr.x &&
          dino.y < pwr.y + pwr.height &&
          dino.y + dino.height > pwr.y
        ) {
          dino.isInvincible = true;
          powerUps.splice(index, 1);
          setTimeout(() => {
            dino.isInvincible = false;
          }, 3000);
        }
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isNight = document.body.classList.contains("dark-mode");
      ctx.fillStyle = isNight ? "#111" : "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);
      if (dino.isInvincible) {
        ctx.strokeStyle = "gold";
        ctx.lineWidth = 3;
        ctx.strokeRect(dino.x, dino.y, dino.width, dino.height);
      }

      obstacles.forEach((obs) => {
        if (obs.type === "bird")
          ctx.drawImage(birdImage, obs.x, obs.y, obs.width, obs.height);
        else if (obs.type === "rock")
          ctx.drawImage(rockImage, obs.x, obs.y, obs.width, obs.height);
        else if (obs.type === "cactus")
          ctx.drawImage(cactusImage, obs.x, obs.y, obs.width, obs.height);
      });
      powerUps.forEach((pwr) =>
        ctx.drawImage(starImage, pwr.x, pwr.y, pwr.width, pwr.height),
      );
    };

    const gameLoop = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      update(deltaTime);
      draw();
      if (!isGameOver) animationFrameId = requestAnimationFrame(gameLoop);
    };

    const handleKeyDown = (e) => {
      if ((e.code === "Space" || e.code === "ArrowUp") && !isGameOver) {
        jumpPressed = true;
        timesJumped++;
      }
      if (isGameOver && e.code === "Space") {
        // Restart logic
        localScore = 0;
        gameSpeed = 5;
        dino.y = 260;
        dino.velocityY = 0;
        dino.isJumping = false;
        dino.isInvincible = false;
        isGameOver = false;
        jumpPressed = false;
        obstacles = [];
        powerUps = [];
        obstacleTimer = 0;
        powerUpTimer = 0;
        setScore(0);
        setGameState({
          isGameOver: false,
          isInvincible: false,
          isJumping: false,
          isGrounded: true,
        });
        lastTime = performance.now();
        gameLoop(performance.now());
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") jumpPressed = false;
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Start loop
    animationFrameId = requestAnimationFrame(gameLoop);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []); // Empty dependency array ensures this only mounts once

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <canvas
        ref={canvasRef}
        id="gameCanvas"
        width="800"
        height="300"
        style={{ border: "1px solid black" }}
      ></canvas>

      <div id="gameUI" style={{ marginTop: "20px" }}>
        <div id="scoreDisplay" style={{ fontSize: "24px" }}>
          Score: {score}
        </div>
        {gameState.isInvincible && (
          <div style={{ color: "gold", fontSize: "24px", fontWeight: "bold" }}>
            INVINCIBLE!
          </div>
        )}
        {gameState.isJumping && <div>JUMPING!</div>}
        {gameState.isGrounded && <div>GROUNDED!</div>}
      </div>

      {gameState.isGameOver && (
        <div id="gameOverScreen" style={{ marginTop: "20px" }}>
          <h2>Game Over</h2>
          <p>Final Score: {score}</p>
          <p>Press SPACE to Restart</p>
        </div>
      )}
    </div>
  );
}
