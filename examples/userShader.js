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
    
    glImage = createImage1 ();
    glImage.rotation = [10, 20, 180];
    this.add (glImage);

    ry = 0;
    rz = 0;
    
    var vertices = glImage.__gl_user_vertices;

//    gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, glImage.__gl_vertices_buffer);
//    gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, vertices, gl_ctx.STATIC_DRAW); 

    slider3.bind ("continuous_change", this , function (event) {
      glImage.update_vectices (event.data);
    });
 
//     glImage2 = createImage2 ();
//     glImage2.rotation = [10, 210, 10];
//     this.add (glImage2);


//     slider3.bind ("continuous_change", this , function (event) {
//       glImage.update_vectices (event.data);
//     });
// 
  }
});

function createImage1 () {
  var glImage = new vs.gl.Image ({
    position: [100, 100],
    size: [500, 250],
    src: "demo.png",
    transformOrigin : [250, 125]
  }).init ();
  glImage.style.backgroundColor = vs.gl.Color.red;

  var
    obj_size = glImage._size,
    obj_pos = glImage._position,
    x = obj_pos[0],
    y = obj_pos[1],
    w = obj_size [0],
    h = obj_size [1];
    
  var resolution = 10;
  
  var image_vertex_shader="\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
attribute vec2 uv;\n\
varying vec2 vUV;\n\
varying highp vec3 vLighting;\n\
void main(void) { //pre-built function\n\
gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
// Apply lighting effect\n\
\n\
highp vec3 aVertexNormal = vec3(0,0,1);\n\
highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);\n\
highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);\n\
highp vec3 directionalVector = vec3(0.85, 0.8, 0.75);\n\
\n\
highp vec4 transformedNormal = vec4(aVertexNormal, 1.0);\n\
\n\
highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);\n\
vLighting = ambientLight + (directionalLightColor * directional);\n\
vUV=uv;\n\
}";

  var image_shader_fragment="\n\
precision lowp float;\n\
varying vec2 vUV;\n\
uniform sampler2D uMainTexture;\n\
uniform vec4 color;\n\
uniform float uAlpha;\n\
varying highp vec3 vLighting;\n\
void main(void) {\n\
vec4 mainTextureColor = texture2D(uMainTexture, vUV);\n\
gl_FragColor = vec4(mainTextureColor.rgb * vLighting, mainTextureColor.a);\n\
gl_FragColor.a *= uAlpha;\n\
}";
  
  glImage.__gl_user_vertices = makeMesh (resolution, x, y, w, h);
  glImage.__gl_user_triangle_faces = makeTriangles (resolution);
  glImage.__gl_user_texture_mapping = makeTextureProjection (resolution);
  
  var program = createProgram (image_vertex_shader, image_shader_fragment);
  glImage.__gl_user_program = program;
  program.setMatrixes (jsProjMatrix, jsViewMatrix);
  
  program.useIt ();

  var bb = {}, tt = {};
  bb.normalize = false;
  bb.type = gl_ctx.FLOAT;
  bb.stride = 0;
  bb.offset = 0;
  bb.buffer =  gl_ctx.createBuffer ();
  bb.numComponents = 2;

  var tt = {};
  tt.bindToUnit = function(unit) {
    gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, glImage.__gl_image_texture);
  };
  
  program.configureParameters = function (gl_view, style) {
    program.attrib.uv (bb);

    gl_ctx.bufferData (
      gl_ctx.ARRAY_BUFFER,
      gl_view.__gl_user_texture_mapping,
      gl_ctx.STATIC_DRAW
    );
      
    program.textures.uMainTexture (tt);
  }

  var vertices = glImage.__gl_user_vertices;
  var vertices_copy = new Float32Array (vertices);

  function update_vectices (pourcentage) {
    
    var scale = 3;
    var max_z = w / (resolution * 2) * scale;
    var new_z = max_z * pourcentage / 100;
    var new_w = w - ((w - 30) / max_z * new_z);
    var dx = (w - new_w) / resolution;
    var ox = dx * resolution / 2;
    
    var i = 0, xs, ys, x, y;

    for (xs = 0; xs < resolution + 1; xs++) {    
      if (xs %2 == 0) z = new_z;
      if (xs %2 == 1) z = -new_z;

      vertices[i] = vertices_copy [i++] - dx * xs + ox;
      vertices[i] = vertices_copy [i++];
      vertices[i++] = z;

      for (ys = 1; ys < resolution + 1; ys++) {
  
       vertices[i] = vertices_copy [i++] - dx * xs + ox;
       vertices[i] = vertices_copy [i++];
       vertices[i++] = z;
      }
    }

    this.__update_gl_vertices ();
    this.__binded = true;
  }
  
  glImage.update_vectices = update_vectices;
  glImage.__update_gl_vertices = function () {
    gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, this.__gl_vertices_buffer);
    gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, vertices, gl_ctx.STATIC_DRAW);
  };
    
  return glImage;
}

function createImage2 () {
  var glImage = new vs.gl.Image ({
    position: [500, 200],
    size: [500, 250],
    src: "demo.png",
    transformOrigin : [250, 125]
  }).init ();

  var
    obj_size = glImage._size,
    obj_pos = glImage._position,
    x = obj_pos[0],
    y = obj_pos[1],
    w = obj_size [0],
    h = obj_size [1];
    
  var resolution = 100;
  
  var image_vertex_shader="\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
uniform float posX;\n\
uniform float width;\n\
uniform float nb;\n\
attribute vec2 uv;\n\
varying vec2 vUV;\n\
const float PI = 3.1415;\n\
const float degToRad = PI / 180.0;\n\
void main(void) { //pre-built function\n\
float phi = degToRad * 90.0;\n\
vec3 pos = position;\n\
float x = (pos.x - posX) / width * nb;\n\
pos.z = 50.0 * cos(x * PI * 2.0 + phi);\n\
gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(pos, 1.);\n\
vUV=uv;\n\
}";

  var image_shader_fragment="\n\
precision lowp float;\n\
varying vec2 vUV;\n\
uniform sampler2D uMainTexture;\n\
uniform vec4 color;\n\
uniform float uAlpha;\n\
void main(void) {\n\
vec4 mainTextureColor = texture2D(uMainTexture, vUV);\n\
gl_FragColor = mainTextureColor;\n\
gl_FragColor.a *= uAlpha;\n\
}";
  
  glImage.__gl_user_vertices = makeMesh (resolution, x, y, w, h);
  glImage.__gl_user_triangle_faces = makeTriangles (resolution);
  glImage.__gl_user_texture_mapping = makeTextureProjection (resolution);
  
  var program = createProgram (image_vertex_shader, image_shader_fragment);
  glImage.__gl_user_program = program;
  program.setMatrixes (jsProjMatrix, jsViewMatrix);

  var bb = {}, tt = {};
  bb.normalize = false;
  bb.type = gl_ctx.FLOAT;
  bb.stride = 0;
  bb.offset = 0;
  bb.buffer = object_uv_buffer;
  bb.numComponents = 2;
  
  var tt = {};
  tt.bindToUnit = function(unit) {
    gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, glImage.__gl_image_texture);
  };
  
  program.configureParameters = function (gl_view, style) {
    program.attrib.uv (bb);
    program.textures.uMainTexture (tt);
    program.uniform.posX (gl_view.position [0]);
    program.uniform.width (gl_view.size [0]);
    program.uniform.nb (5.5);
  }
  
  return glImage;
}

function loadApplication () {
  new Test ({id:"test", layout:vs.ui.View.ABSOLUTE_LAYOUT}).init ();
  vs.gl.Application.start ();
}
