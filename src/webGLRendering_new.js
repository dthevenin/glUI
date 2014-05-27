var
  shaderProgram, gl_ctx,
  glProjMatrix, jsProjMatrix,
  glViewMatrix, jsViewMatrix,
  glMoveMatrix,
  glPosition,
  glColor,
  object_vertices_buffer,
  object_colors_buffer,
  object_uv_buffer,
  object_bck_image_uv_buffer,
  object_faces_buffer,
  frame_size = [100, 100],
  gl_device_pixel_ratio;

//
// initShaders
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initShaders() {

  var shader_vertex_source="\n\
attribute vec3 position;\n\
attribute vec4 color; //the color of the point\n\
varying lowp vec4 vColor;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
attribute vec2 uv;\n\
attribute vec2 bkImageUV;\n\
varying vec2 vUV;\n\
varying vec2 vBkImageUV;\n\
void main(void) { //pre-built function\n\
  gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
  vColor=color;\n\
  vUV=uv;\n\
  vBkImageUV=bkImageUV;\n\
}";

  var shader_fragment_source="\n\
precision lowp float;\n\
varying lowp vec4 vColor;\n\
varying vec2 vUV;\n\
varying vec2 vBkImageUV;\n\
uniform sampler2D uBckTexture;\n\
uniform sampler2D uMainTexture;\n\
uniform lowp float uTextureFlag;\n\
uniform lowp float uAlpha;\n\
void main(void) {\n\
if(uTextureFlag == 1.0) {\n\
  if (vBkImageUV[0]<0.0 || vBkImageUV[1]<0.0 || vBkImageUV[0]>1.0 || vBkImageUV[1]>1.0) {\n\
    gl_FragColor = vColor;\n\
  } else {\n\
    vec4 bckTextureColor = texture2D(uBckTexture, vBkImageUV);\n\
    gl_FragColor = mix(vColor, bckTextureColor, bckTextureColor.a);\n\
    gl_FragColor.a = max(vColor.a, bckTextureColor.a);\n\
  }\n\
  gl_FragColor.a *= uAlpha;\n\
}\n\
else if(uTextureFlag == 2.0) {\n\
  vec4 mainTextureColor = texture2D(uMainTexture, vUV);\n\
  gl_FragColor = mix(vColor, mainTextureColor, mainTextureColor.a);\n\
  gl_FragColor.a = max(vColor.a, mainTextureColor.a) * uAlpha;\n\
}\n\
else if(uTextureFlag == 4.0) {\n\
  vec4 mainTextureColor = texture2D(uMainTexture, vUV);\n\
  gl_FragColor = mainTextureColor;\n\
  gl_FragColor.a *= uAlpha;\n\
}\n\
else if(uTextureFlag == 3.0) {\n\
  vec4 mainTextureColor = texture2D(uMainTexture, vUV);\n\
  vec4 tmpColor;\n\
  if (vBkImageUV[0]<0.0 || vBkImageUV[1]<0.0 || vBkImageUV[0]>1.0 || vBkImageUV[1]>1.0) {\n\
    tmpColor = vColor;\n\
  } else {\n\
    vec4 bckTextureColor = texture2D(uBckTexture, vBkImageUV);\n\
    tmpColor = mix(vColor, bckTextureColor, bckTextureColor.a);\n\
    tmpColor.a = max(vColor.a, bckTextureColor.a);\n\
  }\n\
  gl_FragColor = mix(tmpColor, mainTextureColor, mainTextureColor.a);\n\
  gl_FragColor.a = max(tmpColor.a, mainTextureColor.a) * uAlpha;\n\
}\n\
else {\n\
  gl_FragColor = vec4(vColor.rgb, vColor.a * uAlpha);\n\
}\n\
}";

    var get_shader = function (source, type, typeString) {
    var shader = gl_ctx.createShader (type);
    gl_ctx.shaderSource (shader, source);
    gl_ctx.compileShader (shader);
    if (!gl_ctx.getShaderParameter(shader, gl_ctx.COMPILE_STATUS)) {
      alert("ERROR IN "+typeString+ " SHADER : " + gl_ctx.getShaderInfoLog(shader));
      return false;
    }
    return shader;
  };
  
  var shader_vertex =
    get_shader (shader_vertex_source, gl_ctx.VERTEX_SHADER, "VERTEX");
  var shader_fragment =
    get_shader (shader_fragment_source, gl_ctx.FRAGMENT_SHADER, "FRAGMENT");
  
  shaderProgram = gl_ctx.createProgram ();
  gl_ctx.attachShader (shaderProgram, shader_vertex);
  gl_ctx.attachShader (shaderProgram, shader_fragment);
  
  gl_ctx.linkProgram (shaderProgram);
  // If creating the shader program failed, alert
  
  if (!gl_ctx.getProgramParameter (shaderProgram, gl_ctx.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }
  
  gl_ctx.useProgram(shaderProgram);
}

function initMainMatrix () {
  glProjMatrix = gl_ctx.getUniformLocation (shaderProgram, "Pmatrix");
  glViewMatrix = gl_ctx.getUniformLocation (shaderProgram, "Vmatrix");
  glMoveMatrix = gl_ctx.getUniformLocation (shaderProgram, "Mmatrix");

  jsProjMatrix = mat4.create ();
  mat4.identity (jsProjMatrix)
//  jsProjMatrix = LIBS.makePerspective (10, 1, 1, 10.0);
  gl_ctx.uniformMatrix4fv (glProjMatrix, false, jsProjMatrix);
  
  jsViewMatrix = mat4.create ();
  mat4.identity (jsViewMatrix)
  mat4.translate (jsViewMatrix, [-1,1,0]);
  mat4.scale (jsViewMatrix, [2/ frame_size[0], -2/ frame_size[1], 1]);
  
  gl_ctx.uniformMatrix4fv (glViewMatrix, false, jsViewMatrix);
}

function initBuffers () {

  /*========================= THE TRIANGLES ========================= */
  object_vertices_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, object_vertices_buffer);
  glPosition = gl_ctx.getAttribLocation (shaderProgram, "position");
  gl_ctx.enableVertexAttribArray (glPosition);
  gl_ctx.vertexAttribPointer (glPosition, 3, gl_ctx.FLOAT, false, 0, 0);

  /*========================= COLOR ========================= */
  object_colors_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, object_colors_buffer);
  glColor = gl_ctx.getAttribLocation (shaderProgram, "color");
  gl_ctx.enableVertexAttribArray (glColor);
  gl_ctx.vertexAttribPointer (glColor, 4, gl_ctx.FLOAT, false, 0, 0);

  /*========================= UV =========================*/
  object_uv_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, object_uv_buffer);
  var _uv = gl_ctx.getAttribLocation (shaderProgram, "uv");
  gl_ctx.enableVertexAttribArray (_uv);
  gl_ctx.vertexAttribPointer(_uv, 2, gl_ctx.FLOAT, false,0,0);

  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, object_uv_buffer);
  gl_ctx.bufferData (
    gl_ctx.ARRAY_BUFFER,
    new Float32Array ([0,1, 0,0, 1,1, 1,0]),
    gl_ctx.STATIC_DRAW
  );

  object_bck_image_uv_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, object_bck_image_uv_buffer);
  var _vBkImageUV = gl_ctx.getAttribLocation (shaderProgram, "bkImageUV");
  gl_ctx.enableVertexAttribArray (_vBkImageUV);
  gl_ctx.vertexAttribPointer(_vBkImageUV, 2, gl_ctx.FLOAT, false,0,0);

  gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, object_bck_image_uv_buffer);
  gl_ctx.bufferData (
    gl_ctx.ARRAY_BUFFER,
    new Float32Array ([0,1, 0,0, 1,1, 1,0]),
    gl_ctx.STATIC_DRAW
  );
    
  /*========================= TEXTURES =========================*/
  var _bkgTexture = gl_ctx.getUniformLocation (shaderProgram, "uBckTexture");
  gl_ctx.uniform1i (_bkgTexture, 0);
  
  var _mainTexture = gl_ctx.getUniformLocation (shaderProgram, "uMainTexture");
  gl_ctx.uniform1i (_mainTexture, 1);

  /*========================= FACES ========================= */
  object_faces_buffer = gl_ctx.createBuffer ();
  gl_ctx.bindBuffer(gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer);

  var triangle_faces = [0,1,2,3];
  gl_ctx.bindBuffer (gl_ctx.ELEMENT_ARRAY_BUFFER, object_faces_buffer);
  gl_ctx.bufferData (gl_ctx.ELEMENT_ARRAY_BUFFER,
                 new Uint16Array (triangle_faces),
                 gl_ctx.STATIC_DRAW);
}

