import { BaseView } from "./view/View";
import { SPRITES } from "./sprite";
import { GLEngineProgram } from "./GLProgram";
import { __copy_image_into_webgl_texture } from "./view/helpers";

export function setUpdateVerticesSprite(
  gl_view: BaseView,
  update_gl_vertices: Float32Array): void {

  if (!gl_view) return;
  var sprite = SPRITES[gl_view.__gl_id];
  if (!sprite) return;

  sprite.__update_gl_vertices = update_gl_vertices;
}

export function setShadersProgram(gl_view: BaseView, program: GLEngineProgram) {

  if (!gl_view) return;
  const sprite = SPRITES [gl_view.__gl_id];
  if (!sprite) return;

  sprite.user_program = program;
}

export function clean_image_texture(gl_view: BaseView) {
  var gl_object = SPRITES [gl_view.__gl_id];
  
  if (gl_object.image_texture) {
    gl_object.image_texture = null;
  }
}

export function set_image_texture(gl_view: BaseView, texture: any): void {
  var gl_object = SPRITES[gl_view.__gl_id];
  
  gl_object.image_texture = texture;
}

export function update_texture(gl_view: BaseView, image: HTMLCanvasElement): void {
  var gl_object = SPRITES[gl_view.__gl_id];
  
  gl_object.texture = __copy_image_into_webgl_texture(image, gl_object.texture);
}

type Handlers = any[];

export const webglcontextrestored_listeners: Handlers[] = [];
export function register_webglcontextrestored(
  gl_view: BaseView,
  handler: any): void {
  if (!gl_view || !handler) return;
  
  var sprite = SPRITES [gl_view.__gl_id];
  if (!sprite) return;
  
  let handlers = webglcontextrestored_listeners[gl_view.__gl_id];
  if (!handlers) {
    handlers = [];
    webglcontextrestored_listeners[gl_view.__gl_id] = handlers;
  }
  
  handlers.push(handler);
}