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

TrajectoriesData.prototype.removeProperty = function (prop_name) {
  var i = 0, l = this._data.length, data;
  
  for (; i < l;) {
    data = this._data [i];
    if (data[1] === prop_name) {
      this._data.remove (i);
      l--;
    }
    else i++;
  }
};

TrajectoriesData.prototype.mixData = function (traj) {
  var l = traj._data.length, data;
  
  while (l--) {
    data = traj._data [l];
    this.removeProperty (data[1]);
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

function getValuesIndex (values, nb_values, t, operation, out) {
  var i, value_s, value_e, d;
  
  if (t <= 0) return values [0][1];
  if (t >= 1) return values [nb_values][1];
  
  value_s = values [0];
  for (i = 1; i <= nb_values; i++) {
    value_e = values [i];
    if (t >= value_e [0]) {
      value_s = value_e;
    }
    else {
      d = (t - value_s[0]) / (value_e[0] - value_s[0]);
      return operation (value_s[1], value_e[1], d, out);
    }
  }
}

var TrajectoryVect1D = function (values) {
  Trajectory.call (this);  
  this._values = deepArrayClone (values);
}
util.extendClass (TrajectoryVect1D, Trajectory);

function TrajectoryVect1D_op (v1, v2, d) {
  return v1 + (v2 - v1) * d;
}

TrajectoryVect1D.prototype.compute = function (tick) {
  var
    nb_values = this._values.length - 1, // int [0, n]
    ti = tick * nb_values, // float [0, n]
    index = ti | 0, // int [0, n]
    d = ti - index, // float [0, 1]
    out = getValuesIndex (this._values, nb_values, tick, TrajectoryVect1D_op, null);
    
  return out;
};

var TrajectoryVect2D = function (values) {
  Trajectory.call (this);  
  this._values = deepArrayClone (values);
  this.out = new glMatrixArrayType (2);
}
util.extendClass (TrajectoryVect2D, Trajectory);

function TrajectoryVect2D_op (v1, v2, d, out) {
  out[0] = v1[0] + (v2[0] - v1[0]) * d;
  out[1] = v1[1] + (v2[1] - v1[1]) * d;

  return out;
}

TrajectoryVect2D.prototype.compute = function (tick)
{
  var
    values = this._values,
    nb_values = values.length - 1, // int [0, n]
    ti = tick * nb_values, // float [0, n]
    index = ti | 0, // int [0, n]
    d = ti - index, // float [0, 1]
    out = this.out,
    result = getValuesIndex (values, nb_values, tick, TrajectoryVect2D_op, out);
    
  if (result !== out) {
    out[0] = result[0];
    out[1] = result[1];
  }

  return out;
};

var TrajectoryVect3D = function (values) {
  Trajectory.call (this);  
  this._values = deepArrayClone (values);
  this.out = new glMatrixArrayType (3);
}
util.extendClass (TrajectoryVect3D, Trajectory);

function TrajectoryVect3D_op (v1, v2, d, out) {
  out[0] = v1[0] + (v2[0] - v1[0]) * d;
  out[1] = v1[1] + (v2[1] - v1[1]) * d;
  out[2] = v1[2] + (v2[2] - v1[2]) * d;

  return out;
}
  
TrajectoryVect3D.prototype.compute = function (tick)
{
  var
    values = this._values,
    nb_values = values.length - 1, // int [0, n]
    ti = tick * nb_values, // float [0, n]
    index = ti | 0, // int [0, n]
    d = ti - index, // float [0, 1]
    out = this.out,
    result = getValuesIndex (values, nb_values, tick, TrajectoryVect3D_op, out);
    
  if (result !== out) {
    out[0] = result[0];
    out[1] = result[1];
    out[2] = result[2];
  }

  return out;
};
