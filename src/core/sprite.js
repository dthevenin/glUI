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