var GL_CANVAS, stats;

function initWebGLRendering () {

  if (gl_ctx) return;
  
//   vs.util.importFile ("../../src/Stats.js", null, function () {
//     stats = Stats ();
//     document.body.appendChild (stats.domElement);
//     
//   }, "js");
  
  
  var canvas = GL_CANVAS = document.createElement ("canvas");
  frame_size = [window.innerWidth, window.innerHeight];
  gl_device_pixel_ratio = window.devicePixelRatio || 1;

  GL_CANVAS.style.width = frame_size [0] + "px";
  GL_CANVAS.style.hieght = frame_size [1] + "px";
  canvas.width = frame_size [0] * gl_device_pixel_ratio;
  canvas.height = frame_size [1] * gl_device_pixel_ratio;
  
  document.body.appendChild (canvas)
  
  try {
    gl_ctx = canvas.getContext (
      "experimental-webgl", {
        antialias: true,
        premultipliedAlpha: true,
        alpha: true
      }
    );
  } catch (e) {
    alert("You are not webgl compatible :(") ;
    return;
  }
  
  vs.ui.GLView.prototype.__gl_context = gl_ctx;

  /*========================= SHADERS ========================= */
  initShaders ();
  initMainMatrix ();
  initBuffers ();
  initPickBuffer ();

  /*========================= DRAWING ========================= */
  gl_ctx.clearColor (0.0, 0.0, 0.0, .0);
  gl_ctx.disable (gl_ctx.DEPTH_TEST);

 gl_ctx.enable (gl_ctx.BLEND);
//  gl_ctx.blendFunc (gl_ctx.SRC_ALPHA, gl_ctx.ONE_MINUS_SRC_ALPHA); //PAS MAL
//  gl_ctx.blendFunc (gl_ctx.SRC_ALPHA, gl_ctx.ONE_MINUS_CONSTANT_ALPHA);

// gl_ctx.blendFuncSeparate (
//   gl_ctx.SRC_COLOR, gl_ctx.DST_COLOR,
//   gl_ctx.ONE, gl_ctx.ONE
//   )
//gl_ctx.blendFunc (gl_ctx.ONE, gl_ctx.DST_ALPHA);

var gl = gl_ctx;

gl.blendEquation( gl.FUNC_ADD );
//gl.blendFunc( gl.SRC_ALPHA_SATURATE, gl.DST_COLOR );
//gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
gl.blendFunc( gl.ONE_MINUS_DST_ALPHA, gl.DST_ALPHA );


gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD );
//gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA );
//gl.blendFuncSeparate( gl.SRC_ALPHA, gl.DST_ALPHA, gl.ONE, gl.ONE );
//gl.blendFuncSeparate( gl.SRC_ALPHA_SATURATE, gl.ONE, gl.ONE, gl.ONE );
gl.blendFuncSeparate( gl.SRC_ALPHA_SATURATE, gl.DST_ALPHA, gl.ONE, gl.ONE );
gl.blendFuncSeparate( gl.ONE_MINUS_DST_ALPHA, gl.DST_ALPHA, gl.ONE, gl.ONE );
gl.blendFuncSeparate( gl.ONE_MINUS_DST_ALPHA, gl.DST_ALPHA, gl.ONE_MINUS_DST_COLOR, gl.ONE );
gl.blendFuncSeparate( gl.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE_MINUS_DST_COLOR, gl.ONE );
gl.blendFuncSeparate( gl.ONE_MINUS_DST_ALPHA, gl.DST_ALPHA, gl.SRC_COLOR, gl.ONE );

