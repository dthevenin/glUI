import { GLObject, ObjectConfig } from "../GLObject";
import { __gl_activate_pointer_start, __gl_activate_pointer_move, __gl_activate_pointer_end, __gl_deactivate_pointer_start, __gl_deactivate_pointer_move, __gl_deactivate_pointer_end } from "./Picking";
import { register_webglcontextrestored } from "../spriteUtil";
import { queueProcAsyncEvent } from "../mainloop";
import { POINTER_START, POINTER_MOVE, POINTER_END } from "./PointerEvent";
import { BaseView } from "../view/View";
import { GLEvent } from "./GLEvent";

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
export class GLEventSource extends GLObject {
  /**
   * @protected
   * @function
   */
  private __bindings__:{ [spec: string]: any[] };
  protected _pointer_start: any;;
  protected _pointer_move: any;;
  protected _pointer_end: any;;

  constructor(config: ObjectConfig) {
    super(config);

    this.__bindings__ = {};
    this._pointer_start = [];
    this._pointer_move = [];
    this._pointer_end = [];
  }
  
  /***************************************************************

  ***************************************************************/

  /**
   * @protected
   * @function
   */
  destructor(): void {
    const deleteBindings = (handler_list: any[]): void => {
      if (!handler_list) return;
      handler_list.length = 0;
    };

    for (const spec in this.__bindings__) {
      deleteBindings(this.__bindings__[spec]);
      delete this.__bindings__[spec];
    }

    delete this.__bindings__;

    super.destructor();
  }

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
  addEventListener(type: string, handler: any, useCapture?: boolean): void {
    if (type === POINTER_START) {
      this._pointer_start.push(handler);
      __gl_activate_pointer_start();
    } else if (type === POINTER_MOVE) {
      this._pointer_move.push(handler);
      __gl_activate_pointer_move();
    } else if (type === POINTER_END) {
      this._pointer_end.push(handler);
      __gl_activate_pointer_end();
    } else if (type === 'webglcontextrestored') {
      const gl_view = this as unknown as BaseView;
      if (gl_view.__gl_id) {
        register_webglcontextrestored(gl_view, handler);
      }
    } else {
      /** general event */
      let handler_list = this.__bindings__[type];
      
      if (!handler_list) {
        handler_list = [];
        this.__bindings__[type] = handler_list;
      }
      handler_list.push(handler);
    } 
  }

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
  removeEventListener(type: string, handler: any, useCapture?: boolean) {
    if (!type || !handler) { return; }

    function unbind (handler_list: any[]): void {
      if (!handler_list) return;

      let handler_obj, i = 0;
      while (i < handler_list.length) {
        handler_obj = handler_list[i];
        if (handler_obj === handler) {
          // @ts-ignore
          handler_list.remove(i);
        }
        else { i++; }
      }
    };

    if (type === POINTER_START) {
      this._pointer_start.remove(handler);
      __gl_deactivate_pointer_start()
    } else if (type === POINTER_MOVE) {
      this._pointer_move.remove(handler);
      __gl_deactivate_pointer_move()
    } else if (type === POINTER_END) {
      this._pointer_end.remove(handler);
      __gl_deactivate_pointer_end()
    } else {
      unbind(this.__bindings__[type]);
    }
  }
  
  /**
   *  Dispatches an Event at the specified EventTarget, invoking the affected
   *  EventListeners in the appropriate order.
   */
  dispatchEvent(event: GLEvent): boolean {
    if (!event) return;
    
    event.src = this;
    return this._dispatchEvent(event);
  }
  
  /** @private */
  _dispatchEvent(event: GLEvent): boolean {
    var handler_list = this.__bindings__[event.type];
        
    if (!handler_list || handler_list.length === 0) {
      // bubbling
      const gl_view = this as unknown as BaseView;
      if (gl_view.__parent) {
        gl_view.__parent._dispatchEvent(event);
      }
      return true;
    }

    event.srcTarget = this;
    queueProcAsyncEvent(event, handler_list);
    return true;
  }
  
  /**
   * if this object receive an event
   *
   * @name EventSource#handleEvent
   * @function
   *
   * @protected
   */
  handleEvent(event: GLEventSource): void {}
};
