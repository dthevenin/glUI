// import { gl_device_pixel_ratio, default_triangle_faces, imageShaderProgram } from "../engineInit";
// import { Color } from "./Color";
// import { Sprite, setupTextureFramebuffer, SPRITES } from "../sprite";
// import { mat4 } from "gl-matrix";
// import { GLEngineProgram, AttribParam } from "../GLProgram";
// import { _default_style } from "../Style";

// var _profiling;

// function getLayerGraphRendered(gl_ctx: WebGLRenderingContext) {

//   const color_id_array = new Float32Array([0,0,0,0])
//   const shadow_buffer: WebGLBuffer = gl_ctx.createBuffer();
//   const shadow_vertices = new Float32Array(12);
//   let rendering_mode = 0;  
    
//   function update_gl_vertices(sprite: Sprite, obj_pos: number[], objSize: number[]): void  {
//     const x = 0,//obj_pos[0];
//     const y = 0,//obj_pos[1];
//     const w = objSize[0];
//     const h = objSize[1];
//     const m = sprite.mesh_vertices;
        
//     // setup position vertices
//     m[0] = x; m[1] = y; m[2] = 0;
//     m[3] = x; m[4] = y + h; m[5] = 0;
//     m[6] = x + w; m[7] = y; m[8] = 0;
//     m[9] = x + w; m[10] = y + h; m[11] = 0;
//   };

//   function update_shadow_gl_vertices(objSize: number[], offset: number[], blur: number): void  {
//     const x = offset[0] - blur;
//     const y = offset[1] - blur;
//     const w = objSize[0] + 2 * blur;
//     const h = objSize[1] + 2 * blur;
//     const m = shadow_vertices;
        
//     // setup position vertices
//     m[0] = x; m[1] = y; m[2] = 0;
//     m[3] = x; m[4] = y + h; m[5] = 0;
//     m[6] = x + w; m[7] = y; m[8] = 0;
//     m[9] = x + w; m[10] = y + h; m[11] = 0;
  
//     gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, shadow_buffer);
//     gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, m, gl_ctx.STATIC_DRAW);
//   };

//   function calculateColorsFromGLID(gl_id: number): void {
//     var r = 0, g = 0, b = 0, a = 1;
    
//     r = (gl_id % 256) / 255;
//     gl_id = (gl_id / 255) | 0;
//     g = (gl_id % 256) / 255;
//     gl_id = (gl_id / 255) | 0;
//     b = (gl_id % 256) / 255;
 
//     color_id_array[0] = r;
//     color_id_array[1] = g;
//     color_id_array[2] = b;
//     color_id_array[3] = a;
//   }
  
//   let defaultFacesActivated = false;
//   let previousprogram: WebGLShader;
//   let attribute: AttribParam = {}, texture1: AttribParam = {}, texture2: AttribParam = {};
  
//   function bindToUnitTEXTURE0_4(unit: number, sprite: Sprite): void {
//     gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
//     gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, sprite._frametexture);
//   };
  
//   function bindToUnitTEXTURE0_1(unit: number, sprite: Sprite): void {
//     gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
//     gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, sprite.texture);
//   };
  
//   function bindToUnitTEXTURE0_2 (unit: number, sprite: Sprite): void {
//     gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
//     gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, sprite.image_texture);
//   };
  
//   function bindToUnitTEXTURE0_3 (unit, style) {
//     gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
//     gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, style.__gl_texture_bck_image);
//   };

//   function paintOneView (gl_view, alpha: number, mode) {

//     let program: WebGLShader;
//     const sprite = SPRITES[gl_view.__gl_id];
//     let vertices_buffer;

//     // determine which vertices buffer to use
//     // add update it if it's need.
//     if (gl_view.__should_update_gl_vertices) {

//       setupTextureFramebuffer(sprite, gl_view._size[0], gl_view._size[1])
//       if (sprite.__update_gl_vertices) {
//         sprite.__update_gl_vertices(sprite, gl_view._position, gl_view._size);

//         gl_ctx.bindBuffer (
//           gl_ctx.ARRAY_BUFFER,
//           sprite.mesh_vertices_buffer
//         );
//         gl_ctx.bufferData (
//           gl_ctx.ARRAY_BUFFER,
//           sprite.mesh_vertices,
//           gl_ctx.STATIC_DRAW
//         );
//       }
//       else {
//         update_gl_vertices (sprite, gl_view._position, gl_view._size);