gl.blendColor (0,0,0,0);
  
  initDefaultColors ();
  initDefaultStyle ();

  vs.requestAnimationFrame (render);
}

var rendering = true;

function render () {
  var glTextureFlag = gl_ctx.getUniformLocation (shaderProgram, "uTextureFlag");
  var glAlpha = gl_ctx.getUniformLocation (shaderProgram, "uAlpha");
  
  function get_gl_opacity (view)
  {
    var parent, style, opacity = 1;
    
    style = view._style;
    if (style) opacity = style._opacity;
    parent = view.__parent;
    
    while (parent) {
      style = parent._style;
      if (style) opacity *= style._opacity;
      
      parent = parent.__parent;
    }

    return opacity;
  }

  var v1 = vec3.create ();
  var v2 = vec3.create ();
  var v3 = vec3.create ();
  var v4 = vec3.create ();
  var v_temp = vec3.create ();
    
  var gl_stack_for_renter = [1024], gl_stack_length = 0;
  for (var i = 0; i < 1024; i ++) {
    gl_stack_for_renter [i] = new Array (3);
  }
 
  function setupGLViews (now) {
    var apps = vs.Application_applications, key;
    gl_stack_length = 0;
    gl_views_index = 0;

    function _getGLViews (gl_view, p_transform, new_p_matrix, view_p) {
      var key, i, l, child, children;
      
      if (!gl_view._visible && !gl_view.__is_hidding) {
        return;
      }
      
      /*================= Update view matrixes ================= */ 
      var o_matrix = gl_view.__gl_matrix;
      var m_matrix = gl_view.__gl_m_matrix;
      var p_matrix = gl_view.__gl_p_matrix;
      var scroll_vec = gl_view.__gl_scroll;
      var p_size_vec = gl_view._size;
      
      gl_view.__gl_update_animation (now);
      
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
      var vertices = gl_view.__gl_vertices;

      vec3.set ([vertices[0], vertices[1], vertices[2]], v1);
      vec3.set ([vertices[3], vertices[4], vertices[5]], v2);
      vec3.set ([vertices[6], vertices[7], vertices[8]], v3);
      vec3.set ([vertices[9], vertices[10], vertices[11]], v4);

      mat4.multiplyVec3 (o_matrix, v1);
      mat4.multiplyVec3 (o_matrix, v2);
      mat4.multiplyVec3 (o_matrix, v3);
      mat4.multiplyVec3 (o_matrix, v4);

      if ((v1[0]>view_p[2] && v2[0]>view_p[2] &&
           v3[0]>view_p[2] && v4[0]>view_p[2]) ||
          (v1[0]<view_p[0] && v2[0]<view_p[0] &&
           v3[0]<view_p[0] && v4[0]<view_p[0]) ||
          (v1[1]>view_p[3] && v2[1]>view_p[3] &&
           v3[1]>view_p[3] && v4[1]>view_p[3]) || 
          (v1[1]<view_p[1] && v2[1]<view_p[1] &&
           v3[1]<view_p[1] && v4[1]<view_p[1])) { 
        return;
      }
      
      var new_view_p = [];
      if (scroll_vec) {
        vec3.subtract ([0,0,0], scroll_vec, v_temp);
        new_view_p[0] = v_temp[0];
        new_view_p[1] = v_temp[1];
        
        vec3.subtract ([p_size_vec [0], p_size_vec [1], 0], scroll_vec, v_temp);       
        new_view_p[2] = v_temp [0];
        new_view_p[3] = v_temp [1];
      }
      else 
      {
        new_view_p[0] = 0;
        new_view_p[1] = 0;
        new_view_p[2] = p_size_vec [0];
        new_view_p[3] = p_size_vec [1];
      }

      
      // End culling algorithm
      
      if (true) {
      
      children = gl_view.__children;
      l = children.length;
      var has_gl_child = false;
       while (l--) {
         child = children [l];
         if (child.__gl_object) {
//           if (!has_gl_child) {
//             entry = gl_stack_for_renter [gl_views_index++];
//             entry [0] = 2; // parent view for clipping
//             entry [1] = gl_view;
//           }
//           has_gl_child = true;
          _getGLViews (child, p_matrix, new_p_matrix, new_view_p);
        }
      }

      var entry = gl_stack_for_renter [gl_views_index++];
      entry [0] = 1; // normal view to render
      entry [1] = gl_view;
      
      }
      else {

      var entry = gl_stack_for_renter [gl_views_index++];
      entry [0] = 1; // normal view to render
      entry [1] = gl_view;


      children = gl_view.__children;
      l = children.length;
      var has_gl_child = false;
      for (i = 0; i < l; i++) {
         child = children [i];
         if (child.__gl_object) {
//           if (!has_gl_child) {
//             entry = gl_stack_for_renter [gl_views_index++];
//             entry [0] = 2; // parent view for clipping
//             entry [1] = gl_view;
//           }
//           has_gl_child = true;
          _getGLViews (child, p_matrix, new_p_matrix, new_view_p);
        }
      }
      }

    }
  
    for (key in apps) {
      var app = apps[key];
      _getGLViews (app, null, false, [0,0,frame_size[0], frame_size[1]]);
    }
    
    gl_stack_length = gl_views_index;
  }

  var color_id_array = new Float32Array ([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
    
  function calculateColorsFromGLID (gl_id) {
    var r = 0, g = 0, b = 0, a = 1;
    
    r = (gl_id % 255) / 255;
    gl_id = Math.floor (gl_id / 255);
    g = (gl_id % 255) / 255 * 5;
    gl_id = Math.floor (gl_id / 255);
    b = (gl_id % 255) / 255 * 5;
 
    color_id_array [0] = color_id_array [4] = color_id_array [8] = color_id_array [12] = r;
    color_id_array [1] = color_id_array [5] = color_id_array [9] = color_id_array [13] = g;
    color_id_array [2] = color_id_array [6] = color_id_array [10] = color_id_array [14] = b;
    color_id_array [3] = color_id_array [7] = color_id_array [11] = color_id_array [15] = a;
  }
  
  function renderOneView (gl_view, mode) {

    var alpha = get_gl_opacity (gl_view);
    if (alpha === 0) return;
       
    gl_ctx.uniformMatrix4fv (glMoveMatrix, false, gl_view.__gl_m_matrix);
 
//    gl_ctx.enableVertexAttribArray (glPosition);
//    gl_ctx.enableVertexAttribArray (glColor);

//    gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, gl_view.__gl_vertices_buffer);
//    gl_ctx.vertexAttribPointer (glPosition, 3, gl_ctx.FLOAT, false, 0, 0);

    // Bind position vertices
    gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, object_vertices_buffer);
    gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, gl_view.__gl_vertices, gl_ctx.STATIC_DRAW);

    if (mode === 1) {
      calculateColorsFromGLID (gl_view.__gl_id);
      gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, object_colors_buffer);
      gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, color_id_array, gl_ctx.STATIC_DRAW);

      gl_ctx.uniform1f (glAlpha, 1);
      gl_ctx.uniform1f (glTextureFlag, 0.0);
    }
    else {
      var style = gl_view.style, c_buffer;
      if (!style) {
        style = _default_style;
      }

      if (style && style._background_color) {
//        c_buffer = style._background_color.__gl_vertices_buffer;
        c_buffer = style._background_color.__gl_array;
      }
      else {
//        c_buffer = GLColor.default.__gl_vertices_buffer;
        c_buffer = GLColor.default.__gl_array;
      }

      // Bind background color vertices
//      gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, c_buffer);
//      gl_ctx.vertexAttribPointer (glColor, 4, gl_ctx.FLOAT, false, 0, 0);
      gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, object_colors_buffer);
      gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, c_buffer, gl_ctx.STATIC_DRAW);
      
