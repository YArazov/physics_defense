// a rigid body class has physical properties like position, velocity, acceleration, mass, and shape
// its shape can be a circle or rectangle

import Vector2 from './vector2.js';

export class RigidBody {
    constructor(shape, image, color=null, velocity = new Vector2(0, 0), acceleration = new Vector2(0, 0)) {
        this.shape = shape;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.color = color;
        this.image = image;

        this.mass;
		this.inverseMass;
		this.density = 5;
		this.inertia;
		this.inverseInertia;
		this.isFixed = false;
    }

    setMass() {
		this.mass = this.shape.calculateMass(this.density);
		this.inertia = this.shape.calculateInertia(this.mass);

		if (this.isFixed) {
			this.inverseMass = 0;
			this.inverseInertia = 0;
		} else {
			this.inverseMass = 1 / this.mass;
			this.inverseInertia = 1 / this.inertia;
		}
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