
vs.CSSMatrix.prototype.getGLMatrix = function () {
  var m = this._gl_matrix;
  if (m) {
    m[0] = this.m11; m[1] = this.m12; m[2] = this.m13; m[3] = this.m14;
    m[4] = this.m21; m[5] = this.m22; m[6] = this.m23; m[7] = this.m24;
    m[8] = this.m31; m[9] = this.m32; m[10] = this.m33; m[11] = this.m34;
    m[12] = this.m41; m[13] = this.m42; m[14] = this.m43; m[15] = this.m44;
  }
  else {
    this._gl_matrix = new Float32Array ([
      this.m11, this.m12, this.m13, this.m14,
      this.m21, this.m22, this.m23, this.m24,
      this.m31, this.m32, this.m33, this.m34,
      this.m41, this.m42, this.m43, this.m44
    ]);
  }
  return this._gl_matrix
}
