
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

  // Configure view and projection matrix of programes
  updateProgramsMatrix ();
  
  initRendering ()

  vs.requestAnimationFrame (serviceLoopBis);
}
