// This is the Main Logic for the Game

var game = CreateGame();

function startGame() {
  game = CreateGame();
  game.timer = setInterval(function () {
    updateGameArea();
    updateScore();
  }, 100);
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
    block.state = block.move(block);
    block.draw(block, context);

    if(collision(game.player.ship, block)) {
      console.log("Hit a block!");
      clearInterval(game.timer);
      //gameOver();
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
    frontPoint: {x: 20},
    bottomPoint: {x: 10},

    move: (ship, y) => {
      ship.y = y;

      ship.topPoint.y = y + 13;
      ship.frontPoint.y = y + 10;
      ship.bottomPoint.y = y + 7;
      
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
  const minWidth = 5;
  const maxWidth = 15;
  const minHeight = 5;
  const maxHeight = 15;
  const minVel = 1;
  const maxVel = 5;
  
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