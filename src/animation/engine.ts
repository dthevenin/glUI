import { BaseView } from "../core/view";
import { TrajectoryVect1D, TrajectoryVect3D, TrajectoryEntry } from "./Trajectories";
import { Style } from "../core/Style";

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

type Animations = Animation[]

const AnimationsPerComp: Animations[] = [];

function mixAnimations(animations: Animations, new_anim: Animation) {
  let i = 0;
  const l = animations.length;
  let anim;
  for (; i < l; i++) {
    anim = animations[i];
    anim.__trajs.mixData (new_anim.__trajs);
  }
}

export function procesAnimation(comp, animation: Animation, trajectories, clb, ctx, now: number): void {

  var data_anim = {};
  for (var key in AnimationDefaultOption) {
    if (animation [key]) data_anim [key] = animation [key];
    else data_anim [key] = AnimationDefaultOption [key];
  }

  var trajs = new TrajectoriesData ();
  var timing = data_anim.timing;
  
  for (var property in trajectories) {
    setupTrajectory (trajs, comp, property, trajectories [property], trajectories [property + "_class"]);
  }
  
  data_anim.steps = animation.steps | 0;
  if (data_anim.steps <= 1) data_anim.steps = 0;
  
  var chrono = new Chronometer (data_anim);
  chrono.__trajs = trajs;
  chrono.__clb = function (i) {
    trajs.compute (timing (i));
  }
  chrono.delegate = {};
  chrono.delegate.taskDidEnd = function () {
    if (data_anim.steps === 0) {
      setImmediate (function () {
        var animations = AnimationsPerComp [comp.__gl_id];
        animations.remove (chrono)
        View.__nb_animation --;
      });
    }
    
    if (clb) {
      if (!ctx) ctx = window;
      clb.apply (ctx);
    }
  }
  
  if (data_anim.steps === 0) {
    // TODO this modification make we lose the first frame !!!
    // because the queueAction will schedule the animation on the next rendering.
 //   setImmediate (function () {
      var animations = AnimationsPerComp [comp.__gl_id];
      if (!animations) {
        animations = [];
        AnimationsPerComp [comp.__gl_id] = animations;
      }
    
      animations.push (chrono);
      View.__nb_animation ++;
//    });
  }

  chrono.start ();
}

function gl_update_animation (comp: BaseView, now: number): void {
  const animations = AnimationsPerComp[comp.__gl_id];
  let i = 0;
  const l = animations?animations.length:0;
  let anim;
    
  if (!l) return;
    
  for (;i<l; i++) {
    anim = animations[i];
    anim._clock(now);
  }
}

function verifyValue(traj_values): boolean {
  const l = traj_values.length;
  
  if (l < 2) return false;
  
  let value = traj_values[0];
  if (!value) return false;
  if (value[0] !== 0) return false;

  value = traj_values[l - 1];
  if (!value) return false;
  if (value[0] !== 1) return false;
  
  return true
}

var setupTrajectory = function (trajs, view: BaseView, property: string, traj_values: TrajectoryEntry<any>[], traj_class) {
  let obj: BaseView | Style;
  switch (property) {
    case "opacity": 
    case "fontSize": 
      obj = view.style;
      break;
    default:
      obj = view;
  }

  var value = traj_values[0];
  if (!value) return;
  
  if (value [0] !== 0) {
    // add the miss the beginning value
    value = [0, obj[property]];
    traj_values = traj_values.slice();
    traj_values.unshift (value);
  }
  
  if (!verifyValue (traj_values)) {
    throw ("Error with the animation. Unvalid property declaration: " + property);
  }
  
  var traj;
  
  if (traj_class) {
    traj = new traj_class(traj_values);
  }
  else {
    switch (property) {
      case "tick": 
      case "opacity": 
      case "fontSize": 
      case "scaling":
        traj = new TrajectoryVect1D(traj_values);
        break;

      case "translation": 
      case "rotation": 
        traj = new TrajectoryVect3D(traj_values);
        break;

      default:
        console.log ("NOT SUPPORTED PROPERTY: " + property);
        return;
    }
  }
  
  trajs.add (obj, property, traj);
}
