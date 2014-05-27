
var rttFramebuffer;
var rttTexture;

function initPickBuffer()  {
  rttFramebuffer = gl_ctx.createFramebuffer();
  gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, rttFramebuffer);
  rttFramebuffer.width = frame_size [0] * gl_device_pixel_ratio;
  rttFramebuffer.height = frame_size [1] * gl_device_pixel_ratio;

  rttTexture = gl_ctx.createTexture();

  gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, rttTexture);
  gl_ctx.texImage2D (gl_ctx.TEXTURE_2D, 0, gl_ctx.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, gl_ctx.RGBA, gl_ctx.UNSIGNED_BYTE, null);

  function isPowerOfTwo (x) {
    return (x !== 0) && ((x & (x - 1)) === 0);
  }

  gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, rttTexture);
  gl_ctx.texImage2D (gl_ctx.TEXTURE_2D, 0, gl_ctx.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, gl_ctx.RGBA, gl_ctx.UNSIGNED_BYTE, null);

  // POT images
  if (isPowerOfTwo (frame_size [0] * gl_device_pixel_ratio) &&
      isPowerOfTwo (frame_size [1] * gl_device_pixel_ratio)) {
  
    gl_ctx.texParameteri
      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MAG_FILTER, gl_ctx.LINEAR);
    
    gl_ctx.texParameteri
      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.NEAREST_MIPMAP_LINEAR);

    gl_ctx.generateMipmap (gl_ctx.TEXTURE_2D);
  }
  // NPOT images
  else {
    //gl_ctx.NEAREST is also allowed, instead of gl_ctx.LINEAR, as neither mipmap.
    gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.LINEAR);
    //Prevents s-coordinate wrapping (repeating).
    gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_S, gl_ctx.CLAMP_TO_EDGE);
    //Prevents t-coordinate wrapping (repeating).
    gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_T, gl_ctx.CLAMP_TO_EDGE);
  }

  var renderbuffer = gl_ctx.createRenderbuffer();
  gl_ctx.bindRenderbuffer(gl_ctx.RENDERBUFFER, renderbuffer);
  gl_ctx.renderbufferStorage(gl_ctx.RENDERBUFFER, gl_ctx.DEPTH_COMPONENT16, rttFramebuffer.width, rttFramebuffer.height);

  gl_ctx.framebufferTexture2D(gl_ctx.FRAMEBUFFER, gl_ctx.COLOR_ATTACHMENT0, gl_ctx.TEXTURE_2D, rttTexture, 0);
  gl_ctx.framebufferRenderbuffer(gl_ctx.FRAMEBUFFER, gl_ctx.DEPTH_ATTACHMENT, gl_ctx.RENDERBUFFER, renderbuffer);

  gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, null);
  gl_ctx.bindRenderbuffer(gl_ctx.RENDERBUFFER, null);
  gl_ctx.bindFramebuffer(gl_ctx.FRAMEBUFFER, null);
}

function pickUp (event) {
  if (!window.render_ui) return;
  
  if (!event) return;
  
  var x = event.clientX;
  var y = event.clientY;
  
  if (vs.util.isUndefined (x) || vs.util.isUndefined (y)) {
    var list = event.targetPointerList;
    if (!list) list = event.targetTouches;
    if (!list) list = event.touches;
    
    if (!list || list.length === 0) return;
    
    var touch = list[0];
    x = touch.clientX;
    y = touch.clientY;
  }
  
  return _pickUp (x * gl_device_pixel_ratio, y * gl_device_pixel_ratio);
}

var pickUp_pixelColor = new Uint8Array (4);
function _pickUp (x, y) {
  
  DropTick = 1;

  gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, rttFramebuffer);

  // Clear GL Surface
  gl_ctx.clearColor(0.0, 0.0, 0.0, 1.0);

  render_ui (performance.now (), 1);
  
  y = frame_size[1] * gl_device_pixel_ratio - y;

  // Read Pixel Color
  gl_ctx.readPixels(x, y,1,1,gl_ctx.RGBA,gl_ctx.UNSIGNED_BYTE, pickUp_pixelColor);
                  
  // Return GL Clear To User Colors
  gl_ctx.clearColor (0, 0, 0, 1);
        
  gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, null);
  
  function getGLIDfromColor (pickUp_pixelColor) {
    return pickUp_pixelColor [0] + pickUp_pixelColor [1] * 256 + pickUp_pixelColor [2] * 65536;
  }
  var gl_id = getGLIDfromColor (pickUp_pixelColor)

  return GL_VIEWS [gl_id];
}

