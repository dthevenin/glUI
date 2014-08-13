require.config ({ baseUrl: "../lib" });

require (['core', 'class'], function (core, klass) {

var testPerfAnim = klass.createClass ({

  /** parent class */
  parent: core.Application,

  initComponent : function () {
    this._super ();

    this.style.backgroundColor = core.Color.white;
    this.style.backgroundImage = "assets/background.jpg";

    var animation = new core.Animation ({'translation': [0,0,0]});
    animation.keyFrame (0, {'translation': [0, 0, 0]});
    animation.keyFrame (0.25, {'translation': [400, 0, 0]});
    animation.keyFrame (0.50, {'translation': [400, 300, 0]});
    animation.keyFrame (0.75, {'translation': [0, 300, 0]});
    animation.duration = 20000;
    animation.timing = core.Animation.LINEAR;
    animation.repeat = 200;


    function setDiv (parent, dec) {
      var delay = 0;
      for (var i = 0; i < 300; i++) {
        var img = new core.Image ({
          position: [10 + dec, 10 + dec],
          size: [135, 126],
          src: "assets/circle.png",
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

function launchTest (view) {
  var t = new testPerfAnim ({id:"test"}).init ();
  core.Application.start ();
  
  return t;
}

return launchTest ();
});