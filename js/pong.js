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
var p1Score, p2Score;

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
    
    // create scores
    p1Score = new Score(canvas.width / 2 - 30, 10, "right");
    p2Score = new Score(canvas.width / 2 + 30, 10, "left");
}
    
function update() {
    // update field
    field.update();
    
    // update ball
    ball.update();
    
    // check if ball needs to be scored
    if(ball.x - ball.radius > field.x + field.width){
        // ball is off right screen
        p1Score.score++;
        ball = new Ball(field.x + field.width / 2, field.y + field.height / 2, 60, 50, 20, field);
    }
    else if(ball.x + ball.radius < field.x){
        p2Score.score++;
        ball = new Ball(field.x + field.width / 2, field.y + field.height / 2, 60, 50, 20, field);
    }
}
    
function draw(ctx) {
    // clear canvas for drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // draw field
    field.draw(ctx);
    
    // draw ball
    ball.draw(ctx);
    
    // draw scores
    p1Score.draw(ctx);
    p2Score.draw(ctx);
}

window.onload = preinit;