var __pointer_start_activated = 0;
function __gl_activate_pointer_start () {
  if (__pointer_start_activated === 0) {
    GL_CANVAS.addEventListener (POINTER_START, pointer_start);
  }
  __pointer_start_activated ++;
}

function __gl_deactivate_pointer_start () {
  if (__pointer_start_activated === 0) return;
  if (__pointer_start_activated === 1) {
    GL_CANVAS.removeEventListener (POINTER_START, pointer_start);
  }
  
  __pointer_start_activated --;
}

var __pointer_move_activated = 0;
function __gl_activate_pointer_move () {
  if (__pointer_move_activated === 0) {
    GL_CANVAS.addEventListener (POINTER_MOVE, pointer_move);
  }
  __pointer_move_activated ++;
}

function __gl_deactivate_pointer_move () {
  if (__pointer_move_activated === 0) return;
  if (__pointer_move_activated === 1) {
    GL_CANVAS.removeEventListener (POINTER_MOVE, pointer_move);
  }
  
  __pointer_move_activated --;
}

var __pointer_end_activated = 0;
function __gl_activate_pointer_end () {
  if (__pointer_end_activated === 0) {
    GL_CANVAS.addEventListener (POINTER_END, pointer_end);
  }
  __pointer_end_activated ++;
}

function __gl_deactivate_pointer_end () {
  if (__pointer_end_activated === 0) return;
  if (__pointer_end_activated === 1) {
    GL_CANVAS.removeEventListener (POINTER_END, pointer_end);
  }
  
  __pointer_end_activated --;
}


function pointer_start (event) {
  var obj = pickUp (event);
  if (obj) {
    dispatch_event (POINTER_START, obj, event);
  }
}

function pointer_move (event) {
  var obj = pickUp (event);
  if (obj) {
    dispatch_event (POINTER_MOVE, obj, event);
  }
}

function pointer_end (event) {
  var obj = pickUp (event);
  if (obj) {
    dispatch_event (POINTER_END, obj, event);
  }
}/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

/**
 * This is the constructor for new PointerEvents.
 *
 * New Pointer Events must be given a type, and an optional dictionary of
 * initialization properties.
 *
 * Due to certain platform requirements, events returned from the constructor
 * identify as MouseEvents.
 *
 * @constructor
 * @param {String} inType The type of the event to create.
 * @param {Object} [inDict] An optional dictionary of initial event properties.
 * @return {Event} A new PointerEvent of type `inType` and initialized with properties from `inDict`.
 */

var MOUSE_PROPS = [
  'bubbles',
  'cancelable',
  'view',
  'detail',
  'screenX',
  'screenY',
  'clientX',
  'clientY',
  'ctrlKey',
  'altKey',
  'shiftKey',
  'metaKey',
  'button',
  'relatedTarget',
  'pageX',
  'pageY'
];

var MOUSE_DEFAULTS = [
  false,
  false,
  null,
  null,
  0,
  0,
  0,
  0,
  false,
  false,
  false,
  false,
  0,
  null,
  0,
  0
];

function GLEvent () {
  this.path = [];
}

GLEvent.prototype.init = function (type, bubbles, cancelable) {
  this.bubbles = bubbles || false;
  this.cancelBubble = false;
  this.cancelable = cancelable || false;
  this.clipboardData = undefined;
  this.currentTarget = null;
  this.defaultPrevented = false;
  this.eventPhase = 0;
  this.path.length = 0;
  this.returnValue = true;
  this.srcElement = null;
  this.target = null;
  this.timeStamp = Date.now ();
  this.type = type || '';
}

GLEvent.prototype.setSrcElement = function (src) {
  this.srcElement = src;
  this.target = src;
  
  // legacy code
  this.currentTarget = src;

  while (src) {
    this.path.push (src);
    src = src.__parent;
  }
}

GLEvent.prototype.setTarget = function (src) {
  this.target = src;
  
  // legacy code
  this.currentTarget = src;
}

GLEvent.prototype.preventDefault = function () {
  this.defaultPrevented = true;
}

function GLPointerEvent (inType, inDict, src) {
  GLEvent.call (this);

  this.pointerList = [];
  this.targetPointerList = [];
  this.changedPointerList = [];
  
  // define the properties of the PointerEvent interface
  this.init (inType, inDict, src);
}
util.extendClass (GLPointerEvent, GLEvent);

var defaultInDict = Object.create (null);