//      var gl_texture = gl_view.__gl_image_texture || gl_view.__gl_texture
      var gl_texture = gl_view.__gl_texture

      gl_ctx.uniform1f (glAlpha, alpha);
      if (gl_view.__gl_image_texture) {
        gl_ctx.uniform1f (glTextureFlag, 4.0);
        gl_ctx.activeTexture (gl_ctx.TEXTURE1);
        gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, gl_view.__gl_image_texture);
      }
      else if (gl_texture && style.__gl_texture_bck_image) {
        gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, object_bck_image_uv_buffer);
        gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, style._background_image_uv, gl_ctx.STATIC_DRAW);

        gl_ctx.uniform1f (glTextureFlag, 3.0);
        gl_ctx.activeTexture (gl_ctx.TEXTURE0);
        gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, style.__gl_texture_bck_image);
        gl_ctx.activeTexture (gl_ctx.TEXTURE1);
        gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, gl_texture);
      }
      else if (gl_texture) {
        gl_ctx.uniform1f (glTextureFlag, 2.0);
        gl_ctx.activeTexture (gl_ctx.TEXTURE1);
        gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, gl_texture);
      }
      else if (style.__gl_texture_bck_image) {
        gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, object_bck_image_uv_buffer);
        gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, style._background_image_uv, gl_ctx.STATIC_DRAW);

        gl_ctx.uniform1f (glTextureFlag, 1.0);
        gl_ctx.activeTexture (gl_ctx.TEXTURE0);
        gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, style.__gl_texture_bck_image);
      }
      else {
        gl_ctx.uniform1f (glTextureFlag, 0.0);
      }
    }

    gl_ctx.drawElements(gl_ctx.TRIANGLE_STRIP, 4, gl_ctx.UNSIGNED_SHORT, 0);
  }

  var animate = window.render_ui = function (mode) {
    if (!rendering) {
      vs.requestAnimationFrame (animate);
      return
    }
    if (stats) stats.begin ();

    var now = Date.now ();
    setupGLViews (now);
    
 //   console.log (gl_stack_length);
      
    if (gl_stack_length) {
    
      gl_ctx.viewport (
        0.0, 0.0,
        frame_size[0] * gl_device_pixel_ratio,
        frame_size[1] * gl_device_pixel_ratio
      );
    
      gl_ctx.clear (gl_ctx.COLOR_BUFFER_BIT | gl_ctx.DEPTH_BUFFER_BIT);
      
      for (var l = 0; l < gl_stack_length; l++) {
        var entry = gl_stack_for_renter [l];
        if (entry[0] === 1) {
          // normal rendering
          renderOneView (entry[1], mode);
        }
        else if (entry[0] === 2) {
          // normal rendering
 //         clippingOneView (entry[1], mode);
        }
      }

      gl_ctx.flush();
    }
    if (mode !== 1) vs.requestAnimationFrame (animate);
//    if (mode !== 1) vs.scheduleAction(animate, 200);

    if (stats) stats.end ();
  }
  
  animate ();
