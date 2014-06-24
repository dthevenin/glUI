
var __gl_textures_ref = {};

function gl_get_texture_from_image_url (src, clb) {
  
  var handler = __gl_textures_ref [src];
  if (handler) {
    handler.ref_count ++;
    if (vs.util.isFunction (clb)) {
      if (handler.texture) {
        try {
          clb (handler.texture);
        }
        catch (exp) {
          if (exp.stack) console.log (exp.stack);
          console.log (exp);
        }
      }
      else {
        handler.clbs.push (clb)
      }
    }
    return;
  }
  
  handler = {};
  handler.texture = null;
  handler.ref_count = 1;
  handler.clbs = [];
  if (vs.util.isFunction (clb)) {
    handler.clbs.push (clb);
  }
  __gl_textures_ref [src] = handler;

  var image = new Image();
  image.src = src;

  image.onload = function (e) {
    var texture;
    
    var handler = __gl_textures_ref [src];
    if (!handler) {
      // image has been deleted before it's available
      return;
    }

    texture = __copy_image_into_webgl_texture (image, texture);
    
    handler.texture = texture;
    var clbs = handler.clbs; handler.clbs = [];
    clbs.forEach (function (clb) {
      try {
        clb (texture, [image.width, image.height]);
      }
      catch (exp) {
        if (exp.stack) console.log (exp.stack);
        console.log (exp);
      }
    })
  }
}

function gl_get_texture_from_image_url_not_optimize (src, clb) {
  
  var image = new Image();
  image.src = src;

  image.onload = function (e) {
    var texture;
    texture = __copy_image_into_webgl_texture (image, texture);
    
    try {
      clb (texture, [image.width, image.height]);
    }
    catch (exp) {
      if (exp.stack) console.log (exp.stack);
      console.log (exp);
    }
  }
}

function gl_free_texture_image (src) {
  
  var handler = __gl_textures_ref [src];
  if (!handler) return;
  
  handler.ref_count --;
  if (handler.ref_count > 0) return;
  
  if (handler.texture) {
    gl_ctx.deleteTexture (handler.texture);
  }
  delete (__gl_textures_ref [src]);
}

/**
 * A vs.ui.GLImage.
 * @constructor
 * @name vs.ui.GLImage
 * @extends vs.ui.GLView
 * An vs.ui.GLImage embeds an image in your application.
 */
function GLImage (config)
{
  this.parent = GLView;
  this.parent (config);
  this.constructor = GLImage;
}

GLImage.prototype = {

  /**
   * The image url
   * @private
   * @type {string}
   */
  _src: null,
  
  /*****************************************************************
   *
   ****************************************************************/  
  /**
   * @protected
   * @function
   */
  destructor : function ()
  {
    /* TODO */
    GLView.prototype.destructor.call (this);
    
    gl_free_texture_image (this._src);
  },

  /**
   * @protected
   * @function
   */
  initComponent : function ()
  {
    GLView.prototype.initComponent.call (this);
    
    this._style.backgroundColor = GLColor.transparent;
    
    var self = this;
    this.addEventListener ('webglcontextrestored', function () {
      self.src = self._src;
    });    
    /* TODO */
  }
};
util.extendClass (GLImage, GLView);

/********************************************************************
                  Define class properties
********************************************************************/

util.defineClassProperties (GLImage, {

  'src': {
    /**
     * Set the image url
     * @name vs.ui.GLImage#src 
     * @type {string}
     */
    set : function (v) {
      if (!util.isString (v)) { return; }
      

      if (this._src) {
        gl_free_texture_image (this._src);
        clean_image_texture (this);
      }
      this._src = v;

      var self = this;
      gl_get_texture_from_image_url (
        self._src, function (texture, image_size) {
          set_image_texture (self, texture);
          if (self._size [0] === 0 && self._size [1] === 0) {
            self.size = image_size;
          }
        }
      )
    },
  
    /**
     * Get the image url
     * @ignore
     * @return {string}
     */
    get : function () {
      return this._src;
    }
  }
});
/********************************************************************
                      Export
*********************************************************************/
/** @private */
ui.GLImage = GLImage;
