
function renderOneViewSave (gl_view, alpha, mode) {

  var program;
  var sprite = SPRITES [gl_view.__gl_id];
  var vertices_buffer;
     
  // determine which vertices buffer to use
  // add update it if it's need.
  if (mode === 2) {
    vertices_buffer = shadow_buffer;
  }
  else {
    if (gl_view.__should_update_gl_vertices) {
      if (sprite.__update_gl_vertices) {
        sprite.__update_gl_vertices (sprite, gl_view._position, gl_view._size);

        gl_ctx.bindBuffer (
          gl_ctx.ARRAY_BUFFER,
          sprite.mesh_vertices_buffer
        );
        gl_ctx.bufferData (
          gl_ctx.ARRAY_BUFFER,
          sprite.mesh_vertices,
          gl_ctx.STATIC_DRAW
        );
      }
      else {
        update_gl_vertices (sprite, gl_view._position, gl_view._size);

        gl_ctx.bindBuffer (
          gl_ctx.ARRAY_BUFFER,
          sprite.mesh_vertices_buffer);
        gl_ctx.bufferData (
          gl_ctx.ARRAY_BUFFER,
          sprite.mesh_vertices,
          gl_ctx.STATIC_DRAW
        );
      }
      
      gl_view.__should_update_gl_vertices = false;
    }
    vertices_buffer = sprite.mesh_vertices_buffer;
  }

  // Picking mode rendering
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

  // Shadow mode rendering
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
    update_shadow_gl_vertices (gl_view._position, gl_view._size, style._shadow_offset, style._shadow_blur);

    program.uniform.frame (
      new Float32Array ([
        shadow_vertices[0], shadow_vertices[9],
        shadow_vertices[1], shadow_vertices[10]
      ])
    );
  }

  // General mode rendering
  else {
    var style = gl_view.style, c_buffer;
    if (!style) {
      style = _default_style;
    }

    if (style && style._background_color) {
      c_buffer = style._background_color.__gl_array;
    }
    else {
      c_buffer = Color.default.__gl_array;
    }
    
    if (style._shadow_color) {
      renderOneViewSave (gl_view, alpha, 2);
    }
  
    if (sprite.user_program) {
      program = sprite.user_program;
      program.useIt ();
      
      if (program.configureParameters) {
        program.configureParameters (sprite, gl_view, style);
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
  attribute.buffer = vertices_buffer;

  attribute.numComponents = 3;
  program.attrib.position (attribute);
  
  if (!sprite.default_meshes) {

    gl_ctx.bindBuffer (gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer);
    gl_ctx.bufferData (
      gl_ctx.ELEMENT_ARRAY_BUFFER,
      sprite.triangle_faces,
      gl_ctx.STATIC_DRAW
    );
    
    default_faces_activated = false;
    
    var nb_faces = sprite.triangle_faces.length;
    if (mode !== 1 && rendering_mode === 1) {
      gl_ctx.drawElements (
        gl_ctx.LINES, nb_faces, gl_ctx.UNSIGNED_SHORT, 0
      );
    }
    else {
      gl_ctx.drawElements (
        gl_ctx.TRIANGLES, nb_faces, gl_ctx.UNSIGNED_SHORT, 0
      );
    }
  }
  else {
  
    if (!default_faces_activated) {
      // set default faces
      gl_ctx.bindBuffer (
        gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer
      );
      gl_ctx.bufferData (
        gl_ctx.ELEMENT_ARRAY_BUFFER,
        default_triangle_faces,
        gl_ctx.STATIC_DRAW);
    
      default_faces_activated = true;
    }
   
    if (mode !== 1 && rendering_mode === 1) {
      gl_ctx.drawElements (gl_ctx.LINE_LOOP, 4, gl_ctx.UNSIGNED_SHORT, 0);
    }
    else {
      gl_ctx.drawElements (
        gl_ctx.TRIANGLE_STRIP, 4, gl_ctx.UNSIGNED_SHORT, 0
      );
    }
  }
  
  previous_program = program;
}




function initRenteringBis (gl_ctx) {

  var color_id_array = new Float32Array ([0,0,0,0])
  var shadow_buffer = gl_ctx.createBuffer ();
  var shadow_vertices = new Float32Array (12);
  var rendering_mode = 0;  
    
  function update_gl_vertices (sprite, obj_pos, obj_size) {
    var
      x = 0,//obj_pos[0],
      y = 0,//obj_pos[1],
      w = obj_size [0],
      h = obj_size [1],
      m = sprite.mesh_vertices;
        
    // setup position vertices
    m[0] = x; m[1] = y; m[2] = 0;
    m[3] = x; m[4] = y + h; m[5] = 0;
    m[6] = x + w; m[7] = y; m[8] = 0;
    m[9] = x + w; m[10] = y + h; m[11] = 0;
  };

  function update_shadow_gl_vertices (obj_pos, obj_size, offset, blur) {
    var
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
  
  function bindToUnitTEXTURE0_4 (unit, sprite) {
    gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, sprite._frametexture);
  };
  
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

  function paintOneView (gl_view, alpha, mode) {

    var program;
    var sprite = SPRITES [gl_view.__gl_id];
    var vertices_buffer;

       
    // determine which vertices buffer to use
  // add update it if it's need.
    if (gl_view.__should_update_gl_vertices) {
      setupTextureFramebuffer (sprite, gl_view._size[0], gl_view._size[1])
      if (sprite.__update_gl_vertices) {
        sprite.__update_gl_vertices (sprite, gl_view._position, gl_view._size);

        gl_ctx.bindBuffer (
          gl_ctx.ARRAY_BUFFER,
          sprite.mesh_vertices_buffer
        );
        gl_ctx.bufferData (
          gl_ctx.ARRAY_BUFFER,
          sprite.mesh_vertices,
          gl_ctx.STATIC_DRAW
        );
      }
      else {
        update_gl_vertices (sprite, gl_view._position, gl_view._size);

        gl_ctx.bindBuffer (
          gl_ctx.ARRAY_BUFFER,
          sprite.mesh_vertices_buffer);
        gl_ctx.bufferData (
          gl_ctx.ARRAY_BUFFER,
          sprite.mesh_vertices,
          gl_ctx.STATIC_DRAW
        );
      }
      
      gl_view.__should_update_gl_vertices = false;
    }
    vertices_buffer = sprite.mesh_vertices_buffer;

    gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, sprite._framebuffer);
    gl_ctx.bindRenderbuffer (gl_ctx.RENDERBUFFER, sprite._renderbuffer);

    gl_ctx.framebufferTexture2D(gl_ctx.FRAMEBUFFER, gl_ctx.COLOR_ATTACHMENT0, gl_ctx.TEXTURE_2D, sprite._frametexture, 0);
    gl_ctx.framebufferRenderbuffer(gl_ctx.FRAMEBUFFER, gl_ctx.DEPTH_ATTACHMENT, gl_ctx.RENDERBUFFER, sprite._renderbuffer);
    
 //   gl_ctx.viewport (gl_view._position[0], gl_view._position[1], gl_view._size[0], gl_view._size[1]);
   
    gl_ctx.viewport (0, 0, gl_view._size[0], gl_view._size[1]);


    // General mode rendering
    {
      var style = gl_view.style, c_buffer;
      if (!style) {
        style = _default_style;
      }

      if (style && style._background_color) {
        c_buffer = style._background_color.__gl_array;
      }
      else {
        c_buffer = Color.default.__gl_array;
      }
    
      if (sprite.user_program) {
        program = sprite.user_program;
        program.useIt ();
        
        if (program.configureParameters) {
          program.configureParameters (sprite, gl_view, style);
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

    mat4.identity (tempMatrix)
    mat4.translate (tempMatrix, [-1,1,-600]);
    mat4.scale (tempMatrix, [2/ gl_view._size[0], -2/ gl_view._size[1], 1]);
    program.uniform.Vmatrix (tempMatrix);

    attribute.normalize = false;
    attribute.type = gl_ctx.FLOAT;
    attribute.stride = 0;
    attribute.offset = 0;
    attribute.buffer = vertices_buffer;

    attribute.numComponents = 3;
    program.attrib.position (attribute);
    
    if (!sprite.default_meshes) {

      gl_ctx.bindBuffer (gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer);
      gl_ctx.bufferData (
        gl_ctx.ELEMENT_ARRAY_BUFFER,
        sprite.triangle_faces,
        gl_ctx.STATIC_DRAW
      );
      
      default_faces_activated = false;
      
      var nb_faces = sprite.triangle_faces.length;
      if (rendering_mode === 1) {
        gl_ctx.drawElements (
          gl_ctx.LINES, nb_faces, gl_ctx.UNSIGNED_SHORT, 0
        );
      }
      else {
        gl_ctx.drawElements (
          gl_ctx.TRIANGLES, nb_faces, gl_ctx.UNSIGNED_SHORT, 0
        );
      }
    }
    else {
    
      if (!default_faces_activated) {
        // set default faces
        gl_ctx.bindBuffer (
          gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer
        );
        gl_ctx.bufferData (
          gl_ctx.ELEMENT_ARRAY_BUFFER,
          default_triangle_faces,
          gl_ctx.STATIC_DRAW);
      
        default_faces_activated = true;
      }
     
      if (rendering_mode === 1) {
        gl_ctx.drawElements (gl_ctx.LINE_LOOP, 4, gl_ctx.UNSIGNED_SHORT, 0);
      }
      else {
        gl_ctx.drawElements (
          gl_ctx.TRIANGLE_STRIP, 4, gl_ctx.UNSIGNED_SHORT, 0
        );
      }
    }
    gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, null);
    
    previous_program = program;
  }

  function drawOneView (gl_view, alpha, mode) {

    var program;
    var sprite = SPRITES [gl_view.__gl_id];
    var vertices_buffer;
           
    // determine which vertices buffer to use
    // add update it if it's need.
//    if (mode === 2) {
//      vertices_buffer = shadow_buffer;
//    }
//    else {
      vertices_buffer = sprite.mesh_vertices_buffer;
//    }
/*
    // Picking mode rendering
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
*/
/*
    // Shadow mode rendering
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
      update_shadow_gl_vertices (gl_view._position, gl_view._size, style._shadow_offset, style._shadow_blur);

      program.uniform.frame (
        new Float32Array ([
          shadow_vertices[0], shadow_vertices[9],
          shadow_vertices[1], shadow_vertices[10]
        ])
      );
    }
*/
    // General mode rendering
//    else {
//      var
//        style = gl_view.style,
//        c_buffer = Color.default.__gl_array;
      
//      if (style && style._shadow_color) {
//        drawOneView (gl_view, alpha, 2);
//      }
    
      program = drawShaderProgram;
      if (previous_program !== drawShaderProgram) {
        program.useIt ();
      }

      attribute.normalize = false;
      attribute.type = gl_ctx.FLOAT;
      attribute.stride = 0;
      attribute.offset = 0;

      attribute.buffer = draw_texture_uv_buffer;
      attribute.numComponents = 2;
      program.attrib.bkImageUV (attribute);

      texture1.bindToUnit = bindToUnitTEXTURE0_4;
      program.textures.uMainTexture (texture1, sprite);
//    }

    program.uniform.Mmatrix (sprite.m_matrix);
    program.uniform.uAlpha (alpha);

    attribute.normalize = false;
    attribute.type = gl_ctx.FLOAT;
    attribute.stride = 0;
    attribute.offset = 0;
    attribute.buffer = vertices_buffer;

    attribute.numComponents = 3;
    program.attrib.position (attribute);
        
      if (!default_faces_activated) {
        // set default faces
        gl_ctx.bindBuffer (
          gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer
        );
        gl_ctx.bufferData (
          gl_ctx.ELEMENT_ARRAY_BUFFER,
          default_triangle_faces,
          gl_ctx.STATIC_DRAW);
      
        default_faces_activated = true;
      }
     
      if (mode !== 1 && rendering_mode === 1) {
        gl_ctx.drawElements (gl_ctx.LINE_LOOP, 4, gl_ctx.UNSIGNED_SHORT, 0);
      }
      else {
        gl_ctx.drawElements (
          gl_ctx.TRIANGLE_STRIP, 4, gl_ctx.UNSIGNED_SHORT, 0
        );
      }
    
    previous_program = program;
  }

  function renderLayerGraph (frame_size, now, mode) {
    gl_ctx.viewport (
      0.0, 0.0,
      frame_size[0] * gl_device_pixel_ratio,
      frame_size[1] * gl_device_pixel_ratio
    );
          
    if (mode !== 1) for (var i = 0; i < gl_layer_graph_size; i++) {
      var entry = gl_layer_graph [i];
      if (entry[0] === 1) {
        // normal rendering
        paintOneView (entry[1], entry[2], mode);
      }
    }

    gl_ctx.viewport (
      -frame_size[0] * gl_device_pixel_ratio / 2,
      -frame_size[1] * gl_device_pixel_ratio / 2,
      frame_size[0] * gl_device_pixel_ratio,
      frame_size[1] * gl_device_pixel_ratio
    );
  
    gl_ctx.clear (gl_ctx.COLOR_BUFFER_BIT);

    for (var i = 0; i < gl_layer_graph_size; i++) {
      var entry = gl_layer_graph [i];
      if (entry[0] === 1) {
        // normal rendering
        drawOneView (entry[1], entry[2], mode);
      }
    }

    gl_ctx.flush ();
  }

  return renderLayerGraph;
}