/*************************************************************
                Predefined animation
*************************************************************/

/**
 *  Fade in an object.
 * @name vs.gl.Animation.FadeIn
 *  @type vs.gl.Animation
 */
var FadeIn = new vs.gl.Animation ({'opacity': 1});
FadeIn.keyFrame (0, {'opacity': 0});

/**
 *  Fade out an object.
 * @name vs.gl.Animation.FadeOut
 *  @type vs.gl.Animation
 */
var FadeOut = new vs.gl.Animation ({'opacity': 0});
FadeOut.keyFrame (0, {'opacity': 1});

var Bounce = new vs.gl.Animation ({'translation': [0,0]});
Bounce.keyFrame (0, {'translation': [0,0]});
Bounce.keyFrame (0.2, {'translation': [0,0]});
Bounce.keyFrame (0.4, {'translation': [0,-30]});
Bounce.keyFrame (0.5, {'translation': [0,0]});
Bounce.keyFrame (0.6, {'translation': [0,-15]});
Bounce.keyFrame (0.8, {'translation': [0,0]});
Bounce.duration = 1000;

var Shake = new vs.gl.Animation ({'translation': [0,0]});
Shake.keyFrame (0, {'translation': [0,0]});
Shake.keyFrame (0.10, {'translation': [-10,0]});
Shake.keyFrame (0.20, {'translation': [10,0]});
Shake.keyFrame (0.30, {'translation': [-10,0]});
Shake.keyFrame (0.40, {'translation': [10,0]});
Shake.keyFrame (0.50, {'translation': [-10,0]});
Shake.keyFrame (0.60, {'translation': [10,0]});
Shake.keyFrame (0.70, {'translation': [-10,0]});
Shake.keyFrame (0.80, {'translation': [10,0]});
Shake.keyFrame (0.90, {'translation': [0,0]});
Shake.duration = 1000;

/**
 *  Swing
 * @name vs.gl.Animation.Swing
 *  @type vs.gl.Animation
 */
var Swing = new vs.gl.Animation ({'rotation': 0});
Swing.keyFrame (0, {'rotation': 0});
Swing.keyFrame (0.20, {'rotation':15});
Swing.keyFrame (0.40, {'rotation':-10});
Swing.keyFrame (0.60, {'rotation':5});
Swing.keyFrame (0.80, {'rotation':-5});
Swing.duration = 1000;
Swing.origin = [50, 0];

/**
 *  Slide a object to right.
 * @name vs.gl.Animation.Pulse
 *  @type vs.gl.Animation
 */
var Pulse = new vs.gl.Animation ({'scaling': 1});
Pulse.keyFrame (0, {'scaling':1});
Pulse.keyFrame (0.50, {'scaling':1.1});
Pulse.keyFrame (0.80, {'scaling':0.97});
Pulse.duration = 1000;

/**
 *  Slide a object to right.
 * @name vs.gl.Animation.FlipInX
 *  @type vs.gl.Animation
 */
var FlipInX = new vs.gl.Animation ({'rotation': [0, 0, 0], 'opacity': 1});
FlipInX.keyFrame (0, {'rotation': [90, 0, 0], 'opacity': 0});
FlipInX.keyFrame (0.4, {'rotation': [-10, 0, 0], 'opacity': 1});
FlipInX.keyFrame (0.7, {'rotation': [10, 0, 0], 'opacity': 1});
FlipInX.duration = 500;


/**
 *  Slide a object to right.
 * @name vs.gl.Animation.FlipOutX
 *  @type vs.gl.Animation
 */
var FlipOutX = new vs.gl.Animation ({'rotation': [90, 0, 0], 'opacity': 0});
FlipOutX.keyFrame (0, {'rotation': [0,0,0], 'opacity': 1});
FlipOutX.duration = 500;

/**
 *  Slide a object to right.
 * @name vs.gl.Animation.FlipInY
 *  @type vs.gl.Animation
 */
