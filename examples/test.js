require.config ({ baseUrl: "../lib" });

var fovy = 2.8
var zD = -43

var x1 = 0.5
var y1 = -0.5

var x2 = -0.5
var y2 = 1

var x1 = 1//0//0.5
var y1 = 1//2//-0.7

var x2 = 1//1.8
var y2 =1//2.2

window.GL_INIT_MANUAL = true;

require (['core', 'class'], function (core, klass) {

window.gl_init (
  document.body,
  400,
  500
);

window.core = core;
var Test2 = klass.createClass ({


  /** parent class */
  parent: core.Application,
  
  

  initComponent : function () {
    this._super ();
    
    this.udpateMatrix ();
    this.setUpControls ();
    this.setUsetUpWorld ();
    
  },
    
  setUsetUpWorld : function () {

//     var glView1 = new core.Image ({
//       position: [100, 10, -40],
//       size: [200, 200],
//  //     rotation: [-60, 0, 0],
//       src: "picture2.png"
//     }).init ();
//     this.add (glView1);
//     glView1.style.backgroundColor = core.Color.red;

    var glView1 = new core.Image ({
      position: [100, 10, 0],
      size: [200, 200],
      rotation: [-60, 0, 0],
      src: "picture2.png"
    }).init ();
    this.add (glView1);
    glView1.style.backgroundColor = core.Color.red;

//return
    var glView2 = new core.View ({
      position: [80, 80],
      size: [40, 40],
      rotation: [0, 60, 0],
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.yellow;

    glView1 = new core.Image ({
      position: [100, 290],
      size: [200, 200],
      rotation: [60, 0, 0],
      transformOrigin: [0, 200],
      src: "picture2.png"
    }).init ();
    this.add (glView1);
    glView1.style.backgroundColor = core.Color.red;

    glView2 = new core.View ({
      position: [80, 80],
      size: [40, 40],
      rotation: [0, 60, 0],
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.yellow;

    glView1 = new core.Image ({
      position: [10, 150],
      size: [200, 200],
      rotation: [0, 60, 0],
      src: "picture2.png"
    }).init ();
    this.add (glView1);
    glView1.style.backgroundColor = core.Color.red;

    glView2 = new core.View ({
      position: [80, 80],
      size: [40, 40],
      rotation: [0, -60, 0],
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.yellow;

    glView1 = new core.Image ({
      position: [190, 150],
      size: [200, 200],
      rotation: [0, -60, 0],
      transformOrigin: [200, 0],
      src: "picture2.png"
    }).init ();
    this.add (glView1);
    glView1.style.backgroundColor = core.Color.red;

    glView2 = new core.View ({
      position: [80, 80],
      size: [40, 40],
      rotation: [0, 60, 0],
    }).init ();
    glView1.add (glView2);
    glView2.style.backgroundColor = core.Color.yellow;
  },
  
  setUpControls : function () {
    loadProfiling ();

    var self = this;
    var range1 = document.getElementById ("range1");
    var range2 = document.getElementById ("range2");
    var range3 = document.getElementById ("range3");
    var range4 = document.getElementById ("range4");
    range1.oninput = range2.oninput =
    range3.oninput = range4.oninput = function (e) {
      toto2 (range1.value, range2.value, range3.value, range4.value);
    }
    
return
    var range1 = document.getElementById ("range1");
    range1.oninput = function (e) {
      fovy = range1.value;
      self.udpateMatrix ();
    }
    
    var range2 = document.getElementById ("range2");
    range2.oninput = function (e) {
      zD = range2.value;
      self.udpateMatrix ();
    }
    
    var range3 = document.getElementById ("range3");
    range3.oninput = function (e) {
      x1 = range3.value;
      self.udpateMatrix ();
    }
    
    var range4 = document.getElementById ("range4");
    range4.oninput = function (e) {
      x2 = range4.value;
      self.udpateMatrix ();
    }
    
    var range5 = document.getElementById ("range5");
    range5.oninput = function (e) {
      y1 = range5.value;
      self.udpateMatrix ();
    }
    
    var range6 = document.getElementById ("range6");
    range6.oninput = function (e) {
      y2 = range6.value;
      self.udpateMatrix ();
    }
    
  },
  
  udpateMatrix: function () {


  core.math.mat4.identity (core.jsProjMatrix)
  core.math.mat4.perspective (.191 ,1, -10, 10, core.jsProjMatrix);  
  core.math.mat4.scale (
    core.jsProjMatrix, 
    [2/ core.frame_size[0], -2/ core.frame_size[1], 1]
  );

  // Draw View matrix
  core.math.mat4.identity (core.jsViewMatrix)  
  core.math.mat4.translate (core.jsViewMatrix, [0, -core.frame_size[1],-600]);
  
  this.updateProgramsMatrix ()
  
  return
  console.log (fovy, zD, x1, y1, x2, y2);

    //View//
    core.math.mat4.identity (core.jsViewMatrix)

    core.math.mat4.lookAt ([x1,y1,50], [x2,y2,zD], [0,-1,0], core.jsViewMatrix)    
    //core.math.mat4.translate (core.jsViewMatrix, [0, 2, zD]);
    
    core.math.mat4.scale (
      core.jsViewMatrix,
      [2/ core.frame_size[0], -2/ core.frame_size[1],
      1/10]);

    //Projection//
    core.math.mat4.identity (core.jsProjMatrix)  
    core.math.mat4.perspective (fovy ,1, -1, 10, core.jsProjMatrix);
    
    this.updateProgramsMatrix ()
  },

  updateProgramsMatrix: function () {
    updateProgramsMatrix ();
  }
});


function loadApplication () {
  new Test2 ({id:"test"}).init ();
  core.Application.start ();
}

loadApplication ();
});


function  updateProgramsMatrix () {
  core.drawShaderProgram.setMatrixes (core.jsProjMatrix, core.jsViewMatrix);
  core.View.__should_render = true;
}

function toto (a) {
  core.math.mat4.identity (core.jsViewMatrix)  
  core.math.mat4.translate (core.jsViewMatrix, [0,a,-600]);
  
  updateProgramsMatrix ()
}

function toto2 (a, b, c, d) {
  console.log (a, b, c, d)
  
  core.math.mat4.identity (core.jsViewMatrix)  
  core.math.mat4.lookAt ([a,b,600], [c,d,0], [0,1,0], core.jsViewMatrix)

  
  updateProgramsMatrix ()
}



function toto3 () {

  core.math.mat4.identity (core.jsViewMatrix)  
  core.math.mat4.lookAt (
    [0,core.frame_size[1]/2,600],
    [0,core.frame_size[1]/2,0],
    [0,1,0],
    core.jsViewMatrix
  )
//  console.log (core.jsViewMatrix);
  
  updateProgramsMatrix ()
}

function toto4 () {

  core.math.mat4.identity (core.jsViewMatrix)  
  core.math.mat4.lookAt (
    [core.frame_size[0]/2,core.frame_size[1]/2,600],
    [core.frame_size[0]/2,core.frame_size[1]/2,0],
    [0,1,0],
    core.jsViewMatrix
  )
//  console.log (core.jsViewMatrix);
  
  core.math.mat4.perspective (.191 ,1, -10, 10, core.jsProjMatrix);  
  core.math.mat4.scale (
    core.jsProjMatrix, 
    [2/ core.frame_size[0], -2/ core.frame_size[1], 1]
  );
  core.math.mat4.translate (core.jsProjMatrix, [core.frame_size[0]/2, -core.frame_size[1]/2, 0])
  updateProgramsMatrix ()
}

