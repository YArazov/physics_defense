// a rigid body class has physical properties like position, velocity, acceleration, mass, and shape
// its shape can be a circle or rectangle

import Vector2 from './vector2.js';
import { Rectangle } from './shapes/rectangle.js';
import { Circle } from './shapes/circle.js';

export class RigidBody {
    constructor(shape, image, color=null, velocity = new Vector2(0, 0), acceleration = new Vector2(0, 0)) {
        this.shape = shape;
        if (this.shape instanceof Rectangle) {
			this.shape.updateVertices();
		}
        this.aabb = new Aabb (new Vector2(0, 0), new Vector2(0, 0));
        
        this.velocity = velocity;
        this.acceleration = acceleration;

        this.angularVelocity = 0;
		this.angularAcceleration = 0;

        this.color = color;
        this.image = image;

        this.mass;
		this.inverseMass;
		this.density = 5;
		this.inertia;
		this.inverseInertia;
		this.static = false;
    }

    setMass() {
		this.mass = this.shape.calculateMass(this.density);
		this.inertia = this.shape.calculateInertia(this.mass);

		if (this.static) {
			this.inverseMass = 0;   //defined as 1/mass, so static objects have infinite mass and thus zero inverse mass
			this.inverseInertia = 0;
		} else {
			this.inverseMass = 1 / this.mass;
			this.inverseInertia = 1 / this.inertia;
		}
	}

    update(dt) {
        //linear motion
        this.velocity = this.velocity.add(this.acceleration.clone().multiply(dt));
        this.shape.position = this.shape.position.add(this.velocity.clone().multiply(dt));

        //rotational motion
        this.angularVelocity += this.angularAcceleration * dt;
		this.shape.orientation += this.angularVelocity * dt;
        
        //update vertices and aabb   
        if (this.shape instanceof Rectangle) {
			this.shape.updateVertices();
            this.aabb.updateMinMaxRect(this.shape.vertices);
		} else if (this.shape instanceof Circle) {
            this.aabb.updateMinMaxCircle(this.shape.position, this.shape.radius);
		}
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

class Aabb {
    constructor (min, max) {
        this.min = min;
        this.max = max;
    }

    updateMinMaxVelocity (dv) { //add vector dv to min max positions
        this.min.add(dv);
        this.max.add(dv);
    }

    updateMinMaxCircle (p, r) {
        this.min = p.clone().subtractX(r).subtractY(r);
        this.max = p.clone().addX(r).addY(r);
    }

    updateMinMaxRect (vertices) {
        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxX = Number.MIN_VALUE;
        let maxY = Number.MIN_VALUE;
        let vertexX;
        let vertexY;

        for (let i=0; i<vertices.length; i++) {
            vertexX = vertices[i].x;
            vertexY = vertices[i].y;
            minX = vertexX < minX ? vertexX : minX;
            maxX = vertexX > maxX ? vertexX : maxX;
            minY = vertexY < minY ? vertexY : minY;
            maxY = vertexY > maxY ? vertexY : maxY;
        }

        this.min.x = minX;
        this.min.y = minY;
        this.max.x = maxX;
        this.max.y = maxY;
    }
}