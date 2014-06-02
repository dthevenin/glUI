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