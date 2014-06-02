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
