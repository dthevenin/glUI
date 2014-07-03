
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

/**
 *  @class
 *  EventSource is an  class that forms the basis of event and command
 *  processing. All class that handles events must inherit form EventSource.
 *
 *  @extends Object
 *  @author David Thevenin
 *
 *  @constructor
 *  Main constructor
 *
 * @name EventSource
 *
 * @param {Object} config the configuration structure [mandatory]
 */
function EventSource (config)
{
  this.parent = GLObject;
  this.parent (config);
  this.constructor = EventSource;

  this.__bindings__ = {};
  
  this._pointer_start = [];
  this._pointer_move = [];
  this._pointer_end = [];
}

/** @name EventSource */
EventSource.prototype =
{
  /**
   * @protected
   * @function
   */
  __bindings__ : null,
  
  /***************************************************************

  ***************************************************************/

  /**
   * @protected
   * @function
   */
  destructor : function ()
  {
    var spec, handler_list, i, handler, binds;

    function deleteBindings (handler_list)
    {
      if (!handler_list) return;

      handler_list.length = 0;
    };

    for (var spec in this.__bindings__)
    {
      deleteBindings (this.__bindings__ [spec]);
      this.__bindings__ [spec] = null;
    }

    this.__bindings__ = null;

    GLObject.prototype.destructor.call (this);
  },

  _pointer_start : null,
  _pointer_move : null,
  _pointer_end : null,
  
  /**
   *  The EventTarget.addEventListener() method registers the specified
   *  listener on the EventSource it's called on. The event target may be any
   *  GL object that supports events
   *
   * @name EventSource#addEventListener
   * @function
   *
   * @param {string} type the event specification [mandatory]
   * @param {Object} handler the object interested to catch the event [mandatory]
   * @param {Boolean} useCapture If true, useCapture indicates that the user
   *          wishes to initiate captured [optional]
   */
  addEventListener: function (type, handler, useCapture) {
    if (!type || !handler) { return; }

    if (type === POINTER_START) {
      this._pointer_start.push (handler);
      __gl_activate_pointer_start ();
    }
    else if (type === POINTER_MOVE) {
      this._pointer_move.push (handler);
      __gl_activate_pointer_move ();
    }
    else if (type === POINTER_END) {
      this._pointer_end.push (handler);
      __gl_activate_pointer_end ();
    }
    else if (type === 'webglcontextrestored') {
      register_webglcontextrestored (this, handler);
    }
    else {
      /** general event */
      var handler_list = this.__bindings__ [type];
      
      if (!handler_list) {
        handler_list = [];
        this.__bindings__ [type] = handler_list;
      }
      handler_list.push (handler);
    } 
  },

  /**
   *  Removes the event listener previously registered with
   *  EventSource.addEventListener.
   *
   * @name EventSource#removeEventListener
   * @function
   *
   * @param {string} type the event specification [mandatory]
   * @param {Object} handler the object interested to catch the event [mandatory]
   * @param {Boolean} useCapture If true, useCapture indicates that the user
   *          wishes to initiate captured [optional]
   */
  removeEventListener: function (type, handler, useCapture) {
    if (!type || !handler) { return; }

    if (type === POINTER_START) {
      this._pointer_start.remove (handler);
      __gl_deactivate_pointer_start ()
    }
    else if (type === POINTER_MOVE) {
      this._pointer_move.remove (handler);
      __gl_deactivate_pointer_move ()
    }
    else if (type === POINTER_END) {
      this._pointer_end.remove (handler);
      __gl_deactivate_pointer_end ()
    }
    else {
      function unbind (handler_list) {
        if (!handler_list) return;

        var handler_obj, i = 0;
        while (i < handler_list.length) {
          handler_obj = handler_list [i];
          if (handler_obj === handler) {
            handler_list.remove (i);
          }
          else { i++; }
        }
      };

      unbind (this.__bindings__ [type]);
    }
  },
  
  /**
   *  Dispatches an Event at the specified EventTarget, invoking the affected
   *  EventListeners in the appropriate order.
   */
  dispatchEvent : function (event)
  {
    if (!event) return;
    
    event.src = this;
    this._dispatchEvent (event);
  },
  
  /** @private */
  _dispatchEvent : function (event)
  {
    var handler_list = this.__bindings__ [event.type];
        
    if (!handler_list || handler_list.length === 0) {
      // bubbling
      if (this.__parent) {
        this.__parent._dispatchEvent (event);
      }
      return;
    }

    event.srcTarget = this;
    queueProcAsyncEvent (event, handler_list);
  },
  
  /**
   * if this object receive an event
   *
   * @name EventSource#handleEvent
   * @function
   *
   * @protected
   */
  handleEvent : function (event) {}
};
util.extendClass (EventSource, GLObject);
