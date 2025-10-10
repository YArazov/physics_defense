// main.js

import Vector2 from './game/vector2.js';
import { Circle } from './game/shapes/circle.js';
import { RigidBody } from './game/rigidBody.js';
import { BALL_COLORS, BALL_RADIUS, BALL_SPEED, MAX_BALLS, TIME_STEP } from './settings.js';
import { GameWorld } from './game/world.js';


// Initialize the canvas and set up drawing functionalities
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// world instance
const world = new GameWorld();

// Detect which page we're on
const isTesting = window.location.pathname.endsWith('test-engine.html');

// Only create balls for the menu page
if (!isTesting) {
    for (let i = 0; i < MAX_BALLS; i++) {
        const x = Math.random() * (canvas.width - BALL_RADIUS * 2) + BALL_RADIUS;
        const y = Math.random() * (canvas.height / 3);
        const color = BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)];
        const velocity = new Vector2(0, BALL_SPEED);
        balls.push(new Circle(x, y, BALL_RADIUS, color, velocity));
    }
}

let mousePosition = new Vector2();

// Mouse object to store position, velocity, and button states
let mouse = {
    position: new Vector2(),
    lastPosition: new Vector2(),
    velocity: new Vector2(),
    leftDown: false,
    rightDown: false
};

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.lastPosition.x = mouse.position.x;
    mouse.lastPosition.y = mouse.position.y;
    mouse.position.x = e.clientX - rect.left;
    mouse.position.y = e.clientY - rect.top;
    mouse.velocity = mouse.position.subtract(mouse.lastPosition);
});

canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) mouse.leftDown = true;
    if (e.button === 2) mouse.rightDown = true;

    if (e.button === 0) { // Left mouse button
        const color = BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)];
        balls.push(new Circle(mouse.position.x, mouse.position.y, BALL_RADIUS, color, new Vector2(0, 0)));
        console.log('Ball added at:', mouse.position.x, mouse.position.y, 'Total balls:', balls.length);
    }

    if (e.button === 2) { // Right mouse button
        const { ball, distance, inside } = getClosestBallInfo(mouse.position);
        if (ball) {
            console.log(
                `Closest ball at (${ball.position.x.toFixed(1)}, ${ball.position.y.toFixed(1)}), ` +
                `distance: ${distance.toFixed(1)}, inside: ${inside}`
            );
        } else {
            console.log('No balls to check.');
        }
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (e.button === 0) mouse.leftDown = false;
    if (e.button === 2) mouse.rightDown = false;
});

// Optional: prevent context menu on right click
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

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


function drawWelcomeText() {
    ctx.fillStyle = 'black';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Welcome to Physics Defense!', canvas.width / 2, canvas.height / 2);
}

function animateMenu() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    world.update(TIME_STEP);
    
    drawBalls();
    drawWelcomeText();

    requestAnimationFrame(animateMenu);
}

function animateTestEngine() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateBalls();
    drawBalls();

    // Optionally, add test info text
    ctx.fillStyle = 'black';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Physics Engine Test Animation', canvas.width / 2, 50);

    // Check closest ball info while right mouse button is held
    if (mouse.rightDown) {
        const { ball, distance, inside } = getClosestBallInfo(mouse.position);
        if (ball) {
            ctx.font = '20px Arial';
            ctx.fillStyle = inside ? 'green' : 'red';
            ctx.fillText(
                `Closest ball: (${ball.position.x.toFixed(1)}, ${ball.position.y.toFixed(1)}), ` +
                `distance: ${distance.toFixed(1)}, inside: ${inside}`,
                canvas.width / 2,
                90
            );
            // Move the ball to the mouse position if inside
            if (inside) {
                ball.position.x = mouse.position.x;
                ball.position.y = mouse.position.y;
            }
        } else {
            ctx.font = '20px Arial';
            ctx.fillStyle = 'gray';
            ctx.fillText('No balls to check.', canvas.width / 2, 90);
        }
    }

    requestAnimationFrame(animateTestEngine);
}

// Start appropriate animation
if (!isTesting) {
    animateMenu();
} else {
    animateTestEngine();
}



/**
 * Finds the closest ball to the given position and checks if the position is inside it.
 * @param {Vector2} position - The position to check from.
 * @returns {{ball: Circle|null, distance: number, inside: boolean}}
 */
function getClosestBallInfo(position) {
    let closestBall = null;
    let minDist = Infinity;
    for (const ball of balls) {
        const dx = position.x - ball.position.x;
        const dy = position.y - ball.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
            minDist = dist;
            closestBall = ball;
        }
    }
    const inside = closestBall ? minDist <= closestBall.radius : false;
    return { ball: closestBall, distance: minDist, inside };
}

// Example: spawn a new ball every 2 seconds (optional)
if (!isTesting) {
    setInterval(() => {
        world.spawnBall(canvas, null, 
            BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)], 
            new Vector2(0, BALL_SPEED));
    }, 100);
}

// Listen for navigation to test-engine.html from the menu
if (!isTesting) {
    const testEngineButton = document.querySelector('.center-btn button');
    if (testEngineButton) {
        testEngineButton.addEventListener('click', () => {
            world.entities = []; // Clear existing entities
        });
    }
}