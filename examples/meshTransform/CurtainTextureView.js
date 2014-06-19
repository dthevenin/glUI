define ('CurtainTextureView', ['CurtainView'], function (CurtainView) {

  var image_uv_buffer = null;
  var mesh_resolution = 20;

  var vertex_shader="\n\
  attribute vec3 position;\n\
  attribute vec3 normal;\n\
  attribute vec2 uv;\n\
  uniform vec3 lightDirection;\n\
  uniform float diffuseFactor;\n\
  uniform mat4 Pmatrix;\n\
  uniform mat4 Vmatrix;\n\
  uniform mat4 Mmatrix;\n\
  varying lowp vec4 shadingVarying;\n\
  varying lowp vec2 vUV;\n\
  void main(void) { //pre-built function\n\
    vec4 new_pos = vec4(position, 1.);\n\
    gl_Position = Pmatrix*Vmatrix*Mmatrix*new_pos;\n\
  \n\
    float diffuseIntensity = abs(dot(normal, lightDirection));\n\
    float diffuse = mix(1.0, diffuseIntensity, diffuseFactor);\n\
  \n\
    shadingVarying = vec4(diffuse, diffuse, diffuse, 1.0);\n\
    vUV=uv;\n\
  }";

  var shader_fragment="\n\
  precision lowp float;\n\
  uniform vec4 color;\n\
  uniform float uAlpha;\n\
  varying vec4 shadingVarying;\n\
  uniform sampler2D uMainTexture;\n\
  varying vec2 vUV;\n\
  void main(void) {\n\
    vec4 mainTextureColor = texture2D(uMainTexture, vUV);\n\
    gl_FragColor = mainTextureColor;\n\
    gl_FragColor.a *= uAlpha;\n\
    gl_FragColor = shadingVarying * gl_FragColor;\n\
  }";

  var CurtainTextureView = vs.core.createClass ({

    /** parent class */
    parent: vs.ui.GLImage,

    properties : {
      'lightDirection': vs.core.Object.PROPERTY_IN_OUT,
      'diffuseFactor': vs.core.Object.PROPERTY_IN_OUT,
      'slide': {
        set: function (array) {
          this._slide [0] = array [0];
          this._slide [1] = array [1];
          this.__updateMeshAtPoint ();
        }
      }
    },

    initComponent : function () {
      this._super ();

      this._light_direction = new Float32Array ([0.5, 0.0, 1.0]);
      this._diffuse_factor = 0.7;
      this._slide = [0, 300];

      var self = this;

      this.setShadersProgram (CurtainTextureView_program);

      this.setUdpateVerticesFunction (CurtainTextureView.updateVerticesFunction.bind (this));

      this.__recognizer = new vs.ui.DragRecognizer (this);
      this.addPointerRecognizer (this.__recognizer);

      this.animation = new GLAnimation (
        {'slide': [0, 0]},
        {'classes': {'slide' : TrajectoryVect2D}}
      );
      this.animation.duration = 200;
    }
  });

  CurtainTextureView.updateVerticesFunction = function (sprite, obj_pos, obj_size) {
    var
      x = obj_pos[0],
      y = obj_pos[1],
      w = obj_size [0],
      h = obj_size [1];

    this._sprite = sprite;

    sprite.user_vertices = makeMesh (mesh_resolution, x, y, w, h, sprite.user_vertices);
    sprite.user_vertices_normal = makeNormal (mesh_resolution, x, y, w, h, sprite.user_vertices_normal);
    sprite.user_vertices_save = new Float32Array (sprite.user_vertices);
    sprite.user_triangle_faces = makeTriangles (mesh_resolution, sprite.user_triangle_faces);

    this.__updateMeshAtPoint ();

    sprite.user_texture_uv = makeTextureProjection (mesh_resolution, sprite.user_texture_uv)

    gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, image_uv_buffer);

    gl_ctx.bufferData (
      gl_ctx.ARRAY_BUFFER,
      sprite.user_texture_uv,
      gl_ctx.STATIC_DRAW
    );
  }

  CurtainTextureView.prototype.__updateMeshAtPoint = CurtainView.prototype.__updateMeshAtPoint;

  glAddInitFunction (createCurtainProgram);

  var CurtainTextureView_program = null;
  function createCurtainProgram () {

    image_uv_buffer = gl_ctx.createBuffer ();

    CurtainTextureView_program = createProgram (vertex_shader, shader_fragment);
    CurtainTextureView_program.useIt ();
    CurtainTextureView_program.setMatrixes (jsProjMatrix, jsViewMatrix);

    var normals_buffer = gl_ctx.createBuffer ();;

    var attrib = {};
    attrib.normalize = false;
    attrib.type = gl_ctx.FLOAT;
    attrib.stride = 0;
    attrib.offset = 0;

    var texture = {}

    function bindToUnitTEXTURE0_2 (unit, sprite) {
      gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
      gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, sprite.image_texture);
    };

    CurtainTextureView_program.configureParameters = function (sprite, gl_view, style) {

      CurtainTextureView_program.uniform.lightDirection (gl_view._light_direction);
      CurtainTextureView_program.uniform.diffuseFactor (gl_view._diffuse_factor);

      texture.bindToUnit = bindToUnitTEXTURE0_2;
      CurtainTextureView_program.textures.uMainTexture (texture, sprite);

      attrib.buffer = image_uv_buffer;
      attrib.numComponents = 2;
      CurtainTextureView_program.attrib.uv (attrib);

      attrib.buffer = normals_buffer;
      attrib.numComponents = 3;
      CurtainTextureView_program.attrib.normal (attrib);

      gl_ctx.bufferData (
        gl_ctx.ARRAY_BUFFER,
        sprite.user_vertices_normal,
        gl_ctx.STATIC_DRAW
      );
    }
  }

  return CurtainTextureView;
});
