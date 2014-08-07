require (['core', 'class'], function (core, klass) {

var Test = klass.createClass ({

  /** parent class */
  parent: core.Application,

  initComponent : function () {
    this._super ();

    var glView1 = new core.View ({
      position: [100, 10],
      size: [200, 200],
      rotation: [-60, 0, 0]
    }).init ();
    this.add (glView1);
    glView1.style.backgroundColor = core.Color.red;

    var glView2 = new core.View ({
      position: [80, 80],
      size: [40, 40],
      rotation: [0, 60, 0],
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.yellow;

    glView1 = new core.View ({
      position: [100, 290],
      size: [200, 200],
      rotation: [60, 0, 0],
      transformOrigin: [0, 200]
    }).init ();
    this.add (glView1);
    glView1.style.backgroundColor = core.Color.red;

    glView2 = new core.View ({
      position: [80, 80],
      size: [40, 40],
      rotation: [0, 60, 0],
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.yellow;

    glView1 = new core.View ({
      position: [10, 150],
      size: [200, 200],
      rotation: [0, 60, 0]
    }).init ();
    this.add (glView1);
    glView1.style.backgroundColor = core.Color.red;

    glView2 = new core.View ({
      position: [80, 80],
      size: [40, 40],
      rotation: [0, -60, 0],
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.yellow;

    glView1 = new core.View ({
      position: [190, 150],
      size: [200, 200],
      rotation: [0, -60, 0],
      transformOrigin: [200, 0]
    }).init ();
    this.add (glView1);
    glView1.style.backgroundColor = core.Color.red;

    glView2 = new core.View ({
      position: [80, 80],
      size: [40, 40],
      rotation: [0, 60, 0],
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.yellow;
  }
});

function launchTest (view) {
  var t = new Test ({id:"simple"}).init ();
  core.Application.start ();
  
  return t;
}

return launchTest ();

});