//         gl_ctx.bindBuffer (
//           gl_ctx.ARRAY_BUFFER,
//           sprite.mesh_vertices_buffer);
//         gl_ctx.bufferData (
//           gl_ctx.ARRAY_BUFFER,
//           sprite.mesh_vertices,
//           gl_ctx.STATIC_DRAW
//         );
//       }
      
//       gl_view.__should_update_gl_vertices = false;
//     }
//     vertices_buffer = sprite.mesh_vertices_buffer;

//     gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, sprite._framebuffer);
//     gl_ctx.bindRenderbuffer (gl_ctx.RENDERBUFFER, sprite._renderbuffer);

//     gl_ctx.framebufferTexture2D(gl_ctx.FRAMEBUFFER, gl_ctx.COLOR_ATTACHMENT0, gl_ctx.TEXTURE_2D, sprite._frametexture, 0);
//     gl_ctx.framebufferRenderbuffer(gl_ctx.FRAMEBUFFER, gl_ctx.DEPTH_ATTACHMENT, gl_ctx.RENDERBUFFER, sprite._renderbuffer);
       
//     gl_ctx.viewport (
//       0, 0,
//       gl_view._size[0] * gl_device_pixel_ratio,
//       gl_view._size[1] * gl_device_pixel_ratio
//     );

//     // General mode rendering
//     {
//       var style = gl_view.style, c_buffer;
//       if (!style) {
//         style = _default_style;
//       }

//       if (style && style._background_color) {
//         c_buffer = style._background_color.__gl_array;
//       }
//       else {
//         c_buffer = Color.default.__gl_array;
//       }
    
//       let program: GLEngineProgram;
//       if (sprite.user_program) {
//         program = sprite.user_program;
//         program.useIt ();
        
//         if (program.configureParameters) {
//           program.configureParameters (sprite, gl_view, style);
//         }
//       }
//       else if (sprite.image_texture) {
//         program = imageShaderProgram;
//         if (previousprogram !== imageShaderProgram) {
//           program.useIt();
        
//           attribute.normalize = false;
//           attribute.type = gl_ctx.FLOAT;
//           attribute.stride = 0;
//           attribute.offset = 0;

//           attribute.buffer = object_uv_buffer;
//           attribute.numComponents = 2;
//           program.attrib.uv(attribute);
//         }

//         texture1.bindToUnit = bindToUnitTEXTURE0_2;
//         program.textures.uMainTexture(texture1, sprite);
//       }
//       else if (sprite.texture && style.__gl_texture_bck_image) {
//         program = twoTexturesShaderProgram;
//         if (previousprogram !== twoTexturesShaderProgram) {
//           program.useIt ();
        
//           attribute.normalize = false;
//           attribute.type = gl_ctx.FLOAT;
//           attribute.stride = 0;
//           attribute.offset = 0;

//           attribute.buffer = object_uv_buffer;
//           attribute.numComponents = 2;
//           program.attrib.uv (attribute);
//         }

//         texture1.bindToUnit = bindToUnitTEXTURE0_1;
//         program.textures.uMainTexture(texture1, sprite);
      
//         attribute.buffer = object_bck_image_uv_buffer;
//         attribute.numComponents = 2;
//         program.attrib.bkImageUV (attribute);
//         gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, style._background_image_uv, gl_ctx.STATIC_DRAW);

//         texture2.bindToUnit = bindToUnitTEXTURE0_3;
//         program.textures.uBckTexture (texture2, style);

//         program.uniform.color (c_buffer);
//       }
//       else if (sprite.texture) {
//         program = oneTextureShaderProgram;
//         if (previousprogram !== oneTextureShaderProgram) {
//           program.useIt ();
//         }

//         attribute.normalize = false;
//         attribute.type = gl_ctx.FLOAT;
//         attribute.stride = 0;
//         attribute.offset = 0;

//         attribute.buffer = default_object_bck_image_uv_buffer;
//         attribute.numComponents = 2;
//         program.attrib.bkImageUV (attribute);

//         program.uniform.color (c_buffer);

//         texture1.bindToUnit = bindToUnitTEXTURE0_1;
//         program.textures.uMainTexture(texture1, sprite);
//       }
//       else if (style.__gl_texture_bck_image) {
//         program = oneTextureShaderProgram;
//         if (previousprogram !== oneTextureShaderProgram) {
//           program.useIt ();
//         }

