define ('CurtainImageDemo', ['CurtainTextureView'], function (CurtainTextureView) {


  var CurtainImageDemo = vs.core.createClass ({

    /** parent class */
    parent: CurtainTextureView,

    initComponent : function () {
      this._super ();

      this.__recognizer = new vs.ui.DragRecognizer (this);
      this.addPointerRecognizer (this.__recognizer);

      this.animation = new vs.gl.Animation (
        {'slide': [0, 0]},
        {'classes': {'slide' : TrajectoryVect2D}}
      );
      this.animation.duration = 200;

      this.src = "Picture.jpg";
      this.size = [500, 500];
    },

    didDrag : function (drag_info, target, event) {
      var pointer = event.targetPointerList[0]
      var pos = this._position;

      var x = -drag_info.dx;

      this.slide = [x, pointer.clientY - pos [1]];
    },

    didDragEnd : function () {
      this.animation.keyFrame (0, {'slide': this._slide});
      this.animation.keyFrame (1, {'slide': [0, this._slide[1]]});

      this.animation.process (this);
    },
  });

  return CurtainImageDemo;
});
