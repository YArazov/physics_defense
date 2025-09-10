// main.js

import { Circle } from './game/shapes/circle.js';

// Initialize the canvas and set up drawing functionalities
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Detect which page we're on
const isMenu = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

// Ball settings
const balls = [];
const BALL_COUNT = isMenu ? 10 : 20;
const BALL_RADIUS = 30;
const BALL_SPEED = isMenu ? 2 : 5;

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

// Create balls with random positions
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
    // Remove balls that fall below the canvas
    for (let i = balls.length - 1; i >= 0; i--) {
        balls[i].y += BALL_SPEED;
        if (balls[i].y - balls[i].radius > canvas.height) {
            balls.splice(i, 1); // Remove ball from array
        }
    }
}

function drawWelcomeText() {
    ctx.fillStyle = 'black';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Welcome to Physics Defense!', canvas.width / 2, canvas.height / 2);
}

function animateMenu() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateBalls();
    drawBalls();
    drawWelcomeText();

    requestAnimationFrame(animateMenu);
}

function animateTestEngine() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // No balls drawn or updated

    // Optionally, add test info text
    ctx.fillStyle = 'black';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Physics Engine Test Animation', canvas.width / 2, 50);

    requestAnimationFrame(animateTestEngine);
}

// Start appropriate animation
if (isMenu) {
    animateMenu();
} else {
    animateTestEngine();
}

// Ball spawning logic only for test-engine page
function spawnBall() {
    const x = Math.random() * (canvas.width - BALL_RADIUS * 2) + BALL_RADIUS;
    const y = Math.random() * (canvas.height / 3);
    const color = BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)];
    balls.push(new Circle(x, y, BALL_RADIUS, color));
}

// Example: spawn a new ball every 2 seconds (optional)
setInterval(() => {
    spawnBall();
}, 100);