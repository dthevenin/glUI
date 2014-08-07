require.config ({ baseUrl: "../lib" });

require (['core', 'class'], function (core, klass) {

var Test1 = klass.createClass ({

  /** parent class */
  parent: core.Application,

  initComponent : function () {
    this._super ();
    
    this.style.backgroundColor = core.Color.red;
 //   this.translation = [-200, -100, 0]
 //return
 
 var decl = [50, 0]

   var glView1 = new core.View ({
     position: decl,
     size: [100, 100],
//     translation : [100, 50, 0]
   }).init ();
   this.add (glView1);
   glView1.style.backgroundColor = core.Color.blue;

   glView1 = new core.Image ({
     size: [200, 200],
     translation : [decl [0] + 100, decl [1] + 100, 0],
     src: "picture2.png"
   }).init ();
   this.add (glView1);
   glView1.style.backgroundColor = core.Color.yellow;

   return
   
   glView1 = new core.Image ({
     size: [100, 100],
     translation : [decl [0] + 100, decl [1] + 300, 0],
     src: "picture2.png"
   }).init ();
   this.add (glView1);


   glView1 = new core.Image ({
     size: [50, 50],
     translation : [decl [0] + 100, decl [1] + 400, 0],
     src: "picture2.png"
   }).init ();
   this.add (glView1);
  }
});

var Test2 = klass.createClass ({


  /** parent class */
  parent: core.Application,

  initComponent : function () {
    this._super ();

    var glView1 = new core.View ({
      position: [100, 10],
      size: [200, 200],
      rotation: [-90, 0, 0]
    }).init ();
    this.add (glView1);
    glView1.style.backgroundColor = core.Color.red;

    var glView2 = new core.View ({
      position: [80, 80],
      size: [40, 40],
      rotation: [0, 90, 0],
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.yellow;

    glView1 = new core.View ({
      position: [100, 290],
      size: [200, 200],
      rotation: [90, 0, 0],
      transformOrigin: [0, 200]
    }).init ();
    this.add (glView1);
    glView1.style.backgroundColor = core.Color.red;

    glView2 = new core.View ({
      position: [80, 80],
      size: [40, 40],
      rotation: [0, 90, 0],
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.yellow;

    glView1 = new core.View ({
      position: [10, 150],
      size: [200, 200],
      rotation: [0, 90, 0]
    }).init ();
    this.add (glView1);
    glView1.style.backgroundColor = core.Color.red;

    glView2 = new core.View ({
      position: [80, 80],
      size: [40, 40],
      rotation: [0, -90, 0],
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.yellow;

    glView1 = new core.View ({
      position: [190, 150],
      size: [200, 200],
      rotation: [0, -90, 0],
      transformOrigin: [200, 0]
    }).init ();
    this.add (glView1);
    glView1.style.backgroundColor = core.Color.red;

    glView2 = new core.View ({
      position: [80, 80],
      size: [40, 40],
      rotation: [0, 90, 0],
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.yellow;
  }
});

function loadApplication () {
  new Test2 ({id:"test"}).init ();
  core.Application.start ();
}

loadApplication ();
});