GLPointerEvent.prototype.init = function (inType, inDict, src) {
  inDict = inDict || defaultInDict;
  
  GLEvent.prototype.init.call (
    this,
    inType,
    inDict.bubbles || false,
    inDict.cancelable || false
  );

  var e = this, i = 0, length_props = MOUSE_PROPS.length, prop;
  
  e.setSrcElement (src);
  e.setTarget (src);
  
  // define inherited MouseEvent properties
  for (; i < length_props; i++) {
    prop = MOUSE_PROPS [i];
    e [prop] = inDict [prop] || MOUSE_DEFAULTS [i];
  }
  e.buttons = inDict.buttons || 0;

  // Spec requires that pointers without pressure specified use 0.5 for down
  // state and 0 for up state.
  var pressure = 0;
  if (inDict.pressure) {
    pressure = inDict.pressure;
  } else {
    pressure = e.buttons ? 0.5 : 0;
  }

  // add x/y properties aliased to clientX/Y
  e.x = e.clientX;
  e.y = e.clientY;

  // define the properties of the PointerEvent interface
  e.pointerId = inDict.pointerId || 0;
  e.width = inDict.width || 0;
  e.height = inDict.height || 0;
  e.pressure = pressure;
  e.tiltX = inDict.tiltX || 0;
  e.tiltY = inDict.tiltY || 0;
  e.pointerType = inDict.pointerType || '';
  e.hwTimestamp = inDict.hwTimestamp || 0;
  e.isPrimary = inDict.isPrimary || false;
  
  e.nbPointers = 0;
  e.pointerList.length = 0;
  e.targetPointerList.length = 0;
  e.changedPointerList.length = 0;
};

GLPointerEvent.prototype.setSrcElement = function (src) {
  GLEvent.prototype.setSrcElement.call (this, src);

  function updatePointerList (list) {
    var i = 0, l = list.length, pointer;
    
    for (; i < l; i++) {
      pointer = list [i];      
      pointer.srcElement = src;
    }
  }
  
  updatePointerList (this.pointerList);
  updatePointerList (this.targetPointerList);
  updatePointerList (this.changedPointerList);
}

GLPointerEvent.prototype.setTarget = function (src) {
  GLEvent.prototype.setTarget.call (this, src);
  
  function updatePointerList (list) {
    var i = 0, l = list.length, pointer;
    
    for (; i < l; i++) {
      pointer = list [i];
      
      pointer.target = src;
      pointer.currentTarget = src;
    }
  }
  
  updatePointerList (this.pointerList);
  updatePointerList (this.targetPointerList);
  updatePointerList (this.changedPointerList);
}

function Pointer (identifier)
{
  this.identifier = identifier;
}

Pointer.prototype.configure =
  function (event, srcElement, target, clientX, clientY)
{
  this.pageX = event.pageX;
  this.pageY = event.pageY;
  if (clientX !== undefined) this.clientX = clientX;
  else this.clientX = event.clientX;
  if (clientY !== undefined) this.clientY = clientY;
  else this.clientY = event.clientY;
  
  if (srcElement) this.srcElement = srcElement;
  else this.srcElement = event.srcElement;
  
  if (target) this.target = target;
  else this.target = event.target;
  
  // Legacy property
  if (target) this.currentTarget = target;
  else this.currentTarget = event.currentTarget;
}

Pointer._pointers = [];
Pointer.getPointer = function (identifier) {
  var pointer = Pointer._pointers [identifier];
  
  if (!pointer) {
    pointer = new Pointer (identifier);
    Pointer._pointers [identifier] = pointer;
  }
  
  return pointer;
}

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

/* touch event messages */

function setupMousePointerEvent () {

  POINTER_START = 'mousedown';
  POINTER_MOVE = 'mousemove';
  POINTER_END = 'mouseup';
  POINTER_CANCEL = null;

  // TODO(smus): Come up with a better solution for this. This is bad because
  // it might conflict with a touch ID. However, giving negative IDs is also
  // bad because of code that makes assumptions about touch identifiers being
  // positive integers.
  var MOUSE_ID = 31337;
  
  var mouse_event = new GLPointerEvent ();

  function buildMouseList (type, evt, obj)
  {
    mouse_event.init (type, evt, obj);
        
    var
      pointers = mouse_event.targetPointerList,
      pointer = Pointer.getPointer (MOUSE_ID);
      
    pointer.configure (mouse_event, obj, obj, PointerTypes.MOUSE);
    pointers.push (pointer);
    
    if (type === POINTER_END || type == POINTER_CANCEL) {
      mouse_event.nbPointers = 1;
      mouse_event.changedPointerList = pointers;
    }
    else {
      mouse_event.nbPointers = 0;
      mouse_event.pointerList = pointers;
    }

    return mouse_event;
  }

  buildEvent = buildMouseList;
}


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

