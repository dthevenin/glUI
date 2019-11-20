import { GLEventSource } from "./EventSource";

/**
  Copyright (C) 2009-2014. David Thevenin, ViniSketch (c), IGEL Co. Ltd,
  and contributors. All rights reserved
  
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
 *  An Event object, or simply an event, contains information about an 
 *  input action such as a button click or a key down. The Event object contains
 *  pertinent information about each event, such as where the cursor was located
 *  or which character was typed.<br>
 *  When an event is catch by an application component, the callback
 *  receives as parameters an instance (or sub instance) of this class.
 *  <p>
 *  It specifies the source of the event (which object has generated the event),
 *  the type of the event and an event data.
 *
 *  @author David Thevenin
 *
 *  @constructor
 *  Main constructor
 *
 *  @memberOf core
 *
 * @param {string} type the event type [mandatory]
 * @param {Object} data complemetary event data [optional]
*/

export class Event {
  private static eventPool: Event[] = [];

  constructor(type?: string, data?: any) {
    this.configure(type, data);
  }

  /**
   * The component which produce the event
   * @type {EventSource|HTMLElement}
   * @name Event#src
   */
  public src: GLEventSource | EventSource;

  /**
   * [Deprecated] The component which produce the event. <br>
   * In case of DOM event, the Event is mapped to the DOM event. Then
   * the developer has access to srcTarget (and many other data).
   * @type {EventSource|HTMLElement}
   * @name Event#srcTarget
   * @deprecated
   */
  public srcTarget: GLEventSource | EventSource;

  /**
   * The event spec. For instance 'click' for a mouse click event.
   * @type {String}
   * @name Event#type
   */
  private type: string;

  /**
   * The optional data associated to the event.
   * @type {Object|null}
   * @name Event#data
   */
  private data: any;

  /**
   * @function
   */
  configure(type: string, data: any): void {
    this.type = type;
    this.data = data;
  };

  static retain(): Event {
    if (this.eventPool.length) {
      return this.eventPool.pop();
    }
    return new Event();
  }

  static release(event: Event): void {
    this.eventPool.push(event);
  }
}
