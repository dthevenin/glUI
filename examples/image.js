require.config ({ baseUrl: "../lib" });

require (['core', 'class'], function (core, klass) {

var Test = klass.createClass ({

  /** parent class */
  parent: core.Application,

  initComponent : function () {
    this._super ();
    
    this.style.backgroundColor = core.Color.white;
  
    var test = new core.View ({
      position: [70, 70],
      size: [100, 100]
    }).init ();
    test.style.backgroundColor = core.Color.red;
    this.add (test);
    
    test.opacity = 0.5;
  
    this.glImage = new core.Image ({
      position: [100, 100],
      size: [512, 512],
      src: "texture.png",
      transformOrigin : [140, 75]
    }).init ();
    this.add (this.glImage);
    this.glImage.style.backgroundColor = core.Color.lightGrey;

    this.glImage2 = new core.Image ({
      position: [0, 0],
      size: [140, 140],
      src: "imageBis.png",
      transformOrigin : [140, 75]
    }).init ();
    this.add (this.glImage2);
    this.glImage2.style.backgroundColor = core.Color.transparent;
    this.glImage2.style.opacity = 1;
    this.glImage2.style.backgroundImage = "texture.png";


    var test = new core.View ({
      position: [20, 150],
      size: [300, 300]
    }).init ();
    test.style.backgroundColor = new core.Color (0, 0, 255, 0.5);
    test.style.backgroundImage = "image.png";
    test.style.backgroundImageUV = [-0.1,-0.1, -0.1,1.1, 1.1,-0.1, 1.1,1.1];
    
//    test.style.backgroundImageUV = [0.1,0.9, 0.1,0.1, 0.9,0.9, 0.9,0.1];
    window.SS = test.style;
//    test.opacity = 0.5;
    this.add (test);
  
    this.glImageToys = new core.Image ({
      position: [100, 700],
      size: [200, 100],
      src: "Toys R Us.png",
    }).init ();
    this.add (this.glImageToys);
    this.glImageToys.opacity = 0.5;
    
    this.glImageToysCopy = new core.Image ({
      position: [300, 700],
      size: [150, 30],
      src: "Toys R Us.png",
    }).init ();
    this.add (this.glImageToysCopy);
  }
});

function loadApplication () {
  new Test ({id:"test"}).init ();
  core.Application.start ();
}

loadApplication ();

});