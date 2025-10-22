import Vector2 from './vector2.js';
import { canvas, world } from '../main.js';
import { BALL_COLORS, BALL_RADIUS, BALL_SPEED, MAX_BALLS, TIME_STEP } from '../settings.js';
import { Circle } from './shapes/circle.js';

export const inputState = {
    mouse: {
        position: new Vector2(),
        lastPosition: new Vector2(),
        velocity: new Vector2(),
        leftDown: false,
        rightDown: false
    },
    
};

// Attach listeners
export function initInputListeners() {
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        inputState.mouse.lastPosition.x = inputState.mouse.position.x;
        inputState.mouse.lastPosition.y = inputState.mouse.position.y;
        inputState.mouse.position.x = e.clientX - rect.left;
        inputState.mouse.position.y = e.clientY - rect.top;
        //correctly calculate mouse velocity = change in position / change in time
        inputState.mouse.velocity = inputState.mouse.position.clone().subtract(inputState.mouse.lastPosition).divide(TIME_STEP);
    });

    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) inputState.mouse.leftDown = true;
        if (e.button === 2) inputState.mouse.rightDown = true;

        if (e.button === 0) {
            const color = BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)];
            world.createRigidBody(new Circle(new Vector2(inputState.mouse.position.x, inputState.mouse.position.y), BALL_RADIUS), null, color, new Vector2(0, 0));
        }
    });

    canvas.addEventListener('mouseup', (e) => {
        if (e.button === 0) inputState.mouse.leftDown = false;
        if (e.button === 2) inputState.mouse.rightDown = false;
    });


    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('resize', () => {
        resizeCanvas();
    });
    resizeCanvas();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}