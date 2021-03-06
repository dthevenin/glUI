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


var POINTER_START, POINTER_MOVE, POINTER_END, POINTER_CANCEL;

if (EVENT_SUPPORT_TOUCH)
{
  POINTER_START =
    hasPointer ?  'pointerdown' :
    hasMSPointer ? 'MSPointerDown' : 'touchstart';

  POINTER_MOVE =
    hasPointer ?  'pointermove' :
    hasMSPointer ? 'MSPointerMove' : 'touchmove';

  POINTER_END =
    hasPointer ?  'pointerup' :
    hasMSPointer ? 'MSPointerUp' : 'touchend';

  POINTER_CANCEL =
    hasPointer ?  'pointercancel' :
    hasMSPointer ? 'MSPointerCancel' : 'touchcancel';
}
else
{
  POINTER_START = 'mousedown';
  POINTER_MOVE = 'mousemove';
  POINTER_END = 'mouseup';
  POINTER_CANCEL = null;
}

// TODO(smus): Come up with a better solution for this. This is bad because
// it might conflict with a touch ID. However, giving negative IDs is also
// bad because of code that makes assumptions about touch identifiers being
// positive integers.
var MOUSE_ID = 31337;

function Pointer (event, type, identifier, clientX, clientY, event_bis)
{
  this.configure (event, clientX, clientY, event_bis)
  this.type = type;
  this.identifier = identifier;
}

Pointer.prototype.configure =
  function (evt, clientX, clientY, event_bis)
{
  this.pageX = evt.pageX;
  this.pageY = evt.pageY;
  if (typeof clientX !== "undefiend") this.clientX = clientX;
  if (typeof clientY !== "undefiend") this.clientY = clientY;
  
  if (evt.target) this.target = evt.target;
  else if (event_bis) this.target = event_bis.target;
  
  if (evt.currentTarget) this.currentTarget = evt.currentTarget;
  else if (event_bis) this.currentTarget = event_bis.currentTarget;
}

var PointerTypes = {
  TOUCH: 2,
  PEN: 3,
  MOUSE: 4
};

/**
 * Returns an array of all pointers currently on the screen.
 */

var pointerEvents = [];

function buildTouchList (evt, target_id)
{
  var pointers = [];
  evt.nbPointers = evt.touches.length;
  for (var i = 0; i < evt.nbPointers; i++)
  {
    var touch = evt.touches[i];
    var pointer = new Pointer (
      touch, PointerTypes.TOUCH, touch.identifier,
      touch.clientX, touch.clientY,
      evt
    );
    pointers.push (pointer);
  }
  evt.pointerList = pointers;
  pointers = [];
  for (var i = 0; i < evt.targetTouches.length; i++)
  {
    var touch = evt.targetTouches[i];
    if (target_id && pointerEvents [touch.identifier] != target_id) continue;
    var pointer = new Pointer (
      touch, PointerTypes.TOUCH, touch.identifier,
      touch.clientX, touch.clientY,
      evt
    );
    pointers.push (pointer);
  }
  evt.targetPointerList = pointers;
  pointers = [];
  for (var i = 0; i < evt.changedTouches.length; i++)
  {
    var touch = evt.changedTouches[i];
    var pointer = new Pointer (
      touch, PointerTypes.TOUCH, touch.identifier,
      evt.clientX, evt.clientY,
      evt
    );
    pointers.push (pointer);
  }
  evt.changedPointerList = pointers;
}

function buildMouseList (evt, remove)
{
  var pointers = [];
  pointers.push (new Pointer (
    evt, PointerTypes.MOUSE, MOUSE_ID,
    evt.layerX, evt.layerY
  ));
  if (!remove)
  {
    evt.nbPointers = 1;
    evt.pointerList = pointers;
    evt.targetPointerList = pointers;
    evt.changedPointerList = [];
  }
  else
  {
    evt.nbPointers = 0;
    evt.pointerList = [];
    evt.targetPointerList = pointers;
    evt.changedPointerList = pointers;
  }
}

var all_pointers = [];
var removed_pointers = [];

function buildMSPointerList (evt, remove, target_id)
{
  // Note: "this" is the element.
  var
    pointers = [],
    targetPointers = [],
    removePointers = [];
    
  var id = evt.pointerId, pointer = all_pointers [id];

  if (remove)
  {
    if (pointer)
    {
      removed_pointers [id] = pointer;
      delete (all_pointers [id]);
    }
    else
    {
      pointer = removed_pointers [id];
      if (!pointer)
      {
        pointer = new Pointer
          (evt, evt.pointerType, id, evt.layerX, evt.layerY);
        removed_pointers [id] = pointer;
      }
    }
    
    removed_pointers.forEach (function (pointer) {
      if (!pointer) return;

      removePointers.push (pointer);
    });

    removed_pointers = [];
  }
  else
  {
    if (pointer) {
      pointer.configure (evt);
    }
    else
    {
      pointer = new Pointer (evt, evt.pointerType, id, evt.layerX, evt.layerY);
      all_pointers [id] = pointer;
    }
  }

  all_pointers.forEach (function (pointer) {
    if (!pointer) return;
    
    pointers.push (pointer);
    if (target_id && pointerEvents [pointer.identifier] != target_id) return;
    targetPointers.push (pointer);
  });

  evt.nbPointers = pointers.length;
  evt.pointerList = pointers;
  evt.targetPointerList = targetPointers;
  evt.changedPointerList = removePointers;
}

/*************** Mouse event handlers *****************/

