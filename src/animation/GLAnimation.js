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

function GLAnimation (animations)
{
  this.constructor = GLAnimation;
  this.setAnimations (animations);
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
   * animation.setAnimations ({‘width’: 100, 'opacity': 0});
   *
   * @name vs.fx.GLAnimation#setAnimations
   * @function
   * @param {Array.<Array>} animations The array of [property, value]
   *         to animate
   */
  setAnimations : function (animations)
  {
    var i, property, value, traj, values;

    this.timing = GLAnimation.EASE;
    this._trajectories = {};
    
    if (!animations) return;

    for (property in animations)
    {
      value = animations [property];
      if (!util.isString (property))
      {
        console.warn ('vs.fx.GLAnimation, invalid constructor argument option: [' +
          property + ', ' + value + ']');
        continue;
      }
      
      values = [];
      values.push ([1, deepArrayClone (value)]);     
      
      this._trajectories [property] = values;
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
   *  @example
   *  var translate = new vs.fx.GLAnimation ({'translation' : [100,10,0], 'opacity' : 0});
   *
   *  translate.keyFrame (0.2, {translation [50,50,0], 'opacity' : 0.5});
   *  translate.keyFrame (0.4, {translation [80,10,0]});
   *  translate.keyFrame (0.6, {'opacity' : 1});
   *
   * @name vs.fx.GLAnimation#addKeyFrame
   * @function
   * @param {number} pos The percentage value of animation
   * @param {Object | Array} values the object containing values for
   *         the animation
   */
  keyFrame : function (pos, datas)
  {
    var traj, property, values, i, value, index = 0;
    
    if (!datas) { return; }
    if (!util.isNumber (pos) || pos < 0 || pos > 1) { return; }
    
    function updateValues (values, pos, new_value) {
      var i = 0, l = values.length, value;
      
      for (; i < l; i++) {
        value = values[i];
        if (value[0] === pos) {
          value[1] = deepArrayClone (new_value);
          return;
        }
      }
      
      values.push ([pos, deepArrayClone (new_value)]);
      values.sort (function(a, b) {return a[0] - b[0];});
    }
    
    for (property in datas) {
      value = datas [property];
      values = this._trajectories [property];    
      if (!values) {
        values = [];
        this._trajectories [property] = values;
      }
      updateValues (values, pos, value);
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
