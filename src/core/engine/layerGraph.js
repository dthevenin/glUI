
var gl_layer_graph_size = 0;
var gl_layer_graph = [1024];
var gl_boundaries_stack = [256];
var v_temp = vec3.create ();

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
    tx = gl_view._transform_origin [0],// + pos [0],
    ty = gl_view._transform_origin [1];// + pos [1];
    
  // apply current transformation
  mat4.identity (matrix);
  mat4.translateXYZ (matrix, tx + trans[0] + pos [0], ty + trans[1] + pos [1], trans[2]);

  if (rot[0]) mat4.rotateX (matrix, rot[0] * angle2rad);
  if (rot[1]) mat4.rotateY (matrix, rot[1] * angle2rad);
  if (rot[2]) mat4.rotateZ (matrix, rot[2] * angle2rad);
  
  mat4.scaleXY (matrix, gl_view._scaling);
  mat4.translateXYZ (matrix, -tx, -ty, 0);

  /*====================================================== */
  // Update vertices vectors for the culling algorithm
  update_envelop_vertices (sprite, size);

  gl_view.__invalid_matrixes = true;
  View.__should_render = true;
  
  gl_view.__should_update_gl_matrix = false;
}

/**
 * Update vertices vectors for the culling algorithm
 * @protected
 * @function
 */
function update_envelop_vertices (sprite, obj_size) {
  var
    matrix = sprite.matrix,
    w = obj_size [0],
    h = obj_size [1];
    
  mat4.multiplyXYZToVec3 (matrix, 0, 0, 0, sprite.vertex_1);
  mat4.multiplyXYZToVec3 (matrix, 0, h, 0, sprite.vertex_2);
  mat4.multiplyXYZToVec3 (matrix, w, 0, 0, sprite.vertex_3);
  mat4.multiplyXYZToVec3 (matrix, w, h, 0, sprite.vertex_4);
} 

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
  else {
    boundaries[0] = 0;
    boundaries[1] = 0;
    boundaries[2] = p_size_vec [0];
    boundaries[3] = p_size_vec [1];
  }
  
  return true;
}

//calculateViewsInFrustum
function calculateLayerGraph (now) {
  var apps = Application_applications, key;
  gl_layer_graph_size = 0;
  var gl_views_index = 0;

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
      //      mat4.translate (m_matrix, gl_view._position, p_matrix);
      mat4.set (m_matrix, p_matrix);
    
      if (scroll_vec) {
        gl_view.__gl_update_scroll (now);
        mat4.translate (p_matrix, scroll_vec);
      }
      new_p_matrix = true;
    }
    gl_view.__invalid_matrixes = false;
    
    /*================= Culling allgorithm ================= */
    if (!isInFrustum (sprite, level, p_size_vec, scroll_vec)) return;
    
    /*================= Manage shadow sprite ================= */

    if (style && style._shadow_color) {
      entry = gl_layer_graph [gl_views_index++];
      entry [0] = 2; // shadow view
      entry [1] = sprite;
      entry [2] = gl_view;
      entry [3] = alpha;
    }

    /*================= add view to the layer graph ================= */

    var entry = gl_layer_graph [gl_views_index++];
    entry [0] = 1; // normal view to render
    entry [1] = sprite;
    entry [2] = gl_view;
    entry [3] = alpha;
    
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
  
  gl_layer_graph_size = gl_views_index;
}

function initLayerGraph () {

  for (var i = 0; i < 1024; i ++) {
    gl_layer_graph [i] = new Array (3);
    // [0] - rendering type
    // [1] - sprite
    // [2] - view to render / style
    // [3] - alpha
  }
  
  for (var i = 0; i < 256; i ++) {
    gl_boundaries_stack [i] = new util.glMatrixArrayType (4);
  }
}

