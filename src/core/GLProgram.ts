import { mat4 } from "gl-matrix";
import { Sprite } from "./sprite";

const get_shader = (gl_ctx: WebGLRenderingContext, type: GLenum, source: string, typeString: string) => {
  // Create the shader object
  var shader = gl_ctx.createShader(type);
  if (shader == null) {
    console.error ("couldn't create a shader")
    return null;
  }
  // Load the shader source
  gl_ctx.shaderSource (shader, source);
  // Compile the shader
  gl_ctx.compileShader (shader);
  // Check the compile status
  if (!gl_ctx.getShaderParameter(shader, gl_ctx.COMPILE_STATUS) &&
      !gl_ctx.isContextLost ()) {
    var infoLog = gl_ctx.getShaderInfoLog (shader);
    console.error ("Error compiling " + typeString + "shader:\n" + infoLog);
    gl_ctx.deleteShader (shader);
    return null;
  }

  return shader;
};

/**
 * Helper which convers GLSL names to JavaScript names.
 * @private
 */
const glslNameToJs_ = (name: string): string => name.replace(/_(.)/g, (_, p1): string => p1.toUpperCase());

type TextureBind = (unit: number, sprite: Sprite) => void;

export interface AttribParam {
  buffer?: WebGLBuffer;
  numComponents?: GLint;
  type?: GLenum;
  normalize?: GLboolean;
  stride?: GLsizei;
  offset?: GLintptr;
  bindToUnit?: TextureBind;
}

type AttribSetter = (v: AttribParam, other?: any) => void;

export class GLEngineProgram {
  public __prog: WebGLProgram;
  private textures: { [name: string]: AttribSetter };
  private attribs: { [name: string]: AttribSetter};
  private attribLocs: { [name: string]: number};
  private uniforms: { [name: string]: AttribSetter };

  constructor(private gl_ctx: WebGLRenderingContext, vertex_txt: string, fragment_txt: string) {
    this.__prog = gl_ctx.createProgram();

    const shader_vertex = get_shader(gl_ctx, gl_ctx.VERTEX_SHADER, vertex_txt, "VERTEX");
    if (!shader_vertex) {
      console.error("couldn't load shader")
    }
    gl_ctx.attachShader(this.__prog, shader_vertex);
    gl_ctx.deleteShader(shader_vertex);

    const shader_fragment = get_shader(gl_ctx, gl_ctx.FRAGMENT_SHADER, fragment_txt, "FRAGMENT");
    if (!shader_fragment) {
      console.error("couldn't load shader")
    }
    gl_ctx.attachShader(this.__prog, shader_fragment);
    gl_ctx.deleteShader(shader_fragment);

    gl_ctx.linkProgram(this.__prog);
    gl_ctx.useProgram(this.__prog);

    // Check the link status
    const linked = gl_ctx.getProgramParameter(this.__prog, gl_ctx.LINK_STATUS);
    if (!linked && !gl_ctx.isContextLost()) {
      const infoLog = gl_ctx.getProgramInfoLog(this.__prog);
      console.error("Error linking program:\n" + infoLog);
      gl_ctx.deleteProgram(this.__prog);
      this.__prog = null;
      return;
    }

    this.createSetters();
  }

  useIt(pMatrix?: any, vMatrix?: any, mMatrix?: any): void {
    this.gl_ctx.useProgram(this.__prog);
  }

  setMatrixes(projMatrix: mat4, viewMatrix: mat4) {
    this.useIt();
    this.uniforms.Pmatrix(projMatrix);
    this.uniforms.Vmatrix(viewMatrix);
  }

  configureParameters(gl_view: any, style: any) { }