//  vs.scheduleAction(animate, 100);
}

var rttFramebuffer;
var rttTexture;

function initPickBuffer() 
{
  rttFramebuffer = gl_ctx.createFramebuffer();
  gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, rttFramebuffer);
  rttFramebuffer.width = frame_size [0] * gl_device_pixel_ratio;
  rttFramebuffer.height = frame_size [1] * gl_device_pixel_ratio;

  rttTexture = gl_ctx.createTexture();




  gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, rttTexture);
  gl_ctx.texImage2D(gl_ctx.TEXTURE_2D, 0, gl_ctx.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, gl_ctx.RGBA, gl_ctx.UNSIGNED_BYTE, null);

  function isPowerOfTwo (x) {
    return (x !== 0) && ((x & (x - 1)) === 0);
  }

  gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, rttTexture);
  gl_ctx.texImage2D (gl_ctx.TEXTURE_2D, 0, gl_ctx.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, gl_ctx.RGBA, gl_ctx.UNSIGNED_BYTE, null);

  // POT images
  if (isPowerOfTwo (frame_size [0] * gl_device_pixel_ratio) &&
      isPowerOfTwo (frame_size [1] * gl_device_pixel_ratio)) {
  
    gl_ctx.texParameteri
      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MAG_FILTER, gl_ctx.LINEAR);
    
    gl_ctx.texParameteri
      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.NEAREST_MIPMAP_LINEAR);

    gl_ctx.generateMipmap (gl_ctx.TEXTURE_2D);
  }
  // NPOT images
  else {
    //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
    gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.LINEAR);
    //Prevents s-coordinate wrapping (repeating).
    gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_S, gl_ctx.CLAMP_TO_EDGE);
    //Prevents t-coordinate wrapping (repeating).
    gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_T, gl_ctx.CLAMP_TO_EDGE);
  }


