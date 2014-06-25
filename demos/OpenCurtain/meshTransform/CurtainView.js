define ('CurtainView', [], function () {

  var mesh_resolution = 30;
  var shaders_program = null;

  var vertex_shader = "\n\
  attribute vec3 position;\n\
  attribute vec3 normal;\n\
  uniform vec3 lightDirection;\n\
  uniform float diffuseFactor;\n\
  uniform mat4 Pmatrix;\n\
  uniform mat4 Vmatrix;\n\
  uniform mat4 Mmatrix;\n\
  varying lowp vec4 shadingVarying;\n\
  void main(void) { //pre-built function\n\
    vec4 new_pos = vec4(position, 1.);\n\
    gl_Position = Pmatrix*Vmatrix*Mmatrix*new_pos;\n\
  \n\
    float diffuseIntensity = abs(dot(normal, lightDirection));\n\
    float diffuse = mix(1.0, diffuseIntensity, diffuseFactor);\n\
  \n\
    shadingVarying = vec4(diffuse, diffuse, diffuse, 1.0);\n\
  }";

  var shader_fragment = "\n\
  precision lowp float;\n\
  uniform vec4 color;\n\
  uniform float uAlpha;\n\
  varying vec4 shadingVarying;\n\
  void main(void) {\n\
    gl_FragColor = shadingVarying * vec4(color.rgb, color.a * uAlpha);\n\
  }";

  var CurtainView = vs.core.createClass ({

    /** parent class */
    parent: vs.gl.View,

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
        null
      )
    },

    initComponent : function () {
      this._super ();

      this._light_direction = new Float32Array ([0.5, 0.0, 1.0]);
      this._diffuse_factor = 0.7;
      this._slide = [0, 300];

      this.setShadersProgram (shaders_program);
      this.addEventListener ('webglcontextrestored', function () {
        self.setShadersProgram (shaders_program);
      });
      
      this.setUdpateVerticesFunction (CurtainView.updateVerticesFunction.bind (this));
    },

    __updateMeshAtPoint: function () {
      var Frills = 3.5;
      var pos = this._position;
      var size = this._size;

      var dx = size[0] - this._slide [0];
      var dy = this._slide [1];

      if (!this._sprite) return;

      var mesh_vertices_save = this._sprite.mesh_vertices_save;
      var mesh_vertices = this._sprite.mesh_vertices;
      var user_normals = this._sprite.normal_vertices;

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

            user_normals [i++] = n1 / norm;
            user_normals [i++] = n2 / norm;
            user_normals [i++] = n3 / norm;

            j++;
          }
          i += 3;
          j++;
        }
      }

      function updateMeshes (dx, dy) {

        var np_x = dx / size[0];
        var np_y = dy / size[1];

        var i = 0, xs, ys, x, y, z;

        for (xs = 0; xs < mesh_resolution + 1; xs++) {
          for (ys = 0; ys < mesh_resolution + 1; ys++) {

            x = (mesh_vertices_save [i] - pos[0]) / size[0];
            y = (mesh_vertices_save [i+1] - pos[1]) / size[1];
            z = mesh_vertices_save [i+2];

            var dy = y - np_y;
            var bend = 0.25 * (1.0 - Math.exp (-dy * dy * 5.0));

            z = 0.05 * Math.sin (-1.4 * Math.cos (x * x * Frills * 2.0 * Math.PI)) * (1.0 - np_x);
            x = x * np_x + x * bend * (1.0 - np_x);

            mesh_vertices [i++] = x * size[0] + pos[0];
            mesh_vertices [i++] = y * size[1] + pos[1];
            mesh_vertices [i++] = z * size[0]
          }
        }
      }

      updateMeshes (Math.min (dx, size[0]), dy);
      updateNormals ();

      gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, this._sprite.mesh_vertices_buffer);
      gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, this._sprite.mesh_vertices, gl_ctx.STATIC_DRAW);

      vs.gl.View.__should_render = true;
    }
  });

  CurtainView.updateVerticesFunction = function (sprite, obj_pos, obj_size) {
    var
      x = obj_pos[0],
      y = obj_pos[1],
      w = obj_size [0],
      h = obj_size [1];

    this._sprite = sprite;
    
    initMeshVeticesValues (mesh_resolution, x, y, w, h, sprite.mesh_vertices);
    sprite.mesh_vertices_save = new Float32Array (sprite.mesh_vertices);

    this.__updateMeshAtPoint ();
  }

  glAddInitFunction (createCurtainProgram);

  function createCurtainProgram () {

    shaders_program = createProgram (vertex_shader, shader_fragment);
    shaders_program.useIt ();
    shaders_program.setMatrixes (jsProjMatrix, jsViewMatrix);

    var normal = {};
    normal.normalize = false;
    normal.type = gl_ctx.FLOAT;
    normal.stride = 0;
    normal.offset = 0;
    normal.buffer = gl_ctx.createBuffer ();
    normal.numComponents = 3;

    shaders_program.configureParameters = function (sprite, gl_view, style) {
      var style = gl_view.style, c_buffer;
      if (!style) {
        style = _default_style;
      }

      if (style && style._background_color) {
        c_buffer = style._background_color.__gl_array;
      }
      else {
        c_buffer = vs.gl.Color.default.__gl_array;
      }
      shaders_program.uniform.color (c_buffer);
      shaders_program.uniform.lightDirection (gl_view._light_direction);
      shaders_program.uniform.diffuseFactor (gl_view._diffuse_factor);

      shaders_program.attrib.normal (normal);
      gl_ctx.bufferData (
        gl_ctx.ARRAY_BUFFER,
        sprite.normal_vertices,
        gl_ctx.STATIC_DRAW
      );
    }
  }

  return CurtainView;
});
