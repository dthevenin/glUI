
var
  basicShaderProgram,
  oneTextureShaderProgram,
  twoTexturesShaderProgram,
  drawShadowShaderProgram,
  drawShaderProgram,
  pickupShaderProgram,
  gl_ctx,
  object_uv_buffer,
  object_bck_image_uv_buffer,
  default_object_bck_image_uv_buffer,

  object_faces_buffer,
  frame_size = [100, 100],
  gl_device_pixel_ratio,
  jsProjMatrix,
  jsViewMatrix,
  core_export = {};


function createCanvas (width, height) {

  var canvas = document.createElement ('canvas');
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  canvas.width = width * gl_device_pixel_ratio;
  canvas.height = height* gl_device_pixel_ratio;

  if (
//   deviceConfiguration.browser !==
//       vs.core.DeviceConfiguration.BROWSER_FIREFOX &&
    gl_device_pixel_ratio !== 1) {
  
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
  
  /**********************************************
               Picking shaders
  **********************************************/
  
  var pickup_vertex_shader="\n\
attribute vec2 position;\n\
uniform mat4 Mmatrix;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
\n\
void main(void) {\n\
  gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 0., 1.);\n\
}";

  var pickup_shader_fragment="\n\
precision lowp float;\n\
uniform vec4 color;\n\
void main(void) {\n\
  gl_FragColor = color;\n\
}";

/**********************************************
             Drawing shaders
**********************************************/

  var draw_vertex_shader="\n\
attribute vec2 position;\n\
uniform mat4 Mmatrix;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
\n\
attribute vec2 text_uv;\n\
\n\
varying vec2 v_text_uv;\n\
\n\
void main(void) {\n\
  gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 0., 1.);\n\
  v_text_uv = text_uv;\n\
}";

  var draw_shader_fragment="\n\
precision lowp float;\n\
varying vec2 v_text_uv;\n\
uniform sampler2D texture;\n\
uniform float uAlpha;\n\
void main(void) {\n\
  vec4 mainTextureColor = texture2D(texture, v_text_uv);\n\
  gl_FragColor = vec4(mainTextureColor.rgb, mainTextureColor.a * uAlpha);\n\
}";

  var shadow_vertex_shader="\n\
attribute vec2 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
\n\
varying vec2 vPos;\n\
\n\
void main(void) {\n\
  gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 0., 1.);\n\
  vPos = position.xy;\n\
}";

  var shadow_shader_fragment="\n\
precision lowp float;\n\
uniform vec4 color;\n\
uniform float uAlpha;\n\
uniform float blur;\n\
uniform vec4 frame;\n\
varying vec2 vPos;\n\
void main(void) {\n\
  float shine = \n\
    smoothstep(frame[0], frame[0] + blur, vPos.x) * \n\
    smoothstep(frame[1], frame[1] - blur, vPos.x) * \n\
    smoothstep(frame[2], frame[2] + blur, vPos.y) * \n\
    smoothstep(frame[3], frame[3] - blur, vPos.y); \n\
\n\
  gl_FragColor = vec4(color.rgb, shine * color.a * uAlpha);\n\
}";

