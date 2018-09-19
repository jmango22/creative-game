// This is the Main Logic for the Game


var PlayerPostion = 0
var canvas = document.getElementById('GameBoard');

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
    DrawPlayer(PlayerPostion)
}

function DrawPlayer(YAxis) {
    
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.moveTo(20, 10 + YAxis);
        ctx.lineTo(10, 15 + YAxis);
        ctx.lineTo(10, 5 + YAxis);
        ctx.fill();
    }
}