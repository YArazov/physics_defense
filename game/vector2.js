// 2D Vector class for physics engine
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    multiply(scalar) {
        this.x *= scalar;
		this.y *= scalar;
		return this;
    }

    divide(scalar) {
        this.x /= scalar;
		this.y /= scalar;
		return this;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const length = this.magnitude();
		if(length > 0) {
			this.x /= length;
			this.y /= length;
		}
		return this;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    distanceTo (v) {
		return this.clone().subtract(v).magnitude();
	}

    dot (v) {
		return this.x * v.x + this.y * v.y;
	}

	cross (v) {
		return (this.x * v.y) - (this.y * v.x);
	}

	checkNearlyZero () {
		return this.magnitude() < 0.05;
	}


}

export default Vector2;
