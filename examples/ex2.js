require.config ({ baseUrl: "../lib" });

require (['core', 'class'], function (core, klass) {

var Test = klass.createClass ({

  /** parent class */
  parent: core.Application,

  initComponent : function () {
    this._super ();

    var glView2 = new core.View ({
      position: [50, 50],
      size: [150, 100],
      transformOrigin : [75, 50],
    }).init ();
    glView2.style.backgroundColor = core.Color.red;
    
    var glView1 = new core.View ({
      position: [100, 100],
      size: [300, 200],
      transformOrigin : [150, 100],
    }).init ();
    this.add (glView1);
    glView1.style.backgroundColor = core.Color.blue;

    glView1.add (glView2);
   
    
    var x = 0;
    setInterval (function () {
      x += 2;
      x %= 300;
      glView1.translation = [x, 0];
      glView2.rotation = [0, 0, x* 1.5];
    }, 50); 

    var s = 0;
    setInterval (function () {
      s += 0.02;
      s %= 1;
      glView1.scaling = 1 + s;
    }, 30);    
  }
});

function loadApplication () {
  new Test ({id:"test"}).init ();
  core.Application.start ();
}

loadApplication ();
});