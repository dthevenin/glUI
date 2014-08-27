var _profiling;

function getLayerGraphRendered (gl_ctx) {

  var color_id_array = new Float32Array ([0,0,0,0])
  var shadow_buffer = gl_ctx.createBuffer ();
  var shadow_vertices = new Float32Array (8);
  glEngine.renderingMode = 0;



  var toto_buffer = gl_ctx.createBuffer ();
  var toto_vertices = new Float32Array (12);
  var m = toto_vertices, w = 1, h = 1;
  m[0] = 0; m[1] = 0; m[2] = 0;
  m[3] = 0; m[4] = h; m[5] = 0;
  m[6] = w; m[7] = 0; m[8] = 0;
  m[9] = w; m[10] = h; m[11] = 0;
  
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, toto_buffer);
  gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, m, gl_ctx.STATIC_DRAW);
    
  function update_gl_vertices (sprite, obj_size) {
    var
      w = obj_size [0],
      h = obj_size [1],
      m = sprite.mesh_vertices;
        
    // setup position vertices
    m[0] = 0; m[1] = 0;
    m[2] = 0; m[3] = h;
    m[4] = w; m[5] = 0;
    m[6] = w; m[7] = h;
  };
  

  function update_shadow_gl_vertices (obj_size, offset, blur) {
    var
      x = offset [0] - blur,
      y = offset [1] - blur,
      w = obj_size [0] + 2 * blur,
      h = obj_size [1] + 2 * blur,
      m = shadow_vertices;
        
    // setup position vertices
    m[0] = x; m[1] = y;
    m[2] = x; m[3] = y + h;
    m[4] = x + w; m[5] = y;
    m[6] = x + w; m[7] = y + h;
  
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
  
  function bindToUnitFRAME_TEXTURE (unit, sprite) {
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
  
  function bindToUnitTEXTURE_bck_image (unit, style) {
    gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, style.__texture_bck_image);
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
      if (gl_view.__should_update_texture) {
        renderingTexture.updateSpriteSize (sprite, gl_view._size[0], gl_view._size[1])
        gl_view.__should_update_texture = false;
      }
      if (sprite.__update_gl_vertices) {
        sprite.__update_gl_vertices (sprite, gl_view._position, gl_view._size);

        gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, sprite.mesh_vertices_buffer);
        gl_ctx.bufferData (
          gl_ctx.ARRAY_BUFFER,
          sprite.mesh_vertices,
          gl_ctx.STATIC_DRAW
        );
      }
      else {
        update_gl_vertices (sprite, gl_view._size);

        gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, sprite.mesh_vertices_buffer);
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

    gl_ctx.framebufferTexture2D (
      gl_ctx.FRAMEBUFFER,
      gl_ctx.COLOR_ATTACHMENT0,
      gl_ctx.TEXTURE_2D,
      sprite._frametexture,
      0
    );

    gl_ctx.framebufferRenderbuffer (
      gl_ctx.FRAMEBUFFER,
      gl_ctx.DEPTH_ATTACHMENT,
      gl_ctx.RENDERBUFFER,
      sprite._renderbuffer
    );
    
    viewport = sprite.__view_port;    
    gl_ctx.viewport (viewport [0], viewport [1], viewport [2], viewport [3]);

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
    else if (sprite.texture && style.__texture_bck_image) {
      program = twoTexturesShaderProgram;
      if (previous_program !== twoTexturesShaderProgram) {
        program.useIt ();
      }
 
      attribute.normalize = false;
      attribute.type = gl_ctx.FLOAT;
      attribute.stride = 0;
      attribute.offset = 0;

      // first texture
      attribute.buffer = object_uv_buffer;
      attribute.numComponents = 2;
      program.attrib.text_uv_1 (attribute);

      texture1.bindToUnit = bindToUnitTEXTURE0_1;
      program.textures.texture_1 (texture1, sprite);
      
      // second texture
      attribute.buffer = object_bck_image_uv_buffer;
      attribute.numComponents = 2;
      program.attrib.text_uv_2 (attribute);
      gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, style._background_image_uv, gl_ctx.STATIC_DRAW);

      texture2.bindToUnit = bindToUnitTEXTURE_bck_image;
      program.textures.texture_2 (texture2, style);

      // color background
      program.uniform.color (c_buffer);
    }
    else if (sprite.image_texture) {
      program = oneTextureShaderProgram;
      if (previous_program !== oneTextureShaderProgram) {
        program.useIt ();
      }

      attribute.normalize = false;
      attribute.type = gl_ctx.FLOAT;
      attribute.stride = 0;
      attribute.offset = 0;

      // first texture
      attribute.buffer = object_uv_buffer;
      attribute.numComponents = 2;
      program.attrib.text_uv_1 (attribute);

      texture1.bindToUnit = bindToUnitTEXTURE0_2;
      program.textures.texture_1 (texture1, sprite);

      // color background
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

      // first texture
      attribute.buffer = default_object_bck_image_uv_buffer;
      attribute.numComponents = 2;
      program.attrib.text_uv_1 (attribute);

      texture1.bindToUnit = bindToUnitTEXTURE0_1;
      program.textures.texture_1 (texture1, sprite);

      // color background
      program.uniform.color (c_buffer);
    }
    else if (style.__texture_bck_image) {
      program = oneTextureShaderProgram;
      if (previous_program !== oneTextureShaderProgram) {
        program.useIt ();
      }

      attribute.normalize = false;
      attribute.type = gl_ctx.FLOAT;
      attribute.stride = 0;
      attribute.offset = 0;

      // first texture
      attribute.buffer = object_bck_image_uv_buffer;
      attribute.numComponents = 2;
      program.attrib.text_uv_1 (attribute);
      gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, style._background_image_uv, gl_ctx.STATIC_DRAW);

      texture1.bindToUnit = bindToUnitTEXTURE_bck_image;
      program.textures.texture_1 (texture1, style);

      // color background
      program.uniform.color (c_buffer);
    }
    else {
      program = basicShaderProgram;
      if (previous_program !== basicShaderProgram) {
        program.useIt ();
      }

      program.uniform.color (c_buffer);
    }
    
    // set the ratio vector for the projection matrix.
    // this x,y ratio values are packed into a 32bit float.
    // The shader will upacked these values and create
    // the orthogonal projection matrix
    program.uniform.ratio (gl_view._size[0] + (gl_view._size[1] << 16));
    
    attribute.normalize = false;
    attribute.type = gl_ctx.FLOAT;
    attribute.stride = 0;
    attribute.offset = 0;
    attribute.buffer = vertices_buffer;

    attribute.numComponents = 2;
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
      if (glEngine.renderingMode === 1) {
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
     
      if (glEngine.renderingMode === 1) {
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
  var previous_alpha = 0;
  var attr_bkImageUV_loc, attr_position_loc;
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
//      vertices_buffer = toto_buffer;
    }

    // Picking mode rendering
    if (mode === 1) {

      program = pickupShaderProgram;
      if (previous_program !== pickupShaderProgram) {
        program.useIt ();
        // attrib localisation
        attr_position_loc = program.attribLoc.position;
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
        // and force alpha
        program.uniform.uAlpha (alpha);
        previous_alpha = alpha;
        // attrib localisation
        attr_position_loc = program.attribLoc.position;
      }
      program.uniform.color (style._shadow_color.__gl_array);
      if (style._shadow_blur) {
        program.uniform.blur (1.75 * style._shadow_blur);
      }
      else {
        program.uniform.blur (0.001);
      }
      update_shadow_gl_vertices (gl_view._size, style._shadow_offset, style._shadow_blur);

      if (previous_alpha !== alpha) {
        program.uniform.uAlpha (alpha);
        previous_alpha = alpha;
      }
    
      program.uniform.frame (
        new Float32Array ([
          shadow_vertices[0], shadow_vertices[6],
          shadow_vertices[1], shadow_vertices[7]
        ])
      );
    }

    // General mode rendering
    else {
      
      program = drawShaderProgram;
      if (previous_program !== drawShaderProgram) {
        program.useIt ();
        // and force alpha
        program.uniform.uAlpha (alpha);
        previous_alpha = alpha;
        // attrib localisation
        attr_bkImageUV_loc = program.attribLoc.text_uv;
        attr_position_loc = program.attribLoc.position;
      }

      // Set attribute texture projection
      gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, sprite.__texture_uv_buffer);
      gl_ctx.vertexAttribPointer (attr_bkImageUV_loc, 2, gl_ctx.FLOAT, false, 0, 0);
 
      // set alpha if its changed
      if (previous_alpha !== alpha) {
        program.uniform.uAlpha (alpha);
        previous_alpha = alpha;
      }

      // Set main texture from to get the paint object
      if (previous_rendering_texture !== sprite._frametexture) {
        texture1.bindToUnit = bindToUnitFRAME_TEXTURE;
        program.textures.texture (texture1, sprite);
        
        previous_rendering_texture = sprite._frametexture;
      }
    }

    // Set object position matrix
    program.uniform.Mmatrix (sprite.m_matrix);
    
    // Set attribute vertices
    gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, vertices_buffer);
    gl_ctx.vertexAttribPointer (attr_position_loc, 2, gl_ctx.FLOAT,false, 0, 0);

    // set up the faces
    if (!default_faces_activated) {
      // set default faces
      gl_ctx.bindBuffer (gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer);
      gl_ctx.bufferData (
        gl_ctx.ELEMENT_ARRAY_BUFFER,
        default_triangle_faces,
        gl_ctx.STATIC_DRAW);
    
      default_faces_activated = true;
    }
   
    if (mode !== 1 && glEngine.renderingMode === 1) {
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
      glEngine.need_repaint = false;

      // set the viewport to default one
      gl_ctx.viewport (
        0,
        0,
        frame_size[0] * gl_device_pixel_ratio,
        frame_size[1] * gl_device_pixel_ratio
      );
    }

    // if profiling, force an intermediary flush and finish
    if (_profiling && _profiling.collect) {
      gl_ctx.flush ();
      gl_ctx.finish ();
      _profiling.end (PAINT_PROB_ID);
    }

    if (_profiling && _profiling.collect) _profiling.begin (DRAW_PROB_ID);

    if (mode === 1 || glEngine.need_redraw || glEngine.forced_redraw) {

      gl_ctx.clear (gl_ctx.COLOR_BUFFER_BIT);
      
      previous_rendering_texture = null;
 
      // Enable all of the vertex attribute arrays (position and texture)
      gl_ctx.enableVertexAttribArray (0);
      gl_ctx.enableVertexAttribArray (1);
      
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
      glEngine.need_redraw = false;
    }
    
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