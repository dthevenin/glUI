/**
 * A Image.
 * @constructor
 * @name Image
 * @extends vs.ui.View
 * An Image embeds an image in your application.
 */
function gl_Image (config)
{
  this.parent = View;
  this.parent (config);
  this.constructor = gl_Image;
}

/**
 * The image url
 * @private
 * @type {string}
 */
gl_Image.prototype._src = null;

/*****************************************************************
 *
 ****************************************************************/  
/**
 * @protected
 * @function
 */
gl_Image.prototype.destructor = function ()
{
  /* TODO */
  View.prototype.destructor.call (this);

  gl_free_texture_image (this._src);
};

/**
 * @protected
 * @function
 */
gl_Image.prototype.initComponent = function ()
{
  View.prototype.initComponent.call (this);

  this._style.backgroundColor = Color.transparent;

  var self = this;
  this.addEventListener ('webglcontextrestored', function () {
    self.src = self._src;
  });    
  /* TODO */
};

util.extendClass (gl_Image, View);

/********************************************************************
                  Define class properties
********************************************************************/
  
util.addClassProperty (gl_Image, 'src', {
  /**
   * Set the image url
   * @name Image#src 
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
});
