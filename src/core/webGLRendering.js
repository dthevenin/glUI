
vs.log = console.log.bind (console);
vs.error = console.error.bind (console);

(function(){
  // prepare base perf object
  if (typeof window.performance === 'undefined') {
    window.performance = {};
  }
  
  if (!window.performance.now) {
    var nowOffset = Date.now ();
 
    if (performance.timing && performance.timing.navigationStart) {
      nowOffset = performance.timing.navigationStart
    }

    window.performance.now = function now () {
      return Date.now() - nowOffset;
    }
  }
})();

var
  basicShaderProgram,
  imageShaderProgram,
  oneTextureShaderProgram,
  twoTexturesShaderProgram,
  gl_ctx,
  object_uv_buffer,
  object_bck_image_uv_buffer,
  default_object_bck_image_uv_buffer,
  object_faces_buffer,
  frame_size = [100, 100],
  gl_device_pixel_ratio,
  default_triangle_faces,
  default_texture_projection;

var get_shader = function (type, source, typeString) {
  // Create the shader object
  var shader = gl_ctx.createShader (type);
  if (shader == null) {
    vs.error ("couldn't create a shader")
    return null;
  }
  // Load the shader source
  gl_ctx.shaderSource (shader, source);
  // Compile the shader
  gl_ctx.compileShader (shader);
  // Check the compile status
  if (!gl_ctx.getShaderParameter(shader, gl_ctx.COMPILE_STATUS)) {
    var infoLog = this.gl_ctx.getShaderInfoLog (shader);
    vs.error ("Error compiling " + typeString + "shader:\n" + infoLog);
    gl_ctx.deleteShader (shader);
    return null;
  }

  return shader;
};

/**
 * Helper which convers GLSL names to JavaScript names.
 * @private
 */
function glslNameToJs_ (name) {
  return name.replace(/_(.)/g, function(_, p1) { return p1.toUpperCase(); });
}

function Program  () {
  this.__prog = gl_ctx.createProgram ();
}

function createSetters (program) {
  var __prog = program.__prog;

  // Look up attribs.
  var attribs = {};
  // Also make a plain table of the locs.
  var attribLocs = {};

  function createAttribSetter (info, index) {
    if (info.size != 1) {
      throw("arrays of attribs not handled");
    }
    return function (b) {
      gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, b.buffer);
      gl_ctx.enableVertexAttribArray (index);
      gl_ctx.vertexAttribPointer (
        index, b.numComponents, b.type, b.normalize, b.stride, b.offset
      );
    };
  }

  var numAttribs = gl_ctx.getProgramParameter (__prog, gl_ctx.ACTIVE_ATTRIBUTES);
  for (var ii = 0; ii < numAttribs; ++ii) {
    var info = gl_ctx.getActiveAttrib (__prog, ii);
    if (!info) {
      break;
    }
    var name = info.name;
    var index = gl_ctx.getAttribLocation (__prog, name);
    attribs [name] = createAttribSetter(info, index);
    attribLocs [name] = index
  }

  // Look up uniforms
  var numUniforms = gl_ctx.getProgramParameter (__prog, gl_ctx.ACTIVE_UNIFORMS);
  var uniforms = {
  };
  var textureUnit = 0;

  function createUniformSetter (info) {
    var loc = gl_ctx.getUniformLocation (__prog, info.name);
    var type = info.type; 

    if (type === gl_ctx.FLOAT)
      return function(v) { gl_ctx.uniform1f (loc, v); };
    if (type === gl_ctx.FLOAT_VEC2)
      return function(v) { gl_ctx.uniform2fv (loc, v); };
    if (type === gl_ctx.FLOAT_VEC3)
      return function(v) { gl_ctx.uniform3fv (loc, v); };
    if (type === gl_ctx.FLOAT_VEC4)
      return function(v) { gl_ctx.uniform4fv (loc, v); };
    if (type === gl_ctx.INT)
      return function(v) { gl_ctx.uniform1i (loc, v); };
    if (type === gl_ctx.INT_VEC2)
      return function(v) { gl_ctx.uniform2iv (loc, v); };
    if (type === gl_ctx.INT_VEC3)
      return function(v) { gl_ctx.uniform3iv (loc, v); };
    if (type === gl_ctx.INT_VEC4)
      return function(v) { gl_ctx.uniform4iv (loc, v); };
    if (type === gl_ctx.BOOL)
      return function(v) { gl_ctx.uniform1i (loc, v); };
    if (type === gl_ctx.BOOL_VEC2)
      return function(v) { gl_ctx.uniform2iv (loc, v); };
    if (type === gl_ctx.BOOL_VEC3)
      return function(v) { gl_ctx.uniform3iv (loc, v); };
    if (type === gl_ctx.BOOL_VEC4)
      return function(v) { gl_ctx.uniform4iv (loc, v); };
    if (type === gl_ctx.FLOAT_MAT2)
      return function(v) { gl_ctx.uniformMatrix2fv (loc, false, v); };
    if (type === gl_ctx.FLOAT_MAT3)
      return function(v) { gl_ctx.uniformMatrix3fv (loc, false, v); };
    if (type === gl_ctx.FLOAT_MAT4)
      return function(v) { gl_ctx.uniformMatrix4fv (loc, false, v); };
    if (type === gl_ctx.SAMPLER_2D || type === gl_ctx.SAMPLER_CUBE) {
      return function(unit) {
        return function(v, gl_view) {
//            gl_ctx.uniform1i (loc, unit);
          v.bindToUnit(unit, gl_view);
        };
      }(textureUnit++);
    }
    throw ("unknown type: 0x" + type.toString(16));
  }

  var textures = {};

  for (var ii = 0; ii < numUniforms; ++ii) {
    var info = gl_ctx.getActiveUniform (__prog, ii);
    if (!info) {
      break;
    }
    name = info.name;
    var setter = createUniformSetter(info);
    uniforms [name] = setter;
    if (info.type === gl_ctx.SAMPLER_2D || info.type === gl_ctx.SAMPLER_CUBE) {
      textures [name] = setter;
    }
  }

  program.textures = textures;
  program.attrib = attribs;
  program.attribLoc = attribLocs;
  program.uniform = uniforms;
}

