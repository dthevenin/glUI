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


var ANIMATIONS = [];

function mixAnimations (animations, new_anim) {
  var i = 0, l = animations.length, anim;
  for (; i < l; i++) {
    anim = animations [i];
    anim.__trajs.mixData (new_anim.__trajs);
  }
}

var procesAnimation = function (comp, animation, trajectories, clb, ctx, now) {

  var data_anim = {};
  for (var key in AnimationDefaultOption) {
    if (animation [key]) data_anim [key] = animation [key];
    else data_anim [key] = AnimationDefaultOption [key];
  }

  var trajs = new TrajectoriesData ();
  var timing = data_anim.timing;
  
  for (var property in trajectories) {
    setupTrajectory (trajs, comp, property, trajectories [property]);
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
        var animations = ANIMATIONS [comp.__gl_id];
        animations.remove (chrono)
        GLView.__nb_animation --;
      });
    }
    
    if (clb) {
      if (!ctx) ctx = window;
      clb.apply (ctx);
    }
  }
  chrono.start ();
  
  if (data_anim.steps === 0) {
    // TODO this modification make we lose the first frame !!!
    // because the queueAction will schedule the animation on the next rendering.
 //   setImmediate (function () {
      var animations = ANIMATIONS [comp.__gl_id];
      if (!animations) {
        animations = [];
        ANIMATIONS [comp.__gl_id] = animations;
      }
    
      animations.push (chrono);
      GLView.__nb_animation ++;
//    });
  }
}

function gl_update_animation (comp, now) {
 
  var
    animations = ANIMATIONS [comp.__gl_id],
    i = 0, l = animations?animations.length:0, anim;
    
  if (!l) return;
    
  for (;i<l; i++) {
    anim = animations [i];
    anim._clock (now);
  }
}

var verifyValue = function (traj_values)
{
  var l = traj_values.length, value;
  
  if (l < 2) return false;
  
  value = traj_values [0];
  if (!value) return false;
  if (value [0] !== 0) return false;

  value = traj_values [l - 1];
  if (!value) return false;
  if (value [0] !== 1) return false;
  
  return true
}

var setupTrajectory = function (trajs, obj, property, traj_values)
{
  switch (property) {
    case "opacity": 
    case "fontSize": 
      obj = obj.style;
      break;
  }

  var value = traj_values [0];
  if (!value) return;
  
  if (value [0] !== 0) {
    // add the miss the beginning value
    value = [0, obj[property]];
    traj_values = traj_values.slice ();
    traj_values.unshift (value);
  }
  
  if (!verifyValue (traj_values)) {
    throw ("Error with the animation. Unvalid property declaration: " + property);
  }

  switch (property) {
    case "tick": 
    case "opacity": 
    case "fontSize": 
    case "scaling":
      traj = new TrajectoryVect1D (traj_values);
      break;

    case "translation": 
    case "rotation": 
      traj = new TrajectoryVect3D (traj_values);
      break;

    default:
      console.log ("NOT SUPPORTED PROPERTY: " + property);
      return;
  }      
  
  trajs.add (obj, property, traj);
}

