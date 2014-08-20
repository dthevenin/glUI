var _profiling;

function getLayerGraphRendered (gl_ctx) {

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

  function update_shadow_gl_vertices (obj_size, offset, blur) {
    var
      x = offset [0] - blur,
      y = offset [1] - blur,
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

  var previous_framebuffer = null;
  var previous_renderbuffer = null;
  function paintOneView (gl_view, alpha, mode) {

    var program;
    var viewport;
    var sprite = SPRITES [gl_view.__gl_id];
    var vertices_buffer;
       
    // determine which vertices buffer to use
    // add update it if it's need.
    if (gl_view.__should_update_gl_vertices) {

      renderingTexture.setupSprite (sprite, gl_view._size[0], gl_view._size[1])
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
    
    if (previous_framebuffer !== sprite._framebuffer) {
      if (previous_framebuffer) {
        gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, null);
      }
      gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, sprite._framebuffer);
      previous_framebuffer = sprite._framebuffer
    }

    if (previous_renderbuffer !== sprite._renderbuffer) {
      if (previous_renderbuffer) {
        gl_ctx.bindRenderbuffer (gl_ctx.RENDERBUFFER, null);
      }
      gl_ctx.bindRenderbuffer (gl_ctx.RENDERBUFFER, sprite._renderbuffer);
      previous_renderbuffer = sprite._renderbuffer
    }

    gl_ctx.framebufferTexture2D(gl_ctx.FRAMEBUFFER, gl_ctx.COLOR_ATTACHMENT0, gl_ctx.TEXTURE_2D, sprite._frametexture, 0);
    gl_ctx.framebufferRenderbuffer(gl_ctx.FRAMEBUFFER, gl_ctx.DEPTH_ATTACHMENT, gl_ctx.RENDERBUFFER, sprite._renderbuffer);
    
    viewport = sprite.__view_port;    
    gl_ctx.viewport (viewport [0], viewport [1], viewport [2], viewport [3]);

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

    mat4.identity (orthoProjectionMatrix);
    mat4.translate (orthoProjectionMatrix, [-1,1,0]);
    mat4.scale (orthoProjectionMatrix, [2/ gl_view._size[0], -2/ gl_view._size[1], 1]);
    program.uniform.Pmatrix (orthoProjectionMatrix);

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
    
    previous_program = program;
  }

  var previous_rendering_texture = null;
  function drawOneView (sprite, alpha, mode, gl_view) {

    var program;
    var vertices_buffer;
           
    // determine which vertices buffer to use
    // add update it if it's need.
    if (mode === 2) {
      vertices_buffer = shadow_buffer;
    }
    else {
      vertices_buffer = sprite.mesh_vertices_buffer;
    }

    // Picking mode rendering
    if (mode === 1) {

      program = pickupShaderProgram;
      if (previous_program !== pickupShaderProgram) {
        program.useIt ();
      }

      // calculate the color ID
      calculateColorsFromGLID (sprite.id);

      program.uniform.color (color_id_array);
    }

    // Shadow sprite rendering
    else if (mode === 2) {
      
      var style = gl_view.style;

      program = drawShadowShaderProgram;
      if (previous_program !== drawShadowShaderProgram) {
        program.useIt ();
      }
      program.uniform.color (style._shadow_color.__gl_array);
      if (style._shadow_blur) {
        program.uniform.blur (1.75 * style._shadow_blur);
      }
      else {
        program.uniform.blur (0.001);
      }
      update_shadow_gl_vertices (gl_view._size, style._shadow_offset, style._shadow_blur);

      program.uniform.frame (
        new Float32Array ([
          shadow_vertices[0], shadow_vertices[9],
          shadow_vertices[1], shadow_vertices[10]
        ])
      );
      
      program.uniform.uAlpha (alpha);
    }

    // General mode rendering
    else {
      
      program = drawShaderProgram;
      if (previous_program !== drawShaderProgram) {
        program.useIt ();
      }

      attribute.normalize = false;
      attribute.type = gl_ctx.FLOAT;
      attribute.stride = 0;
      attribute.offset = 0;
      
      attribute.buffer = sprite.__texture_uv_buffer;
      attribute.numComponents = 2;
      program.attrib.bkImageUV (attribute);

      if (previous_rendering_texture !== sprite._frametexture) {
        texture1.bindToUnit = bindToUnitTEXTURE0_4;
        program.textures.uMainTexture (texture1, sprite);
        
        previous_rendering_texture = sprite._frametexture;
      }
      
      program.uniform.uAlpha (alpha);
    }

    program.uniform.Mmatrix (sprite.m_matrix);

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
  
  var
    PAINT_PROB_ID = getProfilingProbeId ("paint"),
    DRAW_PROB_ID = getProfilingProbeId ("draw");

  function renderLayerGraph (frame_size, now, mode) {
    gl_ctx.viewport (
      0.0, 0.0,
      frame_size[0] * gl_device_pixel_ratio,
      frame_size[1] * gl_device_pixel_ratio
    );
    
    if (_profiling && _profiling.collect) _profiling.begin (PAINT_PROB_ID);
    
    // repaint process (only if no picking)  
    if (mode !== 1 && (glEngine.need_repaint || glEngine.forced_repaint)) {
      for (var i = 0; i < gl_layer_graph_size; i++) {
        var entry = gl_layer_graph [i];
        if (entry[0] === 1) {
          var
            sprite = entry [1],
            gl_view = entry [2],
            alpha = entry [3];
            
          // normal rendering
          if (glEngine.forced_repaint || sprite.invalid_paint) {
            paintOneView (gl_view, alpha, mode);
            sprite.invalid_paint = false;
          }
        }
      }

      if (previous_framebuffer) {
        gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, null);
        previous_framebuffer = null;
      }

      if (previous_renderbuffer) {
        gl_ctx.bindRenderbuffer (gl_ctx.RENDERBUFFER, null);
        previous_renderbuffer = null;
      }
    }
    glEngine.need_repaint = false;

    // if profiling, force an intermediary flush and finish
    if (_profiling && _profiling.collect) {
      gl_ctx.flush ();
      gl_ctx.finish ();
      _profiling.end (PAINT_PROB_ID);
    }

    gl_ctx.viewport (
      0,
      0,
      frame_size[0] * gl_device_pixel_ratio,
      frame_size[1] * gl_device_pixel_ratio
    );

    if (_profiling && _profiling.collect) _profiling.begin (DRAW_PROB_ID);

    if (mode === 1 || glEngine.need_redraw || glEngine.forced_redraw) {
      gl_ctx.clear (gl_ctx.COLOR_BUFFER_BIT);
      
      previous_rendering_texture = null;
      
      for (var i = 0; i < gl_layer_graph_size; i++) {
        var entry = gl_layer_graph [i];
        
        // normal sprite rendering
        if (entry[0] === 1) {  
          drawOneView (entry[1], entry[3], mode);
        }
        
        // shadow object rendering (not render for picking)
        else if (mode !== 1 && entry[0] === 2) {
          drawOneView (entry[1], entry[3], 2, entry[2]);
        }
      }
    }
    glEngine.need_redraw = false;
    
    // if profiling, force a finish with the flush
    if (_profiling && _profiling.collect) {
      gl_ctx.flush ();
      gl_ctx.finish ();
      _profiling.end (DRAW_PROB_ID);
    }
    
    // normal flush
    else gl_ctx.flush ();
  }

  return renderLayerGraph;
}