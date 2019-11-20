import { vec3, mat4 } from "gl-matrix";
import { BaseView } from "./view/View";
import { GLEngineProgram } from "./GLProgram";
import { gl_ctx, gl_device_pixel_ratio, frame_size } from "./engineInit";
import { isPowerOfTwo } from "./view/helpers";
import { webglcontextrestored_listeners } from "./spriteUtil";

export const SPRITES:Sprite[] = [];

export type VerticeFunction =
  (resolution: number, vertices: Float32Array) => Float32Array;

type SpriteAllocFuncs = {
  resolution: number;
  sprite_vertices_func: VerticeFunction;
  normal_vertices_func: VerticeFunction;
  triangle_faces_func: VerticeFunction;
  texture_projection_func: VerticeFunction;
}

const SPRITE_ALLOCATIONS: SpriteAllocFuncs[] = [];

let __unique_gl_id: number = 1;
export const GL_VIEWS: BaseView[] = [];

export function createSprite(gl_view: BaseView): void {

  var id = __unique_gl_id ++;
  gl_view.__gl_id = id ;
  GL_VIEWS[id] = gl_view;

  const sprite: Sprite = new Sprite(gl_view.__gl_id);
  // WARNING maybe code that should be fix
  // if (gl_view.__update_gl_vertices) {
  //   setUpdateVerticesSprite(gl_view, gl_view.__update_gl_vertices);
  //   gl_view.__update_gl_vertices = undefined;
  // }
}

export function deleteSprite (gl_view: BaseView) {

  const sprite = SPRITES[gl_view.__gl_id];
  
  if (sprite.texture) {
    gl_ctx.deleteTexture (sprite.texture);
    sprite.texture = null;
  }
}

export function setVerticesAllocationFunctions(
  gl_view: BaseView,
  resolution: number,
  sprite_vertices_func: VerticeFunction,
  normal_vertices_func: VerticeFunction,
  triangle_faces_func: VerticeFunction,
  texture_projection_func: VerticeFunction) {
  
  if (!gl_view) return;
  var sprite = new Sprite (gl_view.__gl_id);
  if (!sprite) return;

  const allocations = {
    resolution,
    sprite_vertices_func,
    normal_vertices_func,
    triangle_faces_func,
    texture_projection_func,
  }
  
  SPRITE_ALLOCATIONS[gl_view.__gl_id] = allocations;
  sprite.default_meshes = false;
}

export class Sprite {
  public matrix: mat4;

  // Parent matrix. Use to save parent transformation
  // and accelerate the rendering
  public p_matrix: mat4;

  // Sprite matrix transformation (translation, rotation, scale, skew)
  public m_matrix: mat4;
  public vertex_1: vec3;
  public vertex_2: vec3;
  public vertex_3: vec3;
  public vertex_4: vec3;

  // Sprite id (number)
  protected id: number;

  // GL Buffer for mesh vertices
  public mesh_vertices_buffer: WebGLBuffer;

  // Textures references
  public image_texture: WebGLTexture;
  public texture: WebGLTexture;

  // This constant change when the use setup is own meshes
  // with the function setMeshFunctions
  public default_meshes: boolean = true;

  // Contains sprite vertices
  mesh_vertices: Float32Array;

  // Contains mesh's normal vertices
  public normal_vertices: Float32Array;

  // Contains trangles faces
  public triangle_faces: Float32Array;

  // Contains texture projection parameters
  public texture_uv:Float32Array;

  public user_program: GLEngineProgram;

  public __update_gl_vertices: Float32Array;

  public _framebuffer: WebGLFramebuffer;
  public _renderbuffer: WebGLFramebuffer;
  public _frametexture: WebGLFramebuffer;


  // Sprite vertices used for culling algorithm

   constructor(id: number) {
      this.matrix = mat4.create();

      // Parent matrix. Use to save parent transformation
      // and accelerate the rendering
      this.p_matrix = mat4.create();

      // Sprite matrix transformation (translation, rotation, scale, skew)
      this.m_matrix = mat4.create();

      // Sprite id (number)
      this.id = id;
      SPRITES[this.id] = this;

      // Buffers allocation
      this.mesh_vertices_buffer = gl_ctx.createBuffer();

      // Sprite vertices used for culling algorithm
      this.vertex_1 = vec3.create();
      this.vertex_2 = vec3.create();
      this.vertex_3 = vec3.create();
      this.vertex_4 = vec3.create();
    }

  static restoreGLContext() {
    var sprite, i = 0, l = SPRITES.length;

    for (; i < l; i++) {
      sprite = SPRITES[i];
      if (sprite) {
        delete (sprite.mesh_vertices_buffer);
        sprite.mesh_vertices_buffer = gl_ctx.createBuffer();

        if (sprite.texture) {
          delete (sprite.texture);
          sprite.texture = gl_ctx.createTexture();
        }

        if (sprite.image_texture) {
          delete (sprite.image_texture);
          sprite.image_texture = gl_ctx.createTexture();
        }
      }
    }

    var handlers = webglcontextrestored_listeners[sprite.id];
    if (handlers) {
      handlers.forEach((handler: () => void): void => {
        try {
          handler();
        } catch (exp) {
          if (exp.stack) console.log(exp.stack);
          else console.log(exp);
        }
      });
    }
  }
}


