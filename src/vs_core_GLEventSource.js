
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
 *  vs.core.EventSource is an  class that forms the basis of event and command
 *  processing. All class that handles events must inherit form EventSource.
 *
 *  @extends vs.core.Object
 *  @author David Thevenin
 *
 *  @constructor
 *  Main constructor
 *
 * @name vs.core.EventSource
 *
 * @param {Object} config the configuration structure [mandatory]
 */
function GLEventSource (config)
{
  this.parent = VSObject;
  this.parent (config);
  this.constructor = core.GLEventSource;

  this.__bindings__ = {};
  
  this._pointer_start = [];
  this._pointer_move = [];
  this._pointer_end = [];
}

/** @name vs.core.GLEventSource# */
GLEventSource.prototype =
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

      var bind, l = handler_list.length;
      while (l--)
      {
        bind = handler_list [l];
        util.free (bind);
      }
    };

    for (var spec in this.__bindings__)
    {
      deleteBindings (this.__bindings__ [spec]);
      delete (this.__bindings__ [spec]);
    }

    delete (this.__bindings__);

    VSObject.prototype.destructor.call (this);
  },

  _pointer_start : null,
  _pointer_move : null,
  _pointer_end : null,
  
  addEventListener: function (type, handler, useCapture) {
    if (type === vs.POINTER_START) {
      this._pointer_start.push (handler);
      __gl_activate_pointer_start ();
    }
    else if (type === vs.POINTER_MOVE) {
      this._pointer_move.push (handler);
      __gl_activate_pointer_move ();
    }
    else if (type === vs.POINTER_END) {
      this._pointer_end.push (handler);
      __gl_activate_pointer_end ();
    }
//    console.log ("addEventListener:" + type);  
  },

  removeEventListener: function (type, handler, useCapture) {
    if (type === vs.POINTER_START) {
      this._pointer_start.remove (handler);
      __gl_deactivate_pointer_start ()
    }
    else if (type === vs.POINTER_MOVE) {
      this._pointer_move.remove (handler);
      __gl_deactivate_pointer_move ()
    }
    else if (type === vs.POINTER_END) {
      this._pointer_end.remove (handler);
      __gl_deactivate_pointer_end ()
    }
//    console.log ("removeEventListener: " + type);  
  },

  /**
   * @name vs.core.GLEventSource#_clone
   * @function
   * @private
   *
   * @param {vs.core.Object} obj The cloned object
   * @param {Object} map Map of cloned objects
   */
  _clone : function (obj, cloned_map)
  {
    VSObject.prototype._clone.call (this, obj, cloned_map);

    obj.__bindings__ = {};
  },

  /**
   *  The event bind method to listen events
   *  <p>
   *  When you want listen an event generated by this object, you can
   *  bind your object (the observer) to this object using 'bind' method.
   *  <p>
   *
   * @name vs.core.EventSource#bind
   * @function
   *
   * @param {string} spec the event specification [mandatory]
   * @param {vs.core.Object} obj the object interested to catch the event [mandatory]
   * @param {string} func the name of a callback. If its not defined
   *        notify method will be called [optional]
   */
  bind : function (spec, obj, func)
  {
    if (!spec || !obj) { return; }

    /** @private */
    var handler = new Handler (obj, func),
      handler_list = this.__bindings__ [spec];
    if (!handler_list)
    {
      handler_list = [];
      this.__bindings__ [spec] = handler_list;
    }
    handler_list.push (handler);

    return handler;
  },

  /**
   *  The event unbind method
   *  <p>
   *  Should be call when you want stop event listening on this object
   *
   * @name vs.core.EventSource#unbind
   * @function
   *
   * @param {string} spec the event specification [mandatory]
   * @param {vs.core.Object} obj the object you want unbind [mandatory]
   * @param {string} func the name of a callback. If its not defined
   *        all binding with <spec, obj> will be removed
   */
  unbind : function (spec, obj, func)
  {
    function unbind (handler_list)
    {
      if (!handler_list) return;

      var handler, i = 0;
      while (i < handler_list.length)
      {
        handler = handler_list [i];
        if (handler.obj === obj)
        {
          if (util.isString (func) || util.isFunction (func) )
          {
            if (handler.func_name === func || handler.func_ptr === func)
            {
              handler_list.remove (i);
              util.free (handler);
            }
            else { i++; }
          }
          else
          {
            handler_list.remove (i);
            util.free (handler);
          }
        }
        else { i++; }
      }
    };

    unbind (this.__bindings__ [spec]);
  },

  /**
   *  Propagate an event
   *  <p>
   *  All Object listening this GLEventSource will receive this new handled
   *  event.
   *
   * @name vs.core.GLEventSource#propagate
   * @function
   *
   * @param {String} spec the event specification [mandatory]
   * @param {Object} data an optional data event [optional]
   * @param {vs.core.Object} srcTarget a event source, By default this object
   *        is the event source [mandatory]
   */
  propagate : function (type, data, srcTarget)
  {
    var handler_list = this.__bindings__ [type], event;
    if (!handler_list || handler_list.length === 0)
    {
      if (this.__parent)
      {
        if (!srcTarget) { srcTarget = this; }
        this.__parent.propagate (type, data, srcTarget);
      }
      return;
    }

    event = new vs.core.Event (this, type, data);
    if (srcTarget) { event.srcTarget = srcTarget; }

    queueProcAsyncEvent (event, handler_list);
  },

  /**
   * if this object receive an event it repropagates it if nobody has
   * overcharged the notify method.
   *
   * @name vs.core.GLEventSource#notify
   * @function
   *
   * @protected
   */
  notify : function (event)
  {
    this.propagate (event.type, event.data);
  }
};
util.extendClass (GLEventSource, VSObject);

/********************************************************************
                      Export
*********************************************************************/
/** @private */
core.GLEventSource = GLEventSource;