Program.prototype.useIt = function (pMatrix, vMatrix, mMatrix) {
  gl_ctx.useProgram (this.__prog);
}

Program.prototype.setMatrixes = function (projMatrix, viewMatrix) {
  this.useIt ();
  this.uniform.Pmatrix (projMatrix);
  this.uniform.Vmatrix (viewMatrix);
}

Program.prototype.configureParameters = function (gl_view, style) {}

function createProgram (vertex_txt, fragment_txt) {
  var program = new Program ();

  var shader_vertex = get_shader (gl_ctx.VERTEX_SHADER, vertex_txt, "VERTEX");
  if (!shader_vertex) {
    vs.log ("couldn't load shader")
  }
  gl_ctx.attachShader (program.__prog, shader_vertex);
  gl_ctx.deleteShader (shader_vertex);

  var shader_fragment = get_shader (gl_ctx.FRAGMENT_SHADER, fragment_txt, "FRAGMENT");
  if (!shader_fragment) {
    vs.log("couldn't load shader")
  }
  gl_ctx.attachShader (program.__prog, shader_fragment);
  gl_ctx.deleteShader (shader_fragment);

  gl_ctx.linkProgram (program.__prog);
  gl_ctx.useProgram (program.__prog);

  // Check the link status
  var linked = gl_ctx.getProgramParameter (program.__prog, gl_ctx.LINK_STATUS);
  if (!linked && !gl_ctx.isContextLost ()) {
    var infoLog = gl_ctx.getProgramInfoLog (program.__prog);
    vs.error ("Error linking program:\n" + infoLog);
    gl_ctx.deleteProgram (program.__prog);
    program.__prog = null;
    return;
  }
  
  createSetters (program);
  
  return program;
}


function createCanvas (width, height) {

  var canvas = document.createElement ('canvas');
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  canvas.width = width * gl_device_pixel_ratio;
  canvas.height = height* gl_device_pixel_ratio;

  if (
    deviceConfiguration.browser !== vs.core.DeviceConfiguration.BROWSER_FIREFOX
    && gl_device_pixel_ratio !== 1) {
  
    var modes = ["crisp-edges", "-moz-crisp-edges", "-webkit-optimize-contrast"];
  
    if (canvas.style.imageRendering !== undefined) {
      for (var i = 0; i < modes.length; i++) {
        canvas.style.imageRendering = modes [i];
        if (canvas.style.imageRendering == modes [i]) {
          break;
        }
      }
    }

    else if (canvas.style["-ms-interpolation-mode"] !== undefined) {
      canvas.style["-ms-interpolation-mode"] = "nearest-neighbor";
    }
  }
  
  return canvas;
}

function create2DCanvas (width, height) {

  var
    canvas = createCanvas (width, height),
    ctx = canvas.getContext ('2d');

  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;  

  return canvas;
}