//   gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, rttTexture);
//   gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MAG_FILTER, gl_ctx.LINEAR);
//   gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.LINEAR_MIPMAP_NEAREST);
//   gl_ctx.generateMipmap(gl_ctx.TEXTURE_2D);
// 
//   gl_ctx.texImage2D(gl_ctx.TEXTURE_2D, 0, gl_ctx.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, gl_ctx.RGBA, gl_ctx.UNSIGNED_BYTE, null);

  var renderbuffer = gl_ctx.createRenderbuffer();
  gl_ctx.bindRenderbuffer(gl_ctx.RENDERBUFFER, renderbuffer);
  gl_ctx.renderbufferStorage(gl_ctx.RENDERBUFFER, gl_ctx.DEPTH_COMPONENT16, rttFramebuffer.width, rttFramebuffer.height);

  gl_ctx.framebufferTexture2D(gl_ctx.FRAMEBUFFER, gl_ctx.COLOR_ATTACHMENT0, gl_ctx.TEXTURE_2D, rttTexture, 0);
  gl_ctx.framebufferRenderbuffer(gl_ctx.FRAMEBUFFER, gl_ctx.DEPTH_ATTACHMENT, gl_ctx.RENDERBUFFER, renderbuffer);

  gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, null);
  gl_ctx.bindRenderbuffer(gl_ctx.RENDERBUFFER, null);
  gl_ctx.bindFramebuffer(gl_ctx.FRAMEBUFFER, null);
}

