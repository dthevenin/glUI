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
  
  animation.steps = Math.floor (animation.steps);
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
  if (!vs.util.isNumber (tick)) return false;

  var
    nb_values = this._values.length - 1, // int [0, n]
    ti = tick * nb_values, // float [0, n]
    index = Math.floor (ti), // int [0, n]
    d = ti - index, // float [0, 1]
    out = getValuesIndex (this._values, tick, function (v1, v2, d) {
      return v1 + (v2 - v1) * d;
    });
    
  return out;
};

var Vector2D = function (values) {
  Trajectory.call (this);  
  this._values = values;
  this.out = [2];
}
util.extendClass (Vector2D, Trajectory);
  
Vector2D.prototype.compute = function (tick)
{
  if (!vs.util.isNumber (tick)) return false;
  
  var
    values = this._values,
    nb_values = values.length - 1, // int [0, n]
    ti = tick * nb_values, // float [0, n]
    index = Math.floor (ti), // int [0, n]
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
  this.out = [3];
}
util.extendClass (Vector3D, Trajectory);
  
Vector3D.prototype.compute = function (tick)
{
  if (!vs.util.isNumber (tick)) return false;
  
  var
    values = this._values,
    nb_values = values.length - 1, // int [0, n]
    ti = tick * nb_values, // float [0, n]
    index = Math.floor (ti), // int [0, n]
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
      var r_dec = Math.floor (-begin / this._duration);
       
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
