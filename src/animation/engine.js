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
  chrono.delegate = {};
  chrono.delegate.taskDidEnd = function () {
    if (animation.steps === 0) {
      queueAction (function () {
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
  
  if (animation.steps === 0) {
    // TODO this modification make we lose the first frame !!!
    // because the queueAction will schedule the animation on the next rendering.
    queueAction (function () {
      var animations = ANIMATIONS [comp.__gl_id];
      if (!animations) {
        animations = [];
        ANIMATIONS [comp.__gl_id] = animations;
      }
    
      animations.push (chrono);
      GLView.__nb_animation ++;
    });
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

