function update_gl_vertices (gl_view) {
  var
    sprite = SPRITES [gl_view.__gl_id],
    obj_size = gl_view._size,
    obj_pos = gl_view._position,
    x = obj_pos[0],
    y = obj_pos[1],
    w = obj_size [0],
    h = obj_size [1],
    m = sprite.vertices;
        
  // setup position vertices
  m[0] = x; m[1] = y; m[2] = 0;
  m[3] = x; m[4] = y + h; m[5] = 0;
  m[6] = x + w; m[7] = y; m[8] = 0;
  m[9] = x + w; m[10] = y + h; m[11] = 0;
  
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, sprite.vertices_buffer);
  gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, m, gl_ctx.STATIC_DRAW);
  
  gl_view.__should_update_gl_vertices = false;
};

function update_shadow_gl_vertices (gl_view, offset, blur) {
//  blur = 0
  var
    obj_size = gl_view._size,
    obj_pos = gl_view._position,
    x = obj_pos[0] + offset [0] - blur,
    y = obj_pos[1] + offset [1] - blur,
    w = obj_size [0] + 2 * blur,
    h = obj_size [1] + 2 * blur,
    m = shadow_vertices;
        
  // setup position vertices
  m[0] = x; m[1] = y; m[2] = 0;
  m[3] = x; m[4] = y + h; m[5] = 0;
  m[6] = x + w; m[7] = y; m[8] = 0;
  m[9] = x + w; m[10] = y + h; m[11] = 0;
  
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, shadow_buffer);
  gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, m, gl_ctx.STATIC_DRAW);
};

var angle2rad = Math.PI / 180;

/**
 * @protected
 * @function
 */
function update_transform_gl_matrix (gl_view, sprite)
{
  var
    matrix = sprite.matrix,
    pos = gl_view._position,
    size = gl_view._size,
    rot = gl_view._rotation,
    trans = gl_view._translation,
    tx = gl_view._transform_origin [0] + pos [0],
    ty = gl_view._transform_origin [1] + pos [1];
    
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
  update_envelop_vertices (sprite, pos, size);

  gl_view.__invalid_matrixes = true;
  GLView.__should_render = true;
  
  gl_view.__should_update_gl_matrix = false;
}

/**
 * Update vertices vectors for the culling algorithm
 * @protected
 * @function
 */
function update_envelop_vertices (sprite, obj_pos, obj_size)
{
  var
    matrix = sprite.matrix,
    x = obj_pos[0],
    y = obj_pos[1],
    z = obj_pos[2],
    w = obj_size [0],
    h = obj_size [1];

  mat4.multiplyXYZToVec3 (matrix, x    , y    , z, sprite.vertex_1);
  mat4.multiplyXYZToVec3 (matrix, x    , y + h, z, sprite.vertex_2);
  mat4.multiplyXYZToVec3 (matrix, x + w, y    , z, sprite.vertex_3);
  mat4.multiplyXYZToVec3 (matrix, x + w, y + h, z, sprite.vertex_4);
} 

var next_rendering_id = 0;
var gl_stack_length = 0;
var gl_stack_for_renter = [1024];
var gl_boundaries_stack = [256];
var v_temp = vec3.create ();

function isInFrustum (sprite, level, p_size_vec, scroll_vec) {
  // Update matrixes
  var
    boundaries = gl_boundaries_stack [level],
    v1 = sprite.vertex_1, v2 = sprite.vertex_2,
    v3 = sprite.vertex_3, v4 = sprite.vertex_4;

  if ((v1[0]>boundaries[2] && v2[0]>boundaries[2] &&
       v3[0]>boundaries[2] && v4[0]>boundaries[2]) ||
      (v1[0]<boundaries[0] && v2[0]<boundaries[0] &&
       v3[0]<boundaries[0] && v4[0]<boundaries[0]) ||
      (v1[1]>boundaries[3] && v2[1]>boundaries[3] &&
       v3[1]>boundaries[3] && v4[1]>boundaries[3]) || 
      (v1[1]<boundaries[1] && v2[1]<boundaries[1] &&
       v3[1]<boundaries[1] && v4[1]<boundaries[1])) { 
    return false;
  }

  // Set the new boundaries for the children
  boundaries = gl_boundaries_stack [level+1];
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
  
  return true;
}

