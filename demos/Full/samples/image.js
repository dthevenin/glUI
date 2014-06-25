var ImagesSample = vs.core.createClass ({

  /** parent class */
  parent: vs.gl.View,

  onload : function () {  
    var test = new vs.gl.View ({
      position: [0, 00],
      size: [300, 50]
    }).init ();
    test.style.backgroundColor = vs.gl.Color.white;
    this.add (test);
  
    test = new vs.gl.View ({
      position: [70, 70],
      size: [300, 100]
    }).init ();
    test.style.backgroundColor = vs.gl.Color.red;
    this.add (test);
  
    this.glImage = new vs.gl.Image ({
      position: [0, 100],
      size: [360, 260],
      src: "samples/texture.png",
      transformOrigin : [140, 75]
    }).init ();
    this.add (this.glImage);
    this.glImage.style.backgroundColor = vs.gl.Color.lightGrey;

    this.glImage2 = new vs.gl.Image ({
      position: [0, 0],
      size: [140, 140],
      src: "samples/imageBis.png",
      transformOrigin : [140, 75]
    }).init ();
    this.add (this.glImage2);
    this.glImage2.style.backgroundColor = vs.gl.Color.transparent;
    this.glImage2.style.opacity = 1;
    this.glImage2.style.backgroundImage = "samples/texture.png";


    var test = new vs.gl.View ({
      position: [160, 0],
      size: [200, 200]
    }).init ();
    test.style.backgroundColor = new vs.gl.Color (0, 0, 255, 0.5);
    test.style.backgroundImage = "samples/image.png";
    test.style.backgroundImageUV = [-0.1,-0.1, -0.1,1.1, 1.1,-0.1, 1.1,1.1];
    
    this.add (test);
  
    this.glImageToys = new vs.gl.Image ({
      position: [200, 200],
      size: [50, 50],
      src: "samples/logo.png",
    }).init ();
    this.add (this.glImageToys);

    this.glImageToysCopy = new vs.gl.Image ({
      position: [200, 260],
      size: [100, 25],
      src: "samples/logo.png",
    }).init ();
    this.add (this.glImageToysCopy);
  }
});