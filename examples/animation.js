var Test = vs.core.createClass ({

  /** parent class */
  parent: vs.gl.Application,

  initComponent : function () {
    this._super ();
    
    window.v1 = this.glView1 = new vs.gl.View ({
      position: [50, 70],
      size: [150, 100],
      transformOrigin : [75, 50]
    }).init ();
    this.add (this.glView1);
    this.glView1.style.backgroundColor = vs.gl.Color.red;
    

    window.v2 = this.glView2 = new vs.gl.View ({
      position: [150, 270],
      size: [200, 100],
      transformOrigin : [100, 50]
    }).init ();
    this.add (this.glView2);
    this.glView2.style.backgroundColor = vs.gl.Color.red;
    
//     FadeInLeft.process (v2, function () {
//       console.log ("c'estfinit");
//     });
//     FadeOutRight.process (v1);

    anim.process (v1,function () {
      FadeOutRight.process (v1, function () {
        console.log ("c'est finit");
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



// var anim = new vs.gl.Animation (['rotation', [0,0,20]], ['opacity', 1], ['translation', [100, 200]]);
// anim.keyFrame (0, [[0,0,0], 1, [0,0]]);
// anim.keyFrame (0.5, [[0,0,10], 0.5, [50,100]]);


var anim = new vs.gl.Animation ({'rotation': [0,0,20]});
anim.keyFrame (0, {'rotation':[0,0,0]});
anim.keyFrame (0.5, {'rotation':[0,0,10]});

//   var anim = new vs.gl.Animation (['opacity', 0.1]);
//   anim.keyFrame (0, [1]);
//    var anim = new vs.gl.Animation (['translation', [100, 200]]);
anim.duration = 1000;
//anim.repeat = 3;
//anim.steps = 10;
//    anim.keyFrame (0, [[-100, -100]]);


var anim2 = new vs.gl.Animation ({'translation': [0,200,0]});
anim2.keyFrame (0, {'translation':[0,0,0]});
anim2.keyFrame (0.5, {'translation':[100,0,10]});
anim2.duration = 1000;
