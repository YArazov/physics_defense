import { Circle } from './shapes/circle.js';
import { Rectangle } from './shapes/rectangle.js';
import { checkNearlyEqual, checkNearlyEqualVectors, checkVectorsSameDirection } from '../helperFunctions.js';

export class CollisionResolver {
    constructor() {
        this.collisions = [];
        this.e = 0.5;   //between 0 and 1
        this.df = 0.3;
        this.sf = 0.5;
    }

    clearCollisions() {
        this.possibleCollisions = [];
        this.collisions = [];
    }

    broadPhaseDetection (objects) {
        for(let i=0; i<objects.length; i++) {
            for(let j=0; j<objects.length; j++) {
                if(j > i) {
                    this.detectAabbCollision(objects[i], objects[j]);
                }
            }
        }
    }

    detectAabbCollision(o1, o2) {
        let o1aabb = o1.aabb;
        let o2aabb = o2.aabb;
        if (o1aabb.max.x > o2aabb.min.x &&
            o1aabb.max.y > o2aabb.min.y &&
            o2aabb.max.x > o1aabb.min.x &&
            o2aabb.max.y > o1aabb.min.y) {
            this.possibleCollisions.push([o1, o2]);
        }
    }

    narrowPhaseDetection () {
        let o1;
        let o2;
        for(let i=0; i<this.possibleCollisions.length; i++) {
            
            o1 = this.possibleCollisions[i][0];
            o2 = this.possibleCollisions[i][1];

            if (o1.shape instanceof Circle && o2.shape instanceof Circle) {
                this.detectCollisionCircleCircle(o1, o2);
            } else if ((o1.shape instanceof Rectangle) && (o2.shape instanceof Rectangle)) {
                this.detectCollisionPolygonPolygon(o1, o2);
            } else if (o1.shape instanceof Circle && (o2.shape instanceof Rectangle)) {
                this.detectCollisionCirclePolygon(o1, o2);
            } else {
                this.detectCollisionCirclePolygon(o2, o1);
            }
        }
    }

    detectCollisionCircleCircle(o1, o2) {
        if (!(o1.static && o2.static)) {
            const s1 = o1.shape;
            const s2 = o2.shape;
            const dist = s1.position.distanceTo(s2.position);
            if (dist < s1.radius + s2.radius) {
                const overlap = s1.radius + s2.radius - dist;
                const normal = s2.position.clone().subtract(s1.position).normalize();
                const point = s1.position.clone().add(normal.clone().multiply(s1.radius-overlap/2));
  
                this.collisions.push(
                    new Collision([o1, o2], overlap, normal, [point])
                );
            }
        }
    }

    detectCollisionCirclePolygon (c, p) {
        const vertices = p.shape.vertices;
        const cShape = c.shape;
        let overlap = Number.MAX_VALUE;
        let normal, axis;

        for (let i=0; i<vertices.length; i++) {
            const v1 = vertices[i];
            const v2 = vertices[(i+1)%vertices.length]; //go clockwise to find pairs of vertices
            axis = v2.clone().subtract(v1).rotateCCW90().normalize(); //rotate an edge 90 degrees CCW to get normal axis
            //find min and max projections on this axis
            const [min1, max1] = this.projectVertices(vertices, axis);
            const [min2, max2] = this.projectCircle(cShape.position, cShape.radius, axis);
            if (min1 >= max2 || min2 >= max1) {
                return;
            }

            const axisOverlap = Math.min(max2-min1, max1-min2); //find on which axis we have the smallest overlap
            if (axisOverlap < overlap) {
                overlap = axisOverlap;
                normal = axis;
            }
        }
        
        const closestVertex = this.findClosestVertex(vertices, cShape.position);
        axis = closestVertex.clone().subtract(cShape.position).normalize(); //axis from circle to closest vertex on polygon
        
        const [min1, max1] = this.projectVertices(vertices, axis);
        const [min2, max2] = this.projectCircle(cShape.position, cShape.radius, axis);
        if (min1 >= max2 || min2 >= max1) {
            return;
        }

        const axisOverlap = Math.min(max2-min1, max1-min2); //find on which axis we have the smallest overlap
        if (axisOverlap < overlap) {
            overlap = axisOverlap;
            normal = axis;
        }

        const vec1to2 = p.shape.position.clone().subtract(c.shape.position);  //gives correct direction for normal
        if (normal.dot(vec1to2) < 0) { 
            normal.invert();
        }

        const point = this.findContactPointCirclePolygon(cShape.position, vertices);

        this.collisions.push(
            new Collision([c, p], overlap, normal, [point])
        );
    }

