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

var render_ui;

/********************************************************************
      Actions Management
*********************************************************************/


/**
 *  Structure used for managing events
 *  @private
 */
function Action () {}

Action.prototype.configure = function (func, ctx) {
  this.func = func;
  this.ctx = ctx;
}

Action.__pool = [];

Action.getAction = function () {
  var l = Action.__pool.length;
  if (l) {
    return Action.__pool.pop ();
  }
  return new Action ();
}

Action.releaseAction = function (action) {
  Action.__pool.push (action);
}

var main_actions_queue = [];
var tmp_actions_queue = [];

var is_actions_are_scheduled = false;

function queueAction (func, ctx) {
  var action = Action.getAction ();
  action.configure (func, ctx);
  
  main_actions_queue.push (action);
  
  if (!is_actions_are_scheduled) {
    is_actions_are_scheduled = true;
    delay_do_actions ();
  }
}

/**
 * doAction, execute one action. This method is called with our setImmediate
 * implementation.
 *
 * @private
 */
function doOneAction (action) {
  action.func.call (action.ctx);
}

/**
 * @private
 */
function doAllActions (now) {
  var queue = main_actions_queue;
  
  is_actions_are_scheduled = false;
  
  if (queue.length) {
    if (!now) now = performance.now ();
    
    // switch queues
    main_actions_queue = tmp_actions_queue;
    tmp_actions_queue = queue;
    
    try {
      // execute actions
      var i = 0, l = queue.length, action;
      for (; i < l; i++) {
        action = queue [i];
        doOneAction (action, now)
        Action.releaseAction (action);
      }
    }
    catch (e) {
      if (e.stack) console.error (e.stack);
      else console.error (e);
    }    
    // clean the queue
    queue.length = 0;
  }
}


/********************************************************************
      setImmediate Polyfill (based on the Action management)
*********************************************************************/


/**
 * Install our awn setImmediate implementation, if needs
 *
 * @private
 */
var setImmediate, delay_do_actions;
if (!window.setImmediate) {

  /**
   * doAction, execute one action. This method is called with our setImmediate
   * implementation.
   *
   * @private
   */
  function installPostMessageImplementation () {

    var MESSAGE_PREFIX = "vs.scheduler" + Math.random ();

    function onGlobalMessage (event) {
      if (event.data === MESSAGE_PREFIX) {
        doAllActions ();
      }
    }
  
    if (window.addEventListener) {
      window.addEventListener ("message", onGlobalMessage, false);
    }

    return function () {
      window.postMessage (MESSAGE_PREFIX, "*");
    };
  }

  delay_do_actions = (window.postMessage)?
    installPostMessageImplementation():
    function () { setTimeout (doAllActions, 0) };


  setImmediate = queueAction;
  window.setImmediate = setImmediate;
}
else {
  setImmediate = window.setImmediate.bind (window);
  delay_do_actions = function () { setImmediate (doAllActions) };
}


/********************************************************************
      Mainloop code
*********************************************************************/


/**
 * Mainloop core
 *
 * @private
 */
function serviceLoopBis (now) {
  
  doAllActions (now);
  
  render_ui (now);

  vs.requestAnimationFrame (serviceLoopBis);
}
