var GLMap = vs.core.createClass ({

  /** parent class */
  parent: vs.ui.GLImage,
  _pourcentage : 0,

  initComponent : function () {
    this._super ();
    this.__gl_user_program = GLMap__program;
  },
  
  __update_gl_vertices : function () {
    var
      obj_size = this._size,
      obj_pos = this._position,
      x = obj_pos[0],
      y = obj_pos[1],
      w = obj_size [0],
      h = obj_size [1];
    
  
    if (this.__gl_user_vertices) {
      delete (this.__gl_user_vertices);
    }
    if (this.__gl_user_triangle_faces) {
      delete (this.__gl_user_triangle_faces);
    }
    if (this.__gl_user_texture_mapping) {
      delete (this.__gl_user_texture_mapping);
    }
    
    this.__gl_user_vertices = makeMesh (GLMap__resolution, x, y, w, h);
    this.__gl_user_triangle_faces = makeTriangles (GLMap__resolution);
    this.__gl_user_texture_mapping = makeTextureProjection (GLMap__resolution);

    gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, this.__gl_vertices_buffer);
    gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, this.__gl_user_vertices, gl_ctx.STATIC_DRAW);
  },

  update_vectices : function (pourcentage) {
    this._pourcentage = pourcentage;
  }
});

var GLMap__image_vertex_shader = "\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
uniform float posx;\n\
uniform float tick;\n\
uniform float resolution;\n\
uniform float width;\n\
attribute vec2 uv;\n\
varying vec2 vUV;\n\
const float fold = 20.0;\n\
const float PI = 3.1415;\n\
const float degToRad = PI / 180.0;\n\
void main(void) {\n\
  float phi = degToRad * 90.0;\n\
  vec3 pos = position;\n\
  \n\
  float step = (pos.x - posx) / width;\n\
  pos.z = cos(mod(step * resolution, 4.0) * (3.0 * PI / 2.0)) * tick * fold;\n\
  \n\
  float ox = width * -tick * 0.9 / 2.0;\n\
  pos.x = pos.x - step * (tick * 0.9) * width - ox;\n\
  \n\
  gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(pos, 1.);\n\
  vUV=uv;\n\
}";

var GLMap__image_shader_fragment = "\n\
precision lowp float;\n\
varying vec2 vUV;\n\
uniform sampler2D uMainTexture;\n\
uniform vec4 color;\n\
uniform float uAlpha;\n\
varying highp vec3 vLighting;\n\
void main(void) {\n\
  vec4 mainTextureColor = texture2D(uMainTexture, vUV);\n\
  gl_FragColor = vec4(mainTextureColor.rgb, mainTextureColor.a);\n\
  gl_FragColor.a *= uAlpha;\n\
}";

var GLMap__resolution = 20;

var GLMap__program, GLMap__texture_proj = {}, GLMap__texture = {};

function initGLMap () {
  GLMap__program = createProgram (GLMap__image_vertex_shader, GLMap__image_shader_fragment);
  GLMap__program.setMatrixes (jsProjMatrix, jsViewMatrix);
  
  GLMap__program.useIt ();

  GLMap__program.uniform.tick (0);
  GLMap__program.uniform.resolution (GLMap__resolution);
  
  GLMap__texture_proj.normalize = false;
  GLMap__texture_proj.type = gl_ctx.FLOAT;
  GLMap__texture_proj.stride = 0;
  GLMap__texture_proj.offset = 0;
  GLMap__texture_proj.buffer = gl_ctx.createBuffer ();
  GLMap__texture_proj.numComponents = 2;

  GLMap__texture.bindToUnit = function(unit, gl_view) {
    gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, gl_view.__gl_image_texture);
  };
  
  GLMap__program.configureParameters = function (gl_view, style) {
    var
      x = gl_view._position[0],
      w = gl_view._size [0];
      
    GLMap__program.uniform.tick (gl_view._pourcentage / 100);
    GLMap__program.uniform.posx (x);
    GLMap__program.uniform.width (w);

    GLMap__program.attrib.uv (GLMap__texture_proj);

    gl_ctx.bufferData (
      gl_ctx.ARRAY_BUFFER,
      gl_view.__gl_user_texture_mapping,
      gl_ctx.STATIC_DRAW
    );
      
    GLMap__program.textures.uMainTexture (GLMap__texture, gl_view);
  }
}


glAddInitFunction (initGLMap);