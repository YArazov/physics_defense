// circle.js
// Circle shape logic
import Vector2 from '../vector2.js';

export class Circle {
    constructor(x, y, radius, color = 'blue', velocity = new Vector2(0, 0), acceleration = new Vector2(0, 0)) {
        this.position = new Vector2(x, y);
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.radius = radius;
        this.color = color;
    }

    update() {
        this.velocity = this.velocity.add(this.acceleration);
        this.position = this.position.add(this.velocity);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}