import { GLEngineProgram } from "./GLProgram";
import { getGLContext, initRendering } from "./engine";
import { mat4 } from "gl-matrix";
import { Sprite } from "./sprite";
import { Style } from "./Style";
import { initPickBuffer } from "./event/Picking";

export type GLEngineInitHandle = () => void;


export let basicShaderProgram: GLEngineProgram;
export let shadowShaderProgram: GLEngineProgram;
export let imageShaderProgram: GLEngineProgram;
export let oneTextureShaderProgram: GLEngineProgram;
export let twoTexturesShaderProgram: GLEngineProgram;
export let gl_ctx: WebGLRenderingContext;
let object_uv_buffer: WebGLBuffer = null;
let object_bck_image_uv_buffer: WebGLBuffer = null;
let default_object_bck_image_uv_buffer: WebGLBuffer = null;
let object_faces_buffer: WebGLBuffer = null;
export let frame_size = [100, 100];
export let gl_device_pixel_ratio: number = 1;
let default_texture_projection;
let jsProjMatrix: mat4 = null;
let jsViewMatrix: mat4 = null;
export let GL_CANVAS: HTMLCanvasElement;
const init_functions: GLEngineInitHandle[] = [];
export const default_triangle_faces = new Uint16Array([0, 1, 2, 3]);
export let next_rendering_id: number = 0;

function createCanvas(width: number, height: number): HTMLCanvasElement {

  const canvas = document.createElement ('canvas');
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  canvas.width = width * gl_device_pixel_ratio;
  canvas.height = height* gl_device_pixel_ratio;

  if (
//   deviceConfiguration.browser !==
//       vs.core.DeviceConfiguration.BROWSER_FIREFOX &&
    gl_device_pixel_ratio !== 1) {
  
    const modes = ["crisp-edges", "-moz-crisp-edges", "-webkit-optimize-contrast"];
  
    if (canvas.style.imageRendering !== undefined) {
      for (var i = 0; i < modes.length; i++) {
        canvas.style.imageRendering = modes [i];
        if (canvas.style.imageRendering == modes [i]) {
          break;
        }
      }
    }
  }
  
  return canvas;
}

export function create2DCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = createCanvas (width, height);
  const ctx = canvas.getContext ('2d');

  ctx.imageSmoothingEnabled = false;
  return canvas;
}

// initPrograms
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initPrograms(): void {

  const basic_vertex_shader="\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
void main(void) { //pre-built function\n\
  vec4 new_pos = vec4(position, 1.);\n\
  gl_Position = Pmatrix*Vmatrix*Mmatrix*new_pos;\n\
}";

  const basic_shader_fragment="\n\
precision lowp float;\n\
uniform vec4 color;\n\
uniform float uAlpha;\n\
void main(void) {\n\
  gl_FragColor = vec4(color.rgb, color.a * uAlpha);\n\
}";

  const shadow_vertex_shader="\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
varying vec2 vPos;\n\
void main(void) { //pre-built function\n\
  vec4 temp_pos = Vmatrix*Mmatrix*vec4(position, 1.);\n\
  gl_Position = Pmatrix*temp_pos;\n\
  vPos = position.xy;\n\
}";

  const shadow_shader_fragment="\n\
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

  const image_vertex_shader="\n\
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

  const image_shader_fragment="\n\
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

  const one_texture_vertex_shader="\n\
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

  const one_texture_shader_fragment="\n\
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

  const two_textures_vertex_shader="\n\
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

  const two_textures_shader_fragment="\n\
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

  basicShaderProgram = new GLEngineProgram(gl_ctx, basic_vertex_shader, basic_shader_fragment);
  shadowShaderProgram = new GLEngineProgram(gl_ctx, shadow_vertex_shader, shadow_shader_fragment);
  imageShaderProgram = new GLEngineProgram(gl_ctx, image_vertex_shader, image_shader_fragment);
  oneTextureShaderProgram = new GLEngineProgram(gl_ctx, one_texture_vertex_shader, one_texture_shader_fragment);
  twoTexturesShaderProgram = new GLEngineProgram(gl_ctx, two_textures_vertex_shader, two_textures_shader_fragment);
}

function initMainMatrix () {
  jsProjMatrix = mat4.create ();
  mat4.identity(jsProjMatrix)
  mat4.perspective(jsProjMatrix, 0.191 ,1, -1, 10);

  jsViewMatrix = mat4.create ();
  mat4.identity(jsViewMatrix)
  mat4.translate(jsViewMatrix, jsViewMatrix, [-1,1,-600]);
  mat4.scale(jsViewMatrix, jsViewMatrix, [2/ frame_size[0], -2/ frame_size[1], 1]);
}