function mouseDownHandler (event, listener)
{
  buildMouseList (event);
  listener (event);
}

function mouseMoveHandler(event, listener)
{
  buildMouseList (event);
  listener (event);
}

function mouseUpHandler (event, listener)
{
  buildMouseList (event, true);
  listener (event);
}

/*************** Touch event handlers *****************/

function touchStartHandler (event, listener, target_id)
{
  var pointer, l = event.targetTouches.length;
  for (var i = 0; i < l; i++)
  {
    pointer = event.targetTouches [i];
    pointerEvents [pointer.identifier] = target_id;
  }
  buildTouchList (event);
  listener (event);
}

function touchMoveHandler (event, listener, target_id)
{
  buildTouchList (event, target_id);
  listener (event);
}

function touchEndHandler (event, listener)
{
  var pointer, l = event.changedTouches.length, i = 0;
  for (; i < l; i++)
  {
    pointer = event.changedTouches [i];
    delete (pointerEvents [pointer.identifier]);
  }
  buildTouchList (event);
  listener (event);
}

function touchCancelHandler (event, listener)
{
  buildTouchList (event);
  listener (event, listener);
}

/*************** MSIE Pointer event handlers *****************/

// remove the pointer from the list of availables pointer
var nbPointerListener = 0;
var msRemovePointer = function (evt) {
  var id = evt.pointerId, pointer = all_pointers [id];

  if (pointer)
  {
    removed_pointers [pointer.identifier] = pointer;
    delete (all_pointers [pointer.identifier]);
  }
  nbPointerListener --;

  if (nbPointerListener === 0)
  {
    document.removeEventListener (
      hasPointer ? 'pointerup' : 'MSPointerUp',
      msRemovePointer
    );
    document.removeEventListener (
      hasPointer ? 'pointercancel' : 'MSPointerCancel',
      msRemovePointer
    );
  }
}

function msPointerDownHandler (event, listener, target_id)
{
  pointerEvents [event.pointerId] = target_id;
  buildMSPointerList (event, false, target_id);
  listener (event);

  if (nbPointerListener === 0)
  {
    document.addEventListener (
      hasPointer ? 'pointerup' : 'MSPointerUp',
      msRemovePointer
    );
    document.addEventListener (
      hasPointer ? 'pointercancel' : 'MSPointerCancel',
      msRemovePointer
    );
  }
  nbPointerListener ++;
}

function msPointerMoveHandler (event, listener, target_id)
{
  buildMSPointerList (event, false, target_id);
  listener (event);
}

function msPointerUpHandler (event, listener)
{
  buildMSPointerList (event, true);
  listener (event);
}

function msPointerCancelHandler (event, listener)
{
  buildMSPointerList (event, true);
  listener (event);
}

/*************************************************************/

var
  pointerStartHandler, pointerMoveHandler,
  pointerEndHandler, pointerCancelHandler;

if (EVENT_SUPPORT_TOUCH)
{
  if (hasMSPointer)
  {
    pointerStartHandler = msPointerDownHandler;
    pointerMoveHandler = msPointerMoveHandler;
    pointerEndHandler = msPointerUpHandler;
    pointerCancelHandler = msPointerCancelHandler;
  }
  else
  {
    pointerStartHandler = touchStartHandler;
    pointerMoveHandler = touchMoveHandler;
    pointerEndHandler = touchEndHandler;
    pointerCancelHandler = touchCancelHandler;
  }
}
else
{
  pointerStartHandler = mouseDownHandler;
  pointerMoveHandler = mouseMoveHandler;
  pointerEndHandler = mouseUpHandler;
  pointerCancelHandler = mouseUpHandler;
}

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

function createUniqueId ()
{
  return "" + new Date().getTime() + "" + Math.floor (Math.random() * 1000000);
}

function managePointerListenerAdd (node, type, func, binding)
{
  var target_id = (binding.listener)?binding.listener.id:undefined;
  if (!target_id) {
    target_id = createUniqueId ();
    if (binding.listener) binding.listener.id = target_id;
  }
  switch (type)
  {
    case POINTER_START:
      binding.handler = function (e) {
        pointerStartHandler (e, func, target_id);
      };
      return true;
    break;

    case POINTER_MOVE:
    
      binding.handler = function (e) {
        pointerMoveHandler (e, func, target_id);
      };
      return true;
    break;

    case POINTER_END:
      binding.handler = function (e) {
        pointerEndHandler (e, func);
      };
      return true;
    break;

    case POINTER_CANCEL:
      binding.handler = function (e) {
        pointerCancelHandler (e, func);
      };
      return true;
    break;
  }
  return false;
}

function managePointerListenerRemove (node, type, binding)
{
  switch (type)
  {
    case POINTER_START:
    case POINTER_MOVE:
    case POINTER_END:
    case POINTER_CANCEL:
      return true;
    break;
  }
  return false;
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

  if (!managePointerListenerAdd (node, type, func, binding))
  {
    if (!manageGestureListenerAdd (node, type, func, binding))
    {
      binding.handler = func;
    }
  }

  node.addEventListener (type, binding.handler, useCapture);
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

  if (!managePointerListenerRemove (node, type, binding))
  {
    if (!manageGestureListenerRemove (node, type, binding))
    {}
  }

  node.removeEventListener (type, binding.handler, useCapture);
}

function createCustomEvent (eventName, target, payload)
{
  var event = document.createEvent ('Event');
  event.initEvent (eventName, true, true);
  for (var k in payload) {
    event[k] = payload[k];
  }
  target.dispatchEvent (event);
};
