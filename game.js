// Constants for the game
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const PLAYER_SPEED = 5;
const OBJECT_WIDTH = 50;
const OBJECT_HEIGHT = 50;
const OBJECT_SPEED_MIN = 5;
const OBJECT_SPEED_MAX = 10;
const SPAWN_INTERVAL = 2000;

// Player class
class Player {
  constructor() {
    this.x = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2;
    this.y = CANVAS_HEIGHT - PLAYER_HEIGHT;
    this.vx = 0;
    this.vy = 0;
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.speed = PLAYER_SPEED;
  }

  move(keys) {
    const previousX = this.x;
    const previousY = this.y;
  
    if (keys['ArrowLeft'] && this.x > 0) {
      this.x -= this.speed;
    } else if (keys['ArrowRight'] && this.x + this.width < CANVAS_WIDTH) {
      this.x += this.speed;
    }
  
    if (keys['ArrowUp'] && this.y === 0) {
      this.vy = -this.speed * 2;
    }
  
    this.vy += 1;
    this.x += this.vx;
    this.y += this.vy;
  
    if (this.y > 0) {
      this.y = 0;
      this.vy = 0;
    }
  
    // Check collision with objects
    for (let object of this.objects) {
      if (this.isColliding(object)) {
        this.x = previousX;
        this.y = previousY;
        break;
      }
    }
  }
  
  isColliding(object) {
    if (
      this.x < object.x + object.width &&
      this.x + this.width > object.x &&
      this.y < object.y + object.height &&
      this.y + this.height > object.y
    ) {
      return true;
    }
    return false;
  }
  
  
  

  draw(ctx, camera) {
    ctx.fillStyle = 'blue'; // Set the player color
    ctx.fillRect(this.x, this.y - camera.y, this.width, this.height);
  }  
}

// Object class
class FallingObject {
  constructor() {
    this.x = Math.random() * CANVAS_WIDTH;
    this.y = CANVAS_HEIGHT;
    this.vy = -Math.random() * (OBJECT_SPEED_MAX - OBJECT_SPEED_MIN) + OBJECT_SPEED_MIN;
    this.width = OBJECT_WIDTH;
    this.height = OBJECT_HEIGHT;
  }

  move() {
    this.y += this.vy;
  }

  draw(ctx, camera) {
    ctx.fillStyle = 'red'; // Set the object color
    ctx.fillRect(this.x, this.y - camera.y, this.width, this.height);
  }
}

// Camera class
class Camera {
  constructor() {
    this.y = 0;
  }

  update(player) {
    this.y = Math.max(this.y, player.y);
  }
}

// Game class
class Game {
  constructor() {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.ctx = this.canvas.getContext('2d');

    this.player = new Player();
    this.objects = [];
    this.camera = new Camera();

    this.keys = {};
    window.addEventListener('keydown', (e) => this.keys[e.key] = true);
    window.addEventListener('keyup', (e) => this.keys[e.key] = false);

    setInterval(() => this.objects.push(new FallingObject()), SPAWN_INTERVAL);
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
    this.player.move(this.keys);
    this.player.draw(this.ctx, this.camera); // Add this line to call the draw method
  
    for (let object of this.objects) {
      object.move();
      object.draw(this.ctx, this.camera);
    }
  
    this.camera.update(this.player);
  
    requestAnimationFrame(() => this.loop());
  }

  start() {
    document.body.style.margin = 0;
    this.loop();
  }
}

// Start the game
new Game().start();
