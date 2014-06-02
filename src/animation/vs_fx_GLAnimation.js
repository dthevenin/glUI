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