function pickUp (event) {
  if (!window.render_ui) return;
  
  if (!event) return;
  
  var x = event.clientX;
  var y = event.clientY;
  
  if (vs.util.isUndefined (x) || vs.util.isUndefined (y)) {
    var list = event.targetPointerList;
    if (!list) list = event.targetTouches;
    if (!list) list = event.touches;
    
    if (!list || list.length === 0) return;
    
    var touch = list[0];
    x = touch.clientX;
    y = touch.clientY;
  }
  
  return _pickUp (x * gl_device_pixel_ratio, y * gl_device_pixel_ratio);
}

var pickUp_pixelColor = new Uint8Array(4);
function _pickUp (x, y) {
  
  DropTick = 1;

  gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, rttFramebuffer);

  // Clear GL Surface
  gl_ctx.clearColor(0.0, 0.0, 0.0, 0.0);

  render_ui (1);
  
  y = frame_size[1] * gl_device_pixel_ratio - y;

  // Read Pixel Color
  gl_ctx.readPixels(x, y,1,1,gl_ctx.RGBA,gl_ctx.UNSIGNED_BYTE, pickUp_pixelColor);
                  
  // Return GL Clear To User Colors
  gl_ctx.clearColor (0.0, 0.0, 0.0, 0.0);
        
  gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, null);
  
  function getGLIDfromColor (pickUp_pixelColor) {
    return pickUp_pixelColor [0] + pickUp_pixelColor [1] + pickUp_pixelColor [2];
  }
  var gl_id = getGLIDfromColor (pickUp_pixelColor)

  return GL_VIEWS [gl_id];
}

