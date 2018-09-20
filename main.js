// This is the Main Logic for the Game

resizeCanvas();
var game = CreateGame();
initPlayer();
var GameMusic = new sound("Audio/Fine.mp3")
var MusicPlaying = false;
var GameStarted = false;

function startGame() {
    if (GameStarted) {
        clearInterval(game.timer);
    }
    GameStarted = true;
    document.getElementById("GameBoard").style.cursor = "none";
  game = CreateGame();
  game.timer = setInterval(function () {
    updateGameArea();
    updateScore();
  }, 100);
}

function initPlayer() {
  game.player.ship = game.player.ship.move(game.player.ship, getWindowSize().h/20);
  game.player.ship.draw(game.player.ship, game.canvas.getContext('2d'));
}

function ToggleMusic() {
  if (MusicPlaying) {
    document.getElementById("MusicToggle").style.textDecoration = "line-through";
    GameMusic.stop();
    MusicPlaying = false;
  }
  else {
    document.getElementById("MusicToggle").style.textDecoration = "none";
    GameMusic.play();
    MusicPlaying = true;
  }
}

function movePlayer() {
  const Y_POS = getYPos(event, game.canvas);
  game.player.ship = game.player.ship.move(game.player.ship, Y_POS);
}

function updateGameArea() {
  context = game.canvas.getContext('2d');
  context.clearRect(0, 0, game.canvas.width, game.canvas.height);
  
  game.player.ship.draw(game.player.ship, context);

  if(game.spawnWait <= 0) {
    game.obstacles.push(CreateBlock(game.canvas));
    game.spawnWait = 200/game.player.score;
  }

  for (let i = 0; i<game.obstacles.length; i++) {
    let block = game.obstacles[i];
    
    if(block.isOutOfBounds(block)) {
      game.obstacles.splice(i, 1); // Removes block from array
    }

    block = game.obstacles[i]; // move to the next one
    
    if (block) {
      block = block.move(block);
      block.draw(block, context);

      if(collision(game.player.ship, block)) {
          clearInterval(game.timer);
          document.getElementById("GameBoard").style.cursor = "";
          GameStarted = false;
      }
    }
  }

  game.spawnWait = game.spawnWait-1;
  game.player.score = game.player.score+1;
}

function updateScore() {
  document.getElementById('ScoreBoard').innerHTML = `score: ${game.player.score}`;
}

// Game Layout

function CreateGame() {
  return {
    // Game Variables
    spawnWait: 8,

    // Game Peices
    canvas: document.getElementById('GameBoard'),
    obstacles: [],
    player: CreatePlayer()
  }
}

function CreatePlayer() {
  return {
    score: 0,
    ship: CreateShip()
  }
}

function CreateShip() {
  return {
    y: 0,
    topPoint: {x: 10},
    frontPoint: {x: 50},
    bottomPoint: {x: 10},

    move: (ship, y) => {
      ship.y = y;

      const yOffset = Math.floor(getWindowSize().h/40);

      ship.topPoint.y = y + (2 * yOffset);
      ship.frontPoint.y = y + yOffset;
      ship.bottomPoint.y = y;
      
      return ship;
    },

    draw: (ship, context) => {
      context.fillStyle = "black";
      context.beginPath();
      context.moveTo(ship.frontPoint.x, ship.frontPoint.y);
      context.lineTo(ship.topPoint.x, ship.topPoint.y);
      context.lineTo(ship.bottomPoint.x, ship.bottomPoint.y);
      context.fill();
    }
  }
}

function CreateBlock(canvas) {
  const windowSize = getWindowSize();

  const minWidth = windowSize.w/20;
  const maxWidth = windowSize.w/8;
  const minHeight = windowSize.h/20;
  const maxHeight = windowSize.h/8;
  const minVel = 30;
  const maxVel = 40;
  
  return {
    x: canvas.width,
    y: getRandomInt(0, canvas.height),
    width: getRandomInt(minWidth, maxWidth),
    height: getRandomInt(minHeight, maxHeight),
    velocity: (Math.random() * (maxVel - minVel) + minVel),
    color: '#'+Math.floor(Math.random()*16777215).toString(16), // Generate random color code, cause why not?

    move: (block) => {
      block.x = block.x - block.velocity;
      return block;
    },

    draw: (block, context) => {
      if(context) {
        context.fillStyle = block.color;
        context.fillRect(block.x, block.y, block.width, block.height);
      }
    },

    isOutOfBounds: (block) => {
      if ((block.x + block.width) < 0) {
        return true;
      }
    }
  }
}

// Helper math/geometry funtions

function collision(ship, block) {
  return pointInRect(ship.topPoint, block) || pointInRect(ship.frontPoint, block) || pointInRect(ship.bottomPoint, block);
}

function pointInRect(point, rect) {
  if(point.x >= rect.x && point.x <= (rect.x + rect.width) && point.y >= rect.y && (point.y <= (rect.y + rect.height))) {
    return true;
  }
  return false;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getYPos(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return Math.floor(event.clientY - rect.top);
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

// Manage the window size
function getWindowSize() {
  return {
    w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  }
}

function resizeCanvas() {
  const borderMargin = 25;
  const windowSize = getWindowSize();

  const adjWidth = windowSize.w - (2 * borderMargin);
  const adjHeight = windowSize.h - (2 * borderMargin) - 150;

  document.getElementById('GameBoard').setAttribute('width', adjWidth);
  document.getElementById('GameBoard').setAttribute('height', adjHeight);
}

window.addEventListener("resize", function(){
  resizeCanvas();
});

function DisplayHelpModal() {
    document.getElementById("HelpModal").style.display = "block";
}

function HideHelpModal() {
    document.getElementById("HelpModal").style.display = "none";
}