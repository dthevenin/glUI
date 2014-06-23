
function setUpdateVerticesSprite (gl_view, update_gl_vertices) {

  if (!gl_view) return;
  var sprite = SPRITES [gl_view.__gl_id];
  if (!sprite) return;

  sprite.__update_gl_vertices = update_gl_vertices;
}

function setShadersProgram (gl_view, program) {

  if (!gl_view) return;
  var sprite = SPRITES [gl_view.__gl_id];
  if (!sprite) return;

  sprite.user_program = program;
}

function clean_image_texture (gl_view) {
  var gl_object = SPRITES [gl_view.__gl_id];
  
  if (gl_object.image_texture) {
    gl_object.image_texture = null;
  }
}

function set_image_texture (gl_view, texture) {
  var gl_object = SPRITES [gl_view.__gl_id];
  
  gl_object.image_texture = texture;
}


function update_texture (gl_view, image) {
  var gl_object = SPRITES [gl_view.__gl_id];
  
  gl_object.texture = __copy_image_into_webgl_texture (image, gl_object.texture);
}


var webglcontextrestored_listeners = [];
function register_webglcontextrestored (gl_view, handler) {
  if (!gl_view || !handler) return;
  
  var sprite = SPRITES [gl_view.__gl_id];
  if (!sprite) return;
  
  var handlers = webglcontextrestored_listeners [gl_view.__gl_id];
  if (!handlers) {
    handlers = [];
    webglcontextrestored_listeners [gl_view.__gl_id] = handlers;
  }
  
  handlers.push (handler);
}