var Text = vs.core.createClass ({

  /** parent class */
  parent: vs.gl.Application,

  initComponent : function () {
    this._super ();

    this.view1 = new vs.gl.View ({
      size: [100, 100],
      id: 'view1',
      position: [50, 50],
    }).init ();
    
    this.view1.style.backgroundColor = vs.gl.Color.red;

    this.add (this.view1);
    this._tmp_translation = vec3.create ();
 
    this.__recognizer = new vs.ui.DragRecognizer (this);
    this.view1.addPointerRecognizer (this.__recognizer);
  },

  didDragStart : function () {
    console.profile("drag");
    vec3.set (this.view1.translation, this._tmp_translation);
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
    console.profileEnd("drag");
  }
});

function loadApplication () {
  new Text ({id:"test", layout:vs.ui.View.ABSOLUTE_LAYOUT}).init ();
  vs.ui.Application.start ();
}
