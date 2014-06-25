var glImage;
var Test = vs.core.createClass ({

  /** parent class */
  parent: vs.gl.Application,

  initComponent : function () {
    this._super ();
    
    var slider3 = new vs.ui.Slider ({
      position: [50, 50],
      range: [0, 100]
    }).init ();
    document.body.appendChild (slider3.view);
    
    var glImage = new GLMap ({
      position: [20, 20],
      size: [320, 520],
      transformOrigin : [400, 400]
    }).init ();
//    glImage.rotation = [40, 40, 180];
    this.add (glImage);

    slider3.bind ("continuous_change", this , function (event) {
      glImage.update_vectices (event.data);
    }); 
  }
});

function loadApplication () {
  var app = new Test ({id:"test", layout:vs.ui.View.ABSOLUTE_LAYOUT}).init ();
  vs.ui.Application.start ();
}
