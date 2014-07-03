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

function setupMousePointerEvent () {

  POINTER_START = 'mousedown';
  POINTER_MOVE = 'mousemove';
  POINTER_END = 'mouseup';
  POINTER_CANCEL = null;

  // TODO(smus): Come up with a better solution for this. This is bad because
  // it might conflict with a touch ID. However, giving negative IDs is also
  // bad because of code that makes assumptions about touch identifiers being
  // positive integers.
  var MOUSE_ID = 31337;
  
  var mouse_event = new GLPointerEvent ();

  function buildMouseList (type, evt, obj)
  {
    mouse_event.init (type, evt, obj);
        
    var
      pointers = mouse_event.targetPointerList,
      pointer = Pointer.getPointer (MOUSE_ID);
      
    pointer.configure (mouse_event, obj, obj);
    pointers.push (pointer);
    
    if (type === POINTER_END || type == POINTER_CANCEL) {
      mouse_event.nbPointers = 1;
      mouse_event.changedPointerList = pointers;
    }
    else {
      mouse_event.nbPointers = 0;
      mouse_event.pointerList = pointers;
    }

    return mouse_event;
  }

  buildEvent = buildMouseList;
}
