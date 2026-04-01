// circle.js
// Circle shape logic

export class Circle {
    constructor(position, radius) {
        this.position = position;
        this.radius = radius;
        this.orientation = 0;
        this.teeth = (Math.random()*5)|0+2;
    }

    calculateMass(density) {
        const area = Math.PI * this.radius * this.radius;
        return area * density;
    }

    calculateInertia(mass) {
        let inertia = 0.5 * mass * this.radius * this.radius;  //1/2 M R ^2
        return inertia;
    }

    draw(ctx, color) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.orientation);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        // 2) draw white gear-like center
        const innerR = this.radius * 0.04;
        const outerR = this.radius * 0.8;
        const teeth = this.teeth;
        ctx.beginPath();
        for (let i = 0; i < teeth * 2; i++) {
            const angle = (i / (teeth * 2)) * Math.PI * 2;
            const r = (i % 2 === 0) ? outerR : innerR;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();
    }
}