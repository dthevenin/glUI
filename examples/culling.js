var Text = vs.core.createClass ({

  /** parent class */
  parent: vs.ui.GLApplication,

  initComponent : function () {
    this._super ();

    this.view1 = new vs.ui.GLText ({
      size: [100, 100],
      id: 'view1',
      position: [50, 50],
    }).init ();
    
    this.view1.style.backgroundColor = GLColor.red;

    this.add (this.view1);
 
    this.__recognizer = new vs.ui.DragRecognizer (this);
    this.view1.addPointerRecognizer (this.__recognizer);
  },

  didDragStart : function () {
    console.profile("drag");
    this._tmp_matrix = mat4.create ();
    mat4.set (this.view1.__gl_matrix, this._tmp_matrix);
  },

  didDrag : function (drag_info, event) {
    var
      dy = drag_info.dy,
      dx = drag_info.dx;
      
    mat4.translate (this._tmp_matrix, [dx, dy, 0], this.view1.__gl_matrix);
    this.view1.__invalid_matrixes = true;
    GLView.__should_render = true;
  },

  didDragEnd : function (drag_info, event) {
    console.profileEnd("drag");
  }
});

function loadApplication () {
  new Text ({id:"test", layout:vs.ui.View.ABSOLUTE_LAYOUT}).init ();
  vs.ui.Application.start ();
}
