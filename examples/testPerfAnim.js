var testPerfAnim = vs.core.createClass ({

  /** parent class */
  parent: vs.ui.GLApplication,

  initComponent : function () {
    this._super ();

    this.style.backgroundColor = GLColor.white;
    this.style.backgroundImage = "background.jpg";

    var animation = new GLAnimation (['translation', [00,0]]);
    animation.addKeyFrame (0, [[0, 0]]);
    animation.addKeyFrame (0.25, [[600, 0]]);
    animation.addKeyFrame (0.50, [[600, 400]]);
    animation.addKeyFrame (0.75, [[0, 400]]);
    animation.duration = 20000;
    animation.timing = GLAnimation.LINEAR;
    animation.repeat = 200;


    function setDiv (parent, dec) {
      var delay = 0;
//      for (var i = 0; i < 100; i++) {
      for (var i = 0; i < 3; i++) {
        var img = new vs.ui.GLImage ({
          position: [100 + dec, 100 + dec],
          size: [135, 126],
          src: "circle.png",
        }).init ();
        
        parent.add (img);
        
        animation.begin = -delay;
        delay += 125;
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
  vs.ui.Application.start ();
}
