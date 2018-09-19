// This is the Main Logic for the Game


var PlayerPostion = 0;
var Obstacles = [];
var SpawnWaitCount = 0;
var canvas = document.getElementById('GameBoard');

const BLOCK_VEL = 2;
const SPAWN_RATE = 10;


function startGame() {
  setInterval(function () {
    updateGameArea()
  }, 100);
}

function movePlayer() {
  var y = event.clientY;     // Get the vertical coordinate
  PlayerPostion = (y - 100)/5;
}

function updateGameArea() {
  context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  DrawPlayer(PlayerPostion, context);

  SpawnWaitCount++;
  if(SpawnWaitCount === SPAWN_RATE) {
    Obstacles.push(CreateBlock());
    SpawnWaitCount = 0;
  }

  for (let i = 0; i<Obstacles.length; i++) {
    let block = Obstacles[i];
    
    if(block.isOutOfBounds(block.state)) {
      Obstacles.splice(i, 1); // Removes block from array
    } 

    block = Obstacles[i]; // move to the next one
    block.state = block.move(block.state, BLOCK_VEL);
    block.draw(block.state, context);
  }
}

function DrawPlayer(YAxis, context) {
  if (context) {
    context.beginPath();
    context.moveTo(20, 10 + YAxis);
    context.lineTo(10, 13 + YAxis);
    context.lineTo(10, 7 + YAxis);
    context.fill();
  }
}

function CreateBlock() {
  const minWidth = 5;
  const maxWidth = 15;
  const minHeight = 5;
  const maxHeight = 15;
  
  let block = {
    state: {
      x: canvas.width,
      y: getRandomInt(0, canvas.height),
      width: getRandomInt(minWidth, maxWidth),
      height: getRandomInt(minHeight, maxHeight)
    },

    move: (state, vel) => {
      state.x = state.x - vel;
      return state;
    },

    draw: (state, context) => {
      if(context) {
        context.fillRect(state.x, state.y, state.width, state.height);
      }
    },

    isOutOfBounds: (state) => {
      if ((state.x + state.width) < 0) {
        return true;
      }
    }
  }
  
  return block;
} 

function getRandomInt(min, max) {
  return Math.random() * (max - min) + min;
}
