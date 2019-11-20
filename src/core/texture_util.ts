import * as util from "../util";
import { getGLContext } from "./engine"
import { __copy_image_into_webgl_texture } from "./view/helpers";
import { vec2 } from "gl-matrix";

export type LoadTextureClb = (texture: WebGLTexture, size: vec2) => void;

type TextureRef = {
  texture: WebGLTexture;
  size: vec2;
  ref_count: number;
  clbs: LoadTextureClb[];
};

let __gl_textures_ref: {
  [src: string]: TextureRef;
} = {};

export function gl_get_texture_from_image_url(src: string, clb: LoadTextureClb): void {
  let handler = __gl_textures_ref[src];
  if (handler) {
    handler.ref_count ++;
    if (util.isFunction(clb)) {
      if (handler.texture) {
        try {
          clb(handler.texture, vec2.clone(handler.size));
        }
        catch (exp) {
          if (exp.stack) console.log (exp.stack);
          console.log (exp);
        }
      } else {
        handler.clbs.push(clb);
      }
    }
    return;
  }
  
  handler = {
    texture: null,
    ref_count: 1,
    clbs: [],
    size: vec2.create(),
  };
  handler.size[0] = -1;
  handler.size[1] = -1;

  if (util.isFunction(clb)) {
    handler.clbs.push(clb);
  }
  __gl_textures_ref[src] = handler;

  const image = new Image();
  image.src = src;

  image.onload = (event: Event): void => {
    const handler = __gl_textures_ref[src];
    if (!handler) {
      // image has been deleted before it's available
      return;
    }

    const texture = __copy_image_into_webgl_texture(image);
    
    handler.texture = texture;
    var clbs = handler.clbs; handler.clbs = [];
    const imageSize = vec2.create();
    imageSize[0] = image.width;
    imageSize[1] = image.height;
    clbs.forEach((clb) => {
      try {
        handler.size = imageSize;
        clb(texture, vec2.clone(handler.size));
      }
      catch (exp) {
        if (exp.stack) console.log(exp.stack);
        console.log(exp);
      }
    })
  }
}

export function gl_get_texture_from_image_url_not_optimize (src: string, clb: any): void {
  
  var image = new Image();
  image.src = src;

  image.onload = function (e) {
    const texture = __copy_image_into_webgl_texture(image);
    
    try {
      clb(texture, [image.width, image.height]);
    }
    catch (exp) {
      if (exp.stack) console.log (exp.stack);
      console.log (exp);
    }
  }
}

export function gl_free_texture_image(src: string): void {
  const handler = __gl_textures_ref[src];
  if (!handler) return;
  
  handler.ref_count --;
  if (handler.ref_count > 0) return;
  
  if (handler.texture) {
    const gl_ctx = getGLContext();
    gl_ctx.deleteTexture(handler.texture);
  }
  delete __gl_textures_ref[src];
}