function setupTouchEvent () {

  POINTER_START = 'touchstart';
  POINTER_MOVE = 'touchmove';
  POINTER_END = 'touchend';
  POINTER_CANCEL = 'touchcancel';

  /**
   * Returns an array of all pointers currently on the screen.
   */

  var pointerEvents = [];
  
  var pointer_event = new GLPointerEvent ();

  function buildTouchList (type, evt, obj, target_id)
  {
    var e = pointer_event, touch, pointer;
    e.init (type, evt, obj);
    
    e.nbPointers = evt.touches.length;
    
    var pointers = e.pointerList;
    for (var i = 0; i < e.nbPointers; i++)
    {
      touch = evt.touches[i];
      
      pointer = Pointer.getPointer (touch.identifier);
      pointer.configure (touch, obj, obj, PointerTypes.TOUCH);
      
      pointers.push (pointer);
    }

    pointers = e.targetPointerList;
    for (var i = 0; i < evt.targetTouches.length; i++)
    {
      touch = evt.targetTouches[i];
      if (target_id && pointerEvents [touch.identifier] != target_id) continue;

      pointer = Pointer.getPointer (touch.identifier);
      pointer.configure (touch, obj, obj, PointerTypes.TOUCH);

      pointers.push (pointer);
    }

    pointers = e.changedPointerList;
    for (var i = 0; i < evt.changedTouches.length; i++)
    {
      touch = evt.changedTouches[i];

      pointer = Pointer.getPointer (touch.identifier);
      pointer.configure (touch, obj, obj, PointerTypes.TOUCH);

      pointers.push (pointer);
    }

    return e;
  }

/*************** Touch event handlers *****************/


/*************************************************************/

  buildEvent = buildTouchList;
}
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

/* touch event messages */
var EVENT_SUPPORT_TOUCH = false;
var EVENT_SUPPORT_GESTURE = false;
var hasPointer = window.navigator.pointerEnabled;
var hasMSPointer = window.navigator.msPointerEnabled;

if (typeof document != "undefined" && 'createTouch' in document)
  EVENT_SUPPORT_TOUCH = true;

else if (hasPointer || hasMSPointer) { EVENT_SUPPORT_TOUCH = true; }

else if (typeof document != "undefined" &&
    window.navigator && window.navigator.userAgent)
{
  if (window.navigator.userAgent.indexOf ('Android') !== -1 ||
      window.navigator.userAgent.indexOf ('BlackBerry') !== -1)
  { EVENT_SUPPORT_TOUCH = true; }
}

var PointerTypes = {
  TOUCH: 2,
  PEN: 3,
  MOUSE: 4
};

var POINTER_START, POINTER_MOVE, POINTER_END, POINTER_CANCEL, buildEvent;

if (EVENT_SUPPORT_TOUCH) setupTouchEvent ();
//else if (EVENT_SUPPORT_TOUCH && hasMSPointer) setupMSEvent ();
else setupMousePointerEvent ();

function getBindingIndex (target, type, listener)
{
  if (!type || !listener || !listener.__event_listeners) return -1;
  for (var i = 0; i < listener.__event_listeners.length; i++)
  {
    var binding = listener.__event_listeners [i];
    if (binding.target === target &&
        binding.type === type &&
        binding.listener === listener)
      return i;
  }
  return -1;
}

/**
 * Option 2: Replace addEventListener with a custom version.
 */
function addPointerListener (node, type, listener, useCapture)
{
  if (!type) return;
  
  if (!listener) {
    console.error ("addPointerListener no listener");
    return;
  }
  var func = listener;
  if (!util.isFunction (listener))
  {
    func = listener.handleEvent;
    if (util.isFunction (func)) func = func.bind (listener);
  }

  if (getBindingIndex (node, type, listener) !== -1)
  {
    console.error ("addPointerListener binding already existing");
    return;
  }

  if (!listener.__event_listeners) listener.__event_listeners = [];

  var binding = {
    target: node,
    type: type,
    listener: listener
  };
  listener.__event_listeners.push (binding);

  binding.handler = func;
  if (node instanceof GLView) {
    node.addEventListener (type, binding.handler, useCapture);
  }
  else if (node instanceof Document) {
    binding.doc_handler = function (event) {
      var e = buildEvent (type, event, node);
      if (vs.util.isFunction (binding.handler)) {
        binding.handler.call (node, e);
      }
      else if (vs.util.isFunction (binding.handler.handleEvent)) {
        binding.handler.handleEvent.call (binding.handler, e);
      }
    };
    node.addEventListener (type, binding.doc_handler, useCapture);
  }
}

