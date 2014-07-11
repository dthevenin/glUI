require.config ({ baseUrl: "../lib" });

require (['core', 'class'], function (core, klass) {

var testPerfAnim = klass.createClass ({

  /** parent class */
  parent: core.Application,

  initComponent : function () {
    this._super ();

    this.style.backgroundColor = core.Color.white;
    this.style.backgroundImage = "background.jpg";

    var animation = new core.Animation ({'translation': [0,0,0]});
    animation.keyFrame (0, {'translation': [0, 0, 0]});
    animation.keyFrame (0.25, {'translation': [600, 0, 0]});
    animation.keyFrame (0.50, {'translation': [600, 400, 0]});
    animation.keyFrame (0.75, {'translation': [0, 400, 0]});
    animation.duration = 20000;
    animation.timing = core.Animation.LINEAR;
    animation.repeat = 200;


    function setDiv (parent, dec) {
      var delay = 0;
//      for (var i = 0; i < 300; i++) {
      for (var i = 0; i < 3; i++) {
        var img = new core.Image ({
          position: [100 + dec, 100 + dec],
          size: [135, 126],
          src: "circle.png",
        }).init ();
        
        parent.add (img);
        
        animation.begin = -delay;
        delay += 75;
        animation.process (img);
      }
    }
    
    setDiv (this, 0);
    setDiv (this, 80);
    setDiv (this, 160);
  }
});

function loadApplication () {
  var app = new testPerfAnim ({id:"test"})
  app.init ();
  core.Application.start ();
}

loadApplication ();
});