define ('CurtainTextureView', ['CurtainView'], function (CurtainView) {

  var image_uv_buffer = null;
  var mesh_resolution = 30;

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

  var CurtainTextureView = klass.createClass ({

    /** parent class */
    parent: core.Image,

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
    
    constructor: function (config) {
      this._super (config);
      
      this.setVerticesAllocationFunctions (
        mesh_resolution,
        allocateMeshVertices,
        allocateNormalVertices,
        allocateTriangleFaces,
        makeTextureProjection
      )
    },

    initComponent : function () {
      this._super ();

      this._light_direction = new Float32Array ([0.5, 0.0, 1.0]);
      this._diffuse_factor = 0.7;
      this._slide = [0, 300];

      var self = this;

      this.setShadersProgram (shaders_program);

      this.setUdpateVerticesFunction (
        CurtainTextureView.updateVerticesFunction.bind (this)
      );
    }
  });

  CurtainTextureView.updateVerticesFunction = function (sprite, obj_pos, obj_size) {
    var
      x = obj_pos[0],
      y = obj_pos[1],
      w = obj_size [0],
      h = obj_size [1];

    this._sprite = sprite;
    
    initMeshVeticesValues (
      mesh_resolution, x, y, w, h, sprite.mesh_vertices
    );

    sprite.mesh_vertices_save =
        new Float32Array (sprite.mesh_vertices);

    this.__updateMeshAtPoint ();

    gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, image_uv_buffer);

    gl_ctx.bufferData (
      gl_ctx.ARRAY_BUFFER,
      sprite.texture_uv,
      gl_ctx.STATIC_DRAW
    );
  }

  CurtainTextureView.prototype.__updateMeshAtPoint = CurtainView.prototype.__updateMeshAtPoint;

  glAddInitFunction (createCurtainProgram);

  var shaders_program = null;
  function createCurtainProgram () {

    image_uv_buffer = gl_ctx.createBuffer ();

    shaders_program = createProgram (vertex_shader, shader_fragment);
    shaders_program.useIt ();
    shaders_program.setMatrixes (jsProjMatrix, jsViewMatrix);

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

    shaders_program.configureParameters = function (sprite, gl_view, style) {

      shaders_program.uniform.lightDirection (gl_view._light_direction);
      shaders_program.uniform.diffuseFactor (gl_view._diffuse_factor);

      texture.bindToUnit = bindToUnitTEXTURE0_2;
      shaders_program.textures.uMainTexture (texture, sprite);

      attrib.buffer = image_uv_buffer;
      attrib.numComponents = 2;
      shaders_program.attrib.uv (attrib);

      attrib.buffer = normals_buffer;
      attrib.numComponents = 3;
      shaders_program.attrib.normal (attrib);

      gl_ctx.bufferData (
        gl_ctx.ARRAY_BUFFER,
        sprite.normal_vertices,
        gl_ctx.STATIC_DRAW
      );
    }
  }

  return CurtainTextureView;
});