function removePointerListener (node, type, listener, useCapture)
{
  if (!type) return;
  
  if (!listener) {
    console.error ("removePointerListener no listener");
    return;
  }

  var index = getBindingIndex (node, type, listener);
  if (index === -1)
  {
    console.error ("removePointerListener no binding");
    return;
  }
  var binding = listener.__event_listeners [index];
  listener.__event_listeners.remove (index);

  if (node instanceof GLView) {
    node.removeEventListener (type, binding.handler, useCapture);
  }
  else if (node instanceof Document) {
    node.removeEventListener (type, binding.doc_handler, useCapture);
  }
  delete (binding);
}

function _dispatch_event (obj, list, e) {
  e.currentTarget = obj;
  
  list.forEach (function (handler) {
    if (vs.util.isFunction (handler)) {
      handler.call (obj, e);
    }
    else if (vs.util.isFunction (handler.handleEvent)) {
      handler.handleEvent.call (handler, e);
    }
  });
}

function dispatch_event (type, obj, event) {
  var event_type;
  
  if (type === POINTER_START) event_type = "_pointer_start";
  else if (type === POINTER_MOVE) event_type = "_pointer_move";
  else if (type === POINTER_END || type === POINTER_END) event_type = "_pointer_end";

  var e = buildEvent (type, event, obj);
  var path = e.path, list;
  for (i = 0; i < path.length; i ++) {
    obj = path [i];
    list = obj[event_type];
    if (list && list.length) {
      e.setTarget (obj);
      _dispatch_event (obj, list, e);
    }
  }
}

/********************************************************************
                      Export
*********************************************************************/
vs.removePointerListener = removePointerListener;
vs.addPointerListener = addPointerListener;
vs.PointerTypes = PointerTypes;

/** 
 * Start pointer event (mousedown, touchstart, )
 * @name vs.POINTER_START
 * @type {String}
 * @const
 */ 
vs.POINTER_START = POINTER_START;

/** 
 * Move pointer event (mousemove, touchmove, )
 * @name vs.POINTER_MOVE 
 * @type {String}
 * @const
 */ 
vs.POINTER_MOVE = POINTER_MOVE;

/** 
 * End pointer event (mouseup, touchend, )
 * @name vs.POINTER_END 
 * @type {String}
 * @const
 */ 
vs.POINTER_END = POINTER_END;

/** 
 * Cancel pointer event (mouseup, touchcancel, )
 * @name vs.POINTER_CANCEL 
 * @type {String}
 * @const
 */ 
vs.POINTER_CANCEL = POINTER_CANCEL;
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
 *  The vs.ui.DragRecognizer class
 *
 *  @extends vs.ui.PointerRecognizer
 *
 *  @class
 *  vs.ui.DragRecognizer is a concrete subclass of vs.ui.PointerRecognizer
 *  that looks for drag gestures. When the user moves
 *  the fingers, the underlying view should translate in a corresponding
 *  direction and speed...<br />
 *
 *  The DragRecognizer delegate has to implement following methods:
 *  <ul>
 *    <li /> didDragStart (event, comp). Call when the drag start.
 *    <li /> didDragEnd (event, comp). Call when the drag end.
 *    <li /> didDrag (drag_info, event, comp). Call when the element is dragged.
 *      drag_info = {dx: dx, dy:dy}, the drag delta form the beginning.
 *  </ul>
 *  <p>
 *
 *  @example
 *  var my_view = new vs.ui.View ({id: "my_view"}).init ();
 *  var recognizer = new DragRecognizer ({
 *    didDrag : function (drag_info, event) {
 *      my_view.translation = [drag_info.dx, drag_info.dy];
 *    },
 *    didDragEnd : function (event) {
 *      // save drag translation
 *      my_view.flushTransformStack ();
 *    }
 *  });
 *  my_view.addPointerRecognizer (recognizer);
 *
 *  @author David Thevenin
 *
 *  @constructor
 *   Creates a new vs.ui.DragRecognizer.
 *
 * @name vs.ui.DragRecognizer
 *
 * @param {ReconizerDelegate} delegate the delegate [mandatory]
 */
function DragRecognizer (delegate) {
  this.parent = vs.ui.PointerRecognizer;
  this.parent (delegate);
  this.constructor = DragRecognizer;     
}

