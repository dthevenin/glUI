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
  if (!type || !node) return;
  
//   if (node instanceof HTMLElement) {
//     node.addEventListener (type, listener, useCapture);
//     return;
//   }
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
  if (node instanceof View) {
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
  else if (node instanceof HTMLElement) {
    binding.node_handler = function (event) {
      var e = buildEvent (type, event, node);
      if (vs.util.isFunction (binding.handler)) {
        binding.handler.call (node, e);
      }
      else if (vs.util.isFunction (binding.handler.handleEvent)) {
        binding.handler.handleEvent.call (binding.handler, e);
      }
    };
    node.addEventListener (type, binding.node_handler, useCapture);
  }
}

function removePointerListener (node, type, listener, useCapture)
{
  if (!type || !node) return;
  
//   if (node instanceof HTMLElement) {
//     node.removeEventListener (type, listener, useCapture);
//     return;
//   }
  
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

  if (node instanceof View) {
    node.removeEventListener (type, binding.handler, useCapture);
  }
  else if (node instanceof HTMLElement) {
    node.removeEventListener (type, binding.node_handler, useCapture);
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
