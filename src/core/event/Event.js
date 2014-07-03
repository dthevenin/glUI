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

var EVENT_SUPPORT_GESTURE = false;
var hasMSPointer = window.navigator.msPointerEnabled;

/**
 *  @class
 *  An vs.gl.Event object, or simply an event, contains information about an 
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
 *  @memberOf vs.gl
 *
 * @param {string} type the event type [mandatory]
 * @param {Object} data complemetary event data [optional]
*/
var Event = function (type, data) {
  this.configure (type, data);
}

var Event__pool = [];

/**
 * The component which produce the event
 * @type {vs.gl.EventSource|HTMLElement}
 * @name vs.gl.Event#src
 */
Event.prototype.src = null;

/**
 * [Deprecated] The component which produce the event. <br>
 * In case of DOM event, the Event is mapped to the DOM event. Then
 * the developer has access to srcTarget (and many other data).
 * @type {vs.gl.EventSource|HTMLElement}
 * @name vs.gl.Event#srcTarget
 * @deprecated
 */
Event.prototype.srcTarget = null;

/**
 * The event spec. For instance 'click' for a mouse click event.
 * @type {String}
 * @name vs.gl.Event#type
 */
Event.prototype.type = "";

/**
 * The optional data associated to the event.
 * @type {Object|null}
 * @name vs.gl.Event#data
 */
Event.prototype.data = null;

/**
 * @function
 */
Event.prototype.configure = function (type, data) {
  this.type = type;
  this.data = data;
};

Event.retain = function () {
  var l = Event__pool.length;
  if (l) {
    return Event__pool.pop ();
  }
  return new Event ();
}

Event.release = function (event) {
  Event__pool.push (event);
}
