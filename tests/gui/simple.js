require (['core', 'class'], function (core, klass) {

var Test = klass.createClass ({

  /** parent class */
  parent: core.Application,

  initComponent : function () {
    this._super ();

    var glView1 = new core.View ({
      position: [10, 10],
      size: [150, 50],
      transformOrigin : [75, 50]
    }).init ();
    this.add (glView1);
    glView1.style.backgroundColor = core.Color.yellow;

    var glView2 = new core.View ({
      position: [150, 70],
      size: [200, 100],
      transformOrigin : [100, 50]
    }).init ();
    this.add (glView2);
    glView2.style.backgroundColor = new core.Color (13, 46, 100, 0.9);

    glView2 = new core.View ({
      position: [50, 180],
      size: [200, 150],
      transformOrigin : [25, 90],
      rotation: [0, 0, 50],
      translation: [50, 20, 0]
    }).init ();
    glView2.style.backgroundColor = core.Color.pink;
    glView2.style.opacity = 0.4;
    this.add (glView2);
    
    glView1 = new core.View ({
      position: [10, 10],
      size: [30, 20],
      transformOrigin : [30, 0],
      rotation: [0, 0, -50],
      scaling: 2
    }).init ();
    glView2.add (glView1);
    glView1.style.backgroundColor = core.Color.blue;
  }
});

function launchTest (view) {
  var t = new Test ({id:"simple"}).init ();
  core.Application.start ();
  
  return t;
}

return launchTest ();

});