var FlipInY = new vs.gl.Animation ({'rotation': [0, 0, 0], 'opacity': 1});
FlipInY.keyFrame (0, {'rotation': [0, 90, 0], 'opacity': 0});
FlipInY.keyFrame (0.4, {'rotation': [0, -10, 0], 'opacity': 1});
FlipInY.keyFrame (0.7, {'rotation': [0, 10, 0], 'opacity': 1});
FlipInY.duration = 500;

/**
 *  Slide a object to right.
 * @name vs.gl.Animation.FlipOutY
 *  @type vs.gl.Animation
 */
var FlipOutY = new vs.gl.Animation ({'rotation': [0, 90, 0], 'opacity': 0});
FlipOutY.keyFrame (0, {'rotation': [0,0,0],'opacity': 1});
FlipOutY.duration = 500;

/**
 *  Slide a object to right.
 * @name vs.gl.Animation.FadeInUp
 *  @type vs.gl.Animation
 */
var FadeInUp = new vs.gl.Animation ({'translation': [0,0], 'opacity': 1});
FadeInUp.keyFrame (0, {'translation': [0, 20], 'opacity': 0});
FadeInUp.duration = 500;

/**
 *  Slide a object to right.
 * @name vs.ext.fx.Animation.FadeOutUp
 *  @type vs.gl.Animation
 */
var FadeOutUp = new vs.gl.Animation ({'translation': [0, -20], 'opacity': 0});
FadeOutUp.keyFrame (0, {'translation': [0,0], 'opacity': 1});
FadeOutUp.duration = 500;

/**
 *  Slide a object to right.
 * @name vs.gl.Animation.FadeInDown
 *  @type vs.gl.Animation
 */
var FadeInDown = new vs.gl.Animation ({'translation': [0,0], 'opacity': 1});
FadeInDown.keyFrame (0, {'translation': [0, -20], 'opacity': 0});
FadeInDown.duration = 1000;

/**
 *  Slide a object to right.
 * @name vs.gl.Animation.FadeOutDown
 *  @type vs.gl.Animation
 */
var FadeOutDown = new vs.gl.Animation ({'translation': [0, 20], 'opacity': 0});
FadeOutDown.keyFrame (0, {'translation': [0,0], 'opacity': 1});
FadeOutDown.duration = 300;

/**
 *  Slide a object to right.
 * @name vs.gl.Animation.FadeInLeft
 *  @type vs.gl.Animation
 */
var FadeInLeft = new vs.gl.Animation ({'translation': [0,0], 'opacity': 1});
FadeInLeft.keyFrame (0, {'translation': [-20, 0], 'opacity': 0});
FadeInLeft.duration = 1000;

/**
 *  Slide a object to right.
 * @name vs.gl.Animation.FadeOutLeft
 *  @type vs.gl.Animation
 */
var FadeOutLeft = new vs.gl.Animation ({'translation': [20, 0], 'opacity': 0});
FadeOutLeft.keyFrame (0, {'translation': [0,0], 'opacity': 1});
FadeOutLeft.duration = 1000;

/**
 *  Slide a object to right.
 * @name vs.gl.Animation.FadeInLeft
 *  @type vs.gl.Animation
 */
var FadeInRight = new vs.gl.Animation ({'translation': [0,0], 'opacity': 1});
FadeInRight.keyFrame (0, {'translation': [20, 0], 'opacity': 0});
FadeInRight.duration = 1000;

/**
 *  Slide a object to right.
 * @name vs.gl.Animation.FadeOutLeft
 *  @type vs.gl.Animation
 */
var FadeOutRight = new vs.gl.Animation ({'translation': [-20, 0], 'opacity': 0});
FadeOutRight.keyFrame (0, {'translation': [0,0], 'opacity': 1});
FadeOutRight.duration = 1000;

/********************************************************************
                      Export
*********************************************************************/
/** private */
util.extend (vs.gl.Animation, {
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