// ===== script.js =====
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let keys = {};
let bullets = [];
let enemies = [];
let score = 0;

// Sounds
const shootSound = new Audio('shoot.wav');
const hitSound = new Audio('hit.wav');

// Player
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 100,
  width: 50,
  height: 50,
  speed: 7,
  draw() {
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
};

// Enemy
class Enemy {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = 40;
    this.height = 40;
  }
  draw() {
    ctx.fillStyle = '#ff0044';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  update() {
    this.y += this.speed;
  }
}

// Bullet
class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 10;
    this.speed = 10;
  }
  draw() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  update() {
    this.y -= this.speed;
  }
}

// Controls
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);
document.addEventListener('click', shoot);

function shoot() {
  bullets.push(new Bullet(player.x + player.width / 2 - 2, player.y));
  shootSound.play();
}

function spawnEnemy() {
  let x = Math.random() * (canvas.width - 40);
  enemies.push(new Enemy(x, -40, 3));
}

function drawScore() {
  ctx.fillStyle = '#00ffcc';
  ctx.font = '20px Orbitron';
  ctx.fillText(`Score: ${score}`, 20, 30);
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
  if (keys['ArrowRight'] || keys['d']) player.x += player.speed;
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  player.draw();

  bullets.forEach((b, index) => {
    b.update();
    b.draw();
    if (b.y < 0) bullets.splice(index, 1);
  });

  enemies.forEach((e, ei) => {
    e.update();
    e.draw();
    if (e.y > canvas.height) enemies.splice(ei, 1);

    bullets.forEach((b, bi) => {
      if (b.x < e.x + e.width &&
          b.x + b.width > e.x &&
          b.y < e.y + e.height &&
          b.y + b.height > e.y) {
        hitSound.play();
        score++;
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
      }
    });
  });

  drawScore();
  requestAnimationFrame(updateGame);
}

setInterval(spawnEnemy, 1000);
updateGame();