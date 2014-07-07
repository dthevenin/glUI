define ('CurtainDemo', ['CurtainView', 'class', 'core'],
  function (CurtainView, klass, core) {

  var CurtainDemo = klass.createClass ({

    /** parent class */
    parent: CurtainView,

    initComponent : function () {
      this._super ();

      this.__recognizer = new vs.ui.DragRecognizer (this);
      this.addPointerRecognizer (this.__recognizer);

      this.animation = new core.Animation (
        {'slide': [0, 0]},
        {'classes': {'slide' : TrajectoryVect2D}}
      );
      this.animation.duration = 200;

      this.style.backgroundColor = new core.Color (180, 0, 0);
      this.size = [300, 450];
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
    }
  });

  return CurtainDemo;
});

});