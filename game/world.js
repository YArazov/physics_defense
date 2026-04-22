// world.js
// Manages game world state and entities
import { RigidBody } from './rigidBody.js';
import Vector2 from './vector2.js';
import { Circle } from './shapes/circle.js';
import { Rectangle } from './shapes/rectangle.js';
import { BALL_RADIUS, BALL_SPEED } from '../settings.js';
import { isPointInCircle, isPointInRotatedRect } from '../helperFunctions.js';
import { CollisionResolver } from './collisions.js';

export class GameWorld {
    constructor() {
        this.entities = [];
        this.collisionResolver = new CollisionResolver();
    }

    createRigidBody(shape, image, color=null, velocity = new Vector2(0, 0), acceleration = new Vector2(0, 0)) {
        const body = new RigidBody(shape, image, color, velocity, acceleration);
        const rand = Math.random();
        if (rand < 0.5) {
            body.static = true;  // 50% chance to be static
            body.color = 'gray';  // Static objects are gray
        }
        body.setMass();
        this.entities.push(body);
    }

    // Ball spawning logic for random positions and colors
    spawnObject(canvas, image=null, color=null, velocity=new Vector2(0, BALL_SPEED)) {
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

    resolveCollisions() {
        // Collision detection and resolution logic would go here
        this.collisionResolver.detectAndResolve(this.entities);
    }

    draw(ctx) {
        for (const entity of this.entities) {
            if (typeof entity.draw === 'function') {
                entity.draw(ctx);
            }
        }
    }

    checkObjectAtPosition(position) {
        let inside = false;
        for (const obj of this.entities) { 
            if (obj.shape instanceof Circle) {
                inside = isPointInCircle(obj.shape, position);     
            } else if (obj.shape instanceof Rectangle) {
                inside = isPointInRotatedRect(obj.shape, position);
            }
            if (inside) {
                return obj;  // Return the first object found at the position
            }  
        }
            
    }
}
    