// initPrograms
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initPrograms () {

  var basic_vertex_shader="\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
void main(void) { //pre-built function\n\
  gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
}";

  var basic_shader_fragment="\n\
precision lowp float;\n\
uniform vec4 color;\n\
uniform float uAlpha;\n\
void main(void) {\n\
  gl_FragColor = vec4(color.rgb, color.a * uAlpha);\n\
}";

  var image_vertex_shader="\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
attribute vec2 uv;\n\
varying vec2 vUV;\n\
void main(void) { //pre-built function\n\
  gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
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

  var one_texture_vertex_shader="\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
attribute vec2 bkImageUV;\n\
varying vec2 vBkImageUV;\n\
void main(void) { //pre-built function\n\
  gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
  vBkImageUV=bkImageUV;\n\
}";

  var one_texture_shader_fragment="\n\
precision lowp float;\n\
varying vec2 vBkImageUV;\n\
uniform sampler2D uMainTexture;\n\
uniform vec4 color;\n\
uniform float uAlpha;\n\
void main(void) {\n\
  if (vBkImageUV[0]<0.0 || vBkImageUV[1]<0.0 || vBkImageUV[0]>1.0 || vBkImageUV[1]>1.0) {\n\
    gl_FragColor = color;\n\
  } else {\n\
    vec4 mainTextureColor = texture2D(uMainTexture, vBkImageUV);\n\
    gl_FragColor = mix(color, mainTextureColor, mainTextureColor.a);\n\
    gl_FragColor.a = max(color.a, mainTextureColor.a);\n\
  }\n\
  gl_FragColor.a *= uAlpha;\n\
}";

  var two_textures_vertex_shader="\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
attribute vec2 uv;\n\
attribute vec2 bkImageUV;\n\
varying vec2 vUV;\n\
varying vec2 vBkImageUV;\n\
void main(void) { //pre-built function\n\
  gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
  vUV=uv;\n\
  vBkImageUV=bkImageUV;\n\
}";

  var two_textures_shader_fragment="\n\
precision lowp float;\n\
varying vec2 vUV;\n\
varying vec2 vBkImageUV;\n\
uniform sampler2D uBckTexture;\n\
uniform sampler2D uMainTexture;\n\
uniform float uTextureFlag;\n\
uniform vec4 color;\n\
uniform float uAlpha;\n\
void main(void) {\n\
  vec4 mainTextureColor = texture2D(uMainTexture, vUV);\n\
  vec4 tmpColor;\n\
  if (vBkImageUV[0]<0.0 || vBkImageUV[1]<0.0 || vBkImageUV[0]>1.0 || vBkImageUV[1]>1.0) {\n\
    tmpColor = color;\n\
  } else {\n\
    vec4 bckTextureColor = texture2D(uBckTexture, vBkImageUV);\n\
    tmpColor = mix(color, bckTextureColor, bckTextureColor.a);\n\
    tmpColor.a = max(color.a, bckTextureColor.a);\n\
  }\n\
  gl_FragColor = mix(tmpColor, mainTextureColor, mainTextureColor.a);\n\
  gl_FragColor.a = max(tmpColor.a, mainTextureColor.a) * uAlpha;\n\
}";
  
  basicShaderProgram = createProgram (basic_vertex_shader, basic_shader_fragment);
  imageShaderProgram = createProgram (image_vertex_shader, image_shader_fragment);
  oneTextureShaderProgram = createProgram (one_texture_vertex_shader, one_texture_shader_fragment);
  twoTexturesShaderProgram = createProgram (two_textures_vertex_shader, two_textures_shader_fragment);
}

function initMainMatrix () {
  jsProjMatrix = mat4.create ();
  mat4.identity (jsProjMatrix)
  
  mat4.perspective (.191 ,1, -1, 10, jsProjMatrix);  
  
  jsViewMatrix = mat4.create ();
  mat4.identity (jsViewMatrix)
  mat4.translate (jsViewMatrix, [-1,1,-600]);
  mat4.scale (jsViewMatrix, [2/ frame_size[0], -2/ frame_size[1], 1]);
}

function updateProgramsMatrix () {
  imageShaderProgram.setMatrixes (jsProjMatrix, jsViewMatrix);
  twoTexturesShaderProgram.setMatrixes (jsProjMatrix, jsViewMatrix);
  oneTextureShaderProgram.setMatrixes (jsProjMatrix, jsViewMatrix);
  basicShaderProgram.setMatrixes (jsProjMatrix, jsViewMatrix);
}

function initBuffers () {

  default_texture_projection = new Float32Array ([0,0, 0,1, 1,0, 1,1]);

  /*========================= UV =========================*/
  object_uv_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, object_uv_buffer);
  
  gl_ctx.bufferData (
    gl_ctx.ARRAY_BUFFER,
    default_texture_projection,
    gl_ctx.STATIC_DRAW
  );

  object_bck_image_uv_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, object_bck_image_uv_buffer);

  gl_ctx.bufferData (
    gl_ctx.ARRAY_BUFFER,
    default_texture_projection,
    gl_ctx.STATIC_DRAW
  );
    
  default_object_bck_image_uv_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, default_object_bck_image_uv_buffer);
  gl_ctx.bufferData (
    gl_ctx.ARRAY_BUFFER,
    default_texture_projection,
    gl_ctx.STATIC_DRAW
  );

  /*========================= FACES ========================= */
  object_faces_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer(gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer);

  default_triangle_faces = new Uint16Array ([0,1,2,3]);
  gl_ctx.bindBuffer (gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer);
  gl_ctx.bufferData (
    gl_ctx.ELEMENT_ARRAY_BUFFER,
    default_triangle_faces,
    gl_ctx.STATIC_DRAW);
}

