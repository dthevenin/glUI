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
 *  The recognizer.RotationRecognizer class
 *
 *  @extends recognizer.PointerRecognizer
 *
 *  @class
 *  recognizer.RotationRecognizer is a concrete subclass of recognizer.PointerRecognizer
 *  that looks for rotation gestures involving two touches. When the user moves
 *  the fingers opposite each other in a circular motion, the underlying view
 *  should rotate in a corresponding direction and speed...<br />
 *
 *  The RotationRecognizer delegate has to implement following methods:
 *  <ul>
 *    <li /> didRotationChange (rotation, event). Call when the element is rotated.
 *      rotation The rotation of the gesture in degrees.
 *    <li /> didRotationStart (event). Call when the rotation start
 *    <li /> didRotationEnd (event). Call when the rotation end
 *  </ul>
 *  <p>
 *
 *  @example
 *  var my_view = new core.View ({id: "my_view"}).init ();
 *  var recognizer = new RotationRecognizer ({
 *    didRotationChange : function (rotation, event) {
 *      my_view.rotation = rotation;
 *    }
 *  });
 *  my_view.addPointerRecognizer (recognizer);
 *
 *  @author David Thevenin
 *
 *  @constructor
 *   Creates a new recognizer.RotationRecognizer.
 *
 * @name recognizer.RotationRecognizer
 *
 * @param {ReconizerDelegate} delegate the delegate [mandatory]
 */
function RotationRecognizer (delegate) {
  this.parent = PointerRecognizer;
  this.parent (delegate);
  this.constructor = RotationRecognizer;
}

RotationRecognizer.prototype = {

  /**
   * @name recognizer.RotationRecognizer#init
   * @function
   * @protected
   */
  init : function (obj) {
    PointerRecognizer.prototype.init.call (this, obj);
    
    this.addPointerListener (this.obj, core.GESTURE_START, this.obj);
    this.reset ();
  },

  /**
   * @name recognizer.RotationRecognizer#uninit
   * @function
   * @protected
   */
  uninit : function () {
    this.removePointerListener (this.obj, core.GESTURE_START, this.obj);
  },

  /**
   * @name recognizer.RotationRecognizer#gestureStart
   * @function
   * @protected
   */
  gestureStart: function (e) {
    this.addPointerListener (document, core.GESTURE_CHANGE, this.obj);
    this.addPointerListener (document, core.GESTURE_END, this.obj);

    try {
      if (this.delegate && this.delegate.didRotationStart)
        this.delegate.didRotationStart (event);
    } catch (e) {
      if (e.stack) console.log (e.stack);
      console.log (e);
    }

    return false;
  },

  /**
   * @name recognizer.RotationRecognizer#gestureChange
   * @function
   * @protected
   */
  gestureChange: function (event) {
    try {
      if (this.delegate && this.delegate.didRotationChange)
        this.delegate.didRotationChange (event.rotation, event);
    } catch (e) {
      if (e.stack) console.log (e.stack);
      console.log (e);
    }
  },

  /**
   * @name recognizer.RotationRecognizer#gestureEnd
   * @function
   * @protected
   */
  gestureEnd: function (e) {
    this.removePointerListener (document, core.GESTURE_CHANGE, this.obj);
    this.removePointerListener (document, core.GESTURE_END, this.obj);

    try {
      if (this.delegate && this.delegate.didRotationEnd)
        this.delegate.didRotationEnd (event);
    } catch (e) {
      if (e.stack) console.log (e.stack);
      console.log (e);
    }
  },

  /**
   * @name recognizer.RotationRecognizer#pointerCancel
   * @function
   * @protected
   */
  pointerCancel: function (e) {
    return this.pointerEnd (e);
  }
};
util.extendClass (RotationRecognizer, PointerRecognizer);