function updateProgramsMatrix () {
  imageShaderProgram.setMatrixes(jsProjMatrix, jsViewMatrix);
  twoTexturesShaderProgram.setMatrixes(jsProjMatrix, jsViewMatrix);
  oneTextureShaderProgram.setMatrixes(jsProjMatrix, jsViewMatrix);
  basicShaderProgram.setMatrixes(jsProjMatrix, jsViewMatrix);
  shadowShaderProgram.setMatrixes(jsProjMatrix, jsViewMatrix);
}

function initBuffers() {

  default_texture_projection = new Float32Array([0,0, 0,1, 1,0, 1,1]);

  /*========================= UV =========================*/
  if (object_uv_buffer) {
    gl_ctx.deleteBuffer(object_uv_buffer);
  }
  object_uv_buffer = gl_ctx.createBuffer();
  gl_ctx.bindBuffer(gl_ctx.ARRAY_BUFFER, object_uv_buffer);

  gl_ctx.bufferData (
    gl_ctx.ARRAY_BUFFER,
    default_texture_projection,
    gl_ctx.STATIC_DRAW
  );

  if (object_bck_image_uv_buffer) {
    gl_ctx.deleteBuffer(object_bck_image_uv_buffer);
  }
  object_bck_image_uv_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, object_bck_image_uv_buffer);

  gl_ctx.bufferData (
    gl_ctx.ARRAY_BUFFER,
    default_texture_projection,
    gl_ctx.STATIC_DRAW
  );
    
  if (default_object_bck_image_uv_buffer) {
    gl_ctx.deleteBuffer (default_object_bck_image_uv_buffer);
  }
  default_object_bck_image_uv_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, default_object_bck_image_uv_buffer);
  gl_ctx.bufferData (
    gl_ctx.ARRAY_BUFFER,
    default_texture_projection,
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

export function glAddInitFunction(func: GLEngineInitHandle) {
  init_functions.push(func);
}

export function initWebGLRendering(node: HTMLElement, width: number, height: number) {

  if (gl_ctx) return;
    
  frame_size = [width, height];
  gl_device_pixel_ratio = window.devicePixelRatio || 1;
  
//  if (deviceConfiguration.browser === vs.core.DeviceConfiguration.BROWSER_FIREFOX) {
//    gl_device_pixel_ratio = 1;
//  }
  
  console.log (gl_device_pixel_ratio);

  var canvas = GL_CANVAS = createCanvas(frame_size [0], frame_size [1]);
  node.appendChild (canvas);
  node.style.padding = '0';

  canvas.addEventListener ("webglcontextlost", handleContextLost, false);

  canvas.addEventListener ("webglcontextrestored", function(event) {
    console.log ("webglcontextrestored");
    setupWebGLStateAndResources ();
    Sprite.restoreGLContext();
    Style.restoreGLContext();
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
  
  gl_ctx = GL_CANVAS.getContext("webgl", webgl_options) as WebGLRenderingContext;
  if (!gl_ctx) {
    alert ("You are not webgl compatible :(") ;
    throw ("You are not webgl compatible :(") ;
    return;
  }  
  
  /*========================= SHADERS ========================= */
  initPrograms();
  initMainMatrix();
  initBuffers();
  initPickBuffer();

  /*========================= DRAWING ========================= */
  gl_ctx.disable(gl_ctx.DEPTH_TEST);

  gl_ctx.enable(gl_ctx.BLEND);
  gl_ctx.blendFunc(gl_ctx.SRC_ALPHA, gl_ctx.ONE_MINUS_SRC_ALPHA);

  gl_ctx.clearDepth(1.0);
  gl_ctx.clearColor(1, 1, 1, 1);
  // DOES NOT WORK ON IOS
  // gl_ctx.colorMask (true, true, true, false);
  
  init_functions.forEach(func => func());

  // Configure view and projection matrix of programes
  updateProgramsMatrix();
  
  initRendering();
}

function handleContextLost(event: Event) {
  console.log("webglcontextlost");
  event.preventDefault();
  cancelAnimationFrame(next_rendering_id);

  //delete (gl_ctx);
  gl_ctx = undefined;

  //delete (basicShaderProgram);
  basicShaderProgram = undefined;

  //delete (shadowShaderProgram);
  shadowShaderProgram = undefined;

  //delete (imageShaderProgram);
  imageShaderProgram = undefined;

  //delete (oneTextureShaderProgram);
  oneTextureShaderProgram = undefined;

  //delete (twoTexturesShaderProgram);
  twoTexturesShaderProgram = undefined;
}