var __unique_gl_id = 1;
var GL_VIEWS = [];

function createGLObject (gl_view) {

  var id = __unique_gl_id ++;
  gl_view.__gl_id = id ;
  GL_VIEWS [id] = this;

  new glObject (gl_view.__gl_id);
}

function deleteGLObject (gl_view) {

  var gl_object = GL_OBJECTS [gl_view.__gl_id];
  
  if (gl_object.texture) {
    gl_ctx.deleteTexture (gl_object.texture);
    gl_object.texture = null;
  }
}

function clean_image_texture (gl_view) {
  var gl_object = GL_OBJECTS [gl_view.__gl_id];
  
  if (gl_object.image_texture) {
    gl_object.image_texture = null;
  }
}

function set_image_texture (gl_view, texture) {
  var gl_object = GL_OBJECTS [gl_view.__gl_id];
  
  gl_object.image_texture = texture;
}


function update_texture (gl_view, image) {
  var gl_object = GL_OBJECTS [gl_view.__gl_id];
  
  gl_object.texture = __copy_image_into_webgl_texture (image, gl_object.texture);
}

var GL_CANVAS, stats;
var init_functions = [];

function glAddInitFunction (func) {
  init_functions.push (func);
}

function initWebGLRendering () {

  if (gl_ctx) return;
  
  if (window.ACTIVATE_STATS) {
    vs.util.importFile ("../../src/Stats.js", null, function () {
      stats = Stats ();
      document.body.appendChild (stats.domElement);
      stats.setMode (1);
    
    }, "js");
  }
  
  frame_size = [window.innerWidth, window.innerHeight];
  gl_device_pixel_ratio = window.devicePixelRatio || 1;
  
  if (deviceConfiguration.browser === vs.core.DeviceConfiguration.BROWSER_FIREFOX) {
    gl_device_pixel_ratio = 1;
  }
  
  console.log (gl_device_pixel_ratio);

  var canvas = GL_CANVAS = createCanvas (frame_size [0], frame_size [1]);
  document.body.appendChild (canvas);
  
  /*================= Creates a webgl context ================= */
  var webgl_options = {
    antialias: true,
    premultipliedAlpha: false,
    alpha: false
  };
  
  var webgl_names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  for (var i = 0; i < webgl_names.length; ++i) {
    try {
      gl_ctx = canvas.getContext (webgl_names[i], webgl_options);
    } catch (e) {}
    if (gl_ctx) {
      break;
    }
  }

  if (!gl_ctx) {
    alert ("You are not webgl compatible :(") ;
    throw ("You are not webgl compatible :(") ;
    return;
  }
  
  /*========================= SHADERS ========================= */
  initPrograms ();
  initMainMatrix ();
  initBuffers ();
  initPickBuffer ();

  /*========================= DRAWING ========================= */
  gl_ctx.disable (gl_ctx.DEPTH_TEST);

  gl_ctx.enable (gl_ctx.BLEND);
  gl_ctx.blendFunc (gl_ctx.SRC_ALPHA, gl_ctx.ONE_MINUS_SRC_ALPHA);

  gl_ctx.clearDepth (1.0);
  gl_ctx.clearColor (0, 0, 0, 1);
  gl_ctx.colorMask (true, true, true, false);
  
  init_functions.forEach (function (func) { func (); });

  vs.requestAnimationFrame (render);
}