//         attribute.normalize = false;
//         attribute.type = gl_ctx.FLOAT;
//         attribute.stride = 0;
//         attribute.offset = 0;

//         attribute.buffer = object_bck_image_uv_buffer;
//         attribute.numComponents = 2;
//         program.attrib.bkImageUV (attribute);
//         gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, style._background_image_uv, gl_ctx.STATIC_DRAW);

//         program.uniform.color (c_buffer);

//         texture1.bindToUnit = bindToUnitTEXTURE0_3;
//         program.textures.uMainTexture(texture1, style);
//       }
//       else
//       {
//         program = basicShaderProgram;
//         if (previousprogram !== basicShaderProgram) {
//           program.useIt ();
//         }

//         program.uniform.color (c_buffer);
//       }
//     }

//     mat4.identity (orthoProjectionMatrix);
//     mat4.translate (orthoProjectionMatrix,[-1,1,0]);
//     mat4.scale (orthoProjectionMatrix,[2/ gl_view._size[0], -2/ gl_view._size[1], 1]);
//     program.uniform.Pmatrix (orthoProjectionMatrix);

//     attribute.normalize = false;
//     attribute.type = gl_ctx.FLOAT;
//     attribute.stride = 0;
//     attribute.offset = 0;
//     attribute.buffer = vertices_buffer;

//     attribute.numComponents = 3;
//     program.attrib.position (attribute);
    
//     if (!sprite.default_meshes) {

//       gl_ctx.bindBuffer (gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer);
//       gl_ctx.bufferData (
//         gl_ctx.ELEMENT_ARRAY_BUFFER,
//         sprite.triangle_faces,
//         gl_ctx.STATIC_DRAW
//       );
      
//       defaultFacesActivated = false;
      
//       var nb_faces = sprite.triangle_faces.length;
//       if (rendering_mode === 1) {
//         gl_ctx.drawElements (
//           gl_ctx.LINES, nb_faces, gl_ctx.UNSIGNED_SHORT, 0
//         );
//       }
//       else {
//         gl_ctx.drawElements (
//           gl_ctx.TRIANGLES, nb_faces, gl_ctx.UNSIGNED_SHORT, 0
//         );
//       }
//     }
//     else {
    
//       if (!defaultFacesActivated) {
//         // set default faces
//         gl_ctx.bindBuffer (
//           gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer
//         );
//         gl_ctx.bufferData (
//           gl_ctx.ELEMENT_ARRAY_BUFFER,
//           default_triangle_faces,
//           gl_ctx.STATIC_DRAW);
      
//         defaultFacesActivated = true;
//       }
     
//       if (rendering_mode === 1) {
//         gl_ctx.drawElements (gl_ctx.LINE_LOOP, 4, gl_ctx.UNSIGNED_SHORT, 0);
//       }
//       else {
//         gl_ctx.drawElements (
//           gl_ctx.TRIANGLE_STRIP, 4, gl_ctx.UNSIGNED_SHORT, 0
//         );
//       }
//     }
//     gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, null);
    
//     previousprogram = program;
//   }

//   function drawOneView (sprite, alpha, mode, gl_view) {

//     var program;
//     var vertices_buffer;
           
//     // determine which vertices buffer to use
//     // add update it if it's need.
//     if (mode === 2) {
//       vertices_buffer = shadow_buffer;
//     }
//     else {
//       vertices_buffer = sprite.mesh_vertices_buffer;
//     }

//     // Picking mode rendering
//     if (mode === 1) {

//       program = pickupShaderProgram;
//       if (previousprogram !== pickupShaderProgram) {
//         program.useIt ();
//       }

//       // calculate the color ID
//       calculateColorsFromGLID (sprite.id);

//       program.uniform.color (color_id_array);
//     }

//     // Shadow sprite rendering
//     else if (mode === 2) {
      
//       var style = gl_view.style;

//       program = drawShadowShaderProgram;
//       if (previousprogram !== drawShadowShaderProgram) {
//         program.useIt ();
//       }
//       program.uniform.color (style._shadow_color.__gl_array);
//       if (style._shadow_blur) {
//         program.uniform.blur (1.75 * style._shadow_blur);
//       }
//       else {
//         program.uniform.blur (0.001);
//       }
//       update_shadow_gl_vertices (gl_view._size, style._shadow_offset, style._shadow_blur);

