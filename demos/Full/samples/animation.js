var AnimationsDemo = vs.core.createClass ({

  /** parent class */
  parent: vs.gl.View,

  onload : function () {
    
    var
      size = [window.innerWidth, window.innerHeight],
      dx = (size [0] - Math.floor (size [0] / 120) * 120) / 2,
      x = dx,
      y = size [1] - (30 + 10);
      
    this.glView.transformOrigin = [100, 50];
    
    var buttonStyle = new vs.gl.Style ();
    buttonStyle.backgroundColor = new vs.gl.Color (200,200,200);
    buttonStyle.textAlign = "center";
    buttonStyle.fontSize = 15;
   
    var buttonSelectedStyle = new vs.gl.Style ();
    buttonSelectedStyle.backgroundColor = new vs.gl.Color (100,100,100);
    buttonSelectedStyle.textAlign = "center";
    buttonSelectedStyle.fontSize = 15;
   
    for (var i = 0; i < ANIMATION_LIST.length; i++) {
      var name = ANIMATION_LIST [i];
      
      var button = new GLButton ({
        position : [x, y],
        size : [110,25],
        text: name,
        style: buttonStyle
      }).init ();

      button.didTouch = function () {
        this._selected = true;
        this.style = buttonSelectedStyle;
      };
  
      button.didUntouch = function () {
        this._selected = false;
        this.style = buttonStyle;
      };

      
      button._index = i;
      
      this.add (button);
      
      button.bind ('select', this);
      
      x += 110 + 10;
      if (x + 110 + 10 > size [0]) {
        x = dx;
        y -= (25 + 10);
      }
    }
  },
  
  runDemo : function () {
    this.glView.show ();
    this.glView.translation = [0,0];
    this.glView.rotation = [0,0,0];
    this.glView.scaling = 1;
    this.glView.opacity = 1;
  },
  
  notify : function (event) {
    var index = event.src._index;
    var name = ANIMATION_LIST [index];
    
    vs.gl.Animation[name].process (this.glView);    
  }
});

var ANIMATION_LIST = [
  "Bounce", "Shake", "Swing", "Pulse", "FlipInX", "FlipOutX", "FlipInY", "FlipOutY",
  "FadeInUp", "FadeOutUp", "FadeInDown", "FadeOutDown", "FadeInLeft",
  "FadeOutLeft", "FadeInRight", "FadeOutRight"
]


// var anim = new vs.gl.Animation (['rotation', [0,0,20]], ['opacity', 1], ['translation', [100, 200]]);
// anim.keyFrame (0, [[0,0,0], 1, [0,0]]);
// anim.keyFrame (0.5, [[0,0,10], 0.5, [50,100]]);


var anim = new vs.gl.Animation (['rotation', [0,0,20]]);
anim.keyFrame (0, [[0,0,0]]);
anim.keyFrame (0.5, [[0,0,10]]);

//   var anim = new vs.gl.Animation (['opacity', 0.1]);
//   anim.keyFrame (0, [1]);
//    var anim = new vs.gl.Animation (['translation', [100, 200]]);
anim.duration = 1000;
//anim.repeat = 3;
//anim.steps = 10;
//    anim.keyFrame (0, [[-100, -100]]);