    detectCollisionPolygonPolygon(o1, o2) {
        if (!(o1.static && o2.static)) {
            const vertices1 = o1.shape.vertices;
            const vertices2 = o2.shape.vertices;
            const vector1to2 = o2.shape.position.clone().subtract(o1.shape.position);
            const vector2to1 = o1.shape.position.clone().subtract(o2.shape.position);
            // const overlaps = [];
            let smallestOverlap = Number.MAX_VALUE;
            let collisionNormal = null;

            const axes1 = this.calculateEdges(vertices1);
            axes1.forEach(a => {
                a.normalize().rotateCCW90();
            });
            for (let i=0; i<axes1.length; i++) {
                const axis = axes1[i];
                if (!checkVectorsSameDirection(axis, vector1to2)) {
                    continue;
                }
                const { overlap, normal } = this.calculateOverlap(vertices1, vertices2, axis);
    
                if (overlap <= 0) {
                    return; // Separating axis found, no collision
                } else if (overlap < smallestOverlap) {
                    smallestOverlap = overlap;
                    collisionNormal = normal;
                }
            }

            const axes2 = this.calculateEdges(vertices2);
            axes2.forEach(a => {
                a.normalize().rotateCCW90();
            });
            for (let i=0; i<axes2.length; i++) {
                const axis = axes2[i];
                if (!checkVectorsSameDirection(axis, vector2to1)) {
                    continue;
                }
                const { overlap, normal } = this.calculateOverlap(vertices1, vertices2, axis);

                if (overlap <= 0) {

                    return; // Separating axis found, no collision
                } else if (overlap < smallestOverlap) {
                    smallestOverlap = overlap;
                    collisionNormal = normal;
                }
            }
            
  
            const normal = this.correctNormalDirection(collisionNormal, o1, o2);
            const points = this.findContactPointPolygons(vertices1, vertices2);
            
            this.collisions.push(
                new Collision([o1, o2], smallestOverlap, normal, points)
            );
        }
    }

    calculateEdges(vertices) {
        const edges = [];
        const numVertices = vertices.length;
        for (let i = 0; i < numVertices; i++) {
            const v1 = vertices[i];
            const v2 = vertices[(i + 1) % numVertices];
            edges.push(v2.clone().subtract(v1));
        }
        return edges;
    }

    calculateEdgeNormals (edges) {
        edges.forEach(e => {
            e.normalize().rotateCCW90();
        });
        return edges;
    }
    
    calculateOverlap(vertices1, vertices2, axis) {       //KEY to solving polygon issues
        const [min1, max1] = this.projectVertices(vertices1, axis);
        const [min2, max2] = this.projectVertices(vertices2, axis);

        if (min1 >= max2 || min2 >= max1) {
            return {
                overlap: 0,
                normal: null
            }
        }
        return {
            overlap: Math.min(max2-min1, max1-min2),
            normal: axis.clone(),
        };
    }

    correctNormalDirection(normal, o1, o2) {   //normalized edge of polygons, points out of o1
        const vecO1O2 = o2.shape.position.clone().subtract(o1.shape.position);
        const dot = normal.dot(vecO1O2);
        if (dot >= 0) {
            return normal;
        } else {
            return normal.invert();
        }
    }

    projectVertices (vertices, axis) {  //returns min and max projections of vertices on an axis
        let min = vertices[0].dot(axis);
        let max = min;

        for (let i=1; i<vertices.length; i++) {
            const proj = vertices[i].dot(axis);
            if (proj < min) {   //save the smallest and largest projections
                min = proj;
            }
            if (proj > max) {
                max = proj;
            }
        }
    
        return [min, max];
    }

    projectCircle (center, radius, axis) {  //returns min and max projections of two circle points on an axis
        const direction = axis.clone().normalize();
        const points = [center.clone().moveDistInDir(radius, direction), center.clone().moveDistInDir(-radius, direction)]; //project these 2 points

        let min = points[0].dot(axis);  //projections of the two points
        let max = points[1].dot(axis);
        if (min > max) {    //set min and max correctly
            const t = min;
            min = max;
            max = t;
        }
        return [min, max];
    }

    findClosestVertex (vertices, center) {  //returns the i of the closest of vertices to a center point
        let minDist = Number.MAX_VALUE;
        let vertexDist, closestVertex;
        for (let i=0; i<vertices.length; i++) {
            vertexDist = vertices[i].distanceTo(center);
            if (vertexDist < minDist) {
                minDist = vertexDist;
                closestVertex = vertices[i];
            }
        }
        
        return closestVertex;
    }

    findClosestPointSegment(p, a, b) { //point, segment end points a and b
        let closest;
        const vecAB = b.clone().subtract(a);
        const vecAP = p.clone().subtract(a);
        
        const proj = vecAB.dot(vecAP);
        const ABlenSQ = vecAB.magnitudeSq();
        const d = proj / ABlenSQ;   //normalized projection, takes values 0 at a, 1 at b
        
        if (d <= 0) {
            closest = a;
        } else if (d >= 1) {
            closest = b;
        } else {
            closest = a.clone().add(vecAB.clone().multiply(d));
        }

        const distSq = p.distanceToSq(closest);

        return [closest, distSq];   //returns info
    }

