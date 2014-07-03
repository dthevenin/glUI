// var Text = vs.gl.createClass ({
// 
//   /** parent class */
//   parent: vs.gl.Application,
// 
//   initComponent : function () {
//     this._super ();
// 
//     this.view1 = new vs.gl.Text ({
//       size: [100, 100],
//       id: 'view1',
//       position: [50, 50],
//     }).init ();
//     
//     this.view1.style.backgroundColor = vs.gl.Color.red;
// 
//     this.add (this.view1);
//  
// //    this.__recognizer = new vs.ui.DragRecognizer (this);
//  //   this.view1.addPointerRecognizer (this.__recognizer);
//  
//  
//     document.addEventListener (POINTER_START, this);
//   },
//   
//   handleEvent : function (e) {
// //    console.log (e);
//     if (e.type === POINTER_START) {
//       document.addEventListener (POINTER_MOVE, this);
//       document.addEventListener (POINTER_END, this);
// 
//       this._screenX = e.screenX;
//       this._screenY = e.screenY;
// 
//       this._tmp_matrix = mat4.create ();
//       mat4.set (this.view1.__gl_matrix, this._tmp_matrix);
//     }
//     else if (e.type === POINTER_MOVE) {
// 
//       var
//         dx = e.screenX - this._screenX,
//         dy = e.screenY - this._screenY;
//       
//       mat4.translate (this._tmp_matrix, [dx, dy, 0], this.view1.__gl_matrix);
//       this.view1.__invalid_matrixes = true;
//       GLView.__should_render = true;
//     }
//     else if (e.type === POINTER_END) {
//       document.removeEventListener (POINTER_MOVE, this);
//       document.removeEventListener (POINTER_END, this);
//     }
//   },
// 
//   didDragStart : function () {
//     console.profile("drag");
//     this._tmp_matrix = mat4.create ();
//     mat4.set (this.view1.__gl_matrix, this._tmp_matrix);
//   },
// 
//   didDrag : function (drag_info, event) {
//     var
//       dy = drag_info.dy,
//       dx = drag_info.dx;
//       
//     mat4.translate (this._tmp_matrix, [dx, dy, 0], this.view1.__gl_matrix);
//     this.view1.__invalid_matrixes = true;
//     GLView.__should_render = true;
//   },
// 
//   didDragEnd : function (drag_info, event) {
//     console.profileEnd("drag");
//   }
// });

var POINTER_START = 'mousedown';
var POINTER_MOVE = 'mousemove';
var POINTER_END = 'mouseup';

  POINTER_START = 'touchstart';
  POINTER_MOVE = 'touchmove';
  POINTER_END = 'touchend';
  POINTER_CANCEL = 'touchcancel';


function loadApplication () {
  var div = document.getElementById ('todrag');
  
  var tx=0, ty =0, dx, dy;
  
  function handleEvent (e) {
//    console.log (e);

    e.preventDefault ();

    var touch = (e.touches && e.touches.length)? e.touches[0]:e;
    if (e.type === POINTER_START) {
      document.addEventListener (POINTER_MOVE, handleEvent, true);
      document.addEventListener (POINTER_END, handleEvent, true);

      this._screenX = touch.screenX;
      this._screenY = touch.screenY;
    }
    else if (e.type === POINTER_MOVE) {

      dx = touch.screenX - this._screenX,
      dy = touch.screenY - this._screenY;
      
      div.style.webkitTransform = "translate3d(" + (tx + dx) + "px," + (ty + dy) + "px,0)";
    }
    else if (e.type === POINTER_END) {
      tx += dx;
      ty += dy;
      document.removeEventListener (POINTER_MOVE, handleEvent, true);
      document.removeEventListener (POINTER_END, handleEvent, true);
    }
  }
  
  document.addEventListener (POINTER_START, handleEvent);
}
