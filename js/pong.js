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
        // check collisions
        if (this.x + this.radius > field.x + field.width) {
            // off right screen
            this.vx = -this.vx;
        }
        else if (this.x - this.radius < field.x) {
            // off left screen
            this.vx = -this.vx;
        }
        
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

// Global

var fillColor = "white";
var strokeColor = "white";

// how long (in ms) between updates
var fixedDelta = 16; // roughly 60 fps
var deltaTime = fixedDelta / 1000;
var interval;

var canvas;
var ctx; 

var field, ball;

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
}
    
function update() {
    // clear canvas for drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // update field
    field.update();
    
    // update ball
    ball.update();
}
    
function draw(ctx) {
    // draw field
    field.draw(ctx);
    
    // draw ball
    ball.draw(ctx);
}

window.onload = preinit;