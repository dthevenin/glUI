require (['core', 'class'], function (core, klass) {

var Test = klass.createClass ({

  /** parent class */
  parent: core.Application,

  initComponent : function () {
    this._super ();

    var glView1 = new core.View ({
      position: [100, 100],
      size: [200, 200],
    }).init ();
    this.add (glView1);
    glView1.style.backgroundColor = core.Color.yellow;

    // should be visible (but not clipped!!!)
    glView2 = new core.View ({
      position: [90, 90],
      size: [20, 20]
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.green;

    glView2 = new core.View ({
      position: [-10, -10],
      size: [20, 20]
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.green;

    glView2 = new core.View ({
      position: [190, -10],
      size: [20, 20]
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.green;

    glView2 = new core.View ({
      position: [190, 190],
      size: [20, 20]
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.green;

    glView2 = new core.View ({
      position: [-10, 190],
      size: [20, 20]
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.green;

    glView2 = new core.View ({
      position: [90, -20],
      size: [20, 20]
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.green;

    glView2 = new core.View ({
      position: [200, 90],
      size: [20, 20]
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.green;

    glView2 = new core.View ({
      position: [90, 200],
      size: [20, 20]
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.green;

    glView2 = new core.View ({
      position: [-20, 90],
      size: [20, 20]
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.green;


    // should not be visible
    glView2 = new core.View ({
      position: [-10, -21],
      size: [20, 20]
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.red;

    glView2 = new core.View ({
      position: [190, -21],
      size: [20, 20]
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.red;

    glView2 = new core.View ({
      position: [190, 201],
      size: [20, 20]
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.red;

    glView2 = new core.View ({
      position: [-21, 190],
      size: [20, 20]
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.red;


    glView2 = new core.View ({
      position: [90, -21],
      size: [20, 20]
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.red;

    glView2 = new core.View ({
      position: [201, 90],
      size: [20, 20]
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.red;

    glView2 = new core.View ({
      position: [90, 201],
      size: [20, 20]
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.red;

    glView2 = new core.View ({
      position: [-21, 90],
      size: [20, 20]
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.red;
  }
});

function launchTest (view) {
  var t = new Test ({id:"simple"}).init ();
  core.Application.start ();
  
  return t;
}

return launchTest ();

});