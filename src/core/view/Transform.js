
function Transform ()
{
  this._rotation = vec3.create ();
  this._translation = vec3.create ();
  this._transform_origin = vec2.create ();
  
  this._scaling = 1;
  
  this._transform_origin [0] = 0;
  this._transform_origin [1] = 0;

  this._rotation [0] = 0;
  this._rotation [1] = 0;
  this._rotation [2] = 0;

  this._translation [0] = 0;
  this._translation [1] = 0;
  this._translation [2] = 0;

  this.__should_update_gl_matrix = true;
  this.__invalid_matrixes =  true;
}

/**
 * @protected
 * @type {boolean}
 */
Transform.prototype.__invalid_matrixes = true;

 /**
 * Scale value
 * @protected
 * @type {number}
 */
Transform.prototype._scaling = 1;

 /**
 * Rotation value
 * @protected
 * @type {vec3}
 */
Transform.prototype._rotation = null;


 /**
 * translation value
 * @protected
 * @type {vec3}
 */
Transform.prototype._translation = null;

/**
 * Transformation center (origin)
 * @protected
 * @type {vec2}
 */
Transform.prototype._transform_origin = null;

/********************************************************************
                  Define class properties
********************************************************************/

addClassProperty (Transform, 'translation', {
  /**
   * Translation vector [tx, ty]
   * <=> obj.translate (tx, ty)
   * @name vs.ui.Transform#translation
   * @type {Array}
   */
  set : function (v)
  {
    this._translation[0] = v[0];
    this._translation[1] = v[1];
    this._translation[2] = v[2] || 0;

    this.__should_update_gl_matrix = true;
    View.__should_render = true;
  },

  /**
   * @ignore
   * @type {Array}
   */
  get : function ()
  {
    //return [this.__view_t_x, this.__view_t_y];
    return this._translation;
  }
});

addClassProperty (Transform, 'rotation', {
  /**
   * Rotation angle in degre
   * @name vs.ui.Transform#rotation
   * @type {float}
   */
  set : function (v)
  {
    this._rotation[0] = v[0] || 0;
    this._rotation[1] = v[1] || 0;
    this._rotation[2] = v[2] || 0;

    this.__should_update_gl_matrix = true;
    View.__should_render = true;
  },

  /**
   * @ignore
   * @type {float}
   */
  get : function ()
  {
    return this._rotation;
  }
});

addClassProperty (Transform, 'scaling', {
  /**
   * Scale the view
   * @name vs.ui.Transform#scaling
   * @type {float}
   */
  set : function (v) {
    this._scaling = v;

    this.__should_update_gl_matrix = true;
    View.__should_render = true;
  },

  /**
   * @ignore
   * @type {float}
   */
  get : function () {
    return this._scaling;
  }
});

addClassProperty (Transform, 'transformOrigin', {
  /**
   * This property allows you to specify the origin of the 2D transformations.
   * Values are pourcentage of the view size.
   * <p>
   * The property is set by default to [50, 50], which is the center of
   * the view.
   * @name vs.ui.Transform#transformOrigin
   * @type Array.<number>
   */
  set : function (v) {
    if ((!util.isArray (v) && !(v instanceof Float32Array)) || v.length !== 2) { return; }
    if (!util.isNumber (v[0]) || !util.isNumber (v[1])) { return; }

    this._transform_origin [0] = v [0];
    this._transform_origin [1] = v [1];

    View.__should_render = true;
  },

  /**
   * @ignore
   * @return {Array}
   */
  get : function () {
    return this._transform_origin;
  }
});