DragRecognizer.prototype = {

  __is_dragged: false,
  
  /**
   * @name vs.ui.DragRecognizer#init
   * @function
   * @protected
   */
  init : function (obj) {
    vs.ui.PointerRecognizer.prototype.init.call (this, obj);
    
    this.addPointerListener (this.obj, core.POINTER_START, this.obj);
    this.reset ();
  },

  /**
   * @name vs.ui.DragRecognizer#uninit
   * @function
   * @protected
   */
  uninit : function () {
    this.removePointerListener (this.obj, core.POINTER_START, this.obj);
  },

  /**
   * @name vs.ui.DragRecognizer#pointerStart
   * @function
   * @protected
   */
  pointerStart: function (e) {
    if (this.__is_dragged) { return; }
    // prevent multi touch events
    if (!e.targetPointerList || e.targetPointerList.length > 1) { return; }

    var pointer = e.targetPointerList [0];

    this.__start_x = pointer.pageX;
    this.__start_y = pointer.pageY;
    this.__pointer_id = pointer.identifier;
    this.__is_dragged = true;

    this.addPointerListener (document, core.POINTER_END, this.obj);
    this.addPointerListener (document, core.POINTER_MOVE, this.obj);
  
    try {
      if (this.delegate && this.delegate.didDragStart)
        this.delegate.didDragStart (e.targetPointerList[0].target, e);
    } catch (exp) {
      if (exp.stack) console.log (exp.stack);
      console.log (exp);
    }
    return false;
  },

  /**
   * @name vs.ui.DragRecognizer#pointerMove
   * @function
   * @protected
   */
  pointerMove: function (e) {
    if (!this.__is_dragged) { return; }

    var i = 0, l = e.targetPointerList.length, pointer, dx, dy;
    for (; i < l; i++) {
      pointer = e.targetPointerList [i];
      if (pointer.identifier === this.__pointer_id) { break; }
      pointer = null;
    }
    if (!pointer) { return; }

    dx = pointer.pageX - this.__start_x;
    dy = pointer.pageY - this.__start_y;
    
    try {
      if (this.delegate && this.delegate.didDrag)
        this.delegate.didDrag ({dx: dx, dy:dy}, e.targetPointerList[0].target, e);
    } catch (exp) {
      if (exp.stack) console.log (exp.stack);
      console.log (exp);
    }
  },

  /**
   * @name vs.ui.DragRecognizer#pointerEnd
   * @function
   * @protected
   */
  pointerEnd: function (e) {
    if (!this.__is_dragged) { return; }

    var i = 0, l = e.changedPointerList.length, pointer, dx, dy;
    for (; i < l; i++) {
      pointer = e.changedPointerList [i];
      if (pointer.identifier === this.__pointer_id) { break; }
      pointer = null;
    }
    if (!pointer) { return; }

    this.__is_dragged = false;
    this.__start_x = undefined;
    this.__start_y = undefined;
    this.__pointer_id = undefined;
  
    this.removePointerListener (document, core.POINTER_END, this.obj);
    this.removePointerListener (document, core.POINTER_MOVE, this.obj);

    try {
      if (this.delegate && this.delegate.didDragEnd)
        this.delegate.didDragEnd (e.changedPointerList[0].target, e);
    } catch (exp) {
      if (exp.stack) console.log (exp.stack);
      console.log (exp);
    }
  },

  /**
   * @name vs.ui.DragRecognizer#pointerCancel
   * @function
   * @protected
   */
  pointerCancel: function (e) {
    return this.pointerEnd (e);
  }
};
vs.util.extendClass (DragRecognizer, vs.ui.PointerRecognizer);

/********************************************************************
                      Export
*********************************************************************/
/** @private */
vs.ui.DragRecognizer = DragRecognizer;/*
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
 *  The vs.ui.PinchRecognizer class
 *
 *  @extends vs.ui.PointerRecognizer
 *
 *  @class
 *  The vs.ui.PinchRecognizer is a concrete subclass of vs.ui.PointerRecognizer
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
 *  var my_view = new vs.ui.View ({id: "my_view"}).init ();
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
 *   Creates a new vs.ui.PinchRecognizer.
 *
 * @name vs.ui.PinchRecognizer
 *
 * @param {ReconizerDelegate} delegate the delegate [mandatory]
 */
function PinchRecognizer (delegate) {
  this.parent = vs.ui.PointerRecognizer;
  this.parent (delegate);
  this.constructor = PinchRecognizer;
}

PinchRecognizer.prototype = {

  /**
   * @name vs.ui.PinchRecognizer#init
   * @function
   * @protected
   */
  init : function (obj) {
    vs.ui.PointerRecognizer.prototype.init.call (this, obj);
    
    this.addPointerListener (this.obj, core.GESTURE_START, this.obj);
    this.reset ();
  },

  /**
   * @name vs.ui.PinchRecognizer#uninit
   * @function
   * @protected
   */
  uninit : function () {
    this.removePointerListener (this.obj, core.GESTURE_START, this.obj);
  },

  /**
   * @name vs.ui.PinchRecognizer#gestureStart
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
   * @name vs.ui.PinchRecognizer#gestureChange
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
   * @name vs.ui.PinchRecognizer#gestureEnd
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
   * @name vs.ui.PinchRecognizer#pointerCancel
   * @function
   * @protected
   */
  pointerCancel: function (e) {
    return this.pointerEnd (e);
  }
};
vs.util.extendClass (PinchRecognizer, vs.ui.PointerRecognizer);

