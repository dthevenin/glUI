var SPRITES = [];
var SPRITE_ALLOCATIONS = [];

var __unique_gl_id = 1;
var GL_VIEWS = [];
var default_triangle_faces = new Uint16Array ([0,1,2,3]);

function createSprite (gl_view) {

  var id = __unique_gl_id ++;
  gl_view.__gl_id = id ;
  GL_VIEWS [id] = gl_view;

  var sprite = new Sprite (gl_view.__gl_id);
  if (gl_view.__update_gl_vertices) {
    setUpdateVerticesSprite (gl_view, gl_view.__update_gl_vertices);
    gl_view.__update_gl_vertices = undefined;
  }
}

function deleteSprite (gl_view) {

  var gl_object = SPRITES [gl_view.__gl_id];
  
  if (gl_object.texture) {
    gl_ctx.deleteTexture (gl_object.texture);
    gl_object.texture = null;
  }
}

function setVerticesAllocationFunctions (gl_view, resolution, sprite_vertices_func, normal_vertices_func, triangle_faces_func, texture_projection_func) {
  
  if (!gl_view) return;
  var sprite = new Sprite (gl_view.__gl_id);
  if (!sprite) return;

  var allocations = {};
  allocations.resolution = resolution;
  allocations.sprite_vertices_func = sprite_vertices_func;
  allocations.normal_vertices_func = normal_vertices_func;
  allocations.triangle_faces_func = triangle_faces_func;
  allocations.texture_projection_func = texture_projection_func;
  
  SPRITE_ALLOCATIONS [gl_view.__gl_id] = allocations;
  sprite.default_meshes = false;
}   

function Sprite (id)
{
  this.matrix = mat4.create ();
  
  // Parent matrix. Use to save parent transformation
  // and accelerate the rendering
  this.p_matrix = mat4.create ();

  // Sprite matrix transformation (translation, rotation, scale, skew)
  this.m_matrix = mat4.create ();
  
  // Sprite id (number)
  this.id = id;
  SPRITES [this.id] = this;
  
  // Buffers allocation
  this.mesh_vertices_buffer = gl_ctx.createBuffer ();
  
  // Sprite vertices used for culling algorithm
  this.vertex_1 = vec3.create ();
  this.vertex_2 = vec3.create ();
  this.vertex_3 = vec3.create ();
  this.vertex_4 = vec3.create ();
}

function updateSpriteSize (gl_view, width, height) {
  if (!gl_view) return;
  var sprite = new Sprite (gl_view.__gl_id);
  if (!sprite) return;
  
  setupTextureFramebuffer (sprite, width, height);
}

function setupTextureFramebuffer (sprite, width, height) {
  
  if (sprite._framebuffer) {
    gl_ctx.deleteFramebuffer (sprite._framebuffer);
  }
  if (sprite._renderbuffer) {
    gl_ctx.deleteRenderbuffer (sprite._renderbuffer);
  }
  if (sprite._frametexture) {
    gl_ctx.deleteTexture (sprite._frametexture);
  }  
  
  if (width === 0 || height === 0) return;
  
  var framebuffer = gl_ctx.createFramebuffer();
  sprite._framebuffer = framebuffer;
  
  gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, framebuffer);
  framebuffer.width = width * gl_device_pixel_ratio;
  framebuffer.height = height * gl_device_pixel_ratio;

  var texture = gl_ctx.createTexture();
  sprite._frametexture = texture;

  function isPowerOfTwo (x) {
    return (x !== 0) && ((x & (x - 1)) === 0);
  }
  
  gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, texture);
  gl_ctx.texImage2D (gl_ctx.TEXTURE_2D, 0, gl_ctx.RGBA, framebuffer.width, framebuffer.height, 0, gl_ctx.RGBA, gl_ctx.UNSIGNED_BYTE, null);

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
  sprite._renderbuffer = renderbuffer;
  
  gl_ctx.bindRenderbuffer(gl_ctx.RENDERBUFFER, renderbuffer);
  gl_ctx.renderbufferStorage(gl_ctx.RENDERBUFFER, gl_ctx.DEPTH_COMPONENT16, framebuffer.width, framebuffer.height);

  gl_ctx.framebufferTexture2D(gl_ctx.FRAMEBUFFER, gl_ctx.COLOR_ATTACHMENT0, gl_ctx.TEXTURE_2D, texture, 0);
  gl_ctx.framebufferRenderbuffer(gl_ctx.FRAMEBUFFER, gl_ctx.DEPTH_ATTACHMENT, gl_ctx.RENDERBUFFER, renderbuffer);

  gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, null);
  gl_ctx.bindRenderbuffer(gl_ctx.RENDERBUFFER, null);
  gl_ctx.bindFramebuffer(gl_ctx.FRAMEBUFFER, null);
}
  