function update_gl_vertices (gl_view) {
  var
    gl_object = GL_OBJECTS [gl_view.__gl_id],
    obj_size = gl_view._size,
    obj_pos = gl_view._position,
    x = obj_pos[0],
    y = obj_pos[1],
    w = obj_size [0],
    h = obj_size [1],
    m = gl_object.vertices;
        
  // setup position vertices
  m[0] = x; m[1] = y; m[2] = 0;
  m[3] = x; m[4] = y + h; m[5] = 0;
  m[6] = x + w; m[7] = y; m[8] = 0;
  m[9] = x + w; m[10] = y + h; m[11] = 0;
  
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, gl_object.vertices_buffer);
  gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, m, gl_ctx.STATIC_DRAW);
  
  gl_view.__should_update_gl_vertices = false;
};

var angle2rad = Math.PI / 180;

/**
 * @protected
 * @function
 */
function update_transform_gl_matrix (gl_view)
{
  var
    gl_object = GL_OBJECTS [gl_view.__gl_id],
    matrix = gl_object.matrix,
    pos = gl_view._position,
    tx = gl_view._transform_origin [0] + pos [0],
    ty = gl_view._transform_origin [1] + pos [1],
    rot = gl_view._rotation,
    trans = gl_view._translation;
    
  // apply current transformation
  mat4.identity (matrix);
  mat4.translateXYZ (matrix, tx + trans[0], ty + trans[1], trans[2]);

  if (rot[0]) mat4.rotateX (matrix, rot[0] * angle2rad);
  if (rot[1]) mat4.rotateY (matrix, rot[1] * angle2rad);
  if (rot[2]) mat4.rotateZ (matrix, rot[2] * angle2rad);
  
  mat4.scaleXY (matrix, gl_view._scaling);
  mat4.translateXYZ (matrix, -tx, -ty, 0);

  /*====================================================== */
  // Update vertices vectors for the culling algorithm
  update_envelop_vertices (gl_view);

  gl_view.__invalid_matrixes = true;
  GLView.__should_render = true;
  
  gl_view.__should_update_gl_matrix = false;
}

/**
 * Update vertices vectors for the culling algorithm
 * @protected
 * @function
 */
function update_envelop_vertices (gl_view)
{
  var
    gl_object = GL_OBJECTS [gl_view.__gl_id],
    matrix = gl_object.matrix,
    obj_size = gl_view._size,
    obj_pos = gl_view._position,
    x = obj_pos[0],
    y = obj_pos[1],
    w = obj_size [0],
    h = obj_size [1];

  vec3.set_p (x    , y    , 0, gl_object.vertex_1);
  vec3.set_p (x    , y + h, 0, gl_object.vertex_2);
  vec3.set_p (x + w, y    , 0, gl_object.vertex_3);
  vec3.set_p (x + w, y + h, 0, gl_object.vertex_4);
  
  mat4.multiplyVec3 (matrix, gl_object.vertex_1);
  mat4.multiplyVec3 (matrix, gl_object.vertex_2);
  mat4.multiplyVec3 (matrix, gl_object.vertex_3);
  mat4.multiplyVec3 (matrix, gl_object.vertex_4);
} 

var rendering = true;
var next_rendering_id = 0;
var gl_stack_length = 0;
var gl_stack_for_renter = [1024];