/********************************************************************
                      Export
*********************************************************************/
/** @private */
vs.ui.PinchRecognizer = PinchRecognizer;/*
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
 *  The vs.ui.RotationRecognizer class
 *
 *  @extends vs.ui.PointerRecognizer
 *
 *  @class
 *  vs.ui.RotationRecognizer is a concrete subclass of vs.ui.PointerRecognizer
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
 *  var my_view = new vs.ui.View ({id: "my_view"}).init ();
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
 *   Creates a new vs.ui.RotationRecognizer.
 *
 * @name vs.ui.RotationRecognizer
 *
 * @param {ReconizerDelegate} delegate the delegate [mandatory]
 */
function RotationRecognizer (delegate) {
  this.parent = vs.ui.PointerRecognizer;
  this.parent (delegate);
  this.constructor = RotationRecognizer;
}

RotationRecognizer.prototype = {

  /**
   * @name vs.ui.RotationRecognizer#init
   * @function
   * @protected
   */
  init : function (obj) {
    vs.ui.PointerRecognizer.prototype.init.call (this, obj);
    
    this.addPointerListener (this.obj, core.GESTURE_START, this.obj);
    this.reset ();
  },

  /**
   * @name vs.ui.RotationRecognizer#uninit
   * @function
   * @protected
   */
  uninit : function () {
    this.removePointerListener (this.obj, core.GESTURE_START, this.obj);
  },

  /**
   * @name vs.ui.RotationRecognizer#gestureStart
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
   * @name vs.ui.RotationRecognizer#gestureChange
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
   * @name vs.ui.RotationRecognizer#gestureEnd
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
   * @name vs.ui.RotationRecognizer#pointerCancel
   * @function
   * @protected
   */
  pointerCancel: function (e) {
    return this.pointerEnd (e);
  }
};
vs.util.extendClass (RotationRecognizer, vs.ui.PointerRecognizer);

/********************************************************************
                      Export
*********************************************************************/
/** @private */
vs.ui.RotationRecognizer = RotationRecognizer;/*
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
 *  The vs.ui.TapRecognizer class
 *
 *  @extends vs.ui.PointerRecognizer
 *
 *  @class
 *  vs.ui.TapRecognizer is a concrete subclass of vs.ui.PointerRecognizer that
 *  looks for single or multiple taps/clicks.<br />
 *
 *  The TapRecognizer delegate has to implement following methods:
 *  <ul>
 *    <li /> didTouch (comp, target, event). Call when the element is touched; It useful to
 *      implement this method to implement a feedback on the event (for instance
 *      add a pressed class)
 *    <li /> didUntouch (comp, target, event). Call when the element is untouched; It useful to
 *      implement this method to implement a feedback on the event (for instance
 *      remove a pressed class)
 *    <li /> didTap (nb_tap, comp, target, event). Call when the element si tap/click. nb_tap
 *      is the number of tap/click.
 *  </ul>
 *  <p>
 *
 *  @example
 *  var my_view = new vs.ui.View ({id: "my_view"}).init ();
 *  var recognizer = new TapRecognizer ({
 *    didTouch : function (comp) {
 *      comp.addClassName ("pressed");
 *    },
 *    didUntouch : function (comp) {
 *      comp.removeClassName ("pressed");
 *    },
 *    didTap : function (nb_tap, view) {
 *      comp.view.hide ();
 *    }
 *  });
 *  my_view.addPointerRecognizer (recognizer);
 *
 *  @author David Thevenin
 *
 *  @constructor
 *   Creates a new vs.ui.TapRecognizer.
 *
 * @name vs.ui.TapRecognizer
 *
 * @param {ReconizerDelegate} delegate the delegate [mandatory]
 */
function TapRecognizer (delegate) {
  this.parent = vs.ui.PointerRecognizer;
  this.parent (delegate);
  this.constructor = TapRecognizer;
}

var MULTI_TAP_DELAY = 100;

