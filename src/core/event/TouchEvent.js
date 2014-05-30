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

function setupTouchEvent () {

  POINTER_START = 'touchstart';
  POINTER_MOVE = 'touchmove';
  POINTER_END = 'touchend';
  POINTER_CANCEL = 'touchcancel';

  /**
   * Returns an array of all pointers currently on the screen.
   */

  var pointerEvents = [];
  
  var pointer_event = new GLPointerEvent ();

  function buildTouchList (type, evt, obj, target_id)
  {
    var e = pointer_event, touch, pointer;
    e.init (type, evt, obj);
    
    e.nbPointers = evt.touches.length;
    
    var pointers = e.pointerList;
    for (var i = 0; i < e.nbPointers; i++)
    {
      touch = evt.touches[i];
      
      pointer = Pointer.getPointer (touch.identifier);
      pointer.configure (touch, obj, obj, PointerTypes.TOUCH);
      
      pointers.push (pointer);
    }

    pointers = e.targetPointerList;
    for (var i = 0; i < evt.targetTouches.length; i++)
    {
      touch = evt.targetTouches[i];
      if (target_id && pointerEvents [touch.identifier] != target_id) continue;

      pointer = Pointer.getPointer (touch.identifier);
      pointer.configure (touch, obj, obj, PointerTypes.TOUCH);

      pointers.push (pointer);
    }

    pointers = e.changedPointerList;
    for (var i = 0; i < evt.changedTouches.length; i++)
    {
      touch = evt.changedTouches[i];

      pointer = Pointer.getPointer (touch.identifier);
      pointer.configure (touch, obj, obj, PointerTypes.TOUCH);

      pointers.push (pointer);
    }

    return e;
  }

/*************** Touch event handlers *****************/


/*************************************************************/

  buildEvent = buildTouchList;
}
