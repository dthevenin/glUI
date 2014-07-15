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
 *  The recognizer.PinchRecognizer class
 *
 *  @extends recognizer.PointerRecognizer
 *
 *  @class
 *  The recognizer.PinchRecognizer is a concrete subclass of recognizer.PointerRecognizer
 *  that looks for pinching gestures involving two touches. When the user moves
 *  the two fingers toward each other, the conventional meaning is zoom-out;<br />
 *  when the user moves the two fingers away from each other, the conventional
 *  meaning is zoom-in<br />
 *
 *  The PinchRecognizer delegate has to implement following methods:
 *  <ul>
 *    <li /> didPinchChange (scale, event, comp). Call when the element is pinched.
 *      scale is The scale factor relative to the points of the two touches
 *      in screen coordinates
 *    <li /> didPinchStart (event, comp). Call when the pinch start
 *    <li /> didPinchEnd (event, comp). Call when the pinch end
 *  </ul>
 *  <p>
 *
 *  @example
 *  var my_view = new core.View ({id: "my_view"}).init ();
 *  var recognizer = new PinchRecognizer ({
 *    didPinchChange : function (scale, event) {
 *      my_view.scaling = scale;
 *    },
 *    didPinchStart : function (event) {
 *      xxx
 *    },
 *    didPinchEnd : function (event) {
 *      mss
 *    }
 *  });
 *  my_view.addPointerRecognizer (recognizer);
 *
 *  @author David Thevenin
 *
 *  @constructor
 *   Creates a new recognizer.PinchRecognizer.
 *
 * @name recognizer.PinchRecognizer
 *
 * @param {ReconizerDelegate} delegate the delegate [mandatory]
 */
function PinchRecognizer (delegate) {
  this.parent = PointerRecognizer;
  this.parent (delegate);
  this.constructor = PinchRecognizer;
}

PinchRecognizer.prototype = {

  /**
   * @name recognizer.PinchRecognizer#init
   * @function
   * @protected
   */
  init : function (obj) {
    PointerRecognizer.prototype.init.call (this, obj);
    
    this.addPointerListener (this.obj, core.GESTURE_START, this.obj);
    this.reset ();
  },

  /**
   * @name recognizer.PinchRecognizer#uninit
   * @function
   * @protected
   */
  uninit : function () {
    this.removePointerListener (this.obj, core.GESTURE_START, this.obj);
  },

  /**
   * @name recognizer.PinchRecognizer#gestureStart
   * @function
   * @protected
   */
  gestureStart: function (e) {
    this.addPointerListener (document, core.GESTURE_CHANGE, this.obj);
    this.addPointerListener (document, core.GESTURE_END, this.obj);

    try {
      if (this.delegate && this.delegate.didPinchStart)
        this.delegate.didPinchStart (
          event.targetPointerList[0].target, event
        );
    } catch (e) {
      if (e.stack) console.log (e.stack);
      console.log (e);
    }
    return false;
  },

  /**
   * @name recognizer.PinchRecognizer#gestureChange
   * @function
   * @protected
   */
  gestureChange: function (event) {
    try {
      if (this.delegate && this.delegate.didPinchChange)
        this.delegate.didPinchChange (
          event.scale, event.targetPointerList[0].target, event
        );
    } catch (e) {
      if (e.stack) console.log (e.stack);
      console.log (e);
    }
  },

  /**
   * @name recognizer.PinchRecognizer#gestureEnd
   * @function
   * @protected
   */
  gestureEnd: function (e) {
    this.removePointerListener (document, core.GESTURE_CHANGE, this.obj);
    this.removePointerListener (document, core.GESTURE_END, this.obj);
    
    try {
      if (this.delegate && this.delegate.didPinchEnd)
        this.delegate.didPinchEnd (event.targetPointerList[0].target, event);
    } catch (e) {
      if (e.stack) console.log (e.stack);
      console.log (e);
    }
  },

  /**
   * @name recognizer.PinchRecognizer#pointerCancel
   * @function
   * @protected
   */
  pointerCancel: function (e) {
    return this.pointerEnd (e);
  }
};
util.extendClass (PinchRecognizer, PointerRecognizer);