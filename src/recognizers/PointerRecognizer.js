/*
  Copyright (C) 2009-2013. David Thevenin, ViniSketch (c), and
  IGEL Co., Ltd. All rights reserved

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

/**
 *  The recognizer.PointerRecognizer class
 *
 *  @class
 *  recognizer.PointerRecognizer is an abstract class that helps with detecting and
 *  responding to the various UI pointer/gesture events common on devices.<br />
 *  Build on top of PointerEvent API, PointerRecognizer will works with mouse
 *  and/or touche devices.<br />
 *
 *  recognizer.PointerRecognizer is an abstract class, with the following concrete
 *  subclasses, one for each type of available recognizer:
 *  <ul>
 *    <li /> recognizer.TapRecognizer
 *    <li /> recognizer.DragRecognizer
 *    <li /> recognizer.RotationRecognizer
 *    <li /> recognizer.PinchRecognizer
 *  </ul>
 *  <p>
 *  Depending on the type of recognizer, there are various behaviors that you
 *  can configure. For instance, with the recognizer.TapRecognizer, you can specify
 *  the number of taps and number of touches.<br />
 * 
 *  In response to recognized actions, a delegate method call to a delegate
 *  object that you specify within the constructor. Depending on the type of
 *  gesture additional information about the gesture may be available in the
 *  delegate method, for example, the scale factor of a pinch.<br />
 *
 *  @author David Thevenin
 *  @see recognizer.TapRecognizer
 *  @see recognizer.DragRecognizer
 *  @see recognizer.RotationRecognizer
 *  @see recognizer.PinchRecognizer
 *
 *  @constructor
 *   Creates a new recognizer.PointerRecognizer.
 *
 * @name recognizer.PointerRecognizer
 *
 * @param {ReconizerDelegate} delegate the delegate [mandatory]
 */
function PointerRecognizer (delegate) {
  this.constructor = PointerRecognizer;

  this.delegate = delegate;
}

var POINTER_LISTENERS = [];

PointerRecognizer.prototype = {

  /**
   * @name recognizer.PointerRecognizer#addPointerListener
   * @function
   * @protected
   *
   * @param {HTMLElement} node The node to listen
   * @param {String} type the event to listen
   * @param {Function | Object} listener the listener
   * @param {Boolean} useCapture 
   */
  addPointerListener: function (node, type, listener, useCapture) {
    if (!node || !type || !listener) return false;

    var i = 0, len = POINTER_LISTENERS.length, binding;
    for (; i < len; i++) {
      binding = POINTER_LISTENERS [i];
      if (binding.target === node &&
          binding.type === type &&
          binding.listener === listener) {
        binding.nb ++;
        return true;
      }
    }
    
    binding = {};
    binding.target = node;
    binding.type = type;
    binding.listener = listener;
    binding.nb = 1;
    POINTER_LISTENERS.push (binding);
    core.addPointerListener (node, type, listener, useCapture);
    return true;
  },

  /**
   * @name recognizer.PointerRecognizer#removePointerListener
   * @function
   * @protected
   *
   * @param {HTMLElement} node The node to listen
   * @param {String} type the event to listen
   * @param {Function | Object} listener the listener
   * @param {Boolean} useCapture 
   */
  removePointerListener: function (node, type, listener, useCapture) {
    if (!node || !type || !listener) return false;

    var i = 0, len = POINTER_LISTENERS.length, binding;
    for (; i < len; i++) {
      binding = POINTER_LISTENERS [i];
      if (binding.target === node &&
          binding.type === type &&
          binding.listener === listener) {
        binding.nb --;
        if (binding.nb === 0) {
          core.removePointerListener (node, type, listener, useCapture);
          POINTER_LISTENERS.remove (i);
        }
        return true;
      }
    }
    
    return false;
  },

  /**
   * @name recognizer.PointerRecognizer#init
   * @function
   * @protected
   *
   * @param {core.View} obj The view object to listen
   */
  init : function (obj) {
    this.obj = obj;
  },

  /**
   * @name recognizer.PointerRecognizer#uninit
   * @function
   * @protected
   */
  uninit: function () {},

  /**
   * @name recognizer.PointerRecognizer#reset
   * @function
   * @protected
   */
  reset: function () {},

  /**
   * @name recognizer.PointerRecognizer#pointerStart
   * @function
   * @protected
   */
  pointerStart: function (event) {},

  /**
   * @name recognizer.PointerRecognizer#pointerMove
   * @function
   * @protected
   */
  pointerMove: function (event) {},

  /**
   * @name recognizer.PointerRecognizer#pointerEnd
   * @function
   * @protected
   */
  pointerEnd: function (event) {},

  /**
   * @name recognizer.PointerRecognizer#pointerCancel
   * @function
   * @protected
   */
  pointerCancel: function (event) {},

  /**
   * @name recognizer.PointerRecognizer#gestureStart
   * @function
   * @protected
   */
  gestureStart: function (event) {},

  /**
   * @name recognizer.PointerRecognizer#gestureChange
   * @function
   * @protected
   */
  gestureChange: function (event) {},

  /**
   * @name recognizer.PointerRecognizer#gestureEnd
   * @function
   * @protected
   */
  gestureEnd: function (event) {}
};
