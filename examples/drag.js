require.config ({ baseUrl: "../lib" });

require (['core', 'class'], function (core, klass) {

var Text = klass.createClass ({

  /** parent class */
  parent: core.Application,

  initComponent : function () {
    this._super ();

    this.view1 = new core.Text ({
      size: [100, 100],
      id: 'view1',
      position: [50, 50],
    }).init ();
    
    this.view1.style.backgroundColor = core.Color.red;

    this.add (this.view1);
    this._tmp_translation = core.vec3.create ();
 
    var algo = 2;
 
    if (algo === 1) {
      // algo1    
      this.handleEvent = this.handleEventAlog1;
      document.addEventListener (core.POINTER_START, this);
    }
    else if (algo === 2) {
      // algo 2
      this.tx=0 ; this.ty =0; this.dx; this.dy;
      this.handleEvent = this.handleEventAlog2;
      document.addEventListener (core.POINTER_START, this);
    }
    else if (algo === 3) {
      // alog 3
      this.__recognizer = new vs.ui.DragRecognizer (this);
      this.view1.addPointerRecognizer (this.__recognizer);
    }
  },
  
  handleEventAlog1 : function (e) {

    if (e.type === core.POINTER_START) {
      document.addEventListener (core.POINTER_MOVE, this);
      document.addEventListener (core.POINTER_END, this);

      this._screenX = e.screenX;
      this._screenY = e.screenY;

      core.vec3.set (this.view1.translation, this._tmp_translation);
    }
    else if (e.type === core.POINTER_MOVE) {

      var
        dx = e.screenX - this._screenX,
        dy = e.screenY - this._screenY;
      
      var t = this.view1.translation;
      t[0] = this._tmp_translation [0] + dx;
      t[1] = this._tmp_translation [1] + dy;

      // update position and will force graphic update
      this.view1.translation = t;
    }
    else if (e.type === core.POINTER_END) {
      document.removeEventListener (core.POINTER_MOVE, this);
      document.removeEventListener (core.POINTER_END, this);
    }
  },
  
  handleEventAlog2 : function (e) {

    if (e.type === core.POINTER_START) {
      console.profile("drag algo2");
      document.addEventListener (core.POINTER_MOVE, this);
      document.addEventListener (core.POINTER_END, this);

      this._screenX = e.screenX;
      this._screenY = e.screenY;
    }
    else if (e.type === core.POINTER_MOVE) {

      this.dx = e.screenX - this._screenX,
      this.dy = e.screenY - this._screenY;
      
      
      var t = this.view1.translation;
      t[0] = this.dx + this.tx;
      t[1] = this.dy + this.ty;

      // update position and will force graphic update
      this.view1.translation = t;
//      window.render_ui (performance.now ());
    }
    else if (e.type === core.POINTER_END) {
      this.tx += this.dx;
      this.ty += this.dy;
      document.removeEventListener (core.POINTER_MOVE, this);
      document.removeEventListener (core.POINTER_END, this);
      console.profileEnd("drag algo2");
    }
  },

  didDragStart : function () {
    console.profile("drag algo3");
    core.vec3.set (this.view1.translation, this._tmp_translation);
  },

  didDrag : function (drag_info, event) {
    var
      dy = drag_info.dy,
      dx = drag_info.dx;
      
    var t = this.view1.translation;
    t[0] = this._tmp_translation [0] + dx;
    t[1] = this._tmp_translation [1] + dy;

    // update position and will force graphic update
    this.view1.translation = t;
  },

  didDragEnd : function (drag_info, event) {
    console.profileEnd("drag algo3");
  }
});

function loadApplication () {
  new Text ({id:"test"}).init ();
  core.Application.start ();
}

loadApplication ();
});