// a rigid body class has physical properties like position, velocity, acceleration, mass, and shape
// its shape can be a circle or rectangle

import Vector2 from '../vector2.js';

export class RigidBody {
    constructor(shape, image, color=null, velocity = new Vector2(0, 0), acceleration = new Vector2(0, 0)) {
        this.shape = shape;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.radius = radius;
        this.color = color;
        this.image = image;
    }

    update(dt) {
        this.velocity = this.velocity.add(this.acceleration.clone().multiply(dt));
        this.shape.position = this.shape.position.add(this.velocity.clone().multiply(dt));
    }

    draw(ctx) {
        if (this.image) {
            ctx.drawImage(this.image, this.position.x - this.radius, this.position.y - this.radius, this.radius * 2, this.radius * 2);
            return;
        } else {
            this.shape.draw(ctx, this.color);
        }
    }
}