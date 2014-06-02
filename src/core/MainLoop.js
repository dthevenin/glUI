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

function queueAction (func, ctx) {
  var action = Action.getAction ();
  action.configure (func, ctx);
  
  main_actions_queue.push (action);
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
  
  if (queue.length) {
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
