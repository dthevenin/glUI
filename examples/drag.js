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
 
    var algo = 3;
 
 
    if (algo === 1) {
      // algo1    
      this.handleEvent = this.handleEventAlog1;
      document.addEventListener (POINTER_START, this);
    }
    else if (algo === 2) {
      // algo 2
      this.tx=0 ; this.ty =0; this.dx; this.dy;
      this.handleEvent = this.handleEventAlog2;
      document.addEventListener (POINTER_START, this);
    }
    else if (algo === 3) {
      // alog 3
      this.__recognizer = new vs.ui.DragRecognizer (this);
      this.view1.addPointerRecognizer (this.__recognizer);
    }
  },
  
  handleEventAlog1 : function (e) {

    if (e.type === POINTER_START) {
      document.addEventListener (POINTER_MOVE, this);
      document.addEventListener (POINTER_END, this);

      this._screenX = e.screenX;
      this._screenY = e.screenY;

      this._tmp_matrix = mat4.create ();
      mat4.set (this.view1.__gl_matrix, this._tmp_matrix);
    }
    else if (e.type === POINTER_MOVE) {

      var
        dx = e.screenX - this._screenX,
        dy = e.screenY - this._screenY;
      
      mat4.translate (this._tmp_matrix, [dx, dy, 0], this.view1.__gl_matrix);
      this.view1.__invalid_matrixes = true;
      GLView.__should_render = true;
    }
    else if (e.type === POINTER_END) {
      document.removeEventListener (POINTER_MOVE, this);
      document.removeEventListener (POINTER_END, this);
    }
  },
  
  handleEventAlog2 : function (e) {

    if (e.type === POINTER_START) {
      console.profile("drag algo2");
      document.addEventListener (POINTER_MOVE, this);
      document.addEventListener (POINTER_END, this);

      this._screenX = e.screenX;
      this._screenY = e.screenY;
    }
    else if (e.type === POINTER_MOVE) {

      this.dx = e.screenX - this._screenX,
      this.dy = e.screenY - this._screenY;
      
      
      this.view1.translation = [this.dx + this.tx, this.dy + this.ty];
//      window.render_ui (performance.now ());
    }
    else if (e.type === POINTER_END) {
      this.tx += this.dx;
      this.ty += this.dy;
      document.removeEventListener (POINTER_MOVE, this);
      document.removeEventListener (POINTER_END, this);
      console.profileEnd("drag algo2");
    }
  },

  didDragStart : function () {
    console.profile("drag algo3");
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
    console.profileEnd("drag algo3");
  }
});

function loadApplication () {
  new Text ({id:"test", layout:vs.ui.View.ABSOLUTE_LAYOUT}).init ();
  vs.ui.Application.start ();
}