var __pointer_start_activated = 0;
function __gl_activate_pointer_start () {
  if (__pointer_start_activated === 0) {
    vs.addPointerListener (GL_CANVAS, vs.POINTER_START, pointer_start);
  }
  __pointer_start_activated ++;
}

function __gl_deactivate_pointer_start () {
  if (__pointer_start_activated === 0) return;
  if (__pointer_start_activated === 1) {
    vs.removePointerListener (GL_CANVAS, vs.POINTER_START, pointer_start);
  }
  
  __pointer_start_activated --;
}

var __pointer_move_activated = 0;
function __gl_activate_pointer_move () {
  if (__pointer_move_activated === 0) {
    vs.addPointerListener (GL_CANVAS, vs.POINTER_MOVE, pointer_move);
  }
  __pointer_move_activated ++;
}

function __gl_deactivate_pointer_move () {
  if (__pointer_move_activated === 0) return;
  if (__pointer_move_activated === 1) {
    vs.removePointerListener (GL_CANVAS, vs.POINTER_MOVE, pointer_move);
  }
  
  __pointer_move_activated --;
}

var __pointer_end_activated = 0;
function __gl_activate_pointer_end () {
  if (__pointer_end_activated === 0) {
    vs.addPointerListener (GL_CANVAS, vs.POINTER_END, pointer_end);
  }
  __pointer_end_activated ++;
}

function __gl_deactivate_pointer_end () {
  if (__pointer_end_activated === 0) return;
  if (__pointer_end_activated === 1) {
    vs.removePointerListener (GL_CANVAS, vs.POINTER_END, pointer_end);
  }
  
  __pointer_end_activated --;
}

function getObject (obj, event_type) {
  if (!obj) return;
  
  if (obj[event_type] && obj[event_type].length) return obj;
  return getObject (obj.__parent, event_type)
}

function pointer_start (event) {
  var obj = getObject (pickUp (event), "_pointer_start");
  if (obj) {
    event.target = obj;
    obj._pointer_start.forEach (function (handler) {
      if (vs.util.isFunction (handler)) {
        handler.call (event.src, event);
      }
      else if (vs.util.isFunction (handler.handleEvent)) {
        handler.handleEvent.call (handler, event);
      }
    });
  }
}

function pointer_move (event) {
  var obj = getObject (pickUp (event), "_pointer_move");
  if (obj) {
    event.target = obj;
    obj._pointer_move.forEach (function (handler) {
      if (vs.util.isFunction (handler)) {
        handler.call (event.src, event);
      }
      else if (vs.util.isFunction (handler.handleEvent)) {
        handler.handleEvent.call (handler, event);
      }
    });
  }
}
function pointer_end (event) {
  var obj = getObject (pickUp (event), "_pointer_end");
  if (obj) {
    event.target = obj;
    obj._pointer_end.forEach (function (handler) {
      if (vs.util.isFunction (handler)) {
        handler.call (event.src, event);
      }
      else if (vs.util.isFunction (handler.handleEvent)) {
        handler.handleEvent.call (handler, event);
      }
    });
  }
}