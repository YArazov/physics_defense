// main.js

import { Circle } from './game/shapes/circle.js';

// Initialize the canvas and set up drawing functionalities
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create balls (circles) with random positions
const balls = [];
const BALL_COUNT = 10;
const BALL_RADIUS = 30;
const BALL_SPEED = 2;

for (let i = 0; i < BALL_COUNT; i++) {
    const x = Math.random() * (canvas.width - BALL_RADIUS * 2) + BALL_RADIUS;
    const y = Math.random() * (canvas.height / 3);
    balls.push(new Circle(x, y, BALL_RADIUS));
}

function drawBalls() {
    for (const ball of balls) {
        ball.draw(ctx);
    }
}

function updateBalls() {
    for (const ball of balls) {
        ball.y += BALL_SPEED;
        if (ball.y - ball.radius > canvas.height) {
            ball.y = -ball.radius; // Reset to top if it falls below canvas
        }
    }
}

function drawWelcomeText() {
    ctx.fillStyle = 'black';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Welcome to Physics Defense!', canvas.width / 2, canvas.height / 2);
}

function animate() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateBalls();
    drawBalls();
    drawWelcomeText();

    requestAnimationFrame(animate);
}

animate();