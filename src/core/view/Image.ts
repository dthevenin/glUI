import { View } from ".";
import { gl_free_texture_image, gl_get_texture_from_image_url } from "../texture_util";
import { Color } from "../engine/Color";
import { clean_image_texture, set_image_texture } from "../spriteUtil";
import { vec2 } from "gl-matrix";
import { ObjectConfig } from "../GLObject";

/**
* A Image.
* @constructor
* @name Image
* @extends vs.ui.View
* An Image embeds an image in your application.
*/
export class Image extends View {
  constructor(config: ObjectConfig) {
    super(config);
  }
  
  /**
  * The image url
  * @private
  * @type {string}
  */
  private _src:string = null;
  
  /*****************************************************************
  *
  ****************************************************************/
  /**
  * @protected
  * @function
  */
  destructor() {
    /* TODO */
    gl_free_texture_image(this._src);
    super.destructor()
  };
  
  /**
  * @protected
  * @function
  */
  initComponent() {
    super.initComponent();
    
    this._style.backgroundColor = Color.transparent;
    this.addEventListener('webglcontextrestored', (): void => this.updateImage(this._src));
    /* TODO */
  };
  
  /********************************************************************
  Define class properties
  ********************************************************************/

  private updateImage(src: string): void {
    if (this._src) {
      gl_free_texture_image(this._src);
      clean_image_texture(this);
    }
    this._src = src;

    gl_get_texture_from_image_url(
      this._src, (texture: WebGLTexture, image_size: vec2): void => {
        set_image_texture(this, texture);
        if (this._size[0] === 0 && this._size[1] === 0) {
          this.size = Array.from(image_size);
        }
      }
    )
  }
  
  /**
  * Set the image url
  * @name Image#src 
  * @type {string}
  */
  set src(v: string) {
    this.updateImage(v);
  }
  
  /**
  * Get the image url
  * @ignore
  * @return {string}
  */
  get src(): string {
    return this._src;
  }
} 
  