function calculateViewsInFrustum (now) {
  var apps = vs.Application_applications, key;
  gl_stack_length = 0;
  gl_views_index = 0;

  function _calculateViewsInFrustum (gl_view, p_transform, new_p_matrix, p_alpha, level) {
    var key, i, l, child, children, style, alpha, sprite;
    
    // Views visibility
    if (!gl_view._visible && !gl_view.__is_hidding) {
      return;
    }
    
    sprite = SPRITES [gl_view.__gl_id];
    
    // animate view
    gl_update_animation (gl_view, now);

    // Views opacity
    style = gl_view._style;
    if (style) alpha = p_alpha * style._opacity;
    else alpha = p_alpha;

    if (alpha === 0) {
      return;
    }
    
    /*================= Update view matrixes ================= */
    if (gl_view.__should_update_gl_matrix) {
      update_transform_gl_matrix (gl_view, sprite);
    }
    var o_matrix = sprite.matrix;
    var m_matrix = sprite.m_matrix;
    var p_matrix = sprite.p_matrix;
    var p_size_vec = gl_view._size;
    var scroll_vec = gl_view.__gl_scroll;
          
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
    if (!isInFrustum (sprite, level, p_size_vec, scroll_vec)) return;
    
    var entry = gl_stack_for_renter [gl_views_index++];
    entry [0] = 1; // normal view to render
    entry [1] = gl_view;
    entry [2] = alpha;
     // End culling algorithm

    /*================== Manage children ================== */
    children = gl_view.__children;
    l = children.length;
    for (i = 0; i < l; i++) {
      child = children [i];
      if (child.__gl_id) {
        _calculateViewsInFrustum (child, p_matrix, new_p_matrix, alpha, level + 1);
      }
    }
  }

  var boundaries = gl_boundaries_stack [0];
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

var render_ui;

var shadow_buffer;
var shadow_vertices = new Float32Array (12);

function initRendering () {
  
  shadow_buffer = gl_ctx.createBuffer ();

  for (var i = 0; i < 1024; i ++) {
    gl_stack_for_renter [i] = new Array (3);
    // [0] - rendering type
    // [1] - view to render
    // [2] - alpha
  }
  
  for (var i = 0; i < 256; i ++) {
    gl_boundaries_stack [i] = new glMatrixArrayType (4);
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
  
  function bindToUnitTEXTURE0_1 (unit, sprite) {
    gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, sprite.texture);
  };
  
  function bindToUnitTEXTURE0_2 (unit, sprite) {
    gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, sprite.image_texture);
  };
  
  function bindToUnitTEXTURE0_3 (unit, style) {
    gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, style.__gl_texture_bck_image);
  };
  
  function renderOneView (gl_view, alpha, mode) {

    var program;
    var sprite = SPRITES [gl_view.__gl_id];
       
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
    else if (mode === 2) {
    
      var style = gl_view.style;

      program = shadowShaderProgram;
      if (previous_program !== shadowShaderProgram) {
        program.useIt ();
      }
      program.uniform.color (style._shadow_color.__gl_array);
      if (style._shadow_blur) {
        program.uniform.blur (1.75 * style._shadow_blur);
      }
      else {
        program.uniform.blur (0.001);
      }
      update_shadow_gl_vertices (gl_view, style._shadow_offset, style._shadow_blur);
      
      var v1 = vec3.create ();
      var v2 = vec3.create ();

      mat4.multiplyXYZToVec3 (
        sprite.m_matrix,
        shadow_vertices[0], shadow_vertices[1], 0,
        v1
      );
      
      mat4.multiplyXYZToVec3 (
        sprite.m_matrix,
        shadow_vertices[9], shadow_vertices[10], 0,
        v2
      );

      program.uniform.frame (
        new Float32Array ([
          v1[0], v2[0],
          frame_size[1]-v1[1], frame_size[1]-v2[1]
        ])
      );
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
      
      if (style._shadow_color) {
        renderOneView (gl_view, alpha, 2);
      }
    
      if (gl_view.__gl_user_program) {
        program = gl_view.__gl_user_program;
        program.useIt ();
        
        if (program.configureParameters) {
          program.configureParameters (gl_view, style);
        }
      }
      else if (sprite.image_texture) {
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
        program.textures.uMainTexture (texture1, sprite);
      }
      else if (sprite.texture && style.__gl_texture_bck_image) {
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
        program.textures.uMainTexture (texture1, sprite);
      
        attribute.buffer = object_bck_image_uv_buffer;
        attribute.numComponents = 2;
        program.attrib.bkImageUV (attribute);
        gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, style._background_image_uv, gl_ctx.STATIC_DRAW);

        texture2.bindToUnit = bindToUnitTEXTURE0_3;
        program.textures.uBckTexture (texture2, style);

        program.uniform.color (c_buffer);
      }
      else if (sprite.texture) {
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
        program.textures.uMainTexture (texture1, sprite);
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

    program.uniform.Mmatrix (sprite.m_matrix);
    program.uniform.uAlpha (alpha);

    attribute.normalize = false;
    attribute.type = gl_ctx.FLOAT;
    attribute.stride = 0;
    attribute.offset = 0;

    if (mode === 2) {
      attribute.buffer = shadow_buffer;
    }
    else {
      if (gl_view.__should_update_gl_vertices) {
        if (gl_view.__update_gl_vertices) gl_view.__update_gl_vertices ();
        else update_gl_vertices (gl_view);
      }
      attribute.buffer = sprite.vertices_buffer;
    }
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

  render_ui = function (now, mode) {

    if (mode !== 1 && (!GLView.__should_render && !GLView.__nb_animation)) {
      vs.requestAnimationFrame (render_ui);
      return
    }

    if (stats) stats.begin ();
    
//     if (mode === 1 && next_rendering_id) {
//       cancelAnimationFrame (next_rendering_id);
//     }

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
//    next_rendering_id = vs.requestAnimationFrame (animate);
//    if (mode !== 1) vs.scheduleAction(animate, 300);

    if (stats) stats.end ();
    
    if (mode !== 1) vs.requestAnimationFrame (render_ui);
  }
  
  vs.requestAnimationFrame (render_ui);
  
//  animate (performance.now ());
//  vs.scheduleAction(animate, 100);
}
