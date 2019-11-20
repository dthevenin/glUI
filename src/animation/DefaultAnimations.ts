// /*************************************************************
//                 Predefined animation
// *************************************************************/

// /**
//  *  Fade in an object.
//  * @name Animation.FadeIn
//  *  @type Animation
//  */
// export const FadeIn = new Animation({opacity: 1});
// FadeIn.keyFrame (0, {'opacity': 0});

// /**
//  *  Fade out an object.
//  * @name Animation.FadeOut
//  *  @type Animation
//  */
// export const FadeOut = new Animation({opacity: 0});
// FadeOut.keyFrame (0, {'opacity': 1});

// export const Bounce = new Animation({translation: [0,0]});
// Bounce.keyFrame (0, {'translation': [0,0]});
// Bounce.keyFrame (0.2, {'translation': [0,0]});
// Bounce.keyFrame (0.4, {'translation': [0,-30]});
// Bounce.keyFrame (0.5, {'translation': [0,0]});
// Bounce.keyFrame (0.6, {'translation': [0,-15]});
// Bounce.keyFrame (0.8, {'translation': [0,0]});
// Bounce.duration = 1000;

// export const Shake = new Animation({translation: [0,0]});
// Shake.keyFrame (0, {'translation': [0,0]});
// Shake.keyFrame (0.10, {'translation': [-10,0]});
// Shake.keyFrame (0.20, {'translation': [10,0]});
// Shake.keyFrame (0.30, {'translation': [-10,0]});
// Shake.keyFrame (0.40, {'translation': [10,0]});
// Shake.keyFrame (0.50, {'translation': [-10,0]});
// Shake.keyFrame (0.60, {'translation': [10,0]});
// Shake.keyFrame (0.70, {'translation': [-10,0]});
// Shake.keyFrame (0.80, {'translation': [10,0]});
// Shake.keyFrame (0.90, {'translation': [0,0]});
// Shake.duration = 1000;

// /**
//  *  Swing
//  * @name Animation.Swing
//  *  @type Animation
//  */
// export const Swing = new Animation({rotation: 0});
// Swing.keyFrame (0, {'rotation': 0});
// Swing.keyFrame (0.20, {'rotation':15});
// Swing.keyFrame (0.40, {'rotation':-10});
// Swing.keyFrame (0.60, {'rotation':5});
// Swing.keyFrame (0.80, {'rotation':-5});
// Swing.duration = 1000;
// Swing.origin = [50, 0];

// /**
//  *  Slide a object to right.
//  * @name Animation.Pulse
//  *  @type Animation
//  */
// export const Pulse = new Animation({scaling: 1});
// Pulse.keyFrame (0, {'scaling':1});
// Pulse.keyFrame (0.50, {'scaling':1.1});
// Pulse.keyFrame (0.80, {'scaling':0.97});
// Pulse.duration = 1000;

// /**
//  *  Slide a object to right.
//  * @name Animation.FlipInX
//  *  @type Animation
//  */
// export const FlipInX = new Animation({rotation: [0, 0, 0], 'opacity': 1});
// FlipInX.keyFrame (0, {'rotation': [90, 0, 0], 'opacity': 0});
// FlipInX.keyFrame (0.4, {'rotation': [-10, 0, 0], 'opacity': 1});
// FlipInX.keyFrame (0.7, {'rotation': [10, 0, 0], 'opacity': 1});
// FlipInX.duration = 500;


// /**
//  *  Slide a object to right.
//  * @name Animation.FlipOutX
//  *  @type Animation
//  */
// export const FlipOutX = new Animation({rotation: [90, 0, 0], 'opacity': 0});
// FlipOutX.keyFrame (0, {'rotation': [0,0,0], 'opacity': 1});
// FlipOutX.duration = 500;

// /**
//  *  Slide a object to right.
//  * @name Animation.FlipInY
//  *  @type Animation
//  */
// export const FlipInY = new Animation({rotation: [0, 0, 0], 'opacity': 1});
// FlipInY.keyFrame (0, {'rotation': [0, 90, 0], 'opacity': 0});
// FlipInY.keyFrame (0.4, {'rotation': [0, -10, 0], 'opacity': 1});
// FlipInY.keyFrame (0.7, {'rotation': [0, 10, 0], 'opacity': 1});
// FlipInY.duration = 500;

// /**
//  *  Slide a object to right.
//  * @name Animation.FlipOutY
//  *  @type Animation
//  */
// export const FlipOutY = new Animation({rotation: [0, 90, 0], 'opacity': 0});
// FlipOutY.keyFrame (0, {'rotation': [0,0,0],'opacity': 1});
// FlipOutY.duration = 500;

// /**
//  *  Slide a object to right.
//  * @name Animation.FadeInUp
//  *  @type Animation
//  */
// export const FadeInUp = new Animation({translation: [0,0], 'opacity': 1});
// FadeInUp.keyFrame (0, {'translation': [0, 20], 'opacity': 0});
// FadeInUp.duration = 500;

// /**
//  *  Slide a object to right.
//  * @name vs.ext.fx.Animation.FadeOutUp
//  *  @type Animation
//  */
// export const FadeOutUp = new Animation({translation: [0, -20], 'opacity': 0});
// FadeOutUp.keyFrame (0, {'translation': [0,0], 'opacity': 1});
// FadeOutUp.duration = 500;

// /**
//  *  Slide a object to right.
//  * @name Animation.FadeInDown
//  *  @type Animation
//  */
// export const FadeInDown = new Animation({translation: [0,0], 'opacity': 1});
// FadeInDown.keyFrame (0, {'translation': [0, -20], 'opacity': 0});
// FadeInDown.duration = 1000;

// /**
//  *  Slide a object to right.
//  * @name Animation.FadeOutDown
//  *  @type Animation
//  */
// export const FadeOutDown = new Animation({translation: [0, 20], 'opacity': 0});
// FadeOutDown.keyFrame (0, {'translation': [0,0], 'opacity': 1});
// FadeOutDown.duration = 300;

// /**
//  *  Slide a object to right.
//  * @name Animation.FadeInLeft
//  *  @type Animation
//  */
// export const FadeInLeft = new Animation({translation: [0,0], 'opacity': 1});
// FadeInLeft.keyFrame (0, {'translation': [-20, 0], 'opacity': 0});
// FadeInLeft.duration = 1000;

// /**
//  *  Slide a object to right.
//  * @name Animation.FadeOutLeft
//  *  @type Animation
//  */
// export const FadeOutLeft = new Animation({translation: [20, 0], 'opacity': 0});
// FadeOutLeft.keyFrame (0, {'translation': [0,0], 'opacity': 1});
// FadeOutLeft.duration = 1000;

// /**
//  *  Slide a object to right.
//  * @name Animation.FadeInLeft
//  *  @type Animation
//  */
// export const FadeInRight = new Animation({translation: [0,0], 'opacity': 1});
// FadeInRight.keyFrame (0, {'translation': [20, 0], 'opacity': 0});
// FadeInRight.duration = 1000;

// /**
//  *  Slide a object to right.
//  * @name Animation.FadeOutLeft
//  *  @type Animation
//  */
// export const FadeOutRight = new Animation({translation: [-20, 0], 'opacity': 0});
// FadeOutRight.keyFrame (0, {'translation': [0,0], 'opacity': 1});
// FadeOutRight.duration = 1000;
