var GL_OBJECTS = [];

function glObject (id)
{
  this.matrix = mat4.create ();
  this.p_matrix = mat4.create ();
  this.m_matrix = mat4.create ();
  
  this.id = id;
  GL_OBJECTS [this.id] = this;
  
  // contains position vertices
  this.vertices = new Float32Array (12);
  this.vertices_buffer = gl_ctx.createBuffer ();
  
  this.vertex_1 = vec3.create ();
  this.vertex_2 = vec3.create ();
  this.vertex_3 = vec3.create ();
  this.vertex_4 = vec3.create ();
  
  this.texture = null;
  this.image_texture = null;
}