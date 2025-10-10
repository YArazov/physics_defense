// world.js
// Manages game world state and entities
import { RigidBody } from './rigidBody.js';
import Vector2 from './vector2.js';

export class GameWorld {
    constructor() {
        this.entities = [];
    }

    createRigidBody(shape, image, color=null, velocity = new Vector2(0, 0), acceleration = new Vector2(0, 0)) {
        const body = new RigidBody(shape, image, color, velocity, acceleration);
        this.entities.push(body);
        return body;
    }

    update(dt) {
        for (const entity of this.entities) {
            if (typeof entity.update === 'function') {
                entity.update(dt);
            }
        }
    }
}