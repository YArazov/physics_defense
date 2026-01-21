import { Circle } from './shapes/circle.js';

export class CollisionResolver {
    constructor() {
        this.collisions = [];
        this.e = 0.5;   //between 0 and 1
        this.kf = 0.3;
        this.sf = 0.5;
    }

    clearCollisions() {
        this.collisions = [];
    }

    narrowPhaseDetection(objects) {
        for (let i=0; i<objects.length; i++) {
            for (let j=i+1; j<objects.length; j++) {
                //detect collisions
                if(objects[i].shape instanceof Circle && 
                    objects[j].shape instanceof Circle) {
                    this.detectCollisionCircleCircle(objects[i], objects[j]);
                }  
                else {
                    //other shape combinations
                    console.log("Other shape combinations not implemented yet.");
                }
            }
        }
    }

    detectCollisionCircleCircle(o1, o2) {   //o1 and o2 are rigidBodies from array objects in main
        const s1 = o1.shape;    //rigidBodies have shape circle or rectangle
        const s2 = o2.shape;    //shape has position and radius
        const dist = s1.position.distanceTo(s2.position);
        if (dist < s1.radius + s2.radius) {
            //we've found a collision!
            const overlap = s1.radius + s2.radius - dist;
            //unit vector from s1 to s2
            const normal = s2.position.clone().subtract(s1.position).normalize();   //unit vector(direction) normal(perpendicular) to contact surface
            const point = s1.position.clone().add(normal.clone().multiply(s1.radius-overlap/2));
            // renderer.renderedNextFrame.push(point);
            
            this.collisions.push(
                new Collision([o1, o2], overlap, normal, point),
            );
        }
    }

    pushOffObjects(o1, o2, overlap, normal) {
        o1.shape.position.subtract(normal.clone().multiply(overlap/2));
        o2.shape.position.add(normal.clone().multiply(overlap/2));
    }

    bounceOffObjects(o1, o2, normal) {
        const relativeVelocity = o2.velocity.clone().subtract(o1.velocity);
        if (relativeVelocity.dot(normal) > 0) {
            return;
        }
        const j = -(1 + this.e) * relativeVelocity.dot(normal) / (o1.inverseMass + o2.inverseMass); //impulse = mass x change in velocity
        const dv1 = j * o1.inverseMass;
        const dv2 = j * o2.inverseMass;
        o1.velocity.subtract(normal.clone().multiply(dv1));
        o2.velocity.add(normal.clone().multiply(dv2));
    }

    resolveCollisionsPushOff() {
        let collidedPair, overlap, normal, o1, o2;
        for(let i=0; i<this.collisions.length; i++) {
            ({collidedPair, overlap, normal} = this.collisions[i]);
            [o1, o2] = collidedPair;
            this.pushOffObjects(o1, o2, overlap, normal);
        }
    }

    resolveCollisionsBounceOff() {
        let collidedPair, overlap, normal, o1, o2;
        for(let i=0; i<this.collisions.length; i++) {
            ({collidedPair, overlap, normal} = this.collisions[i]);
            [o1, o2] = collidedPair;
            this.pushOffObjects(o1, o2, overlap, normal);
            this.bounceOffObjects(o1, o2, normal);
        }
    }

    detectAndResolve(objects) {
        this.clearCollisions();
        this.narrowPhaseDetection(objects);
        // this.resolveCollisionsPushOff();
        this.resolveCollisionsBounceOff();
    }
}

class Collision {
    constructor(collidedPair, overlap, normal, point) {
        this.collidedPair = collidedPair;
        this.overlap = overlap;
        this.normal = normal;
        this.point = point;
    }

}