    findContactPointCirclePolygon(circleCenter, polygonVertices) {
        let contact, v1, v2;
        let shortestDist = Number.MAX_VALUE;
        for (let i=0; i<polygonVertices.length; i++) {
            v1 = polygonVertices[i];
            v2 = polygonVertices[(i+1)%polygonVertices.length];
            const info = this.findClosestPointSegment(circleCenter, v1, v2);    //closest and distSq
            if(info[1] < shortestDist) {
                contact = info[0];
                shortestDist = info[1];
            }
        }
        return contact;
    }

    findContactPointPolygons(vertices1, vertices2) {
        let contact1;
        let contact2 = null;
        let contactCount = 0;
        let p, v1, v2;
        let minDistSq = Number.MAX_VALUE;
        for (let i=0; i<vertices1.length; i++) {
            p = vertices1[i];
            for (let j=0; j<vertices2.length; j++) {
                v1 = vertices2[j];
                v2 = vertices2[(j+1) % vertices2.length];
                
                const info = this.findClosestPointSegment(p, v1, v2);
                
                if (checkNearlyEqual(info[1], minDistSq) && !checkNearlyEqualVectors(info[0], contact1)) {  //only save second contact point if it is different point at same distance
                    contactCount = 2;
                    contact2 = info[0];
                } else if (info[1] < minDistSq) {
                    minDistSq = info[1];
                    contactCount = 1;
                    contact1 = info[0];
                }
            }
        }

        for (let i=0; i<vertices2.length; i++) {
            p = vertices2[i];
            for (let j=0; j<vertices1.length; j++) {
                v1 = vertices1[j];
                v2 = vertices1[(j+1) % vertices1.length];
                
                const info = this.findClosestPointSegment(p, v1, v2);
                
                if (checkNearlyEqual(info[1], minDistSq) && !checkNearlyEqualVectors(info[0], contact1)) {  //only save second contact point if it is different point at same distance
                    contactCount = 2;
                    contact2 = info[0];
                } else if (info[1] < minDistSq) {
                    minDistSq = info[1];
                    contactCount = 1;
                    contact1 = info[0];
                }
            }
        }
        const points = [];
        points.push(contact1);
        if (contact2) {
            points.push(contact2);
        }
        return points;
    }

    pushOffObjects(o1, o2, overlap, normal) {
        if(o1.static) {
            o2.shape.position.add(normal.clone().multiply(overlap));
        } else if (o2.static) {
            o1.shape.position.subtract(normal.clone().multiply(overlap));
        } else {
            o1.shape.position.subtract(normal.clone().multiply(overlap/2));
            o2.shape.position.add(normal.clone().multiply(overlap/2));
        }
        //for polygons
        if (o1.shape instanceof Rectangle) {
            o1.shape.updateVertices();
        }
        if (o2.shape instanceof Rectangle) {
            o2.shape.updateVertices();
        }
    }

    bounceOffObjects(o1, o2, normal) {
        const relativeVelocity = o2.velocity.clone().subtract(o1.velocity);
        if (relativeVelocity.dot(normal) > 0) {
            return;
        }
        let j = -(1+this.e) * relativeVelocity.dot(normal);
        j /= (o1.inverseMass + o2.inverseMass);
        
        const dv1 = j * o1.inverseMass;
        const dv2 = j * o2.inverseMass;
        o1.velocity.subtract(normal.clone().multiply(dv1));
        o2.velocity.add(normal.clone().multiply(dv2));
    }

    bounceOffAndRotateObjects(o1, o2, normal, points) {
        const impulses = [];
        const jList = [];
        const r1List = [];
        const r2List = [];
        
        for (let i=0; i<points.length; i++) {
            //linear v from rotation at contact = r vectors from objects to contact points, rotated perp, multiplied by angVel 
            const r1 = points[i].clone().subtract(o1.shape.position);
            r1List.push(r1);
            const r2 = points[i].clone().subtract(o2.shape.position);
            r2List.push(r2);

            const r1Perp = r1.clone().rotateCW90();
            const r2Perp = r2.clone().rotateCW90();
            const v1 = r1Perp.clone().multiply(o1.angularVelocity);  
            const v2 = r2Perp.clone().multiply(o2.angularVelocity);

            //relative vel at contact = relative linear vel + relative rotatonal vel
            const relativeVelocity = o2.velocity.clone().add(v2).subtract(o1.velocity).subtract(v1);
            const contactVelocityMagn = relativeVelocity.dot(normal);
            if (contactVelocityMagn > 0) {
                jList.push(0);
                continue;
            }
            
            const r1PerpDotN = r1Perp.dot(normal);
            const r2PerpDotN = r2Perp.dot(normal);

            const denom = o1.inverseMass + o2.inverseMass 
            + r1PerpDotN * r1PerpDotN * o1.inverseInertia 
            + r2PerpDotN * r2PerpDotN * o2.inverseInertia;

            let j = -(1+this.e) * contactVelocityMagn;
            j /= denom;
            j /= points.length;
            
            jList.push(j);

            const impulse = normal.clone().multiply(j);
            impulses.push(impulse);
        }

        for (let i=0; i<impulses.length; i++) {
            const impulse = impulses[i];

            o1.velocity.subtract(impulse.clone().multiply(o1.inverseMass));
            o1.angularVelocity -= r1List[i].cross(impulse) * o1.inverseInertia;
            o2.velocity.add(impulse.clone().multiply(o2.inverseMass));
            o2.angularVelocity += r2List[i].cross(impulse) * o2.inverseInertia;
        }
        return jList;
    }

