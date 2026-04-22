// File: helperFunctions.js
// Helper functions for the game
import Vector2 from './game/vector2.js';

const verySmallAmount = 0.00001;

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
}

export function distance(pos1, pos2) {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export function checkNearlyEqual (a, b) {
    return Math.abs(a - b) < verySmallAmount;    //true or false
}

export function checkNearlyEqualVectors(v1, v2) {
    return v1.distanceTo(v2) < verySmallAmount;
}

export function checkVectorsSameDirection (v1, v2) {
    if (v1.dot(v2) > 0) {
        return true;
    }
    return false;
}

export function averageVector(vectors) {
        const n = vectors.length;
        const average = new Vector2(0, 0);
        for (let i=0; i<n; i++) {
            average.add(vectors[i]);
        }
        return average.divide(n);
    }

export function isPointInRotatedRect(rect, point) {
    // This function would check if a point is inside a rotated rectangle
    // Get vector from center to point (without modifying original)
    const toPoint = rect.position.clone().subtract(point);
    // Rotate to local space
    const localPoint = toPoint.clone().rotate(rect.orientation);
    // Check bounds
    const halfWidth = rect.width / 2;
    const halfHeight = rect.height / 2;
    // Check if point is in bounds of local rectangle
    return Math.abs(localPoint.x) <= halfWidth && Math.abs(localPoint.y) <= halfHeight;
}

export function isPointInCircle(circle, point) {
    // circle should have: center (Vector2), radius (number)
    // point is a Vector2
    
    // Get vector from circle center to point
    const toPoint = circle.position.clone().subtract(point);
    
    // Check if distance squared is less than radius squared
    return toPoint.magnitudeSq() <= circle.radius * circle.radius;
}