//       program.uniform.frame (
//         new Float32Array ([
//           shadow_vertices[0], shadow_vertices[9],
//           shadow_vertices[1], shadow_vertices[10]
//         ])
//       );
      
//       program.uniform.uAlpha (alpha);
//     }

//     // General mode rendering
//     else {
//       program = drawShaderProgram;
//       if (previousprogram !== drawShaderProgram) {
//         program.useIt ();
//       }

//       attribute.normalize = false;
//       attribute.type = gl_ctx.FLOAT;
//       attribute.stride = 0;
//       attribute.offset = 0;

//       attribute.buffer = draw_texture_uv_buffer;
//       attribute.numComponents = 2;
//       program.attrib.bkImageUV (attribute);

//       texture1.bindToUnit = bindToUnitTEXTURE0_4;
//       program.textures.uMainTexture(texture1, sprite);
      
//       program.uniform.uAlpha (alpha);
//     }

//     program.uniform.Mmatrix (sprite.m_matrix);

//     attribute.normalize = false;
//     attribute.type = gl_ctx.FLOAT;
//     attribute.stride = 0;
//     attribute.offset = 0;
//     attribute.buffer = vertices_buffer;

//     attribute.numComponents = 3;
//     program.attrib.position (attribute);
        
//     if (!defaultFacesActivated) {
//       // set default faces
//       gl_ctx.bindBuffer (
//         gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer
//       );
//       gl_ctx.bufferData (
//         gl_ctx.ELEMENT_ARRAY_BUFFER,
//         default_triangle_faces,
//         gl_ctx.STATIC_DRAW);
    
//       defaultFacesActivated = true;
//     }
   
//     if (mode !== 1 && rendering_mode === 1) {
//       gl_ctx.drawElements (gl_ctx.LINE_LOOP, 4, gl_ctx.UNSIGNED_SHORT, 0);
//     }
//     else {
//       gl_ctx.drawElements (
//         gl_ctx.TRIANGLE_STRIP, 4, gl_ctx.UNSIGNED_SHORT, 0
//       );
//     }

//     previousprogram = program;
//   }
  
//   var
//     PAINT_PROB_ID = getProfilingProbeId ("paint"),
//     DRAW_PROB_ID = getProfilingProbeId ("draw");

//   function renderLayerGraph (frame_size, now, mode) {
//     gl_ctx.viewport (
//       0.0, 0.0,
//       frame_size[0] * gl_device_pixel_ratio,
//       frame_size[1] * gl_device_pixel_ratio
//     );
    
//     if (_profiling && _profiling.collect) _profiling.begin (PAINT_PROB_ID);
          
//     if (mode !== 1) for (var i = 0; i < gl_layer_graph_size; i++) {
//       var entry = gl_layer_graph[i];
//       if (entry[0] === 1) {
//         // normal rendering
//         paintOneView (entry[2], entry[3], mode);
//       }
//     }

//     // if profiling, force an intermediary flush and finish
//     if (_profiling && _profiling.collect) {
//       gl_ctx.flush ();
//       gl_ctx.finish ();
//       _profiling.end (PAINT_PROB_ID);
//     }

//     gl_ctx.viewport (
//       0,
//       0,
//       frame_size[0] * gl_device_pixel_ratio,
//       frame_size[1] * gl_device_pixel_ratio
//     );
  
//     gl_ctx.clear (gl_ctx.COLOR_BUFFER_BIT);

//     if (_profiling && _profiling.collect) _profiling.begin (DRAW_PROB_ID);

//     for (var i = 0; i < gl_layer_graph_size; i++) {
//       var entry = gl_layer_graph[i];
//       if (entry[0] === 1) {
//         // normal rendering
//         drawOneView (entry[1], entry[3], mode);
//       }
//       else if (mode !== 1 && entry[0] === 2) {
//         // normal rendering
//         drawOneView (entry[1], entry[3], 2, entry[2]);
//       }
//     }
    
//     // if profiling, force a finish with the flush
//     if (_profiling && _profiling.collect) {
//       gl_ctx.flush ();
//       gl_ctx.finish ();
//       _profiling.end (DRAW_PROB_ID);
//     }
    
//     // normal flush
//     else gl_ctx.flush ();
//   }

//   return renderLayerGraph;
// }