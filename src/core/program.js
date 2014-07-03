var get_shader = function (type, source, typeString) {
  // Create the shader object
  var shader = gl_ctx.createShader (type);
  if (shader == null) {
    vs.error ("couldn't create a shader")
    return null;
  }
  // Load the shader source
  gl_ctx.shaderSource (shader, source);
  // Compile the shader
  gl_ctx.compileShader (shader);
  // Check the compile status
  if (!gl_ctx.getShaderParameter(shader, gl_ctx.COMPILE_STATUS) &&
      !gl_ctx.isContextLost ()) {
    var infoLog = this.gl_ctx.getShaderInfoLog (shader);
    vs.error ("Error compiling " + typeString + "shader:\n" + infoLog);
    gl_ctx.deleteShader (shader);
    return null;
  }

  return shader;
};

/**
 * Helper which convers GLSL names to JavaScript names.
 * @private
 */
function glslNameToJs_ (name) {
  return name.replace(/_(.)/g, function(_, p1) { return p1.toUpperCase(); });
}

function Program  () {
  this.__prog = gl_ctx.createProgram ();
}

function createSetters (program) {
  var __prog = program.__prog;

  // Look up attribs.
  var attribs = {};
  // Also make a plain table of the locs.
  var attribLocs = {};

  function createAttribSetter (info, index) {
    if (info.size != 1) {
      throw("arrays of attribs not handled");
    }
    return function (b) {
      gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, b.buffer);
      gl_ctx.enableVertexAttribArray (index);
      gl_ctx.vertexAttribPointer (
        index, b.numComponents, b.type, b.normalize, b.stride, b.offset
      );
    };
  }

  var numAttribs = gl_ctx.getProgramParameter (__prog, gl_ctx.ACTIVE_ATTRIBUTES);
  if (numAttribs && !gl_ctx.isContextLost ()) {
    for (var ii = 0; ii < numAttribs; ++ii) {
      var info = gl_ctx.getActiveAttrib (__prog, ii);
      if (!info) {
        break;
      }
      var name = info.name;
      var index = gl_ctx.getAttribLocation (__prog, name);
      attribs [name] = createAttribSetter(info, index);
      attribLocs [name] = index
    }
  }

  // Look up uniforms
  var numUniforms = gl_ctx.getProgramParameter (__prog, gl_ctx.ACTIVE_UNIFORMS);
  var uniforms = {};
  var textureUnit = 0;

  function createUniformSetter (info) {
    var loc = gl_ctx.getUniformLocation (__prog, info.name);
    var type = info.type; 

    if (type === gl_ctx.FLOAT)
      return function(v) { gl_ctx.uniform1f (loc, v); };
    if (type === gl_ctx.FLOAT_VEC2)
      return function(v) { gl_ctx.uniform2fv (loc, v); };
    if (type === gl_ctx.FLOAT_VEC3)
      return function(v) { gl_ctx.uniform3fv (loc, v); };
    if (type === gl_ctx.FLOAT_VEC4)
      return function(v) { gl_ctx.uniform4fv (loc, v); };
    if (type === gl_ctx.INT)
      return function(v) { gl_ctx.uniform1i (loc, v); };
    if (type === gl_ctx.INT_VEC2)
      return function(v) { gl_ctx.uniform2iv (loc, v); };
    if (type === gl_ctx.INT_VEC3)
      return function(v) { gl_ctx.uniform3iv (loc, v); };
    if (type === gl_ctx.INT_VEC4)
      return function(v) { gl_ctx.uniform4iv (loc, v); };
    if (type === gl_ctx.BOOL)
      return function(v) { gl_ctx.uniform1i (loc, v); };
    if (type === gl_ctx.BOOL_VEC2)
      return function(v) { gl_ctx.uniform2iv (loc, v); };
    if (type === gl_ctx.BOOL_VEC3)
      return function(v) { gl_ctx.uniform3iv (loc, v); };
    if (type === gl_ctx.BOOL_VEC4)
      return function(v) { gl_ctx.uniform4iv (loc, v); };
    if (type === gl_ctx.FLOAT_MAT2)
      return function(v) { gl_ctx.uniformMatrix2fv (loc, false, v); };
    if (type === gl_ctx.FLOAT_MAT3)
      return function(v) { gl_ctx.uniformMatrix3fv (loc, false, v); };
    if (type === gl_ctx.FLOAT_MAT4)
      return function(v) { gl_ctx.uniformMatrix4fv (loc, false, v); };
    if (type === gl_ctx.SAMPLER_2D || type === gl_ctx.SAMPLER_CUBE) {
      return function(unit) {
        return function(v, gl_view) {
//            gl_ctx.uniform1i (loc, unit);
          v.bindToUnit(unit, gl_view);
        };
      }(textureUnit++);
    }
    throw ("unknown type: 0x" + type.toString(16));
  }

  var textures = {};

  if (numUniforms && !gl_ctx.isContextLost ()) {
    for (var ii = 0; ii < numUniforms; ++ii) {
      var info = gl_ctx.getActiveUniform (__prog, ii);
      if (!info) {
        break;
      }
      name = info.name;
      var setter = createUniformSetter(info);
      uniforms [name] = setter;
      if (info.type === gl_ctx.SAMPLER_2D || info.type === gl_ctx.SAMPLER_CUBE) {
        textures [name] = setter;
      }
    }
  }

  program.textures = textures;
  program.attrib = attribs;
  program.attribLoc = attribLocs;
  program.uniform = uniforms;
}

Program.prototype.useIt = function (pMatrix, vMatrix, mMatrix) {
  gl_ctx.useProgram (this.__prog);
}

Program.prototype.setMatrixes = function (projMatrix, viewMatrix) {
  this.useIt ();
  this.uniform.Pmatrix (projMatrix);
  this.uniform.Vmatrix (viewMatrix);
}

Program.prototype.configureParameters = function (gl_view, style) {}

function createProgram (vertex_txt, fragment_txt) {
  var program = new Program ();

  var shader_vertex = get_shader (gl_ctx.VERTEX_SHADER, vertex_txt, "VERTEX");
  if (!shader_vertex) {
    console.error ("couldn't load shader")
  }
  gl_ctx.attachShader (program.__prog, shader_vertex);
  gl_ctx.deleteShader (shader_vertex);

  var shader_fragment = get_shader (gl_ctx.FRAGMENT_SHADER, fragment_txt, "FRAGMENT");
  if (!shader_fragment) {
    console.error ("couldn't load shader")
  }
  gl_ctx.attachShader (program.__prog, shader_fragment);
  gl_ctx.deleteShader (shader_fragment);

  gl_ctx.linkProgram (program.__prog);
  gl_ctx.useProgram (program.__prog);

  // Check the link status
  var linked = gl_ctx.getProgramParameter (program.__prog, gl_ctx.LINK_STATUS);
  if (!linked && !gl_ctx.isContextLost ()) {
    var infoLog = gl_ctx.getProgramInfoLog (program.__prog);
    console.error ("Error linking program:\n" + infoLog);
    gl_ctx.deleteProgram (program.__prog);
    program.__prog = null;
    return;
  }
  
  createSetters (program);
  
  return program;
}