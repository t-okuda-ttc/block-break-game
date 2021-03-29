var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d"); 
//ボールの半径
var ballRadius = 10; 
var x = canvas.width/2; 
var y = canvas.height-30; 
// dxとdyを変更すれば向きと速さが変わる.
//dxは横の向きと速さ
//dyは縦の向きと速さ
var dx = 3;
var dy = -3; 
// ここでパドルの高さを変えている
var paddleHeight = 10; 
// ここでパドルの横幅を変えている
var paddleWidth = 75; 
//　パドルの初期値
var paddleX = (canvas.width-paddleWidth)/2;　
//パドルが右側に行くか
var rightPressed = false;　
//パドルが左側に行くか
var leftPressed = false;　　
//ブロックの列変えれる
var brickRowCount = 5;
//ブロックの行変えれる
var brickColumnCount = 5; 
//ブロックの幅を変える
var brickWidth = 75; 
//ブロックの高さを変える
var brickHeight = 20; 
//ブロックの間隔を開けれる
var brickPadding = 20; 
//上の間隔を開けれる
var brickOffsetTop = 40; 
//左側の間隔を開けることができる
var brickOffsetLeft = 50; 
//スコアの初期値
var score = 0; 
//ここでライフの数を変更できる
var lives = 5; 
//ボールの色の固定値を変数に入れる
var ballColar = "blue"; 

var bricks = [];
for(var c=0; c<brickColumnCount; c++) { 
  bricks[c] = [];
  for(var r=0; r<brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener("keydown", keyDownHandler, false);　
document.addEventListener("keyup", keyUpHandler, false);　　
document.addEventListener("mousemove", mouseMoveHandler, false);　

//色が変わる関数を用意
function colorChange(){
    var color = {r:0, g:0, b:0};   
      for(var i in color){
            color[i] = Math.floor(Math.random() * 256);
        }
  //固定値にランダムな値を入れる。
    ballColar = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
}

function keyDownHandler(e) {　
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {　　
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {　
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}

function collisionDetection() { 
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status == 1) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status = 0;
          colorChange();
          score ++;
          if(score == brickRowCount*brickColumnCount) {
            //クリアした時のscoreを表示
            alert("成功です。最終得点は " + score + "点です。");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawBall() { 
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = ballColar;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {　
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() { 
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status == 1) {
        var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() { 
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("score: "+score, 8, 20);
}

function drawLives() { 
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("HP: "+lives, canvas.width-65, 20);
}

function drawTitle() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("ブロック崩しゲーム", canvas.width-350, 20);
}

function draw() { 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  drawTitle();
  collisionDetection();

  //壁が当たるたびに呼び出される。
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) { 
    dx = -dx;
    colorChange();
  }
  if(y + dy < ballRadius) {
    dy = -dy;
    colorChange();
  }
  else if(y + dy > canvas.height-ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    }
    else {
      if (lives  == 5) {
        alert("残りは" + (lives - 1) + "です。まだまだこれから。");
      }
      if(lives  == 4) {
          alert("残りは" + (lives - 1) + "です。まだ大丈夫。");
      }
      if(lives  == 3) {
          alert("残りは" + (lives - 1) + "です。ちょっとやばいかも");
      }
      if(lives == 2) {
          alert("残りは" + (lives- 1) + "です。やばいやばいやばい");
      }
      lives--;
      if(!lives) {
        //失敗した時のスコアを表示
        alert("失敗です。最終スコアは" + score + "です。");
        document.location.reload();
      }
      else {
        x = canvas.width/2;
        y = canvas.height-30;
        //ここで復活した時の速度
        var min = 1;
        var max = 10;
        dx = Math.floor( Math.random() * (max + 1 - min) ) + min ;
        dy = -(Math.floor( Math.random() * (max + 1 - min) ) + min) ;   
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }

  if(rightPressed && paddleX < canvas.width-paddleWidth) { 
    //パドルの速度を変えられる
    paddleX += 7;
  }
  else if(leftPressed && paddleX > 0) { 
    //パドルの速度を変えられる
    paddleX -= 7;
  }

  x += dx; 
  y += dy;  
  requestAnimationFrame(draw); 
}

draw();