function render () {

  var v1, v2, v3, v4, v_temp = vec3.create ();

  for (var i = 0; i < 1024; i ++) {
    gl_stack_for_renter [i] = new Array (3);
    // [0] - rendering type
    // [1] - view to render
    // [2] - alpha
  }
  
  var boundaries_stack = [256];
  for (var i = 0; i < 256; i ++) {
    boundaries_stack [i] = new glMatrixArrayType (4);
  }

  // Configure view and projection matrix of programes
  updateProgramsMatrix ();
  
  function calculateViewsInFrustum (now) {
    var apps = vs.Application_applications, key;
    gl_stack_length = 0;
    gl_views_index = 0;

    function _calculateViewsInFrustum (gl_view, p_transform, new_p_matrix, p_alpha, level) {
      var key, i, l, child, children, style, alpha;
      
      // Views visibility
      if (!gl_view._visible && !gl_view.__is_hidding) {
        return;
      }
      
      // animate view
      gl_view.__gl_update_animation (now);

      // Views opacity
      style = gl_view._style;
      if (style) alpha = p_alpha * style._opacity;
      else alpha = p_alpha;

      if (alpha === 0) {
        return;
      }

      var boundaries = boundaries_stack [level];
      /*================= Update view matrixes ================= */
      if (gl_view.__should_update_gl_matrix) {
        update_transform_gl_matrix (gl_view);
      }
      var gl_object = GL_OBJECTS [gl_view.__gl_id];
      var o_matrix = gl_object.matrix;
      var m_matrix = gl_object.m_matrix;
      var p_matrix = gl_object.p_matrix;
      var scroll_vec = gl_view.__gl_scroll;
      var p_size_vec = gl_view._size;
            
      if (new_p_matrix || gl_view.__invalid_matrixes) {
        if (p_transform) {
          mat4.multiply (p_transform, o_matrix, m_matrix);
        }
        else {
          mat4.set (o_matrix, m_matrix);
        }
      }

      if (new_p_matrix || gl_view.__invalid_matrixes || gl_view.__is_scrolling) {
        mat4.translate (m_matrix, gl_view._position, p_matrix);
      
        if (scroll_vec) {
          gl_view.__gl_update_scroll (now);
          mat4.translate (p_matrix, scroll_vec);
        }
        new_p_matrix = true;
      }
      gl_view.__invalid_matrixes = false;

      /*================= Culling allgorithm ================= */
      // Update matrixes

      v1 = gl_object.vertex_1; v2 = gl_object.vertex_2; 
      v3 = gl_object.vertex_3; v4 = gl_object.vertex_4; 

      if ((v1[0]>boundaries[2] && v2[0]>boundaries[2] &&
           v3[0]>boundaries[2] && v4[0]>boundaries[2]) ||
          (v1[0]<boundaries[0] && v2[0]<boundaries[0] &&
           v3[0]<boundaries[0] && v4[0]<boundaries[0]) ||
          (v1[1]>boundaries[3] && v2[1]>boundaries[3] &&
           v3[1]>boundaries[3] && v4[1]>boundaries[3]) || 
          (v1[1]<boundaries[1] && v2[1]<boundaries[1] &&
           v3[1]<boundaries[1] && v4[1]<boundaries[1])) { 
        return;
      }

      // Set the new boundaries for the children
      boundaries = boundaries_stack [level+1];
      if (scroll_vec) {
        vec3.subtract ([0,0,0], scroll_vec, v_temp);
        boundaries[0] = v_temp[0];
        boundaries[1] = v_temp[1];
        
        vec3.subtract ([p_size_vec [0], p_size_vec [1], 0], scroll_vec, v_temp);       
        boundaries[2] = v_temp [0];
        boundaries[3] = v_temp [1];
      }
      else 
      {
        boundaries[0] = 0;
        boundaries[1] = 0;
        boundaries[2] = p_size_vec [0];
        boundaries[3] = p_size_vec [1];
      }

      var entry = gl_stack_for_renter [gl_views_index++];
      entry [0] = 1; // normal view to render
      entry [1] = gl_view;
      entry [2] = alpha;
      
      // End culling algorithm

      // manage children
      children = gl_view.__children;
      l = children.length;
      for (i = 0; i < l; i++) {
        child = children [i];
        if (child.__gl_id) {
          _calculateViewsInFrustum (child, p_matrix, new_p_matrix, alpha, level + 1);
        }
      }
    }

    var boundaries = boundaries_stack [0];
    boundaries [0] = 0;
    boundaries [1] = 0;
    boundaries [2] = frame_size[0];
    boundaries [3] = frame_size[1];
  
    for (key in apps) {
      var app = apps[key];
      _calculateViewsInFrustum (app, null, false, 1, 0);
    }
    
    gl_stack_length = gl_views_index;
  }

  var color_id_array = new Float32Array ([0,0,0,0])
    
  function calculateColorsFromGLID (gl_id) {
    var r = 0, g = 0, b = 0, a = 1;
    
    r = (gl_id % 256) / 255;
    gl_id = (gl_id / 255) | 0;
    g = (gl_id % 256) / 255;
    gl_id = (gl_id / 255) | 0;
    b = (gl_id % 256) / 255;
 
    color_id_array [0] = r;
    color_id_array [1] = g;
    color_id_array [2] = b;
    color_id_array [3] = a;
  }
  
  var default_faces_activated = false;
  var previous_program = null;
  var attribute = {}, texture1 = {}, texture2 = {};
  
  function bindToUnitTEXTURE0_1 (gl_object) {
    gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, gl_object.texture);
  };
  
  function bindToUnitTEXTURE0_2 (unit, gl_object) {
    gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, gl_object.image_texture);
  };
  
  function bindToUnitTEXTURE0_3 (unit, style) {
    gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, style.__gl_texture_bck_image);
  };
  
  function renderOneView (gl_view, alpha, mode) {

    var program;
    var gl_object = GL_OBJECTS [gl_view.__gl_id];
       
    if (mode === 1) {

      program = basicShaderProgram;
      if (previous_program !== basicShaderProgram) {
        program.useIt ();
      }

      // calculate the color ID
      calculateColorsFromGLID (gl_view.__gl_id);

      program.uniform.color (color_id_array);
      alpha = 1;
    }
    else {
      var style = gl_view.style, c_buffer;
      if (!style) {
        style = _default_style;
      }

      if (style && style._background_color) {
        c_buffer = style._background_color.__gl_array;
      }
      else {
        c_buffer = GLColor.default.__gl_array;
      }
    
      if (gl_view.__gl_user_program) {
        program = gl_view.__gl_user_program;
        program.useIt ();
        
        if (program.configureParameters) {
          program.configureParameters (gl_view, style);
        }
      }
      else if (gl_object.image_texture) {
        program = imageShaderProgram;
        if (previous_program !== imageShaderProgram) {
          program.useIt ();
        
          attribute.normalize = false;
          attribute.type = gl_ctx.FLOAT;
          attribute.stride = 0;
          attribute.offset = 0;

          attribute.buffer = object_uv_buffer;
          attribute.numComponents = 2;
          program.attrib.uv (attribute);
        }
            
        texture1.bindToUnit = bindToUnitTEXTURE0_2;
        program.textures.uMainTexture (texture1, gl_object);
      }
      else if (gl_object.texture && style.__gl_texture_bck_image) {
        program = twoTexturesShaderProgram;
        if (previous_program !== twoTexturesShaderProgram) {
          program.useIt ();
        
          attribute.normalize = false;
          attribute.type = gl_ctx.FLOAT;
          attribute.stride = 0;
          attribute.offset = 0;

          attribute.buffer = object_uv_buffer;
          attribute.numComponents = 2;
          program.attrib.uv (attribute);
        }

        texture1.bindToUnit = bindToUnitTEXTURE0_1;
        program.textures.uMainTexture (texture1, gl_object);
      
        attribute.buffer = object_bck_image_uv_buffer;
        attribute.numComponents = 2;
        program.attrib.bkImageUV (attribute);
        gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, style._background_image_uv, gl_ctx.STATIC_DRAW);

        texture2.bindToUnit = bindToUnitTEXTURE0_3;
        program.textures.uBckTexture (texture2, style);

        program.uniform.color (c_buffer);
      }
      else if (gl_object.texture) {
        program = oneTextureShaderProgram;
        if (previous_program !== oneTextureShaderProgram) {
          program.useIt ();
        }

        attribute.normalize = false;
        attribute.type = gl_ctx.FLOAT;
        attribute.stride = 0;
        attribute.offset = 0;

        attribute.buffer = default_object_bck_image_uv_buffer;
        attribute.numComponents = 2;
        program.attrib.bkImageUV (attribute);

        program.uniform.color (c_buffer);

        texture1.bindToUnit = bindToUnitTEXTURE0_1;
        program.textures.uMainTexture (texture1, gl_object);
      }
      else if (style.__gl_texture_bck_image) {
        program = oneTextureShaderProgram;
        if (previous_program !== oneTextureShaderProgram) {
          program.useIt ();
        }

        attribute.normalize = false;
        attribute.type = gl_ctx.FLOAT;
        attribute.stride = 0;
        attribute.offset = 0;

        attribute.buffer = object_bck_image_uv_buffer;
        attribute.numComponents = 2;
        program.attrib.bkImageUV (attribute);
        gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, style._background_image_uv, gl_ctx.STATIC_DRAW);

        program.uniform.color (c_buffer);

        texture1.bindToUnit = bindToUnitTEXTURE0_3;
        program.textures.uMainTexture (texture1, style);
      }
      else
      {
        program = basicShaderProgram;
        if (previous_program !== basicShaderProgram) {
          program.useIt ();
        }

        program.uniform.color (c_buffer);
      }
    }

    program.uniform.Mmatrix (gl_object.m_matrix);
    program.uniform.uAlpha (alpha);

    attribute.normalize = false;
    attribute.type = gl_ctx.FLOAT;
    attribute.stride = 0;
    attribute.offset = 0;

    if (gl_view.__should_update_gl_vertices) {
      if (gl_view.__update_gl_vertices) gl_view.__update_gl_vertices ();
      else update_gl_vertices (gl_view);
    }
    attribute.buffer = gl_object.vertices_buffer;
    attribute.numComponents = 3;
    program.attrib.position (attribute);
    
    if (gl_view.__gl_user_vertices) {

      gl_ctx.bindBuffer (gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer);
      gl_ctx.bufferData (
        gl_ctx.ELEMENT_ARRAY_BUFFER,
        gl_view.__gl_user_triangle_faces,
        gl_ctx.STATIC_DRAW
      );
      
      default_faces_activated = false;
      
      var nb_faces = gl_view.__gl_user_triangle_faces.length;
      gl_ctx.drawElements (gl_ctx.TRIANGLES, nb_faces, gl_ctx.UNSIGNED_SHORT, 0);

    }
    else {
    
      if (!default_faces_activated) {
        // set default faces
        gl_ctx.bindBuffer (gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer);
        gl_ctx.bufferData (
          gl_ctx.ELEMENT_ARRAY_BUFFER,
          default_triangle_faces,
          gl_ctx.STATIC_DRAW);
      
        default_faces_activated = true;
      }
     
      gl_ctx.drawElements (gl_ctx.TRIANGLE_STRIP, 4, gl_ctx.UNSIGNED_SHORT, 0);
    }
    
    previous_program = program;
  }

  var animate = window.render_ui = function (now, mode) {
    if (!rendering) {
      next_rendering_id = vs.requestAnimationFrame (animate);
      return
    }

    if (mode !== 1 && (!GLView.__should_render && !GLView.__nb_animation)) {
      next_rendering_id = vs.requestAnimationFrame (animate);
      return
    }

    if (stats) stats.begin ();
    
    if (mode === 1 && next_rendering_id) {
      cancelAnimationFrame (next_rendering_id);
    }

    calculateViewsInFrustum (now);
    GLView.__should_render = false;
    
//    console.log (gl_stack_length);
      
    if (gl_stack_length) {
    
      gl_ctx.viewport (
        0.0, 0.0,
        frame_size[0] * gl_device_pixel_ratio,
        frame_size[1] * gl_device_pixel_ratio
      );
    
      gl_ctx.clear (gl_ctx.COLOR_BUFFER_BIT);

      for (var i = 0; i < gl_stack_length; i++) {
        var entry = gl_stack_for_renter [i];
        if (entry[0] === 1) {
          // normal rendering
          renderOneView (entry[1], entry[2], mode);
        }
      }

      gl_ctx.flush();
    }
    next_rendering_id = vs.requestAnimationFrame (animate);
//    if (mode !== 1) vs.scheduleAction(animate, 300);

    if (stats) stats.end ();
  }
  
  animate (performance.now ());
