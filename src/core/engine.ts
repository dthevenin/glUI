import { BaseView } from "./view/View";
import { mat4, vec3, vec4, vec2 } from "gl-matrix";
import { gl_device_pixel_ratio, gl_ctx, frame_size, shadowShaderProgram } from "./engineInit";
import { Sprite, SPRITES } from "./sprite";
import { Style } from "./Style";
import { GLEngineProgram, AttribParam } from "./GLProgram";
import { View, Group } from "./view";
import { Color } from ".";

var _profiling;

export function getGLContext(): WebGLRenderingContext {
  return gl_ctx;
}

function update_gl_vertices(sprite: Sprite, obj_pos: vec3, obj_size: vec2): void  {
  const
    x = obj_pos[0],
    y = obj_pos[1],
    w = obj_size[0],
    h = obj_size[1],
    m = sprite.mesh_vertices;

    // setup position vertices
  m[0] = x; m[1] = y; m[2] = 0;
  m[3] = x; m[4] = y + h; m[5] = 0;
  m[6] = x + w; m[7] = y; m[8] = 0;
  m[9] = x + w; m[10] = y + h; m[11] = 0;
};

function update_shadow_gl_vertices (obj_pos: vec3, obj_size: vec2, offset: vec2, blur: number): void {
//  blur = 0
  const
    x = obj_pos[0] + offset[0] - blur,
    y = obj_pos[1] + offset[1] - blur,
    w = obj_size[0] + 2 * blur,
    h = obj_size[1] + 2 * blur,
    m = shadow_vertices;

    // setup position vertices
  m[0] = x; m[1] = y; m[2] = 0;
  m[3] = x; m[4] = y + h; m[5] = 0;
  m[6] = x + w; m[7] = y; m[8] = 0;
  m[9] = x + w; m[10] = y + h; m[11] = 0;
  
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, shadow_buffer);
  gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, m, gl_ctx.STATIC_DRAW);
};

const angle2rad = Math.PI / 180;

/**
 * @protected
 * @function
 */
function update_transform_gl_matrix(gl_view: View | Group, sprite: Sprite): void 
{
  const
    matrix = sprite.matrix,
    pos = gl_view._position,
    size = gl_view._size,
    rot = gl_view._rotation,
    trans = gl_view._translation,
    tx = gl_view._transform_origin[0] + pos[0],
    ty = gl_view._transform_origin[1] + pos[1];
    
  // apply current transformation
  mat4.identity(matrix);
  mat4.translate(matrix, matrix, [tx + trans[0], ty + trans[1], trans[2]]);

  if (rot[0]) mat4.rotateX(matrix, matrix, rot[0] * angle2rad);
  if (rot[1]) mat4.rotateY(matrix, matrix, rot[1] * angle2rad);
  if (rot[2]) mat4.rotateZ(matrix, matrix, rot[2] * angle2rad);
  
  mat4.scale(matrix, matrix, [gl_view.scaling, gl_view.scaling, 0]);
  mat4.translate(matrix, matrix, [-tx, -ty, 0]);

  /*====================================================== */
  // Update vertices vectors for the culling algorithm
  update_envelop_vertices (sprite, pos, size);

  gl_view.__invalid_matrixes = true;
  BaseView.__should_render = true;
  
  gl_view.__should_update_gl_matrix = false;
}

const multiplyXYZToVec3 = function (mat: mat4, x: number, y: number, z: number, dest: vec3) {
  dest[0] = mat[0] * x + mat[4] * y + mat[8] * z + mat[12];
  dest[1] = mat[1] * x + mat[5] * y + mat[9] * z + mat[13];
  dest[2] = mat[2] * x + mat[6] * y + mat[10] * z + mat[14];
};

/**
 * Update vertices vectors for the culling algorithm
 * @protected
 * @function
 */
function update_envelop_vertices(sprite: Sprite, obj_pos: vec3, obj_size: vec2): void 
{
  var
    matrix = sprite.matrix,
    x = obj_pos[0],
    y = obj_pos[1],
    z = obj_pos[2],
    w = obj_size[0],
    h = obj_size[1];

  multiplyXYZToVec3(matrix, x    , y    , z, sprite.vertex_1);
  multiplyXYZToVec3(matrix, x    , y + h, z, sprite.vertex_2);
  multiplyXYZToVec3(matrix, x + w, y    , z, sprite.vertex_3);
  multiplyXYZToVec3(matrix, x + w, y + h, z, sprite.vertex_4);
} 

var gl_stack_length = 0;
var gl_stack_for_renter: vec3[];
var gl_boundaries_stack: vec4[];
var v_temp = vec3.create ();

function isInFrustum(sprite: Sprite, level: number, p_size_vec: vec2, scroll_vec?: vec3): boolean  {
  // Update matrixes
  var
    boundaries = gl_boundaries_stack[level],
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
  boundaries = gl_boundaries_stack[level+1];
  if (scroll_vec) {
    vec3.subtract(v_temp, [0,0,0], scroll_vec);
    boundaries[0] = v_temp[0];
    boundaries[1] = v_temp[1];
    
    vec3.subtract(v_temp, [p_size_vec[0], p_size_vec[1], 0], scroll_vec);
    boundaries[2] = v_temp[0];
    boundaries[3] = v_temp[1];
  } else {
    boundaries[0] = 0;
    boundaries[1] = 0;
    boundaries[2] = p_size_vec[0];
    boundaries[3] = p_size_vec[1];
  }
  
  return true;
}

