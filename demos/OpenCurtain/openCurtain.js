　require.config({
  baseUrl: "",
  paths: {
    'Data' : 'Data',
    'ListItem' : 'ListItem',
    'CurtainView' : 'meshTransform/CurtainView',
    'CurtainTextureView' : 'meshTransform/CurtainTextureView'
  }
});

require (['CurtainTextureView', 'ListItem', 'Data'], function (CurtainTextureView, ListItem, Data) {
  
  var demoSize = [400, 550];
  var demoPosition = [0, 0];

  var CurtainDemo = vs.core.createClass ({

    /** parent class */
    parent: vs.ui.GLApplication,

    initComponent : function () {
      this._super ();

      this.style.backgroundColor = GLColor.white;

      this.intList ();
      this.initCurtain ();
    },
    
    initCurtain : function () {
       var view = new CurtainTextureView ({
        src : "assets/velour.jpg",
        position: demoPosition,
        size : demoSize,
      }).init ();

      this.curtain_recognizer = new vs.ui.DragRecognizer (this);
      this.addPointerRecognizer (this.curtain_recognizer);

      this.curtainAnimation = new GLAnimation (
        {'slide': [0, 0]},
        {'classes': {'slide' : TrajectoryVect2D}}
      );
      this.curtainAnimation.duration = 200;
  
      this.curtainView = view;
      this.add (view);
    },
    
    intList: function () {
      var size = demoSize;
      var list = new GLList ({
        size : size,
        position: demoPosition,
        scroll: true,
        scaling: 0.2,
        transformOrigin : [size[0]/1.2, size[1]/2]
      }).init ();
      this.add (list);
      list.style.backgroundColor = GLColor.white;
      var l = Data.length;
      for (var i = 0; i < l; i++) {
        var d = Data [i % l];
        var model = new vs.core.Model ().init ();
        model.parseData (d)

        var item = new ListItem ({size : [size[0], 70]}).init ();
        list.add (item);
        item.link (model);

        item.style.backgroundColor = new GLColor (240, 240, 240);
      }
      
      this.listAnimation = new GLAnimation (
        {'scaling' : 0.5}
      );
      this.listAnimation.duration = 200;
      
      this.list = list;
    },

    didDrag : function (drag_info, target, event) {
      var pointer = event.targetPointerList[0]
      var pos = this._position;

      var x = -drag_info.dx;
      var s = x / demoSize [0];
      if (s > 0.95) s = 0.95;
      if (s < 0.2) s = 0.2;

      this.curtainView.slide = [x, pointer.clientY - pos [1]];
      this.list.scaling = s;
    },

    didDragEnd : function () {
      
      if (this.curtainView._slide [0] > demoSize [0] / 2) {
        // Open animation
        this.curtainAnimation.keyFrame (
          0, { 'slide': this.curtainView._slide }
        );
        this.curtainAnimation.keyFrame (
          1, {
            'slide': [demoSize [0] - 10, this.curtainView._slide[1]]
          }
        );

        this.listAnimation.keyFrame (
          0, { 'scaling' : this.list.scaling }
        );
        this.listAnimation.keyFrame (
          1, { 'scaling' : 0.95 }
        );
      }
      else {
        // Close animation
        this.curtainAnimation.keyFrame (
          0, { 'slide': this.curtainView._slide }
        );
        this.curtainAnimation.keyFrame (
          1, { 'slide': [0, this.curtainView._slide[1]] }
        );
      
        this.listAnimation.keyFrame (
          0, { 'scaling' : this.list.scaling }
        );
        this.listAnimation.keyFrame ( 1, { 'scaling' : 0.2 } );
      }

      this.curtainAnimation.process (this.curtainView);
      this.listAnimation.process (this.list);
    }
  });

  new CurtainDemo ().init ();
  vs.ui.Application.start ();
});