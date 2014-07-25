require.config ({ baseUrl: "../lib" });

require (['core', 'class'], function (core, klass) {

var Test = klass.createClass ({

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

function loadApplication () {
  new Test ({id:"test"}).init ();
  core.Application.start ();
}

loadApplication ();
});