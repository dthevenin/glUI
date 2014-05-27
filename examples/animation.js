var Test = vs.core.createClass ({

  /** parent class */
  parent: vs.ui.GLApplication,

  initComponent : function () {
    this._super ();
    
    window.v1 = this.glView1 = new vs.ui.GLView ({
      position: [50, 70],
      size: [150, 100],
      transformOrigin : [75, 50]
    }).init ();
    this.add (this.glView1);
    this.glView1.style.backgroundColor = GLColor.red;
    

    window.v2 = this.glView2 = new vs.ui.GLView ({
      position: [150, 270],
      size: [200, 100],
      transformOrigin : [100, 50]
    }).init ();
    this.add (this.glView2);
    this.glView2.style.backgroundColor = GLColor.red;
    
//     FadeInLeft.process (v2, function () {
//       console.log ("c'estfinit");
//     });
//     FadeOutRight.process (v1);

anim.process (v1,function () {
  FadeOutRight.process (v1, function () {
      console.log ("c'estfinit");
    });
});
anim2.process (v2);
   
// 
//     slider.connect ("value").to (this.glView1, "rotation")
//       .to (this.glView1, "translation", function (x) {
//         return [[x, 0]];
//       });
// 
//     slider.connect ("value").to (this.glView2, "rotation");
  }
});

function loadApplication () {
  new Test ({id:"test", layout:vs.ui.View.ABSOLUTE_LAYOUT}).init ();
  vs.ui.Application.start ();
}



// var anim = new GLAnimation (['rotation', [0,0,20]], ['opacity', 1], ['translation', [100, 200]]);
// anim.addKeyFrame (0, [[0,0,0], 1, [0,0]]);
// anim.addKeyFrame (0.5, [[0,0,10], 0.5, [50,100]]);


var anim = new GLAnimation (['rotation', [0,0,20]]);
anim.addKeyFrame (0, [[0,0,0]]);
anim.addKeyFrame (0.5, [[0,0,10]]);

//   var anim = new GLAnimation (['opacity', 0.1]);
//   anim.addKeyFrame (0, [1]);
//    var anim = new GLAnimation (['translation', [100, 200]]);
anim.duration = 1000;
//anim.repeat = 3;
//anim.steps = 10;
//    anim.addKeyFrame (0, [[-100, -100]]);


var anim2 = new GLAnimation (['translation', [0,200,0]]);
anim2.addKeyFrame (0, [[0,0,0]]);
anim2.addKeyFrame (0.5, [[100,0,10]]);
anim2.duration = 1000;
