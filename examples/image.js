var Test = vs.core.createClass ({

  /** parent class */
  parent: vs.gl.Application,

  initComponent : function () {
    this._super ();
    
    this.style.backgroundColor = vs.gl.Color.white;
  
    var test = new vs.gl.View ({
      position: [70, 70],
      size: [100, 100]
    }).init ();
    test.style.backgroundColor = vs.gl.Color.red;
    this.add (test);
    
    test.opacity = 0.5;
  
    this.glImage = new vs.gl.Image ({
      position: [100, 100],
      size: [512, 512],
      src: "texture.png",
      transformOrigin : [140, 75]
    }).init ();
    this.add (this.glImage);
    this.glImage.style.backgroundColor = vs.gl.Color.lightGrey;

    this.glImage2 = new vs.gl.Image ({
      position: [0, 0],
      size: [140, 140],
      src: "imageBis.png",
      transformOrigin : [140, 75]
    }).init ();
    this.add (this.glImage2);
    this.glImage2.style.backgroundColor = vs.gl.Color.transparent;
    this.glImage2.style.opacity = 1;
    this.glImage2.style.backgroundImage = "texture.png";


    var test = new vs.gl.View ({
      position: [20, 150],
      size: [300, 300]
    }).init ();
    test.style.backgroundColor = new vs.gl.Color (0, 0, 255, 0.5);
    test.style.backgroundImage = "image.png";
    test.style.backgroundImageUV = [-0.1,-0.1, -0.1,1.1, 1.1,-0.1, 1.1,1.1];
    
//    test.style.backgroundImageUV = [0.1,0.9, 0.1,0.1, 0.9,0.9, 0.9,0.1];
    window.SS = test.style;
//    test.opacity = 0.5;
    this.add (test);
  
    this.glImageToys = new vs.gl.Image ({
      position: [100, 700],
      size: [200, 100],
      src: "Toys R Us.png",
    }).init ();
    this.add (this.glImageToys);
    this.glImageToys.opacity = 0.5;
    
    this.glImageToysCopy = new vs.gl.Image ({
      position: [300, 700],
      size: [150, 30],
      src: "Toys R Us.png",
    }).init ();
    this.add (this.glImageToysCopy);
  }
});

function loadApplication () {
  new Test ({id:"test", layout:vs.ui.View.ABSOLUTE_LAYOUT}).init ();
  vs.gl.Application.start ();
}