/**********************************************
             Paiting shaders
**********************************************/

  var basic_vertex_shader="\n\
attribute vec2 position;\n\
uniform float ratio;\n\
const float c_precision = 65536.;\n\
mat4 createProjMatrix () {\n\
  float ratiox =  2. / mod(ratio, c_precision);\n\
  float ratioy = -2. / (ratio / c_precision);\n\
  return mat4(ratiox,0.,0.,0., 0.,ratioy,0.,0., 0.,0.,1.,0., -1.,1.,0.,1.);\n\
}\n\
void main(void) {\n\
  gl_Position = createProjMatrix ()*vec4(position, 0., 1.);\n\
}";

  var basic_shader_fragment="\n\
precision lowp float;\n\
uniform vec4 color;\n\
void main(void) {\n\
  gl_FragColor = color;\n\
}";

  var one_texture_vertex_shader="\n\
attribute vec2 position;\n\
attribute vec2 text_uv_1;\n\
varying vec2 v_text_uv_1;\n\
uniform float ratio;\n\
const float c_precision = 65536.;\n\
mat4 createProjMatrix () {\n\
  float ratiox =  2. / mod(ratio, c_precision);\n\
  float ratioy = -2. / (ratio / c_precision);\n\
  return mat4(ratiox,0.,0.,0., 0.,ratioy,0.,0., 0.,0.,1.,0., -1.,1.,0.,1.);\n\
}\n\
void main(void) {\n\
  gl_Position = createProjMatrix ()*vec4(position, 0., 1.);\n\
  v_text_uv_1=text_uv_1;\n\
}";

  var one_texture_shader_fragment="\n\
precision lowp float;\n\
varying vec2 v_text_uv_1;\n\
uniform sampler2D texture_1;\n\
uniform vec4 color;\n\
void main(void) {\n\
  if (v_text_uv_1[0]<0.0 || v_text_uv_1[1]<0.0 || v_text_uv_1[0]>1.0 || v_text_uv_1[1]>1.0) {\n\
    gl_FragColor = color;\n\
  } else {\n\
    vec4 mainTextureColor = texture2D(texture_1, v_text_uv_1);\n\
    gl_FragColor = mix(color, mainTextureColor, mainTextureColor.a);\n\
    gl_FragColor.a = max(color.a, mainTextureColor.a);\n\
  }\n\
}";

  var two_textures_vertex_shader="\n\
attribute vec2 position;\n\
attribute vec2 text_uv_1;\n\
attribute vec2 text_uv_2;\n\
varying vec2 v_text_uv_1;\n\
varying vec2 v_text_uv_2;\n\
uniform float ratio;\n\
const float c_precision = 65536.;\n\
mat4 createProjMatrix () {\n\
  float ratiox =  2. / mod(ratio, c_precision);\n\
  float ratioy = -2. / (ratio / c_precision);\n\
  return mat4(ratiox,0.,0.,0., 0.,ratioy,0.,0., 0.,0.,1.,0., -1.,1.,0.,1.);\n\
}\n\
void main(void) {\n\
  gl_Position = createProjMatrix ()*vec4(position, 0., 1.);\n\
  v_text_uv_2 = text_uv_2;\n\
  v_text_uv_1 = text_uv_1;\n\
}";

  var two_textures_shader_fragment="\n\
precision lowp float;\n\
varying vec2 v_text_uv_1;\n\
varying vec2 v_text_uv_2;\n\
uniform sampler2D texture_1;\n\
uniform sampler2D texture_2;\n\
uniform float uTextureFlag;\n\
uniform vec4 color;\n\
void main(void) {\n\
  vec4 mainTextureColor = texture2D(texture_1, v_text_uv_1);\n\
  vec4 tmpColor;\n\
  if (v_text_uv_1[0]<0.0 || v_text_uv_1[1]<0.0 || v_text_uv_1[0]>1.0 || v_text_uv_1[1]>1.0) {\n\
    tmpColor = color;\n\
  } else {\n\
    vec4 bckTextureColor = texture2D(texture_2, v_text_uv_2);\n\
    tmpColor = mix(color, bckTextureColor, bckTextureColor.a);\n\
    tmpColor.a = max(color.a, bckTextureColor.a);\n\
  }\n\
  gl_FragColor = mix(tmpColor, mainTextureColor, mainTextureColor.a);\n\
  gl_FragColor.a = max(tmpColor.a, mainTextureColor.a);\n\
}";

  basicShaderProgram = createProgram (basic_vertex_shader, basic_shader_fragment);
  drawShadowShaderProgram = createProgram (shadow_vertex_shader, shadow_shader_fragment);
  oneTextureShaderProgram = createProgram (one_texture_vertex_shader, one_texture_shader_fragment);
  twoTexturesShaderProgram = createProgram (two_textures_vertex_shader, two_textures_shader_fragment);

  drawShaderProgram = createProgram (draw_vertex_shader, draw_shader_fragment);
  pickupShaderProgram = createProgram (pickup_vertex_shader, pickup_shader_fragment);
}