function calculateViewsInFrustum(now: number): void  {
  var apps = Application_applications, key;
  gl_stack_length = 0;
  var gl_views_index = 0;

  function _calculateViewsInFrustum(gl_view, p_transform, new_p_matrix, p_alpha: number, level: number) {
    var key, i, l, child, children, style, alpha, sprite;
    
    // Views visibility
    if (!gl_view._visible && !gl_view.__is_hidding) {
      return;
    }
    
    sprite = SPRITES[gl_view.__gl_id];
    
    // animate view
    gl_update_animation(gl_view, now);

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
    const o_matrix = sprite.matrix;
    const m_matrix = sprite.m_matrix;
    const p_matrix = sprite.p_matrix;
    const p_size_vec = gl_view._size;
    const scroll_vec = gl_view.__gl_scroll;
          
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
    
    var entry = gl_stack_for_renter[gl_views_index++];
    entry[0] = 1; // normal view to render
    entry[1] = gl_view;
    entry[2] = alpha;
     // End culling algorithm

    /*================== Manage children ================== */
    children = gl_view.__children;
    l = children.length;
    for (i = 0; i < l; i++) {
      child = children[i];
      if (child.__gl_id) {
        _calculateViewsInFrustum (child, p_matrix, new_p_matrix, alpha, level + 1);
      }
    }
  }

  const boundaries: vec4 = gl_boundaries_stack[0];
  boundaries[0] = 0;
  boundaries[1] = 0;
  boundaries[2] = frame_size[0];
  boundaries[3] = frame_size[1];

  for (key in apps) {
    var app = apps[key];
    _calculateViewsInFrustum (app, null, false, 1, 0);
  }
  
  gl_stack_length = gl_views_index;
}

export let render_ui: (now: number, mode?: number) => void;

let shadow_buffer: WebGLBuffer;
var shadow_vertices = new Float32Array (12);

var rendering_mode = 0;

export function initRendering () {
  
  if (shadow_buffer) {
    gl_ctx.deleteBuffer(shadow_buffer); 
  }
  shadow_buffer = gl_ctx.createBuffer ();

  for (let i = 0; i < 1024; i ++) {
    gl_stack_for_renter[i] = vec3.create();
    //[0] - rendering type
    //[1] - view to render
    //[2] - alpha
  }
  
  for (var i = 0; i < 256; i ++) {
    gl_boundaries_stack[i] = vec4.create();
  }

  const color_id_array = vec4.create();
    
  function calculateColorsFromGLID(gl_id: number): void {
    var r = 0, g = 0, b = 0, a = 1;
    
    r = (gl_id % 256) / 255;
    gl_id = (gl_id / 255) | 0;
    g = (gl_id % 256) / 255;
    gl_id = (gl_id / 255) | 0;
    b = (gl_id % 256) / 255;
 
    color_id_array[0] = r;
    color_id_array[1] = g;
    color_id_array[2] = b;
    color_id_array[3] = a;
  }
  
  let default_faces_activated = false;
  let previous_program: GLEngineProgram = null;
  let attribute: AttribParam = {}, texture1: AttribParam = {}, texture2: AttribParam = {};
  
  function bindToUnitTEXTURE0_1(unit: number, sprite: Sprite): void {
    gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, sprite.texture);
  };
  
  function bindToUnitTEXTURE0_2(unit: number, sprite: Sprite): void {
    gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, sprite.image_texture);
  };
  
  function bindToUnitTEXTURE0_3(unit: number, style: Style): void {
    gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
    gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, style.__gl_texture_bck_image);
  };

  function renderOneView(gl_view: BaseView, alpha: number, mode: number) {

    var program;
    var sprite = SPRITES[gl_view.__gl_id];
    var vertices_buffer;
       
       
    // determine which vertices buffer to use
    // add update it if it's need.
    if (mode === 2) {
      vertices_buffer = shadow_buffer;
    }
    else {
      if (gl_view.__should_update_gl_vertices) {
        if (sprite.__update_gl_vertices) {
          sprite.__update_gl_vertices(sprite, gl_view._position, gl_view._size);

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
        renderOneView (gl_view, alpha, 2);
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

  render_ui = function (now: number, mode?: number = 0) {

    if (mode !== 1 && !BaseView.__should_render && !View.__nb_animation) {
      next_rendering_id = requestAnimationFrame (render_ui);
      return
    }

    calculateViewsInFrustum (now);
    BaseView.__should_render = false;
      
    if (gl_stack_length) {
    
      gl_ctx.viewport (
        0.0, 0.0,
        frame_size[0] * gl_device_pixel_ratio,
        frame_size[1] * gl_device_pixel_ratio
      );
    
      gl_ctx.clear (gl_ctx.COLOR_BUFFER_BIT);

      for (var i = 0; i < gl_stack_length; i++) {
        const entry: vec3 = gl_stack_for_renter[i];
        if (entry[0] === 1) {
          // normal rendering
          renderOneView(entry[1], entry[2], mode);
        }
      }

      gl_ctx.flush ();
    }
    
    if (mode !== 1) {
      next_rendering_id = requestAnimationFrame(render_ui);
    }
  }
  
  next_rendering_id = requestAnimationFrame(render_ui);
}

