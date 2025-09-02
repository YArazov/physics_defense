// world.js
// Manages game world state and entities

export class GameWorld {
    constructor() {
        this.entities = [];
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    update(dt) {
        for (const entity of this.entities) {
            if (typeof entity.update === 'function') {
                entity.update(dt);
            }
        }
    }
}