function initMainMatrix () {
  // Draw projection matrix
  jsProjMatrix = mat4.create ();
  mat4.identity (jsProjMatrix)
  mat4.perspective (.191 ,1, -1, 10, jsProjMatrix);

  // Draw View matrix
  jsViewMatrix = mat4.create ();
  mat4.identity (jsViewMatrix)  
  mat4.translate (jsViewMatrix, [-1,1,-600]);
  mat4.scale (jsViewMatrix, [2/ frame_size[0], -2/ frame_size[1], 1]);
}

function updateProgramsMatrix () {
  drawShadowShaderProgram.setMatrixes (jsProjMatrix, jsViewMatrix);
  drawShaderProgram.setMatrixes (jsProjMatrix, jsViewMatrix);
  pickupShaderProgram.setMatrixes (jsProjMatrix, jsViewMatrix);
}

function initBuffers () {
  
  /*========================= UV =========================*/
  if (object_uv_buffer) {
    gl_ctx.deleteBuffer (object_uv_buffer);
  }
  object_uv_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, object_uv_buffer);

  gl_ctx.bufferData (
    gl_ctx.ARRAY_BUFFER,
    new Float32Array ([0,0, 0,1, 1,0, 1,1]),
    gl_ctx.STATIC_DRAW
  );

  if (object_bck_image_uv_buffer) {
    gl_ctx.deleteBuffer (object_bck_image_uv_buffer);
  }
  object_bck_image_uv_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, object_bck_image_uv_buffer);

  gl_ctx.bufferData (
    gl_ctx.ARRAY_BUFFER,
    new Float32Array ([0,0, 0,1, 1,0, 1,1]),
    gl_ctx.STATIC_DRAW
  );
    
  if (default_object_bck_image_uv_buffer) {
    gl_ctx.deleteBuffer (default_object_bck_image_uv_buffer);
  }
  default_object_bck_image_uv_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, default_object_bck_image_uv_buffer);
  gl_ctx.bufferData (
    gl_ctx.ARRAY_BUFFER,
    new Float32Array ([0,0, 0,1, 1,0, 1,1]),
    gl_ctx.STATIC_DRAW
  );

  /*========================= FACES ========================= */
  if (object_faces_buffer) {
    gl_ctx.deleteBuffer (object_faces_buffer);
  }
  object_faces_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer(gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer);

  gl_ctx.bindBuffer (gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer);
  gl_ctx.bufferData (
    gl_ctx.ELEMENT_ARRAY_BUFFER,
    default_triangle_faces,
    gl_ctx.STATIC_DRAW);
}

var GL_CANVAS;
var init_functions = [];

function glAddInitFunction (func) {
  init_functions.push (func);
}

function initWebGLRendering (node, width, height) {

  if (gl_ctx) return;
    
  frame_size = [width, height];
  gl_device_pixel_ratio = window.devicePixelRatio || 1;
  
//  if (deviceConfiguration.browser === vs.core.DeviceConfiguration.BROWSER_FIREFOX) {
//    gl_device_pixel_ratio = 1;
//  }
  
  console.log (gl_device_pixel_ratio);

  var canvas = GL_CANVAS = createCanvas (frame_size [0], frame_size [1]);
  canvas.id = "webgl_id"
  node.appendChild (canvas);
  node.style.padding = 0;

  canvas.addEventListener ("webglcontextlost", handleContextLost, false);

  canvas.addEventListener ("webglcontextrestored", function(event) {
    console.log ("webglcontextrestored");
    setupWebGLStateAndResources ();
    Sprite.restoreGLContext ();
    Style.restoreGLContext ();
  }, false);
  
  setupWebGLStateAndResources ();
}

function setupWebGLStateAndResources () {
  
  /*================= Creates a webgl context ================= */
  var webgl_options = {
    antialias: true,
    premultipliedAlpha: false,
    alpha: false
  };
  
  var webgl_names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  for (var i = 0; i < webgl_names.length; ++i) {
    try {
      gl_ctx = GL_CANVAS.getContext (webgl_names[i], webgl_options);
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
  gl_ctx.clearColor (1, 1, 1, 1);
  // DOES NOT WORK ON IOS
  // gl_ctx.colorMask (true, true, true, false);
  
  init_functions.forEach (function (func) { func (); });

  // Configure view and projection matrix of programes
  updateProgramsMatrix ();
  
  initRendering ();
  
  //exportDebug ();
}
