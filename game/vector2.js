// 2D Vector class for physics engine
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    setX (x) {
		this.x = x;
		return this;
	}

	setY (y) {
		this.y = y;
		return this;
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
		if(scalar !== 0) {
			this.x /= scalar;
			this.y /= scalar;
		}
		return this;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

	lengthSq() {
    	return this.x * this.x + this.y * this.y;
	}

    normalize() {
        const length = this.magnitude();
		if(length > 0) {
			this.x /= length;
			this.y /= length;
		}
		return this;
    }

    rotate(angle) {	//in formula angle is Theta
		const x = this.x;	//Ax
		const y = this.y;
		this.x = x * Math.cos(angle) - y * Math.sin(angle);	//Bx
		this.y = x * Math.sin(angle) + y * Math.cos(angle);
		return this;
	}

    rotateCW90 () {
		const x = this.x;
		this.x = -this.y;
		this.y = x;
		return this;
	}

	rotateCCW90 () {
		const x = this.x;
		this.x = this.y;
		this.y = -x;
		return this;
	}

    invert () {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}

	invertX () {
		this.x = -this.x;
		return this;
	}

	invertY () {
		this.y = -this.y;
		return this;
	}

    moveDistInDir (dist, dir) {	//dir is unit vector
		return this.add(dir.clone().multiply(dist));
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
