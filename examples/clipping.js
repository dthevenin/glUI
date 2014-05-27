var Test = vs.core.createClass ({

  /** parent class */
  parent: vs.ui.GLApplication,

  initComponent : function () {
    this._super ();
    
    var view1 = new vs.ui.GLView ({
      position: [20, 40],
      size: [100, 100]
    }).init ();
    this.add (view1);
    view1.style.backgroundColor = GLColor.blue;

    var view2 = new vs.ui.GLView ({
      position: [50, 70],
      size: [300, 300]
    }).init ();
    this.add (view2);
    view2.style.backgroundColor = GLColor.red;

    var text = new vs.ui.GLText ({
      position: [50, 10],
      size: [200, 30],
      text: "Salut"
    }).init ();
    text.style.color = GLColor.white;
    text.style.fontSize = 50;
    view2.add (text);

    var image = new vs.ui.GLImage ({
      position: [50, 100],
      size: [100, 100],
      src: "imageBis.png"
    }).init ();
//    image.style.color = GLColor.white;
 //   image.style.fontSize = 50;
    view2.add (image);

    var view3 = new vs.ui.GLView ({
      position: [160, 300],
      size: [100, 100]
    }).init ();
    this.add (view3);
    view3.style.backgroundColor = new GLColor (0, 0, 0, 0.4);
    view3.style.backgroundColor.setColorArray (
      0, 1, 0, 0.2,
      0, 1, 0, 1,
      0, 0, 1, 0,
      1, 0, 0, 1
    );

    var view4 = new vs.ui.GLView ({
      position: [150,250],
      size: [200, 100]
    }).init ();
    view2.add (view4);
    view4.style.backgroundColor = new GLColor (0, 0, 0, 0.4);
  }
});

function loadApplication () {
  new Test ({id:"test", layout:vs.ui.View.ABSOLUTE_LAYOUT}).init ();
  vs.ui.Application.start ();
}

ACTIVATE_STATS = true