/* 
 * glMatrix.js - High performance matrix and vector operations for WebGL
 * version 0.9.6
 */
 
/*
 * Copyright (c) 2011 Brandon Jones
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */

// Fallback for systems that don't support WebGL
if(typeof Float32Array != 'undefined') {
	glMatrixArrayType = Float32Array;
} else if(typeof WebGLFloatArray != 'undefined') {
	glMatrixArrayType = WebGLFloatArray; // This is officially deprecated and should dissapear in future revisions.
} else {
	glMatrixArrayType = Array;
}


/*
 * vec2 - 2 Dimensional Vector
 */
var vec2 = {};

/*
 * vec2.create
 * Creates a new instance of a vec2 using the default array type
 * Any javascript array containing at least 3 numeric elements can serve as a vec2
 *
 * Params:
 * vec - Optional, vec2 containing values to initialize with
 *
 * Returns:
 * New vec2
 */
vec2.create = function(vec) {
	var dest = new glMatrixArrayType(2);
	
	if(vec) {
		dest[0] = vec[0];
		dest[1] = vec[1];
	}
	
	return dest;
};

/*
 * vec2.set
 * Copies the values of one vec2 to another
 *
 * Params:
 * vec - vec2 containing values to copy
 * dest - vec2 receiving copied values
 *
 * Returns:
 * dest
 */
vec2.set = function(vec, dest) {
	dest[0] = vec[0];
	dest[1] = vec[1];
	
	return dest;
};



/*
 * vec3 - 3 Dimensional Vector
 */
var vec3 = {};

/*
 * vec3.create
 * Creates a new instance of a vec3 using the default array type
 * Any javascript array containing at least 3 numeric elements can serve as a vec3
 *
 * Params:
 * vec - Optional, vec3 containing values to initialize with
 *
 * Returns:
 * New vec3
 */
vec3.create = function(vec) {
	var dest = new glMatrixArrayType(3);
	
	if(vec) {
		dest[0] = vec[0];
		dest[1] = vec[1];
		dest[2] = vec[2];
	}
	
	return dest;
};

/*
 * vec3.set
 * Copies the values of one vec3 to another
 *
 * Params:
 * vec - vec3 containing values to copy
 * dest - vec3 receiving copied values
 *
 * Returns:
 * dest
 */
vec3.set = function(vec, dest) {
	dest[0] = vec[0];
	dest[1] = vec[1];
	dest[2] = vec[2];
	
	return dest;
};

/*
 * vec3.set_p
 * Copies the values of one vec3 to another
 *
 * Params:
 * a - vec3[0] containing values to copy
 * b - vec3[1] containing values to copy
 * c - vec3[2] containing values to copy
 * dest - vec3 receiving copied values
 *
 * Returns:
 * dest
 */
vec3.set_p = function(a, b, c, dest) {
	dest[0] = a;
	dest[1] = b;
	dest[2] = c;
	
	return dest;
};

/*
 * vec3.add
 * Performs a vector addition
 *
 * Params:
 * vec - vec3, first operand
 * vec2 - vec3, second operand
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.add = function(vec, vec2, dest) {
	if(!dest || vec == dest) {
		vec[0] += vec2[0];
		vec[1] += vec2[1];
		vec[2] += vec2[2];
		return vec;
	}
	
	dest[0] = vec[0] + vec2[0];
	dest[1] = vec[1] + vec2[1];
	dest[2] = vec[2] + vec2[2];
	return dest;
};

/*
 * vec3.subtract
 * Performs a vector subtraction
 *
 * Params:
 * vec - vec3, first operand
 * vec2 - vec3, second operand
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.subtract = function(vec, vec2, dest) {
	if(!dest || vec == dest) {
		vec[0] -= vec2[0];
		vec[1] -= vec2[1];
		vec[2] -= vec2[2];
		return vec;
	}
	
	dest[0] = vec[0] - vec2[0];
	dest[1] = vec[1] - vec2[1];
	dest[2] = vec[2] - vec2[2];
	return dest;
};

/*
 * vec3.negate
 * Negates the components of a vec3
 *
 * Params:
 * vec - vec3 to negate
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.negate = function(vec, dest) {
	if(!dest) { dest = vec; }
	
	dest[0] = -vec[0];
	dest[1] = -vec[1];
	dest[2] = -vec[2];
	return dest;
};

/*
 * vec3.scale
 * Multiplies the components of a vec3 by a scalar value
 *
 * Params:
 * vec - vec3 to scale
 * val - Numeric value to scale by
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.scale = function(vec, val, dest) {
	if(!dest || vec == dest) {
		vec[0] *= val;
		vec[1] *= val;
		vec[2] *= val;
		return vec;
	}
	
	dest[0] = vec[0]*val;
	dest[1] = vec[1]*val;
	dest[2] = vec[2]*val;
	return dest;
};

/*
 * vec3.normalize
 * Generates a unit vector of the same direction as the provided vec3
 * If vector length is 0, returns [0, 0, 0]
 *
 * Params:
 * vec - vec3 to normalize
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.normalize = function(vec, dest) {
	if(!dest) { dest = vec; }
	
	var x = vec[0], y = vec[1], z = vec[2];
	var len = Math.sqrt(x*x + y*y + z*z);
	
	if (!len) {
		dest[0] = 0;
		dest[1] = 0;
		dest[2] = 0;
		return dest;
	} else if (len == 1) {
		dest[0] = x;
		dest[1] = y;
		dest[2] = z;
		return dest;
	}
	
	len = 1 / len;
	dest[0] = x*len;
	dest[1] = y*len;
	dest[2] = z*len;
	return dest;
};

/*
 * vec3.cross
 * Generates the cross product of two vec3s
 *
 * Params:
 * vec - vec3, first operand
 * vec2 - vec3, second operand
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.cross = function(vec, vec2, dest){
	if(!dest) { dest = vec; }
	
	var x = vec[0], y = vec[1], z = vec[2];
	var x2 = vec2[0], y2 = vec2[1], z2 = vec2[2];
	
	dest[0] = y*z2 - z*y2;
	dest[1] = z*x2 - x*z2;
	dest[2] = x*y2 - y*x2;
	return dest;
};

/*
 * vec3.length
 * Caclulates the length of a vec3
 *
 * Params:
 * vec - vec3 to calculate length of
 *
 * Returns:
 * Length of vec
 */
vec3.length = function(vec){
	var x = vec[0], y = vec[1], z = vec[2];
	return Math.sqrt(x*x + y*y + z*z);
};

/*
 * vec3.dot
 * Caclulates the dot product of two vec3s
 *
 * Params:
 * vec - vec3, first operand
 * vec2 - vec3, second operand
 *
 * Returns:
 * Dot product of vec and vec2
 */
vec3.dot = function(vec, vec2){
	return vec[0]*vec2[0] + vec[1]*vec2[1] + vec[2]*vec2[2];
};

/*
 * vec3.direction
 * Generates a unit vector pointing from one vector to another
 *
 * Params:
 * vec - origin vec3
 * vec2 - vec3 to point to
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.direction = function(vec, vec2, dest) {
	if(!dest) { dest = vec; }
	
	var x = vec[0] - vec2[0];
	var y = vec[1] - vec2[1];
	var z = vec[2] - vec2[2];
	
	var len = Math.sqrt(x*x + y*y + z*z);
	if (!len) { 
		dest[0] = 0; 
		dest[1] = 0; 
		dest[2] = 0;
		return dest; 
	}
	
	len = 1 / len;
	dest[0] = x * len; 
	dest[1] = y * len; 
	dest[2] = z * len;
	return dest; 
};

/*
 * vec3.lerp
 * Performs a linear interpolation between two vec3
 *
 * Params:
 * vec - vec3, first vector
 * vec2 - vec3, second vector
 * lerp - interpolation amount between the two inputs
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.lerp = function(vec, vec2, lerp, dest){
    if(!dest) { dest = vec; }
    
    dest[0] = vec[0] + lerp * (vec2[0] - vec[0]);
    dest[1] = vec[1] + lerp * (vec2[1] - vec[1]);
    dest[2] = vec[2] + lerp * (vec2[2] - vec[2]);
    
    return dest;
}

/*
 * vec3.str
 * Returns a string representation of a vector
 *
 * Params:
 * vec - vec3 to represent as a string
 *
 * Returns:
 * string representation of vec
 */
vec3.str = function(vec) {
	return '[' + vec[0] + ', ' + vec[1] + ', ' + vec[2] + ']'; 
};

/*
 * mat3 - 3x3 Matrix
 */
var mat3 = {};

/*
 * mat3.create
 * Creates a new instance of a mat3 using the default array type
 * Any javascript array containing at least 9 numeric elements can serve as a mat3
 *
 * Params:
 * mat - Optional, mat3 containing values to initialize with
 *
 * Returns:
 * New mat3
 */
mat3.create = function(mat) {
	var dest = new glMatrixArrayType(9);
	
	if(mat) {
		dest[0] = mat[0];
		dest[1] = mat[1];
		dest[2] = mat[2];
		dest[3] = mat[3];
		dest[4] = mat[4];
		dest[5] = mat[5];
		dest[6] = mat[6];
		dest[7] = mat[7];
		dest[8] = mat[8];
	}
	
	return dest;
};

/*
 * mat3.set
 * Copies the values of one mat3 to another
 *
 * Params:
 * mat - mat3 containing values to copy
 * dest - mat3 receiving copied values
 *
 * Returns:
 * dest
 */
mat3.set = function(mat, dest) {
	dest[0] = mat[0];
	dest[1] = mat[1];
	dest[2] = mat[2];
	dest[3] = mat[3];
	dest[4] = mat[4];
	dest[5] = mat[5];
	dest[6] = mat[6];
	dest[7] = mat[7];
	dest[8] = mat[8];
	return dest;
};

/*
 * mat3.identity
 * Sets a mat3 to an identity matrix
 *
 * Params:
 * dest - mat3 to set
 *
 * Returns:
 * dest
 */
mat3.identity = function(dest) {
	dest[0] = 1;
	dest[1] = 0;
	dest[2] = 0;
	dest[3] = 0;
	dest[4] = 1;
	dest[5] = 0;
	dest[6] = 0;
	dest[7] = 0;
	dest[8] = 1;
	return dest;
};

/*
 * mat4.transpose
 * Transposes a mat3 (flips the values over the diagonal)
 *
 * Params:
 * mat - mat3 to transpose
 * dest - Optional, mat3 receiving transposed values. If not specified result is written to mat
 *
 * Returns:
 * dest is specified, mat otherwise
 */
mat3.transpose = function(mat, dest) {
	// If we are transposing ourselves we can skip a few steps but have to cache some values
	if(!dest || mat == dest) { 
		var a01 = mat[1], a02 = mat[2];
		var a12 = mat[5];
		
        mat[1] = mat[3];
        mat[2] = mat[6];
        mat[3] = a01;
        mat[5] = mat[7];
        mat[6] = a02;
        mat[7] = a12;
		return mat;
	}
	
	dest[0] = mat[0];
	dest[1] = mat[3];
	dest[2] = mat[6];
	dest[3] = mat[1];
	dest[4] = mat[4];
	dest[5] = mat[7];
	dest[6] = mat[2];
	dest[7] = mat[5];
	dest[8] = mat[8];
	return dest;
};

/*
 * mat3.toMat4
 * Copies the elements of a mat3 into the upper 3x3 elements of a mat4
 *
 * Params:
 * mat - mat3 containing values to copy
 * dest - Optional, mat4 receiving copied values
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
mat3.toMat4 = function(mat, dest) {
	if(!dest) { dest = mat4.create(); }
	
	dest[0] = mat[0];
	dest[1] = mat[1];
	dest[2] = mat[2];
	dest[3] = 0;

	dest[4] = mat[3];
	dest[5] = mat[4];
	dest[6] = mat[5];
	dest[7] = 0;

	dest[8] = mat[6];
	dest[9] = mat[7];
	dest[10] = mat[8];
	dest[11] = 0;

	dest[12] = 0;
	dest[13] = 0;
	dest[14] = 0;
	dest[15] = 1;
	
	return dest;
}

/*
 * mat3.str
 * Returns a string representation of a mat3
 *
 * Params:
 * mat - mat3 to represent as a string
 *
 * Returns:
 * string representation of mat
 */
mat3.str = function(mat) {
	return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] + 
		', ' + mat[3] + ', '+ mat[4] + ', ' + mat[5] + 
		', ' + mat[6] + ', ' + mat[7] + ', '+ mat[8] + ']';
};

/*
 * mat4 - 4x4 Matrix
 */
var mat4 = {};

/*
 * mat4.create
 * Creates a new instance of a mat4 using the default array type
 * Any javascript array containing at least 16 numeric elements can serve as a mat4
 *
 * Params:
 * mat - Optional, mat4 containing values to initialize with
 *
 * Returns:
 * New mat4
 */
mat4.create = function(mat) {
	var dest = new glMatrixArrayType(16);
	
	if(mat) {
		dest[0] = mat[0];
		dest[1] = mat[1];
		dest[2] = mat[2];
		dest[3] = mat[3];
		dest[4] = mat[4];
		dest[5] = mat[5];
		dest[6] = mat[6];
		dest[7] = mat[7];
		dest[8] = mat[8];
		dest[9] = mat[9];
		dest[10] = mat[10];
		dest[11] = mat[11];
		dest[12] = mat[12];
		dest[13] = mat[13];
		dest[14] = mat[14];
		dest[15] = mat[15];
	}
	
	return dest;
};

/*
 * mat4.set
 * Copies the values of one mat4 to another
 *
 * Params:
 * mat - mat4 containing values to copy
 * dest - mat4 receiving copied values
 *
 * Returns:
 * dest
 */
mat4.set = function(mat, dest) {
	dest[0] = mat[0];
	dest[1] = mat[1];
	dest[2] = mat[2];
	dest[3] = mat[3];
	dest[4] = mat[4];
	dest[5] = mat[5];
	dest[6] = mat[6];
	dest[7] = mat[7];
	dest[8] = mat[8];
	dest[9] = mat[9];
	dest[10] = mat[10];
	dest[11] = mat[11];
	dest[12] = mat[12];
	dest[13] = mat[13];
	dest[14] = mat[14];
	dest[15] = mat[15];
	return dest;
};

/*
 * mat4.identity
 * Sets a mat4 to an identity matrix
 *
 * Params:
 * dest - mat4 to set
 *
 * Returns:
 * dest
 */
mat4.identity = function(dest) {
	dest[0] = 1;
	dest[1] = 0;
	dest[2] = 0;
	dest[3] = 0;
	dest[4] = 0;
	dest[5] = 1;
	dest[6] = 0;
	dest[7] = 0;
	dest[8] = 0;
	dest[9] = 0;
	dest[10] = 1;
	dest[11] = 0;
	dest[12] = 0;
	dest[13] = 0;
	dest[14] = 0;
	dest[15] = 1;
	return dest;
};

/*
 * mat4.transpose
 * Transposes a mat4 (flips the values over the diagonal)
 *
 * Params:
 * mat - mat4 to transpose
 * dest - Optional, mat4 receiving transposed values. If not specified result is written to mat
 *
 * Returns:
 * dest is specified, mat otherwise
 */
mat4.transpose = function(mat, dest) {
	// If we are transposing ourselves we can skip a few steps but have to cache some values
	if(!dest || mat == dest) { 
		var a01 = mat[1], a02 = mat[2], a03 = mat[3];
		var a12 = mat[6], a13 = mat[7];
		var a23 = mat[11];
		
		mat[1] = mat[4];
		mat[2] = mat[8];
		mat[3] = mat[12];
		mat[4] = a01;
		mat[6] = mat[9];
		mat[7] = mat[13];
		mat[8] = a02;
		mat[9] = a12;
		mat[11] = mat[14];
		mat[12] = a03;
		mat[13] = a13;
		mat[14] = a23;
		return mat;
	}
	
	dest[0] = mat[0];
	dest[1] = mat[4];
	dest[2] = mat[8];
	dest[3] = mat[12];
	dest[4] = mat[1];
	dest[5] = mat[5];
	dest[6] = mat[9];
	dest[7] = mat[13];
	dest[8] = mat[2];
	dest[9] = mat[6];
	dest[10] = mat[10];
	dest[11] = mat[14];
	dest[12] = mat[3];
	dest[13] = mat[7];
	dest[14] = mat[11];
	dest[15] = mat[15];
	return dest;
};

/*
 * mat4.determinant
 * Calculates the determinant of a mat4
 *
 * Params:
 * mat - mat4 to calculate determinant of
 *
 * Returns:
 * determinant of mat
 */
mat4.determinant = function(mat) {
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

	return	a30*a21*a12*a03 - a20*a31*a12*a03 - a30*a11*a22*a03 + a10*a31*a22*a03 +
			a20*a11*a32*a03 - a10*a21*a32*a03 - a30*a21*a02*a13 + a20*a31*a02*a13 +
			a30*a01*a22*a13 - a00*a31*a22*a13 - a20*a01*a32*a13 + a00*a21*a32*a13 +
			a30*a11*a02*a23 - a10*a31*a02*a23 - a30*a01*a12*a23 + a00*a31*a12*a23 +
			a10*a01*a32*a23 - a00*a11*a32*a23 - a20*a11*a02*a33 + a10*a21*a02*a33 +
			a20*a01*a12*a33 - a00*a21*a12*a33 - a10*a01*a22*a33 + a00*a11*a22*a33;
};

/*
 * mat4.inverse
 * Calculates the inverse matrix of a mat4
 *
 * Params:
 * mat - mat4 to calculate inverse of
 * dest - Optional, mat4 receiving inverse matrix. If not specified result is written to mat
 *
 * Returns:
 * dest is specified, mat otherwise
 */
mat4.inverse = function(mat, dest) {
	if(!dest) { dest = mat; }
	
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
	
	var b00 = a00*a11 - a01*a10;
	var b01 = a00*a12 - a02*a10;
	var b02 = a00*a13 - a03*a10;
	var b03 = a01*a12 - a02*a11;
	var b04 = a01*a13 - a03*a11;
	var b05 = a02*a13 - a03*a12;
	var b06 = a20*a31 - a21*a30;
	var b07 = a20*a32 - a22*a30;
	var b08 = a20*a33 - a23*a30;
	var b09 = a21*a32 - a22*a31;
	var b10 = a21*a33 - a23*a31;
	var b11 = a22*a33 - a23*a32;
	
	// Calculate the determinant (inlined to avoid double-caching)
	var invDet = 1/(b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06);
	
	dest[0] = (a11*b11 - a12*b10 + a13*b09)*invDet;
	dest[1] = (-a01*b11 + a02*b10 - a03*b09)*invDet;
	dest[2] = (a31*b05 - a32*b04 + a33*b03)*invDet;
	dest[3] = (-a21*b05 + a22*b04 - a23*b03)*invDet;
	dest[4] = (-a10*b11 + a12*b08 - a13*b07)*invDet;
	dest[5] = (a00*b11 - a02*b08 + a03*b07)*invDet;
	dest[6] = (-a30*b05 + a32*b02 - a33*b01)*invDet;
	dest[7] = (a20*b05 - a22*b02 + a23*b01)*invDet;
	dest[8] = (a10*b10 - a11*b08 + a13*b06)*invDet;
	dest[9] = (-a00*b10 + a01*b08 - a03*b06)*invDet;
	dest[10] = (a30*b04 - a31*b02 + a33*b00)*invDet;
	dest[11] = (-a20*b04 + a21*b02 - a23*b00)*invDet;
	dest[12] = (-a10*b09 + a11*b07 - a12*b06)*invDet;
	dest[13] = (a00*b09 - a01*b07 + a02*b06)*invDet;
	dest[14] = (-a30*b03 + a31*b01 - a32*b00)*invDet;
	dest[15] = (a20*b03 - a21*b01 + a22*b00)*invDet;
	
	return dest;
};

/*
 * mat4.toRotationMat
 * Copies the upper 3x3 elements of a mat4 into another mat4
 *
 * Params:
 * mat - mat4 containing values to copy
 * dest - Optional, mat4 receiving copied values
 *
 * Returns:
 * dest is specified, a new mat4 otherwise
 */
mat4.toRotationMat = function(mat, dest) {
	if(!dest) { dest = mat4.create(); }
	
	dest[0] = mat[0];
	dest[1] = mat[1];
	dest[2] = mat[2];
	dest[3] = mat[3];
	dest[4] = mat[4];
	dest[5] = mat[5];
	dest[6] = mat[6];
	dest[7] = mat[7];
	dest[8] = mat[8];
	dest[9] = mat[9];
	dest[10] = mat[10];
	dest[11] = mat[11];
	dest[12] = 0;
	dest[13] = 0;
	dest[14] = 0;
	dest[15] = 1;
	
	return dest;
};

/*
 * mat4.toMat3
 * Copies the upper 3x3 elements of a mat4 into a mat3
 *
 * Params:
 * mat - mat4 containing values to copy
 * dest - Optional, mat3 receiving copied values
 *
 * Returns:
 * dest is specified, a new mat3 otherwise
 */
mat4.toMat3 = function(mat, dest) {
	if(!dest) { dest = mat3.create(); }
	
	dest[0] = mat[0];
	dest[1] = mat[1];
	dest[2] = mat[2];
	dest[3] = mat[4];
	dest[4] = mat[5];
	dest[5] = mat[6];
	dest[6] = mat[8];
	dest[7] = mat[9];
	dest[8] = mat[10];
	
	return dest;
};

/*
 * mat4.toInverseMat3
 * Calculates the inverse of the upper 3x3 elements of a mat4 and copies the result into a mat3
 * The resulting matrix is useful for calculating transformed normals
 *
 * Params:
 * mat - mat4 containing values to invert and copy
 * dest - Optional, mat3 receiving values
 *
 * Returns:
 * dest is specified, a new mat3 otherwise
 */
mat4.toInverseMat3 = function(mat, dest) {
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10];
	
	var b01 = a22*a11-a12*a21;
	var b11 = -a22*a10+a12*a20;
	var b21 = a21*a10-a11*a20;
		
	var d = a00*b01 + a01*b11 + a02*b21;
	if (!d) { return null; }
	var id = 1/d;
	
	if(!dest) { dest = mat3.create(); }
	
	dest[0] = b01*id;
	dest[1] = (-a22*a01 + a02*a21)*id;
	dest[2] = (a12*a01 - a02*a11)*id;
	dest[3] = b11*id;
	dest[4] = (a22*a00 - a02*a20)*id;
	dest[5] = (-a12*a00 + a02*a10)*id;
	dest[6] = b21*id;
	dest[7] = (-a21*a00 + a01*a20)*id;
	dest[8] = (a11*a00 - a01*a10)*id;
	
	return dest;
};

/*
 * mat4.multiply
 * Performs a matrix multiplication
 *
 * Params:
 * mat - mat4, first operand
 * mat2 - mat4, second operand
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.multiply = function(mat, mat2, dest) {
	if(!dest) { dest = mat }
	
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
	
	var b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3];
	var b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7];
	var b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11];
	var b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15];
	
	dest[0] = b00*a00 + b01*a10 + b02*a20 + b03*a30;
	dest[1] = b00*a01 + b01*a11 + b02*a21 + b03*a31;
	dest[2] = b00*a02 + b01*a12 + b02*a22 + b03*a32;
	dest[3] = b00*a03 + b01*a13 + b02*a23 + b03*a33;
	dest[4] = b10*a00 + b11*a10 + b12*a20 + b13*a30;
	dest[5] = b10*a01 + b11*a11 + b12*a21 + b13*a31;
	dest[6] = b10*a02 + b11*a12 + b12*a22 + b13*a32;
	dest[7] = b10*a03 + b11*a13 + b12*a23 + b13*a33;
	dest[8] = b20*a00 + b21*a10 + b22*a20 + b23*a30;
	dest[9] = b20*a01 + b21*a11 + b22*a21 + b23*a31;
	dest[10] = b20*a02 + b21*a12 + b22*a22 + b23*a32;
	dest[11] = b20*a03 + b21*a13 + b22*a23 + b23*a33;
	dest[12] = b30*a00 + b31*a10 + b32*a20 + b33*a30;
	dest[13] = b30*a01 + b31*a11 + b32*a21 + b33*a31;
	dest[14] = b30*a02 + b31*a12 + b32*a22 + b33*a32;
	dest[15] = b30*a03 + b31*a13 + b32*a23 + b33*a33;
	
	return dest;
};

/*
 * mat4.multiplyVec3
 * Transforms a vec3 with the given matrix
 * 4th vector component is implicitly '1'
 *
 * Params:
 * mat - mat4 to transform the vector with
 * vec - vec3 to transform
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
mat4.multiplyVec3 = function(mat, vec, dest) {
	if(!dest) { dest = vec }
	
	var x = vec[0], y = vec[1], z = vec[2];
	
	dest[0] = mat[0]*x + mat[4]*y + mat[8]*z + mat[12];
	dest[1] = mat[1]*x + mat[5]*y + mat[9]*z + mat[13];
	dest[2] = mat[2]*x + mat[6]*y + mat[10]*z + mat[14];
	
	return dest;
};

/*
 * mat4.multiplyVec4
 * Transforms a vec4 with the given matrix
 *
 * Params:
 * mat - mat4 to transform the vector with
 * vec - vec4 to transform
 * dest - Optional, vec4 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
mat4.multiplyVec4 = function(mat, vec, dest) {
	if(!dest) { dest = vec }
	
	var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
	
	dest[0] = mat[0]*x + mat[4]*y + mat[8]*z + mat[12]*w;
	dest[1] = mat[1]*x + mat[5]*y + mat[9]*z + mat[13]*w;
	dest[2] = mat[2]*x + mat[6]*y + mat[10]*z + mat[14]*w;
	dest[3] = mat[3]*x + mat[7]*y + mat[11]*z + mat[15]*w;
	
	return dest;
};

/*
 * mat4.translate
 * Translates a matrix by the given vector
 *
 * Params:
 * mat - mat4 to translate
 * vec - vec3 specifying the translation
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.translate = function(mat, vec, dest) {
	var x = vec[0], y = vec[1], z = vec[2];
	
	if(!dest || mat == dest) {
		mat[12] = mat[0]*x + mat[4]*y + mat[8]*z + mat[12];
		mat[13] = mat[1]*x + mat[5]*y + mat[9]*z + mat[13];
		mat[14] = mat[2]*x + mat[6]*y + mat[10]*z + mat[14];
		mat[15] = mat[3]*x + mat[7]*y + mat[11]*z + mat[15];
		return mat;
	}
	
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	
	dest[0] = a00;
	dest[1] = a01;
	dest[2] = a02;
	dest[3] = a03;
	dest[4] = a10;
	dest[5] = a11;
	dest[6] = a12;
	dest[7] = a13;
	dest[8] = a20;
	dest[9] = a21;
	dest[10] = a22;
	dest[11] = a23;
	
	dest[12] = a00*x + a10*y + a20*z + mat[12];
	dest[13] = a01*x + a11*y + a21*z + mat[13];
	dest[14] = a02*x + a12*y + a22*z + mat[14];
	dest[15] = a03*x + a13*y + a23*z + mat[15];
	return dest;
};

mat4.translateXYZ = function(mat, x, y, z, dest) {
	
	if(!dest || mat == dest) {
		mat[12] = mat[0]*x + mat[4]*y + mat[8]*z + mat[12];
		mat[13] = mat[1]*x + mat[5]*y + mat[9]*z + mat[13];
		mat[14] = mat[2]*x + mat[6]*y + mat[10]*z + mat[14];
		mat[15] = mat[3]*x + mat[7]*y + mat[11]*z + mat[15];
		return mat;
	}
	
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	
	dest[0] = a00;
	dest[1] = a01;
	dest[2] = a02;
	dest[3] = a03;
	dest[4] = a10;
	dest[5] = a11;
	dest[6] = a12;
	dest[7] = a13;
	dest[8] = a20;
	dest[9] = a21;
	dest[10] = a22;
	dest[11] = a23;
	
	dest[12] = a00*x + a10*y + a20*z + mat[12];
	dest[13] = a01*x + a11*y + a21*z + mat[13];
	dest[14] = a02*x + a12*y + a22*z + mat[14];
	dest[15] = a03*x + a13*y + a23*z + mat[15];
	return dest;
};

/*
 * mat4.scale
 * Scales a matrix by the given vector
 *
 * Params:
 * mat - mat4 to scale
 * vec - vec3 specifying the scale for each axis
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.scale = function(mat, vec, dest) {
	var x = vec[0], y = vec[1], z = vec[2];
	
	if(!dest || mat == dest) {
		mat[0] *= x;
		mat[1] *= x;
		mat[2] *= x;
		mat[3] *= x;
		mat[4] *= y;
		mat[5] *= y;
		mat[6] *= y;
		mat[7] *= y;
		mat[8] *= z;
		mat[9] *= z;
		mat[10] *= z;
		mat[11] *= z;
		return mat;
	}
	
	dest[0] = mat[0]*x;
	dest[1] = mat[1]*x;
	dest[2] = mat[2]*x;
	dest[3] = mat[3]*x;
	dest[4] = mat[4]*y;
	dest[5] = mat[5]*y;
	dest[6] = mat[6]*y;
	dest[7] = mat[7]*y;
	dest[8] = mat[8]*z;
	dest[9] = mat[9]*z;
	dest[10] = mat[10]*z;
	dest[11] = mat[11]*z;
	dest[12] = mat[12];
	dest[13] = mat[13];
	dest[14] = mat[14];
	dest[15] = mat[15];
	return dest;
};

mat4.scaleXY = function(mat, s, dest) {

	if(!dest || mat == dest) {
		mat[0] *= s;
		mat[1] *= s;
		mat[2] *= s;
		mat[3] *= s;
		mat[4] *= s;
		mat[5] *= s;
		mat[6] *= s;
		mat[7] *= s;
		return mat;
	}
	
	dest[0] = mat[0]*s;
	dest[1] = mat[1]*s;
	dest[2] = mat[2]*s;
	dest[3] = mat[3]*s;
	dest[4] = mat[4]*s;
	dest[5] = mat[5]*s;
	dest[6] = mat[6]*s;
	dest[7] = mat[7]*s;
	dest[8] = mat[8];
	dest[9] = mat[9];
	dest[10] = mat[10];
	dest[11] = mat[11];
	dest[12] = mat[12];
	dest[13] = mat[13];
	dest[14] = mat[14];
	dest[15] = mat[15];
	return dest;
};

/*
 * mat4.rotate
 * Rotates a matrix by the given angle around the specified axis
 * If rotating around a primary axis (X,Y,Z) one of the specialized rotation functions should be used instead for performance
 *
 * Params:
 * mat - mat4 to rotate
 * angle - angle (in radians) to rotate
 * axis - vec3 representing the axis to rotate around 
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.rotate = function(mat, angle, axis, dest) {
	var x = axis[0], y = axis[1], z = axis[2];
	var len = Math.sqrt(x*x + y*y + z*z);
	if (!len) { return null; }
	if (len != 1) {
		len = 1 / len;
		x *= len; 
		y *= len; 
		z *= len;
	}
	
	var s = Math.sin(angle);
	var c = Math.cos(angle);
	var t = 1-c;
	
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	
	// Construct the elements of the rotation matrix
	var b00 = x*x*t + c, b01 = y*x*t + z*s, b02 = z*x*t - y*s;
	var b10 = x*y*t - z*s, b11 = y*y*t + c, b12 = z*y*t + x*s;
	var b20 = x*z*t + y*s, b21 = y*z*t - x*s, b22 = z*z*t + c;
	
	if(!dest) { 
		dest = mat 
	} else if(mat != dest) { // If the source and destination differ, copy the unchanged last row
		dest[12] = mat[12];
		dest[13] = mat[13];
		dest[14] = mat[14];
		dest[15] = mat[15];
	}
	
	// Perform rotation-specific matrix multiplication
	dest[0] = a00*b00 + a10*b01 + a20*b02;
	dest[1] = a01*b00 + a11*b01 + a21*b02;
	dest[2] = a02*b00 + a12*b01 + a22*b02;
	dest[3] = a03*b00 + a13*b01 + a23*b02;
	
	dest[4] = a00*b10 + a10*b11 + a20*b12;
	dest[5] = a01*b10 + a11*b11 + a21*b12;
	dest[6] = a02*b10 + a12*b11 + a22*b12;
	dest[7] = a03*b10 + a13*b11 + a23*b12;
	
	dest[8] = a00*b20 + a10*b21 + a20*b22;
	dest[9] = a01*b20 + a11*b21 + a21*b22;
	dest[10] = a02*b20 + a12*b21 + a22*b22;
	dest[11] = a03*b20 + a13*b21 + a23*b22;
	return dest;
};

/*
 * mat4.rotateX
 * Rotates a matrix by the given angle around the X axis
 *
 * Params:
 * mat - mat4 to rotate
 * angle - angle (in radians) to rotate
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.rotateX = function(mat, angle, dest) {
	var s = Math.sin(angle);
	var c = Math.cos(angle);
	
	// Cache the matrix values (makes for huge speed increases!)
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];

	if(!dest) { 
		dest = mat 
	} else if(mat != dest) { // If the source and destination differ, copy the unchanged rows
		dest[0] = mat[0];
		dest[1] = mat[1];
		dest[2] = mat[2];
		dest[3] = mat[3];
		
		dest[12] = mat[12];
		dest[13] = mat[13];
		dest[14] = mat[14];
		dest[15] = mat[15];
	}
	
	// Perform axis-specific matrix multiplication
	dest[4] = a10*c + a20*s;
	dest[5] = a11*c + a21*s;
	dest[6] = a12*c + a22*s;
	dest[7] = a13*c + a23*s;
	
	dest[8] = a10*-s + a20*c;
	dest[9] = a11*-s + a21*c;
	dest[10] = a12*-s + a22*c;
	dest[11] = a13*-s + a23*c;
	return dest;
};

/*
 * mat4.rotateY
 * Rotates a matrix by the given angle around the Y axis
 *
 * Params:
 * mat - mat4 to rotate
 * angle - angle (in radians) to rotate
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.rotateY = function(mat, angle, dest) {
	var s = Math.sin(angle);
	var c = Math.cos(angle);
	
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
	
	if(!dest) { 
		dest = mat 
	} else if(mat != dest) { // If the source and destination differ, copy the unchanged rows
		dest[4] = mat[4];
		dest[5] = mat[5];
		dest[6] = mat[6];
		dest[7] = mat[7];
		
		dest[12] = mat[12];
		dest[13] = mat[13];
		dest[14] = mat[14];
		dest[15] = mat[15];
	}
	
	// Perform axis-specific matrix multiplication
	dest[0] = a00*c + a20*-s;
	dest[1] = a01*c + a21*-s;
	dest[2] = a02*c + a22*-s;
	dest[3] = a03*c + a23*-s;
	
	dest[8] = a00*s + a20*c;
	dest[9] = a01*s + a21*c;
	dest[10] = a02*s + a22*c;
	dest[11] = a03*s + a23*c;
	return dest;
};

/*
 * mat4.rotateZ
 * Rotates a matrix by the given angle around the Z axis
 *
 * Params:
 * mat - mat4 to rotate
 * angle - angle (in radians) to rotate
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.rotateZ = function(mat, angle, dest) {
	var s = Math.sin(angle);
	var c = Math.cos(angle);
	
	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
	var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
	
	if(!dest) { 
		dest = mat 
	} else if(mat != dest) { // If the source and destination differ, copy the unchanged last row
		dest[8] = mat[8];
		dest[9] = mat[9];
		dest[10] = mat[10];
		dest[11] = mat[11];
		
		dest[12] = mat[12];
		dest[13] = mat[13];
		dest[14] = mat[14];
		dest[15] = mat[15];
	}
	
	// Perform axis-specific matrix multiplication
	dest[0] = a00*c + a10*s;
	dest[1] = a01*c + a11*s;
	dest[2] = a02*c + a12*s;
	dest[3] = a03*c + a13*s;
	
	dest[4] = a00*-s + a10*c;
	dest[5] = a01*-s + a11*c;
	dest[6] = a02*-s + a12*c;
	dest[7] = a03*-s + a13*c;
	
	return dest;
};

/*
 * mat4.frustum
 * Generates a frustum matrix with the given bounds
 *
 * Params:
 * left, right - scalar, left and right bounds of the frustum
 * bottom, top - scalar, bottom and top bounds of the frustum
 * near, far - scalar, near and far bounds of the frustum
 * dest - Optional, mat4 frustum matrix will be written into
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
mat4.frustum = function(left, right, bottom, top, near, far, dest) {
	if(!dest) { dest = mat4.create(); }
	var rl = (right - left);
	var tb = (top - bottom);
	var fn = (far - near);
	dest[0] = (near*2) / rl;
	dest[1] = 0;
	dest[2] = 0;
	dest[3] = 0;
	dest[4] = 0;
	dest[5] = (near*2) / tb;
	dest[6] = 0;
	dest[7] = 0;
	dest[8] = (right + left) / rl;
	dest[9] = (top + bottom) / tb;
	dest[10] = -(far + near) / fn;
	dest[11] = -1;
	dest[12] = 0;
	dest[13] = 0;
	dest[14] = -(far*near*2) / fn;
	dest[15] = 0;
	return dest;
};

/*
 * mat4.perspective
 * Generates a perspective projection matrix with the given bounds
 *
 * Params:
 * fovy - scalar, vertical field of view
 * aspect - scalar, aspect ratio. typically viewport width/height
 * near, far - scalar, near and far bounds of the frustum
 * dest - Optional, mat4 frustum matrix will be written into
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
mat4.perspective = function(fovy, aspect, near, far, dest) {
	var top = near*Math.tan(fovy*Math.PI / 360.0);
	var right = top*aspect;
	return mat4.frustum(-right, right, -top, top, near, far, dest);
};

/*
 * mat4.ortho
 * Generates a orthogonal projection matrix with the given bounds
 *
 * Params:
 * left, right - scalar, left and right bounds of the frustum
 * bottom, top - scalar, bottom and top bounds of the frustum
 * near, far - scalar, near and far bounds of the frustum
 * dest - Optional, mat4 frustum matrix will be written into
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
mat4.ortho = function(left, right, bottom, top, near, far, dest) {
	if(!dest) { dest = mat4.create(); }
	var rl = (right - left);
	var tb = (top - bottom);
	var fn = (far - near);
	dest[0] = 2 / rl;
	dest[1] = 0;
	dest[2] = 0;
	dest[3] = 0;
	dest[4] = 0;
	dest[5] = 2 / tb;
	dest[6] = 0;
	dest[7] = 0;
	dest[8] = 0;
	dest[9] = 0;
	dest[10] = -2 / fn;
	dest[11] = 0;
	dest[12] = -(left + right) / rl;
	dest[13] = -(top + bottom) / tb;
	dest[14] = -(far + near) / fn;
	dest[15] = 1;
	return dest;
};

/*
 * mat4.ortho
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * Params:
 * eye - vec3, position of the viewer
 * center - vec3, point the viewer is looking at
 * up - vec3 pointing "up"
 * dest - Optional, mat4 frustum matrix will be written into
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
mat4.lookAt = function(eye, center, up, dest) {
	if(!dest) { dest = mat4.create(); }
	
	var eyex = eye[0],
		eyey = eye[1],
		eyez = eye[2],
		upx = up[0],
		upy = up[1],
		upz = up[2],
		centerx = center[0],
		centery = center[1],
		centerz = center[2];

	if (eyex == centerx && eyey == centery && eyez == centerz) {
		return mat4.identity(dest);
	}
	
	var z0,z1,z2,x0,x1,x2,y0,y1,y2,len;
	
	//vec3.direction(eye, center, z);
	z0 = eyex - center[0];
	z1 = eyey - center[1];
	z2 = eyez - center[2];
	
	// normalize (no check needed for 0 because of early return)
	len = 1/Math.sqrt(z0*z0 + z1*z1 + z2*z2);
	z0 *= len;
	z1 *= len;
	z2 *= len;
	
	//vec3.normalize(vec3.cross(up, z, x));
	x0 = upy*z2 - upz*z1;
	x1 = upz*z0 - upx*z2;
	x2 = upx*z1 - upy*z0;
	len = Math.sqrt(x0*x0 + x1*x1 + x2*x2);
	if (!len) {
		x0 = 0;
		x1 = 0;
		x2 = 0;
	} else {
		len = 1/len;
		x0 *= len;
		x1 *= len;
		x2 *= len;
	};
	
	//vec3.normalize(vec3.cross(z, x, y));
	y0 = z1*x2 - z2*x1;
	y1 = z2*x0 - z0*x2;
	y2 = z0*x1 - z1*x0;
	
	len = Math.sqrt(y0*y0 + y1*y1 + y2*y2);
	if (!len) {
		y0 = 0;
		y1 = 0;
		y2 = 0;
	} else {
		len = 1/len;
		y0 *= len;
		y1 *= len;
		y2 *= len;
	}
	
	dest[0] = x0;
	dest[1] = y0;
	dest[2] = z0;
	dest[3] = 0;
	dest[4] = x1;
	dest[5] = y1;
	dest[6] = z1;
	dest[7] = 0;
	dest[8] = x2;
	dest[9] = y2;
	dest[10] = z2;
	dest[11] = 0;
	dest[12] = -(x0*eyex + x1*eyey + x2*eyez);
	dest[13] = -(y0*eyex + y1*eyey + y2*eyez);
	dest[14] = -(z0*eyex + z1*eyey + z2*eyez);
	dest[15] = 1;
	
	return dest;
};

/*
 * mat4.str
 * Returns a string representation of a mat4
 *
 * Params:
 * mat - mat4 to represent as a string
 *
 * Returns:
 * string representation of mat
 */
mat4.str = function(mat) {
	return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] + ', ' + mat[3] + 
		', '+ mat[4] + ', ' + mat[5] + ', ' + mat[6] + ', ' + mat[7] + 
		', '+ mat[8] + ', ' + mat[9] + ', ' + mat[10] + ', ' + mat[11] + 
		', '+ mat[12] + ', ' + mat[13] + ', ' + mat[14] + ', ' + mat[15] + ']';
};

/*
 * quat4 - Quaternions 
 */
quat4 = {};

/*
 * quat4.create
 * Creates a new instance of a quat4 using the default array type
 * Any javascript array containing at least 4 numeric elements can serve as a quat4
 *
 * Params:
 * quat - Optional, quat4 containing values to initialize with
 *
 * Returns:
 * New quat4
 */
quat4.create = function(quat) {
	var dest = new glMatrixArrayType(4);
	
	if(quat) {
		dest[0] = quat[0];
		dest[1] = quat[1];
		dest[2] = quat[2];
		dest[3] = quat[3];
	}
	
	return dest;
};

/*
 * quat4.set
 * Copies the values of one quat4 to another
 *
 * Params:
 * quat - quat4 containing values to copy
 * dest - quat4 receiving copied values
 *
 * Returns:
 * dest
 */
quat4.set = function(quat, dest) {
	dest[0] = quat[0];
	dest[1] = quat[1];
	dest[2] = quat[2];
	dest[3] = quat[3];
	
	return dest;
};

/*
 * quat4.calculateW
 * Calculates the W component of a quat4 from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length. 
 * Any existing W component will be ignored. 
 *
 * Params:
 * quat - quat4 to calculate W component of
 * dest - Optional, quat4 receiving calculated values. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
quat4.calculateW = function(quat, dest) {
	var x = quat[0], y = quat[1], z = quat[2];

	if(!dest || quat == dest) {
		quat[3] = -Math.sqrt(Math.abs(1.0 - x*x - y*y - z*z));
		return quat;
	}
	dest[0] = x;
	dest[1] = y;
	dest[2] = z;
	dest[3] = -Math.sqrt(Math.abs(1.0 - x*x - y*y - z*z));
	return dest;
}

/*
 * quat4.inverse
 * Calculates the inverse of a quat4
 *
 * Params:
 * quat - quat4 to calculate inverse of
 * dest - Optional, quat4 receiving inverse values. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
quat4.inverse = function(quat, dest) {
	if(!dest || quat == dest) {
		quat[0] *= -1;
		quat[1] *= -1;
		quat[2] *= -1;
		return quat;
	}
	dest[0] = -quat[0];
	dest[1] = -quat[1];
	dest[2] = -quat[2];
	dest[3] = quat[3];
	return dest;
}

/*
 * quat4.length
 * Calculates the length of a quat4
 *
 * Params:
 * quat - quat4 to calculate length of
 *
 * Returns:
 * Length of quat
 */
quat4.length = function(quat) {
	var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
	return Math.sqrt(x*x + y*y + z*z + w*w);
}

/*
 * quat4.normalize
 * Generates a unit quaternion of the same direction as the provided quat4
 * If quaternion length is 0, returns [0, 0, 0, 0]
 *
 * Params:
 * quat - quat4 to normalize
 * dest - Optional, quat4 receiving operation result. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
quat4.normalize = function(quat, dest) {
	if(!dest) { dest = quat; }
	
	var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
	var len = Math.sqrt(x*x + y*y + z*z + w*w);
	if(len == 0) {
		dest[0] = 0;
		dest[1] = 0;
		dest[2] = 0;
		dest[3] = 0;
		return dest;
	}
	len = 1/len;
	dest[0] = x * len;
	dest[1] = y * len;
	dest[2] = z * len;
	dest[3] = w * len;
	
	return dest;
}

/*
 * quat4.multiply
 * Performs a quaternion multiplication
 *
 * Params:
 * quat - quat4, first operand
 * quat2 - quat4, second operand
 * dest - Optional, quat4 receiving operation result. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
quat4.multiply = function(quat, quat2, dest) {
	if(!dest) { dest = quat; }
	
	var qax = quat[0], qay = quat[1], qaz = quat[2], qaw = quat[3];
	var qbx = quat2[0], qby = quat2[1], qbz = quat2[2], qbw = quat2[3];
	
	dest[0] = qax*qbw + qaw*qbx + qay*qbz - qaz*qby;
	dest[1] = qay*qbw + qaw*qby + qaz*qbx - qax*qbz;
	dest[2] = qaz*qbw + qaw*qbz + qax*qby - qay*qbx;
	dest[3] = qaw*qbw - qax*qbx - qay*qby - qaz*qbz;
	
	return dest;
}

/*
 * quat4.multiplyVec3
 * Transforms a vec3 with the given quaternion
 *
 * Params:
 * quat - quat4 to transform the vector with
 * vec - vec3 to transform
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
quat4.multiplyVec3 = function(quat, vec, dest) {
	if(!dest) { dest = vec; }
	
	var x = vec[0], y = vec[1], z = vec[2];
	var qx = quat[0], qy = quat[1], qz = quat[2], qw = quat[3];

	// calculate quat * vec
	var ix = qw*x + qy*z - qz*y;
	var iy = qw*y + qz*x - qx*z;
	var iz = qw*z + qx*y - qy*x;
	var iw = -qx*x - qy*y - qz*z;
	
	// calculate result * inverse quat
	dest[0] = ix*qw + iw*-qx + iy*-qz - iz*-qy;
	dest[1] = iy*qw + iw*-qy + iz*-qx - ix*-qz;
	dest[2] = iz*qw + iw*-qz + ix*-qy - iy*-qx;
	
	return dest;
}

/*
 * quat4.toMat3
 * Calculates a 3x3 matrix from the given quat4
 *
 * Params:
 * quat - quat4 to create matrix from
 * dest - Optional, mat3 receiving operation result
 *
 * Returns:
 * dest if specified, a new mat3 otherwise
 */
quat4.toMat3 = function(quat, dest) {
	if(!dest) { dest = mat3.create(); }
	
	var x = quat[0], y = quat[1], z = quat[2], w = quat[3];

	var x2 = x + x;
	var y2 = y + y;
	var z2 = z + z;

	var xx = x*x2;
	var xy = x*y2;
	var xz = x*z2;

	var yy = y*y2;
	var yz = y*z2;
	var zz = z*z2;

	var wx = w*x2;
	var wy = w*y2;
	var wz = w*z2;

	dest[0] = 1 - (yy + zz);
	dest[1] = xy - wz;
	dest[2] = xz + wy;

	dest[3] = xy + wz;
	dest[4] = 1 - (xx + zz);
	dest[5] = yz - wx;

	dest[6] = xz - wy;
	dest[7] = yz + wx;
	dest[8] = 1 - (xx + yy);
	
	return dest;
}

/*
 * quat4.toMat4
 * Calculates a 4x4 matrix from the given quat4
 *
 * Params:
 * quat - quat4 to create matrix from
 * dest - Optional, mat4 receiving operation result
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
quat4.toMat4 = function(quat, dest) {
	if(!dest) { dest = mat4.create(); }
	
	var x = quat[0], y = quat[1], z = quat[2], w = quat[3];

	var x2 = x + x;
	var y2 = y + y;
	var z2 = z + z;

	var xx = x*x2;
	var xy = x*y2;
	var xz = x*z2;

	var yy = y*y2;
	var yz = y*z2;
	var zz = z*z2;

	var wx = w*x2;
	var wy = w*y2;
	var wz = w*z2;

	dest[0] = 1 - (yy + zz);
	dest[1] = xy - wz;
	dest[2] = xz + wy;
	dest[3] = 0;

	dest[4] = xy + wz;
	dest[5] = 1 - (xx + zz);
	dest[6] = yz - wx;
	dest[7] = 0;

	dest[8] = xz - wy;
	dest[9] = yz + wx;
	dest[10] = 1 - (xx + yy);
	dest[11] = 0;

	dest[12] = 0;
	dest[13] = 0;
	dest[14] = 0;
	dest[15] = 1;
	
	return dest;
}

/*
 * quat4.slerp
 * Performs a spherical linear interpolation between two quat4
 *
 * Params:
 * quat - quat4, first quaternion
 * quat2 - quat4, second quaternion
 * slerp - interpolation amount between the two inputs
 * dest - Optional, quat4 receiving operation result. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
quat4.slerp = function(quat, quat2, slerp, dest) {
    if(!dest) { dest = quat; }
    
	var cosHalfTheta =  quat[0]*quat2[0] + quat[1]*quat2[1] + quat[2]*quat2[2] + quat[3]*quat2[3];
	
	if (Math.abs(cosHalfTheta) >= 1.0){
	    if(dest != quat) {
		    dest[0] = quat[0];
		    dest[1] = quat[1];
		    dest[2] = quat[2];
		    dest[3] = quat[3];
		}
		return dest;
	}
	
	var halfTheta = Math.acos(cosHalfTheta);
	var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta*cosHalfTheta);

	if (Math.abs(sinHalfTheta) < 0.001){
		dest[0] = (quat[0]*0.5 + quat2[0]*0.5);
		dest[1] = (quat[1]*0.5 + quat2[1]*0.5);
		dest[2] = (quat[2]*0.5 + quat2[2]*0.5);
		dest[3] = (quat[3]*0.5 + quat2[3]*0.5);
		return dest;
	}
	
	var ratioA = Math.sin((1 - slerp)*halfTheta) / sinHalfTheta;
	var ratioB = Math.sin(slerp*halfTheta) / sinHalfTheta; 
	
	dest[0] = (quat[0]*ratioA + quat2[0]*ratioB);
	dest[1] = (quat[1]*ratioA + quat2[1]*ratioB);
	dest[2] = (quat[2]*ratioA + quat2[2]*ratioB);
	dest[3] = (quat[3]*ratioA + quat2[3]*ratioB);
	
	return dest;
}


/*
 * quat4.str
 * Returns a string representation of a quaternion
 *
 * Params:
 * quat - quat4 to represent as a string
 *
 * Returns:
 * string representation of quat
 */
quat4.str = function(quat) {
	return '[' + quat[0] + ', ' + quat[1] + ', ' + quat[2] + ', ' + quat[3] + ']'; 
}

var vs = vs || {};

vs.log = console.log.bind (console);
vs.error = console.error.bind (console);

(function(){
  // prepare base perf object
  if (typeof window.performance === 'undefined') {
    window.performance = {};
  }
  
  if (!window.performance.now) {
    var nowOffset = Date.now ();
 
    if (performance.timing && performance.timing.navigationStart) {
      nowOffset = performance.timing.navigationStart
    }

    window.performance.now = function now () {
      return Date.now() - nowOffset;
    }
  }
})();

var
  basicShaderProgram,
  imageShaderProgram,
  oneTextureShaderProgram,
  twoTexturesShaderProgram,
  gl_ctx,
  object_uv_buffer,
  object_bck_image_uv_buffer,
  default_object_bck_image_uv_buffer,
  object_faces_buffer,
  frame_size = [100, 100],
  gl_device_pixel_ratio,
  default_triangle_faces,
  default_texture_projection;

var get_shader = function (type, source, typeString) {
  // Create the shader object
  var shader = gl_ctx.createShader (type);
  if (shader == null) {
    vs.error ("couldn't create a shader")
    return null;
  }
  // Load the shader source
  gl_ctx.shaderSource (shader, source);
  // Compile the shader
  gl_ctx.compileShader (shader);
  // Check the compile status
  if (!gl_ctx.getShaderParameter(shader, gl_ctx.COMPILE_STATUS)) {
    var infoLog = this.gl_ctx.getShaderInfoLog (shader);
    vs.error ("Error compiling " + typeString + "shader:\n" + infoLog);
    gl_ctx.deleteShader (shader);
    return null;
  }

  return shader;
};

/**
 * Helper which convers GLSL names to JavaScript names.
 * @private
 */
function glslNameToJs_ (name) {
  return name.replace(/_(.)/g, function(_, p1) { return p1.toUpperCase(); });
}

function Program  () {
  this.__prog = gl_ctx.createProgram ();
}

function createSetters (program) {
  var __prog = program.__prog;

  // Look up attribs.
  var attribs = {};
  // Also make a plain table of the locs.
  var attribLocs = {};

  function createAttribSetter (info, index) {
    if (info.size != 1) {
      throw("arrays of attribs not handled");
    }
    return function (b) {
      gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, b.buffer);
      gl_ctx.enableVertexAttribArray (index);
      gl_ctx.vertexAttribPointer (
        index, b.numComponents, b.type, b.normalize, b.stride, b.offset
      );
    };
  }

  var numAttribs = gl_ctx.getProgramParameter (__prog, gl_ctx.ACTIVE_ATTRIBUTES);
  for (var ii = 0; ii < numAttribs; ++ii) {
    var info = gl_ctx.getActiveAttrib (__prog, ii);
    if (!info) {
      break;
    }
    var name = info.name;
    var index = gl_ctx.getAttribLocation (__prog, name);
    attribs [name] = createAttribSetter(info, index);
    attribLocs [name] = index
  }

  // Look up uniforms
  var numUniforms = gl_ctx.getProgramParameter (__prog, gl_ctx.ACTIVE_UNIFORMS);
  var uniforms = {
  };
  var textureUnit = 0;

  function createUniformSetter (info) {
    var loc = gl_ctx.getUniformLocation (__prog, info.name);
    var type = info.type; 

    if (type === gl_ctx.FLOAT)
      return function(v) { gl_ctx.uniform1f (loc, v); };
    if (type === gl_ctx.FLOAT_VEC2)
      return function(v) { gl_ctx.uniform2fv (loc, v); };
    if (type === gl_ctx.FLOAT_VEC3)
      return function(v) { gl_ctx.uniform3fv (loc, v); };
    if (type === gl_ctx.FLOAT_VEC4)
      return function(v) { gl_ctx.uniform4fv (loc, v); };
    if (type === gl_ctx.INT)
      return function(v) { gl_ctx.uniform1i (loc, v); };
    if (type === gl_ctx.INT_VEC2)
      return function(v) { gl_ctx.uniform2iv (loc, v); };
    if (type === gl_ctx.INT_VEC3)
      return function(v) { gl_ctx.uniform3iv (loc, v); };
    if (type === gl_ctx.INT_VEC4)
      return function(v) { gl_ctx.uniform4iv (loc, v); };
    if (type === gl_ctx.BOOL)
      return function(v) { gl_ctx.uniform1i (loc, v); };
    if (type === gl_ctx.BOOL_VEC2)
      return function(v) { gl_ctx.uniform2iv (loc, v); };
    if (type === gl_ctx.BOOL_VEC3)
      return function(v) { gl_ctx.uniform3iv (loc, v); };
    if (type === gl_ctx.BOOL_VEC4)
      return function(v) { gl_ctx.uniform4iv (loc, v); };
    if (type === gl_ctx.FLOAT_MAT2)
      return function(v) { gl_ctx.uniformMatrix2fv (loc, false, v); };
    if (type === gl_ctx.FLOAT_MAT3)
      return function(v) { gl_ctx.uniformMatrix3fv (loc, false, v); };
    if (type === gl_ctx.FLOAT_MAT4)
      return function(v) { gl_ctx.uniformMatrix4fv (loc, false, v); };
    if (type === gl_ctx.SAMPLER_2D || type === gl_ctx.SAMPLER_CUBE) {
      return function(unit) {
        return function(v, gl_view) {
//            gl_ctx.uniform1i (loc, unit);
          v.bindToUnit(unit, gl_view);
        };
      }(textureUnit++);
    }
    throw ("unknown type: 0x" + type.toString(16));
  }

  var textures = {};

  for (var ii = 0; ii < numUniforms; ++ii) {
    var info = gl_ctx.getActiveUniform (__prog, ii);
    if (!info) {
      break;
    }
    name = info.name;
    var setter = createUniformSetter(info);
    uniforms [name] = setter;
    if (info.type === gl_ctx.SAMPLER_2D || info.type === gl_ctx.SAMPLER_CUBE) {
      textures [name] = setter;
    }
  }

  program.textures = textures;
  program.attrib = attribs;
  program.attribLoc = attribLocs;
  program.uniform = uniforms;
}

Program.prototype.useIt = function (pMatrix, vMatrix, mMatrix) {
  gl_ctx.useProgram (this.__prog);
}

Program.prototype.setMatrixes = function (projMatrix, viewMatrix) {
  this.useIt ();
  this.uniform.Pmatrix (projMatrix);
  this.uniform.Vmatrix (viewMatrix);
}

Program.prototype.configureParameters = function (gl_view, style) {}

function createProgram (vertex_txt, fragment_txt) {
  var program = new Program ();

  var shader_vertex = get_shader (gl_ctx.VERTEX_SHADER, vertex_txt, "VERTEX");
  if (!shader_vertex) {
    vs.log ("couldn't load shader")
  }
  gl_ctx.attachShader (program.__prog, shader_vertex);
  gl_ctx.deleteShader (shader_vertex);

  var shader_fragment = get_shader (gl_ctx.FRAGMENT_SHADER, fragment_txt, "FRAGMENT");
  if (!shader_fragment) {
    vs.log("couldn't load shader")
  }
  gl_ctx.attachShader (program.__prog, shader_fragment);
  gl_ctx.deleteShader (shader_fragment);

  gl_ctx.linkProgram (program.__prog);
  gl_ctx.useProgram (program.__prog);

  // Check the link status
  var linked = gl_ctx.getProgramParameter (program.__prog, gl_ctx.LINK_STATUS);
  if (!linked && !gl_ctx.isContextLost ()) {
    var infoLog = gl_ctx.getProgramInfoLog (program.__prog);
    vs.error ("Error linking program:\n" + infoLog);
    gl_ctx.deleteProgram (program.__prog);
    program.__prog = null;
    return;
  }
  
  createSetters (program);
  
  return program;
}


function createCanvas (width, height) {

  var canvas = document.createElement ('canvas');
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  canvas.width = width * gl_device_pixel_ratio;
  canvas.height = height* gl_device_pixel_ratio;

  if (
    deviceConfiguration.browser !== vs.core.DeviceConfiguration.BROWSER_FIREFOX
    && gl_device_pixel_ratio !== 1) {
  
    var modes = ["crisp-edges", "-moz-crisp-edges", "-webkit-optimize-contrast"];
  
    if (canvas.style.imageRendering !== undefined) {
      for (var i = 0; i < modes.length; i++) {
        canvas.style.imageRendering = modes [i];
        if (canvas.style.imageRendering == modes [i]) {
          break;
        }
      }
    }

    else if (canvas.style["-ms-interpolation-mode"] !== undefined) {
      canvas.style["-ms-interpolation-mode"] = "nearest-neighbor";
    }
  }
  
  return canvas;
}

function create2DCanvas (width, height) {

  var
    canvas = createCanvas (width, height),
    ctx = canvas.getContext ('2d');

  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;  

  return canvas;
}

// initPrograms
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initPrograms () {

  var basic_vertex_shader="\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
void main(void) { //pre-built function\n\
  gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
}";

  var basic_shader_fragment="\n\
precision lowp float;\n\
uniform vec4 color;\n\
uniform float uAlpha;\n\
void main(void) {\n\
  gl_FragColor = vec4(color.rgb, color.a * uAlpha);\n\
}";

  var image_vertex_shader="\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
attribute vec2 uv;\n\
varying vec2 vUV;\n\
void main(void) { //pre-built function\n\
  gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
  vUV=uv;\n\
}";

  var image_shader_fragment="\n\
precision lowp float;\n\
varying vec2 vUV;\n\
uniform sampler2D uMainTexture;\n\
uniform vec4 color;\n\
uniform float uAlpha;\n\
void main(void) {\n\
  vec4 mainTextureColor = texture2D(uMainTexture, vUV);\n\
  gl_FragColor = mainTextureColor;\n\
  gl_FragColor.a *= uAlpha;\n\
}";

  var one_texture_vertex_shader="\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
attribute vec2 bkImageUV;\n\
varying vec2 vBkImageUV;\n\
void main(void) { //pre-built function\n\
  gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
  vBkImageUV=bkImageUV;\n\
}";

  var one_texture_shader_fragment="\n\
precision lowp float;\n\
varying vec2 vBkImageUV;\n\
uniform sampler2D uMainTexture;\n\
uniform vec4 color;\n\
uniform float uAlpha;\n\
void main(void) {\n\
  if (vBkImageUV[0]<0.0 || vBkImageUV[1]<0.0 || vBkImageUV[0]>1.0 || vBkImageUV[1]>1.0) {\n\
    gl_FragColor = color;\n\
  } else {\n\
    vec4 mainTextureColor = texture2D(uMainTexture, vBkImageUV);\n\
    gl_FragColor = mix(color, mainTextureColor, mainTextureColor.a);\n\
    gl_FragColor.a = max(color.a, mainTextureColor.a);\n\
  }\n\
  gl_FragColor.a *= uAlpha;\n\
}";

  var two_textures_vertex_shader="\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
attribute vec2 uv;\n\
attribute vec2 bkImageUV;\n\
varying vec2 vUV;\n\
varying vec2 vBkImageUV;\n\
void main(void) { //pre-built function\n\
  gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
  vUV=uv;\n\
  vBkImageUV=bkImageUV;\n\
}";

  var two_textures_shader_fragment="\n\
precision lowp float;\n\
varying vec2 vUV;\n\
varying vec2 vBkImageUV;\n\
uniform sampler2D uBckTexture;\n\
uniform sampler2D uMainTexture;\n\
uniform float uTextureFlag;\n\
uniform vec4 color;\n\
uniform float uAlpha;\n\
void main(void) {\n\
  vec4 mainTextureColor = texture2D(uMainTexture, vUV);\n\
  vec4 tmpColor;\n\
  if (vBkImageUV[0]<0.0 || vBkImageUV[1]<0.0 || vBkImageUV[0]>1.0 || vBkImageUV[1]>1.0) {\n\
    tmpColor = color;\n\
  } else {\n\
    vec4 bckTextureColor = texture2D(uBckTexture, vBkImageUV);\n\
    tmpColor = mix(color, bckTextureColor, bckTextureColor.a);\n\
    tmpColor.a = max(color.a, bckTextureColor.a);\n\
  }\n\
  gl_FragColor = mix(tmpColor, mainTextureColor, mainTextureColor.a);\n\
  gl_FragColor.a = max(tmpColor.a, mainTextureColor.a) * uAlpha;\n\
}";
  
  basicShaderProgram = createProgram (basic_vertex_shader, basic_shader_fragment);
  imageShaderProgram = createProgram (image_vertex_shader, image_shader_fragment);
  oneTextureShaderProgram = createProgram (one_texture_vertex_shader, one_texture_shader_fragment);
  twoTexturesShaderProgram = createProgram (two_textures_vertex_shader, two_textures_shader_fragment);
}

function initMainMatrix () {
  jsProjMatrix = mat4.create ();
  mat4.identity (jsProjMatrix)
  
  mat4.perspective (.191 ,1, -1, 10, jsProjMatrix);  
  
  jsViewMatrix = mat4.create ();
  mat4.identity (jsViewMatrix)
  mat4.translate (jsViewMatrix, [-1,1,-600]);
  mat4.scale (jsViewMatrix, [2/ frame_size[0], -2/ frame_size[1], 1]);
}

function updateProgramsMatrix () {
  imageShaderProgram.setMatrixes (jsProjMatrix, jsViewMatrix);
  twoTexturesShaderProgram.setMatrixes (jsProjMatrix, jsViewMatrix);
  oneTextureShaderProgram.setMatrixes (jsProjMatrix, jsViewMatrix);
  basicShaderProgram.setMatrixes (jsProjMatrix, jsViewMatrix);
}

function initBuffers () {

  default_texture_projection = new Float32Array ([0,0, 0,1, 1,0, 1,1]);

  /*========================= UV =========================*/
  object_uv_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, object_uv_buffer);
  
  gl_ctx.bufferData (
    gl_ctx.ARRAY_BUFFER,
    default_texture_projection,
    gl_ctx.STATIC_DRAW
  );

  object_bck_image_uv_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, object_bck_image_uv_buffer);

  gl_ctx.bufferData (
    gl_ctx.ARRAY_BUFFER,
    default_texture_projection,
    gl_ctx.STATIC_DRAW
  );
    
  default_object_bck_image_uv_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, default_object_bck_image_uv_buffer);
  gl_ctx.bufferData (
    gl_ctx.ARRAY_BUFFER,
    default_texture_projection,
    gl_ctx.STATIC_DRAW
  );

  /*========================= FACES ========================= */
  object_faces_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer(gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer);

  default_triangle_faces = new Uint16Array ([0,1,2,3]);
  gl_ctx.bindBuffer (gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer);
  gl_ctx.bufferData (
    gl_ctx.ELEMENT_ARRAY_BUFFER,
    default_triangle_faces,
    gl_ctx.STATIC_DRAW);
}

var GL_CANVAS, stats;
var init_functions = [];

function glAddInitFunction (func) {
  init_functions.push (func);
}

function initWebGLRendering () {

  if (gl_ctx) return;
  
  if (window.ACTIVATE_STATS) {
    vs.util.importFile ("../../src/Stats.js", null, function () {
      stats = Stats ();
      document.body.appendChild (stats.domElement);
      stats.setMode (1);
    
    }, "js");
  }
  
  frame_size = [window.innerWidth, window.innerHeight];
  gl_device_pixel_ratio = window.devicePixelRatio || 1;
  
  if (deviceConfiguration.browser === vs.core.DeviceConfiguration.BROWSER_FIREFOX) {
    gl_device_pixel_ratio = 1;
  }
  
  console.log (gl_device_pixel_ratio);

  var canvas = GL_CANVAS = createCanvas (frame_size [0], frame_size [1]);
  document.body.appendChild (canvas);
  
  /*================= Creates a webgl context ================= */
  var webgl_options = {
    antialias: true,
    premultipliedAlpha: false,
    alpha: false
  };
  
  var webgl_names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  for (var i = 0; i < webgl_names.length; ++i) {
    try {
      gl_ctx = canvas.getContext (webgl_names[i], webgl_options);
    } catch (e) {}
    if (gl_ctx) {
      break;
    }
  }

  if (!gl_ctx) {
    alert ("You are not webgl compatible :(") ;
    throw ("You are not webgl compatible :(") ;
    return;
  }
  
  vs.ui.GLView.prototype.__gl_context = gl_ctx;

  /*========================= SHADERS ========================= */
  initPrograms ();
  initMainMatrix ();
  initBuffers ();
  initPickBuffer ();

  /*========================= DRAWING ========================= */
  gl_ctx.disable (gl_ctx.DEPTH_TEST);

  gl_ctx.enable (gl_ctx.BLEND);
  gl_ctx.blendFunc (gl_ctx.SRC_ALPHA, gl_ctx.ONE_MINUS_SRC_ALPHA);

  gl_ctx.clearDepth (1.0);
  gl_ctx.clearColor (0, 0, 0, 1);
  gl_ctx.colorMask (true, true, true, false);
  
  init_functions.forEach (function (func) { func (); });

  vs.requestAnimationFrame (render);
}

function update_gl_vertices (gl_view) {
  var
    obj_size = gl_view._size,
    obj_pos = gl_view._position,
    x = obj_pos[0],
    y = obj_pos[1],
    w = obj_size [0],
    h = obj_size [1],
    m = gl_view.__gl_vertices;
        
  // setup position vertices
  m[0] = x; m[1] = y; m[2] = 0;
  m[3] = x; m[4] = y + h; m[5] = 0;
  m[6] = x + w; m[7] = y; m[8] = 0;
  m[9] = x + w; m[10] = y + h; m[11] = 0;
  
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, gl_view.__gl_vertices_buffer);
  gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, m, gl_ctx.STATIC_DRAW); 
};


/**
 * @protected
 * @function
 */
function update_transform_gl_matrix (gl_view)
{
  var
    matrix = gl_view.__gl_matrix,
    pos = gl_view._position,
    tx = gl_view._transform_origin [0] + pos [0],
    ty = gl_view._transform_origin [1] + pos [1],
    rot = gl_view._rotation,
    trans = gl_view._translation;
    
  // apply current transformation
  mat4.identity (matrix);
  mat4.translateXYZ (matrix, tx + trans[0], ty + trans[1], trans[2]);

  if (rot[0]) mat4.rotateX (matrix, rot[0] * angle2rad);
  if (rot[1]) mat4.rotateY (matrix, rot[1] * angle2rad);
  if (rot[2]) mat4.rotateZ (matrix, rot[2] * angle2rad);
  
  mat4.scaleXY (matrix, gl_view._scaling);
  mat4.translateXYZ (matrix, -tx, -ty, 0);

  /*====================================================== */
  // Update vertices vectors for the culling algorithm
  update_envelop_vertices (gl_view);

  gl_view.__invalid_matrixes = true;
  GLView.__should_render = true;
}

/**
 * Update vertices vectors for the culling algorithm
 * @protected
 * @function
 */
function update_envelop_vertices (gl_view)
{
  var
    matrix = gl_view.__gl_matrix,
    obj_size = gl_view._size,
    obj_pos = gl_view._position,
    x = obj_pos[0],
    y = obj_pos[1],
    w = obj_size [0],
    h = obj_size [1];

  vec3.set_p (x    , y    , 0, gl_view.__vertex_1);
  vec3.set_p (x    , y + h, 0, gl_view.__vertex_2);
  vec3.set_p (x + w, y    , 0, gl_view.__vertex_3);
  vec3.set_p (x + w, y + h, 0, gl_view.__vertex_4);
  
  mat4.multiplyVec3 (matrix, gl_view.__vertex_1);
  mat4.multiplyVec3 (matrix, gl_view.__vertex_2);
  mat4.multiplyVec3 (matrix, gl_view.__vertex_3);
  mat4.multiplyVec3 (matrix, gl_view.__vertex_4);
} 

var rendering = true;
var next_rendering_id = 0;
var gl_stack_length = 0;
var gl_stack_for_renter = [1024];

function render () {

  var v1, v2, v3, v4, v_temp = vec3.create ();

  for (var i = 0; i < 1024; i ++) {
    gl_stack_for_renter [i] = new Array (3);
    // [0] - rendering type
    // [1] - view to render
    // [2] - alpha
  }
  
  var boundaries_stack = [256];
  for (var i = 0; i < 256; i ++) {
    boundaries_stack [i] = new glMatrixArrayType (4);
  }

  // Configure view and projection matrix of programes
  updateProgramsMatrix ();
  
  function calculateViewsInFrustum (now) {
    var apps = vs.Application_applications, key;
    gl_stack_length = 0;
    gl_views_index = 0;

    function _calculateViewsInFrustum (gl_view, p_transform, new_p_matrix, p_alpha, level) {
      var key, i, l, child, children, style, alpha;
      
      // Views visibility
      if (!gl_view._visible && !gl_view.__is_hidding) {
        return;
      }
      
      // animate view
      gl_view.__gl_update_animation (now);

      // Views opacity
      style = gl_view._style;
      if (style) alpha = p_alpha * style._opacity;
      else alpha = p_alpha;

      if (alpha === 0) {
        return;
      }

      var boundaries = boundaries_stack [level];
      /*================= Update view matrixes ================= */
      if (gl_view.__should_update_gl_matrix) {
        update_transform_gl_matrix (gl_view);
      }
      var o_matrix = gl_view.__gl_matrix;
      var m_matrix = gl_view.__gl_m_matrix;
      var p_matrix = gl_view.__gl_p_matrix;
      var scroll_vec = gl_view.__gl_scroll;
      var p_size_vec = gl_view._size;
            
      if (new_p_matrix || gl_view.__invalid_matrixes) {
        if (p_transform) {
          mat4.multiply (p_transform, o_matrix, m_matrix);
        }
        else {
          mat4.set (o_matrix, m_matrix);
        }
      }

      if (new_p_matrix || gl_view.__invalid_matrixes || gl_view.__is_scrolling) {
        mat4.translate (m_matrix, gl_view._position, p_matrix);
      
        if (scroll_vec) {
          gl_view.__gl_update_scroll (now);
          mat4.translate (p_matrix, scroll_vec);
        }
        new_p_matrix = true;
      }
      gl_view.__invalid_matrixes = false;

      /*================= Culling allgorithm ================= */
      // Update matrixes

      v1 = gl_view.__vertex_1; v2 = gl_view.__vertex_2; 
      v3 = gl_view.__vertex_3; v4 = gl_view.__vertex_4; 

      if ((v1[0]>boundaries[2] && v2[0]>boundaries[2] &&
           v3[0]>boundaries[2] && v4[0]>boundaries[2]) ||
          (v1[0]<boundaries[0] && v2[0]<boundaries[0] &&
           v3[0]<boundaries[0] && v4[0]<boundaries[0]) ||
          (v1[1]>boundaries[3] && v2[1]>boundaries[3] &&
           v3[1]>boundaries[3] && v4[1]>boundaries[3]) || 
          (v1[1]<boundaries[1] && v2[1]<boundaries[1] &&
           v3[1]<boundaries[1] && v4[1]<boundaries[1])) { 
        return;
      }

      // Set the new boundaries for the children
      boundaries = boundaries_stack [level+1];
      if (scroll_vec) {
        vec3.subtract ([0,0,0], scroll_vec, v_temp);
        boundaries[0] = v_temp[0];
        boundaries[1] = v_temp[1];
        
        vec3.subtract ([p_size_vec [0], p_size_vec [1], 0], scroll_vec, v_temp);       
        boundaries[2] = v_temp [0];
        boundaries[3] = v_temp [1];
      }
      else 
      {
        boundaries[0] = 0;
        boundaries[1] = 0;
        boundaries[2] = p_size_vec [0];
        boundaries[3] = p_size_vec [1];
      }

      var entry = gl_stack_for_renter [gl_views_index++];
      entry [0] = 1; // normal view to render
      entry [1] = gl_view;
      entry [2] = alpha;
      
      // End culling algorithm

      // manage children
      children = gl_view.__children;
      l = children.length;
      for (i = 0; i < l; i++) {
        child = children [i];
        if (child.__gl_object) {
          _calculateViewsInFrustum (child, p_matrix, new_p_matrix, alpha, level + 1);
        }
      }
    }

    var boundaries = boundaries_stack [0];
    boundaries [0] = 0;
    boundaries [1] = 0;
    boundaries [2] = frame_size[0];
    boundaries [3] = frame_size[1];
  
    for (key in apps) {
      var app = apps[key];
      _calculateViewsInFrustum (app, null, false, 1, 0);
    }
    
    gl_stack_length = gl_views_index;
  }

  var color_id_array = new Float32Array ([0,0,0,0])
    
  function calculateColorsFromGLID (gl_id) {
    var r = 0, g = 0, b = 0, a = 1;
    
    r = (gl_id % 256) / 255;
    gl_id = (gl_id / 255) | 0;
    g = (gl_id % 256) / 255;
    gl_id = (gl_id / 255) | 0;
    b = (gl_id % 256) / 255;
 
    color_id_array [0] = r;
    color_id_array [1] = g;
    color_id_array [2] = b;
    color_id_array [3] = a;
  }
  
  var default_faces_activated = false;
  var previous_program = null;
  var attribute = {}, texture1 = {}, texture2 = {};
  
  function bindToUnitTEXTURE0_1 (unit, gl_view) {
    gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, gl_view.__gl_texture);
  };
  
  function bindToUnitTEXTURE0_2 (unit, gl_view) {
    gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, gl_view.__gl_image_texture);
  };
  
  function bindToUnitTEXTURE0_3 (unit, style) {
    gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, style.__gl_texture_bck_image);
  };
  
  function renderOneView (gl_view, alpha, mode) {

    var program;
       
    if (mode === 1) {

      program = basicShaderProgram;
      if (previous_program !== basicShaderProgram) {
        program.useIt ();
      }

      // calculate the color ID
      calculateColorsFromGLID (gl_view.__gl_id);

      program.uniform.color (color_id_array);
      alpha = 1;
    }
    else {
      var style = gl_view.style, c_buffer;
      if (!style) {
        style = _default_style;
      }

      if (style && style._background_color) {
        c_buffer = style._background_color.__gl_array;
      }
      else {
        c_buffer = GLColor.default.__gl_array;
      }
    
      if (gl_view.__gl_user_program) {
        program = gl_view.__gl_user_program;
        program.useIt ();
        
        if (program.configureParameters) {
          program.configureParameters (gl_view, style);
        }
      }
      else if (gl_view.__gl_image_texture) {
        program = imageShaderProgram;
        if (previous_program !== imageShaderProgram) {
          program.useIt ();
        
          attribute.normalize = false;
          attribute.type = gl_ctx.FLOAT;
          attribute.stride = 0;
          attribute.offset = 0;

          attribute.buffer = object_uv_buffer;
          attribute.numComponents = 2;
          program.attrib.uv (attribute);
        }
            
        texture1.bindToUnit = bindToUnitTEXTURE0_2;
        program.textures.uMainTexture (texture1, gl_view);
      }
      else if (gl_view.__gl_texture && style.__gl_texture_bck_image) {
        program = twoTexturesShaderProgram;
        if (previous_program !== twoTexturesShaderProgram) {
          program.useIt ();
        
          attribute.normalize = false;
          attribute.type = gl_ctx.FLOAT;
          attribute.stride = 0;
          attribute.offset = 0;

          attribute.buffer = object_uv_buffer;
          attribute.numComponents = 2;
          program.attrib.uv (attribute);
        }

        texture1.bindToUnit = bindToUnitTEXTURE0_1;
        program.textures.uMainTexture (texture1, gl_view);
      
        attribute.buffer = object_bck_image_uv_buffer;
        attribute.numComponents = 2;
        program.attrib.bkImageUV (attribute);
        gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, style._background_image_uv, gl_ctx.STATIC_DRAW);

        texture2.bindToUnit = bindToUnitTEXTURE0_3;
        program.textures.uBckTexture (texture2, style);

        program.uniform.color (c_buffer);
      }
      else if (gl_view.__gl_texture) {
        program = oneTextureShaderProgram;
        if (previous_program !== oneTextureShaderProgram) {
          program.useIt ();
        }

        attribute.normalize = false;
        attribute.type = gl_ctx.FLOAT;
        attribute.stride = 0;
        attribute.offset = 0;

        attribute.buffer = default_object_bck_image_uv_buffer;
        attribute.numComponents = 2;
        program.attrib.bkImageUV (attribute);

        program.uniform.color (c_buffer);

        texture1.bindToUnit = bindToUnitTEXTURE0_1;
        program.textures.uMainTexture (texture1, gl_view);
      }
      else if (style.__gl_texture_bck_image) {
        program = oneTextureShaderProgram;
        if (previous_program !== oneTextureShaderProgram) {
          program.useIt ();
        }

        attribute.normalize = false;
        attribute.type = gl_ctx.FLOAT;
        attribute.stride = 0;
        attribute.offset = 0;

        attribute.buffer = object_bck_image_uv_buffer;
        attribute.numComponents = 2;
        program.attrib.bkImageUV (attribute);
        gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, style._background_image_uv, gl_ctx.STATIC_DRAW);

        program.uniform.color (c_buffer);

        texture1.bindToUnit = bindToUnitTEXTURE0_3;
        program.textures.uMainTexture (texture1, style);
      }
      else
      {
        program = basicShaderProgram;
        if (previous_program !== basicShaderProgram) {
          program.useIt ();
        }

        program.uniform.color (c_buffer);
      }
    }

    program.uniform.Mmatrix (gl_view.__gl_m_matrix);
    program.uniform.uAlpha (alpha);

    attribute.normalize = false;
    attribute.type = gl_ctx.FLOAT;
    attribute.stride = 0;
    attribute.offset = 0;

    if (gl_view.__should_update_gl_vertices) {
      if (gl_view.__update_gl_vertices) gl_view.__update_gl_vertices ();
      else update_gl_vertices (gl_view);
    }
    attribute.buffer = gl_view.__gl_vertices_buffer;
    attribute.numComponents = 3;
    program.attrib.position (attribute);
    
    if (gl_view.__gl_user_vertices) {

      gl_ctx.bindBuffer (gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer);
      gl_ctx.bufferData (
        gl_ctx.ELEMENT_ARRAY_BUFFER,
        gl_view.__gl_user_triangle_faces,
        gl_ctx.STATIC_DRAW
      );
      
      default_faces_activated = false;
      
      var nb_faces = gl_view.__gl_user_triangle_faces.length;
      gl_ctx.drawElements (gl_ctx.TRIANGLES, nb_faces, gl_ctx.UNSIGNED_SHORT, 0);

    }
    else {
    
      if (!default_faces_activated) {
        // set default faces
        gl_ctx.bindBuffer (gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer);
        gl_ctx.bufferData (
          gl_ctx.ELEMENT_ARRAY_BUFFER,
          default_triangle_faces,
          gl_ctx.STATIC_DRAW);
      
        default_faces_activated = true;
      }
     
      gl_ctx.drawElements (gl_ctx.TRIANGLE_STRIP, 4, gl_ctx.UNSIGNED_SHORT, 0);
    }
    
    previous_program = program;
  }

  var animate = window.render_ui = function (now, mode) {
    if (!rendering) {
      next_rendering_id = vs.requestAnimationFrame (animate);
      return
    }

    if (mode !== 1 && (!GLView.__should_render && !GLView.__nb_animation)) {
      next_rendering_id = vs.requestAnimationFrame (animate);
      return
    }

    if (stats) stats.begin ();
    
    if (mode === 1 && next_rendering_id) {
      cancelAnimationFrame (next_rendering_id);
    }

    calculateViewsInFrustum (now);
    GLView.__should_render = false;
    
//    console.log (gl_stack_length);
      
    if (gl_stack_length) {
    
      gl_ctx.viewport (
        0.0, 0.0,
        frame_size[0] * gl_device_pixel_ratio,
        frame_size[1] * gl_device_pixel_ratio
      );
    
      gl_ctx.clear (gl_ctx.COLOR_BUFFER_BIT);

      for (var i = 0; i < gl_stack_length; i++) {
        var entry = gl_stack_for_renter [i];
        if (entry[0] === 1) {
          // normal rendering
          renderOneView (entry[1], entry[2], mode);
        }
      }

      gl_ctx.flush();
    }
    next_rendering_id = vs.requestAnimationFrame (animate);
//    if (mode !== 1) vs.scheduleAction(animate, 300);

    if (stats) stats.end ();
  }
  
  animate (performance.now ());
//  vs.scheduleAction(animate, 100);
}

function makeMesh (resolution, pos_x, pos_y, width, height, c) {

  var rx = width / resolution;
  var ry = height / resolution;
  
  //(resolution + 1) * (resolution + 1) vertices; vertexe = 3 numbers
  if (!c) {
    c = new Float32Array ((resolution + 1) * (resolution + 1) * 3); 
  }
  
  var i = 0, xs, ys, x, y;

  for (xs = 0; xs < resolution + 1; xs++) {
    x = pos_x + rx * xs;
    y = pos_y;
    
    c[i++] = x;
    c[i++] = y;
    c[i++] = 0;

    for (ys = 1; ys < resolution + 1; ys++) {

      y = pos_y + ry * ys;
      
      c[i++] = x;
      c[i++] = y;
      c[i++] = 0;
    }
  }
  return c;
}

function makeTextureProjection (resolution, c) {
  var r = 1 / resolution;
  
  //(resolution + 1) * (resolution + 1) vertices; vertexe = 3 numbers
  if (!c) {
    c = new Float32Array ((resolution + 1) * (resolution + 1) * 2);
  }

  var i = 0, xs, ys, x, y;

  for (xs = 0; xs < resolution + 1; xs++) {
    x = r * xs;
    y = 0;
    
    c[i++] = x;
    c[i++] = y;
 
    for (ys = 1; ys < resolution + 1; ys++) {

      y = r * ys;

      c[i++] = x;
      c[i++] = y;
    }
  }
  
  return c;
}

function makeTriangles (resolution, c) {

  //resolution * resolution rectangles; rectangle = 2 facets; facet = 3 vertices
  if (!c) {
    c = new Uint16Array (resolution * resolution * 6);
  }
  
  var i = 0, xs, ys, j = 0;

  for (xs = 0; xs < resolution; xs++) {
    for (ys = 0; ys < resolution ; ys++) {

      // first facet
      c[i++] = j;
      c[i++] = j + resolution + 1;
      c[i++] = j + 1;

      // second facet
      c[i++] = j + 1;
      c[i++] = j + resolution + 1;
      c[i++] = j + resolution + 2;
      
      j++;
    }
    j++;
  }
  
  return c;
}
/*
  COPYRIGHT NOTICE
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/


/**
 *  The vs.ui.GLConstraint class
 *
*/
function GLConstraint () {}

GLConstraint.prototype = {
  top : null,
  bottom: null,
  right : null,
  left: null,
  middleX : null,
  middleY: null,

  clone : function () {
    var obj = new GLConstraint ();    
    this.copy (obj);
    
    return obj;
  },
  
  copy : function (constraint) {
    constraint.top = this.top;
    constraint.bottom = this.bottom;
    constraint.right = this.right;
    constraint.left = this.left;
    constraint.middleX = this.middleX;
    constraint.middleY = this.middleY;
  },
  
  parseStringStyle: function (str) {
    function clean(css) {
      return css
      .replace(/\/\*[\W\w]*?\*\//g, "") // remove comments
      .replace(/^\s+|\s+$/g, "") // remove trailing spaces
      .replace(/\s*([:;{}])\s*/g, "$1") // remove trailing separator spaces
      .replace(/\};+/g, "}") // remove unnecessary separators
      .replace(/([^:;{}])}/g, "$1;}") // add trailing separators
    }

    function refine(css, isBlock) {
      return /^@/.test(css) ? (css = css.split(" ")) && {
        "identifier": css.shift().substr(1).toLowerCase(),
        "parameters": css.join(" ")
      } : (isBlock ? /:$/ : /:/).test(css) ? (css = css.split(":")) && {
        "property": css.shift(),
        "value": css.join(":")
      } : css;
    }

    function parse(css, regExp, object) {
      for (var m; (m = regExp.exec(css)) != null;) {
        if (m[2] == "{") object.block.push(object = {
          "selector": refine(m[1], true),
          "block": [],
          "parent": object
        });
        else if (m[2] == "}") object = object.parent;
        else if (m[2] == ";") object.block.push(refine(m[1]));
      }
    }

    var parseStyle = function (css) {
      return parse(clean(css), /([^{};]*)([;{}])/g, css = { block: [] }), css;
    };
      
    var style = parseStyle (str).block, self = this;

    style.forEach (function (block) {
      var p = util.camelize (block.property);
      var value = parseInt (block.value, 10);
      if (value === NaN) value = null;
      
      self [p] = value;
    });
  },
  
  __update_view : function (view) {
    if (!view) return;
    
    var
      x = view._position [0], y = view._position [1],
      w = view._size [0], h = view._size [1],
      parentView, pWidth, pHeight,
      top = this.top,
      bottom = this.bottom,
      right = this.right,
      left = this.left,
      middleX = this.middleX,
      middleY = this.middleY;
    
    parentView = view.__parent;
    if (parentView) {
      pWidth = parentView._size [0];
      pHeight = parentView._size [1];
    }
    
    /// HORIZONTAL MANAGEMENT
    
    if (left === null && middleX === null && right === null) {
      // nothing to do
    }
    else if (left !== null && middleX === null && right === null) {
      x = left;
    }
    else if (left === null && middleX !== null && right === null) {
      if (pWidth) {
        x = (pWidth - w) / 2 + middleX;
      }
    }
    else if (left === null && middleX === null && right !== null) {
      if (pWidth) {
        x = pWidth - (w + right);
      }
    }
    
    else if (left !== null && middleX !== null && right === null) {
      x = left;
      if (pWidth) {
        w = pWidth - left * 2;
      }
      x += middleX;
    }
    else if (left !== null && middleX === null && right !== null) {
      x = left;
      if (pWidth) {
        w = pWidth - (left + right);
      }
    }
   
    else if (left === null && middleX !== null && right !== null) {
      if (pWidth) {
        w = pWidth - right * 2;
        x = right;
      }
      x += middleX;
    }
    
    else if (left !== null && middleX !== null && right !== null) {
      console.log ("IMPOSSIBLE CONSTRAINT");
      // nothing to do
    }
   
    /// VERTICAL MANAGEMENT
    
    if (top === null && middleY === null && bottom === null) {
      // nothing to do
    }
    else if (top !== null && middleY === null && bottom === null) {
      y = top;
    }
    else if (top === null && middleY !== null && bottom === null) {
      if (pHeight) {
        y = (pHeight - h) / 2 + middleY;
      }
    }
    else if (top === null && middleY === null && bottom !== null) {
      if (pHeight) {
        y = pHeight - (h + bottom);
      }
      
    }
    
    else if (top !== null && middleY !== null && bottom === null) {
      y = top;
      if (pHeight) {
        h = pHeight - top * 2;
      }
      y += middleY;
    }
    else if (top !== null && middleY === null && bottom !== null) {
      y = top;
      if (pHeight) {
        h = pHeight - (top + bottom);
      }
    }
   
    else if (top === null && middleY !== null && bottom !== null) {
      if (pHeight) {
        h = pHeight - bottom * 2;
        y = bottom + middleY;
      }
    }
    
    else if (top !== null && middleY !== null && bottom !== null) {
      console.log ("IMPOSSIBLE CONSTRAINT");
      // nothing to do
    }
    
    // UPDATE VIEW POS AND SIZE
    view._position [0] = x; view._position [1] = y;
    view._size [0] = w; view._size [1] = h;
  }
}


/********************************************************************
                      Export
*********************************************************************/
/** @private */
vs.ui.GLConstraint = GLConstraint;
/*
  COPYRIGHT NOTICE
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/


/**
 *  The vs.ui.GLColor class
 *
*/
function GLColor (r, g, b, a) {
  this.__gl_array = new Float32Array (4);
  
  this.setRGBAColor (r, g, b, a);
}

GLColor.prototype.setRGBAColor = function (r, g, b, a) {
  if (!vs.util.isNumber (r) || r < 0 || r > 255) r = 255;
  if (!vs.util.isNumber (g) || g < 0 || g > 255) g = 255;
  if (!vs.util.isNumber (b) || b < 0 || b > 255) b = 255;
  if (!vs.util.isNumber (a) || a < 0 || a > 1) a = 1;

  r = r / 255;
  g = g / 255;
  b = b / 255;

  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;

  this.setColorArray (r, g, b, a);
}

GLColor.prototype.setColorArray = function (m11, m12, m13, m14) {
  var m = this.__gl_array;  
  m[0] = m11; m[1] = m12; m[2] = m13; m[3] = m14;
}

GLColor.prototype.copy = function (color) {

  var
    m = this.__gl_array,
    c_m = color.__gl_array
  
  color.r = this.r;
  color.g = this.g;
  color.b = this.b;
  color.a = this.a;

  c_m.set (m);
}

GLColor.prototype.getRgbaString = function () {
  return "rgba(" + (this.r * 255) + ","
    + (this.g * 255) + "," + (this.b * 255)
    + "," + this.a + ")";
}

GLColor.prototype.setRgbString = function (str) {
  var matchColors = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;
  var match = matchColors.exec (str);
  if (match !== null) {
    this.setRGBAColor (
      parseInt (match[1], 10),
      parseInt (match[2], 10),
      parseInt (match[3], 10),
      1);
  }
}

GLColor.prototype.setRgbaString = function (str) {
  var matchColors = /rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d?\.\d+)\)/;
  var match = matchColors.exec (str);
  if (match !== null) {
    this.setRGBAColor (
      parseInt (match[1], 10),
      parseInt (match[2], 10),
      parseInt (match[3], 10),
      parseFloat (match[4], 10));
  }
}

function initDefaultColors () {
  GLColor.transparent = new GLColor (0, 0, 0, 0);
  GLColor.black = new GLColor (0, 0, 0, 1.0);
  GLColor.white = new GLColor (255, 255, 255, 1.0);
  GLColor.red = new GLColor (255, 0, 0, 1);
  GLColor.green = new GLColor (0, 255, 0, 1);
  GLColor.blue = new GLColor (0, 0, 255, 1);
  GLColor.yellow = new GLColor (255,255,0, 1);
  GLColor.lightGrey = new GLColor (200, 200, 200, 1.0);

  GLColor.default = GLColor.transparent;
}

glAddInitFunction (initDefaultColors);

/********************************************************************
                      Export
*********************************************************************/
/** @private */
vs.ui.GLColor = GLColor;
/*
  COPYRIGHT NOTICE
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/


/**
 *  The vs.ui.GLStyle class
 *
*/
function GLStyle (config)
{
  this.parent = vs.core.Object;
  this.parent (config);
  this.constructor = GLStyle;
  
  this._background_image_uv = new Float32Array ([0,1, 0,0, 1,1, 1,0]);
  this._color = GLColor.black;
}

GLStyle.prototype = {
  _opacity : 1,
  _background_color: null,
  _background_image: null,
  _background_image_uv: null,
  _color: null,
  _font_family: "arial",
  _font_size: 12,
  _text_align: "left",
  _text_transform: null,
  _font_weight: "normal",
  
  __gl_texture_bck_image: null,
  __gl_bck_image_uv_buffer: null,

  /**
   * @protected
   * @function
   */
  destructor : function ()
  {
    if (this.__gl_texture_bck_image) {
      gl_free_texture_image (this._background_image);
      this.__gl_texture_bck_image = null;
    }
    
//     if (this.__gl_bck_image_uv_buffer) {
//       gl_ctx.deleteBuffer (this.__gl_bck_image_uv_buffer);
//       this.__gl_bck_image_uv_buffer = null;
//     }

    core.Object.prototype.destructor.call (this);
  },
  
  clone : function () {
    var obj = new GLStyle (this);
    
    return obj;
  },
  
  copy : function (style) {
    style._opacity = this._opacity;
    style._font_family = this._font_family;
    style._font_size = this._font_size;
    style._text_align = this._text_align;
    style._text_transform = this._text_transform;


    if (this._background_color) {
      // TODO memory leak
      style._background_color = new GLColor ();
      this._background_color.copy (style._background_color);
    }
    
    if (this._color) {
      // TODO memory leak
      style._color = new GLColor ();
      this._color.copy (style._color);
    }
    
    if (this._background_image) {
       style.backgroundImage = this._background_image;
    }
    
    if (this._background_image_uv) {
      // TODO memory leak
      style._background_image_uv = new Float32Array (this._background_image_uv);
    }
  },
  
  parseStringStyle: function (str) {
    function clean(css) {
      return css
      .replace(/\/\*[\W\w]*?\*\//g, "") // remove comments
      .replace(/^\s+|\s+$/g, "") // remove trailing spaces
      .replace(/\s*([:;{}])\s*/g, "$1") // remove trailing separator spaces
      .replace(/\};+/g, "}") // remove unnecessary separators
      .replace(/([^:;{}])}/g, "$1;}") // add trailing separators
    }

    function refine(css, isBlock) {
      return /^@/.test(css) ? (css = css.split(" ")) && {
        "identifier": css.shift().substr(1).toLowerCase(),
        "parameters": css.join(" ")
      } : (isBlock ? /:$/ : /:/).test(css) ? (css = css.split(":")) && {
        "property": css.shift(),
        "value": css.join(":")
      } : css;
    }

    function parse(css, regExp, object) {
      for (var m; (m = regExp.exec(css)) != null;) {
        if (m[2] == "{") object.block.push(object = {
          "selector": refine(m[1], true),
          "block": [],
          "parent": object
        });
        else if (m[2] == "}") object = object.parent;
        else if (m[2] == ";") object.block.push(refine(m[1]));
      }
    }

    var parseCSS = function (css) {
      return parse(clean(css), /([^{};]*)([;{}])/g, css = { block: [] }), css;
    };
  
    var css = parseCSS (str).block, self = this;
    css.forEach (function (block) {
      var p = util.camelize (block.property);
      var value = block.value;
    
      switch (p) {
        case "backgroundColor":
        case "color":
          var c;
        
          if (GLColor [value]) {
            c = GLColor [value];
          }
          else if (value.indexOf ("rgb(") === 0) {
            c = new GLColor ();
            c.setRgbString (value);
          }
          else if (value.indexOf ("rgba(") === 0) {
            c = new GLColor ();
            c.setRgbaString (value);
          }
          else {
            c = new GLColor (value);
          }
          self [p] = c;
          break;

        case "fontFamily":
        case "fontSize":
        case "textAlign":
        case "textWeight":
          self [p] = value;
          break;
      }
    });
  }
}

vs.util.defineClassProperties (GLStyle, {

  'opacity': {
    /**
     * Change view opacity.
     * value is include in this range [0, 1]
     * @name vs.ui.GLStyle#opacity
     * @type {number}
     */
    set : function (v) {
      if (!util.isNumber (v)) return;
      if (v < 0 || v > 1) return;

      this._opacity = v;
      GLView.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {number}
     */
    get : function () {
      return this._opacity;
    }
  },
  
  'backgroundColor': {
    /**
     * @name vs.ui.GLView#backgroundColor
     * @type {GLColor}
     */
    set : function (v)
    {
      if (!(v instanceof GLColor)) return; 
      this._background_color = v;
      GLView.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {GLColor}
     */
    get : function () {
      return this._background_color;
    }
  },
  
  'color': {
    /**
     * @name vs.ui.GLView#color
     * @type {GLColor}
     */
    set : function (v)
    {
      if (!(v instanceof GLColor)) return; 
      this._color = v;
      GLView.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {GLColor}
     */
    get : function () {
      return this._color;
    }
  },
  
  'fontFamily': {
    /**
     * Change view fontFamily.
     * @name vs.ui.GLStyle#fontFamily
     * @type {String}
     */
    set : function (v) {
      if (!util.isString (v)) return;
      this._font_family = v;
      GLView.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {String}
     */
    get : function () {
      return this._font_family;
    }
  },
  
  'fontSize': {
    /**
     * Change view fontSize.
     * @name vs.ui.GLStyle#fontSize
     * @type {String}
     */
    set : function (v) {
      if (util.isString (v)) v = parseInt (v, 10);
      if (!util.isNumber (v)) return;
      this._font_size = v;
      GLView.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {String}
     */
    get : function () {
      return this._font_size;
    }
  },
  
  'fontWeight': {
    /**
     * Change view fontWeight.
     * @name vs.ui.GLStyle#fontWeight
     * @type {String}
     */
    set : function (v) {
      if (v != "normal" && v != "bold" && v != "bolder" && v != "lighter" &&
          v != "100" && v != "200" && v != "300" && v != "400" && v != "500" &&
          v != "600" && v != "700" && v != "800" && v != "900") {
        return;   
      }
      this._font_weight = v;
      GLView.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {String}
     */
    get : function () {
      return this._font_weight;
    }
  },
  
  'textAlign': {
    /**
     * Change view textAlign.
     * @name vs.ui.GLStyle#textAlign
     * @type {String}
     */
    set : function (v) {
      if (!util.isString (v)) return;
      this._text_align = v;
      GLView.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {String}
     */
    get : function () {
      return this._text_align;
    }
  },
  
  'textTransform': {
    /**
     * Change view fontFamily.
     * @name vs.ui.GLStyle#textTransform
     * @type {String}
     */
    set : function (v) {
      if (!util.isString (v)) return;
      this._text_transform = v;
      GLView.__should_render = true;
    },
    
    /**
     * @ignore
     * @type {String}
     */
    get : function () {
      return this._text_transform;
    }
  },

  'backgroundImage': {
    /**
     * Set the image url
     * @name vs.ui.GLStyle#src 
     * @type {string}
     */
    set : function (v) {
      if (!util.isString (v)) { return; }
      
      this._background_image = v;
      
      if (!v) {
        if (this.__gl_texture_bck_image) {
          gl_free_texture_image (this._background_image);
          this.__gl_texture_bck_image = null;
        }
      }
      else {
        var self = this;
        gl_get_texture_from_image_url (
          self._background_image, function (texture) {
            self.__gl_texture_bck_image = texture;
            
//             if (!self.__gl_bck_image_uv_buffer) {
//               self.backgroundImageUV = [0,1, 0,0, 1,1, 1,0];
//             }
          }
        )
      }
      GLView.__should_render = true;
    },

 
    /**
     * Get the image url
     * @ignore
     * @return {string}
     */
    get : function () {
      return this._background_image;
    }
  },
  
  'backgroundImageUV': {
    /**
     * Set the image url
     * @name vs.ui.GLStyle#src 
     * @type {string}
     */
    set : function (v) {
      if (!v) { return; }
      if (!util.isArray (v) || v.length != 8) { return; }
      if (!util.isNumber (v[0]) || !util.isNumber(v[1]) ||
          !util.isNumber (v[2]) || !util.isNumber(v[3]) ||
          !util.isNumber (v[4]) || !util.isNumber(v[5]) ||
          !util.isNumber (v[6]) || !util.isNumber(v[7])) { return; }
      
      this._background_image_uv = new Float32Array (v);
      
//       var UV = new Float32Array (v);
// 
//       if (!this.__gl_bck_image_uv_buffer) {
//         this.__gl_bck_image_uv_buffer = gl_ctx.createBuffer ();
//       }
// 
//       gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, this.__gl_bck_image_uv_buffer);
//       console.log (UV)
//       gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, UV, gl_ctx.STATIC_DRAW);
      GLView.__should_render = true;
    },
  
    /**
     * Get the image url
     * @ignore
     * @return {string}
     */
    get : function () {
      return this._background_image_uv;
    }
  }
});

var _default_style;

function initDefaultStyle () {
  _default_style = new GLStyle ();
  _default_style.backgroundColor = GLColor.default;
  _default_style.color = GLColor.black;
}

glAddInitFunction (initDefaultStyle);

/********************************************************************
                      Export
*********************************************************************/
/** @private */
vs.ui.GLStyle = GLStyle;
/**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and
  contributors. All rights reserved

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var
  util = vs.util,
  core = vs.core,
  ui = vs.ui,
  VSObject = vs.core.Object;

/*
 *----------------------------------------------------------------------
 *
 * _DoOneEvent --
 *
 *  Process a single event of some sort.  If there's no work to
 *  do, wait for an event to occur, then process it.
 *
 *
 *----------------------------------------------------------------------
 */

/**
 *  Structure used for managing events
 *  @private
 */
function Handler (_obj, _func) {
  this.obj = _obj;
  if (util.isFunction (_func)) {
    this.func_ptr = _func;
  }
  else if (util.isString (_func)) {
    this.func_name = _func;
  }
}

/**
 * @private
 */
Handler.prototype.destructor = function () {
  delete (this.obj);
  delete (this.func_ptr);
  delete (this.func_name);
};

/**
 *  Structure used for managing task
 *  @private
 */
function TaskHandler (func, args) {
  this.func_ptr = func;
  this.args = args;
}

/**
 * @private
 */
TaskHandler.prototype.run = function () {
  this.func_ptr.apply (undefined);
};

/**
 * @private
 */
TaskHandler.prototype.destructor = function () {
  delete (this.args);
  delete (this.func_ptr);
};

/**
 * @private
 */
var
  // Events queue. This array contains event structure for future propagation.
  // This array is part of the algorithm that secure event propagation, in
  // particular that avoids a event pass a previous one.
  _async_events_queue = [],
  
  // Event reference on the current synchronous event.
  _sync_event = null,
  
  // Actions queue. This array contains all actions (function for the moment)
  // that have to be execute.
  // This queue is used only in case we use our own implementation of 
  // setImmediate.
  _actions_queue  = [],
  // Boolean indicating if we are propagating a event or not.
  // To secure event propagation, in particular to avoid a event pass a previous
  // event, we manage a events queue and block new propagation if a event is
  // in propagation.
  _is_async_events_propagating = false,
  _is_sync_events_propagating = false,
  
  // Boolean indicating if we are running an action or not.
  // This boolean is used only in case we use our own implementation of 
  // setImmediate.
  _is_action_runing = false,
  _is_waiting = false;

/**
 * Put an asynchronous event into the event queue and request the mainloop
 *
 * @private
 */
function queueProcAsyncEvent (event, handler_list) {
  if (!event || !handler_list) return;

  var burst = {
    handler_list : handler_list,
    event : event
  }

  // push the event to dispatch into the queue
  _async_events_queue.push (burst);

  // request for the mainloop
  serviceLoop ();
}

/**
 * Setup a synchronous event and request the mainloop
 *
 * @private
 */
function queueProcSyncEvent (event, handler_list) {
  if (!event || !handler_list) return;

  var burst = {
    handler_list : handler_list,
    event : event
  }

  // push the event to dispatch into the queue
  _sync_event = burst;

  // request for the mainloop
  serviceLoop ();
}

/**
 * doOneEvent will dispatch One event to all observers.
 *
 * @private
 * @param {Object} burst a event burst structure
 * @param {Boolean} isSynchron if its true the callbacks are executed
 *             synchronously, otherwise they are executed within a setImmediate
 */
function doOneEvent (burst, isSynchron) {
  var
    handler_list = burst.handler_list,
    n = handler_list.length,
    i = n, l = n,
    event = burst.event;

  if (isSynchron) _is_sync_events_propagating = true;
  else _is_async_events_propagating = true;
  
  // Test is all observers have been called
  function end_propagation () {
    l--;
    if (l <= 0) {
      if (isSynchron) _is_sync_events_propagating = false;
			else _is_async_events_propagating = false;
		}
  }

  /**
   * doOneHandler will dispatch One event to an observer.
   *
   * @private
   * @param {Handler} handler
   */
  function doOneHandler (handler) {
    if (handler) try {
      if (util.isFunction (handler.func_ptr)) {
        // call function
        handler.func_ptr.call (handler.obj, event);
      }
      else if (util.isString (handler.func_name) &&
               util.isFunction (handler.obj[handler.func_name]))
      {
        // specific notify method
        handler.obj[handler.func_name] (event);
      }
      else if (util.isFunction (handler.obj.notify)) {
        // default notify method
        handler.obj.notify (event);
      }
    }
    catch (e) {
      if (e.stack) console.error (e.stack);
      else console.error (e);
    }
    end_propagation ();
  };

  if (!i) end_propagation (); // should not occur
  
  // For each observers, schedule the handler call (callback execution)
  for (i = 0; i < n; i++) {
    if (isSynchron) doOneHandler (handler_list [i])
  
    else (function (handler) {
        vs.setImmediate (function () { doOneHandler(handler) });
      }) (handler_list [i])
  }
}

/**
 * doOneAsyncEvent will dispatch One event to all observers.
 *
 * @private
 */
function doOneAsyncEvent () {
  if (_is_async_events_propagating || _is_sync_events_propagating) return;
  
  // dequeue the next event burst and do it
  doOneEvent (_async_events_queue.shift ());
}

/**
 * doOneSyncEvent will dispatch the synchronous event to all observers.
 *
 * @private
 */
function doOneSyncEvent () {
  doOneEvent (_sync_event, true);
  _sync_event = null;
}

/**
 * doAction, execute one action. This method is called with our setImmediate
 * implementation.
 *
 * @private
 */
function doAction () {

  if (!_actions_queue.length) return;
  
  var action = _actions_queue.shift ();

  if (action) try {
    _is_action_runing = true;
    action.run ();
  }
  catch (e) {
    if (e.stack) console.error (e.stack);
    else console.error (e);
  }

  vs.util.free (action);
  _is_action_runing = false;

  if (_actions_queue.length) { _delay_do_action (); }
}

/**
 * doAction, execute one action. This method is called with our setImmediate
 * implementation.
 *
 * @private
 */
function installPostMessageImplementation () {

  var MESSAGE_PREFIX = "vs.core.scheduler" + Math.random ();

  function onGlobalMessage (event) {
    if (event.data === MESSAGE_PREFIX) {
      doAction ();
    }
  }
  
  if (window.addEventListener) {
    window.addEventListener ("message", onGlobalMessage, false);
  }

  return function () {
    window.postMessage (MESSAGE_PREFIX, "*");
  };
}

var _delay_do_action = (window.postMessage)?installPostMessageImplementation():
  function () {setTimeout (doAction, 0)};

/**
 * Install our awn setImmediate implementation, if needs
 *
 * @private
 */
var setImmediate = window.setImmediate || function (func) {

  // push the action to execute into the queue
  _actions_queue.push (new TaskHandler (func));

  // doAction
  if (!_is_action_runing) _delay_do_action ();
};

/**
 * This method is used to break-up long running operations and run a callback
 * function immediately after the browser has completed other operations such
 * as events and display updates.
 *
 * @example
 * vs.setImmediate (function () {...});
 *
 * @see vs.scheduleAction
 * @name vs.setImmediate 
 * @param {Function} func The action to run
 */
vs.setImmediate = setImmediate.bind (window);

/**
 * Mainloop core
 *
 * @private
 */
function serviceLoop () {

  if (_sync_event) doOneSyncEvent ();

  if ((_async_events_queue.length === 0 && _actions_queue.length === 0) ||
      _is_waiting) return;

  function loop () {
    _is_waiting = false;
    serviceLoop ();
  }

  if (_is_async_events_propagating || _is_sync_events_propagating) {
    // do the loop
    vs.setImmediate (loop);
    return;
  }

  // dispatch an event to observers
  if (!_is_action_runing && _actions_queue.length) _delay_do_action ();
  if (_async_events_queue.length) doOneAsyncEvent ();
}

/** 
 * Schedule your action on next frame.
 *
 * @example
 * vs.scheduleAction (function () {...}, vs.ON_NEXT_FRAME);
 *
 * @see vs.scheduleAction
 *
 * @name vs.ON_NEXT_FRAME 
 * @type {String}
 * @const
 * @public
 */ 
var ON_NEXT_FRAME = '__on_next_frame__';

/** 
 * Schedule an action to be executed asynchronously.
 * <br />
 * There is three basic scheduling; the action can be executed:
 * <ul>
 *   <li>as soon as possible.
 *   <li>on the next frame
 *   <li>after a delay
 * </ul>
 *
 * 1- As soon as possible<br />
 * The action will be executed as soon as possible in a manner that is
 * typically more efficient and consumes less power than the usual
 * setTimeout(..., 0) pattern.<br />
 * It based on setImmediate if it is available; otherwise it will use postMessage
 * if it is possible and at least setTimeout(..., 0) pattern if previous APIs are
 * not available.
 *<br /><br />
 *
 * 2- On next frame<br />
 * The action will be executed on next frame.<br />It is equivalent to use
 * window.requestAnimationFrame.
 *<br /><br />
 *
 * 2- After a delay<br />
 * The action will be executed after a given delay in millisecond.<br />
 * It is equivalent to use window.setTimeout(..., delay).
 *
 * @example
 * // run asap
 * vs.scheduleAction (function () {...});
 * // run on next frame
 * vs.scheduleAction (function () {...}, vs.ON_NEXT_FRAME);
 * // run after 1s
 * vs.scheduleAction (function () {...}, 1000);
 *
 * @name vs.scheduleAction 
 * @type {String}
 * @function
 * @public
 *
 * @param {Function} func The action to run
 * @param {(Number|String)} delay when run the action [optional]
 */ 
function scheduleAction (func, delay) {
  if (!util.isFunction (func)) return;
  if (delay && util.isNumber (delay)) {
    setTimeout (func, delay);
  }
  else if (delay === ON_NEXT_FRAME) {
    vs.requestAnimationFrame (func);
  }
  else vs.setImmediate (func);
}

/********************************************************************
                      Export
*********************************************************************/
/** @private */
util.extend (vs, {
  scheduleAction: scheduleAction,
  ON_NEXT_FRAME: ON_NEXT_FRAME
});

/**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and
  contributors. All rights reserved

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/**
 *  @class
 *  vs.core.EventSource is an  class that forms the basis of event and command
 *  processing. All class that handles events must inherit form EventSource.
 *
 *  @extends vs.core.Object
 *  @author David Thevenin
 *
 *  @constructor
 *  Main constructor
 *
 * @name vs.core.EventSource
 *
 * @param {Object} config the configuration structure [mandatory]
 */
function GLEventSource (config)
{
  this.parent = VSObject;
  this.parent (config);
  this.constructor = core.GLEventSource;

  this.__bindings__ = {};
  
  this._pointer_start = [];
  this._pointer_move = [];
  this._pointer_end = [];
}

/** @name vs.core.GLEventSource# */
GLEventSource.prototype =
{
  /**
   * @protected
   * @function
   */
  __bindings__ : null,
  
  /***************************************************************

  ***************************************************************/

  /**
   * @protected
   * @function
   */
  destructor : function ()
  {
    var spec, handler_list, i, handler, binds;

    function deleteBindings (handler_list)
    {
      if (!handler_list) return;

      var bind, l = handler_list.length;
      while (l--)
      {
        bind = handler_list [l];
        util.free (bind);
      }
    };

    for (var spec in this.__bindings__)
    {
      deleteBindings (this.__bindings__ [spec]);
      delete (this.__bindings__ [spec]);
    }

    delete (this.__bindings__);

    VSObject.prototype.destructor.call (this);
  },

  _pointer_start : null,
  _pointer_move : null,
  _pointer_end : null,
  
  addEventListener: function (type, handler, useCapture) {
    if (type === vs.POINTER_START) {
      this._pointer_start.push (handler);
      __gl_activate_pointer_start ();
    }
    else if (type === vs.POINTER_MOVE) {
      this._pointer_move.push (handler);
      __gl_activate_pointer_move ();
    }
    else if (type === vs.POINTER_END) {
      this._pointer_end.push (handler);
      __gl_activate_pointer_end ();
    }
//    console.log ("addEventListener:" + type);  
  },

  removeEventListener: function (type, handler, useCapture) {
    if (type === vs.POINTER_START) {
      this._pointer_start.remove (handler);
      __gl_deactivate_pointer_start ()
    }
    else if (type === vs.POINTER_MOVE) {
      this._pointer_move.remove (handler);
      __gl_deactivate_pointer_move ()
    }
    else if (type === vs.POINTER_END) {
      this._pointer_end.remove (handler);
      __gl_deactivate_pointer_end ()
    }
//    console.log ("removeEventListener: " + type);  
  },

  /**
   * @name vs.core.GLEventSource#_clone
   * @function
   * @private
   *
   * @param {vs.core.Object} obj The cloned object
   * @param {Object} map Map of cloned objects
   */
  _clone : function (obj, cloned_map)
  {
    VSObject.prototype._clone.call (this, obj, cloned_map);

    obj.__bindings__ = {};
  },

  /**
   *  The event bind method to listen events
   *  <p>
   *  When you want listen an event generated by this object, you can
   *  bind your object (the observer) to this object using 'bind' method.
   *  <p>
   *
   * @name vs.core.EventSource#bind
   * @function
   *
   * @param {string} spec the event specification [mandatory]
   * @param {vs.core.Object} obj the object interested to catch the event [mandatory]
   * @param {string} func the name of a callback. If its not defined
   *        notify method will be called [optional]
   */
  bind : function (spec, obj, func)
  {
    if (!spec || !obj) { return; }

    /** @private */
    var handler = new Handler (obj, func),
      handler_list = this.__bindings__ [spec];
    if (!handler_list)
    {
      handler_list = [];
      this.__bindings__ [spec] = handler_list;
    }
    handler_list.push (handler);

    return handler;
  },

  /**
   *  The event unbind method
   *  <p>
   *  Should be call when you want stop event listening on this object
   *
   * @name vs.core.EventSource#unbind
   * @function
   *
   * @param {string} spec the event specification [mandatory]
   * @param {vs.core.Object} obj the object you want unbind [mandatory]
   * @param {string} func the name of a callback. If its not defined
   *        all binding with <spec, obj> will be removed
   */
  unbind : function (spec, obj, func)
  {
    function unbind (handler_list)
    {
      if (!handler_list) return;

      var handler, i = 0;
      while (i < handler_list.length)
      {
        handler = handler_list [i];
        if (handler.obj === obj)
        {
          if (util.isString (func) || util.isFunction (func) )
          {
            if (handler.func_name === func || handler.func_ptr === func)
            {
              handler_list.remove (i);
              util.free (handler);
            }
            else { i++; }
          }
          else
          {
            handler_list.remove (i);
            util.free (handler);
          }
        }
        else { i++; }
      }
    };

    unbind (this.__bindings__ [spec]);
  },

  /**
   *  Propagate an event
   *  <p>
   *  All Object listening this GLEventSource will receive this new handled
   *  event.
   *
   * @name vs.core.GLEventSource#propagate
   * @function
   *
   * @param {String} spec the event specification [mandatory]
   * @param {Object} data an optional data event [optional]
   * @param {vs.core.Object} srcTarget a event source, By default this object
   *        is the event source [mandatory]
   */
  propagate : function (type, data, srcTarget)
  {
    var handler_list = this.__bindings__ [type], event;
    if (!handler_list || handler_list.length === 0)
    {
      if (this.__parent)
      {
        if (!srcTarget) { srcTarget = this; }
        this.__parent.propagate (type, data, srcTarget);
      }
      return;
    }

    event = new vs.core.Event (this, type, data);
    if (srcTarget) { event.srcTarget = srcTarget; }

    queueProcAsyncEvent (event, handler_list);
  },

  /**
   * if this object receive an event it repropagates it if nobody has
   * overcharged the notify method.
   *
   * @name vs.core.GLEventSource#notify
   * @function
   *
   * @protected
   */
  notify : function (event)
  {
    this.propagate (event.type, event.data);
  }
};
util.extendClass (GLEventSource, VSObject);

/********************************************************************
                      Export
*********************************************************************/
/** @private */
core.GLEventSource = GLEventSource;


var __unique_gl_id = 1;
var GL_VIEWS = [];

/**
 *  The vs.ui.GLView class
 *
 *  @extends vs.core.EventSource
 *  @class
 *  vs.ui.GLView is a class that defines the basic drawing, event-handling, of
 *  an application. You typically don’t interact with the vs.ui.GLView API
 *  directly; rather, your custom view classes inherit from vs.ui.GLView and
 *  override many of its methods., Its also supports 2D
 *  transformations (translate, rotate, scale).
 *  <p>
 *  If you’re not creating a custom view class, there are few methods you
 *  need to use
 *
 *  Events:
 *  <ul>
 *    <li /> POINTER_START: Fired after the user click/tap on the view, when
 *           the user depresses the mouse/screen
 *    <li /> POINTER_MOVE: Fired after the user move the mouse/his finger on
 *           the view.
 *    <li /> POINTER_END: Fired after the user click/tap on the view, when
 *           the user release the mouse/ the pressur on screen.
 *  </ul>
 *  <p>
 *
 *  @author David Thevenin
 *
 *  @constructor
 *   Creates a new vs.ui.GLView.
 *
 * @name vs.ui.GLView
 *
 * @param {Object} config the configuration structure [mandatory]
 */
function GLView (config)
{
  this.parent = GLEventSource;
  this.parent (config);
  this.constructor = GLView;
  
  // init recognizer support
  this.__pointer_recognizers = [];
  
  this.__gl_matrix = mat4.create ();
  mat4.identity (this.__gl_matrix);
  
  this.__gl_p_matrix = mat4.create ();
  this.__gl_m_matrix = mat4.create ();
  

  this.__gl_id = __unique_gl_id ++;
  GL_VIEWS [this.__gl_id] = this;
  
  // contains position vertices
  this.__gl_vertices = new Float32Array (12);
  this.__gl_vertices_buffer = gl_ctx.createBuffer ();
  this.__vertex_1 = vec3.create ();
  this.__vertex_2 = vec3.create ();
  this.__vertex_3 = vec3.create ();
  this.__vertex_4 = vec3.create ();

  this.__children = [];
  this._pointerevent_handlers = [];
  
  this.view = this;

  // position and size : according constraints rules, can change
  // automaticaly if the parent container is resized
  this._position = vec3.create ();
  this._size = vec2.create ();

  this._rotation = vec3.create ();
  this._translation = vec3.create ();
  this._transform_origin = vec2.create ();

  this.__animations = [];
}

GLView.__should_render = true;
GLView.__nb_animation = 0;

var angle2rad = Math.PI / 180;

/********************************************************************

*********************************************************************/

/**
 * @private
 */
GLView._positionStyle = undefined;

/**
 * @private
 */
var _template_nodes = null;

GLView.prototype = {

  /**
   * @protected
   * @type {boolean}
   */
  __gl_context: null,
  __gl_object: true,
  __gl_texture: null,
  __gl_vertices_buffer: null,
  __gl_id: null,
  __invalid_matrixes: true,

  /*****************************************************************
   *                Private members
   ****************************************************************/
  /**
   * @protected
   * @type {boolean}
   */
  _visible: true,

  /**
   * @protected
   * @type {Object}
   */
  _pointerevent_handlers: null,

  /**
   *
   * @protected
   * @type {boolean}
   */
  _enable: true,

  /**
   * @protected
   * @type {Array}
   */
  _position : null,

  /**
   * @protected
   * @type {Array}
   */
  _size : null,
  
  /**
   * @protected
   * @type {Array}
   */
  __gl_vertices: null,
  __gl_matrix: null,
  __gl_m_matrix: null,
  __gl_p_matrix: null,

   /**
   * Scale value
   * @protected
   * @type {number}
   */
  _scaling : 1,

   /**
   * Rotation value
   * @protected
   * @type {number}
   */
  _rotation : null,
  _translation : null,
  
  _constraint: null,
  _style: null,

  /**
   * @protected
   * @type {Array.<number>}
   */
  _transform_origin: null,

  /*****************************************************************
   *
   ****************************************************************/

  /**
   * @protected
   * @function
   */
  destructor : function ()
  {
    var i, child;
    if (this.__parent) {
      this.__parent.remove (this);
    }

    for (i = 0; i < this.__children.length; i++) {
      child = this.__children [i];
      util.free (child);
    }
    delete (this.__children);

    this.clearTransformStack ();
    
    if (this.__gl_texture) {
      gl_ctx.deleteTexture (this.__gl_texture);
      this.__gl_texture = null;
    }

    GLEventSource.prototype.destructor.call (this);
  },

  /**
   * @protected
   * @function
   */
  refresh : function ()
  {
    this._updateSizeAndPos ();
    
    var i = 0, l = this.__children.length, child;

    for (; i < l; i++) {
      child = this.__children [i];
      if (!child || !child.refresh) { continue; }
      child.refresh ();
    }
  },

  /**
   * @protected
   * @function
   */
  initComponent : function ()
  {
    GLEventSource.prototype.initComponent.call (this);

    this._style = new GLStyle ();
    this._constraint = null;

    if (!this.__config__) this.__config__ = {};
    this.__config__.id = this.id;
    
    this._position[0] = 0;
    this._position[1] = 0;
    this._position[2] = 0;
    
    this._size[0] = 0;
    this._size[1] = 0;
    
    this._transform_origin [0] = 0;
    this._transform_origin [1] = 0;

    this._rotation [0] = 0;
    this._rotation [1] = 0;
    this._rotation [2] = 0;

    this._translation [0] = 0;
    this._translation [1] = 0;
    this._translation [2] = 0;
    
    this.__should_update_gl_matrix = true;
  },

  /**
   * Notifies that the component's view was added to the DOM.<br/>
   * You can override this method to perform additional tasks
   * associated with presenting the view.<br/>
   * If you override this method, you must call the parent method.
   *
   * @name vs.ui.GLView#viewDidAdd
   * @function
   */
  viewDidAdd : function () {
    this._updateSizeAndPos ();
  },

  /**
   * @protected
   * @function
   */
  notify : function (event) {},
  
  /**
   *  Instantiate, init and add the specified child component to this component.
   *  <p>
   *  The view of the MyGUIComponent is dynamically loaded (from file),
   *  instanciated and  added into the HTML DOM.
   *  <p>
   *  @example
   *  var id =
   *    myObject.createAndAddComponent ('MyGUIComponent', config, 'children');
   *
   * @name vs.ui.GLView#createAndAddComponent
   * @function
   *
   * @param {String} comp_name The GUI component name to instanciate
   * @param {Object} config Configuration structure need to build the component.
   * @param {String} extension The hole into the vs.ui.GLView will be insert.
   * @return {vs.core.Object} the created component
   */
  createAndAddComponent : function (comp_name, config, extension)
  {
    var comp_class = window [comp_name];
    if (!comp_class) {
      console.error ("Impossible to fund component '" + comp_name + "'.");
      return;
    }

    // verify the component view already exists
    if (!config) {config = {};}

    if (!config.id) { config.id = core.createId (); }

    var path, data, xmlRequest, div, children, i, len, obj, msg;

    obj = null;

    // Build object
    try { obj = new comp_class (config); }
    catch (exp)
    {
      msg = "Impossible to instanciate comp: " + comp_name;
      msg += " => " + exp.message;
      console.error (msg);
      if (exp.stack) console.error (exp.stack);
      return;
    }

    // Initialize object
    try
    {
      obj.init ();
      obj.configure (config);
    }
    catch (exp)
    {
      if (exp.line && exp.sourceURL)
      {
        msg = "Error when initiate comp: " + comp_name;
        msg += " => " + exp.message;
        msg += "\n" + exp.sourceURL + ":" + exp.line;
      }
      else { msg = exp; }
      console.error (msg);
      if (exp.stack) console.error (exp.stack);
    }

    // Add object to its parent
    this.add (obj, extension);
    obj.refresh ();

    return obj;
  },

  /**
   *  Return true if the set component is a child o the current component
   *
   * @name vs.ui.GLView#isChild
   * @function
   *
   * @param {vs.GLEventSource} child The component to be removed.
   * @return {boolean}
   */
  isChild : function (child)
  {
    if (!child) { return false; }

    if (this.__children.indexOf (child) !== -1) {
      return true;
    }

    return false;
  },

  /**
   *  Add the specified child component to this component.
   *  <p>
   *  The component can be a graphic component (vs.ui.GLView) or
   *  a non graphic component (vs.GLEventSource).
   *  In case of vs.ui.GLView its mandatory to set the extension.
   *  <p>
   *  The add is a lazy add! The child's view can be already in
   *  the HTML DOM. In that case, the add methode do not modify the DOM.
   *  <p>
   *  @example
   *  var myButton = new Button (conf);
   *  myObject.add (myButton, 'children');
   *
   * @name vs.ui.GLView#add
   * @function
   *
   * @param {vs.GLEventSource} child The component to be added.
   * @param {String} extension [optional] The hole into a vs.ui.GLView will be
   *       insert.
   */
  add : function (child)
  {
    if (!child) { return; }

    if (this.isChild (child)) { return; }

    this.__children.push (child);

    child.__parent = this;
    if (this.__i__ && child.__i__ && child.viewDidAdd) {
      child.viewDidAdd ();
    }
    
    vs.scheduleAction (function () {
      GLView.__should_render = true;
    });
  },

  /**
   *  Remove the specified child component from this component.
   *
   *  @example
   *  myObject.remove (myButton);
   *
   * @name vs.ui.GLView#remove
   * @function
   *
   * @param {vs.GLEventSource} child The component to be removed.
   */
  remove : function (child)
  {
    if (!child) { return; }
    
    if (!this.isChild (child)) { return; }

    this.__children.remove (child);
    child.__parent = null;
    
    vs.scheduleAction (function () {
      GLView.__should_render = true;
    });
  },

  /**
   *  Remove all children components from this component and free them.
   *
   *  @example
   *  myObject.removeAllChildren ();
   *
   * @name vs.ui.GLView#removeAllChild
   * @function
   * @param {Boolean} should_free free children
   * @param {String} extension [optional] The hole from witch all views will be
   *   removed
   * @return {Array} list of removed child if not should_free
   */
  removeAllChildren : function (should_free)
  {
    var child, children = [];

    while (this.__children.length) {
      child = this.__children [0];
      this.remove (child);
      if (should_free) util.free (child);
      else children.push (child);
    }
    
    return (should_free)?undefined:children;
    
    vs.scheduleAction (function () {
      GLView.__should_render = true;
    });
  },

/********************************************************************
                  GUI Utilities
********************************************************************/

  /**
   * @protected
   * @function
   * This function cost a lot!
   */
  _updateSizeAndPos : function ()
  {
    if (this._constraint) {
      this._constraint.__update_view (this);
    }

    this.__should_update_gl_vertices = true;
    this.__should_update_gl_matrix = true;
  },
  
/********************************************************************

********************************************************************/

  /**
   *  Force the redraw of your widget.
   *  <p>
   *  Some time a redraw is required to force the browser to rerender
   *  a part of you GUI or the entire GUI.
   *  Call redraw function on you Application object for a entire redraw or just
   *  on a specific widget.
   *
   * @name vs.ui.GLView#redraw
   * @function
   *
   * @param {Function} clb Optional function to call after the redraw
   */
  redraw : function (clb)
  {
    this._updateSizeAndPos ();
  },

  /**
   *  Displays the GUI Object
   *
   * @name vs.ui.GLView#show
   * @param {Function} clb a function to call a the end of show process
   * @function
   */
  show : function (clb)
  {
    if (this._visible) { return; }
    if (!util.isFunction (clb)) clb = undefined;

    this.__is_hidding = false;
    this.__is_showing = true;

    this._show_object (clb);
  },

  /**
   *  Show the GUI Object
   *
   * @private
   * @param {Function} clb a function to call a the end of show process
   * @function
   */
  _show_object : function (clb)
  {
    vs.scheduleAction (function () {
      GLView.__should_render = true;
    });
    
    this.__visibility_anim = undefined;

    if (!this.__is_showing) { return; }
    this.__is_showing = false;

    this._visible = true;
    var self = this;

    this.propertyChange ();
    if (clb) {
      if (clb) {
        vs.scheduleAction (function () {clb.call (self);});
      }
    }
  },

  __gl_update_animation : function (now) {
    var i = 0, l = this.__animations.length, anim;
    for (;i<l; i++) {
      anim = this.__animations [i];
      anim._clock (now);
    }
  },














  /**
   * @name vs.ui.View#clone
   * @function
   * @private
   *
   * @param {vs.core.Object} obj The cloned object
   * @param {Object} map Map of cloned objects
   */
  clone : function (config, cloned_map)
  {
//     function _getPaths (root, nodes)
//     {
//       var paths = [], i = 0, l = nodes.length, node;
//       for (; i < l; i++)
//       {
//         node = nodes[i];
//         paths.push ([node, _getPath (root, node)]);
//       }
//       return paths;
//     }
// 
//     function _evalPaths (root, paths, clonedViews)
//     {
//       var nodes = [], i = 0, l = paths.length, path;
//       for (; i < l; i++)
//       {
//         path = paths[i];
//         if (!path.id) path.id = core.createId ();
//         clonedViews [path[0].id] = _evalPath (root, path[1]);
//       }
//     }
// 
//     function makeClonedNodeMap (comp, clonedViews)
//     {
//       var
//         clonedNode = comp.view.cloneNode (true),
//         nodes = [], paths;
//         
//       function manageChild (child)
//       {
//         if (child.__gui_object__hack_view__)
//         { nodes.push (child.__gui_object__hack_view__); }
//         else if (child.view) { nodes.push (child.view); }
//       
//         retreiveChildNodes (child);
//       }
//         
//       function retreiveChildNodes (comp)
//       {
//         var key, a, i, l, child;
//         for (key in comp.__children)
//         {
//           a = comp.__children [key];
//           if (!a) { continue; }
//           
//           if (util.isArray (a))
//           {
//             l = a.length;
//             for (i = 0; i < l; i++)
//             {
//               manageChild (a [i]);
//             }
//           }
//           else manageChild (a);
//         }
//       }
//       
//       retreiveChildNodes (comp);
//       
//       paths = _getPaths (comp.view, nodes);
//       _evalPaths (clonedNode, paths, clonedViews);
//       
//       return clonedNode;
//     }
    
    if (!cloned_map) { cloned_map = {}; }
//    if (!cloned_map.__views__) { cloned_map.__views__ = {}; }    
    if (!config) { config = {}; }
//     if (!config.node)
//     {
//       var node = cloned_map.__views__ [this.view.id];
//       if (!node)
//       {
//         node = makeClonedNodeMap (this, cloned_map.__views__);
//       }
//       config.node = node;
//     }

    return GLEventSource.prototype.clone.call (this, config, cloned_map);
  },

  /**
   * @name vs.ui.View#_clone
   * @function
   * @private
   *
   * @param {vs.core.Object} obj The cloned object
   * @param {Object} map Map of cloned objects
   */
  _clone : function (obj, cloned_map)
  {
    var anim, a, key, child, l, hole, cloned_comp;

    GLEventSource.prototype._clone.call (this, obj, cloned_map);


    if (this._style) {
      if (!obj._style) {
        obj.style = this._style.clone ();
      }
      else {
        this._style.copy (obj._style);
      }
//      console.log (obj.style);
    }

    // remove parent link
    obj.__parent = undefined;

    function getClonedComp (comp, cloned_map) {
      if (!comp || !cloned_map) return null;
      
      if (cloned_map [comp._id]) return cloned_map [comp._id];
      
      var  view = cloned_map.__views__ [comp._id];
        
      return (view)?view._comp_:null;
    }
    
    var self = this;
    this.__children.forEach (function (child, index) {
      var cloned_child = child.clone ();
      
      cloned_map [child._id] = cloned_child;
      
      obj.add (cloned_child);
    });
  },

























  /**
   *  Hides the GUI Object
   *
   * @name vs.ui.GLView#hide
   * @param {Function} clb a function to call a the end of show process
   * @function
   */
  hide : function (clb)
  {
    if (!this._visible && !this.__is_showing) { return; }
    if (!util.isFunction (clb)) clb = undefined; 

    this._visible = false;
    
    this.__is_showing = false;
    this.__is_hidding = true;

    this._hide_object (clb);
  },

  /**
   *  Hides the GUI Object
   *
   * @private
   * @function
   * @param {Function} clb a function to call a the end of show process
   */
  _hide_object: function (clb) {
    vs.scheduleAction (function () {
      GLView.__should_render = true;
    });
    
    if (this._visible) { return; }
    this.__visibility_anim = undefined;

    if (!this.__is_hidding) { return; }
    
    this.__is_hidding = false;
    if (clb) {
      if (clb) {
        vs.scheduleAction (function () {clb.call (self);});
      }
    }
    this.propertyChange ();
  },

/********************************************************************

********************************************************************/

  /**
   * @protected
   * @function
   */
  _propagateToParent : function (e)
  {
    if (this.__parent) {
      
      if (this.__parent.handleEvent) {
        to_propatate = this.__parent.handleEvent (e);
      }
      
      if (to_propatate) {
        this.__parent._propagateToParent (e);
      }
    }
  },

  /**
   * @name vs.ui.GLView#notifyToParent
   * @function
   */
  notifyToParent : function (e)
  {
    if (!this.__parent) { return; }
    if (this.__parent.handleEvent)
    {
      this.__parent.handleEvent (e);
    }
    else if (this.__parent.notify)
    {
      this.__parent.notify (e);
    }
  },

  /**
   * Did enable delegate
   * @name vs.ui.GLView#_didEnable
   * @protected
   */
  _didEnable : function () {},

  /*****************************************************************
   *                Animation methods
   ****************************************************************/

  _clone_properties_value : function (obj, cloned_map)
  {
    var key;
    
    for (key in this)
    {
      if (key == 'id' || key == 'view' || key == '__parent' ||
          key == 'style' || key == '_style') continue;

      // property value copy
      if (this.isProperty (key)) {
        vs.core.Object.__propertyCloneValue (key, this, obj);
      }
      else if (this [key] instanceof GLView) {
        obj [key] = cloned_map [this [key]._id];
      }
    }
  }
};
util.extend (GLView.prototype, vs.ui.RecognizerManager);
util.extendClass (GLView, GLEventSource);

/********************************************************************
                  Define class properties
********************************************************************/

util.defineClassProperties (GLView, {

  'size': {
    /**
     * Getter|Setter for size. Gives access to the size of the GUI Object
     * @name vs.ui.GLView#size
     *
     * @type {Array.<number>}
     */
    set : function (v)
    {
      if ((!util.isArray (v) && !(v instanceof Float32Array)) || v.length !== 2) { return; }
      if (!util.isNumber (v[0]) || !util.isNumber(v[1])) { return; }

      this._size [0] = v [0];
      this._size [1] = v [1];

      this._updateSizeAndPos ();
    },

    /**
     * @ignore
     * @type {Array.<number>}
     */
    get : function ()
    {
      return this._size;
    }
  },

  'position': {
    /**
     * Getter|Setter for position. Gives access to the position of the GUI
     * Object
     * @name vs.ui.GLView#position
     *
     * @type Array
     */
    set : function (v)
    {
      if (!v) { return; }
      if ((!util.isArray (v) && !(v instanceof Float32Array)) || (v.length != 2 && v.length != 3)) { return; }
      if (!util.isNumber (v[0]) || !util.isNumber(v[1])) { return; }
      if (!util.isNumber(v[2])) v[2] = 0;
      
      vec3.set (v, this._position);

      this._updateSizeAndPos ();
    },

    /**
     * @ignore
     * @type {Array.<number>}
     */
    get : function ()
    {
      return this._position;
    }
  },

  'visible': {

    /**
     * Hide or show the object.
     * obj.visible = true <=> obj.show (), obj.visible = false <=> obj.hide (),
     * @name vs.ui.GLView#visible
     * @type {boolean}
     */
    set : function (v)
    {
      if (v)
      { this.show (); }
      else
      { this.hide (); }
    },

    /**
     * Return true is the object is visible. False otherwise.
     * @ignore
     * @type {boolean}
     */
    get : function ()
    {
      return this._visible;
    }
  },

  'enable': {

    /**
     * Activate or deactivate a view.
     * @name vs.ui.GLView#enable
     * @type {boolean}
     */
    set : function (v)
    {
      if (v && !this._enable)
      {
        this._enable = true;
        this._didEnable ();
      }
      else if (!v && this._enable)
      {
        this._enable = false;
        this._didEnable ();
      }
      
      GLView.__should_render = true;
    },

    /**
     * @ignore
     * @return {boolean}
     */
    get : function ()
    {
      return this._enable;
    }
  },

  'translation': {

    /**
     * Translation vector [tx, ty]
     * <=> obj.translate (tx, ty)
     * @name vs.ui.GLView#translation
     * @type {Array}
     */
    set : function (v)
    {
      this._translation[0] = v[0];
      this._translation[1] = v[1];
      this._translation[2] = v[2] || 0;

      this.__should_update_gl_matrix = true;
    },

    /**
     * @ignore
     * @type {Array}
     */
    get : function ()
    {
      //return [this.__view_t_x, this.__view_t_y];
      return this._translation;
    }
  },

  'rotation': {

    /**
     * Rotation angle in degre
     * @name vs.ui.GLView#rotation
     * @type {float}
     */
    set : function (v)
    {
      this._rotation[0] = v[0] || 0;
      this._rotation[1] = v[1] || 0;
      this._rotation[2] = v[2] || 0;

      this.__should_update_gl_matrix = true;
    },

    /**
     * @ignore
     * @type {float}
     */
    get : function ()
    {
      return this._rotation;
    }
  },

  'scaling': {

    /**
     * Scale the view
     * @name vs.ui.GLView#scaling
     * @type {float}
     */
    set : function (v)
    {
      this._scaling = v || 1;

      this.__should_update_gl_matrix = true;
    },

    /**
     * @ignore
     * @type {float}
     */
    get : function ()
    {
      return this._scaling;
    }
  },

  'opacity': {

    /**
     * Scale the view
     * @name vs.ui.GLView#scaling
     * @type {float}
     */
    set : function (v)
    {
      this._style.opacity = v
    },

    /**
     * @ignore
     * @type {float}
     */
    get : function ()
    {
      return this._style.opacity;
    }
  },

  'transformOrigin': {

    /**
     * This property allows you to specify the origin of the 2D transformations.
     * Values are pourcentage of the view size.
     * <p>
     * The property is set by default to [50, 50], which is the center of
     * the view.
     * @name vs.ui.GLView#transformOrigin
     * @type Array.<number>
     */
    set : function (v)
    {
      if ((!util.isArray (v) && !(v instanceof Float32Array)) || v.length !== 2) { return; }
      if (!util.isNumber (v[0]) || !util.isNumber (v[1])) { return; }

      this._transform_origin [0] = v [0];
      this._transform_origin [1] = v [1];
      
      GLView.__should_render = true;
    },

    /**
     * @ignore
     * @return {Array}
     */
    get : function ()
    {
      return this._transform_origin;
    }
  },
  
  'style': {

    /**
     * Rotation angle in degre
     * @name vs.ui.GLView#style
     * @type {GLStyle}
     */
    set : function (v)
    {
      if (!(v instanceof GLStyle)) return; 
      this._style = v;
      GLView.__should_render = true;
    },

    /**
     * @ignore
     * @type {GLStyle}
     */
    get : function ()
    {
      return this._style;
    }
  },

  'constraint': {

    /**
     * Rotation angle in degre
     * @name vs.ui.GLView#constraint
     * @type {GLStyle}
     */
    set : function (v)
    {
      if (!(v instanceof GLConstraint)) return; 
      
      if (this._constraint) {
        delete (this._constraint);
      }
      
      this._constraint = v;
      GLView.__should_render = true;
    },

    /**
     * @ignore
     * @type {GLStyle}
     */
    get : function ()
    {
      if (!this._constraint) {
        this._constraint = new GLConstraint ();
      }
      return this._constraint;
    }
  }
});

/********************************************************************
                      Export
*********************************************************************/
/** @private */
vs.ui.GLView = GLView;
/**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/**
 *  All application inherit from GLApplication class.<br/>
 *  This is the root component from which all other components (widgets, ...)
 *  are dependent on.
 *  @class
 *  All application inherit from GLApplication class. <br/>
 *  This is the root component from which all other components (widgets, ...)
 *  are dependent on.
 *  <p>
 *  The class offers you a set of usefull method for laoding
 *  Javascript or CSS, know the current GUI orientation...
 *  <p>
 *  You should not create your own GLApplication instante, because it is
 *  automatically generated by ViniSketch Designer.
 *
 *  @author David Thevenin
 *
 *  @extends vs.ui.GLView
 * @name vs.ui.GLApplication
 *  @constructor
 *  Main constructor
 *
 * @param {string} type the event type [optional]
*/
var GLApplication = function (config) {
  initWebGLRendering ();
  this._layout = undefined;
  
  this.parent = GLView;
  this.parent (config);
  this.constructor = GLApplication;
};

var ORIENTATION_CHANGE_EVT =
  'onorientationchange' in window ? 'orientationchange' : 'resize';

GLApplication.prototype = {
  
  /*****************************************************************
   *                Private members
   ****************************************************************/

  /**
   * @protected
   * @type {boolean}
   */
  _prevent_scroll : true,

  /*****************************************************************
   *
   ****************************************************************/
  /**
   * @protected
   * @function
   */
  initComponent : function ()
  {
    vs.Application_applications [this.id] = this;

    GLView.prototype.initComponent.call (this);
    this.preventScroll = true;

    var self = this;
    window.addEventListener (ORIENTATION_CHANGE_EVT, function (e) {
      var orientation = window.orientation;
      if (!util.isNumber (orientation)) {
        if (window.outerWidth >= window.outerHeight) {
          orientation = 90; // LANDSCAPE
        }
        else {
          orientation = 0; // PORTRAIT
        }
      }
      
      var target_id =
        window.deviceConfiguration.setOrientation (orientation);
      if (target_id) {
        self.propagate ('deviceChanged', target_id, null, true);
      }
    });
    
    this.size = [window.innerWidth, window.innerHeight];
  },
  
  /**
   * Exit and terminate the application.
   * @name vs.ui.GLApplication#exit 
   * @function
   */
  exit : function () {
    vs.ui.Application.exit ()
  },
  
  /**
   * @protected
   * @name vs.ui.GLApplication#applicationStarted 
   * @function
   */
  applicationStarted : function () { },
  
  /**
   * Sets the active stylesheet for the HTML document according to
   * the specified pid.
   *
   * @private
   *
   * @name vs.ui.GLApplication#setActiveStyleSheet 
   * @function
   * @param {string} title
   */
  setActiveStyleSheet : function (pid) {
    vs.ui.Application.setActiveStyleSheet (pid);
  },
  
  /**
   * @protected
   *
   * @name vs.ui.GLApplication#orientationWillChange 
   * @function
   * @param {number} orientation = {0, 180, -90, 90}
   */
  orientationWillChange: function (orientation) { },
    
  /**
   *  @public
   *  Build the default dataflow associated to the application.
   *  If you have created your own dataflow (with new vs.core.Dataflow), you
   *  have to build it explicitly.
   *
   * @name vs.ui.GLApplication#buildDataflow 
   * @function
   */
  buildDataflow: function () {
    vs._default_df_.build ();
  },
    
  /**
   *  Dynamically load a script into your application.
   *  <p/>
   *  When the download is completed, the event 'scriptloaded' is fired. <br/>
   *  If a error occurs, nothing happend, then you have to manage by
   *  your own possible error load.
   *  <p/>
   *  The callback function will receive as parameter a event like that:<br/>
   *  {type: 'scriptloaded', data: path}
   *  <p/>
   *  @example
   *  myApp.bind ('scriptloaded', ...);
   *  myApp.loadScript ("resources/other.css");
   *
   * @name vs.ui.GLApplication#loadScript 
   * @function
   * @param {string} path the script url [mandatory]
   */
  loadScript : function (path) {
    var self = this, endScriptLoad = function (path) {
      var i, l, data, ab_event;
      if (!path) { return; }
      
      self.propagate ('scriptloaded', path);
    };
    
    util.importFile (path, document, endScriptLoad, "js");
  },
  
  /**
   *  Dynamically load a CSS into your application.
   *
   *  When the download is completed, the event 'cssloaded' is fired <br/>
   *  If a error occurs, nothing happend, then you have to manage by
   *  your own possible error load.
   *  <p/>
   *  The callback function will receive as parameter a event like that:<br/>
   *  {type: 'cssloaded', data: path}
   *
   *  @example
   *  myApp.bind ('cssloaded', ...);
   *  myApp.loadCSS ("resources/other.css");
   *
   * @name vs.ui.GLApplication#loadCSS 
   * @function
   *
   * @param {string} path the css url [mandatory]
   */
  loadCSS : function (path) {
    var self = this, endCssLoad = function (path) {
      var i, l, data, ab_event;
      if (!path) { return; }
      
      self.propagate ('cssloaded', path);
    };

    util.importFile (path, document, endCssLoad, "css");
  }  
};
util.extendClass (GLApplication, GLView);

/********************************************************************
                  Define class properties
********************************************************************/

util.defineClassProperties (GLApplication, {
//   'size': {
//     /** 
//      * Getter|Setter for size.<br/>
//      * Gives access to the size of the GLApplication
//      * @name vs.ui.GLApplication#size 
//      *
//      * @type {Array.<number>}
//      */ 
//     set : function (v) {
//       if (!v) { return; }
//       if (!util.isArray (v) || v.length !== 2) { return; }
//       if (!util.isNumber (v[0]) || !util.isNumber(v[1])) { return; }
//       this._size [0] = v [0];
//       this._size [1] = v [1];
//       
//       this._updateSizeAndPos ();
//       
// //      window.resizeTo (this._size [0], this._size [1]);
//     },
//     
//     /**
//      * @ignore
//      * @type {Array.<number>}
//      */
//     get : function () {
//       return this._size.slice ();
//     }
//   },
  'preventScroll': {
    /** 
     * Getter|Setter for page scrolling cancel.<br/>
     * Set to true to cancel scrolling behavior and false to have the
     * normal behavior.<br/>
     * By default, the property is set to true.
     * 
     * @name vs.ui.GLApplication#preventScroll 
     *
     * @type {boolean}
     */ 
    set : function (pScroll)
    {
      if (pScroll)
      {
        this._prevent_scroll = true;
        document.preventScroll = pScroll;
      }
      else
      {
        this._prevent_scroll = false;
        document.preventScroll = pScroll;
      }
    },
  
    /**
     * @ignore
     * @type {boolean}
     */
    get : function ()
    {
      this._prevent_scroll = document.preventScroll;
      return this.__prevent_scroll;
    }
  }
});

/********************************************************************
                      Export
*********************************************************************/
/** @private */
ui.GLApplication = GLApplication;

/**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

function __create_multiline_text (ctx, text, maxWidth, lines) {

  var currentText = "";
  var futureText, futureFutureText;
  var subWidth = 0;
  var maxLineWidth = 0;
  
  var wordArray = text.split (" ");
  var wordsInCurrent, wordArrayLength;
  wordsInCurrent = wordArrayLength = wordArray.length;
  var index = 0, index_c, l_text;
  
  while (index < wordArrayLength) {
    var text = wordArray[index];
    if (currentText != "") {
      futureText = currentText + " " + text;
    }
    else {
      futureText = text;
    }
    if (ctx.measureText(futureText).width < maxWidth) {
      currentText = futureText;
      index ++;
    }
    else {
      if (ctx.measureText(text).width < maxWidth) {
        lines.push (currentText);
        currentText = text;
        index ++;
      } else {
        // Caesura management
        index_c = 0;
        l_text = text.length;
        futureText = currentText + " ";
        while (index_c < l_text) {
          futureFutureText = futureText + text [index_c];
          if (ctx.measureText(futureFutureText).width >= maxWidth) {
            lines.push (futureText);
            currentText = text.substr (index_c);
            index ++;
            break;
          }
          else {
            futureText = futureFutureText;
            index_c ++;
          }
        }
      }
    }
  }
  
  if (currentText) {
    if (ctx.measureText (currentText).width < maxWidth) {
      lines.push (currentText);
    }
    else {
      // Caesura management
      index_c = 0;
      l_text = currentText.length;
      futureText = "";
      while (index_c < l_text) {
        futureFutureText = futureText + currentText [index_c];
        if (ctx.measureText (futureFutureText).width >= maxWidth) {
          lines.push (futureText);
          futureText = currentText [index_c];
          index_c ++;
        }
        else {
          futureText = futureFutureText;
          index_c ++;
        }
      }
      if (futureText) {
        lines.push (futureText);
      }
    }
    currentText = "";
  }
  
  // Return the maximum line width
  return 0;//maxLineWidth;
}

function _create_multiline_text (ctx, text, maxWidth, lines) {

  var multilines = text.split ("\n"), maxLineWidth = 0;
  
  multilines.forEach (function (text) {
    maxLineWidth = Math.max (maxLineWidth,
      __create_multiline_text (ctx, text, maxWidth, lines));
  });
  
  return maxLineWidth;
}

function __render_text_into_canvas_ctx (text, ctx, width, height, style) {
  ctx.clearRect (0, 0, width, height);
  var
    color = style.color,
    lines = [],
    offsetY;
  
  if (!color) color = GLColor.white;
  
  var
    font = style.fontWeight + " " + 
      (style._font_size * gl_device_pixel_ratio) + "px " +
      style.fontFamily;
      
  // This determines the text colour, it can take a hex value or rgba value (e.g. rgba(255,0,0,0.5))
  ctx.fillStyle = color.getRgbaString ();
  ctx.strokeStyle = color.getRgbaString ();
  // This determines the size of the text and the font family used
  ctx.font = font;
  
  ctx.textAlign = style.textAlign;
  ctx.textBaseline = "middle";

  _create_multiline_text (ctx, text, width, lines);
  offsetY = height/2 - (lines.length - 1) * (style._font_size * gl_device_pixel_ratio) / 2;
  
  lines.forEach (function (line, i) {
    var dy = i * (style._font_size * gl_device_pixel_ratio) + offsetY;
    switch (style.textAlign) {
      case "left":
        ctx.fillText (line, 0, dy);
      break;

      case "right":
        var textWidth = ctx.measureText (line).width;
        ctx.fillText (line, width, dy);
      break;

      case "center":
        ctx.fillText (line, width/2 , dy);
      break;
    }
  });
  
  return lines.length * style._font_size;
}

function __copy_image_into_webgl_texture (canvas, texture) {

  if (!texture) {
    texture = gl_ctx.createTexture ();
  }
  
  gl_ctx.pixelStorei (gl_ctx.UNPACK_FLIP_Y_WEBGL, false);
  gl_ctx.pixelStorei (gl_ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);  
  gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, texture);

  gl_ctx.texImage2D (
    gl_ctx.TEXTURE_2D, 0,
    gl_ctx.RGBA, gl_ctx.RGBA,
    gl_ctx.UNSIGNED_BYTE, canvas
  );
  
  function isPowerOfTwo (x) {
    return (x !== 0) && ((x & (x - 1)) === 0);
  }

  // POT images
  if (isPowerOfTwo (canvas.width) && isPowerOfTwo (canvas.height)) {
    gl_ctx.texParameteri
      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MAG_FILTER, gl_ctx.LINEAR);
    
    gl_ctx.texParameteri
      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.NEAREST_MIPMAP_LINEAR);

    gl_ctx.generateMipmap (gl_ctx.TEXTURE_2D);
  }
  // NPOT images
  else {
    //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
    gl_ctx.texParameteri(gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.LINEAR);
    //Prevents s-coordinate wrapping (repeating).
    gl_ctx.texParameteri(gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_S, gl_ctx.CLAMP_TO_EDGE);
    //Prevents t-coordinate wrapping (repeating).
    gl_ctx.texParameteri(gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_T, gl_ctx.CLAMP_TO_EDGE);
  }
  gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, null);
  
  GLView.__should_render = true;
  
  return texture
}

var __text_management = {
  /**
   *
   * @protected
   * @type {CanvasRenderingContext2D|null}
   */
  __text_canvas_ctx: null,
  
  /**
   *
   * @protected
   * @type {HTMLCanvasElement|null}
   */
  __text_canvas_node: null,

  __init_text_view : function (size)
  {
    this.__text_canvas_node = create2DCanvas (size [0], size [1]);
    this.__text_canvas_ctx = this.__text_canvas_node.getContext ('2d');
  },

  __update_text_view : function (size)
  {
    this.__text_canvas_node.style.width = size [0] + "px";
    this.__text_canvas_node.style.height = size [1] + "px";
    this.__text_canvas_node.width = size [0] * gl_device_pixel_ratio;
    this.__text_canvas_node.height = size [1]* gl_device_pixel_ratio;
  },

  __update_text : function (text, autoresize)
  {
    if (!this.__text_canvas_node.width ||
        !this.__text_canvas_node.height) {
     
      var self = this;
      vs.requestAnimationFrame (function () {
        self.__update_text (text);
      });
      return;
    }
        
    var text_height = __render_text_into_canvas_ctx (
      text,
      this.__text_canvas_ctx,
      this._size [0] * gl_device_pixel_ratio,
      this._size [1] * gl_device_pixel_ratio,
      this._style
    );
    
    if (autoresize && text_height > this._size [1]) {
      this.size = [this._size [0], text_height];
    }
    else {
      this.__update_texture ();
    }
  },
  
  __update_texture : function () {
    this.__gl_texture =
      __copy_image_into_webgl_texture (this.__text_canvas_node, this.__gl_texture);
  }
}

/**
 * A ui.vs.GLText.
 *
 * @class
 * A ui.vs.GLText component displays a unselectable text.
 *
 @constructor
 * @extends vs.ui.GLView
 * @name vs.ui.GLText
 */
function GLText (config)
{
  this.parent = GLView;
  this.parent (config);
  this.constructor = GLText;
}

GLText.prototype = {
    
  /**
   * The text value
   * @protected
   * @type {string}
   */
  _text: "",

  /**
   * @protected
   * @function
   */
  initComponent : function ()
  {
    GLView.prototype.initComponent.call (this);
    
    this._style.backgroundColor = GLColor.transparent;

    var size = this.__config__.size;
    if (!size) {
      size = [20, 20];
      this.__config__.size = size;
    }
    
    this.__init_text_view (size);

    if (this._text != "") {
      this.__update_text (this._text, true);
    }
  },

  refresh: function () {
    GLView.prototype.refresh.call (this);
    // force redraw
    
    if (this._text != "") {
      this.__update_text_view (this._size);
      this.__update_text (this._text, true);
    }
  },

  redraw : function (clb)
  {
    GLView.prototype.redraw.call (this);
    
    this.__update_text (this._text, true);
    
    if (clb) clb ();
  }
};
util.extend (GLText.prototype, __text_management);
util.extendClass (GLText, GLView);

/********************************************************************
                  Define class properties
********************************************************************/

util.defineClassProperties (GLText, {
  "text": {

    /**
     * Set the text value
     * @name vs.ui.GLText#name
     * @param {string} v
     */
    set : function (v)
    {
      if (v === null || typeof (v) === "undefined") { v = ''; }
      else if (util.isNumber (v)) { v = '' + v; }
      else if (!util.isString (v))
      {
        if (!v.toString) { return; }
        v = v.toString ();
      }
    
      if (v == this._text) return;
     
      this._text = v;
      this.__update_text (this._text, true);
    },

    /**
     * get the text value
     * @ignore
     * @type {string}
     */
    get : function ()
    {
      return this._text;
    }
  },

  "size": {
   /** 
     * Getter|Setter for size. Gives access to the size of the vs.ui.GLCanvas
     * @name vs.ui.GLText#size 
     *
     * @type {Array.<number>}
     */ 
    set : function (v)
    {
      if (!v) { return; } 
      if (!util.isArray (v) || v.length !== 2) { return; }
      if (!util.isNumber (v[0]) || !util.isNumber(v[1])) { return; }

      this._size [0] = v [0];
      this._size [1] = v [1];
    
      this._updateSizeAndPos ();
      
      this.__update_text_view (this._size);
      if (this._text != "") {
        this.__update_text (this._text, true);
      }
    },

    /**
     * @ignore
     * @type {Array.<number>}
     */
    get : function ()
    {
      return this._size.slice ();
    }
  }
});


/********************************************************************
                      Export
*********************************************************************/
/** @private */
ui.GLText = GLText;
/*
  COPYRIGHT NOTICE
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/


/**
 *  The vs.ui.GLButton class
 *
 *  @extends vs.ui.GLView
 *  @class
 *  The GLButton class is a subclass of vs.ui.GLView that intercepts pointer-down
 *  events and sends an 'select' event to a target object when it’s clicked
 *  or pressed.
 *
 *  Events:
 *  <ul>
 *    <li /> select: Fired after the button is clicked or pressed.
 *  </ul>
 *  <p>
 *  @example
 *  // Simple example: (the button will have the platform skin)
 *  var config = {}
 *  var config.id = 'mybutton';
 *  var config.text = 'Hello';
 *
 *  var myButton = GLButton (config);
 *  myButton.init ();
 *
 *  @example
 *  // GLButton with our own style
 *  var config = {}
 *  var config.id = 'mybutton';
 *  var config.text = 'Hello';
 *
 *  var myButton = vs.ui.GLButton (config);
 *  myButton.init ();
 *
 * <p>
 *
 *  @author David Thevenin
 * @name vs.ui.GLButton
 *
 *  @constructor
 *   Creates a new vs.ui.GLButton.
 *
 * @param {Object} config the configuration structure [mandatory]
*/
function GLButton (config)
{
  this.parent = GLView;
  this.parent (config);
  this.constructor = GLButton;
}

GLButton.prototype = {
  
  /*****************************************************************
   *               private/protected members
   ****************************************************************/
   
  /**
   *
   * @private
   * @type {PointerRecognizer}
   */
  __tap_recognizer: null,

  /**
   *
   * @protected
   * @type {boolean}
   */
  _selected: false,

  /**
   *
   * @protected
   * @type {string}
   */
  _text: "",

  /**
   *
   * @protected
   * @type {string}
   */
  _released_image: "",

  /**
   *
   * @protected
   * @type {string}
   */
  _selected_image: "",

  /**
   *
   * @protected
   * @type {string}
   */
  _disabled_image: "",

  /*****************************************************************
   *               General methods
   ****************************************************************/
    
  /**
   * @protected
   * @function
   */
  didTouch : function () {
    this._selected = true;
  },
  
  /**
   * @protected
   * @function
   */
  didUntouch : function () {
    this._selected = false;
  },
  
  didTap : function () {
    this.propagate ('select');
  },
  
  /**
   * @protected
   * @function
   */
  destructor : function () {
    if (this.__tap_recognizer) {
      this.removePointerRecognizer (this.__tap_recognizer);
      this.__tap_recognizer = null;
    }
    GLView.prototype.destructor.call (this);
  },

  /**
   * @protected
   * @function
   */
  initComponent : function () {
    GLView.prototype.initComponent.call (this);
    
    if (!this.__tap_recognizer) {
      this.__tap_recognizer = new vs.ui.TapRecognizer (this);
      this.addPointerRecognizer (this.__tap_recognizer);
    }

    this.__init_text_view (this._size);

    if (this._text) {
      this.__update_text (this._text);
    }
  },

  refresh: function () {
    GLView.prototype.refresh.call (this);

    if (this._text) {
      this.__update_text_view (this._size);
      this.__update_text (this._text);
    }
  }
};
util.extend (GLButton.prototype, __text_management);
util.extendClass (GLButton, GLView);

/********************************************************************
                  Define class properties
********************************************************************/

util.defineClassProperties (GLButton, {
  'text': {
    /** 
     * Getter|Setter for text. Allow to get or change the text draw
     * by the button
     * @name vs.ui.GLButton#text 
     * @type String
     */ 
    set : function (v) {
      if (v === null || typeof (v) === "undefined") { v = ''; }
      else if (util.isNumber (v)) { v = '' + v; }
      else if (!util.isString (v)) {
        if (!v.toString) { return; }
        v = v.toString ();
      }
  
      if (v == this._text) return;
     
      this._text = v;
      this.__update_text (this._text);
    },
  
    /** 
     * @ignore
     * @return {string}
     */ 
    get : function () {
      return this._text;
    }
  },

  "size": {
   /** 
     * Getter|Setter for size. Gives access to the size of the vs.ui.GLCanvas
     * @name vs.ui.GLCanvas#size 
     *
     * @type {Array.<number>}
     */ 
    set : function (v)
    {
      if (!v) { return; } 
      if (!util.isArray (v) || v.length !== 2) { return; }
      if (!util.isNumber (v[0]) || !util.isNumber(v[1])) { return; }

      this._size [0] = v [0];
      this._size [1] = v [1];
    
      this._updateSizeAndPos ();

      this.__update_text_view (this._size);
      if (this._text != "") {
        this.__update_text (this._text);
      }
    },

    /**
     * @ignore
     * @type {Array.<number>}
     */
    get : function ()
    {
      return this._size.slice ();
    }
  }
});

/********************************************************************
                      Export
*********************************************************************/
/** @private */
ui.GLButton = GLButton;

var __gl_textures_ref = {};

function gl_get_texture_from_image_url (src, clb) {
  
  var handler = __gl_textures_ref [src];
  if (handler) {
    handler.ref_count ++;
    if (vs.util.isFunction (clb)) {
      if (handler.texture) {
        try {
          clb (handler.texture);
        }
        catch (exp) {
          if (exp.stack) console.log (exp.stack);
          console.log (exp);
        }
      }
      else {
        handler.clbs.push (clb)
      }
    }
    return;
  }
  
  handler = {};
  handler.texture = null;
  handler.ref_count = 1;
  handler.clbs = [];
  if (vs.util.isFunction (clb)) {
    handler.clbs.push (clb);
  }
  __gl_textures_ref [src] = handler;

  var image = new Image();
  image.src = src;

  image.onload = function (e) {
    var texture;
    
    var handler = __gl_textures_ref [src];
    if (!handler) {
      // image has been deleted before it's available
      return;
    }

    texture = __copy_image_into_webgl_texture (image, texture);
    
    handler.texture = texture;
    var clbs = handler.clbs; handler.clbs = [];
    clbs.forEach (function (clb) {
      try {
        clb (texture, [image.width, image.height]);
      }
      catch (exp) {
        if (exp.stack) console.log (exp.stack);
        console.log (exp);
      }
    })
  }
}

function gl_get_texture_from_image_url_not_optimize (src, clb) {
  
  var image = new Image();
  image.src = src;

  image.onload = function (e) {
    var texture;
    texture = __copy_image_into_webgl_texture (image, texture);
    
    try {
      clb (texture, [image.width, image.height]);
    }
    catch (exp) {
      if (exp.stack) console.log (exp.stack);
      console.log (exp);
    }
  }
}

function gl_free_texture_image (src) {
  
  var handler = __gl_textures_ref [src];
  if (!handler) return;
  
  handler.ref_count --;
  if (handler.ref_count > 0) return;
  
  if (handler.texture) {
    gl_ctx.deleteTexture (handler.texture);
  }
  delete (__gl_textures_ref [src]);
}


/**
 * A vs.ui.GLImage.
 * @constructor
 * @name vs.ui.GLImage
 * @extends vs.ui.GLView
 * An vs.ui.GLImage embeds an image in your application.
 */
function GLImage (config)
{
  this.parent = GLView;
  this.parent (config);
  this.constructor = GLImage;
}

GLImage.prototype = {

  /**
   * The image url
   * @private
   * @type {string}
   */
  _src: null,
  __gl_image_texture: null,
  
  /*****************************************************************
   *
   ****************************************************************/  
  /**
   * @protected
   * @function
   */
  destructor : function ()
  {
    /* TODO */
    GLView.prototype.destructor.call (this);
    
    gl_free_texture_image (this._src);
    this.__gl_image_texture = null;
  },

  /**
   * @protected
   * @function
   */
  initComponent : function ()
  {
    GLView.prototype.initComponent.call (this);
    
    this._style.backgroundColor = GLColor.transparent;
    
    /* TODO */
  }
};
util.extendClass (GLImage, GLView);

/********************************************************************
                  Define class properties
********************************************************************/

util.defineClassProperties (GLImage, {

  'src': {
    /**
     * Set the image url
     * @name vs.ui.GLImage#src 
     * @type {string}
     */
    set : function (v) {
      if (!util.isString (v)) { return; }
      

      if (this._src) {
        gl_free_texture_image (this._src);
        this.__gl_image_texture = null;
      }
      this._src = v;

      var self = this;
      gl_get_texture_from_image_url (
        self._src, function (texture, image_size) {
          self.__gl_image_texture = texture;
          if (self._size [0] === 0 && self._size [1] === 0) {
            self.size = image_size;
          }
        }
      )
    },
  
    /**
     * Get the image url
     * @ignore
     * @return {string}
     */
    get : function () {
      return this._src;
    }
  }
});
/********************************************************************
                      Export
*********************************************************************/
/** @private */
ui.GLImage = GLImage;
/**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
 
 Use code from Canto.js Copyright 2010 David Flanagan
*/

/**
 *  The vs.ui.GLCanvas class
 *
 *  @extends vs.ui.GLView
 *  @class
 *  The vs.ui.GLCanvas class is a subclass of vs.ui.GLView that allows you to easily draw
 *  arbitrary content within your HTML content.
 *  <p>
 *  When you instantiate the vs.ui.GLCanvas class you should reimpletement the draw method.
 *
 *  @author David Thevenin
 *
 *  @constructor
 *   Creates a new vs.ui.GLCanvas.
 * @name vs.ui.GLCanvas
 *
 *  @example
 *  var myCanvas = new vs.ui.GLCanvas (config);
 *  myCanvas.init ();
 *
 *  myCanvas.draw = function (x, y, width, height)
 *  {
 *    this.c_clearRect (x, y, width, height)
 *    this.c_fillStyle = "rgb(200,0,0)";
 *    this.c_fillStyle = "rgba(0, 0, 200, 0.5)";
 *
 *    ...
 *    
 *  };
 *
 *  // other way to use vs.ui.GLCanvas
 *  myCanvas.moveTo(100,100).lineTo(200,200,100,200).closePath().stroke();
 *
 * @param {Object} config The configuration structure [mandatory]
*/
function GLCanvas (config)
{
  this.parent = GLView;
  this.parent (config);
  this.constructor = GLCanvas;
}

GLCanvas.prototype = {

  /**
   *
   * @protected
   * @type {CanvasRenderingContext2D|null}
   */
  __canvas_ctx: null,
  
  /**
   *
   * @protected
   * @type {HTMLCanvasElement|null}
   */
  __canvas_node: null,
  
/*****************************************************************
 *
 ****************************************************************/
  
  /**
   * @protected
   * @function
   */
  initComponent : function ()
  {
    GLView.prototype.initComponent.call (this);
    
    this.__canvas_node = create2DCanvas (this._size [0], this._size [1]);
    this.__canvas_ctx = this.__canvas_node.getContext ('2d');
    
    this.draw (0, 0,
      this._size [0] * gl_device_pixel_ratio,
      this._size [1] * gl_device_pixel_ratio
    );
  },
  
  /**
   * @protected
   * @function
   * This function cost a lot!
   */
  _updateSizeAndPos : function ()
  {
    GLView.prototype._updateSizeAndPos.call (this);

    this.__canvas_node.style.width = this._size [0] + "px";
    this.__canvas_node.style.height = this._size [1] + "px";
    this.__canvas_node.width = this._size [0] * gl_device_pixel_ratio;
    this.__canvas_node.height = this._size [1] * gl_device_pixel_ratio;    
    this.draw (0, 0, this._size [0] * gl_device_pixel_ratio, this._size [1] * gl_device_pixel_ratio);
  },
  
  __update_texture : function () {
    this.__gl_texture =
      __copy_image_into_webgl_texture (this.__canvas_node, this.__gl_texture);
  },
  
  /**
   *
   * @name vs.ui.GLCanvas#getContext
   * @function
   * @return {CanvasRenderingContext2D} the canvas context
   */
  getContext: function ()
  {
    return this.__canvas_ctx;
  },
  
  /**
   * This method draws a rectangle.
   * <p/>
   * With 4 arguments, it works just like the 2D method. An optional
   * 5th argument specifies a radius for rounded corners. An optional
   * 6th argument specifies a clockwise rotation about (x,y).
   *
   * @name vs.ui.GLCanvas#drawRect
   * @function
   *
   * @param {number} x The x position
   * @param {number} y The y position
   * @param {number} w The rectangle width
   * @param {number} h The rectangle height
   * @param {number} radius The rectangle radius
   * @param {number} rotation The rectangle rotation
   */
  drawRect : function (x, y, w, h, radius, rotation)
  {
    if (arguments.length === 4)
    {
      // square corners, no rotation
      this.c_rect (x, y, w, h).stroke ();
    }
    else
    {
      if (!rotation)
      {
        // Rounded corners, no rotation
        this.c_polygon (x, y, x + w, y, x + w, y + h, x, y + h, radius);
      }
      else
      {
        // Rotation with or without rounded corners
        var sr = Math.sin (rotation), cr = Math.cos (rotation),
          points = [x,y], p = this.rotatePoint (w, 0, rotation);
          
        points.push (x + p [0], y + p [1]);
        p = this.rotatePoint (w, h, rotation);
        points.push (x + p [0], y + p [1]);
        p = this.rotatePoint (0, h, rotation);
        points.push (x + p [0], y + p [1]);
        if (radius) { points.push (radius); }
        
        this.c_polygon.apply (this, points);
      }
    }
    // The polygon() method handles setting the current point
    return this;
  },
  
  /**
   * @protected
   * @function
   */
  rotatePoint : function (x, y, angle)
  {
    return [x * Math.cos (angle) - y * Math.sin (angle),
            y * Math.cos (angle) + x * Math.sin (angle)];
  },

  /**
   * This method connects the specified points as a polygon.  It requires
   * at least 6 arguments (the coordinates of 3 points).  If an odd 
   * number of arguments are passed, the last one is taken as a corner
   * radius.
   *
   * @example
   *  var myCanvas = new vs.ui.GLCanvas (config);
   *  myCanvas.init ();
   *
   *  // draw a triangle
   *  myCanvas.c_polygon (100, 100, 50, 150, 300, 300);
   *
   * @name vs.ui.GLCanvas#c_polygon
   * @function
   * @param {...number} list of number
   */
  c_polygon : function ()
  {
    // Need at least 3 points for a polygon
    if (arguments.length < 6) { throw new Error("not enough arguments"); }

    var i, radius, n, x0, y0;
    
    this.c_beginPath ();

    if (arguments.length % 2 === 0)
    {
      this.c_moveTo (arguments [0], arguments [1]);
     
      for (i = 2; i < arguments.length; i += 2)
      {
        this.c_lineTo (arguments [i], arguments [i + 1]);
      }
    }
    else
    {
      // If the number of args is odd, then the last is corner radius
      radius = arguments [arguments.length - 1];
      n = (arguments.length - 1) / 2;

      // Begin at the midpoint of the first and last points
      x0 = (arguments [n * 2 - 2] + arguments [0]) /2;
      y0 = (arguments [n * 2 - 1] + arguments [1]) /2;
      this.c_moveTo (x0, y0);
      
      // Now arcTo each of the remaining points
      for (i = 0; i < n - 1; i++)
      {
        this.c_arcTo
          (arguments [i * 2], arguments [i * 2 + 1],
           arguments [i * 2 + 2], arguments [i * 2 + 3], radius);
      }
      // Final arcTo back to the start
      this.c_arcTo
        (arguments [n * 2 - 2], arguments [n * 2 - 1],
         arguments [0], arguments [1], radius);
    }

    this.c_closePath ();
    this.c_moveTo (arguments [0], arguments [1]);
    this.c_stroke ();
    return this;
  },

  /**
   * This method draws elliptical arcs as well as circular arcs.
   *
   * @name vs.ui.GLCanvas#c_ellipse
   * @function
   * @example
   *  var myCanvas = new GLCanvas (config);
   *  myCanvas.init ();
   *
   *  myCanvas.c_ellipse (100, 100, 50, 150, Math.PI/5, 0, Math.PI);
   *
   * @param {number} cx The X coordinate of the center of the ellipse
   * @param {number} cy The Y coordinate of the center of the ellipse
   * @param {number} rx The X radius of the ellipse
   * @param {number} ry The Y radius of the ellipse
   * @param {number} rotation The clockwise rotation about (cx,cy).
   *       The default is 0.
   * @param {number} sa The start angle; defaults to 0
   * @param {number} ea The end angle; defaults to 2pi
   * @param {boolean} anticlockwise The arc direction. The default
   *        is false, which means clockwise
   */
  c_ellipse : function (cx, cy, rx, ry, rotation, sa, ea, anticlockwise)
  {
    if (rotation === undefined) { rotation = 0;}
    if (sa === undefined) { sa = 0; }
    if (ea === undefined) { ea = 2 * Math.PI; }
      
    if (anticlockwise === undefined) { anticlockwise = false; }

    // compute the start and end points
    var sp =
      this.rotatePoint (rx * Math.cos (sa), ry * Math.sin (sa), rotation),
      sx = cx + sp[0], sy = cy + sp[1],
      ep = this.rotatePoint (rx * Math.cos (ea), ry * Math.sin (ea), rotation),
      ex = cx + ep[0], ey = cy + ep[1];
    
    this.c_moveTo (sx, sy);

    this.c_translate (cx, cy);
    this.c_rotate (rotation);
    this.c_scale (rx / ry, 1);
    this.c_arc (0, 0, ry, sa, ea, anticlockwise);
    this.c_scale (ry / rx, 1);
    this.c_rotate (-rotation);
    this.c_translate (-cx, -cy);
    
    this.c_stroke ();
    
    return this;
  },
  
  /**
   * vs.ui.GLCanvas draw method.
   * Should be reimplement when you instanciate a vs.ui.GLCanvas object.
   *
   * @name vs.ui.GLCanvas#draw
   * @function
   *
   * @param {number} x The top position of the canvas; Default = 0
   * @param {number} y The left position of the canvas; Default = 0
   * @param {number} width The width of the canvas; Default = canvas's width
   * @param {number} height The height of the canvas; Default = canvas's height
   */
  draw : function (x, y, width, height)
  {
    if (!x) { x = 0; }
    if (!y) { y = 0; }
    if (!width) { width = this._size [0] * gl_device_pixel_ratio; }
    if (!height) { height = this._size [1] * gl_device_pixel_ratio; }
    
    var p_ratio = gl_device_pixel_ratio;
    
    this.c_clearRect (x, y, width, height);
      
    this.c_lineWidth = 3;
    this.c_shadowColor = 'white';
    this.c_shadowBlur = 1;
    
    var i, x1, y1, x2, y2;
    
    for (i = 0; i < 10; i++)
    {
      this.c_strokeStyle = 'rgb(' + 
        Math.floor (Math.random () * 255) + ',' + 
        Math.floor (Math.random () * 255) + ',' + 
        Math.floor (Math.random () * 255) +')';
      
      x1 = Math.floor (Math.random() * width);
      y1 = Math.floor (Math.random() * height);
  
      x2 = Math.floor (Math.random() * width);
      y2 = Math.floor (Math.random() * height);
  
      this.c_beginPath ();
      this.c_moveTo (x1 * p_ratio, y1 * p_ratio);
      this.c_lineTo (x2 * p_ratio, y2 * p_ratio);
      this.c_closePath ();
      this.c_stroke ();
    }
    
    this.__update_texture ();
  }
};
util.extendClass (GLCanvas, GLView);

/**
 * @private
 */
GLCanvas.methods =   
  ['arc','arcTo','beginPath','bezierCurveTo','clearRect','clip',  
  'closePath','createImageData','createLinearGradient','createRadialGradient',  
  'createPattern','drawFocusRing','drawImage','fill', 'fillRect','fillText',  
  'getImageData','isPointInPath','lineTo','measureText','moveTo','putImageData',  
  'quadraticCurveTo','rect','restore','rotate','save','scale','setTransform',  
  'stroke','strokeRect','strokeText','transform','translate'];
  
/**
 * @private
 */
GLCanvas.props =
  ['canvas','fillStyle','font','globalAlpha','globalCompositeOperation',  
  'lineCap','lineJoin','lineWidth','miterLimit','shadowOffsetX','shadowOffsetY',  
  'shadowBlur','shadowColor','strokeStyle','textAlign','textBaseline'];

/**
 * @private
 */
GLCanvas.setup = function ()
{
  var i, m, p;
  for (i = 0; i < GLCanvas.methods.length; i++)
  {
    m = GLCanvas.methods [i];  
    GLCanvas.prototype ["c_" + m] = (function (m)
    {
      return function ()
      { // 9 args is most in API  
        this.__canvas_ctx [m].apply (this.__canvas_ctx, arguments);  
        return this;  
      };
    }(m));  
  } 

  for (i = 0; i < GLCanvas.props.length; i++)
  {  
    p = GLCanvas.props [i];
    
    var d = {};
    
    d.enumerable = true; 
    d.set = (function (p)
    {
      return function (value)
      {
        this.__canvas_ctx [p] = value;
      };
    }(p));
    
    d.get = (function (p)
    {
      return function ()
      {
        return this.__canvas_ctx [p];
      };
    }(p));

    util.defineProperty (GLCanvas.prototype, "c_" + p, d);
  }  
};

GLCanvas.setup ();

/********************************************************************
                      Export
*********************************************************************/
/** @private */
ui.GLCanvas = GLCanvas;

/********************************************************************
                   Documentation
********************************************************************/

/**
 * Adds points to the subpath such that the arc described by the circumference 
 * of the circle described by the arguments, starting at the given start angle 
 * and ending at the given end angle, going in the given direction (defaulting * 
 * to clockwise), is added to the path, connected to the previous point by a 
 * straight line.
 * @name vs.ui.GLCanvas#c_arc
 * @function
 */

/**
 * Adds an arc with the given control points and radius to the current subpath, 
 * connected to the previous point by a straight line.
 * @name vs.ui.GLCanvas#c_arcTo
 * @function
 */

/**
 * Resets the current path.
 * @name vs.ui.GLCanvas#c_beginPath
 * @function
 */

/**
 * Adds the given point to the current subpath, connected to the previous one by 
 * a cubic Bézier curve with the given control points.
 * @name vs.ui.GLCanvas#c_bezierCurveTo
 * @function
 */

/**
 * Clears all pixels on the canvas in the given rectangle to transparent black.
 * @name vs.ui.GLCanvas#c_clearRect
 * @function
 */

/**
 * Further constrains the clipping region to the given path.
 * @name vs.ui.GLCanvas#c_clip
 * @function
 */

/**
 * Marks the current subpath as closed, and starts a new subpath with a point 
 * the same as the start and end of the newly closed subpath.
 * @name vs.ui.GLCanvas#c_closePath
 * @function
 */

/**
 * Returns an ImageData object with the given dimensions in CSS pixels (which 
 * might map to a different number of actual device pixels exposed by the object 
 * itself). All the pixels in the returned object are transparent black.
 * @name vs.ui.GLCanvas#c_createImageData
 * @function
 */

/**
 * Returns a CanvasGradient object that represents a linear gradient that paints 
 * along the line given by the coordinates represented by the arguments.
 * If any of the arguments are not finite numbers, throws a NotSupportedError 
 * exception.
 * @name vs.ui.GLCanvas#c_createLinearGradient
 * @function
 */

/**
 * Returns a CanvasGradient object that represents a radial gradient that paints 
 * along the cone given by the circles represented by the arguments.
 * If any of the arguments are not finite numbers, throws a NotSupportedError 
 * exception. If either of the radii are negative, throws an IndexSizeError 
 * exception.
 * @name vs.ui.GLCanvas#c_createRadialGradient
 * @function
 */

/**
 * Returns a CanvasPattern object that uses the given image and repeats in the 
 * direction(s) given by the repetition argument.
 * @name vs.ui.GLCanvas#c_createPattern
 * @function
 */

/**
 * @name vs.ui.GLCanvas#c_drawFocusRing
 * @function
 */

/**
 * Draws the given image onto the canvas.
 * @name vs.ui.GLCanvas#c_drawImage
 * @function
 */

/**
 * @name vs.ui.GLCanvas#c_fill
 * @function
 */

/**
 * Paints the given rectangle onto the canvas, using the current fill style.
 * @name vs.ui.GLCanvas#c_fillRect
 * @function
 */

/**
 * Fills the given text at the given position. If a maximum width is provided, 
 * the text will be scaled to fit that width if necessary.
 * @name vs.ui.GLCanvas#c_fillText
 * @function
 */

/**
 * Returns an ImageData object containing the image data for the given rectangle 
 * of the canvas.
 * @name vs.ui.GLCanvas#c_getImageData
 * @function
 */

/**
 * Returns true if the given point is in the current path.
 * @name vs.ui.GLCanvas#c_isPointInPath
 * @function
 */

/**
 * Adds the given point to the current subpath, connected to the previous one by 
 * a straight line.
 * @name vs.ui.GLCanvas#c_lineTo
 * @function
 */

/**
 * Returns a TextMetrics object with the metrics of the given text in the 
 * current font.
 * @name vs.ui.GLCanvas#c_measureText
 * @function
 */

/**
 * Creates a new subpath with the given point.
 * @name vs.ui.GLCanvas#c_moveTo
 * @function
 */

/**
 * Paints the data from the given ImageData object onto the canvas. If a dirty 
 * rectangle is provided, only the pixels from that rectangle are painted.
 * @name vs.ui.GLCanvas#c_putImageData
 * @function
 */

/**
 * Adds the given point to the current subpath, connected to the previous one by 
 * a quadratic Bézier curve with the given control point.
 * @name vs.ui.GLCanvas#c_quadraticCurveTo
 * @function
 */

/**
 * Adds a new closed subpath to the path, representing the given rectangle.
 * @name vs.ui.GLCanvas#c_rect
 * @function
 */

/**
 * Pops the top state on the stack, restoring the context to that state.
 * @name vs.ui.GLCanvas#c_restore
 * @function
 */

/**
 * Changes the transformation matrix to apply a rotation transformation with the 
 * given characteristics. The angle is in radians.
 * @name vs.ui.GLCanvas#c_rotate
 * @function
 */

/**
 * Pushes the current state onto the stack.
 * @name vs.ui.GLCanvas#c_save
 * @function
 */

/**
 * Changes the transformation matrix to apply a scaling transformation with the 
 * given characteristics.
 * @name vs.ui.GLCanvas#c_scale
 * @function
 */

/**
 * Changes the transformation matrix to the matrix given by the arguments as 
 * described below.
 * @name vs.ui.GLCanvas#c_setTransform
 * @function
 */

/**
 * Strokes the subpaths with the current stroke style.
 * @name vs.ui.GLCanvas#c_stroke
 * @function
 */

/**
 * Paints the box that outlines the given rectangle onto the canvas, using the 
 * current stroke style.
 * @name vs.ui.GLCanvas#c_strokeRect
 * @function
 */

/**
 * Strokes the given text at the given position. If a maximum width is provided, 
 * the text will be scaled to fit that width if necessary.
 * @name vs.ui.GLCanvas#c_strokeText
 * @function
 */

/**
 * Changes the transformation matrix to apply the matrix given by the arguments 
 * as described below.
 * @name vs.ui.GLCanvas#c_transform
 * @function
 */

/**
 * Changes the transformation matrix to apply a translation transformation with 
 * the given characteristics.
 * @name vs.ui.GLCanvas#c_translate
 * @function
 */

/**
 * Returns the canvas element.
 * @name vs.ui.GLCanvas#c_canvas
 */

/**
 * Can be set, to change the fill style.
 * <br />
 * Returns the current style used for filling shapes.
 * @name vs.ui.GLCanvas#c_fillStyle
 */

/**
 * Can be set, to change the font. The syntax is the same as for the CSS 'font' 
 * property; values that cannot be parsed as CSS font values are ignored.
 * <br />
 * Returns the current font settings
 * @name vs.ui.GLCanvas#c_font
 */

/**
 * Can be set, to change the alpha value. Values outside of the range 0.0 .. 1.0 
 * are ignored.
 * <br />
 * Returns the current alpha value applied to rendering operations.
 * @name vs.ui.GLCanvas#c_globalAlpha
 */

/**
 * Can be set, to change the composition operation. Unknown values are ignored.
 * <br />
 * Returns the current composition operation, from the list below.
 * @name vs.ui.GLCanvas#c_globalCompositeOperation
 */

/**
 * Can be set, to change the line cap style.
 * <br />
 * Returns the current line cap style.
 * @name vs.ui.GLCanvas#c_lineCap
 */

/**
 * Can be set, to change the line join style.
 * <br />
 * Returns the current line join style.
 * @name vs.ui.GLCanvas#c_lineJoin
 */

/**
 * Can be set, to change the miter limit ratio. Values that are not finite 
 * values greater than zero are ignored.
 * <br />
 * Returns the current miter limit ratio.
 * @name vs.ui.GLCanvas#c_miterLimit
 */

/**
 * Can be set, to change the line width. Values that are not finite values 
 * greater than zero are ignored.
 * Returns the current line width.
 * @name vs.ui.GLCanvas#c_lineWidth
 */

/**
 * Can be set, to change the shadow offset. Values that are not finite numbers 
 * are ignored.
 * <br />
 * Returns the current shadow offset.
 * @name vs.ui.GLCanvas#c_shadowOffsetX
 */

/**
 * Can be set, to change the shadow offset. Values that are not finite numbers 
 * are ignored.
 * <br />
 * Returns the current shadow offset.
 * @name vs.ui.GLCanvas#c_shadowOffsetY
 */

/**
 * Can be set, to change the blur level. Values that are not finite numbers 
 * greater than or equal to zero are ignored.
 * <br />
 * Returns the current level of blur applied to shadows.
 * @name vs.ui.GLCanvas#c_shadowBlur
 */

/**
 * Can be set, to change the shadow color. Values that cannot be parsed as CSS 
 * colors are ignored.
 * <br />
 * Returns the current shadow color.
 * @name vs.ui.GLCanvas#c_shadowColor
 */

/**
 * Can be set, to change the stroke style.
 * <br />
 * Returns the current style used for stroking shapes.
 * @name vs.ui.GLCanvas#c_strokeStyle
 */

/**
 * Can be set, to change the alignment. The possible values are start, end, 
 * left, right, and center. Other values are ignored. The default is start.
 * Returns the current text alignment settings.
 * @name vs.ui.GLCanvas#c_textAlign
 */

/**
 * Can be set, to change the baseline alignment. The possible values and their 
 * meanings are given below. Other values are ignored. The default is 
 * alphabetic.
 * <br />
 * Returns the current baseline alignment settings.
 * @name vs.ui.GLCanvas#c_textBaseline
 */
 /**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/**
 *  The vs.ui.GLScrollView class
 *
 *  @extends vs.ui.GLView
 *  @class
 *  vs.ui.GLScrollView defines the basic drawing, event-handling, of an application.
 *  The main different between vs.ui.GLScrollView and vs.ui.GLView classes is vs.ui.GLScrollView
 *  manages gesture events and scroll.
 *  <p>
 *  To allow pinch and scroll behavior, you need to set pinch and/or scroll
 *  properties. You can activate separately rotation, scale and scroll.
 *
 *  <p>
 * Delegates:
 *  <ul>
 *    <li/>viewWillStartZooming : function (vs.ui.GLScrollView the view)
 *    <li/>viewDidEndZooming : function (vs.ui.GLScrollView the view, number scale)
 *  </ul>
 *  <p>
 *  @example
 *  var myView = new vs.ui.GLScrollView (config);
 *  myView.minScale = 1;
 *  myView.maxScale = 2;
 *  myView.pinch = vs.ui.GLScrollView.SCALE; // activate pinch zoom
 *  myView.scroll = true; //
 *  
 *  @author David Thevenin
 * @name vs.ui.GLScrollView
 *
 *  @constructor
 *   Creates a new vs.ui.GLScrollView.
 *
 * @param {Object} config the configuration structure [mandatory]
 */
function GLScrollView (config)
{
  this.parent = GLView;
  this.parent (config);
  this.constructor = GLScrollView;
  
  this.__gl_scroll = vec3.create ();
}

/********************************************************************
                    _scrolling constant
*********************************************************************/


GLScrollView.prototype = {

 /**********************************************************************
 
 *********************************************************************/
   /**
   * @protected
   * @type {boolean}
   */
  _scroll: false,
      
   /**
   * @protected
   * @type {boolean}
   */
  _pinch: vs.ui.ScrollView.NO_PINCH,
  
  __gl_scroll : null,
  
  /*****************************************************************
   *
   ****************************************************************/
   
  /**
   * @protected
   * @function
   */
  refresh : function ()
  {
    GLView.prototype.refresh.call (this);
    if (this.__scroll__) {
      this.__scroll__.refresh ();
    }
  },
    
  /**
   * @protected
   * @function
   */
  destructor : function ()
  {
    this._remove_scroll ();
    this._scroll = false;
    
    GLView.prototype.destructor.call (this);
  },
  
  /**
   * @protected
   * @function
   */
  initComponent : function ()
  {
    GLView.prototype.initComponent.call (this);
    
    this.pinch = this._pinch;
    this.scroll = this._scroll;
    this.layout = this._layout;
   
    this.refresh ();
  },
  
  handleEvent : function (e) {
    if (this.__scroll__) {
      this.__scroll__.handleEvent (e);
      return false;
    }
    return true;
  },

  /**
   * @protected
   * @function
   */
  _updateSize: function ()
  {
    GLView.prototype._updateSize.call (this);
    this.refresh ();
  },
  
  _setup_scroll : function () {
    this._remove_scroll ();
    
    var config = {};
    config.scrollY = false;
    config.scrollX = false;
    
    if (this._scroll === vs.ui.ScrollView.VERTICAL_SCROLL) {
      config.scrollY = true;
    }
    else if (this._scroll === vs.ui.ScrollView.HORIZONTAL_SCROLL) {
      config.scrollX = true;
    }
    else if (this._scroll === vs.ui.ScrollView.SCROLL) {
      config.scrollX = true;
      config.scrollY = true;
    }
  
    this.__scroll__ = new GLScrollView.__iscroll (this, config);
    this.refresh ();
  },
  
  __gl_update_scroll : function (now) {
    if (this.__scroll__) {
      this.__scroll__.__gl_update_scroll (now);
    }
  },
  
  _remove_scroll : function () {
    if (this.__scroll__)
    {
      this.__scroll__.destroy ();
      delete (this.__scroll__);
      this.__scroll__ = undefined;
    }
  }
};
util.extendClass (GLScrollView, GLView);

/********************************************************************
                  Define class properties
********************************************************************/

util.defineClassProperties (GLScrollView, {
'scroll': {
  /** 
   * Allow to scroll the view.
   * By default it not allowed
   * @name vs.ui.GLScrollView#scroll 
   * @type {boolean|number}
   */ 
  set : function (v)
  {
    if (v === this._scroll) return;
    if (!v) {
      this._scroll = false;
      this._remove_scroll ();
    }
    else if (v === true || v === 1 || v === 2 || v === 3) {
      this._scroll = v;
      this._setup_scroll ();
    }
  },
  
  /** 
   * @ignore
   * @type {boolean}
   */ 
  get : function () {
    return this._scroll;
  }
},
'pinch': {  
  /** 
   * Configures the view pinch.
   * By default it not allowed (vs.ui.vs.ui.ScrollView.NO_PINCH)
   * @name vs.ui.vs.ui.ScrollView#pinch 
   * @type {number}
   * @see vs.ui.vs.ui.ScrollView.NO_PINCH
   * @see vs.ui.vs.ui.ScrollView.SCALE
   * @see vs.ui.vs.ui.ScrollView.ROTATION
   * @see vs.ui.vs.ui.ScrollView.ROTATION_AND_SCALE
   */ 
  set : function (v)
  {
    if (v !== vs.ui.ScrollView.NO_PINCH && v !== vs.ui.ScrollView.ROTATION  &&
        v !== vs.ui.ScrollView.SCALE  && v !== vs.ui.ScrollView.ROTATION_AND_SCALE)
    { return; }
    
    if (!this.view) { return; }
    this._pinch = v;
  }
}
});

/********************************************************************
                      Export
*********************************************************************/
/** @private */
ui.GLScrollView = GLScrollView;

/*! iScroll v5.1.1 ~ (c) 2008-2014 Matteo Spinelli ~ http://cubiq.org/license */
(function (window, Math) {

var quadratic = function (k) {
  return k * ( 2 - k );
};

var circular = function (k) {
  return Math.sqrt( 1 - ( --k * k ) );
};

var back = function (k) {
  var b = 4;
  return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
};

var bounce = function (k) {
  if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
    return 7.5625 * k * k;
  } else if ( k < ( 2 / 2.75 ) ) {
    return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
  } else if ( k < ( 2.5 / 2.75 ) ) {
    return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
  } else {
    return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
  }
};

var elastic = function (k) {
  var f = 0.22,
    e = 0.4;

  if ( k === 0 ) { return 0; }
  if ( k == 1 ) { return 1; }

  return ( e * Math.pow( 2, - 10 * k ) * Math.sin( ( k - f / 4 ) * ( 2 * Math.PI ) / f ) + 1 );
};

var momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
  var distance = current - start,
    speed = Math.abs(distance) / time,
    destination,
    duration;

  deceleration = deceleration === undefined ? 0.0006 : deceleration;

  destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
  duration = speed / deceleration;

  if ( destination < lowerMargin ) {
    destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
    distance = Math.abs(destination - current);
    duration = distance / speed;
  } else if ( destination > 0 ) {
    destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
    distance = Math.abs(current) + destination;
    duration = distance / speed;
  }

  return {
    destination: Math.round(destination),
    duration: duration
  };
};

function __iscroll (el, options) {
  this.wrapper = el;

  this.options = {

// INSERT POINT: OPTIONS 

    startX: 0,
    startY: 0,
    scrollY: true,
    directionLockThreshold: 5,
    momentum: true,

    bounce: true,
    bounceTime: 600,
    preventDefault: true,
  };

  for ( var i in options ) {
    this.options [i] = options[i];
  }

  // Normalize options
  this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
  this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

  // If you want eventPassthrough I have to lock one of the axes
  this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
  this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

  // With eventPassthrough we also need lockDirection mechanism
  this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
  this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

  this.options.bounceEasing = circular;

  // Some defaults  
  this.pos = this.wrapper.__gl_scroll;
  this.directionX = 0;
  this.directionY = 0;
  this._events = {};

  this.wrapper.addEventListener (vs.POINTER_START, this);
  this.refresh ();

  this.enable ();
}

__iscroll.prototype = {
  version: '5.1.1',

  destroy: function () {
    this.wrapper.removeEventListener (vs.POINTER_START, this);
  },

  _start: function (e) {
    // React to left mouse button only
//     if ( e.button !== 0 ) {
//       return;
//     }

    if ( !this.enabled ) {
      return;
    }

    var point = e.targetPointerList ? e.targetPointerList[0] : e,
      pos;

    this.moved    = false;
    this.distX    = 0;
    this.distY    = 0;
    this.directionX = 0;
    this.directionY = 0;
    this.directionLocked = 0;

    this.startTime = performance.now ();

    if ( this.isInTransition ) {
      this.isInTransition = false;
      if (this.isAnimating) {
        GLView.__nb_animation --;
        this.isAnimating = false;
        this.wrapper.__is_scrolling = false;
      }
      this._translate (Math.round(this.pos [0]), Math.round(this.pos [1]));
      this._execEvent ('scrollEnd');
    } else if ( this.isAnimating ) {
      this.isAnimating = false;
      GLView.__nb_animation --;
      this.wrapper.__is_scrolling = false;
      this._execEvent('scrollEnd');
    }

    this.startX    = this.pos [0];
    this.startY    = this.pos [1];
    this.absStartX = this.pos [0];
    this.absStartY = this.pos [1];
    this.pointX    = point.pageX;
    this.pointY    = point.pageY;

    this._execEvent ('beforeScrollStart');
    
    vs.addPointerListener (document, vs.POINTER_MOVE, this);
    vs.addPointerListener (document, vs.POINTER_CANCEL, this);
    vs.addPointerListener (document, vs.POINTER_END, this);

    this._tap = true;
  },

  _move: function (e) {
    if ( !this.enabled ) {
      return;
    }

    if ( this.options.preventDefault ) {  // increases performance on Android? TODO: check!
      e.preventDefault();
    }

    var point   = e.targetPointerList ? e.targetPointerList[0] : e,
      deltaX    = point.pageX - this.pointX,
      deltaY    = point.pageY - this.pointY,
      timestamp = performance.now (),
      newX, newY,
      absDistX, absDistY;

    this.pointX   = point.pageX;
    this.pointY   = point.pageY;

    this.distX    += deltaX;
    this.distY    += deltaY;
    absDistX    = Math.abs(this.distX);
    absDistY    = Math.abs(this.distY);
    
    if ( this._tap && (Math.abs (this.distX) > 5 || Math.abs (this.distY) > 5)) {
      this._tap = false;
    }

    // We need to move at least 10 pixels for the scrolling to initiate
    if ( timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10) ) {
      return;
    }

    // If you are scrolling in one direction lock the other
    if ( !this.directionLocked && !this.options.freeScroll ) {
      if ( absDistX > absDistY + this.options.directionLockThreshold ) {
        this.directionLocked = 'h';   // lock horizontally
      } else if ( absDistY >= absDistX + this.options.directionLockThreshold ) {
        this.directionLocked = 'v';   // lock vertically
      } else {
        this.directionLocked = 'n';   // no lock
      }
    }

    if ( this.directionLocked == 'h' ) {
      if ( this.options.eventPassthrough == 'vertical' ) {
        e.preventDefault();
      } else if ( this.options.eventPassthrough == 'horizontal' ) {
        return;
      }

      deltaY = 0;
    } else if ( this.directionLocked == 'v' ) {
      if ( this.options.eventPassthrough == 'horizontal' ) {
        e.preventDefault();
      } else if ( this.options.eventPassthrough == 'vertical' ) {
        return;
      }

      deltaX = 0;
    }

    deltaX = this.hasHorizontalScroll ? deltaX : 0;
    deltaY = this.hasVerticalScroll ? deltaY : 0;

    newX = this.pos [0] + deltaX;
    newY = this.pos [1] + deltaY;

    // Slow down if outside of the boundaries
    if ( newX > 0 || newX < this.maxScrollX ) {
      newX = this.options.bounce ? this.pos [0] + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
    }
    if ( newY > 0 || newY < this.maxScrollY ) {
      newY = this.options.bounce ? this.pos [1] + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
    }

    this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
    this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

    if ( !this.moved ) {
      this._execEvent('scrollStart');
    }

    this.moved = true;

    this._translate (newX, newY);

    if ( timestamp - this.startTime > 300 ) {
      this.startTime = timestamp;
      this.startX = this.pos [0];
      this.startY = this.pos [1];
    }
  },

  _end: function (e) {
    if ( !this.enabled ) {
      return;
    }

    vs.removePointerListener (document, vs.POINTER_MOVE, this);
    vs.removePointerListener (document, vs.POINTER_CANCEL, this);
    vs.removePointerListener (document, vs.POINTER_END, this);

    var point = e.changedTouches ? e.changedTouches[0] : e,
      momentumX,
      momentumY,
      duration = performance.now () - this.startTime,
      newX = Math.round(this.pos [0]),
      newY = Math.round(this.pos [1]),
      distanceX = Math.abs(newX - this.startX),
      distanceY = Math.abs(newY - this.startY),
      time = 0,
      easing = '';

    this.isInTransition = 0;
    this.endTime = performance.now ();
    
    if (this._tap && this.wrapper.didTap) {
//      this.wrapper.didTap (1, null, point.src, point);
    }

    // reset if we are outside of the boundaries
    if ( this.resetPosition(this.options.bounceTime) ) {
      return;
    }

    this.scrollTo (newX, newY); // ensures that the last position is rounded

    // we scrolled less than 10 pixels
    if ( !this.moved ) {
      this._execEvent('scrollCancel');
      return;
    }

    if ( this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100 ) {
      this._execEvent('flick');
      return;
    }

    // start momentum animation if needed
    if ( this.options.momentum && duration < 300 ) {
      momentumX = this.hasHorizontalScroll ? momentum (this.pos [0], this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
      momentumY = this.hasVerticalScroll ? momentum (this.pos [1], this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
      newX = momentumX.destination;
      newY = momentumY.destination;
      time = Math.max(momentumX.duration, momentumY.duration);
      this.isInTransition = 1;
    }

    if ( newX != this.pos [0] || newY != this.pos [1] ) {
      // change easing function when scroller goes out of the boundaries
      if ( newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY ) {
        easing = quadratic;
      }

      this.scrollTo (newX, newY, time, easing);
      return;
    }

    this._execEvent('scrollEnd');
  },

  resetPosition: function (time) {
    var x = this.pos [0],
      y = this.pos [1];

    time = time || 0;

    if ( !this.hasHorizontalScroll || this.pos [0] > 0 ) {
      x = 0;
    } else if ( this.pos [0] < this.maxScrollX ) {
      x = this.maxScrollX;
    }

    if ( !this.hasVerticalScroll || this.pos [1] > 0 ) {
      y = 0;
    } else if ( this.pos [1] < this.maxScrollY ) {
      y = this.maxScrollY;
    }

    if ( x == this.pos [0] && y == this.pos [1] ) {
      return false;
    }

    this.scrollTo (x, y, time, this.options.bounceEasing);

    return true;
  },

  disable: function () {
    this.enabled = false;
  },

  enable: function () {
    this.enabled = true;
  },

  refresh: function () {

    var self = this;
    function buildViewPort () {

      self.scrollerWidth = 0;
      self.scrollerHeight = 0;

      var children = self.wrapper.__children;
      if (!children) return;
      var maxX = 0, maxY = 0, i = 0, l = children.length, view, pos, size;
      for (; i < l; i++) {
        view = children[i];
        pos = view._position;
        size = view._size;
        
        if (pos [0] + size [0] > maxX) {
          maxX = pos [0] + size [0];
        }
        if (pos [1] + size [1] > maxY) {
          maxY = pos [1] + size [1];
        }
      }
      
      self.scrollerWidth = maxX;
      self.scrollerHeight = maxY;
    }

    this.wrapperWidth = this.wrapper._size [0];
    this.wrapperHeight  = this.wrapper._size [1];

    buildViewPort ();

    this.maxScrollX   = this.wrapperWidth - this.scrollerWidth;
    this.maxScrollY   = this.wrapperHeight - this.scrollerHeight;

    this.hasHorizontalScroll  = this.options.scrollX && this.maxScrollX < 0;
    this.hasVerticalScroll    = this.options.scrollY && this.maxScrollY < 0;

    if ( !this.hasHorizontalScroll ) {
      this.maxScrollX = 0;
      this.scrollerWidth = this.wrapperWidth;
    }

    if ( !this.hasVerticalScroll ) {
      this.maxScrollY = 0;
      this.scrollerHeight = this.wrapperHeight;
    }

    this.endTime = 0;
    this.directionX = 0;
    this.directionY = 0;

    this._execEvent ('refresh');

    this.resetPosition();
  },

  _execEvent: function (type) {
    if ( !this._events[type] ) {
      return;
    }

    var i = 0,
      l = this._events[type].length;

    if ( !l ) {
      return;
    }

    for ( ; i < l; i++ ) {
      this._events[type][i].apply(this, [].slice.call(arguments, 1));
    }
  },

  scrollBy: function (x, y, time, easing) {
    x = this.pos [0] + x;
    y = this.pos [1] + y;
    time = time || 0;

    this.scrollTo (x, y, time, easing);
  },

  scrollTo: function (x, y, time, easing) {
    easing = easing || circular;

    this.isInTransition = time > 0;

    if ( !time ) {
      this._translate(x, y);
    } else {
      this._animate(x, y, time, easing);
    }
  },

  _translate: function (x, y) {
    this.pos [0] = x;
    this.pos [1] = y;

    this.wrapper.__invalid_matrixes = true;
    GLView.__should_render = true;
  },
  
  __gl_update_scroll : function (now) {
    if ( !this.isAnimating ) return;
    
    var newX, newY, easing;

    if ( now >= (this.anim_startTime + this.anim_duration) ) {
      this.isAnimating = false;
      GLView.__nb_animation --;
      this.wrapper.__is_scrolling = false;
      this._translate (this.anim_destX, this.anim_destY);

      if ( !this.resetPosition(this.options.bounceTime) ) {
        this._execEvent('scrollEnd');
      }
      return;
    }

    now = ( now - this.anim_startTime ) / this.anim_duration;
    easing = this.anim_easingFn (now);
    newX = ( this.anim_destX - this.anim_startX ) * easing + this.anim_startX;
    newY = ( this.anim_destY - this.anim_startY ) * easing + this.anim_startY;
    this._translate (newX, newY);
  },

  _animate: function (destX, destY, duration, easingFn) {
    this.anim_startX = this.pos [0],
    this.anim_startY = this.pos [1];
      
    this.anim_startTime = performance.now (),
    this.anim_duration = duration;
    this.anim_easingFn = easingFn;
    this.anim_destX = destX;
    this.anim_destY = destY;
    
    if (!this.isAnimating) {
      this.isAnimating = true;
      GLView.__nb_animation ++;
    }
    this.wrapper.__invalid_matrixes = true;
    this.wrapper.__is_scrolling = true;
    GLView.__should_render = true;
  },
  
  handleEvent: function (e) {
    var type = e.type;
    if (type === vs.POINTER_MOVE) {
      this._move(e);
    }
    else if (type === vs.POINTER_START) {
      this._start(e);
    }
    else if (type === vs.POINTER_END || type === vs.POINTER_CANCEL) {
      this._end(e);
    }
    else if (type === 'wheel' ||
             type === 'DOMMouseScroll' ||
             type === 'mousewheel') {
      this._wheel(e);
    }
    else if (type === 'keydown') {
      this._key(e);
    }
  }
};

GLScrollView.__iscroll = __iscroll;

})(window, Math);
/**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/


/**
 *  The vs.ui.GLAbstractList class
 *
 *  @extends vs.ui.GLScrollView
 *  @class
 *  @author David Thevenin
 *
 *  @constructor
 *   Creates a new vs.ui.GLAbstractList.
 * @name vs.ui.GLAbstractList
 *
 * @param {Object} config the configuration structure [mandatory]
 */
function GLAbstractList (config)
{
  this.parent = GLScrollView;
  this.parent (config);
  this.constructor = GLScrollView;
}

GLAbstractList.prototype = {

 /**********************************************************************
                 General data for the list
  *********************************************************************/

  /**
   *
   * @private
   * @type {PointerRecognizer}
   */
  __tap_recognizer: null,
  __list_time_out: 0,

   /**
   * @protected
   * @type {boolean}
   */
  _items_selectable : true,
  
   /**
   * @protected
   * @type {boolean}
   */
  _scroll: 0,
  
  /**
   * @private
   * @type {vs.core.Array}
   */
  _model: null,
       
 /**********************************************************************
                  Data Used for managing scroll states
  *********************************************************************/
  
  /**
   *  @private
   */
   __elem : null,
     
  /**
   * @private
   * @type {int}
   */
  __scroll_start: 0,

 /**********************************************************************

  *********************************************************************/
// 
//   /**
//    * @protected
//    * @function
//    */
//   add : function () { },
//   
//   /**
//    * @protected
//    * @function
//    */
//   remove : function (child) {},
      
 /**********************************************************************

  *********************************************************************/
  
  /**
   * @protected
   * @function
   */
  destructor: function ()
  {
    GLScrollView.prototype.destructor.call (this);
    
//     if (this.__tap_recognizer)
//     {
//       this.removePointerRecognizer (this.__tap_recognizer);
//       this.__tap_recognizer = null;
//     }

    this._model.unbindChange (null, this, this._modelChanged);
    if (this._model_allocated) util.free (this._model);
    this._model_allocated = false;
  },
  
  /**
   * @protected
   * @function
   */
  initComponent: function ()
  {
    GLScrollView.prototype.initComponent.call (this);
    
    this._model = new vs.core.Array ();
    this._model.init ();
    this._model_allocated = true;
    this._model.bindChange (null, this, this._modelChanged);
    
    // manage list template without x-hag-hole="item_children"
//     if (!this._holes.item_children) {
//       this._holes.item_children = this.view.querySelector ('ul');
//     }
//     
//     this._list_items = this._sub_view = this._holes.item_children;

//     if (!this.__tap_recognizer)
//     {
//       this.__tap_recognizer = new TapRecognizer (this);
//       this.addPointerRecognizer (this.__tap_recognizer);
//     }

    this.refresh ();
  },
    

  /**
   * @protected
   * @function
   */
  refresh : function ()
  {
    GLView.prototype.refresh.call (this);

    var children = this.__children;
    if (!children || children.length === 0) return;
    
    var i = 0, l = children.length, view, y = 0, size;
    for (; i < l; i++) {
      view = children [i];
      view.position = [0, y];
      size = view._size;
      y += size [1];
    }

    if (this.__scroll__) {
      this.__scroll__.refresh ();
    }
  },

  /**
   * @protected
   * @function
   */
  _modelChanged : function ()
  {
    // TODO   on peut mieux faire : au lieu de faire
    // un init skin qui vire tout et reconstruit tout, on pourrait
    // ne gerer que la difference
    this._renderData (this._items_selectable);
    this.refresh ();
  },
    
  /**
   * @protected
   * @function
   */
  propertiesDidChange: function () {
    this._modelChanged ();
    return true;
  },
  
  /**
   * @protected
   * @function
   */
  _renderData : function () {},
    
  /**
   * @protected
   * @function
   */
  _touchItemFeedback : function (item) {},
      
  /**
   * @protected
   * @function
   */
  _untouchItemFeedback : function (item) {},

  /**
   * @protected
   * @function
   */
  _updateSelectItem : function (item) {},

  /**
   * @protected
   * @function
   */
  didTouch : function (target, e)
  {
    if (!this._items_selectable) { return false; }
    
    if (target === this._sub_view || target === this.view) {
      this.__elem = null;
      return;
    }
    
    this.__elem = target;
    if (this.__list_time_out) {
      clearTimeout (this.__list_time_out);
      this.__list_time_out = 0;
    }
    if (this.__elem_to_unselect)
    {
      this._untouchItemFeedback (this.__elem_to_unselect);
      this.__elem_to_unselect = null;
    }
    this.__elem_to_unselect = target;
    if (target) this._touchItemFeedback (target);
  },
  
  /**
   * @protected
   * @function
   */
  didUntouch : function (e, target)
  {
    if (!this.__list_time_out && this.__elem_to_unselect)
    {
      this._untouchItemFeedback (this.__elem_to_unselect);
      this.__elem_to_unselect = null;
    }
    this.__elem = null;
  },
  
  didTap : function (nb_tap, target, e)
  {
    var self = this;
    this.__elem_to_unselect = this.__elem;
    if (this.__elem) {
      this._updateSelectItem (this.__elem);

      this.__list_time_out = setTimeout (function () {
        if (self.__elem_to_unselect) {
          self._untouchItemFeedback (self.__elem_to_unselect);
        }
        self.__elem_to_unselect = null;
        self.__list_time_out = 0;
      }, vs.ui.View.UNSELECT_DELAY);
    }
  },

  /**
   * Scroll the list to the element at the set index
   * <p>
   * If to time is defined, the default time is set to 200ms.
   *
   * @name vs.ui.GLAbstractList#scrollToElementAt 
   * @function
   * @param {Number} index the element index
   * @param {Number} time [Optional] the scroll duration
   */
  scrollToElementAt: function (index, time)
  {
    if (!this.__iscroll__) { return; }
    if (!util.isNumber (time)) { time = 200; }
    var elem = this.__item_obs [index];
    if (!elem) { return; }

		var pos = this.__iscroll__._offset (elem.view);
		pos.top += this.__iscroll__.wrapperOffsetTop;

		pos.top = pos.top > this.__iscroll__.minScrollY ?
		  this.__iscroll__.minScrollY :
		  pos.top < this.__iscroll__.maxScrollY ?
		    this.__iscroll__.maxScrollY : pos.top;
		    
		this.__scroll__.scrollTo (0, pos.top, 200);
  }
};
util.extendClass (GLAbstractList, GLScrollView);

/********************************************************************
                  Define class properties
********************************************************************/

util.defineClassProperties (GLAbstractList, {

  'scroll': {
    /** 
     * Allow to scroll the list items.
     * By default it not allowed
     * @name vs.ui.CheckBox#scroll 
     * @type {boolean}
     */ 
    set : function (v)
    {
      if (v)
      {
        this._scroll = vs.ui.ScrollView.VERTICAL_SCROLL;
        this._setup_scroll ();
      }
      else
      {
        this._scroll = false;
        this._remove_scroll ();
      }
    },
  
    /** 
     * @ignore
     * @type {boolean}
     */ 
    get : function ()
    {
      return this._scroll?true:false;
    }
  },
  
  'model': {
    /** 
     * Getter|Setter for data. Allow to get or change the vertical list
     * @name vs.ui.GLAbstractList#model 
     *
     * @type vs.core.Array
     */ 
    set : function (v)
    {
      if (!v) return;
      
      if (util.isArray (v))
      {
        this._model.removeAll ();
        this._model.add.apply (this._model, v);
      }
      else if (v.toJSON && v.propertyChange)
      {
        if (this._model_allocated)
        {
          this._model.unbindChange (null, this, this._modelChanged);
          util.free (this._model);
        }
        this._model_allocated = false;
        this._model = v;
        this._model.bindChange (null, this, this._modelChanged);
      }
      
      this.inPropertyDidChange ();
    },
  
    /**
     * @ignore
     */
    get : function ()
    {
      return this._model;
    }
  },
  
  'data': {
    /** 
     * Getter|Setter for data. Allow to get or change the vertical list
     * @name vs.ui.GLAbstractList#data 
     *
     * @deprecated
     * @see vs.ui.GLAbstractList#model 
     * @type Array
     */ 
    set : function (v)
    {
      if (!util.isArray (v)) return;
      
      if (!this._model_allocated)
      {
        this._model = new vs.core.Array ();
        this._model.init ();
        this._model_allocated = true;
        this._model.bindChange (null, this, this._modelChanged);
      }
      else
      {
        this._model.removeAll ();
      }
      this._model.add.apply (this._model, v);

      this.inPropertyDidChange ();
    },
  
    /**
     * @ignore
     */
    get : function ()
    {
      return this._model._data.slice ();
    }
  }
});

/********************************************************************
                      Export
*********************************************************************/
/** @private */
ui.GLAbstractList = GLAbstractList;
/**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and
  contributors. All rights reserved

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/**
 *  @class
 *  vs.ui.GLTemplate is GUI template system you can use to create the view
 *  of component for instance. <br/>
 *  A template is a HTML text fragment containing template tags. There is two
 *  ways to use template :
 * <ul>
 *   <li> By expanding tags using values provides in an Object</li>
 *   <li> By generating a vs.ui.View with properties linked to tags</li>
 * </ul>
 *  @author David Thevenin
 * <br/>
 * <br/>
 * Typical template description:
 * <pre class='code'>
 *  var str = '&lt;span style="${style}"&gt;name:${lastname}, \
 *     ${firstname}&lt;/span&gt;';
 * </pre>
 *
 * Expanding the template:
 * <pre class='code'>
 *  var myTemplate = new GLTemplate (str);
 * <br/>
 *  var values = {
 *    lastname : "Doe",
 *    firstname : "John",
 *    style : "color:blue"
 *  };
 * <br/>
 *  console.log (myTemplate.apply (values));
 *  // -> &lt;span style="color:blue"&gt;name:Doe,John&lt;/span&gt;
 * </pre>
 *
 * Generating a vs.ui.View from the template:
 * <pre class='code'>
 *  var myTemplate = new GLTemplate (str);
 * <br/>
 *  var myView = myTemplate.compileView ();
 * <br/>
 *  myApp.add (myView); //|| document.body.appendChild (myView.view);
 * <br/>
 *  // property changes, automatically update the DOM
 *  myView.lastname = "Doe";
 *  myView.firstname = "John";
 *  myView.style = "color:blue";
 * <br/>
 * </pre>
 *
 *  @constructor
 *  Main constructor
 *
 * @name vs.ui.GLTemplate
 *
 * @param {string} config the configuration structure [mandatory]
 */
function GLTemplate (str) {
  this._str = str;
}

/** @name vs.ui.GLTemplate# */
GLTemplate.prototype = {
  /**
   * @protected
   * @Array
   */
  _str : null,
  _regexp_templ : /\$\{((([\w\-]+)(\.([\w\.]*)+)?)|@)\}/g,
  _regexp_index : /\$\{\*([\d]+)\*\}/g,
  _shadow_view : null,

  /***************************************************************

  ***************************************************************/

  /**
   * HTML String of the template <p>
   *
   * @name vs.ui.GLTemplate#toString
   * @function
   *
   * @return {String} HTML String of the template
   */
  toString : function () {
    return this._str;
  },

  /**
   *
   * @name vs.ui.GLTemplate#compileView
   * @function
   *
   * @param {String} className The view class Name. By default vs.ui.View.
   *                 [optional]
   * @param {Object|Model} data The view data configuration | model
   *                 [optional]
   * @return {vs.ui.View} the View
   */
  compileView : function (className, data) {
  
    if (!this._shadow_view) {
      this._shadow_view = _pre_compile_shadow_view (this, className);
    }
    
    var obj = _instanciate_shadow_view (this._shadow_view, data);

    // Clone data
    obj.__shadow_view = this._shadow_view;
    // Clone surcharge
 //   obj.clone = _template_view_clone.bind (obj);
 //   obj._clone = _template_view__clone.bind (obj);

    return obj;
  },

  /**
   *
   * @name vs.ui.GLTemplate#compileView
   * @function
   * @private
   *
   * @param {vs.ui.View} comp Extends a component with this template
   *                 [mandatory]
   * @return {HTMLElement} The component view
   */
   __extend_component : function (comp) {
    if (!this._shadow_view) {
      this._shadow_view = _pre_compile_shadow_view (this);
    }
    
    var new_node = this._shadow_view.__node.cloneNode (true);
    comp.view = new_node;
  
    _instrument_component (comp, this._shadow_view, new_node);
  
    // Clone data
    comp.__shadow_view = this._shadow_view;
    // Clone surcharge
//    comp.clone = _template_view_clone.bind (comp);
//    comp._clone = _template_view__clone.bind (comp);

    return new_node;
  },

  /**
   * Returns an HTML String of this template with the specified values.
   *
   * @example
   *  myTemplate.apply (['John', 25]);
   *
   * @name vs.ui.GLTemplate#apply
   * @function
   *
   * @param {Object} values The template values.
   * @return {String} The HTML string
   */
  apply : function (values) {
    if (!values) return this._str;

    function replace_fnc (str, key, p1, p2, offset, html) {
      var value = values [key], key, keys, i, l;

      if (offset) {
        keys = p1.split ('.'); i = 1; l = keys.length;
        value = values [keys[0]];
        while (value && i < l) value = value [keys [i++]];
      }

      return value;
    }

    return this._str.replace (this._regexp_templ, replace_fnc);
  }
};

/**
 * @private
 */
function _resolveClass (name) {
  if (!name) { return null; }

  var namespaces = name.split ('.');
  var base = window;
  while (base && namespaces.length) {
    base = base [namespaces.shift ()];
  }

  return base;
}

/**
 * @private
 */
var _template_view_clone = function (config, cloned_map) {
  if (!config) { config = {}; }
  
  config.node =
    (this.__shadow_view)?this.__shadow_view.__node.cloneNode (true):
    (config.node)?config.node:this.view.cloneNode (true);
  
  return core.EventSource.prototype.clone.call (this, config, cloned_map);
};

/**
 * @private
 */
var _template_view__clone = function (obj, cloned_map) {
  ui.GLView.prototype._clone.call (this, obj, cloned_map);

  _instrument_component (obj, this.__shadow_view, obj.view);

  // Clone data
  obj.__shadow_view = this.__shadow_view;
  // clone surcharge
//  obj.clone = _template_view_clone.bind (obj);
//  obj._clone = _template_view__clone.bind (obj);
  // rewrite properties to point cloned nodes
};

/**
 * @private
 */
function _instrument_component (obj, shadow_view, node) {

  /**
   * @private
   */
  var _create_node_property = function (view, prop_name, nodes) {
    var desc = {}, _prop_name = '_' + util.underscore (prop_name);

    desc.set = (function (nodes, prop_name, _prop_name) {
      return function (v) {
        var i = 0, node, l = nodes.length, r;
        this [_prop_name] = v;
        for (; i < l; i++) {
          node = nodes [i];
          if (node.nodeType === 3) { //TEXT_NODE
            node.data = v;
          }
          else if (node.nodeType === 2) {
            r = eval(node.__attr_eval_str);
            //ATTRIBUTE_NODE
            if (node.name == 'value' && node.ownerElement.tagName == 'INPUT') {
              node.ownerElement.value = r;
            }
            //ATTRIBUTE_NODE
            else {
              node.value = r;
            }
          }
        }
        if (prop_name == '_$_') this.propertyChange ();
        else this.propertyChange (prop_name);
      };
    }(nodes, prop_name, _prop_name));

    desc.get = (function (_prop_name) {
      return function () {
        return this[_prop_name];
      };
    }(_prop_name));

    // save this string for clone process
//    desc.set.__vs_attr_eval_str = attr_eval_str;

    view.defineProperty (prop_name, desc);
  };

  /**
   * @private
   */
  var _create_iterate_property =
    function (obj, prop_name, shadow_view, parentElement) {
    var desc = {}, _prop_name = '_' + util.underscore (prop_name);
      
    desc.set = (function (prop_name, _prop_name, shadow_view, parentElement) {
      return function (v) {
        if (!util.isArray (v)) { return; }
      
        var i = 0, l = v.length, obj;
        this [_prop_name] = v;
        util.removeAllElementChild (parentElement);
        for (; i < l; i++) {
          obj = _instanciate_shadow_view (shadow_view, v [i]);
          parentElement.appendChild (obj.view);
        }

        this.propertyChange (prop_name);
      };
    }(prop_name, _prop_name, shadow_view, parentElement));

    desc.get = (function (_prop_name) {
      return function () {
        return this[_prop_name];
      };
    }(_prop_name));

    obj.defineProperty (prop_name, desc);
  };

  /**
   * @private
   */
  var _createPropertiesToObject = function (obj, ctx) {
    var node_ref = [];

    // configure properties
    
    // Properties pointing on a node
    var l = ctx.__all_properties.length;
    while (l--) {
      var prop_name = ctx.__all_properties [l],
        nodes = ctx.__prop_nodes [l],
        paths, nodes_cloned;
      
      if (nodes) {
        paths = _getPaths (ctx.__node, nodes);
//        nodes_cloned = _evalPaths (view_node, paths);

        node_ref.push ([prop_name, nodes]);
//        if (prop_name === '@') _create_node_property (obj, '_$_', nodes_cloned);
//        else _create_node_property (obj, prop_name, nodes_cloned);
      }
    }

    // Iterate Properties
    var l = ctx.__all_properties.length;
    while (l--) {
      var prop_name = ctx.__all_properties [l];
//        shadow_view = ctx.__list_iterate_prop [prop_name], paths, nodes_cloned;
      
      if (shadow_view) {
//        path = _getPath (ctx.__node, shadow_view.__parent_node);
//        node_cloned = _evalPath (view_node, path);

        _create_iterate_property (obj, prop_name, shadow_view, node_cloned);
      }
    }
    obj.__node__ref__ = node_ref;
  };
  
//  _createPropertiesToObject (obj, shadow_view, node);
};

/**
 * @private
 */
function _instanciate_shadow_view (shadow_view, data) {

  var new_node = shadow_view.__node.cloneNode (true);


//   var div = document.createElement ("div");
//   document.body.appendChild (div);
//   div.appendChild (new_node);
  


  var obj = new shadow_view.__class ({node: new_node});
  
  _instrument_component (obj, shadow_view, new_node);
  
  obj.init ();
  if (data) {
    obj.configure (data);
  }
  if (obj.isProperty ('_$_')) { obj._$_ = data; }
  
  return obj;
};

/**
 * @private
 */
function _pre_compile_shadow_view (self, className) {
  var shadow_view = {};
  shadow_view.__prop_nodes = [];
  shadow_view.__list_iterate_prop = {};
  shadow_view.__all_properties = [];

  shadow_view.__class = _resolveClass (className);
  if (!util.isFunction (shadow_view.__class)) {
    shadow_view.__class = ui.GLView;
  }

  /**
   * Replacement function
   * Replace a GLTemplate tag into a temporary index code
   * This code will be used to identify DOM nodes
   */
  function replace_fnc (str, key, p1, p2, offset, html) {
    var i = shadow_view.__all_properties.indexOf (key);
    if (i === -1) {
      i = shadow_view.__all_properties.length;
      // a new property is found
      shadow_view.__all_properties.push (key);
    }
    return "\${*" + i + "*}";
  }

  // 1) parse and index the html string
  self._regexp_templ.lastIndex = 0; // reset the regex
  var str = self._str.replace (self._regexp_templ, replace_fnc);

  // 2) the template is indexed, now parse it for generating the
  // DOM fragment
  shadow_view.__node = GLTemplate.parseHTML (str);

  /**
   * Attributes parsing function
   */
  function parseAttributes (nodes, ctx) {
    if (!nodes) return;
    var l = nodes.length;
    while (l--) {
      var node_temp = nodes.item (l), result,
        str = node_temp.value, indexs = [], index;

      self._regexp_index.lastIndex = 0;// reset the regex
      result = self._regexp_index.exec (str);
      if (result) {
        while (result) {
          index = parseInt (result[1], 10);
          indexs.push (index);
          if (!ctx.__prop_nodes [index])
          { ctx.__prop_nodes [index] = [node_temp]; }
          else { ctx.__prop_nodes [index].push (node_temp); }
          result = self._regexp_index.exec (str);
        }
        node_temp.value = '';

        for (var i = 0; i < indexs.length; i++) {
          index = indexs [i];
          str = str.replace (
            "${*" + index + "*}",
            "\"+this._" + util.underscore (ctx.__all_properties [index]) + "+\""
          );
        }
        
        node_temp.__attr_eval_str = "\"" + str + "\"";
      }
    }
  }
  
  /**
   * Node parsing function
   * Parse the DOM fragment to retrieve attribute and text node
   * associated to a template tag
   */
  function parseNode (node, ctx) {
    var interate_attr = node.getAttribute ('data-iterate');
    if (interate_attr) {
      var parentElement = node.parentElement;
      parentElement.removeChild (node);
      
      if (ctx.__all_properties.indexOf (interate_attr) === -1) {
        ctx.__all_properties.push (interate_attr);
      }

      var shadow_view = {};
      ctx.__list_iterate_prop [interate_attr] = shadow_view;
      
      shadow_view.__prop_nodes = [];
      shadow_view.__list_iterate_prop = {};
      shadow_view.__parent_node = parentElement;
      shadow_view.__node = node;
      shadow_view.__all_properties = ctx.__all_properties;
      shadow_view.__class = ui.GLView;
      
      ctx = shadow_view;
    }
    
    /**
     * Nodes parsing function
     */
    function parseNodes (nodes, ctx) {
      if (!nodes) return;
      var l = nodes.length;
      while (l--) {
        var node_temp = nodes.item (l);
        if (node_temp.nodeType === 3) { // TEXT_NODE
          var value = node_temp.data, result, index = 0, i, text_node;

          self._regexp_index.lastIndex = 0;// reset the regex
          // put white space to avoid IE nodeClone removes empty textNode
          node_temp.data = ' ';
          result = self._regexp_index.exec (value);
          while (result) {
            if (result.index) {
              text_node = document.createTextNode
                (value.substring (index, result.index));
              node.insertBefore (text_node, node_temp);
            }

            i = parseInt (result[1], 10);
            if (!ctx.__prop_nodes [i]) {
              ctx.__prop_nodes [i] = [node_temp];
            }
            else {
              ctx.__prop_nodes [i].push (node_temp);
            }
            
            index = result.index + result[0].length;

            result = self._regexp_index.exec (value);
            if (result) {
              // put white space to avoid IE nodeClone removes empty textNode
              text_node = document.createTextNode (' ');
              if (node_temp.nextSibling) {
                node.insertBefore (text_node, node_temp.nextSibling);
              }
              else {
                node.appendChild (text_node);
              }
              node_temp = text_node;
            }
          }
          var end_text = value.substring (index);
          if (end_text) {
            text_node = document.createTextNode (end_text);
            if (node_temp.nextSibling) {
              node.insertBefore (text_node, node_temp.nextSibling);
            }
            else {
              node.appendChild (text_node);
            }
          }
        }
        else if (node_temp.nodeType === 1) { // ELEMENT_NODE
          parseNode (node_temp, ctx);
        }
      }
    }

    parseAttributes (node.attributes, ctx);
    parseNodes (node.childNodes, ctx);
  }
  parseNode (shadow_view.__node, shadow_view);

  return shadow_view;
};

/**
 * @private
 */
var _getPaths = function (root, nodes) {
  var paths = [], i = 0, l = nodes.length, node;
  for (; i < l; i++) {
    node = nodes[i];
    paths.push ([_getPath (root, node), node.__attr_eval_str]);
  }
  return paths;
}

/**
 * @private
 */
var _getPath = function (root, node, path) {
  var count = 1;
  path = path || [];

  // 1) manage node atribute
  if (node.nodeType === 2) {
    if (node.ownerElement) {
      path = _getPath (root, node.ownerElement, path);
    }
    path.push ([2, node.nodeName.toLowerCase ()]);
    return path;
  }

  // 2) current node is the root : stop
  if (root === node) {
    return path;
  }

  // 2) Manage parent
  if (node.parentNode) {
    path = _getPath (root, node.parentNode, path);
  }

  // 1) manage node atribute
  var sibling = node.previousSibling
  while (sibling) {
    if ((sibling.nodeType === 1 || sibling.nodeType === 3) &&
         sibling.nodeName == node.nodeName) {
      count++;
    }
    sibling = sibling.previousSibling;
  }

  path.push ([1, node.nodeName.toLowerCase(), count]);
  return path;
};

/**
 * @private
 */
var _evalPaths = function (root, paths) {
  var nodes = [], i = 0, l = paths.length, path, node;
  for (; i < l; i++) {
    path = paths[i];
    node = _evalPath (root, path[0]);
    node.__attr_eval_str = path[1];
    nodes.push (node);
  }
  return nodes;
}

/**
 * @private
 */
var _evalPath = function (root, path) {
  if (!path || !path.length || !root) {
    return root;
  }

  var info = path.shift (), attrs, l, node_temp, sibbling,
    type = info [0], nodeName = info [1], count;

  // 1) manage node atribute
  if (type === 2) {
    attrs = root.attributes;
    l = attrs.length;
    while (l--) {
      node_temp = attrs.item (l);
      if (node_temp.nodeName.toLowerCase () ==  nodeName) { return node_temp; }
    }
    return null;
  }
  else if (type === 1) {
    sibbling = root.firstChild; l = info [2], count = 1;
    while (sibbling) {
      if (sibbling.nodeName.toLowerCase () === nodeName) {
        if (l === count) {
          return _evalPath (sibbling, path);
        }
        else {
          count ++;
        }
      }
      sibbling = sibbling.nextSibling;
    }
  }

  return null;
};

/**
 * @protected
 */
GLTemplate.parseHTML = function (html) {
  var div = document.createElement ('div');
  try {
    util.safeInnerHTML (div, html);

    div = div.firstElementChild;
    if (div) {
      div.parentElement.removeChild (div);
    }
  }
  catch (e) {
    console.error ("vs.ui.GLTemplate.parseHTML failed:");
    if (e.stack) console.log (e.stack);
    console.error (e);
    return undefined;
  }
  return div;
}
/********************************************************************
                      Export
*********************************************************************/
/** @private */
vs.ui.GLTemplate = GLTemplate;
/**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/


/**********************************************************************
        
        
*********************************************************************/

/**
 *  The vs.ui.GLList class
 *
 *  @extends vs.ui.AbstractList
 *  @class
 *  The vs.ui.GLList class draw a list of ListItem and allows the user to 
 *  select one object from it.
 *  <p>
 *  Events:
 *  <ul>
 *    <li />itemselect, fired when a item is selected.
 *          Event Data = {index, item data}
 *  </ul>
 *  <p>
 *  To reduce performance issues, you can deactivate events handling
 *  for the list, using vs.ui.GLList#itemsSelectable property.
 *
 * Data can be filtered. The filter he array contains the member to filters
 * and filter:
 * @ex:
 *   list.filters = [{
 *      property:'title',
 *      value:'o',
 *      matching:vs.ui.GLList.FILTER_CONTAINS,
 *      strict:true
 *   }];
 *  @author David Thevenin
 *
 *  @constructor
 *   Creates a new vs.ui.GLList.
 * @name vs.ui.GLList
 *
 * @param {Object} config the configuration structure [mandatory]
 */
function GLList (config)
{
  this.parent = GLAbstractList;
  this.parent (config);
  this.constructor = GLList;
}

/**
 * @const 
 * @name vs.ui.GLList.BLOCK_LIST
 */
GLList.BLOCK_LIST = 'BlockList';

/**
 * @const 
 * @name vs.ui.GLList.TAB_LIST
 */
GLList.TAB_LIST = 'TabList';

/**
 * @const 
 * @name vs.ui.GLList.DEFAULT_LIST
 */
GLList.DEFAULT_LIST = 'DefaultList';

GLList.prototype = {

 /**********************************************************************
                 General data for the list
  *********************************************************************/
  
  /**
   * @private
   * @type {number}
   */
  _selected_index: 0,
  
  /**
   * @private
   * @type {number}
   */
  _selected_item: 0,
       
 /**********************************************************************
                  Data Used for managing scroll states
  *********************************************************************/

  /**
   *  @private
   */
   __elem : null,
     
  /**
   * @private
   * @type {vs.core.Object}
   */
  __template_obj: null,
  __template_class: null,

 /**********************************************************************

  *********************************************************************/

  /**
   * Return the list of items in the vs.ui.GLList
   *
   * @name vs.ui.GLList#getItems 
   * @function
   * @return {Array} the items
   */
  getItems : function ()
  {
    if (this.__item_obs)
    {
      return this.__children.slice ();
    }
    return [];
  },
  
  /**
   * @protected
   * @function
   */
  _renderData : defaultListRenderData,
  
  /**
   * @protected
   * @function
   */
  _modelChanged : function (event)
  {
    // TODO   on peut mieux faire : au lieu de faire
    // un init skin qui vire tout et reconstruit tout, on pourrait
    // ne gerer que la difference
    this._renderData (this._items_selectable);
  },

  /**
   * @protected
   * @function
   */
  _touchItemFeedback : function (item)
  {
    item.pressed = true;
  },
  
  /**
   * @private
   * @function
   */
  _untouchItemFeedback : function (item)
  {
    item.pressed = false;
  },
      
  /**
   * @protected
   * @function
   */
  _updateSelectItem : function (item)
  {
    this._selected_index = item.index;
    this._selected_item = this._model.item (this._selected_index);
    if (item.didSelect) item.didSelect ();
    
    this.outPropertyChange ();
                
    this.propagate ('itemselect',
    {
      index: this._selected_index,
      item: this._selected_item
    });
  }
};
util.extendClass (GLList, GLAbstractList);

/********************************************************************
                  Define class properties
********************************************************************/

util.defineClassProperties (GLList, {
  'itemsSelectable': {
    /** 
     * Allow deactivate the list item selection.
     * <p>
     * This is use full to set this property to false, if you do not listen
     * the event 'itemselect'. It will prevent unnecessary inter event 
     * management
     * which uses processing time.
     * By default its set to true
     * @name vs.ui.GLList#itemsSelectable 
     * @type {boolean}
     */ 
    set : function (v)
    {
      if (v && this._items_selectable) { return; }
      if (!v && !this._items_selectable) { return; }
      
//       if (v)
//       {
//         this._items_selectable = true;
//         for (i = 0; i < this.__item_obs.length; i++)
//         {
//           obj = this.__item_obs [i];
//           vs.addPointerListener (obj.view, core.POINTER_START, this, true);
//         }
//       }
//       else
//       {
//         this._items_selectable = false;
//         for (i = 0; i < this.__item_obs.length; i++)
//         {
//           obj = this.__item_obs [i];
//           vs.removePointerListener (obj.view, core.POINTER_START, this, true);
//         }
//       }
    }
  },
  
  'selectedIndex': {
    /** 
     * Getter for selectedIndex.
     * @name vs.ui.GLList#selectedIndex 
     * @type {number}
     */ 
    get : function ()
    {
      return this._selected_index;
    }
  },
  
  
  'selectedItem': {
    /** 
     * Getter for selectedItem.
     * @name vs.ui.GLList#selectedItem 
     * @type {Object}
     */ 
    get : function ()
    {
      return this._selected_item;
    }
  }
});

/********************************************************************
                      Export
*********************************************************************/
/** @private */
ui.GLList = GLList;

/**
 * @private
 */
function defaultListRenderData (itemsSelectable)
{
  if (!this._model) { return; }
     
  var index = 0, item, title, y = 0,
    s, width, titles, i, items, listItem;
   
  // remove all children
  this.removeAllChildren (true);
        
  while (index < this._model.length)
  {
    item = this._model.item (index);
    if (this.__template_class)
    {
      listItem = new this.__template_class () .init ();
    }
    else if (this.__template_obj)
    {
      listItem = this.__template_obj.clone ();
    }
//     else
//     {
//       listItem = new DefaultListItem ().init ();
//     }

    if (!listItem) {
      index ++;
      continue;
    }
    
    listItem.position = [0, y];
    y += listItem._size [1];
    
    // model update management
    if (item instanceof core.Model)
    {
      listItem.link (item);
    }
    else
    {
      listItem.configure (item);
    }
    listItem.index = index;

    if (itemsSelectable)
    {
      vs.addPointerListener (listItem.view, core.POINTER_START, this);
    }
    this.add (listItem);
    listItem.__parent = this;
    index ++;
    
    listItem = null;
  }
  
  this.refresh ();
};
/**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and
  contributors. All rights reserved

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var procesAnimation = function (comp, animation, clb, ctx, now) {
  for (var key in AnimationDefaultOption) {
    if (!animation [key]) animation [key] = AnimationDefaultOption [key];
  }

  var trajs = new TrajectoriesData ();
  var timing = animation.timing;
  
  for (var property in animation._trajectories) {
    setupTrajectory (trajs, comp, property, animation._trajectories [property]);
  }
  
  animation.steps = animation.steps | 0;
  if (animation.steps <= 1) animation.steps = 0;
  
  var chrono = new Chronometer (animation)
  chrono.__clb = function (i) {
    trajs.compute (timing (i));
  }
  chrono.__clb_end = function () {
    if (animation.steps === 0) {
      comp.__animations.remove (chrono)
      GLView.__nb_animation --;
    }
    
    if (clb) {
      if (!ctx) ctx = window;
      clb.apply (ctx);
    }
  }
  chrono.start ();
  
  if (animation.steps === 0) {
    comp.__animations.push (chrono);
    GLView.__nb_animation ++;
  }
}


var setupTrajectory = function (trajs, obj, property, traj)
{
  switch (property) {
    case "opacity": 
    case "fontSize": 
      obj = obj.style;
      break;
  }

  if (vs.util.isUndefined (traj._values [0][1])) {
    traj._values [0][1] = obj[property];
  }

  trajs.add (obj, property, traj);
}

function CubicBezier (t,p1x,p1y,p2x,p2y)
{
  var ax=0,bx=0,cx=0,ay=0,by=0,cy=0,epsilon=1.0/200.0;
  function sampleCurveX(t) {return ((ax*t+bx)*t+cx)*t;};
  function sampleCurveY(t) {return ((ay*t+by)*t+cy)*t;};
  function sampleCurveDerivativeX(t) {return (3.0*ax*t+2.0*bx)*t+cx;};
  function solve(x) {return sampleCurveY(solveCurveX(x));};
  function fabs(n) {if(n>=0) {return n;}else {return 0-n;}};
  
  function solveCurveX (x)
  {
    var t0,t1,t2,x2,d2,i;
    for (t2 = x, i = 0; i < 8; i++) {
      x2 = sampleCurveX (t2) - x;
      if (fabs (x2) < epsilon) return t2;
      d2 = sampleCurveDerivativeX (t2);
      if (fabs (d2) < 1e-6) break;
      t2 = t2 - x2 / d2;
    }
    t0=0.0; t1=1.0; t2=x;
    if (t2 < t0) return t0;
    if (t2 > t1) return t1;
    while (t0 < t1) {
      x2 = sampleCurveX(t2);
      if (fabs(x2-x)<epsilon) return t2;
      if (x > x2) {t0=t2;}
      else {t1=t2;}
      t2 = (t1 - t0) * 0.5 + t0;
    }
    return t2; // Failure.
  };
  cx = 3.0 * p1x;
  bx = 3.0 * (p2x - p1x) - cx;
  ax = 1.0 - cx - bx;
  cy = 3.0 * p1y;
  by = 3.0 * (p2y - p1y) - cy;
  ay = 1.0 - cy - by;
  
  return solve (t);
}

/**
 *  generateCubicBezierFunction(x1, y1, x2, y2) -> Function
 *
 *  Generates a transition easing function that is compatible
 *  with WebKit's CSS transitions `-webkit-transition-timing-function`
 *  CSS property.
 *
 *  The W3C has more information about 
 *  <a href="http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag">
 *  CSS3 transition timing functions</a>.
 **/
function generateCubicBezierFunction (x1, y1, x2, y2) {
  return (function(pos) {return CubicBezier (pos,x1,y1,x2,y2);});
}
function GLAnimation (animations)
{
//   this.parent = core.Task;
//   this.parent ();
  this.constructor = GLAnimation;

  if (arguments.length)
  {
    this.setAnimations (arguments);
  }
};

/**
 * @private
 */
GLAnimation.__css_animations = {};

GLAnimation.prototype = {

  begin: 0,
  steps: 0,
  repeat: 1,
  startClb: null,
  endClb: null,

  /**
   * The duration for each transformation. For setting only one duration,
   * use a string (ex anim.duration = 3000)
   * @type Array.<string>
   * @name vs.fx.GLAnimation#duration
   */
  duration: GLAnimation.DEFAULT_DURATION,

  /**
   * Specifies how the intermediate values used during a transition are
   * calculated. <p />Use the constants to specify preset points of the curve:
   * ({@link vs.fx.GLAnimation.EASE},
   * {@link vs.fx.GLAnimation.LINEAR}, {@link vs.fx.GLAnimation.EASE_IN},
   * {@link vs.fx.GLAnimation.EASE_OUT}, {@link vs.fx.GLAnimation.EASE_IN_OUT})
   * or the cubic-bezier function to specify your own points.
   * <p />
   * Specifies a cubic Bézier curve : cubic-bezier(P1x,P1y,P2x,P2y) <br />
   * Parameters: <br />
   * - First point in the Bézier curve : P1x, P1y <br />
   * - Second point in the Bézier curve : P2x, P2y <br />
   *
   * @type Function
   * @name vs.fx.GLAnimation#timing
   */
  timing: null,

  /**
   *  Defines the properties to animate.
   *  <p>
   *  When you call the method you redefines your animation, and all
   *  animation options are set to default value.
   *
   * @example
   * // define a animation with two transformations
   * animation = new vs.fx.GLAnimation ()
   * animation.setAnimations ([[‘width’, '100px'], ['opacity', '0']]);
   *
   * @name vs.fx.GLAnimation#setAnimations
   * @function
   * @param {Array.<Array>} animations The array of [property, value]
   *         to animate
   */
  setAnimations : function (animations)
  {
    var i, property, value, option, traj;

    this.timing = GLAnimation.EASE;
    this._trajectories = {};
//     this.origin = null;
//     this.duration = null;

    for (i = 0 ; i < animations.length; i++)
    {
      option = animations [i];
      if (!util.isArray (option) || option.length !== 2)
      {
        console.warn ('vs.fx.GLAnimation, invalid animations');
        continue;
      }
      property = option [0]; value = option [1];
      if (!util.isString (property))
      {
        console.warn ('vs.fx.GLAnimation, invalid constructor argument option: [' +
          property + ', ' + value + ']');
        continue;
      }
      
      switch (property) {
        case "tick": 
        case "opacity": 
        case "fontSize": 
        case "scaling":
           traj = new Vector1D ([[0], [1, value]]);
          break;
    
        case "translation": 
          traj = new Vector2D ([[0], [1, value]]);
          break;
 
         case "rotation": 
           traj = new Vector3D ([[0], [1, value]]);
          break;

        default:
          console.log ("NOT SUPPORTED PROPERTY: " + property);
          return;
      }      
      
      this._trajectories [property] = traj;
    }
  },

  /**
   *  Add an animation Key frames.
   *  By default an animation does not have key frames. But you can
   *  define a complexe animation with key frames.
   *  <br />
   *  You have to define at least two key frames 'from' and 'to'.
   *  Other frames are define as percentage value of the animation.
   *  <p />
   *  @example
   *  var translate = new vs.fx.TranslateAnimation (130, 150);
   *
   *  translate.addKeyFrame ('from', {x:0, y: 0, z:0});
   *  translate.addKeyFrame (20, {x:50, y: 0, z: 0});
   *  translate.addKeyFrame (40, {x:50, y: 50, z: 0});
   *
   *  @example
   *  var translate = new vs.fx.GLAnimation (['translateY','100px'],['opacity', '0']);
   *
   *  translate.addKeyFrame ('from', ['0px', '1']);
   *  translate.addKeyFrame (20, ['50px', '1']);
   *  translate.addKeyFrame (40, ['80px', '1']);
   *
   * @name vs.fx.GLAnimation#addKeyFrame
   * @function
   * @param {number} pos The percentage value of animation
   * @param {Object | Array} values the object containing values for
   *         the animation
   */
  addKeyFrame : function (pos, datas)
  {
    var traj, property, values, i, value, index = 0;
    
    if (!datas) { return; }
    if (!util.isNumber (pos) || pos < 0 || pos > 1) { return; }
    
    function updateValues (values, pos, data) {
      var i = 0, l = values.length, value;
      
      for (; i < l; i++) {
        value = values[i];
        if (value[0] === pos) {
          value[1] = data;
          return;
        }
      }
      
      values.push ([pos, data]);
      values.sort (function(a, b) {return a[0] - b[0];});
    }
    
    
    for (property in this._trajectories) {
      traj = this._trajectories [property];      
      updateValues (traj._values, pos, datas [index++]);
    }
  },

  /**
   *  Use this function for animate your graphic object.
   *  <p>
   *  You can set a callback function that will be call at the end of animation.
   *  Associated to the callback you can defined a runtime context. This context
   *  could be a object.
   *
   *  @example
   *  obj.prototype.endAnimation = function (event)
   *  { ... }
   *
   *  obj.prototype.animate = function ()
   *  {
   *    myAnimation.process (a_gui_object, this.endAnimation, this);
   *  }
   *
   * @name vs.fx.GLAnimation#process
   * @function
   * @param {vs.fx.View} comp The component the view will be animated
   * @param {Function} clb an optional callback to call at the end of animation
   * @param {Object} ctx an optional execution context associated to the
   *          callback
   * @param {boolean} now an optional parameter use to apply a animation without
   *          delay or duration. It useful for configuring the initial position
   *          of UI component.
   * @return {String} return the identifier of the animation process. You can
   *       use it to stop the animation for instance.
   */
  process : function (comp, clb, ctx, now)
  {
    return procesAnimation (comp, this, clb, ctx, now);
  },
};
util.extendClass (GLAnimation, core.Task);


/*************************************************************
                Timing Function
*************************************************************/



/**
 * The ease timing function
 * Equivalent to cubic-bezier(0.25, 0.1, 0.25, 1.0)
 * @name vs.fx.GLAnimation.EASE
 * @const
 */
GLAnimation.EASE = generateCubicBezierFunction (0.25, 0.1, 0.25, 1.0);

/**
 * The linear timing function
 * Equivalent to cubic-bezier(0.0, 0.0, 1.0, 1.0)
 * @name vs.fx.GLAnimation.LINEAR
 * @const
 */
GLAnimation.LINEAR = function (pos) { return pos; };

/**
 * The ease in timing function
 * Equivalent to cubic-bezier(0.42, 0, 1.0, 1.0)
 * @name vs.fx.GLAnimation.EASE_IN
 * @const
 */
GLAnimation.EASE_IN = generateCubicBezierFunction (0.42, 0.0, 1.0, 1.0);

/**
 * The ease out timing function
 * Equivalent to cubic-bezier(0, 0, 0.58, 1.0)
 * @name vs.fx.GLAnimation.EASE_OUT
 * @const
 */
GLAnimation.EASE_OUT = generateCubicBezierFunction (0.0, 0.0, 0.58, 1.0);

/**
 * The ease in out timing function
 * Equivalent to cubic-bezier(0.42, 0, 0.58, 1.0)
 * @name vs.fx.GLAnimation.EASE_IN_OUT
 * @const
 */
GLAnimation.EASE_IN_OUT = generateCubicBezierFunction (0.42, 0.0, 0.58, 1.0);

/**
 * The ease in out timing function
 * Equivalent to cubic-bezier(0.42, 0, 0.58, 1.0)
 * @name vs.fx.GLAnimation.EASE_IN_OUT
 * @const
 */
GLAnimation.EASE_OUT_IN = generateCubicBezierFunction (0.0, 0.42, 1.0, 0.58);

GLAnimation.DEFAULT_DURATION = 300;
GLAnimation.DEFAULT_TIMING = GLAnimation.EASE;

/**
 *  Default parameters for createTransition
 *
 *  @private
 **/
var AnimationDefaultOption = {
  duration: GLAnimation.DEFAULT_DURATION,
  timing: GLAnimation.DEFAULT_TIMING,
  begin: 0,
  steps: 0,
  repeat: 1
}


/********************************************************************
                      Export
*********************************************************************/
/** @private */
vs.fx.GLAnimation = GLAnimation;






// fx.cancelAnimation = cancelAnimation;
// fx.TranslateAnimation = TranslateAnimation;
// fx.RotateAnimation = RotateAnimation;
// fx.RotateXYZAnimation = RotateXYZAnimation;
// fx.ScaleAnimation = ScaleAnimation;
// fx.SkewAnimation = SkewAnimation;
// fx.OpacityAnimation = OpacityAnimation;

var TrajectoriesData = function () {
  this._data = [];
}

TrajectoriesData.prototype.add = function (obj, property, trajectory) {
  this._data.push ([obj, property, trajectory]);
};

TrajectoriesData.prototype.compute = function (tick) {
  var l = this._data.length, data;
  
  while (l--) {
    data = this._data [l];
    data[0] [data[1]] = data[2].compute (tick);
  }
};


var Trajectory = function () {
  this._values = null;
}

/**
 * compute
 * @protected
 *
 * @name vs.ext.fx.Trajectory#compute
 * @function
 */
Trajectory.prototype.compute = function () {
  return false;
};

function getValuesIndex (values, t, operation) {
  var l = values.length, i, value_s, value_e, d;
  
  if (t <= 0) return values [0][1];
  if (t >= 1) return values [l - 1][1];
  
  value_s = values [0];
  for (i = 1; i < l; i++) {
    value_e = values [i];
    if (t >= value_e [0]) {
      value_s = value_e;
    }
    else {
      d = (t - value_s[0]) / (value_e[0] - value_s[0]);
      return operation (value_s[1], value_e[1], d);
    }
  }
}

var Vector1D = function (values) {
  Trajectory.call (this);  
  this._values = values;
}
util.extendClass (Vector1D, Trajectory);
  
Vector1D.prototype.compute = function (tick) {
//  if (!vs.util.isNumber (tick)) return false;

  var
    nb_values = this._values.length - 1, // int [0, n]
    ti = tick * nb_values, // float [0, n]
    index = ti | 0, // int [0, n]
    d = ti - index, // float [0, 1]
    out = getValuesIndex (this._values, tick, function (v1, v2, d) {
      return v1 + (v2 - v1) * d;
    });
    
  return out;
};

var Vector2D = function (values) {
  Trajectory.call (this);  
  this._values = values;
  this.out = new glMatrixArrayType (2);
}
util.extendClass (Vector2D, Trajectory);
  
Vector2D.prototype.compute = function (tick)
{
//  if (!vs.util.isNumber (tick)) return false;
  
  var
    values = this._values,
    nb_values = values.length - 1, // int [0, n]
    ti = tick * nb_values, // float [0, n]
    index = ti | 0, // int [0, n]
    d = ti - index, // float [0, 1]
    out = this.out,
    result = getValuesIndex (values, tick, function (v1, v2, d) {
      out[0] = v1[0] + (v2[0] - v1[0]) * d;
      out[1] = v1[1] + (v2[1] - v1[1]) * d;
      
      return out;
    });
    
  if (result !== out) {
    out[0] = result[0];
    out[1] = result[1];
  }

  return out;
};

var Vector3D = function (values) {
  Trajectory.call (this);  
  this._values = values;
  this.out = new glMatrixArrayType (3);
}
util.extendClass (Vector3D, Trajectory);
  
Vector3D.prototype.compute = function (tick)
{
//  if (!vs.util.isNumber (tick)) return false;
  
  var
    values = this._values,
    nb_values = values.length - 1, // int [0, n]
    ti = tick * nb_values, // float [0, n]
    index = ti | 0, // int [0, n]
    d = ti - index, // float [0, 1]
    out = this.out,
    result = getValuesIndex (values, tick, function (v1, v2, d) {
      out[0] = v1[0] + (v2[0] - v1[0]) * d;
      out[1] = v1[1] + (v2[1] - v1[1]) * d;
      out[2] = v1[2] + (v2[2] - v1[2]) * d;
      
      return out;
    });
    
  if (result !== out) {
    out[0] = result[0];
    out[1] = result[1];
    out[2] = result[2];
  }

  return out;
};


var Chronometer = function (params) {
  this._state = vs.core.Task.STOPPED;
  
  if (params.duration) this._duration = params.duration;
  if (params.begin) this._begin = params.begin;
//  if (params.steps) this._steps = params.steps;
  if (params.repeat) this._repeat = params.repeat;
  
  this.__timings__ = [];
}

Chronometer.prototype = {
  /** @protected */
  _duration: 300,
  /** @protected */
  _begin: 0,
  /** @protected */
//  _steps: 0,
  /** @protected */
  _repeat: 1,
  /** @protected */
  _tick: 0,
  /** @protected */
  __time_decl: 0,
  /** @protected */
  __pause_time: 0,
  /** @protected */
  __end_time: 0,
  /** @protected */
  __timings__: null,
  
  /**
   *  Starts the task
   *
   * @name vs.core.Task#start
   * @function
   *
   * @param {any} param any parameter (scalar, Array, Object)
   */
  start: function (param)
  {
    if (this._state === vs.core.Task.STARTED) return;

    // schedule a chronometer cycle
    function _start ()
    {
      this._start_clock ();
//       if (this._steps === 0) this._start_clock ();
//       else this._start_steps ();
    }
    
    this.__param = param;

    if (this._state === vs.core.Task.STOPPED)
    {
      var begin = this._begin || 0;
      this.__time_decl = 0;
      this.__pause_time = 0;
      
      var now = performance.now ();
    
      // manage delayed chronometer
      if (begin > 0)
      {
        vs.scheduleAction (_start.bind (this), begin);

        this.__time_decl = 0;
        this.__repeat_dur = this._repeat;
        this._begin = 0;
        this.__timings__.unshift (now + begin);
        for (var i = 0; i < this.__repeat_dur; i++) {
          this.__timings__.unshift (now + this._duration * (i + 1) + begin);
        }
        return;
      }
    
      // manage ended chronometer before started
      if (-begin > this._repeat * this._duration)
      {
        this.stop ();
        return;
      }
    
      this.__time_decl = -begin % this._duration;
      var r_dec = (-begin / this._duration) | 0;
       
      this.__repeat_dur = this._repeat - r_dec;

      this.__timings__.unshift (now - this.__time_decl);
      for (var i = 0; i < this.__repeat_dur; i++) {
        this.__timings__.unshift (now + this._duration * (i + 1) - this.__time_decl);
      }
    }
    
    _start.call (this);

    if (this.delegate && this.delegate.taskDidStart) {
      try {
        this.delegate.taskDidStart (this);
      }
      catch (e) {
        if (e.stack) console.log (e.stack)
        console.error (e);
      }
    }
  },
  
  /**
   * @function
   * @private
   */
  _clock : function (currTime)
  {
    if (this._state !== vs.core.Task.STARTED) return;

    if (currTime >= this.__end_time)
    {
      this._tick = 1;
      if (this.__clb) this.__clb (this._tick);
      if (this.__repeat_dur > 1)
      {
        this.__repeat_dur --;
        // schedule a new chronometer cycle
        this._start_clock ();
      }
      else
      {
        this._state = vs.core.Task.STOPPED;
        if (this.__clb_end) this.__clb_end ();
      }
    }
    else {
      // schedule a new tick
      this._tick = (currTime - this.__start_time) / this._duration;
      if (this._tick < 0) this._tick = 0;
      if (this._tick > 1) this._tick = 1;
      if (this.__clb) this.__clb (this._tick);
    }
  },

  /**
   * @function
   * @private
   */
  _start_clock: function ()
  {
//     if (this._state === vs.core.Task.PAUSED)
//     {
//       var pause_dur = currTime - this.__pause_time;
//       this.__start_time += pause_dur;
//       this.__end_time += pause_dur;
//       this._state = vs.core.Task.STARTED;
//       return;
//     }
    
    this.__start_time = this.__timings__ [this.__repeat_dur];
    this.__time_decl = 0;
    this.__end_time = this.__timings__ [this.__repeat_dur - 1];
    
    if (vs.util.isFunction (this.__param)) this.__clb = this.__param;

    this._state = vs.core.Task.STARTED;
    this._tick = 0;
    if (this.__clb) this.__clb (this._tick);
  },

  /**
   * @function
   * @private
   */
//   _step : function ()
//   {
//     if (this._state !== vs.core.Task.STARTED) return;
//     
//     var step = (this._steps - this.__steps)
//     this.__steps --;
// 
//     if (step === this._steps)
//     {
//       this._tick = 1;
//       if (this.__clb) this.__clb (this._tick);
//       if (this.__repeat_dur > 1)
//       {
//         this.__repeat_dur --;
//         this._start_steps ();
//       }
//       else
//       {
//         this._state = vs.core.Task.STOPPED;
//         if (this.__clb_end) this.__clb_end ();
//       }
//     }
//     else {
//       this._tick = step / (this._steps - 1);
//       if (this.__clb) this.__clb (this._tick);
//       var step_dur = this._duration / this._steps
//       vs.scheduleAction (this._step.bind (this), step_dur);
//     }
//   },
  
  /**
   * @function
   * @private
   */
//   _start_steps: function ()
//   {
//     // step chronometer implement a simplistic time management and pause.
//     if (this._state === vs.core.Task.PAUSED)
//     {
//       this._state = vs.core.Task.STARTED;
//       this._step ();
//       return;
//     }
// 
//     if (vs.util.isFunction (this.__param)) this.__clb = this.__param;
// 
//     this._state = vs.core.Task.STARTED;
//     this._tick = 0;
//     if (this.__clb) this.__clb (this._tick);
//     
//     var step_dur = this._duration / this._steps;
//     this.__steps = this._steps - 1 - Math.floor (this.__time_decl / step_dur);
//     this.__time_decl = 0;
//     
//     vs.scheduleAction (this._step.bind (this), step_dur);
//   },

  /**
   *  Stops the task.<br />
   *  When the task is stopped, it calls the TaskDelegate.taskDidStop
   *  if it declared.
   *
   * @name vs.core.Task#stop
   * @function
   */
  stop: function ()
  {
    this._state = vs.core.Task.STOPPED;
    this.__pause_time = 0;
    this.__timings__.length = 0;

    this._tick = 1;
    if (this.__clb) this.__clb (this._tick);

    if (this.delegate && this.delegate.taskDidEnd) {
      try {
        this.delegate.taskDidEnd (this);
      }
      catch (e) {
        if (e.stack) console.log (e.stack)
        console.error (e);
      }
    }
    if (this.__clb_end) this.__clb_end ();
  },

  /**
   *  Pause the task.<br />
   *  When the task is paused, it calls the TaskDelegate.taskDidPause
   *  if it declared.
   *
   * @name vs.core.Task#pause
   * @function
   */
  pause: function ()
  {
    if (!this._state === vs.core.Task.STARTED) return;
    this._state = vs.core.Task.PAUSED;
    this.__pause_time = performance.now ();
  }
};


/*************************************************************
                Predefined animation
*************************************************************/

/**
 *  Fade in an object.
 * @name vs.fx.GLAnimation.FadeIn
 *  @type vs.fx.GLAnimation
 */
var FadeIn = new GLAnimation (['opacity', 1]);
FadeIn.addKeyFrame (0, [0]);

/**
 *  Fade out an object.
 * @name vs.fx.GLAnimation.FadeOut
 *  @type vs.fx.GLAnimation
 */
var FadeOut = new GLAnimation (['opacity', 0]);
FadeOut.addKeyFrame (0, [1]);

var Bounce = new GLAnimation (['translation', [0,0]]);
Bounce.addKeyFrame (0, [[0,0]]);
Bounce.addKeyFrame (0.2, [[0,0]]);
Bounce.addKeyFrame (0.4, [[0,-30]]);
Bounce.addKeyFrame (0.5, [[0,0]]);
Bounce.addKeyFrame (0.6, [[0,-15]]);
Bounce.addKeyFrame (0.8, [[0,0]]);
Bounce.duration = 1000;

var Shake = new GLAnimation (['translation', [0,0]]);
Shake.addKeyFrame (0, [[0,0]]);
Shake.addKeyFrame (0.10, [[-10,0]]);
Shake.addKeyFrame (0.20, [[10,0]]);
Shake.addKeyFrame (0.30, [[-10,0]]);
Shake.addKeyFrame (0.40, [[10,0]]);
Shake.addKeyFrame (0.50, [[-10,0]]);
Shake.addKeyFrame (0.60, [[10,0]]);
Shake.addKeyFrame (0.70, [[-10,0]]);
Shake.addKeyFrame (0.80, [[10,0]]);
Shake.addKeyFrame (0.90, [[0,0]]);
Shake.duration = 1000;

/**
 *  Swing
 * @name vs.ext.GLAnimation.Swing
 *  @type vs.GLAnimation
 */
var Swing = new GLAnimation (['rotation', 0]);
Swing.addKeyFrame (0, [0]);
Swing.addKeyFrame (0.20, [15]);
Swing.addKeyFrame (0.40, [-10]);
Swing.addKeyFrame (0.60, [5]);
Swing.addKeyFrame (0.80, [-5]);
Swing.duration = 1000;
Swing.origin = [50, 0];

/**
 *  Slide a object to right.
 * @name vs.ext.GLAnimation.Pulse
 *  @type vs.GLAnimation
 */
var Pulse = new GLAnimation (['scaling', 1]);
Pulse.addKeyFrame (0, [1]);
Pulse.addKeyFrame (0.50, [1.1]);
Pulse.addKeyFrame (0.80, [0.97]);
Pulse.duration = 1000;

/**
 *  Slide a object to right.
 * @name vs.ext.GLAnimation.FlipInX
 *  @type vs.GLAnimation
 */
var FlipInX = new GLAnimation (['rotation', [0, 0, 0]], ['opacity', 1]);
FlipInX.addKeyFrame (0, [[90, 0, 0], 0]);
FlipInX.addKeyFrame (0.4, [[-10, 0, 0], 1]);
FlipInX.addKeyFrame (0.7, [[10, 0, 0], 1]);
FlipInX.duration = 500;


/**
 *  Slide a object to right.
 * @name vs.ext.GLAnimation.FlipOutX
 *  @type vs.GLAnimation
 */
var FlipOutX = new GLAnimation (['rotation', [90, 0, 0]], ['opacity', 0]);
FlipOutX.addKeyFrame (0, [[0,0,0],1]);
FlipOutX.duration = 500;

/**
 *  Slide a object to right.
 * @name vs.ext.GLAnimation.FlipInY
 *  @type vs.GLAnimation
 */
var FlipInY = new GLAnimation (['rotation', [0, 0, 0]], ['opacity', 1]);
FlipInY.addKeyFrame (0, [[0, 90, 0], 0]);
FlipInY.addKeyFrame (0.4, [[0, -10, 0], 1]);
FlipInY.addKeyFrame (0.7, [[0, 10, 0], 1]);
FlipInY.duration = 500;

/**
 *  Slide a object to right.
 * @name vs.ext.GLAnimation.FlipOutY
 *  @type vs.GLAnimation
 */
var FlipOutY = new GLAnimation (['rotation', [0, 90, 0]], ['opacity', 0]);
FlipOutY.addKeyFrame (0, [[0,0,0],1]);
FlipOutY.duration = 500;

/**
 *  Slide a object to right.
 * @name vs.ext.GLAnimation.FadeInUp
 *  @type vs.GLAnimation
 */
var FadeInUp = new GLAnimation (['translation', [0,0]], ['opacity', 1]);
FadeInUp.addKeyFrame (0, [[0, 20],0]);
FadeInUp.duration = 500;

/**
 *  Slide a object to right.
 * @name vs.ext.fx.Animation.FadeOutUp
 *  @type vs.GLAnimationGLAnimation
 */
var FadeOutUp = new GLAnimation (['translation', [0, -20]], ['opacity', 0]);
FadeOutUp.addKeyFrame (0, [[0,0],1]);
FadeOutUp.duration = 500;

/**
 *  Slide a object to right.
 * @name vs.ext.GLAnimation.FadeInDown
 *  @type vs.GLAnimation
 */
var FadeInDown = new GLAnimation (['translation', [0,0]], ['opacity', 1]);
FadeInDown.addKeyFrame (0, [[0, -20],0]);
FadeInDown.duration = 1000;

/**
 *  Slide a object to right.
 * @name vs.ext.GLAnimation.FadeOutDown
 *  @type vs.GLAnimation
 */
var FadeOutDown = new GLAnimation (['translation', [0, 20]], ['opacity', 0]);
FadeOutDown.addKeyFrame (0, [[0,0],1]);
FadeOutDown.duration = 300;

/**
 *  Slide a object to right.
 * @name vs.ext.GLAnimation.FadeInLeft
 *  @type vs.GLAnimation
 */
var FadeInLeft = new GLAnimation (['translation', [0,0]], ['opacity', 1]);
FadeInLeft.addKeyFrame (0, [[-20, 0],0]);
FadeInLeft.duration = 1000;

/**
 *  Slide a object to right.
 * @name vs.ext.GLAnimation.FadeOutLeft
 *  @type vs.GLAnimation
 */
var FadeOutLeft = new GLAnimation (['translation', [20, 0]], ['opacity', 0]);
FadeOutLeft.addKeyFrame (0, [[0,0],1]);
FadeOutLeft.duration = 1000;

/**
 *  Slide a object to right.
 * @name vs.ext.GLAnimation.FadeInLeft
 *  @type vs.GLAnimation
 */
var FadeInRight = new GLAnimation (['translation', [0,0]], ['opacity', 1]);
FadeInRight.addKeyFrame (0, [[20, 0],0]);
FadeInRight.duration = 1000;

/**
 *  Slide a object to right.
 * @name vs.ext.GLAnimation.FadeOutLeft
 *  @type vs.GLAnimation
 */
var FadeOutRight = new GLAnimation (['translation', [-20, 0]], ['opacity', 0]);
FadeOutRight.addKeyFrame (0, [[0,0],1]);
FadeOutRight.duration = 1000;

/********************************************************************
                      Export
*********************************************************************/
/** private */
util.extend (GLAnimation, {
  FadeIn:     FadeIn,
  FadeOut:    FadeOut,
  Bounce:     Bounce,
  Shake:      Shake,
  Swing:      Swing,
  Pulse:      Pulse,
  FlipInX:    FlipInX,
  FlipOutX:   FlipOutX,
  FlipInY:    FlipInY,
  FlipOutY:   FlipOutY,
  FadeInUp:    FadeInUp,
  FadeOutUp:   FadeOutUp,
  FadeInDown:    FadeInDown,
  FadeOutDown:   FadeOutDown,
  FadeInLeft:    FadeInLeft,
  FadeOutLeft:   FadeOutLeft,
  FadeInRight:    FadeInRight,
  FadeOutRight:   FadeOutRight
});

var rttFramebuffer;
var rttTexture;

function initPickBuffer()  {
  rttFramebuffer = gl_ctx.createFramebuffer();
  gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, rttFramebuffer);
  rttFramebuffer.width = frame_size [0] * gl_device_pixel_ratio;
  rttFramebuffer.height = frame_size [1] * gl_device_pixel_ratio;

  rttTexture = gl_ctx.createTexture();

  gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, rttTexture);
  gl_ctx.texImage2D (gl_ctx.TEXTURE_2D, 0, gl_ctx.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, gl_ctx.RGBA, gl_ctx.UNSIGNED_BYTE, null);

  function isPowerOfTwo (x) {
    return (x !== 0) && ((x & (x - 1)) === 0);
  }

  gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, rttTexture);
  gl_ctx.texImage2D (gl_ctx.TEXTURE_2D, 0, gl_ctx.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, gl_ctx.RGBA, gl_ctx.UNSIGNED_BYTE, null);

  // POT images
  if (isPowerOfTwo (frame_size [0] * gl_device_pixel_ratio) &&
      isPowerOfTwo (frame_size [1] * gl_device_pixel_ratio)) {
  
    gl_ctx.texParameteri
      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MAG_FILTER, gl_ctx.LINEAR);
    
    gl_ctx.texParameteri
      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.NEAREST_MIPMAP_LINEAR);

    gl_ctx.generateMipmap (gl_ctx.TEXTURE_2D);
  }
  // NPOT images
  else {
    //gl_ctx.NEAREST is also allowed, instead of gl_ctx.LINEAR, as neither mipmap.
    gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.LINEAR);
    //Prevents s-coordinate wrapping (repeating).
    gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_S, gl_ctx.CLAMP_TO_EDGE);
    //Prevents t-coordinate wrapping (repeating).
    gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_T, gl_ctx.CLAMP_TO_EDGE);
  }

  var renderbuffer = gl_ctx.createRenderbuffer();
  gl_ctx.bindRenderbuffer(gl_ctx.RENDERBUFFER, renderbuffer);
  gl_ctx.renderbufferStorage(gl_ctx.RENDERBUFFER, gl_ctx.DEPTH_COMPONENT16, rttFramebuffer.width, rttFramebuffer.height);

  gl_ctx.framebufferTexture2D(gl_ctx.FRAMEBUFFER, gl_ctx.COLOR_ATTACHMENT0, gl_ctx.TEXTURE_2D, rttTexture, 0);
  gl_ctx.framebufferRenderbuffer(gl_ctx.FRAMEBUFFER, gl_ctx.DEPTH_ATTACHMENT, gl_ctx.RENDERBUFFER, renderbuffer);

  gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, null);
  gl_ctx.bindRenderbuffer(gl_ctx.RENDERBUFFER, null);
  gl_ctx.bindFramebuffer(gl_ctx.FRAMEBUFFER, null);
}

function pickUp (event) {
  if (!window.render_ui) return;
  
  if (!event) return;
  
  var x = event.clientX;
  var y = event.clientY;
  
  if (vs.util.isUndefined (x) || vs.util.isUndefined (y)) {
    var list = event.targetPointerList;
    if (!list) list = event.targetTouches;
    if (!list) list = event.touches;
    
    if (!list || list.length === 0) return;
    
    var touch = list[0];
    x = touch.clientX;
    y = touch.clientY;
  }
  
  return _pickUp (x * gl_device_pixel_ratio, y * gl_device_pixel_ratio);
}

var pickUp_pixelColor = new Uint8Array (4);
function _pickUp (x, y) {
  
  DropTick = 1;

  gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, rttFramebuffer);

  // Clear GL Surface
  gl_ctx.clearColor(0.0, 0.0, 0.0, 1.0);

  render_ui (performance.now (), 1);
  
  y = frame_size[1] * gl_device_pixel_ratio - y;

  // Read Pixel Color
  gl_ctx.readPixels(x, y,1,1,gl_ctx.RGBA,gl_ctx.UNSIGNED_BYTE, pickUp_pixelColor);
                  
  // Return GL Clear To User Colors
  gl_ctx.clearColor (0, 0, 0, 1);
        
  gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, null);
  
  function getGLIDfromColor (pickUp_pixelColor) {
    return pickUp_pixelColor [0] + pickUp_pixelColor [1] * 256 + pickUp_pixelColor [2] * 65536;
  }
  var gl_id = getGLIDfromColor (pickUp_pixelColor)

  return GL_VIEWS [gl_id];
}

var __pointer_start_activated = 0;
function __gl_activate_pointer_start () {
  if (__pointer_start_activated === 0) {
    GL_CANVAS.addEventListener (POINTER_START, pointer_start);
  }
  __pointer_start_activated ++;
}

function __gl_deactivate_pointer_start () {
  if (__pointer_start_activated === 0) return;
  if (__pointer_start_activated === 1) {
    GL_CANVAS.removeEventListener (POINTER_START, pointer_start);
  }
  
  __pointer_start_activated --;
}

var __pointer_move_activated = 0;
function __gl_activate_pointer_move () {
  if (__pointer_move_activated === 0) {
    GL_CANVAS.addEventListener (POINTER_MOVE, pointer_move);
  }
  __pointer_move_activated ++;
}

function __gl_deactivate_pointer_move () {
  if (__pointer_move_activated === 0) return;
  if (__pointer_move_activated === 1) {
    GL_CANVAS.removeEventListener (POINTER_MOVE, pointer_move);
  }
  
  __pointer_move_activated --;
}

var __pointer_end_activated = 0;
function __gl_activate_pointer_end () {
  if (__pointer_end_activated === 0) {
    GL_CANVAS.addEventListener (POINTER_END, pointer_end);
  }
  __pointer_end_activated ++;
}

function __gl_deactivate_pointer_end () {
  if (__pointer_end_activated === 0) return;
  if (__pointer_end_activated === 1) {
    GL_CANVAS.removeEventListener (POINTER_END, pointer_end);
  }
  
  __pointer_end_activated --;
}


function pointer_start (event) {
  var obj = pickUp (event);
  if (obj) {
    dispatch_event (POINTER_START, obj, event);
  }
}

function pointer_move (event) {
  var obj = pickUp (event);
  if (obj) {
    dispatch_event (POINTER_MOVE, obj, event);
  }
}

function pointer_end (event) {
  var obj = pickUp (event);
  if (obj) {
    dispatch_event (POINTER_END, obj, event);
  }
}/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

/**
 * This is the constructor for new PointerEvents.
 *
 * New Pointer Events must be given a type, and an optional dictionary of
 * initialization properties.
 *
 * Due to certain platform requirements, events returned from the constructor
 * identify as MouseEvents.
 *
 * @constructor
 * @param {String} inType The type of the event to create.
 * @param {Object} [inDict] An optional dictionary of initial event properties.
 * @return {Event} A new PointerEvent of type `inType` and initialized with properties from `inDict`.
 */

var MOUSE_PROPS = [
  'bubbles',
  'cancelable',
  'view',
  'detail',
  'screenX',
  'screenY',
  'clientX',
  'clientY',
  'ctrlKey',
  'altKey',
  'shiftKey',
  'metaKey',
  'button',
  'relatedTarget',
  'pageX',
  'pageY'
];

var MOUSE_DEFAULTS = [
  false,
  false,
  null,
  null,
  0,
  0,
  0,
  0,
  false,
  false,
  false,
  false,
  0,
  null,
  0,
  0
];

function GLEvent () {
  this.path = [];
}

GLEvent.prototype.init = function (type, bubbles, cancelable) {
  this.bubbles = bubbles || false;
  this.cancelBubble = false;
  this.cancelable = cancelable || false;
  this.clipboardData = undefined;
  this.currentTarget = null;
  this.defaultPrevented = false;
  this.eventPhase = 0;
  this.path.length = 0;
  this.returnValue = true;
  this.srcElement = null;
  this.target = null;
  this.timeStamp = Date.now ();
  this.type = type || '';
}

GLEvent.prototype.setSrcElement = function (src) {
  this.srcElement = src;
  this.target = src;
  
  // legacy code
  this.currentTarget = src;

  while (src) {
    this.path.push (src);
    src = src.__parent;
  }
}

GLEvent.prototype.setTarget = function (src) {
  this.target = src;
  
  // legacy code
  this.currentTarget = src;
}

GLEvent.prototype.preventDefault = function () {
  this.defaultPrevented = true;
}

function GLPointerEvent (inType, inDict, src) {
  GLEvent.call (this);

  this.pointerList = [];
  this.targetPointerList = [];
  this.changedPointerList = [];
  
  // define the properties of the PointerEvent interface
  this.init (inType, inDict, src);
}
util.extendClass (GLPointerEvent, GLEvent);

var defaultInDict = Object.create (null);

GLPointerEvent.prototype.init = function (inType, inDict, src) {
  inDict = inDict || defaultInDict;
  
  GLEvent.prototype.init.call (
    this,
    inType,
    inDict.bubbles || false,
    inDict.cancelable || false
  );

  var e = this, i = 0, length_props = MOUSE_PROPS.length, prop;
  
  e.setSrcElement (src);
  e.setTarget (src);
  
  // define inherited MouseEvent properties
  for (; i < length_props; i++) {
    prop = MOUSE_PROPS [i];
    e [prop] = inDict [prop] || MOUSE_DEFAULTS [i];
  }
  e.buttons = inDict.buttons || 0;

  // Spec requires that pointers without pressure specified use 0.5 for down
  // state and 0 for up state.
  var pressure = 0;
  if (inDict.pressure) {
    pressure = inDict.pressure;
  } else {
    pressure = e.buttons ? 0.5 : 0;
  }

  // add x/y properties aliased to clientX/Y
  e.x = e.clientX;
  e.y = e.clientY;

  // define the properties of the PointerEvent interface
  e.pointerId = inDict.pointerId || 0;
  e.width = inDict.width || 0;
  e.height = inDict.height || 0;
  e.pressure = pressure;
  e.tiltX = inDict.tiltX || 0;
  e.tiltY = inDict.tiltY || 0;
  e.pointerType = inDict.pointerType || '';
  e.hwTimestamp = inDict.hwTimestamp || 0;
  e.isPrimary = inDict.isPrimary || false;
  
  e.nbPointers = 0;
  e.pointerList.length = 0;
  e.targetPointerList.length = 0;
  e.changedPointerList.length = 0;
};

GLPointerEvent.prototype.setSrcElement = function (src) {
  GLEvent.prototype.setSrcElement.call (this, src);

  function updatePointerList (list) {
    var i = 0, l = list.length, pointer;
    
    for (; i < l; i++) {
      pointer = list [i];      
      pointer.srcElement = src;
    }
  }
  
  updatePointerList (this.pointerList);
  updatePointerList (this.targetPointerList);
  updatePointerList (this.changedPointerList);
}

GLPointerEvent.prototype.setTarget = function (src) {
  GLEvent.prototype.setTarget.call (this, src);
  
  function updatePointerList (list) {
    var i = 0, l = list.length, pointer;
    
    for (; i < l; i++) {
      pointer = list [i];
      
      pointer.target = src;
      pointer.currentTarget = src;
    }
  }
  
  updatePointerList (this.pointerList);
  updatePointerList (this.targetPointerList);
  updatePointerList (this.changedPointerList);
}

function Pointer (identifier)
{
  this.identifier = identifier;
}

Pointer.prototype.configure =
  function (event, srcElement, target, clientX, clientY)
{
  this.pageX = event.pageX;
  this.pageY = event.pageY;
  if (clientX !== undefined) this.clientX = clientX;
  else this.clientX = event.clientX;
  if (clientY !== undefined) this.clientY = clientY;
  else this.clientY = event.clientY;
  
  if (srcElement) this.srcElement = srcElement;
  else this.srcElement = event.srcElement;
  
  if (target) this.target = target;
  else this.target = event.target;
  
  // Legacy property
  if (target) this.currentTarget = target;
  else this.currentTarget = event.currentTarget;
}

Pointer._pointers = [];
Pointer.getPointer = function (identifier) {
  var pointer = Pointer._pointers [identifier];
  
  if (!pointer) {
    pointer = new Pointer (identifier);
    Pointer._pointers [identifier] = pointer;
  }
  
  return pointer;
}

/**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/* touch event messages */

function setupMousePointerEvent () {

  POINTER_START = 'mousedown';
  POINTER_MOVE = 'mousemove';
  POINTER_END = 'mouseup';
  POINTER_CANCEL = null;

  // TODO(smus): Come up with a better solution for this. This is bad because
  // it might conflict with a touch ID. However, giving negative IDs is also
  // bad because of code that makes assumptions about touch identifiers being
  // positive integers.
  var MOUSE_ID = 31337;
  
  var mouse_event = new GLPointerEvent ();

  function buildMouseList (type, evt, obj)
  {
    mouse_event.init (type, evt, obj);
        
    var
      pointers = mouse_event.targetPointerList,
      pointer = Pointer.getPointer (MOUSE_ID);
      
    pointer.configure (mouse_event, obj, obj, PointerTypes.MOUSE);
    pointers.push (pointer);
    
    if (type === POINTER_END || type == POINTER_CANCEL) {
      mouse_event.nbPointers = 1;
      mouse_event.changedPointerList = pointers;
    }
    else {
      mouse_event.nbPointers = 0;
      mouse_event.pointerList = pointers;
    }

    return mouse_event;
  }

  buildEvent = buildMouseList;
}


/**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

function setupTouchEvent () {

  POINTER_START = 'touchstart';
  POINTER_MOVE = 'touchmove';
  POINTER_END = 'touchend';
  POINTER_CANCEL = 'touchcancel';

  /**
   * Returns an array of all pointers currently on the screen.
   */

  var pointerEvents = [];
  
  var pointer_event = new GLPointerEvent ();

  function buildTouchList (type, evt, obj, target_id)
  {
    var e = pointer_event, touch, pointer;
    e.init (type, evt, obj);
    
    e.nbPointers = evt.touches.length;
    
    var pointers = e.pointerList;
    for (var i = 0; i < e.nbPointers; i++)
    {
      touch = evt.touches[i];
      
      pointer = Pointer.getPointer (touch.identifier);
      pointer.configure (touch, obj, obj, PointerTypes.TOUCH);
      
      pointers.push (pointer);
    }

    pointers = e.targetPointerList;
    for (var i = 0; i < evt.targetTouches.length; i++)
    {
      touch = evt.targetTouches[i];
      if (target_id && pointerEvents [touch.identifier] != target_id) continue;

      pointer = Pointer.getPointer (touch.identifier);
      pointer.configure (touch, obj, obj, PointerTypes.TOUCH);

      pointers.push (pointer);
    }

    pointers = e.changedPointerList;
    for (var i = 0; i < evt.changedTouches.length; i++)
    {
      touch = evt.changedTouches[i];

      pointer = Pointer.getPointer (touch.identifier);
      pointer.configure (touch, obj, obj, PointerTypes.TOUCH);

      pointers.push (pointer);
    }

    return e;
  }

/*************** Touch event handlers *****************/


/*************************************************************/

  buildEvent = buildTouchList;
}
/**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/* touch event messages */
var EVENT_SUPPORT_TOUCH = false;
var EVENT_SUPPORT_GESTURE = false;
var hasPointer = window.navigator.pointerEnabled;
var hasMSPointer = window.navigator.msPointerEnabled;

if (typeof document != "undefined" && 'createTouch' in document)
  EVENT_SUPPORT_TOUCH = true;

else if (hasPointer || hasMSPointer) { EVENT_SUPPORT_TOUCH = true; }

else if (typeof document != "undefined" &&
    window.navigator && window.navigator.userAgent)
{
  if (window.navigator.userAgent.indexOf ('Android') !== -1 ||
      window.navigator.userAgent.indexOf ('BlackBerry') !== -1)
  { EVENT_SUPPORT_TOUCH = true; }
}

var PointerTypes = {
  TOUCH: 2,
  PEN: 3,
  MOUSE: 4
};

var POINTER_START, POINTER_MOVE, POINTER_END, POINTER_CANCEL, buildEvent;

if (EVENT_SUPPORT_TOUCH) setupTouchEvent ();
//else if (EVENT_SUPPORT_TOUCH && hasMSPointer) setupMSEvent ();
else setupMousePointerEvent ();

function getBindingIndex (target, type, listener)
{
  if (!type || !listener || !listener.__event_listeners) return -1;
  for (var i = 0; i < listener.__event_listeners.length; i++)
  {
    var binding = listener.__event_listeners [i];
    if (binding.target === target &&
        binding.type === type &&
        binding.listener === listener)
      return i;
  }
  return -1;
}

/**
 * Option 2: Replace addEventListener with a custom version.
 */
function addPointerListener (node, type, listener, useCapture)
{
  if (!type) return;
  
  if (!listener) {
    console.error ("addPointerListener no listener");
    return;
  }
  var func = listener;
  if (!util.isFunction (listener))
  {
    func = listener.handleEvent;
    if (util.isFunction (func)) func = func.bind (listener);
  }

  if (getBindingIndex (node, type, listener) !== -1)
  {
    console.error ("addPointerListener binding already existing");
    return;
  }

  if (!listener.__event_listeners) listener.__event_listeners = [];

  var binding = {
    target: node,
    type: type,
    listener: listener
  };
  listener.__event_listeners.push (binding);

  binding.handler = func;
  if (node instanceof GLView) {
    node.addEventListener (type, binding.handler, useCapture);
  }
  else if (node instanceof Document) {
    binding.doc_handler = function (event) {
      var e = buildEvent (type, event, node);
      if (vs.util.isFunction (binding.handler)) {
        binding.handler.call (node, e);
      }
      else if (vs.util.isFunction (binding.handler.handleEvent)) {
        binding.handler.handleEvent.call (binding.handler, e);
      }
    };
    node.addEventListener (type, binding.doc_handler, useCapture);
  }
}

function removePointerListener (node, type, listener, useCapture)
{
  if (!type) return;
  
  if (!listener) {
    console.error ("removePointerListener no listener");
    return;
  }

  var index = getBindingIndex (node, type, listener);
  if (index === -1)
  {
    console.error ("removePointerListener no binding");
    return;
  }
  var binding = listener.__event_listeners [index];
  listener.__event_listeners.remove (index);

  if (node instanceof GLView) {
    node.removeEventListener (type, binding.handler, useCapture);
  }
  else if (node instanceof Document) {
    node.removeEventListener (type, binding.doc_handler, useCapture);
  }
  delete (binding);
}

function _dispatch_event (obj, list, e) {
  e.currentTarget = obj;
  
  list.forEach (function (handler) {
    if (vs.util.isFunction (handler)) {
      handler.call (obj, e);
    }
    else if (vs.util.isFunction (handler.handleEvent)) {
      handler.handleEvent.call (handler, e);
    }
  });
}

function dispatch_event (type, obj, event) {
  var event_type;
  
  if (type === POINTER_START) event_type = "_pointer_start";
  else if (type === POINTER_MOVE) event_type = "_pointer_move";
  else if (type === POINTER_END || type === POINTER_END) event_type = "_pointer_end";

  var e = buildEvent (type, event, obj);
  var path = e.path, list;
  for (i = 0; i < path.length; i ++) {
    obj = path [i];
    list = obj[event_type];
    if (list && list.length) {
      e.setTarget (obj);
      _dispatch_event (obj, list, e);
    }
  }
}

/********************************************************************
                      Export
*********************************************************************/
vs.removePointerListener = removePointerListener;
vs.addPointerListener = addPointerListener;
vs.PointerTypes = PointerTypes;

/** 
 * Start pointer event (mousedown, touchstart, )
 * @name vs.POINTER_START
 * @type {String}
 * @const
 */ 
vs.POINTER_START = POINTER_START;

/** 
 * Move pointer event (mousemove, touchmove, )
 * @name vs.POINTER_MOVE 
 * @type {String}
 * @const
 */ 
vs.POINTER_MOVE = POINTER_MOVE;

/** 
 * End pointer event (mouseup, touchend, )
 * @name vs.POINTER_END 
 * @type {String}
 * @const
 */ 
vs.POINTER_END = POINTER_END;

/** 
 * Cancel pointer event (mouseup, touchcancel, )
 * @name vs.POINTER_CANCEL 
 * @type {String}
 * @const
 */ 
vs.POINTER_CANCEL = POINTER_CANCEL;
/*
  Copyright (C) 2009-2013. David Thevenin, ViniSketch (c), and
  IGEL Co., Ltd. All rights reserved

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/


/**
 *  The vs.ui.DragRecognizer class
 *
 *  @extends vs.ui.PointerRecognizer
 *
 *  @class
 *  vs.ui.DragRecognizer is a concrete subclass of vs.ui.PointerRecognizer
 *  that looks for drag gestures. When the user moves
 *  the fingers, the underlying view should translate in a corresponding
 *  direction and speed...<br />
 *
 *  The DragRecognizer delegate has to implement following methods:
 *  <ul>
 *    <li /> didDragStart (event, comp). Call when the drag start.
 *    <li /> didDragEnd (event, comp). Call when the drag end.
 *    <li /> didDrag (drag_info, event, comp). Call when the element is dragged.
 *      drag_info = {dx: dx, dy:dy}, the drag delta form the beginning.
 *  </ul>
 *  <p>
 *
 *  @example
 *  var my_view = new vs.ui.View ({id: "my_view"}).init ();
 *  var recognizer = new DragRecognizer ({
 *    didDrag : function (drag_info, event) {
 *      my_view.translation = [drag_info.dx, drag_info.dy];
 *    },
 *    didDragEnd : function (event) {
 *      // save drag translation
 *      my_view.flushTransformStack ();
 *    }
 *  });
 *  my_view.addPointerRecognizer (recognizer);
 *
 *  @author David Thevenin
 *
 *  @constructor
 *   Creates a new vs.ui.DragRecognizer.
 *
 * @name vs.ui.DragRecognizer
 *
 * @param {ReconizerDelegate} delegate the delegate [mandatory]
 */
function DragRecognizer (delegate) {
  this.parent = vs.ui.PointerRecognizer;
  this.parent (delegate);
  this.constructor = DragRecognizer;     
}

DragRecognizer.prototype = {

  __is_dragged: false,
  
  /**
   * @name vs.ui.DragRecognizer#init
   * @function
   * @protected
   */
  init : function (obj) {
    vs.ui.PointerRecognizer.prototype.init.call (this, obj);
    
    this.addPointerListener (this.obj, core.POINTER_START, this.obj);
    this.reset ();
  },

  /**
   * @name vs.ui.DragRecognizer#uninit
   * @function
   * @protected
   */
  uninit : function () {
    this.removePointerListener (this.obj, core.POINTER_START, this.obj);
  },

  /**
   * @name vs.ui.DragRecognizer#pointerStart
   * @function
   * @protected
   */
  pointerStart: function (e) {
    if (this.__is_dragged) { return; }
    // prevent multi touch events
    if (!e.targetPointerList || e.targetPointerList.length > 1) { return; }

    var pointer = e.targetPointerList [0];

    this.__start_x = pointer.pageX;
    this.__start_y = pointer.pageY;
    this.__pointer_id = pointer.identifier;
    this.__is_dragged = true;

    this.addPointerListener (document, core.POINTER_END, this.obj);
    this.addPointerListener (document, core.POINTER_MOVE, this.obj);
  
    try {
      if (this.delegate && this.delegate.didDragStart)
        this.delegate.didDragStart (e.targetPointerList[0].target, e);
    } catch (exp) {
      if (exp.stack) console.log (exp.stack);
      console.log (exp);
    }
    return false;
  },

  /**
   * @name vs.ui.DragRecognizer#pointerMove
   * @function
   * @protected
   */
  pointerMove: function (e) {
    if (!this.__is_dragged) { return; }

    var i = 0, l = e.targetPointerList.length, pointer, dx, dy;
    for (; i < l; i++) {
      pointer = e.targetPointerList [i];
      if (pointer.identifier === this.__pointer_id) { break; }
      pointer = null;
    }
    if (!pointer) { return; }

    dx = pointer.pageX - this.__start_x;
    dy = pointer.pageY - this.__start_y;
    
    try {
      if (this.delegate && this.delegate.didDrag)
        this.delegate.didDrag ({dx: dx, dy:dy}, e.targetPointerList[0].target, e);
    } catch (exp) {
      if (exp.stack) console.log (exp.stack);
      console.log (exp);
    }
  },

  /**
   * @name vs.ui.DragRecognizer#pointerEnd
   * @function
   * @protected
   */
  pointerEnd: function (e) {
    if (!this.__is_dragged) { return; }

    var i = 0, l = e.changedPointerList.length, pointer, dx, dy;
    for (; i < l; i++) {
      pointer = e.changedPointerList [i];
      if (pointer.identifier === this.__pointer_id) { break; }
      pointer = null;
    }
    if (!pointer) { return; }

    this.__is_dragged = false;
    this.__start_x = undefined;
    this.__start_y = undefined;
    this.__pointer_id = undefined;
  
    this.removePointerListener (document, core.POINTER_END, this.obj);
    this.removePointerListener (document, core.POINTER_MOVE, this.obj);

    try {
      if (this.delegate && this.delegate.didDragEnd)
        this.delegate.didDragEnd (e.changedPointerList[0].target, e);
    } catch (exp) {
      if (exp.stack) console.log (exp.stack);
      console.log (exp);
    }
  },

  /**
   * @name vs.ui.DragRecognizer#pointerCancel
   * @function
   * @protected
   */
  pointerCancel: function (e) {
    return this.pointerEnd (e);
  }
};
vs.util.extendClass (DragRecognizer, vs.ui.PointerRecognizer);

/********************************************************************
                      Export
*********************************************************************/
/** @private */
vs.ui.DragRecognizer = DragRecognizer;/*
  Copyright (C) 2009-2013. David Thevenin, ViniSketch (c), and
  IGEL Co., Ltd. All rights reserved

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/


/**
 *  The vs.ui.PinchRecognizer class
 *
 *  @extends vs.ui.PointerRecognizer
 *
 *  @class
 *  The vs.ui.PinchRecognizer is a concrete subclass of vs.ui.PointerRecognizer
 *  that looks for pinching gestures involving two touches. When the user moves
 *  the two fingers toward each other, the conventional meaning is zoom-out;<br />
 *  when the user moves the two fingers away from each other, the conventional
 *  meaning is zoom-in<br />
 *
 *  The PinchRecognizer delegate has to implement following methods:
 *  <ul>
 *    <li /> didPinchChange (scale, event, comp). Call when the element is pinched.
 *      scale is The scale factor relative to the points of the two touches
 *      in screen coordinates
 *    <li /> didPinchStart (event, comp). Call when the pinch start
 *    <li /> didPinchEnd (event, comp). Call when the pinch end
 *  </ul>
 *  <p>
 *
 *  @example
 *  var my_view = new vs.ui.View ({id: "my_view"}).init ();
 *  var recognizer = new PinchRecognizer ({
 *    didPinchChange : function (scale, event) {
 *      my_view.scaling = scale;
 *    },
 *    didPinchStart : function (event) {
 *      xxx
 *    },
 *    didPinchEnd : function (event) {
 *      mss
 *    }
 *  });
 *  my_view.addPointerRecognizer (recognizer);
 *
 *  @author David Thevenin
 *
 *  @constructor
 *   Creates a new vs.ui.PinchRecognizer.
 *
 * @name vs.ui.PinchRecognizer
 *
 * @param {ReconizerDelegate} delegate the delegate [mandatory]
 */
function PinchRecognizer (delegate) {
  this.parent = vs.ui.PointerRecognizer;
  this.parent (delegate);
  this.constructor = PinchRecognizer;
}

PinchRecognizer.prototype = {

  /**
   * @name vs.ui.PinchRecognizer#init
   * @function
   * @protected
   */
  init : function (obj) {
    vs.ui.PointerRecognizer.prototype.init.call (this, obj);
    
    this.addPointerListener (this.obj, core.GESTURE_START, this.obj);
    this.reset ();
  },

  /**
   * @name vs.ui.PinchRecognizer#uninit
   * @function
   * @protected
   */
  uninit : function () {
    this.removePointerListener (this.obj, core.GESTURE_START, this.obj);
  },

  /**
   * @name vs.ui.PinchRecognizer#gestureStart
   * @function
   * @protected
   */
  gestureStart: function (e) {
    this.addPointerListener (document, core.GESTURE_CHANGE, this.obj);
    this.addPointerListener (document, core.GESTURE_END, this.obj);

    try {
      if (this.delegate && this.delegate.didPinchStart)
        this.delegate.didPinchStart (
          event.targetPointerList[0].target, event
        );
    } catch (e) {
      if (e.stack) console.log (e.stack);
      console.log (e);
    }
    return false;
  },

  /**
   * @name vs.ui.PinchRecognizer#gestureChange
   * @function
   * @protected
   */
  gestureChange: function (event) {
    try {
      if (this.delegate && this.delegate.didPinchChange)
        this.delegate.didPinchChange (
          event.scale, event.targetPointerList[0].target, event
        );
    } catch (e) {
      if (e.stack) console.log (e.stack);
      console.log (e);
    }
  },

  /**
   * @name vs.ui.PinchRecognizer#gestureEnd
   * @function
   * @protected
   */
  gestureEnd: function (e) {
    this.removePointerListener (document, core.GESTURE_CHANGE, this.obj);
    this.removePointerListener (document, core.GESTURE_END, this.obj);
    
    try {
      if (this.delegate && this.delegate.didPinchEnd)
        this.delegate.didPinchEnd (event.targetPointerList[0].target, event);
    } catch (e) {
      if (e.stack) console.log (e.stack);
      console.log (e);
    }
  },

  /**
   * @name vs.ui.PinchRecognizer#pointerCancel
   * @function
   * @protected
   */
  pointerCancel: function (e) {
    return this.pointerEnd (e);
  }
};
vs.util.extendClass (PinchRecognizer, vs.ui.PointerRecognizer);

/********************************************************************
                      Export
*********************************************************************/
/** @private */
vs.ui.PinchRecognizer = PinchRecognizer;/*
  Copyright (C) 2009-2013. David Thevenin, ViniSketch (c), and
  IGEL Co., Ltd. All rights reserved

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/


/**
 *  The vs.ui.RotationRecognizer class
 *
 *  @extends vs.ui.PointerRecognizer
 *
 *  @class
 *  vs.ui.RotationRecognizer is a concrete subclass of vs.ui.PointerRecognizer
 *  that looks for rotation gestures involving two touches. When the user moves
 *  the fingers opposite each other in a circular motion, the underlying view
 *  should rotate in a corresponding direction and speed...<br />
 *
 *  The RotationRecognizer delegate has to implement following methods:
 *  <ul>
 *    <li /> didRotationChange (rotation, event). Call when the element is rotated.
 *      rotation The rotation of the gesture in degrees.
 *    <li /> didRotationStart (event). Call when the rotation start
 *    <li /> didRotationEnd (event). Call when the rotation end
 *  </ul>
 *  <p>
 *
 *  @example
 *  var my_view = new vs.ui.View ({id: "my_view"}).init ();
 *  var recognizer = new RotationRecognizer ({
 *    didRotationChange : function (rotation, event) {
 *      my_view.rotation = rotation;
 *    }
 *  });
 *  my_view.addPointerRecognizer (recognizer);
 *
 *  @author David Thevenin
 *
 *  @constructor
 *   Creates a new vs.ui.RotationRecognizer.
 *
 * @name vs.ui.RotationRecognizer
 *
 * @param {ReconizerDelegate} delegate the delegate [mandatory]
 */
function RotationRecognizer (delegate) {
  this.parent = vs.ui.PointerRecognizer;
  this.parent (delegate);
  this.constructor = RotationRecognizer;
}

RotationRecognizer.prototype = {

  /**
   * @name vs.ui.RotationRecognizer#init
   * @function
   * @protected
   */
  init : function (obj) {
    vs.ui.PointerRecognizer.prototype.init.call (this, obj);
    
    this.addPointerListener (this.obj, core.GESTURE_START, this.obj);
    this.reset ();
  },

  /**
   * @name vs.ui.RotationRecognizer#uninit
   * @function
   * @protected
   */
  uninit : function () {
    this.removePointerListener (this.obj, core.GESTURE_START, this.obj);
  },

  /**
   * @name vs.ui.RotationRecognizer#gestureStart
   * @function
   * @protected
   */
  gestureStart: function (e) {
    this.addPointerListener (document, core.GESTURE_CHANGE, this.obj);
    this.addPointerListener (document, core.GESTURE_END, this.obj);

    try {
      if (this.delegate && this.delegate.didRotationStart)
        this.delegate.didRotationStart (event);
    } catch (e) {
      if (e.stack) console.log (e.stack);
      console.log (e);
    }

    return false;
  },

  /**
   * @name vs.ui.RotationRecognizer#gestureChange
   * @function
   * @protected
   */
  gestureChange: function (event) {
    try {
      if (this.delegate && this.delegate.didRotationChange)
        this.delegate.didRotationChange (event.rotation, event);
    } catch (e) {
      if (e.stack) console.log (e.stack);
      console.log (e);
    }
  },

  /**
   * @name vs.ui.RotationRecognizer#gestureEnd
   * @function
   * @protected
   */
  gestureEnd: function (e) {
    this.removePointerListener (document, core.GESTURE_CHANGE, this.obj);
    this.removePointerListener (document, core.GESTURE_END, this.obj);

    try {
      if (this.delegate && this.delegate.didRotationEnd)
        this.delegate.didRotationEnd (event);
    } catch (e) {
      if (e.stack) console.log (e.stack);
      console.log (e);
    }
  },

  /**
   * @name vs.ui.RotationRecognizer#pointerCancel
   * @function
   * @protected
   */
  pointerCancel: function (e) {
    return this.pointerEnd (e);
  }
};
vs.util.extendClass (RotationRecognizer, vs.ui.PointerRecognizer);

/********************************************************************
                      Export
*********************************************************************/
/** @private */
vs.ui.RotationRecognizer = RotationRecognizer;/*
  Copyright (C) 2009-2013. David Thevenin, ViniSketch (c), and
  IGEL Co., Ltd. All rights reserved

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

/**
 *  The vs.ui.TapRecognizer class
 *
 *  @extends vs.ui.PointerRecognizer
 *
 *  @class
 *  vs.ui.TapRecognizer is a concrete subclass of vs.ui.PointerRecognizer that
 *  looks for single or multiple taps/clicks.<br />
 *
 *  The TapRecognizer delegate has to implement following methods:
 *  <ul>
 *    <li /> didTouch (comp, target, event). Call when the element is touched; It useful to
 *      implement this method to implement a feedback on the event (for instance
 *      add a pressed class)
 *    <li /> didUntouch (comp, target, event). Call when the element is untouched; It useful to
 *      implement this method to implement a feedback on the event (for instance
 *      remove a pressed class)
 *    <li /> didTap (nb_tap, comp, target, event). Call when the element si tap/click. nb_tap
 *      is the number of tap/click.
 *  </ul>
 *  <p>
 *
 *  @example
 *  var my_view = new vs.ui.View ({id: "my_view"}).init ();
 *  var recognizer = new TapRecognizer ({
 *    didTouch : function (comp) {
 *      comp.addClassName ("pressed");
 *    },
 *    didUntouch : function (comp) {
 *      comp.removeClassName ("pressed");
 *    },
 *    didTap : function (nb_tap, view) {
 *      comp.view.hide ();
 *    }
 *  });
 *  my_view.addPointerRecognizer (recognizer);
 *
 *  @author David Thevenin
 *
 *  @constructor
 *   Creates a new vs.ui.TapRecognizer.
 *
 * @name vs.ui.TapRecognizer
 *
 * @param {ReconizerDelegate} delegate the delegate [mandatory]
 */
function TapRecognizer (delegate) {
  this.parent = vs.ui.PointerRecognizer;
  this.parent (delegate);
  this.constructor = TapRecognizer;
}

var MULTI_TAP_DELAY = 100;

TapRecognizer.prototype = {

  __is_touched: false,
  __unselect_time_out: 0,
  __unselect_clb: null,
  __did_tap_time_out: 0,
  __tap_mode: 0,

  /**
   * @name vs.ui.TapRecognizer#init
   * @function
   * @protected
   */
  init : function (obj) {
    vs.ui.PointerRecognizer.prototype.init.call (this, obj);
    
    this.addPointerListener (this.obj, core.POINTER_START, this.obj);
    this.reset ();
  },

  /**
   * @name vs.ui.TapRecognizer#uninit
   * @function
   * @protected
   */
  uninit : function () {
    this.removePointerListener (this.obj, core.POINTER_START, this.obj);
  },

  /**
   * @name vs.ui.TapRecognizer#pointerStart
   * @function
   * @protected
   */
  pointerStart: function (e) {
    if (this.__is_touched) { return; }
    // prevent multi touch events
    if (e.targetPointerList.length === 0 || e.nbPointers > 1) { return; }
    
    if (this.__tap_mode === 0) {
      this.__tap_mode = 1;
    }

    if (this.__unselect_time_out) {
      clearTimeout (this.__unselect_time_out);
      this.__unselect_time_out = 0;
      if (this.__unselect_clb) this.__unselect_clb ();
    }

    this.__tap_elem = e.targetPointerList[0].target;

    try {
      if (this.delegate && this.delegate.didTouch)
        this.delegate.didTouch (this.__tap_elem, e);
    } catch (exp) {
      if (exp.stack) console.log (exp.stack);
      console.log (exp);
    }

    if (this.__did_tap_time_out) {
      this.__tap_mode ++;
      clearTimeout (this.__did_tap_time_out);
      this.__did_tap_time_out = 0;
    }
  
    this.addPointerListener (document, core.POINTER_END, this.obj);
    this.addPointerListener (document, core.POINTER_MOVE, this.obj);
  
    this.__start_x = e.targetPointerList[0].pageX;
    this.__start_y = e.targetPointerList[0].pageY;
    this.__is_touched = true;
  
    return false;
  },

  /**
   * @name vs.ui.TapRecognizer#pointerMove
   * @function
   * @protected
   */
  pointerMove: function (e) {
    // do not manage event for other targets
    if (!this.__is_touched || e.targetPointerList.length === 0) { return; }

    var dx = e.targetPointerList[0].pageX - this.__start_x;
    var dy = e.targetPointerList[0].pageY - this.__start_y;
    
    if (Math.abs (dx) + Math.abs (dy) < vs.ui.View.MOVE_THRESHOLD) {
      // we still in selection mode
      return false;
    }

    // cancel the selection mode
    this.removePointerListener (document, core.POINTER_END, this.obj);
    this.removePointerListener (document, core.POINTER_MOVE, this.obj);
    this.__is_touched = false;

    try {
      if (this.delegate && this.delegate.didUntouch)
        this.delegate.didUntouch (this.__tap_elem, e);
    } catch (exp) {
      if (exp.stack) console.log (exp.stack);
      console.log (exp);
    }
  },

  /**
   * @name vs.ui.TapRecognizer#init
   * @function
   * @protected
   */
  pointerEnd: function (e) {
    if (!this.__is_touched) { return; }
    this.__is_touched = false;
    var
      self = this,
      target = self.__tap_elem,
      comp = (target)?target._comp_:null;
    
    self.__tap_elem = undefined;
  
    this.removePointerListener (document, core.POINTER_END, this.obj);
    this.removePointerListener (document, core.POINTER_MOVE, this.obj);

    if (this.delegate && this.delegate.didUntouch) {
      this.__unselect_clb = function () {
        try {
          self.delegate.didUntouch (target, e);
        } catch (exp) {
          if (exp.stack) console.log (exp.stack);
          console.log (exp);
        }
        self.__unselect_time_out = 0;
        delete (self.__unselect_clb);
      }
      this.__unselect_time_out = setTimeout (this.__unselect_clb, vs.ui.View.UNSELECT_DELAY);        
    }
    
    if (this.delegate && this.delegate.didTap) {
      this.__did_tap_time_out = setTimeout (function () {
        try {
          self.delegate.didTap (self.__tap_mode, target, e);
        } catch (exp) {
          if (exp.stack) console.log (exp.stack);
          console.log (exp);
        }
        self.__tap_mode = 0;
        self.__did_tap_time_out = 0;
      }, MULTI_TAP_DELAY);
    } else {
      self.__tap_mode = 0;
    }
  },

  /**
   * @name vs.ui.TapRecognizer#pointerCancel
   * @function
   * @protected
   */
  pointerCancel: function (e) {
    return this.pointerEnd (e);
  }
};
vs.util.extendClass (TapRecognizer, vs.ui.PointerRecognizer);

/********************************************************************
                      Export
*********************************************************************/
/** @private */
vs.ui.TapRecognizer = TapRecognizer;
/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
window.CustomElements = window.CustomElements || {flags:{}};
/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope){

// bootstrap parsing
function bootstrap() {
  // parse document
  CustomElements.parser.parse(document);
  // one more pass before register is 'live'
  CustomElements.upgradeDocument(document);
  // choose async
  var async = window.Platform && Platform.endOfMicrotask ? 
    Platform.endOfMicrotask :
    vs.scheduleAction;
  async(function() {
    // set internal 'ready' flag, now document.registerElement will trigger 
    // synchronous upgrades
    CustomElements.ready = true;
    // capture blunt profiling data
    CustomElements.readyTime = Date.now();
    if (window.HTMLImports) {
      CustomElements.elapsed = CustomElements.readyTime - HTMLImports.readyTime;
    }
    // notify the system that we are bootstrapped
    document.dispatchEvent(
      new CustomEvent('WebComponentsReady', {bubbles: true})
    );

    // install upgrade hook if HTMLImports are available
    if (window.HTMLImports) {
      HTMLImports.__importsParsingHook = function(elt) {
        CustomElements.parser.parse(elt.import);
      }
    }
  });
}

// CustomEvent shim for IE
if (typeof window.CustomEvent !== 'function') {
  window.CustomEvent = function(inType) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(inType, true, true);
    return e;
  };
}

// When loading at readyState complete time (or via flag), boot custom elements
// immediately.
// If relevant, HTMLImports must already be loaded.
if (document.readyState === 'complete' || scope.flags.eager) {
  bootstrap();
// When loading at readyState interactive time, bootstrap only if HTMLImports
// are not pending. Also avoid IE as the semantics of this state are unreliable.
} else if (document.readyState === 'interactive' && !window.attachEvent &&
    (!window.HTMLImports || window.HTMLImports.ready)) {
  bootstrap();
// When loading at other readyStates, wait for the appropriate DOM event to 
// bootstrap.
} else {
  var loadEvent = window.HTMLImports && !HTMLImports.ready ?
      'HTMLImportsLoaded' : 'DOMContentLoaded';
  window.addEventListener(loadEvent, bootstrap);
}

})(window.CustomElements);/*
Copyright 2013 The Polymer Authors. All rights reserved.
Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file.
*/

(function(scope){

var logFlags = window.logFlags || {};
var IMPORT_LINK_TYPE = window.HTMLImports ? HTMLImports.IMPORT_LINK_TYPE : 'none';

// walk the subtree rooted at node, applying 'find(element, data)' function
// to each element
// if 'find' returns true for 'element', do not search element's subtree
function findAll(node, find, data) {
  var e = node.firstElementChild;
  if (!e) {
    e = node.firstChild;
    while (e && e.nodeType !== Node.ELEMENT_NODE) {
      e = e.nextSibling;
    }
  }
  while (e) {
    if (find(e, data) !== true) {
      findAll(e, find, data);
    }
    e = e.nextElementSibling;
  }
  return null;
}

// walk all shadowRoots on a given node.
function forRoots(node, cb) {
  var root = node.shadowRoot;
  while(root) {
    forSubtree(root, cb);
    root = root.olderShadowRoot;
  }
}

// walk the subtree rooted at node, including descent into shadow-roots,
// applying 'cb' to each element
function forSubtree(node, cb) {
  //logFlags.dom && node.childNodes && node.childNodes.length && console.group('subTree: ', node);
  findAll(node, function(e) {
    if (cb(e)) {
      return true;
    }
    forRoots(e, cb);
  });
  forRoots(node, cb);
  //logFlags.dom && node.childNodes && node.childNodes.length && console.groupEnd();
}

// manage lifecycle on added node
function added(node) {
  if (upgrade(node)) {
    insertedNode(node);
    return true;
  }
  inserted(node);
}

// manage lifecycle on added node's subtree only
function addedSubtree(node) {
  forSubtree(node, function(e) {
    if (added(e)) {
      return true;
    }
  });
}

// manage lifecycle on added node and it's subtree
function addedNode(node) {
  return added(node) || addedSubtree(node);
}

// upgrade custom elements at node, if applicable
function upgrade(node) {
  if (!node.__upgraded__ && node.nodeType === Node.ELEMENT_NODE) {
    var type = node.getAttribute('is') || node.localName;
    var definition = scope.registry[type];
    if (definition) {
      logFlags.dom && console.group('upgrade:', node.localName);
      scope.upgrade(node);
      logFlags.dom && console.groupEnd();
      return true;
    }
  }
}

function insertedNode(node) {
  inserted(node);
  if (inDocument(node)) {
    forSubtree(node, function(e) {
      inserted(e);
    });
  }
}


// TODO(sorvell): on platforms without MutationObserver, mutations may not be 
// reliable and therefore attached/detached are not reliable.
// To make these callbacks less likely to fail, we defer all inserts and removes
// to give a chance for elements to be inserted into dom. 
// This ensures attachedCallback fires for elements that are created and 
// immediately added to dom.
var hasPolyfillMutations = (!window.MutationObserver ||
    (window.MutationObserver === window.JsMutationObserver));
scope.hasPolyfillMutations = hasPolyfillMutations;

var isPendingMutations = false;
var pendingMutations = [];
function deferMutation(fn) {
  pendingMutations.push(fn);
  if (!isPendingMutations) {
    isPendingMutations = true;
    var async = (window.Platform && window.Platform.endOfMicrotask) ||
        vs.scheduleAction;
    async(takeMutations);
  }
}

function takeMutations() {
  isPendingMutations = false;
  var $p = pendingMutations;
  for (var i=0, l=$p.length, p; (i<l) && (p=$p[i]); i++) {
    p();
  }
  pendingMutations = [];
}

function inserted(element) {
  if (hasPolyfillMutations) {
    deferMutation(function() {
      _inserted(element);
    });
  } else {
    _inserted(element);
  }
}

// TODO(sjmiles): if there are descents into trees that can never have inDocument(*) true, fix this
function _inserted(element) {
  // TODO(sjmiles): it's possible we were inserted and removed in the space
  // of one microtask, in which case we won't be 'inDocument' here
  // But there are other cases where we are testing for inserted without
  // specific knowledge of mutations, and must test 'inDocument' to determine
  // whether to call inserted
  // If we can factor these cases into separate code paths we can have
  // better diagnostics.
  // TODO(sjmiles): when logging, do work on all custom elements so we can
  // track behavior even when callbacks not defined
  //console.log('inserted: ', element.localName);
  if (element.attachedCallback || element.detachedCallback || (element.__upgraded__ && logFlags.dom)) {
    logFlags.dom && console.group('inserted:', element.localName);
    if (inDocument(element)) {
      element.__inserted = (element.__inserted || 0) + 1;
      // if we are in a 'removed' state, bluntly adjust to an 'inserted' state
      if (element.__inserted < 1) {
        element.__inserted = 1;
      }
      // if we are 'over inserted', squelch the callback
      if (element.__inserted > 1) {
        logFlags.dom && console.warn('inserted:', element.localName,
          'insert/remove count:', element.__inserted)
      } else if (element.attachedCallback) {
        logFlags.dom && console.log('inserted:', element.localName);
        element.attachedCallback();
      }
    }
    logFlags.dom && console.groupEnd();
  }
}

function removedNode(node) {
  removed(node);
  forSubtree(node, function(e) {
    removed(e);
  });
}


function removed(element) {
  if (hasPolyfillMutations) {
    deferMutation(function() {
      _removed(element);
    });
  } else {
    _removed(element);
  }
}

function _removed(element) {
  // TODO(sjmiles): temporary: do work on all custom elements so we can track
  // behavior even when callbacks not defined
  if (element.attachedCallback || element.detachedCallback || (element.__upgraded__ && logFlags.dom)) {
    logFlags.dom && console.group('removed:', element.localName);
    if (!inDocument(element)) {
      element.__inserted = (element.__inserted || 0) - 1;
      // if we are in a 'inserted' state, bluntly adjust to an 'removed' state
      if (element.__inserted > 0) {
        element.__inserted = 0;
      }
      // if we are 'over removed', squelch the callback
      if (element.__inserted < 0) {
        logFlags.dom && console.warn('removed:', element.localName,
            'insert/remove count:', element.__inserted)
      } else if (element.detachedCallback) {
        element.detachedCallback();
      }
    }
    logFlags.dom && console.groupEnd();
  }
}

// SD polyfill intrustion due mainly to the fact that 'document'
// is not entirely wrapped
function wrapIfNeeded(node) {
  return window.ShadowDOMPolyfill ? ShadowDOMPolyfill.wrapIfNeeded(node)
      : node;
}

function inDocument(element) {
  var p = element;
  var doc = wrapIfNeeded(document);
  while (p) {
    if (p == doc) {
      return true;
    }
    p = p.parentNode || p.host;
  }
}

function watchShadow(node) {
  if (node.shadowRoot && !node.shadowRoot.__watched) {
    logFlags.dom && console.log('watching shadow-root for: ', node.localName);
    // watch all unwatched roots...
    var root = node.shadowRoot;
    while (root) {
      watchRoot(root);
      root = root.olderShadowRoot;
    }
  }
}

function watchRoot(root) {
  if (!root.__watched) {
    observe(root);
    root.__watched = true;
  }
}

function handler(mutations) {
  //
  if (logFlags.dom) {
    var mx = mutations[0];
    if (mx && mx.type === 'childList' && mx.addedNodes) {
        if (mx.addedNodes) {
          var d = mx.addedNodes[0];
          while (d && d !== document && !d.host) {
            d = d.parentNode;
          }
          var u = d && (d.URL || d._URL || (d.host && d.host.localName)) || '';
          u = u.split('/?').shift().split('/').pop();
        }
    }
    console.group('mutations (%d) [%s]', mutations.length, u || '');
  }
  //
  mutations.forEach(function(mx) {
    //logFlags.dom && console.group('mutation');
    if (mx.type === 'childList') {
      forEach(mx.addedNodes, function(n) {
        //logFlags.dom && console.log(n.localName);
        if (!n.localName) {
          return;
        }
        // nodes added may need lifecycle management
        addedNode(n);
      });
      // removed nodes may need lifecycle management
      forEach(mx.removedNodes, function(n) {
        //logFlags.dom && console.log(n.localName);
        if (!n.localName) {
          return;
        }
        removedNode(n);
      });
    }
    //logFlags.dom && console.groupEnd();
  });
  logFlags.dom && console.groupEnd();
};

var observer = new MutationObserver(handler);

function takeRecords() {
  // TODO(sjmiles): ask Raf why we have to call handler ourselves
  handler(observer.takeRecords());
  takeMutations();
}

var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);

function observe(inRoot) {
  observer.observe(inRoot, {childList: true, subtree: true});
}

function observeDocument(doc) {
  observe(doc);
}

function upgradeDocument(doc) {
  logFlags.dom && console.group('upgradeDocument: ', (doc.baseURI).split('/').pop());
  addedNode(doc);
  logFlags.dom && console.groupEnd();
}

function upgradeDocumentTree(doc) {
  doc = wrapIfNeeded(doc);
  upgradeDocument(doc);
  //console.log('upgradeDocumentTree: ', (doc.baseURI).split('/').pop());
  // upgrade contained imported documents
  var imports = doc.querySelectorAll('link[rel=' + IMPORT_LINK_TYPE + ']');
  for (var i=0, l=imports.length, n; (i<l) && (n=imports[i]); i++) {
    if (n.import && n.import.__parsed) {
      upgradeDocumentTree(n.import);
    }
  }
}

// exports
scope.IMPORT_LINK_TYPE = IMPORT_LINK_TYPE;
scope.watchShadow = watchShadow;
scope.upgradeDocumentTree = upgradeDocumentTree;
scope.upgradeAll = addedNode;
scope.upgradeSubtree = addedSubtree;

scope.observeDocument = observeDocument;
scope.upgradeDocument = upgradeDocument;

scope.takeRecords = takeRecords;

})(window.CustomElements);
/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

// import

var IMPORT_LINK_TYPE = scope.IMPORT_LINK_TYPE;

// highlander object for parsing a document tree

var parser = {
  selectors: [
    'link[rel=' + IMPORT_LINK_TYPE + ']'
  ],
  map: {
    link: 'parseLink'
  },
  parse: function(inDocument) {
    if (!inDocument.__parsed) {
      // only parse once
      inDocument.__parsed = true;
      // all parsable elements in inDocument (depth-first pre-order traversal)
      var elts = inDocument.querySelectorAll(parser.selectors);
      // for each parsable node type, call the mapped parsing method
      forEach(elts, function(e) {
        parser[parser.map[e.localName]](e);
      });
      // upgrade all upgradeable static elements, anything dynamically
      // created should be caught by observer
      CustomElements.upgradeDocument(inDocument);
      // observe document for dom changes
      CustomElements.observeDocument(inDocument);
    }
  },
  parseLink: function(linkElt) {
    // imports
    if (isDocumentLink(linkElt)) {
      this.parseImport(linkElt);
    }
  },
  parseImport: function(linkElt) {
    if (linkElt.import) {
      parser.parse(linkElt.import);
    }
  }
};

function isDocumentLink(inElt) {
  return (inElt.localName === 'link'
      && inElt.getAttribute('rel') === IMPORT_LINK_TYPE);
}

var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);

// exports

scope.parser = parser;
scope.IMPORT_LINK_TYPE = IMPORT_LINK_TYPE;

})(window.CustomElements);
/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

/**
 * Implements `document.register`
 * @module CustomElements
*/

/**
 * Polyfilled extensions to the `document` object.
 * @class Document
*/

(function(scope) {

// imports

if (!scope) {
  scope = window.CustomElements = {flags:{}};
}
var flags = scope.flags;

// native document.registerElement?

var hasNative = Boolean(document.registerElement);
// TODO(sorvell): See https://github.com/Polymer/polymer/issues/399
// we'll address this by defaulting to CE polyfill in the presence of the SD
// polyfill. This will avoid spamming excess attached/detached callbacks.
// If there is a compelling need to run CE native with SD polyfill, 
// we'll need to fix this issue.
var useNative = !flags.register && hasNative && !window.ShadowDOMPolyfill;

if (useNative) {

  // stub
  var nop = function() {};

  // exports
  scope.registry = {};
  scope.upgradeElement = nop;
  
  scope.watchShadow = nop;
  scope.upgrade = nop;
  scope.upgradeAll = nop;
  scope.upgradeSubtree = nop;
  scope.observeDocument = nop;
  scope.upgradeDocument = nop;
  scope.upgradeDocumentTree = nop;
  scope.takeRecords = nop;

} else {

  /**
   * Registers a custom tag name with the document.
   *
   * When a registered element is created, a `readyCallback` method is called
   * in the scope of the element. The `readyCallback` method can be specified on
   * either `options.prototype` or `options.lifecycle` with the latter taking
   * precedence.
   *
   * @method register
   * @param {String} name The tag name to register. Must include a dash ('-'),
   *    for example 'x-component'.
   * @param {Object} options
   *    @param {String} [options.extends]
   *      (_off spec_) Tag name of an element to extend (or blank for a new
   *      element). This parameter is not part of the specification, but instead
   *      is a hint for the polyfill because the extendee is difficult to infer.
   *      Remember that the input prototype must chain to the extended element's
   *      prototype (or HTMLElement.prototype) regardless of the value of
   *      `extends`.
   *    @param {Object} options.prototype The prototype to use for the new
   *      element. The prototype must inherit from HTMLElement.
   *    @param {Object} [options.lifecycle]
   *      Callbacks that fire at important phases in the life of the custom
   *      element.
   *
   * @example
   *      FancyButton = document.registerElement("fancy-button", {
   *        extends: 'button',
   *        prototype: Object.create(HTMLButtonElement.prototype, {
   *          readyCallback: {
   *            value: function() {
   *              console.log("a fancy-button was created",
   *            }
   *          }
   *        })
   *      });
   * @return {Function} Constructor for the newly registered type.
   */
  function register(name, options) {
    //console.warn('document.registerElement("' + name + '", ', options, ')');
    // construct a defintion out of options
    // TODO(sjmiles): probably should clone options instead of mutating it
    var definition = options || {};
    if (!name) {
      // TODO(sjmiles): replace with more appropriate error (EricB can probably
      // offer guidance)
      throw new Error('document.registerElement: first argument `name` must not be empty');
    }
    if (name.indexOf('-') < 0) {
      // TODO(sjmiles): replace with more appropriate error (EricB can probably
      // offer guidance)
      throw new Error('document.registerElement: first argument (\'name\') must contain a dash (\'-\'). Argument provided was \'' + String(name) + '\'.');
    }
    // elements may only be registered once
    if (getRegisteredDefinition(name)) {
      throw new Error('DuplicateDefinitionError: a type with name \'' + String(name) + '\' is already registered');
    }
    // must have a prototype, default to an extension of HTMLElement
    // TODO(sjmiles): probably should throw if no prototype, check spec
    if (!definition.prototype) {
      // TODO(sjmiles): replace with more appropriate error (EricB can probably
      // offer guidance)
      throw new Error('Options missing required prototype property');
    }
    // record name
    definition.__name = name.toLowerCase();
    // ensure a lifecycle object so we don't have to null test it
    definition.lifecycle = definition.lifecycle || {};
    // build a list of ancestral custom elements (for native base detection)
    // TODO(sjmiles): we used to need to store this, but current code only
    // uses it in 'resolveTagName': it should probably be inlined
    definition.ancestry = ancestry(definition.extends);
    // extensions of native specializations of HTMLElement require localName
    // to remain native, and use secondary 'is' specifier for extension type
    resolveTagName(definition);
    // some platforms require modifications to the user-supplied prototype
    // chain
    resolvePrototypeChain(definition);
    // overrides to implement attributeChanged callback
    overrideAttributeApi(definition.prototype);
    // 7.1.5: Register the DEFINITION with DOCUMENT
    registerDefinition(definition.__name, definition);
    // 7.1.7. Run custom element constructor generation algorithm with PROTOTYPE
    // 7.1.8. Return the output of the previous step.
    definition.ctor = generateConstructor(definition);
    definition.ctor.prototype = definition.prototype;
    // force our .constructor to be our actual constructor
    definition.prototype.constructor = definition.ctor;
    // if initial parsing is complete
    if (scope.ready) {
      // upgrade any pre-existing nodes of this type
      scope.upgradeDocumentTree(document);
    }
    return definition.ctor;
  }

  function ancestry(extnds) {
    var extendee = getRegisteredDefinition(extnds);
    if (extendee) {
      return ancestry(extendee.extends).concat([extendee]);
    }
    return [];
  }

  function resolveTagName(definition) {
    // if we are explicitly extending something, that thing is our
    // baseTag, unless it represents a custom component
    var baseTag = definition.extends;
    // if our ancestry includes custom components, we only have a
    // baseTag if one of them does
    for (var i=0, a; (a=definition.ancestry[i]); i++) {
      baseTag = a.is && a.tag;
    }
    // our tag is our baseTag, if it exists, and otherwise just our name
    definition.tag = baseTag || definition.__name;
    if (baseTag) {
      // if there is a base tag, use secondary 'is' specifier
      definition.is = definition.__name;
    }
  }

  function resolvePrototypeChain(definition) {
    // if we don't support __proto__ we need to locate the native level
    // prototype for precise mixing in
    if (!Object.__proto__) {
      // default prototype
      var nativePrototype = HTMLElement.prototype;
      // work out prototype when using type-extension
      if (definition.is) {
        var inst = document.createElement(definition.tag);
        nativePrototype = Object.getPrototypeOf(inst);
      }
      // ensure __proto__ reference is installed at each point on the prototype
      // chain.
      // NOTE: On platforms without __proto__, a mixin strategy is used instead
      // of prototype swizzling. In this case, this generated __proto__ provides
      // limited support for prototype traversal.
      var proto = definition.prototype, ancestor;
      while (proto && (proto !== nativePrototype)) {
        var ancestor = Object.getPrototypeOf(proto);
        proto.__proto__ = ancestor;
        proto = ancestor;
      }
    }
    // cache this in case of mixin
    definition.native = nativePrototype;
  }

  // SECTION 4

  function instantiate(definition) {
    // 4.a.1. Create a new object that implements PROTOTYPE
    // 4.a.2. Let ELEMENT by this new object
    //
    // the custom element instantiation algorithm must also ensure that the
    // output is a valid DOM element with the proper wrapper in place.
    //
    return upgrade(domCreateElement(definition.tag), definition);
  }

  function upgrade(element, definition) {
    // some definitions specify an 'is' attribute
    if (definition.is) {
      element.setAttribute('is', definition.is);
    }
    // remove 'unresolved' attr, which is a standin for :unresolved.
    element.removeAttribute('unresolved');
    // make 'element' implement definition.prototype
    implement(element, definition);
    // flag as upgraded
    element.__upgraded__ = true;
    // lifecycle management
    created(element);
    // there should never be a shadow root on element at this point
    // we require child nodes be upgraded before `created`
    scope.upgradeSubtree(element);
    // OUTPUT
    return element;
  }

  function implement(element, definition) {
    // prototype swizzling is best
    if (Object.__proto__) {
      element.__proto__ = definition.prototype;
    } else {
      // where above we can re-acquire inPrototype via
      // getPrototypeOf(Element), we cannot do so when
      // we use mixin, so we install a magic reference
      customMixin(element, definition.prototype, definition.native);
      element.__proto__ = definition.prototype;
    }
  }

  function customMixin(inTarget, inSrc, inNative) {
    // TODO(sjmiles): 'used' allows us to only copy the 'youngest' version of
    // any property. This set should be precalculated. We also need to
    // consider this for supporting 'super'.
    var used = {};
    // start with inSrc
    var p = inSrc;
    // sometimes the default is HTMLUnknownElement.prototype instead of
    // HTMLElement.prototype, so we add a test
    // the idea is to avoid mixing in native prototypes, so adding
    // the second test is WLOG
    while (p !== inNative && p !== HTMLUnknownElement.prototype) {
      var keys = Object.getOwnPropertyNames(p);
      for (var i=0, k; k=keys[i]; i++) {
        if (!used[k]) {
          Object.defineProperty(inTarget, k,
              Object.getOwnPropertyDescriptor(p, k));
          used[k] = 1;
        }
      }
      p = Object.getPrototypeOf(p);
    }
  }

  function created(element) {
    // invoke createdCallback
    if (element.createdCallback) {
      element.createdCallback();
    }
  }

  // attribute watching

  function overrideAttributeApi(prototype) {
    // overrides to implement callbacks
    // TODO(sjmiles): should support access via .attributes NamedNodeMap
    // TODO(sjmiles): preserves user defined overrides, if any
    if (prototype.setAttribute._polyfilled) {
      return;
    }
    var setAttribute = prototype.setAttribute;
    prototype.setAttribute = function(name, value) {
      changeAttribute.call(this, name, value, setAttribute);
    }
    var removeAttribute = prototype.removeAttribute;
    prototype.removeAttribute = function(name) {
      changeAttribute.call(this, name, null, removeAttribute);
    }
    prototype.setAttribute._polyfilled = true;
  }

  // https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/custom/
  // index.html#dfn-attribute-changed-callback
  function changeAttribute(name, value, operation) {
    var oldValue = this.getAttribute(name);
    operation.apply(this, arguments);
    var newValue = this.getAttribute(name);
    if (this.attributeChangedCallback
        && (newValue !== oldValue)) {
      this.attributeChangedCallback(name, oldValue, newValue);
    }
  }

  // element registry (maps tag names to definitions)

  var registry = {};

  function getRegisteredDefinition(name) {
    if (name) {
      return registry[name.toLowerCase()];
    }
  }

  function registerDefinition(name, definition) {
    registry[name] = definition;
  }

  function generateConstructor(definition) {
    return function() {
      return instantiate(definition);
    };
  }

  function createElement(tag, typeExtension) {
    // TODO(sjmiles): ignore 'tag' when using 'typeExtension', we could
    // error check it, or perhaps there should only ever be one argument
    var definition = getRegisteredDefinition(typeExtension || tag);
    if (definition) {
      return new definition.ctor();
    }
    return domCreateElement(tag);
  }

  function upgradeElement(element) {
    if (!element.__upgraded__ && (element.nodeType === Node.ELEMENT_NODE)) {
      var type = element.getAttribute('is') || element.localName;
      var definition = getRegisteredDefinition(type);
      return definition && upgrade(element, definition);
    }
  }

  function cloneNode(deep) {
    // call original clone
    var n = domCloneNode.call(this, deep);
    // upgrade the element and subtree
    scope.upgradeAll(n);
    // return the clone
    return n;
  }
  // capture native createElement before we override it

  var domCreateElement = document.createElement.bind(document);

  // capture native cloneNode before we override it

  var domCloneNode = Node.prototype.cloneNode;

  // exports

  document.registerElement = register;
  document.createElement = createElement; // override
  Node.prototype.cloneNode = cloneNode; // override

  scope.registry = registry;

  /**
   * Upgrade an element to a custom element. Upgrading an element
   * causes the custom prototype to be applied, an `is` attribute 
   * to be attached (as needed), and invocation of the `readyCallback`.
   * `upgrade` does nothing if the element is already upgraded, or
   * if it matches no registered custom tag name.
   *
   * @method ugprade
   * @param {Element} element The element to upgrade.
   * @return {Element} The upgraded element.
   */
  scope.upgrade = upgradeElement;
}

// bc
document.register = document.registerElement;

scope.hasNative = hasNative;
scope.useNative = useNative;

})(window.CustomElements);// add/ child / peg / hole


// propriété ref sur un autre composant

// associer du code


// OK content text ex: <vs-button>Salut</vs-button>
// OK events

// OK propriété non scalaire (Array, object)
// 3 approches: namespace, dynamic, default string

var UNMUTABLE_ATTRIBUTES = ["id", "is", "properties", "name"];

function NO_CONTENT (node) {
  vs.util.removeAllElementChild (node);
}

function TEXT_CONTENT (node, config) {
  var text = node.textContent;
  vs.util.removeAllElementChild (node);
  
  if (text) config.text = text;
}

function RADIO_CHECK_BUTTON_CONTENT (node, config) {
  var
    model = [],
    items = node.children,
    i = 0,
    l = items.length,
    item;
    
  for (; i < l; i ++) {
    item = items.item (i);
    if (item.nodeName == "VS-ITEM") model.push (item.textContent);
  }
  
  vs.util.removeAllElementChild (node);
  
  config.model = model;
}

var EXTERN_COMPONENT = {}, LOADING_CLBS = {};

function get_extern_component (href, result_clb) {

  var node = EXTERN_COMPONENT [href], data, clbs;
  
  if (!vs.util.isFunction (result_clb)) result_clb = null;

  if (node) {
    if (result_clb) result_clb (node);
    return;
  }
  
  if (result_clb) {
    clbs = LOADING_CLBS [href];
    if (!clbs) {
      LOADING_CLBS [href] = clbs = [];
    }
    clbs.push (result_clb);
  }
  
  function send_result (href, data) {
    var clbs = LOADING_CLBS [href];
    if (clbs) {
      clbs.forEach (function (result_clb) {
        vs.scheduleAction (function () {result_clb (data)});
      })
      clbs = [];
      delete (LOADING_CLBS [href]);
    }
  }
  
  var xmlRequest = new XMLHttpRequest ();
  xmlRequest.open ("GET", href, false);
  xmlRequest.send (null);

  if (xmlRequest.readyState === 4)
  {
    if (xmlRequest.status === 200 || xmlRequest.status === 0)
    {
      data = xmlRequest.responseText;
      node = vs.ui.Template.parseHTML (data);
      EXTERN_COMPONENT [href] = node;
      send_result (href, node);
    }
    else
    {
      console.error ("Template file for component '" + comp_name + "' unfound.");
      send_result (href, node);
      return;
    }
  }
  else
  {
    console.error ("Pb when load the component '" + comp_name + "' template.");
    send_result (href, node);
    return;
  }
  xmlRequest = null;
}


function declare_extern_component () {

  var
    node,
    comp_proto;
  
  node = vs.ui.Template.parseHTML ("<div></div>");
  comp_proto = Object.create (node.constructor.prototype);
  
  comp_proto.createdCallback = function () {
  
    var href = this.getAttribute ('href');
    if (!href) return;
    
    // force component to be load
    get_extern_component (href);
  };
  
  comp_proto.attachedCallback = function () {
  
    var
      self = this,
      href = this.getAttribute ('href'),
      id = this.getAttribute ('id');
    
    get_extern_component (href, function (data) {
      if (!data) return;
      
      var
        parentNode = self.parentNode,
        importNode = document.importNode (data, true);
        
      if (id) {
        importNode.setAttribute ('id', id);
      }
      console.log (importNode);
      
      parentNode.insertBefore (importNode, self);
      parentNode.removeChild (self);
    });
  };
        
  comp_proto.detachedCallback = function () {
    console.log ("detachedCallback");
  };
        
  comp_proto.attributeChangedCallback = function (name, oldValue, newValue) {};
  
  document.registerElement ("vs-import", {prototype: comp_proto});
}



var property_reg = /(\w+):(\w+[.\w+]*)#(\w+)/;

function parsePropertiesDeclaration (properties_str) {

  var
    comp_properties = {},
    properties = properties_str.split (';'),
    prop_decl;
  
  for (var i = 0; i < properties.length; i++) {
    prop_decl = property_reg.exec (properties [i]);
    if (!prop_decl || prop_decl.length != 4) {
      console.error ("Problem with properties declaration \"%s\"",
        properties [i]);
      continue;
    }
    comp_properties [prop_decl[1]] = [prop_decl [2], prop_decl [3]];
  }

  return comp_properties;
}

function _setCompProperties (comp, properties)
{
  var desc, prop_name, value;
  
  if (!comp.__properties__) comp.__properties__ = [];
  
  for (prop_name in properties) {

    value = properties [prop_name];
    desc = {};
    
    desc.set = (function (_path, _prop_name) {
      return function (v) {
        var base = this, namespaces = _path.split ('.');
        
        this [_prop_name] = v;
        
        while (base && namespaces.length) {
          base = base [namespaces.shift ()];
        }
        if (base) {
          base [_prop_name] = v;
        }
        this.propertyChange (_prop_name);
      };
    }(value[0], value[1]));

    desc.get = (function (_path, _prop_name) {
      return function () {
        var base = this, namespaces = _path.split ('.');
        while (base && namespaces.length) {
          base = base [namespaces.shift ()];
        }
        if (base) {
          this [_prop_name] = base [_prop_name];
        }
        return;
      };
    }(value[0], value[1]));
    
    vs.util.defineProperty (comp, prop_name, desc);
    comp.__properties__.push (prop_name);
  }
}


function LIST_TEMPLATE_CONTENT (node, config) {

  var template_comp, comp_properties;
  
  function buildTemplate (item) {
    
    var str_template = "<vs-view";
    var attributes = item.attributes, l = attributes.length, attribute;
    
    // copy attributes
    while (l--) {
      attribute = attributes.item (l);
      if (attribute.name == "properties") {
        //properties declaration
        comp_properties = parsePropertiesDeclaration (attribute.value);
        continue;
      }
      if (UNMUTABLE_ATTRIBUTES.indexOf (attribute.name) !== -1) continue;
      str_template += ' ' + attribute.name + "=\"" + attribute.value + "\"";
    }

    // copy the template content
    str_template += ">" + item.innerHTML + "</vs-view>";

    // create the template object
    var template = new vs.ui.GLTemplate (str_template);
    
    // generate the comp
    var config = buildConfiguration (item);
    var comp = template.compileView ("vs.ui.GLAbstractListItem", config);
//    _setCompProperties (comp, comp_properties);
//    return comp;

//    return template._shadow_view.__node._comp_;
  }

  var item = node.firstElementChild;
  
//  while (item) {
//   
//     if (item.nodeName == "VS-TEMPLATE") {
//     
//       var href = item.getAttribute ("href");
//       if (href) {
//         get_extern_component (href);
//         node.__ext_template = href;
//       }
//       else {
//         template_comp = buildTemplate (item);
//       }
//       
//       break;
//     }
//  }
  
//  vs.util.removeAllElementChild (node);
  
//  config.__template_obj = template_comp;
}

function LIST_ATTACHED_CALLBACK () {
  
  if (!this._comp_) return;
  
   console.log ("LIST attachedCallback");
   
  var href = this.__ext_template, self = this;
  if (href) {
    delete (this.__ext_template);
    
    get_extern_component (href, function (data) {
      if (!data) return;

      var config = buildConfiguration (data);
      config.node = document.importNode (data, true);

      var comp = new vs.ui.AbstractListItem (config).init ();
//      var comp = new vs.ui.AbstractListItem (config);
      
      var properties_str = data.getAttribute ("properties");
      if (properties_str) {
        var comp_properties = parsePropertiesDeclaration (properties_str);
        _setCompProperties (comp, comp_properties);
      }
    
      self._comp_.setItemTemplate (comp);
      self._comp_._modelChanged ();
    });
  }
   
  var parentComp = getParentComp (this), name = this.getAttribute ("name");
  
  if (parentComp) {
    parentComp.add (this._comp_);
    if (name) {
      if (parentComp.isProperty (name)) {
        console.error (
          "Impossible to define a child, type \"%s\", with the same name " +
          "\"%s\" of a property. Change the component name on your template.",
          this.nodeName, name);
        console.log (this);
      }
      else {
        parentComp [name] = this._comp_;
        this.classList.add (name);
      }
    }
  }
  
//   console.log (this.nodeName);
}

function ALLOW_CHILD_CONTENT (node) {}

var LIST_COMPONENT = [
  ["vs.ui.GLText", "vs-text", TEXT_CONTENT],
  ["vs.ui.GLButton", "vs-button", TEXT_CONTENT],
  ["vs.ui.GLApplication", "vs-application", ALLOW_CHILD_CONTENT],
  ["vs.ui.GLCanvas", "vs-canvas", NO_CONTENT],
  ["vs.ui.GLImage", "vs-image", NO_CONTENT],
  ["vs.ui.GLList", "vs-list", LIST_TEMPLATE_CONTENT, null, LIST_ATTACHED_CALLBACK],
  ["vs.ui.GLScrollView", "vs-scroll-view", ALLOW_CHILD_CONTENT],
  ["vs.ui.GLView", "vs-view", ALLOW_CHILD_CONTENT],
  ["vs.ui.GLView", "vs-template", ALLOW_CHILD_CONTENT]
]

function INT_DECODER (value) {
  return parseInt (value, 10)
}

function BOOL_DECODER (value) {
  return Boolean (value)
}

function REF_DECODER (value) {
  var result;
  try {
    result = eval (value);
  }
  catch (exp) {
    if (exp.stack) console.error (exp.stack);
    console.error (exp);
  }
  return result;
}

function JSON_DECODER (value) {
  var result;
  try {
    result = JSON.parse (value);
  }
  catch (exp) {
    if (exp.stack) console.error (exp.stack);
    console.error (exp);
  }
  return result;
}

function ARRAY_DECODER (value) {
  var result;
  try {
    result = JSON.parse (value);
  }
  catch (exp) {
    if (exp.stack) console.error (exp.stack);
    console.error (exp);
  }
  if (vs.util.isArray (result)) return result;
  
  return;
}

function OBJECT_DECODER (value) {
  var result;
  try {
    result = JSON.parse (value);
  }
  catch (exp) {
    if (exp.stack) console.error (exp.stack);
    console.error (exp);
  }
  
  return result;
}

function STRING_DECODER (value) {
  return "" + value;
}

function DYNAMIC_DECODER (value, comp, prop_name) {
  if (!comp || !prop_name) return STRING_DECODER (value);
  
  var old_value = comp [prop_name];
  if (vs.util.isNumber (old_value)) return INT_DECODER (value);
  if (vs.util.isArray (old_value)) return ARRAY_DECODER (value);
  if (vs.util.isString (old_value)) return STRING_DECODER (value);
  if (vs.util.isUndefined (old_value)) return STRING_DECODER (value);
  if (vs.util.isObject (old_value)) return OBJECT_DECODER (value);
  
  return STRING_DECODER (value);
}

var ATTRIBUTE_DECODERS = {
  "magnet": INT_DECODER,
  "range": ARRAY_DECODER
}

var ONLOAD_METHODS = [];

/**
 * @private
 */
function resolveClass (name) {
  if (!name) { return null; }

  var namespaces = name.split ('.');
  var base = window;
  while (base && namespaces.length) {
    base = base [namespaces.shift ()];
  }

  return base;
}

function buildConfiguration (node) {

  var
    config = {},
    name,
    attributes = node.attributes,
    l = attributes.length,
    attribute;
  
  while (l--) {
    attribute = attributes.item (l);
    name = vs.util.camelize (attribute.name);
    if (name == "id") {
      config.id = attribute.value;
      continue;
    }
    else if (name == "class") continue;
    else if (UNMUTABLE_ATTRIBUTES.indexOf (attribute.name) !== -1) continue;
    else if (name.indexOf ("on") === 0) continue; // Event
    else if (name.indexOf ("json:") === 0) {
      config [name.replace ("json:", "")] = JSON_DECODER (attribute.value);
    }
    else if (name == "size" || name == "position" ||
             name == "rotation" || name == "translation") {
      config [name] = JSON_DECODER (attribute.value);
    }
    else if (name == "style") {

      var style = new GLStyle ();
      style.parseStringStyle (attribute.value);

      config [name] = style;
    }
    else if (name == "constraint") {

      var constraint = new GLConstraint ();
      constraint.parseStringStyle (attribute.value);

      config [name] = constraint;
    }
    else if (name.indexOf ("ref:") === 0) {
      config [name.replace ("ref:", "")] = REF_DECODER (attribute.value);
    }
    else {
      var decoder = ATTRIBUTE_DECODERS [name]
      if (decoder) config [name] = decoder (attribute.value);
      else config [name] = DYNAMIC_DECODER (attribute.value);
    }
  }
  
  return config;
}

function buildBinding (node, comp) {

  var
    attributes = node.attributes,
    i,
    attribute,
    spec;
    
  for (i = 0; i < attributes.length; ) {
    attribute = attributes.item (i);
    name = vs.util.camelize (attribute.name);
    if (name == "onload") {
      var value = attribute.value;
      if (value) {
        ONLOAD_METHODS.push (function (event) {
          try { 
            eval (value);
          } catch (exp) {
            if (exp.stack) console.error (exp.stack);
            console.error (exp);
          }
        });
      }
      node.removeAttribute (name);
    }
    else if (name.indexOf ("on") === 0) {
      spec = name.substring (2);
      var value = attribute.value;
      node.removeAttribute (name);
      comp.bind (spec, window, function (event) {
        try { 
          eval (value);
        } catch (exp) {
          if (exp.stack) console.error (exp.stack);
          console.error (exp);
        }
      });
    }
    else i++;
  }
}

function getParentComp (node) {
  if (!node) return null;
  var parentNode = node.parentNode;
  if (parentNode && parentNode._comp_) return parentNode._comp_;
  else return getParentComp (parentNode);
}

function declareComponent (className, comp_name, manage_content,
  createdCallback, attachedCallback, detachedCallback) {

  var
    _class = resolveClass (className),
    node,
    comp_proto,
    decl,
    html_comp;
  
  if (!_class) return;

  node = vs.ui.Template.parseHTML ("<div></div>");
  
  comp_proto = Object.create (node.constructor.prototype);
  
  if (vs.util.isFunction (createdCallback)) {
    comp_proto.createdCallback = createdCallback;
  }
  else comp_proto.createdCallback = function () {

    var
      config = buildConfiguration (this),
      _comp_;

    if (manage_content) {
      manage_content (this, config);
    }
    else NO_CONTENT (this);
    
    var over_class_name = this.getAttribute ("class"), over_class;
    
    if (over_class_name) {
      var
        namespaces = over_class_name.split ('.'),
        i = 0,
        temp_name = window [namespaces[i++]];
        
      while (temp_name && i < namespaces.length) {
        temp_name = temp_name [namespaces[i++]];
      }
      
      if (temp_name && i === namespaces.length) {
        over_class = temp_name;
      }
    }

    if (over_class) _comp_ = new over_class (config);
    else _comp_ = new _class (config);
    
    this._comp_ = _comp_;

    if (this.nodeName == "BODY") {
      this.style.width = frame_size[0] + "px";
      this.style.height = frame_size[1] + "px";
      this.style.overflow = "hidden";
    }

    var properties_str = this.getAttribute ("properties");
    if (properties_str) {
      var comp_properties = parsePropertiesDeclaration (properties_str);
      _setCompProperties (_comp_, comp_properties);
    }
    
    _comp_.init ();
    if (over_class) {
      ONLOAD_METHODS.push (function (event) {
        try { 
          if (_comp_ && _comp_.onload) {
            _comp_.onload ();
          }
        } catch (exp) {
          if (exp.stack) console.error (exp.stack);
          console.error (exp);
        }
      });
    }
    
    buildBinding (this, _comp_);
  };
  
  if (vs.util.isFunction (attachedCallback)) {
    comp_proto.attachedCallback = attachedCallback;
  }
  else comp_proto.attachedCallback = function () {
  
    if (!this._comp_) return;
    
    var parentComp, name;
      
    parentComp = getParentComp (this);
    name = this.getAttribute ("name")
    
    if (parentComp) {
      if (this.nodeName == "VS-TEMPLATE") {
        if (parentComp instanceof vs.ui.GLList) {
          window.list = parentComp;
          parentComp.__template_obj = this._comp_;
//          parentComp._renderData ();
        }
      }
      else {
        parentComp.add (this._comp_);
        if (name) {
          if (parentComp.isProperty (name)) {
            console.error (
              "Impossible to define a child, type \"%s\", with the same name " +
              "\"%s\" of a property. Change the component name on your template.",
              this.nodeName, name);
            console.log (this);
          }
          else {
            parentComp [name] = this._comp_;
            this.classList.add (name);
          }
        }
      }
    }
    
 //   console.log (this.nodeName);
  };
        
  if (vs.util.isFunction (detachedCallback)) {
    comp_proto.detachedCallback = detachedCallback;
  }
  else comp_proto.detachedCallback = function () {
    console.log ("detachedCallback");
  };
        
  comp_proto.attributeChangedCallback = function (name, oldValue, newValue) {
  
    if (UNMUTABLE_ATTRIBUTES.indexOf (name) !== -1) return;
    
    var comp = this._comp_;
    name = vs.util.camelize (name)
    
    if (!comp) return;

    else if (name.indexOf ("json:") === 0) {
      name = name.replace ("json:", "");
      if (comp.isProperty (name)) {
        comp [name] = JSON_DECODER (newValue);
      }
    }

    else if (comp.isProperty (name)) {
      var decoder = ATTRIBUTE_DECODERS [name]
      if (decoder) comp [name] = decoder (newValue);
      else comp [name] = DYNAMIC_DECODER (newValue, comp, name);
      comp.propagateChange (name);
    }
  };
  
  decl = {prototype: comp_proto};
  
  if (className == "vs.ui.GLApplication") {
    decl.extends = "body";
  }
  
  html_comp = document.registerElement (comp_name, decl);

  return html_comp;
}

LIST_COMPONENT.forEach (function (item) {
  declareComponent.apply (this, item);
});

declare_extern_component ();

window.addEventListener ('DOMContentLoaded', function() {
  document.body.style.opacity = 0;
});
  
window.addEventListener ('WebComponentsReady', function() {

//  list._renderData ();
//  endInit ();
  
  ONLOAD_METHODS.forEach (function (item) { item.call (); });
  
  // show body now that everything is ready
  vs.ui.Application.start ();
  vs.scheduleAction (function () {
    document.body.style.opacity = 1;
  });
});


function endInit () {
//   var apps = vs.Application_applications, key;
// 
//   function _initComponent (component) {
//     var i, l, child, children;
//         
//     children = component.__children;
//     l = children.length;
//     for (i = 0; i < l; i++) {
//       child = children [i];
//       _initComponent (child, p_matrix, new_p_matrix, new_view_p);
//     }
//     
//     component.init ();
// 
//     for (i = 0; i < l; i++) {
//       child = children [i];
//       if (child.viewDidAdd) {
//         child.viewDidAdd ();
//       }
//     }
//   }
// 
//   for (key in apps) {
//     var app = apps[key];
//     _initComponent (app);
//   }
}
