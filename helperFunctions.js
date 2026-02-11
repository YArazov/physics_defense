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

export function averageVector(vectors) {
        const n = vectors.length;
        const average = new Vector2(0, 0);
        for (let i=0; i<n; i++) {
            average.add(vectors[i]);
        }
        return average.divide(n);
    }