//  vs.scheduleAction(animate, 100);
}

function makeMesh (resolution, pos_x, pos_y, width, height, c) {

  var rx = width / resolution;
  var ry = height / resolution;
  
  //(resolution + 1) * (resolution + 1) vertices; vertexe = 3 numbers
  if (!c) {
    c = new Float32Array ((resolution + 1) * (resolution + 1) * 3); 
  }
  
  var i = 0, xs, ys, x, y;

  for (xs = 0; xs < resolution + 1; xs++) {
    x = pos_x + rx * xs;
    y = pos_y;
    
    c[i++] = x;
    c[i++] = y;
    c[i++] = 0;

    for (ys = 1; ys < resolution + 1; ys++) {

      y = pos_y + ry * ys;
      
      c[i++] = x;
      c[i++] = y;
      c[i++] = 0;
    }
  }
  return c;
}

function makeTextureProjection (resolution, c) {
  var r = 1 / resolution;
  
  //(resolution + 1) * (resolution + 1) vertices; vertexe = 3 numbers
  if (!c) {
    c = new Float32Array ((resolution + 1) * (resolution + 1) * 2);
  }

  var i = 0, xs, ys, x, y;

  for (xs = 0; xs < resolution + 1; xs++) {
    x = r * xs;
    y = 0;
    
    c[i++] = x;
    c[i++] = y;
 
    for (ys = 1; ys < resolution + 1; ys++) {

      y = r * ys;

      c[i++] = x;
      c[i++] = y;
    }
  }
  
  return c;
}

function makeTriangles (resolution, c) {

  //resolution * resolution rectangles; rectangle = 2 facets; facet = 3 vertices
  if (!c) {
    c = new Uint16Array (resolution * resolution * 6);
  }
  
  var i = 0, xs, ys, j = 0;

  for (xs = 0; xs < resolution; xs++) {
    for (ys = 0; ys < resolution ; ys++) {

      // first facet
      c[i++] = j;
      c[i++] = j + resolution + 1;
      c[i++] = j + 1;

      // second facet
      c[i++] = j + 1;
      c[i++] = j + resolution + 1;
      c[i++] = j + resolution + 2;
      
      j++;
    }
    j++;
  }
  
  return c;
}
