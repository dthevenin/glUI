define ('FishEyeView', [], function () {

  var image_uv_buffer = null;
  var mesh_resolution = 30;
  var shaders_program = null;

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

  var FishEyeView = klass.createClass ({

    /** parent class */
    parent: core.Image,

    properties : {
      'lightDirection': vs.core.Object.PROPERTY_IN_OUT,
      'diffuseFactor': vs.core.Object.PROPERTY_IN_OUT,
      'radius':  {
        set: function (v) {
          this._radius = v;
          this.__updateCurtainMeshAtPoint ();
        }
      },

      'slide': {
        set: function (array) {
          this._slide [0] = array [0];
          this._slide [1] = array [1];
          this.__updateCurtainMeshAtPoint ();
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
      this._slide = [0, 0];
      this._radius = 0;

      this.setShadersProgram (shaders_program);

      this.setUdpateVerticesFunction (
        FishEyeView.updateVerticesFunction.bind (this)
      );
    },

    __updateCurtainMeshAtPoint: function ()
    {
      var dx = this._slide [0];
      var dy = this._slide [1];

      var Frills = 3.5;
      var pos = this._position;
      var size = this._size;
      var radius = this._radius;

      if (!this._sprite) return;

      var mesh_vertices_save = this._sprite.mesh_vertices_save;
      var mesh_vertices = this._sprite.mesh_vertices;
      var normal_vertices = this._sprite.normal_vertices;

      function updateNormals () {

        var i = 0, xs, ys, j = 0, index, n1, n2, n3;

        for (xs = 0; xs < mesh_resolution ; xs++) {
           for (ys = 0; ys < mesh_resolution ; ys++) {

            x1 = mesh_vertices [j * 3];
            x2 = mesh_vertices [(j + mesh_resolution + 1) * 3];
            x3 = mesh_vertices [(j + 1) * 3];

            y1 = mesh_vertices [j * 3 + 1];
            y2 = mesh_vertices [(j + mesh_resolution + 1) * 3 + 1];
            y3 = mesh_vertices [(j + 1) * 3 + 1];

            z1 = mesh_vertices [j * 3 + 2];
            z2 = mesh_vertices [(j + mesh_resolution + 1) * 3 + 2];
            z3 = mesh_vertices [(j + 1) * 3 + 2];

            // x
            n1 = (y2-y1)*(z3-z1) - (z2-z1)*(y3-y1);
            // y
            n2 = (z2-z1)*(x3-x1) - (x2-x1)*(z3-z1);
            // z
            n3 = (x2-x1)*(y3-y1) - (y2-y1)*(x3-x1);

            // normal
            var norm = Math.sqrt (n1*n1 + n2*n2 + n3*n3);

            normal_vertices [i++] = n1 / norm;
            normal_vertices [i++] = n2 / norm;
            normal_vertices [i++] = n3 / norm;

            j++;
          }
          i += 3;
          j++;
        }
      }

      function updateMeshes (dx, dy) {

        var i = 0, xs, ys, x, y, z;

        var np_x = dx / size[0];
        var np_y = dy / size[1];

        var Bulginess = 0.4;

        var rMax = radius/size[0];

        var yScale = size[1]/size[0];

        for (xs = 0; xs < mesh_resolution + 1; xs++) {
          for (ys = 0; ys < mesh_resolution + 1; ys++) {

            x = (mesh_vertices_save [i] - pos[0]) / size[0];
            y = (mesh_vertices_save [i+1] - pos[1]) / size[1];
            z = mesh_vertices_save [i+2] / size[0];

            dx = x - np_x;
            dy = (y - np_y) * yScale;

            var r = Math.sqrt (dx*dx + dy*dy);

            if (r > rMax) {
              mesh_vertices [i++] = x * size[0] + pos[0];
              mesh_vertices [i++] = y * size[1] + pos[1];
              mesh_vertices [i++] = z * size[0];
              continue;
            }

            var t = r/rMax;
            var scale = Bulginess * (Math.cos(t * Math.PI) + 1.0);

            x += dx * scale;
            y += dy * scale / yScale;
            z = scale * 0.2;

            mesh_vertices [i++] = x * size[0] + pos[0];
            mesh_vertices [i++] = y * size[1] + pos[1];
            mesh_vertices [i++] = z * size[0];
          }
        }
      }

      updateMeshes (Math.min (dx, size[0]), dy);
      updateNormals ();

      gl_ctx.bindBuffer (
        gl_ctx.ARRAY_BUFFER, this._sprite.mesh_vertices_buffer
      );
      gl_ctx.bufferData (
        gl_ctx.ARRAY_BUFFER,
        this._sprite.mesh_vertices,
        gl_ctx.STATIC_DRAW
      );

      core.View.__should_render = true;
    }
  });
  
  FishEyeView.updateVerticesFunction = function (sprite, obj_pos, obj_size) {
    var
      x = obj_pos[0],
      y = obj_pos[1],
      w = obj_size [0],
      h = obj_size [1];

    this._sprite = sprite;

    initMeshVeticesValues (
      mesh_resolution, x, y, 0, w, h, sprite.mesh_vertices
    );

    sprite.mesh_vertices_save =
      new Float32Array (sprite.mesh_vertices);

    this.__updateCurtainMeshAtPoint ();
    
    gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, image_uv_buffer);

    gl_ctx.bufferData (
      gl_ctx.ARRAY_BUFFER,
      sprite.texture_uv,
      gl_ctx.STATIC_DRAW
    );
  }

  core.glAddInitFunction (createCurtainProgram);

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
    }

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
    };
  }

  return FishEyeView;
});