function updateSpriteSize(gl_view: BaseView, width: number, height: number) {
  if (!gl_view) return;
  const sprite = new Sprite(gl_view.__gl_id);
  if (!sprite) return;
  
  setupTextureFramebuffer(sprite, width, height);
}

export function setupTextureFramebuffer(sprite: Sprite, width: number, height: number) {
  
  if (sprite._framebuffer) {
    gl_ctx.deleteFramebuffer(sprite._framebuffer);
  }
  if (sprite._renderbuffer) {
    gl_ctx.deleteRenderbuffer(sprite._renderbuffer);
  }
  if (sprite._frametexture) {
    gl_ctx.deleteFramebuffer(sprite._frametexture);
  }  
  
  if (width === 0 || height === 0) return;
  
  var framebuffer = gl_ctx.createFramebuffer();
  sprite._framebuffer = framebuffer;
  
  gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, framebuffer);
  const framebuffer_width = width * gl_device_pixel_ratio;
  const framebuffer_height = height * gl_device_pixel_ratio;

  var texture = gl_ctx.createTexture();
  sprite._frametexture = texture;

  gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, texture);
  gl_ctx.texImage2D (gl_ctx.TEXTURE_2D, 0, gl_ctx.RGBA, framebuffer_width, framebuffer_height, 0, gl_ctx.RGBA, gl_ctx.UNSIGNED_BYTE, null);

  gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, texture);
  gl_ctx.texImage2D (gl_ctx.TEXTURE_2D, 0, gl_ctx.RGBA, framebuffer_width, framebuffer_height, 0, gl_ctx.RGBA, gl_ctx.UNSIGNED_BYTE, null);

  // POT images
  if (isPowerOfTwo (frame_size[0] * gl_device_pixel_ratio) &&
    isPowerOfTwo (frame_size[1] * gl_device_pixel_ratio)) {

    gl_ctx.texParameteri
    (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MAG_FILTER, gl_ctx.LINEAR);

    gl_ctx.texParameteri
    (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.NEAREST_MIPMAP_LINEAR);

    gl_ctx.generateMipmap (gl_ctx.TEXTURE_2D);
  }
  // NPOT images
  else {
    //gl_ctx.NEAREST is also allowed, instead of gl_ctx.LINEAR, as neither mipmap.
    gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.LINEAR);
    //Prevents s-coordinate wrapping (repeating).
    gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_S, gl_ctx.CLAMP_TO_EDGE);
    //Prevents t-coordinate wrapping (repeating).
    gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_T, gl_ctx.CLAMP_TO_EDGE);
  }

  const renderbuffer = gl_ctx.createRenderbuffer();
  sprite._renderbuffer = renderbuffer;
  
  gl_ctx.bindRenderbuffer(gl_ctx.RENDERBUFFER, renderbuffer);
  gl_ctx.renderbufferStorage(gl_ctx.RENDERBUFFER, gl_ctx.DEPTH_COMPONENT16, framebuffer_width, framebuffer_height);

  gl_ctx.framebufferTexture2D(gl_ctx.FRAMEBUFFER, gl_ctx.COLOR_ATTACHMENT0, gl_ctx.TEXTURE_2D, texture, 0);
  gl_ctx.framebufferRenderbuffer(gl_ctx.FRAMEBUFFER, gl_ctx.DEPTH_ATTACHMENT, gl_ctx.RENDERBUFFER, renderbuffer);

  gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, null);
  gl_ctx.bindRenderbuffer(gl_ctx.RENDERBUFFER, null);
  gl_ctx.bindFramebuffer(gl_ctx.FRAMEBUFFER, null);
}
  
function defaultSpriteVerticesAllocation(sprite: Sprite): void {
  // Default mesh allocation: 4 vertices * 3 float values
  sprite.mesh_vertices = new Float32Array (12);
  // will use the default_triangle_faces
  sprite.triangle_faces = null;
  // do not use normals
  sprite.normal_vertices = null;
  // do not use texture
  sprite.texture_uv = null;
}

export function initSprite (gl_view: BaseView): void {
  if (!gl_view) return;
  
  var sprite = SPRITES [gl_view.__gl_id];
  if (!sprite) return;
  
  if (sprite.default_meshes) {
    defaultSpriteVerticesAllocation (sprite);
  }
  else {
    const allocations = SPRITE_ALLOCATIONS[gl_view.__gl_id];
    if (!allocations) {
      defaultSpriteVerticesAllocation (sprite);
      return;
    }
    if (allocations.sprite_vertices_func) {
      sprite.mesh_vertices = allocations.sprite_vertices_func(
        allocations.resolution, sprite.mesh_vertices
      );
    }
    if (allocations.normal_vertices_func) {
      sprite.normal_vertices = allocations.normal_vertices_func(
        allocations.resolution, sprite.normal_vertices
      );
    }
    if (allocations.triangle_faces_func) {
      sprite.triangle_faces = allocations.triangle_faces_func(
        allocations.resolution, sprite.triangle_faces
      );
    }
    if (allocations.texture_projection_func) {
      sprite.texture_uv = allocations.texture_projection_func(
        allocations.resolution, sprite.texture_uv
      );
    }
  }
}



