/*
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

