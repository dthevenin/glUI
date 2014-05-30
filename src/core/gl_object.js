var GL_OBJECTS = [];

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
