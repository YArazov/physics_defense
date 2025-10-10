// world.js
// Manages game world state and entities
import { RigidBody } from './rigidBody.js';
import Vector2 from './vector2.js';
import { Circle } from './shapes/circle.js';
import { BALL_COLORS, BALL_RADIUS, BALL_SPEED } from '../settings.js';
import { distance } from '../helperFunctions.js';

export class GameWorld {
    constructor() {
        this.entities = [];
    }

    createRigidBody(shape, image, color=null, velocity = new Vector2(0, 0), acceleration = new Vector2(0, 0)) {
        const body = new RigidBody(shape, image, color, velocity, acceleration);
        this.entities.push(body);
        return body;
    }

    // Ball spawning logic only for test-engine page
    spawnBall(canvas, image=null, color=null, velocity=new Vector2(0, BALL_SPEED)) {
        const x = Math.random() * (canvas.width - BALL_RADIUS * 2) + BALL_RADIUS;
        const y = Math.random() * (canvas.height / 3);
        const position = new Vector2(x, y);
        this.createRigidBody(new Circle(position, BALL_RADIUS), image, color, velocity);
    }

    update(dt) {
        for (const entity of this.entities) {
            if (typeof entity.update === 'function') {
                entity.update(dt);
            }
        }
    }

    draw(ctx) {
        for (const entity of this.entities) {
            if (typeof entity.draw === 'function') {
                entity.draw(ctx);
            }
        }
    }
    // Finds the closest ball to the given position and checks if the position is inside it
    getClosestBallInfo(position) {
        let closestBall = null;
        let minDist = Infinity;
        for (const ball of this.entities) {
            const dist = distance(position, ball.shape.position);
            if (dist < minDist) {
                minDist = dist;
                closestBall = ball;
            }
        }
        const inside = closestBall ? minDist <= closestBall.shape.radius : false;
        return { ball: closestBall, distance: minDist, inside };
    }
}