TapRecognizer.prototype = {

  __is_touched: false,
  __unselect_time_out: 0,
  __unselect_clb: null,
  __did_tap_time_out: 0,
  __tap_mode: 0,

  /**
   * @name vs.ui.TapRecognizer#init
   * @function
   * @protected
   */
  init : function (obj) {
    vs.ui.PointerRecognizer.prototype.init.call (this, obj);
    
    this.addPointerListener (this.obj, core.POINTER_START, this.obj);
    this.reset ();
  },

  /**
   * @name vs.ui.TapRecognizer#uninit
   * @function
   * @protected
   */
  uninit : function () {
    this.removePointerListener (this.obj, core.POINTER_START, this.obj);
  },

  /**
   * @name vs.ui.TapRecognizer#pointerStart
   * @function
   * @protected
   */
  pointerStart: function (e) {
    if (this.__is_touched) { return; }
    // prevent multi touch events
    if (e.targetPointerList.length === 0 || e.nbPointers > 1) { return; }
    
    if (this.__tap_mode === 0) {
      this.__tap_mode = 1;
    }

    if (this.__unselect_time_out) {
      clearTimeout (this.__unselect_time_out);
      this.__unselect_time_out = 0;
      if (this.__unselect_clb) this.__unselect_clb ();
    }

    this.__tap_elem = e.targetPointerList[0].target;

    try {
      if (this.delegate && this.delegate.didTouch)
        this.delegate.didTouch (this.__tap_elem, e);
    } catch (exp) {
      if (exp.stack) console.log (exp.stack);
      console.log (exp);
    }

    if (this.__did_tap_time_out) {
      this.__tap_mode ++;
      clearTimeout (this.__did_tap_time_out);
      this.__did_tap_time_out = 0;
    }
  
    this.addPointerListener (document, core.POINTER_END, this.obj);
    this.addPointerListener (document, core.POINTER_MOVE, this.obj);
  
    this.__start_x = e.targetPointerList[0].pageX;
    this.__start_y = e.targetPointerList[0].pageY;
    this.__is_touched = true;
  
    return false;
  },

  /**
   * @name vs.ui.TapRecognizer#pointerMove
   * @function
   * @protected
   */
  pointerMove: function (e) {
    // do not manage event for other targets
    if (!this.__is_touched || e.targetPointerList.length === 0) { return; }

    var dx = e.targetPointerList[0].pageX - this.__start_x;
    var dy = e.targetPointerList[0].pageY - this.__start_y;
    
    if (Math.abs (dx) + Math.abs (dy) < vs.ui.View.MOVE_THRESHOLD) {
      // we still in selection mode
      return false;
    }

    // cancel the selection mode
    this.removePointerListener (document, core.POINTER_END, this.obj);
    this.removePointerListener (document, core.POINTER_MOVE, this.obj);
    this.__is_touched = false;

    try {
      if (this.delegate && this.delegate.didUntouch)
        this.delegate.didUntouch (this.__tap_elem, e);
    } catch (exp) {
      if (exp.stack) console.log (exp.stack);
      console.log (exp);
    }
  },

  /**
   * @name vs.ui.TapRecognizer#init
   * @function
   * @protected
   */
  pointerEnd: function (e) {
    if (!this.__is_touched) { return; }
    this.__is_touched = false;
    var
      self = this,
      target = self.__tap_elem,
      comp = (target)?target._comp_:null;
    
    self.__tap_elem = undefined;
  
    this.removePointerListener (document, core.POINTER_END, this.obj);
    this.removePointerListener (document, core.POINTER_MOVE, this.obj);

    if (this.delegate && this.delegate.didUntouch) {
      this.__unselect_clb = function () {
        try {
          self.delegate.didUntouch (target, e);
        } catch (exp) {
          if (exp.stack) console.log (exp.stack);
          console.log (exp);
        }
        self.__unselect_time_out = 0;
        delete (self.__unselect_clb);
      }
      this.__unselect_time_out = setTimeout (this.__unselect_clb, vs.ui.View.UNSELECT_DELAY);        
    }
    
    if (this.delegate && this.delegate.didTap) {
      this.__did_tap_time_out = setTimeout (function () {
        try {
          self.delegate.didTap (self.__tap_mode, target, e);
        } catch (exp) {
          if (exp.stack) console.log (exp.stack);
          console.log (exp);
        }
        self.__tap_mode = 0;
        self.__did_tap_time_out = 0;
      }, MULTI_TAP_DELAY);
    } else {
      self.__tap_mode = 0;
    }
  },

  /**
   * @name vs.ui.TapRecognizer#pointerCancel
   * @function
   * @protected
   */
  pointerCancel: function (e) {
    return this.pointerEnd (e);
  }
};
vs.util.extendClass (TapRecognizer, vs.ui.PointerRecognizer);

/********************************************************************
                      Export
*********************************************************************/
/** @private */
vs.ui.TapRecognizer = TapRecognizer;
