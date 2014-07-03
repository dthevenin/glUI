　require.config({
  baseUrl: "",
  paths: {
    'Data' : 'data',
    'ListItem' : 'ListItem',
    'CurtainView' : 'meshTransform/CurtainView',
    'CurtainTextureView' : 'meshTransform/CurtainTextureView'
  }
});

require (['CurtainTextureView', 'ListItem', 'Data'], function (CurtainTextureView, ListItem, Data) {
  
  var demoSize = [window.innerWidth, window.innerHeight];
  var demoPosition = [0, 0];

  var CurtainDemo = vs.gl.createClass ({

    /** parent class */
    parent: vs.gl.Application,
    startSlide: 0,

    initComponent : function () {
      this._super ();

      this.style.backgroundColor = vs.gl.Color.white;

      this.intList ();
      this.initCurtain ();
    },
    
    initCurtain : function () {
       var view = new CurtainTextureView ({
        src : "assets/velour.jpg",
        position: [demoPosition [0] - 10, demoPosition[1]],
        size : [demoSize [0] + 10, demoSize [1]],
      }).init ();

      this.curtain_recognizer = new vs.ui.DragRecognizer (this);
      view.addPointerRecognizer (this.curtain_recognizer);

      this.curtainAnimation = new vs.gl.Animation (
        {'slide': [0, 0]},
        {'classes': {'slide' : TrajectoryVect2D}}
      );
      this.curtainAnimation.duration = 200;
  
      this.curtainView = view;
      this.add (view);
    },
    
    intList: function () {
      var size = demoSize;
      var list = new vs.gl.List ({
        size : [size [0] - 10, size [1]],
        position: [demoPosition [0] + 10, demoPosition[1]],
        scroll: true,
        scaling: 0.2,
        transformOrigin : [size[0]/1.2, size[1]/2]
      }).init ();
      
      this.add (list);
      list.style.backgroundColor = vs.gl.Color.white;
      var l = Data.length;
      for (var i = 0; i < l * 5; i++) {
        var d = Data [i % l];
        var model = new vs.core.Model ().init ();
        model.parseData (d)

        var item = new ListItem ({size : [size[0], 70]}).init ();
        list.add (item);
        item.link (model);

        item.style.backgroundColor = new vs.gl.Color (240, 240, 240);
      }
      
      this.listAnimation = new vs.gl.Animation (
        {'scaling' : 0.5}
      );
      this.listAnimation.duration = 200;
      
      this.list = list;
    },
    
    didDragStart : function (target, event) {
      this.startSlide = this.curtainView._slide[0];
      
      var pointer = event.targetPointerList[0]
      var pos = this._position;

      var slide = [this.startSlide, pointer.clientY - pos [1]];

      this.curtainAnimation.keyFrame (
        0, { 'slide': this.curtainView._slide }
      );
      this.curtainAnimation.keyFrame (
        1, { 'slide': slide }
      );
      
      this.curtainAnimation.process (this.curtainView);
    },
    
    didDrag : function (drag_info, target, event) {
      var pointer = event.targetPointerList[0]
      var pos = this._position;

      var x = -drag_info.dx + this.startSlide;
      var s = x / demoSize [0];
      if (s > 1) s = 1;
      if (s < 0.2) s = 0.2;

      this.curtainView.slide = [x, pointer.clientY - pos [1]];
      this.list.scaling = s;
    },

    didDragEnd : function () {
      
      if (this.curtainView._slide [0] > demoSize [0] / 1.5) {
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
          1, { 'scaling' : 1 }
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
  vs.gl.Application.start ();
});