  private createSetters(): void {
    // Look up attribs.
    this.attribs = {};
    // Also make a plain table of the locs.
    this.attribLocs = {};

    function createAttribSetter(info: any, index: number): AttribSetter {
      if (info.size != 1) {
        throw ("arrays of attribs not handled");
      }
      return (b: AttribParam): void => {
        this.gl_ctx.bindBuffer(this.gl_ctx.ARRAY_BUFFER, b.buffer);
        this.gl_ctx.enableVertexAttribArray(index);
        this.gl_ctx.vertexAttribPointer(
          index, b.numComponents, b.type, b.normalize, b.stride, b.offset
        );
      };
    }

    const numAttribs = this.gl_ctx.getProgramParameter(this.__prog, this.gl_ctx.ACTIVE_ATTRIBUTES);
    if (numAttribs && !this.gl_ctx.isContextLost()) {
      for (let ii = 0; ii < numAttribs; ++ii) {
        const info = this.gl_ctx.getActiveAttrib(this.__prog, ii);
        if (!info) {
          break;
        }
        const name = info.name;
        const index = this.gl_ctx.getAttribLocation(this.__prog, name);
        this.attribs[name] = createAttribSetter(info, index);
        this.attribLocs[name] = index
      }
    }

    // Look up uniforms
    var numUniforms = this.gl_ctx.getProgramParameter(this.__prog, this.gl_ctx.ACTIVE_UNIFORMS);
    this.uniforms = {};
    let textureUnit = 0;

    function createUniformSetter(info: any): (v: any, other?: any) => void {
      const loc = this.gl_ctx.getUniformLocation(this.__prog, info.name);
      const type = info.type;

      if (type === this.gl_ctx.FLOAT)
        return (v: any): void => this.gl_ctx.uniform1f(loc, v);
      if (type === this.gl_ctx.FLOAT_VEC2)
        return (v: any): void => this.gl_ctx.uniform2fv(loc, v);
      if (type === this.gl_ctx.FLOAT_VEC3)
        return (v: any): void => this.gl_ctx.uniform3fv(loc, v);
      if (type === this.gl_ctx.FLOAT_VEC4)
        return (v: any): void => this.gl_ctx.uniform4fv(loc, v);
      if (type === this.gl_ctx.INT)
        return (v: any): void => this.gl_ctx.uniform1i(loc, v);
      if (type === this.gl_ctx.INT_VEC2)
        return (v: any): void => this.gl_ctx.uniform2iv(loc, v);
      if (type === this.gl_ctx.INT_VEC3)
        return (v: any): void => this.gl_ctx.uniform3iv(loc, v);
      if (type === this.gl_ctx.INT_VEC4)
        return (v: any): void => this.gl_ctx.uniform4iv(loc, v);
      if (type === this.gl_ctx.BOOL)
        return (v: any): void => this.gl_ctx.uniform1i(loc, v);
      if (type === this.gl_ctx.BOOL_VEC2)
        return (v: any): void => this.gl_ctx.uniform2iv(loc, v);
      if (type === this.gl_ctx.BOOL_VEC3)
        return (v: any): void => this.gl_ctx.uniform3iv(loc, v);
      if (type === this.gl_ctx.BOOL_VEC4)
        return (v: any): void => this.gl_ctx.uniform4iv(loc, v);
      if (type === this.gl_ctx.FLOAT_MAT2)
        return (v: any): void => this.gl_ctx.uniformMatrix2fv(loc, false, v);
      if (type === this.gl_ctx.FLOAT_MAT3)
        return (v: any): void => this.gl_ctx.uniformMatrix3fv(loc, false, v);
      if (type === this.gl_ctx.FLOAT_MAT4)
        return (v: any): void => this.gl_ctx.uniformMatrix4fv(loc, false, v);
      if (type === this.gl_ctx.SAMPLER_2D || type === this.gl_ctx.SAMPLER_CUBE) {
        return function (unit: number): (v: any, gl_view: any) => void {
          return function (v, gl_view): void {
            // this.gl_ctx.uniform1i (loc, unit);
            v.bindToUnit(unit, gl_view);
          };
        }(textureUnit++);
      }
      throw ("unknown type: 0x" + type.toString(16));
    }

    this.textures = {};

    if (numUniforms && !this.gl_ctx.isContextLost()) {
      for (var ii = 0; ii < numUniforms; ++ii) {
        var info = this.gl_ctx.getActiveUniform(this.__prog, ii);
        if (!info) {
          break;
        }
        const name: string = info.name;
        var setter = createUniformSetter(info);
        this.uniforms[name] = setter;
        if (info.type === this.gl_ctx.SAMPLER_2D || info.type === this.gl_ctx.SAMPLER_CUBE) {
          this.textures[name] = setter;
        }
      }
    }
  }
}
