// import { vec2, vec3 } from "gl-matrix";
// import { BaseView } from "../core/view";

// export type AnimationType = number | vec2 | vec3;
// export type TrajectoryEntry<T> = [number, T];
// export type TrajectoryValues<T> = TrajectoryEntry<T>[];

// export class Trajectory<T> {
//   protected _values: TrajectoryValues<T>;
//   protected out: T;

//   constructor(values: TrajectoryEntry<T>[]) {
//     this._values = values;
//     this.out = null;
//   }

//   /**
//    * compute
//    * @protected
//    *
//    * @name vs.ext.fx.Trajectory#compute
//    * @function
//    */
//   compute(tick: number): T {
//     return;
//   }
// }

// function getValuesIndex<T>(values: TrajectoryEntry<T>[], nb_values: number, t: number, operation: (v1: T, v2: T, d: number, out?: T) => T, out?: T): T {
//   let i, value_s, value_e, d;
  
//   if (t <= 0) return values[0][1];
//   if (t >= 1) return values[nb_values][1];
  
//   value_s = values[0];
//   for (i = 1; i <= nb_values; i++) {
//     value_e = values[i];
//     if (t >= value_e[0]) {
//       value_s = value_e;
//     } else {
//       d = (t - value_s[0]) / (value_e[0] - value_s[0]);
//       return operation(value_s[1], value_e[1], d, out);
//     }
//   }
// }

// function TrajectoryVect1D_op(v1: number, v2: number, d: number): number {
//   return v1 + (v2 - v1) * d;
// }

// export class TrajectoryVect1D extends Trajectory<number> {
//   constructor(values: TrajectoryEntry<number>[]) {
//     super(values.slice());
//   }

//   compute(tick: number): number {
//     var
//       nb_values = this._values.length - 1, // int [0, n]
//       ti = tick * nb_values, // float [0, n]
//       index = ti | 0, // int [0, n]
//       d = ti - index; // float [0, 1]

//     this.out = getValuesIndex<number>(this._values, nb_values, tick, TrajectoryVect1D_op, null);

//     return this.out;
//   };
// }

// function TrajectoryVect2D_op(v1: vec2, v2: vec2, d: number, out: vec2): vec2 {
//   out[0] = v1[0] + (v2[0] - v1[0]) * d;
//   out[1] = v1[1] + (v2[1] - v1[1]) * d;

//   return out;
// }

// export class TrajectoryVect2D extends Trajectory<vec2> {

//   constructor(values: TrajectoryEntry<vec2>[]) {
//     super(values.slice());
//     this.out = vec2.create();
//   }

//   compute(tick: number): vec2 {
//     var
//       values = this._values,
//       nb_values = values.length - 1, // int [0, n]
//       ti = tick * nb_values, // float [0, n]
//       out = this.out,
//       result = getValuesIndex<vec2>(values, nb_values, tick, TrajectoryVect2D_op, out);

//     if (result !== out) {
//       out[0] = result[0];
//       out[1] = result[1];
//     }

//     return out;
//   };
// }

// function TrajectoryVect3D_op(v1: vec3, v2: vec3, d: number, out: vec3): vec3 {
//   out[0] = v1[0] + (v2[0] - v1[0]) * d;
//   out[1] = v1[1] + (v2[1] - v1[1]) * d;
//   out[2] = v1[2] + (v2[2] - v1[2]) * d;

//   return out;
// }

// export class TrajectoryVect3D extends Trajectory<vec3> {

//   constructor(values: TrajectoryEntry<vec3>[]) {
//     super(values.slice());
//     this.out = vec3.create();
//   }

//   compute(tick: number): vec3 {
//     var
//       values = this._values,
//       nb_values = values.length - 1, // int [0, n]
//       ti = tick * nb_values, // float [0, n]
//       out = this.out,
//       result = getValuesIndex<vec3>(values, nb_values, tick, TrajectoryVect3D_op, out);

//     if (result !== out) {
//       out[0] = result[0];
//       out[1] = result[1];
//       out[2] = result[2];
//     }

//     return out;
//   };
// }


// export class TrajectoriesData<T> {
//   protected _data: [BaseView, string, Trajectory<T>][];

//   constructor() {
//     this._data = [];
//   }

//   add(obj: BaseView, property: string, trajectory: Trajectory<T>): void {
//     this._data.push([obj, property, trajectory]);
//   }

//   compute(tick: number): void {
//     let l = this._data.length, data;

//     while (l--) {
//       data = this._data[l];
//       data[0][data[1]] = data[2].compute(tick);
//     }
//   }

//   removeProperty(prop_name: string) {
//     var i = 0, l = this._data.length, data;

//     for (; i < l;) {
//       data = this._data[i];
//       if (data[1] === prop_name) {
//         this._data.remove(i);
//         l--;
//       }
//       else i++;
//     }
//   }

//   mixData(traj) {
//     var l = traj._data.length, data;

//     while (l--) {
//       data = traj._data[l];
//       this.removeProperty(data[1]);
//     }
//   }
// }