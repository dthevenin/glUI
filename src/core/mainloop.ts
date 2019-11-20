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


import * as util from "../util";
import { GLEventSource } from "./event/EventSource";
import { GLEvent } from "./event/GLEvent";

/** 
 * Schedule your action on next frame.
 *
 * @example
 * core.scheduleAction (function() {...}, core.ON_NEXT_FRAME);
 *
 * @see core.scheduleAction
 *
 * @name core.ON_NEXT_FRAME 
 * @type {String}
 * @const
 * @public
 */
export const ON_NEXT_FRAME = -1;

var render_ui;

type Action = (...args: any[]) => void;

type EventHander = any;

interface EventBurst {
  handler_list: EventHander[],
  event: GLEvent;
}

/**
 * @private
 */
let
  // Events queue. This array contains event structure for future propagation.
  // This array is part of the algorithm that secure event propagation, in
  // particular that avoids a event pass a previous one.
  _async_events_queue: EventBurst[] = [],
  
  // Event reference on the current synchronous event.
  _sync_event: EventBurst = null,
  
  // Actions queue. This array contains all actions (Action object)
  // that have to be execute.
  _main_actions_queue: Action[] = [],
  _tmp_actions_queue: Action[] = [],
  
  // Boolean indicating if we are propagating a event or not.
  // To secure event propagation, in particular to avoid a event pass a previous
  // event, we manage a events queue and block new propagation if a event is
  // in propagation.
  _is_async_events_propagating = false,
  _is_sync_events_propagating = false,
  
  // Boolean indicating if we are running an action or not.
  // This boolean is used only in case we use our own implementation of 
  // setImmediate.
  _is_action_runing = false,
  _is_waiting = false;


/********************************************************************
      Actions Management
*********************************************************************/
// 
// 
// /**
//  *  Structure used for managing events
//  *  @private
//  */
// function Action() {}
// var Action__pool = [];
// 
// Action.prototype.configure = function (func, ctx) {
//   this.func = func;
//   this.ctx = ctx;
// }
// 
// Action.retain = function() {
//   var l = Action__pool.length;
//   if (l) {
//     return Action__pool.pop();
//   }
//   return new Action();
// }
// 
// Action.release = function (action) {
//   Action__pool.push (action);
// }


// 
// /**
//  * doAction, execute one action. This method is called with our setImmediate
//  * implementation.
//  *
//  * @private
//  */
// function doOneAction (action) {
//   action.func.call (action.ctx);
// }



/********************************************************************
      setImmediate Polyfill (based on the Action management)
*********************************************************************/


/**
 * Install our awn setImmediate implementation, if needs
 *
 * @private
 */
let is_actions_are_scheduled = false;

let loopSetImmediate: (a: Action) => any;

// let scheduleAction:() => void;

if (!window.setImmediate) {
  // loopSetImmediate = queueAction;
  // loopSetImmediate = window.postMessage ?
  //   installPostMessageImplementation() :
  //   function() { setTimeout(doAllActions, 0) };
  loopSetImmediate = (a: Action) => setTimeout(a, 0);
}
else {
  loopSetImmediate = window.setImmediate.bind(window);
  // scheduleAction =() => setImmediate(doAllActions);
}

// /**
//  * doAction, execute one action. This method is called with our setImmediate
//  * implementation.
//  *
//  * @private
//  */
// function installPostMessageImplementation():() => void {

//   var MESSAGE_PREFIX = "_scheduler" + Math.random();

//   function onGlobalMessage(even: Event) {
//     if (event.data === MESSAGE_PREFIX) {
//       doAllActions();
//     }
//   }

//   if (window.addEventListener) {
//     window.addEventListener("message", onGlobalMessage, false);
//   }

//   return() => window.postMessage(MESSAGE_PREFIX, "*");
// }

/** 
 * Schedule an action to be executed asynchronously.
 * <br />
 * There is three basic scheduling; the action can be executed:
 * <ul>
 *   <li>as soon as possible.
 *   <li>on the next frame
 *   <li>after a delay
 * </ul>
 *
 * 1- As soon as possible<br />
 * The action will be executed as soon as possible in a manner that is
 * typically more efficient and consumes less power than the usual
 * setTimeout(..., 0) pattern.<br />
 * It based on setImmediate if it is available; otherwise it will use postMessage
 * if it is possible and at least setTimeout(..., 0) pattern if previous APIs are
 * not available.
 *<br /><br />
 *
 * 2- On next frame<br />
 * The action will be executed on next frame.<br />It is equivalent to use
 * window.requestAnimationFrame.
 *<br /><br />
 *
 * 2- After a delay<br />
 * The action will be executed after a given delay in millisecond.<br />
 * It is equivalent to use window.setTimeout(..., delay).
 *
 * @example
 * // run asap
 * core.scheduleAction ((...args: any[]) {...});
 * // run on next frame
 * core.scheduleAction ((...args: any[]) {...}, core.ON_NEXT_FRAME);
 * // run after 1s
 * core.scheduleAction ((...args: any[]) {...}, 1000);
 *
 * @name core.scheduleAction 
 * @type {String}
 * @function
 * @public
 *
 * @param {Function} func The action to run
 * @param {(Number|String)} delay when run the action [optional]
 */
export function scheduleAction(func: Action, delay?: number) {
  if (delay && delay > 0) {
    setTimeout(func, delay);
  }
  else if (delay === ON_NEXT_FRAME) {
    requestAnimationFrame(func);
  }
  else loopSetImmediate(func);
}

