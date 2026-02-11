import Vector2 from '../vector2.js';

export class Rectangle {
    constructor(position, width, height, orientation = Math.random()*2*Math.PI) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.orientation = orientation; // Initial orientation in radians
        this.vertices = [new Vector2(0,0),new Vector2(0,0),new Vector2(0,0),new Vector2(0,0)];
    }

    calculateMass(density) {
        const area = this.width * this.height;
        return area * density;
    }

    calculateInertia(mass) {
        let inertia = 1/12 * mass * (this.width * this.width + this.height * this.height);  //I = (1/12) * M * (L² + W²)
        return inertia;
    }

    updateVertices() {
        this.vertices[0].setX(-this.width/2).setY(-this.height/2).rotate(this.orientation).add(this.position);
        this.vertices[1].setX(this.width/2).setY(-this.height/2).rotate(this.orientation).add(this.position);
        this.vertices[2].setX(this.width/2).setY(this.height/2).rotate(this.orientation).add(this.position);
        this.vertices[3].setX(-this.width/2).setY(this.height/2).rotate(this.orientation).add(this.position);
    } 

    update(dt) {
        this.velocity = this.velocity.add(this.acceleration.clone().multiply(dt));
        this.position = this.position.add(this.velocity.clone().multiply(dt));
    }

    draw(ctx, color) {
        const x = this.position.x;
        const y = this.position.y;
        const w = this.width;
        const h = this.height;
        const angle = this.orientation; // 22.5 degrees in radians
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-angle);   // Rotate by -22.5 degrees
        ctx.fillStyle = color;
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.restore();
    }
}