function defaultSpriteVerticesAllocation (sprite) {
  
  // Default mesh allocation: 4 vertices * 3 float values
  sprite.mesh_vertices = new Float32Array (12);
  // will use the default_triangle_faces
  sprite.triangle_faces = null;
  // do not use normals
  sprite.normal_vertices = null;
  // do not use texture
  sprite.texture_uv = null;
}

function initSprite (gl_view) {
  if (!gl_view) return;
  
  var sprite = SPRITES [gl_view.__gl_id];
  if (!sprite) return;
  
  if (sprite.default_meshes) {
    defaultSpriteVerticesAllocation (sprite);
  }
  else {
    var allocations = SPRITE_ALLOCATIONS [gl_view.__gl_id];
    if (!allocations) {
      defaultSpriteVerticesAllocation (sprite);
      return;
    }
    if (allocations.sprite_vertices_func) {
      sprite.mesh_vertices = allocations.sprite_vertices_func (
        allocations.resolution, sprite.mesh_vertices
      );
    }
    if (allocations.normal_vertices_func) {
      sprite.normal_vertices = allocations.normal_vertices_func (
        allocations.resolution, sprite.normal_vertices
      );
    }
    if (allocations.triangle_faces_func) {
      sprite.triangle_faces = allocations.triangle_faces_func (
        allocations.resolution, sprite.triangle_faces
      );
    }
    if (allocations.texture_projection_func) {
      sprite.texture_uv = allocations.texture_projection_func (
        allocations.resolution, sprite.texture_uv
      );
    }
  }
}

// This constant change when the use setup is own meshes
// with the function setMeshFunctions
Sprite.prototype.default_meshes = true;

// Contains sprite vertices
Sprite.prototype.mesh_vertices = null;

// Contains mesh's normal vertices
Sprite.prototype.normal_vertices = null;

// Contains trangles faces
Sprite.prototype.triangle_faces = null;

// Contains texture projection parameters
Sprite.prototype.texture_uv = null;

// GL Buffer for mesh vertices
Sprite.prototype.mesh_vertices_buffer = null;

// Textures references
Sprite.prototype.texture = null;
Sprite.prototype.image_texture = null;

Sprite.restoreGLContext = function () {
  var sprite, i = 0, l = SPRITES.length;
  
  for (; i < l; i++) {
    sprite = SPRITES [i];
    if (sprite) {
      delete (sprite.mesh_vertices_buffer);
      sprite.mesh_vertices_buffer = gl_ctx.createBuffer ();
      
      if (sprite.texture) {
        delete (sprite.texture);
        sprite.texture = gl_ctx.createTexture ();
      }
      
      if (sprite.image_texture) {
        delete (sprite.image_texture);
        sprite.image_texture = gl_ctx.createTexture ();
      }
    }
  }
  
  var handlers = webglcontextrestored_listeners [sprite.id];
  if (handlers) {
    handlers.forEach (function (handler) {
      try {
        handler ();
      } catch (exp) {
        if (exp.stack) console.log (exp.stack);
        else consoel.log (exp);
      }
    });
  }
}