define ('FishEyeDemo', ['FishEyeView', 'core', 'class'],
  function (FishEyeView, core, klass) {


  var FishEyeDemo = klass.createClass ({

    /** parent class */
    parent: FishEyeView,

    initComponent : function () {
      this._super ();

      this.__recognizer = new vs.ui.DragRecognizer (this);
      this.addPointerRecognizer (this.__recognizer);

      this.animation = new core.Animation (
        {'radius': 0},
        {'classes': {'radius' : TrajectoryVect1D}}
      );
      this.animation.duration = 200;

      this.src = "Picture.jpg";
      this.size = [500, 500];
    },

    didDragStart : function (target, event) {
      var pointer = event.targetPointerList[0];
      var pos = this._position;
      this.slide = [pointer.pageX - pos[0], pointer.pageY - pos[1]];

      this.animation.keyFrame (0, {'radius': 0});
      this.animation.keyFrame (1, {'radius': 200});

      this.animation.process (this);
    },

    didDrag : function (drag_info, target, event) {
      var pointer = event.targetPointerList[0];
      var pos = this._position;
      this.slide = [pointer.pageX - pos[0], pointer.pageY - pos[1]];
    },

    didDragEnd : function () {
      this.animation.keyFrame (0, {'radius': 200});
      this.animation.keyFrame (1, {'radius':0});

      this.animation.process (this);
    }
  });

  return FishEyeDemo;
});
