
var rttFramebuffer;
var rttTexture;

function initPickBuffer()  {
  rttFramebuffer = gl_ctx.createFramebuffer();
  gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, rttFramebuffer);
  rttFramebuffer.width = frame_size [0] * gl_device_pixel_ratio;
  rttFramebuffer.height = frame_size [1] * gl_device_pixel_ratio;

  rttTexture = gl_ctx.createTexture();

  gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, rttTexture);
  gl_ctx.texImage2D (gl_ctx.TEXTURE_2D, 0, gl_ctx.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, gl_ctx.RGBA, gl_ctx.UNSIGNED_BYTE, null);

  function isPowerOfTwo (x) {
    return (x !== 0) && ((x & (x - 1)) === 0);
  }

  gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, rttTexture);
  gl_ctx.texImage2D (gl_ctx.TEXTURE_2D, 0, gl_ctx.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, gl_ctx.RGBA, gl_ctx.UNSIGNED_BYTE, null);

  // POT images
  if (isPowerOfTwo (frame_size [0] * gl_device_pixel_ratio) &&
      isPowerOfTwo (frame_size [1] * gl_device_pixel_ratio)) {
  
    gl_ctx.texParameteri
      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MAG_FILTER, gl_ctx.LINEAR);
    
    gl_ctx.texParameteri
      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.NEAREST_MIPMAP_LINEAR);

    gl_ctx.generateMipmap (gl_ctx.TEXTURE_2D);
  }
  // NPOT images
  else {
    //gl_ctx.NEAREST is also allowed, instead of gl_ctx.LINEAR, as neither mipmap.
    gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.LINEAR);
    //Prevents s-coordinate wrapping (repeating).
    gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_S, gl_ctx.CLAMP_TO_EDGE);
    //Prevents t-coordinate wrapping (repeating).
    gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_T, gl_ctx.CLAMP_TO_EDGE);
  }

  var renderbuffer = gl_ctx.createRenderbuffer();
  gl_ctx.bindRenderbuffer(gl_ctx.RENDERBUFFER, renderbuffer);
  gl_ctx.renderbufferStorage(gl_ctx.RENDERBUFFER, gl_ctx.DEPTH_COMPONENT16, rttFramebuffer.width, rttFramebuffer.height);

  gl_ctx.framebufferTexture2D(gl_ctx.FRAMEBUFFER, gl_ctx.COLOR_ATTACHMENT0, gl_ctx.TEXTURE_2D, rttTexture, 0);
  gl_ctx.framebufferRenderbuffer(gl_ctx.FRAMEBUFFER, gl_ctx.DEPTH_ATTACHMENT, gl_ctx.RENDERBUFFER, renderbuffer);

  gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, null);
  gl_ctx.bindRenderbuffer(gl_ctx.RENDERBUFFER, null);
  gl_ctx.bindFramebuffer(gl_ctx.FRAMEBUFFER, null);
}

function pickUp (event) {
  if (!render_ui || !event) return;
  if (gl_ctx.isContextLost ()) return;
  
  var x = event.clientX;
  var y = event.clientY;
  
  if (vs.util.isUndefined (x) || vs.util.isUndefined (y)) {
    var list = event.targetPointerList;
    if (!list) list = event.targetTouches;
    if (!list) list = event.touches;
    
    if (!list || list.length === 0) return;
    
    var touch = list[0];
    x = touch.clientX;
    y = touch.clientY;
  }
  
  return _pickUp (x * gl_device_pixel_ratio, y * gl_device_pixel_ratio);
}

var pickUp_pixelColor = new Uint8Array (4);
function _pickUp (x, y) {
  
  DropTick = 1;

  gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, rttFramebuffer);

  // Clear GL Surface
  gl_ctx.clearColor (1, 1, 1, 1);

  render_ui (performance.now (), 1);
  
  y = frame_size[1] * gl_device_pixel_ratio - y;

  // Read Pixel Color
  gl_ctx.readPixels(x, y,1,1,gl_ctx.RGBA,gl_ctx.UNSIGNED_BYTE, pickUp_pixelColor);
                  
  // Return GL Clear To User Colors
  gl_ctx.clearColor (1, 1, 1, 1);
        
  gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, null);
  
  function getGLIDfromColor (pickUp_pixelColor) {
    return pickUp_pixelColor [0] + pickUp_pixelColor [1] * 256 + pickUp_pixelColor [2] * 65536;
  }
  var gl_id = getGLIDfromColor (pickUp_pixelColor)

  return GL_VIEWS [gl_id];
}

var __pointer_start_activated = 0;
function __gl_activate_pointer_start () {
  if (__pointer_start_activated === 0) {
    GL_CANVAS.addEventListener (POINTER_START, pointer_start);
  }
  __pointer_start_activated ++;
}

function __gl_deactivate_pointer_start () {
  if (__pointer_start_activated === 0) return;
  if (__pointer_start_activated === 1) {
    GL_CANVAS.removeEventListener (POINTER_START, pointer_start);
  }
  
  __pointer_start_activated --;
}

var __pointer_move_activated = 0;
function __gl_activate_pointer_move () {
  if (__pointer_move_activated === 0) {
    GL_CANVAS.addEventListener (POINTER_MOVE, pointer_move);
  }
  __pointer_move_activated ++;
}

function __gl_deactivate_pointer_move () {
  if (__pointer_move_activated === 0) return;
  if (__pointer_move_activated === 1) {
    GL_CANVAS.removeEventListener (POINTER_MOVE, pointer_move);
  }
  
  __pointer_move_activated --;
}

var __pointer_end_activated = 0;
function __gl_activate_pointer_end () {
  if (__pointer_end_activated === 0) {
    GL_CANVAS.addEventListener (POINTER_END, pointer_end);
  }
  __pointer_end_activated ++;
}

function __gl_deactivate_pointer_end () {
  if (__pointer_end_activated === 0) return;
  if (__pointer_end_activated === 1) {
    GL_CANVAS.removeEventListener (POINTER_END, pointer_end);
  }
  
  __pointer_end_activated --;
}


function pointer_start (event) {
  var obj = pickUp (event);
  if (obj) {
    dispatch_event (POINTER_START, obj, event);
  }
}

function pointer_move (event) {
  var obj = pickUp (event);
  if (obj) {
    dispatch_event (POINTER_MOVE, obj, event);
  }
}

function pointer_end (event) {
  var obj = pickUp (event);
  if (obj) {
    dispatch_event (POINTER_END, obj, event);
  }
}