    addFriction(o1, o2, normal, points, jList) {
        const frictionImpulses = [];
        const r1List = [];
        const r2List = [];

        for (let i=0; i<points.length; i++) {
            //linear v from rotation at contact = r vectors from objects to contact points, rotated perp, multiplied by angVel 
            const r1 = points[i].clone().subtract(o1.shape.position);
            r1List.push(r1);
            const r2 = points[i].clone().subtract(o2.shape.position);
            r2List.push(r2);
            const r1Perp = r1.clone().rotateCW90();
            const r2Perp = r2.clone().rotateCW90();
            
            const v1 = r1Perp.clone().multiply(o1.angularVelocity);  
            const v2 = r2Perp.clone().multiply(o2.angularVelocity);

            
            const relativeVelocity = o2.velocity.clone().add(v2).subtract(o1.velocity).subtract(v1);
            
            const tangent = relativeVelocity.clone().subtract(normal.clone().multiply(relativeVelocity.dot(normal)));
            if (tangent.checkNearlyZero()) {
                continue;
            } else {
                tangent.normalize();
            }
            
            const r1PerpDotT = r1Perp.dot(tangent);
            const r2PerpDotT = r2Perp.dot(tangent);

            const denom = o1.inverseMass + o2.inverseMass 
            + r1PerpDotT * r1PerpDotT * o1.inverseInertia 
            + r2PerpDotT * r2PerpDotT * o2.inverseInertia;

            let jt = -relativeVelocity.dot(tangent);
            jt /= denom;
            jt /= points.length;

            //Coloumb's law
            const j = jList[i];
            let frictionImpulse;
            if (Math.abs(jt) <= j * this.sf) {
                frictionImpulse = tangent.clone().multiply(jt);
            } else {
                frictionImpulse = tangent.clone().multiply(-j * this.df);
            }

            
            frictionImpulses.push(frictionImpulse);
        }

        for (let i=0; i<frictionImpulses.length; i++) {
            const frictionImpulse = frictionImpulses[i];

            o1.velocity.subtract(frictionImpulse.clone().multiply(o1.inverseMass));
            o1.angularVelocity -= r1List[i].cross(frictionImpulse) * o1.inverseInertia;
            o2.velocity.add(frictionImpulse.clone().multiply(o2.inverseMass));
            o2.angularVelocity += r2List[i].cross(frictionImpulse) * o2.inverseInertia;
        }
    }

    resolveCollisionsLinear() {
        let collidedPair, overlap, normal, o1, o2;
        for(let i=0; i<this.collisions.length; i++) {
            ({ collidedPair, overlap, normal } = this.collisions[i]);
            [o1, o2] = collidedPair;

            this.pushOffObjects(o1, o2, overlap, normal);
            this.bounceOffObjects(o1, o2, normal);
        }
    }

    resolveCollisionsWithRotation(friction) {
        let collidedPair, overlap, normal, o1, o2, points;
        for(let i=0; i<this.collisions.length; i++) {
            ({ collidedPair, overlap, normal, points } = this.collisions[i]);
            [o1, o2] = collidedPair;

            this.pushOffObjects(o1, o2, overlap, normal);
            const jList = this.bounceOffAndRotateObjects(o1, o2, normal, points);
            if(friction) {
                this.addFriction(o1, o2, normal, points, jList);
            }
        }
    }

    detectAndResolve(objects) {
        this.clearCollisions();
        this.broadPhaseDetection(objects);
        this.narrowPhaseDetection(objects);
        this.resolveCollisionsWithRotation(true);
    }
}

class Collision {
    constructor(collidedPair, overlap, normal, points) {
        this.collidedPair = collidedPair;
        this.overlap = overlap;
        this.normal = normal;
        this.points = points;
    }

}