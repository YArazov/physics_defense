// main.js

import Vector2 from './game/vector2.js';
import { Circle } from './game/shapes/circle.js';
import { RigidBody } from './game/rigidBody.js';
import { BALL_COLORS, BALL_RADIUS, BALL_SPEED, MAX_BALLS, TIME_STEP, GRAVITY } from './settings.js';
import { GameWorld } from './game/world.js';
import { inputState, initInputListeners } from './game/input.js';

// Initialize the canvas and set up drawing functionalities
export const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// world instance
export const world = new GameWorld();

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

initInputListeners();

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
    world.draw(ctx);
    
    //menu
    drawWelcomeText();

    requestAnimationFrame(animateMenu);
}

function animateTestEngine() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    world.update(TIME_STEP);

    //collisions detection/resolution would go here
    world.resolveCollisions();

    world.draw(ctx);

    // Optionally, add test info text
    ctx.fillStyle = 'black';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Physics Engine Test Animation', canvas.width / 2, 50);

    // Check closest ball info while right mouse button is held
    if (inputState.mouse.rightDown && inputState.mouse.movedObject == null) {
        findAndBindObjectToMouse();
    }
    if (inputState.mouse.rightDown  && inputState.mouse.movedObject != null) {
        moveWithMouse();
    } else {
        inputState.mouse.movedObject = null;  
    }

    let g = GRAVITY.NORMAL;
    
    switch (inputState.gravitySelected) {
        case '3':
            g = GRAVITY.STRONG;
            break;
        case '2':
            g = GRAVITY.NORMAL;
            break;
        case '1':
            g = GRAVITY.WEAK;
            break;
        case '0':
            g = GRAVITY.ZERO;
            break;
    }
  
    for (const entity of world.entities) {
        entity.acceleration.y = g;
    }


    requestAnimationFrame(animateTestEngine);
}

// Start appropriate animation
if (!isTesting) {
    animateMenu();
} else {
    animateTestEngine();
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


function findAndBindObjectToMouse() {
    const { ball, distance, inside } = world.getClosestBallInfo(inputState.mouse.position);
    if (ball) {
        ctx.font = '20px Arial';
        ctx.fillStyle = inside ? 'green' : 'red';
        ctx.fillText(
            `Closest ball: (${ball.shape.position.x.toFixed(1)}, ${ball.shape.position.y.toFixed(1)}), ` +
            `distance: ${distance.toFixed(1)}, inside: ${inside}`,
            canvas.width / 2,
            90
        );
        // Move the ball to the inputState.mouse position if inside
        if (inside) {
            inputState.mouse.movedObject = ball;
        }
    } else {
        ctx.font = '20px Arial';
        ctx.fillStyle = 'gray';
        ctx.fillText('No balls to check.', canvas.width / 2, 90);
    }
}

function moveWithMouse() {
    let ball = inputState.mouse.movedObject;
    ball.shape.position.x = inputState.mouse.position.x;
    ball.shape.position.y = inputState.mouse.position.y;
    //balls inherit the mouse velocity
    ball.velocity = inputState.mouse.velocity.clone();  
}