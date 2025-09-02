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

// Nice color palette for balls
const BALL_COLORS = [
    '#4F8A8B', // teal
    '#FBD46D', // yellow
    '#F76A6A', // coral
    '#A1C6EA', // light blue
    '#374785', // deep blue
    '#24305E', // navy
    '#70A1D7', // sky blue
    '#FFB085', // peach
    '#FF7E67', // orange
    '#6DD47E'  // green
];

for (let i = 0; i < BALL_COUNT; i++) {
    const x = Math.random() * (canvas.width - BALL_RADIUS * 2) + BALL_RADIUS;
    const y = Math.random() * (canvas.height / 3);
    const color = BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)];
    balls.push(new Circle(x, y, BALL_RADIUS, color));
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Do NOT reposition existing balls on resize
}

// Remove centerBalls and its call

window.addEventListener('resize', () => {
    resizeCanvas();
});

// Initial canvas setup
resizeCanvas();

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

function spawnBall() {
    const x = Math.random() * (canvas.width - BALL_RADIUS * 2) + BALL_RADIUS;
    const y = Math.random() * (canvas.height / 3);
    const color = BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)];
    balls.push(new Circle(x, y, BALL_RADIUS, color));
}

// Example: spawn a new ball every 2 seconds (optional)
setInterval(() => {
    spawnBall();
}, 2000);