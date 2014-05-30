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
