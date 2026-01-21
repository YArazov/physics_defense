// circle.js
// Circle shape logic

export class Circle {
    constructor(position, radius) {
        this.position = position;
        this.radius = radius;
    }

    calculateMass(density) {
        const area = Math.PI * this.radius * this.radius;
        return area * density;
    }

    calculateInertia(mass) {
        let inertia = 0.5 * mass * this.radius * this.radius;  //1/2 M R ^2
        return inertia;
    }

    update(dt) {
        this.velocity = this.velocity.add(this.acceleration.clone().multiply(dt));
        this.position = this.position.add(this.velocity.clone().multiply(dt));
    }

    draw(ctx, color) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }
}