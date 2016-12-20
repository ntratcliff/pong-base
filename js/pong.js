"use strict";

// GameObject constructor
var GameObject = function(x, y) {
    this.x = x;
    this.y = y;
}

// GameObject functions
GameObject.prototype.init = function() { }

GameObject.prototype.update = function() { }

GameObject.prototype.draw = function(ctx) { }

// Ball constructor
var Ball = function(x, y, vx, vy, r, field) {
    // call parent constructor
    GameObject.call(this, x, y);
    this.radius = r;
    this.vx = vx;
    this.vy = vy;
    this.field = field;
}

// set Ball parent
Ball.prototype = Object.create(GameObject.prototype);
Ball.prototype.constructor = Ball;

// Ball functions
Ball.prototype.update = function() {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    
    // if there is a field and this ball knows about it
    if(this.field) {
        if (this.y + this.radius > field.y + field.height) {
            // off bottom screen
            this.vy = -this.vy;
        }
        else if (this.y - this.radius < field.y) {
            // off top screen
            this.vy = -this.vy;
        }
    }
}

Ball.prototype.draw = function(ctx) {
    // draw circle
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
}

// Paddle constructor
var Paddle = function (x, y, w, h, s, upKey, downKey) {
    GameObject.call(this, x, y);
    this.width = w;
    this.height = h;
    this.speed = s;
    this.upKey = upKey;
    this.downKey = downKey;
    this.vy = 0;
}

// set Paddle parent
Paddle.prototype = Object.create(GameObject.prototype);
Paddle.prototype.constructor = Paddle;

// Paddle Functions
// callback for keypress
Paddle.prototype.keydown = function(e) {
    console.log(e.key);
    console.log(this.upKey);
    console.log(e.key == this.upKey);
    if(e.key === this.upKey) {
        // move up
        this.vy = -this.speed;
    }
    else if(e.key === this.downKey) {
        // move down
        this.vy = this.speed;
    }
}

// callback for key release
Paddle.prototype.keyup = function(e) {
    if(e.key === this.upKey 
      || e.key === this.downKey) {
        // move up
        this.vy = 0;
    }
}

// check collision between paddle and ball
Paddle.prototype.checkCollision = function(ball) {
    var distX = Math.abs(ball.x - this.x - this.width / 2);
    var distY = Math.abs(ball.y - this.y - this.height / 2);
    
    if (distX > (this.width / 2 + ball.radius) ||
       distY > (this.height / 2 + ball.radius)) {
        return false;
    }
    
    if(distX <= (this.width / 2) ||
      distY <= (this.height / 2)) {
        return true;
    }
    
    var distSq = (distX - this.width / 2)^2 +
        (distY - this.height / 2)^2;
    
    return distSq <= (ball.radius^2);
}

// update
Paddle.prototype.update = function() {
    // add velocity to position
    this.y += this.vy * deltaTime;
    
    // check collision between this and ball
    if(ball && this.checkCollision(ball)) {
        // position ball so that it is no longer colliding with paddle
        if(ball.x < this.x) {
            // ball is to the left of the paddle
            ball.x = this.x - ball.radius;
        }
        else {
            // ball is to the right of the paddle
            ball.x = this.x + this.width + ball.radius;
        }
        
        ball.vx = -ball.vx;
    }
}

// draw
Paddle.prototype.draw = function(ctx) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
}

// Score contstructor
var Score = function(x, y, textAlign) {
    GameObject.call(this, x, y);
    this.score = 0;
    this.textAlign = textAlign;
}

// set Score parent
Score.prototype = Object.create(GameObject.prototype);
Score.prototype.constructor = Score;

// Score functions
Score.prototype.draw = function(ctx) {
    ctx.fillStyle = fillColor;
    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.textAlign = this.textAlign;
    ctx.fillText(String(this.score), this.x, this.y);
}

// Player constructor
var Player = function(paddle, score) {
    this.paddle = paddle;
    this.score = score;
}

Player.prototype.update = function() {
    this.paddle.update();
}

Player.prototype.draw = function(ctx) {
    this.paddle.draw(ctx);
    this.score.draw(ctx);
}

// Field constructor
var Field = function (x, y, w, h) {
    GameObject.call(this, x, y);
    this.width = w;
    this.height = h;
}

// set Field parent
Field.prototype = Object.create(GameObject.prototype);
Field.prototype.constructor = Field;

// Field functions
Field.prototype.draw = function(ctx) {
    // draw the field
    ctx.strokeStyle = strokeColor;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
}

// Global

var fillColor = "white";
var strokeColor = "white";
var font = "60px sans-serif";

// how long (in ms) between updates
var fixedDelta = 16; // roughly 60 fps
var deltaTime = fixedDelta / 1000;
var interval;

var canvas;
var ctx; 

var field, ball;
var player1, player2;

function preinit() {
    // get canvas
    canvas = document.getElementById("canvas");
    
    // get graphics context
    ctx = canvas.getContext("2d");
    
    // set frame interval
    interval = setInterval(function() {
        update();
        draw(ctx);
    }, fixedDelta);
    
    // call init
    init();
}

function init() {
    // create field
    field = new Field(0, 100, canvas.width, canvas.height - 100);
    
    // create ball in center of field
    ball = new Ball(field.x + field.width / 2, field.y + field.height / 2, 60, 50, 20, field);
    
    // create paddles
    var p1Paddle = new Paddle(field.x + 30, field.y + field.height / 2 - 50, 15, 100, 100, "w", "s");
    var p2Paddle = new Paddle(field.width - 45, field.y + field.height / 2 - 50, 15, 100, 100, "ArrowUp", "ArrowDown");
    
    // register paddle event listeners
    // TODO: there's probably something better we can do than just anon functions
    document.addEventListener("keydown", function(e) {p1Paddle.keydown(e);});
    document.addEventListener("keyup", function(e){p1Paddle.keyup(e);});
    
    document.addEventListener("keydown", function(e) {p2Paddle.keydown(e);});
    document.addEventListener("keyup", function(e){p2Paddle.keyup(e);});
    
    
    // create scores
    var p1Score = new Score(canvas.width / 2 - 30, 10, "right");
    var p2Score = new Score(canvas.width / 2 + 30, 10, "left");
    
    // create players
    player1 = new Player(p1Paddle, p1Score);
    player2 = new Player(p2Paddle, p2Score);
}
    
function update() {
    // update field
    field.update();
    
    // update players
    player1.update();
    player2.update();
    
    // update ball
    ball.update();
    
    // check if ball needs to be scored
    if(ball.x - ball.radius > field.x + field.width){
        // ball is off right screen
        player1.score.score++;
        ball = new Ball(field.x + field.width / 2, field.y + field.height / 2, 60, 50, 20, field);
    }
    else if(ball.x + ball.radius < field.x){
        player2.score.score++;
        ball = new Ball(field.x + field.width / 2, field.y + field.height / 2, 60, 50, 20, field);
    }
}
    
function draw(ctx) {
    // clear canvas for drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // draw field
    field.draw(ctx);
    
    // draw paddles
    player1.draw(ctx);
    player2.draw(ctx);
    
    // draw ball
    ball.draw(ctx);
}

window.onload = preinit;