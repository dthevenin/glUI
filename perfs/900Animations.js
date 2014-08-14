require.config ({ baseUrl: "../lib" });

define ("900Animations", ['core', 'class'], function (core, klass) {

var animation, objects = [];

var testPerfAnim = klass.createClass ({

  /** parent class */
  parent: core.Application,

  initComponent : function () {
    this._super ();

    this.style.backgroundColor = core.Color.white;
    this.style.backgroundImage = "assets/background.jpg";

    animation = new core.Animation ({'translation': [0,0,0]});
    animation.keyFrame (0, {'translation': [0, 0, 0]});
    animation.keyFrame (0.25, {'translation': [400, 0, 0]});
    animation.keyFrame (0.50, {'translation': [400, 300, 0]});
    animation.keyFrame (0.75, {'translation': [0, 300, 0]});
    animation.duration = 20000;
    animation.repeat = 10;
    animation.timing = core.Animation.LINEAR;

    function setDiv (parent, dec) {
      for (var i = 0; i < 300; i++) {
        var img = new core.Image ({
          position: [10 + dec, 10 + dec],
          size: [135, 126],
          src: "assets/circle.png",
        }).init ();
        
        parent.add (img);
        objects.push (img);
      }
    }
    
    setDiv (this, 0);
    setDiv (this, 80);
    setDiv (this, 160);
  }
});

var app;

function startPerf (endClb) {
  var delay = 0;

  objects.forEach (function (img) {
    animation.begin = -delay;
    delay += 75;
    animation.process (img);
  })
  
  setTimeout (function () {
    if (endClb) endClb ();
  }, 6000);
}

function launchTest (view) {
  var app = new testPerfAnim ({id:"test"}).init ();
  core.Application.start ();
  
  app.startPerf = startPerf;
  
  return app;
}

return launchTest ();
});