// function queueAction(func: Action, ctx?: any) {
// //   var action = Action.retain();
// //   action.configure (func, ctx);

//   _main_actions_queue.push(func);

//   if (!is_actions_are_scheduled) {
//     is_actions_are_scheduled = true;
//     scheduleDoActions();
//   }
// }

// /**
//  * @private
//  */
// function doAllActions(now?: number) {
//   var queue = _main_actions_queue;

//   is_actions_are_scheduled = false;

//   if (queue.length) {
//     if (!now) now = performance.now();
  
//     // switch queues
//     _main_actions_queue = _tmp_actions_queue;
//     _tmp_actions_queue = queue;
  
//     try {
//       // execute actions
//       var i = 0, l = queue.length, func;
//       for (; i < l; i++) {
//         func = queue[i];
//         func.call();
// //         doOneAction (action, now)
// //         Action.release (action);
//       }
//     }
//     catch (e) {
//       if (e.stack) console.error (e.stack);
//       else console.error (e);
//     }    
//     // clean the queue
//     queue.length = 0;
//   }
// }

// /********************************************************************
//       Do one event
// *********************************************************************/

// /*
//  *----------------------------------------------------------------------
//  *
//  * _DoOneEvent --
//  *
//  *  Process a single event of some sort.  If there's no work to
//  *  do, wait for an event to occur, then process it.
//  *
//  *
//  *----------------------------------------------------------------------
//  */

/**
 * doOneEvent will dispatch One event to all observers.
 *
 * @private
 * @param {Object} burst a event burst structure
 * @param {Boolean} isSynchron if its true the callbacks are executed
 *             synchronously, otherwise they are executed within a setImmediate
 */
function doOneEvent(burst: EventBurst, isSynchron?: boolean): void {
  var
    handler_list = burst.handler_list,
    n = handler_list.length,
    i = n, l = n,
    event = burst.event;

  if (isSynchron) _is_sync_events_propagating = true;
  else _is_async_events_propagating = true;
  
  // Test is all observers have been called
  function end_propagation() {
    l--;
    if (l <= 0) {
      if (isSynchron) _is_sync_events_propagating = false;
			else _is_async_events_propagating = false;
		}
  }

  /**
   * doOneHandler will dispatch One event to an observer.
   *
   * @private
   * @param {Handler} handler
   */
  function doOneHandler(handler: EventHander) {
    if (handler) try {
      if (util.isFunction (handler)) {
        // call function
        handler (event);
      }
      else if (util.isFunction (handler.handleEvent)) {
        // default handleEvent method
        handler.handleEvent.call (handler, event);
      }
    }
    catch (e) {
      if (e.stack) console.error (e.stack);
      else console.error (e);
    }
    end_propagation();
  };

  if (!i) end_propagation(); // should not occur
  
  // For each observers, schedule the handler call (callback execution)
  for (i = 0; i < n; i++) {
    if (isSynchron) doOneHandler (handler_list [i])
  
    else (function (handler) {
        setImmediate (function() { doOneHandler(handler) });
      }) (handler_list [i])
  }
}

/**
 * doOneAsyncEvent will dispatch One event to all observers.
 *
 * @private
 */
function doOneAsyncEvent() {
  if (_is_async_events_propagating || _is_sync_events_propagating) return;
  
  // dequeue the next event burst and do it
  doOneEvent(_async_events_queue.shift());
}

/**
 * doOneSyncEvent will dispatch the synchronous event to all observers.
 *
 * @private
 */
function doOneSyncEvent() {
  doOneEvent(_sync_event, true);
  _sync_event = null;
}

// /********************************************************************
//       Event dispatch
// *********************************************************************/

/**
 * Put an asynchronous event into the event queue and request the mainloop
 *
 * @private
 */
export function queueProcAsyncEvent(event: GLEvent, handler_list: any[]) {
  if (!event || !handler_list) return;

  const burst: EventBurst = {
    handler_list,
    event
  }

  // push the event to dispatch into the queue
  _async_events_queue.push(burst);

  // request for the mainloop
  serviceLoop();
}

/**
 * Setup a synchronous event and request the mainloop
 *
 * @private
 */
function queueProcSyncEvent(event: GLEvent, handler_list: any[]) {
  if (!event || !handler_list) return;

  const burst: EventBurst = {
    handler_list,
    event,
  }

  // push the event to dispatch into the queue
  _sync_event = burst;

  // launch for the mainloop
  serviceLoop();
}

// /********************************************************************
//       Mainloop code
// *********************************************************************/
  
// // var _waiting_for_service_loop = false;
// // function requestServiceLoop() {
// //   if (_waiting_for_service_loop) return;
// //   
// //   setImmediate (serviceLoop);
// //   _waiting_for_service_loop = true;
// // }

/**
 * Mainloop core
 *
 * @private
 */
function serviceLoop() {

  if (_sync_event) doOneSyncEvent();

  if ((_async_events_queue.length === 0 && _main_actions_queue.length === 0) ||
      _is_waiting) return;

  function loop() {
    _is_waiting = false;
    serviceLoop();
  }

  if (_is_async_events_propagating || _is_sync_events_propagating) {
    // do the loop
    setImmediate(loop);
    return;
  }

  // dispatch an event to observers
  // if (_main_actions_queue.length) scheduleDoActions();
  if (_async_events_queue.length) doOneAsyncEvent();
}


