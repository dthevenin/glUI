/**
 *  The vs.ui.GLView class
 *
 *  @extends vs.core.EventSource
 *  @class
 *  vs.ui.GLView is a class that defines the basic drawing, event-handling, of
 *  an application. You typically don’t interact with the vs.ui.GLView API
 *  directly; rather, your custom view classes inherit from vs.ui.GLView and
 *  override many of its methods., Its also supports 2D
 *  transformations (translate, rotate, scale).
 *  <p>
 *  If you’re not creating a custom view class, there are few methods you
 *  need to use
 *
 *  Events:
 *  <ul>
 *    <li /> POINTER_START: Fired after the user click/tap on the view, when
 *           the user depresses the mouse/screen
 *    <li /> POINTER_MOVE: Fired after the user move the mouse/his finger on
 *           the view.
 *    <li /> POINTER_END: Fired after the user click/tap on the view, when
 *           the user release the mouse/ the pressur on screen.
 *  </ul>
 *  <p>
 *
 *  @author David Thevenin
 *
 *  @constructor
 *   Creates a new vs.ui.GLView.
 *
 * @name vs.ui.GLView
 *
 * @param {Object} config the configuration structure [mandatory]
 */
function GLView (config)
{
  this.parent = GLEventSource;
  this.parent (config);
  this.constructor = GLView;
  
  // init recognizer support
  this.__pointer_recognizers = [];
  
  this.__children = [];
  
  this.view = this;

  // position and size : according constraints rules, can change
  // automaticaly if the parent container is resized
  this._position = vec3.create ();
  this._size = vec2.create ();

  this._rotation = vec3.create ();
  this._translation = vec3.create ();
  this._transform_origin = vec2.create ();

  this.__animations = [];
  
  createGLObject (this);
}

GLView.__should_render = true;
GLView.__nb_animation = 0;

/********************************************************************

*********************************************************************/

/**
 * @private
 */
GLView._positionStyle = undefined;

/**
 * @private
 */
var _template_nodes = null;

GLView.prototype = {

  /**
   * @protected
   * @type {boolean}
   */
  __invalid_matrixes: true,

  /*****************************************************************
   *                Private members
   ****************************************************************/
  /**
   * @protected
   * @type {boolean}
   */
  _visible: true,

  /**
   *
   * @protected
   * @type {boolean}
   */
  _enable: true,

  /**
   * @protected
   * @type {Array}
   */
  _position : null,

  /**
   * @protected
   * @type {Array}
   */
  _size : null,
  
   /**
   * Scale value
   * @protected
   * @type {number}
   */
  _scaling : 1,

   /**
   * Rotation value
   * @protected
   * @type {number}
   */
  _rotation : null,
  _translation : null,
  
  _constraint: null,
  _style: null,

  /**
   * @protected
   * @type {Array.<number>}
   */
  _transform_origin: null,

  /*****************************************************************
   *
   ****************************************************************/

  /**
   * @protected
   * @function
   */
  destructor : function ()
  {
    var i, child;
    if (this.__parent) {
      this.__parent.remove (this);
    }

    for (i = 0; i < this.__children.length; i++) {
      child = this.__children [i];
      util.free (child);
    }
    delete (this.__children);

    this.clearTransformStack ();
  
    deleteGLObject (this);

    GLEventSource.prototype.destructor.call (this);
  },

  /**
   * @protected
   * @function
   */
  refresh : function ()
  {
    this._updateSizeAndPos ();
    
    var i = 0, l = this.__children.length, child;

    for (; i < l; i++) {
      child = this.__children [i];
      if (!child || !child.refresh) { continue; }
      child.refresh ();
    }
  },

  /**
   * @protected
   * @function
   */
  initComponent : function ()
  {
    GLEventSource.prototype.initComponent.call (this);

    this._style = new GLStyle ();
    this._constraint = null;

    if (!this.__config__) this.__config__ = {};
    this.__config__.id = this.id;
    
    this._position[0] = 0;
    this._position[1] = 0;
    this._position[2] = 0;
    
    this._size[0] = 0;
    this._size[1] = 0;
    
    this._transform_origin [0] = 0;
    this._transform_origin [1] = 0;

    this._rotation [0] = 0;
    this._rotation [1] = 0;
    this._rotation [2] = 0;

    this._translation [0] = 0;
    this._translation [1] = 0;
    this._translation [2] = 0;
    
    this.__should_update_gl_vertices = true;
    this.__should_update_gl_matrix = true;
  },

  /**
   * Notifies that the component's view was added to the DOM.<br/>
   * You can override this method to perform additional tasks
   * associated with presenting the view.<br/>
   * If you override this method, you must call the parent method.
   *
   * @name vs.ui.GLView#viewDidAdd
   * @function
   */
  viewDidAdd : function () {
    this._updateSizeAndPos ();
  },

  /**
   * @protected
   * @function
   */
  notify : function (event) {},
  
  /**
   *  Instantiate, init and add the specified child component to this component.
   *  <p>
   *  The view of the MyGUIComponent is dynamically loaded (from file),
   *  instanciated and  added into the HTML DOM.
   *  <p>
   *  @example
   *  var id =
   *    myObject.createAndAddComponent ('MyGUIComponent', config, 'children');
   *
   * @name vs.ui.GLView#createAndAddComponent
   * @function
   *
   * @param {String} comp_name The GUI component name to instanciate
   * @param {Object} config Configuration structure need to build the component.
   * @param {String} extension The hole into the vs.ui.GLView will be insert.
   * @return {vs.core.Object} the created component
   */
  createAndAddComponent : function (comp_name, config, extension)
  {
    var comp_class = window [comp_name];
    if (!comp_class) {
      console.error ("Impossible to fund component '" + comp_name + "'.");
      return;
    }

    // verify the component view already exists
    if (!config) {config = {};}

    if (!config.id) { config.id = core.createId (); }

    var path, data, xmlRequest, div, children, i, len, obj, msg;

    obj = null;

    // Build object
    try { obj = new comp_class (config); }
    catch (exp)
    {
      msg = "Impossible to instanciate comp: " + comp_name;
      msg += " => " + exp.message;
      console.error (msg);
      if (exp.stack) console.error (exp.stack);
      return;
    }

    // Initialize object
    try
    {
      obj.init ();
      obj.configure (config);
    }
    catch (exp)
    {
      if (exp.line && exp.sourceURL)
      {
        msg = "Error when initiate comp: " + comp_name;
        msg += " => " + exp.message;
        msg += "\n" + exp.sourceURL + ":" + exp.line;
      }
      else { msg = exp; }
      console.error (msg);
      if (exp.stack) console.error (exp.stack);
    }

    // Add object to its parent
    this.add (obj, extension);
    obj.refresh ();

    return obj;
  },

  /**
   *  Return true if the set component is a child o the current component
   *
   * @name vs.ui.GLView#isChild
   * @function
   *
   * @param {vs.GLEventSource} child The component to be removed.
   * @return {boolean}
   */
  isChild : function (child)
  {
    if (!child) { return false; }

    if (this.__children.indexOf (child) !== -1) {
      return true;
    }

    return false;
  },

  /**
   *  Add the specified child component to this component.
   *  <p>
   *  The component can be a graphic component (vs.ui.GLView) or
   *  a non graphic component (vs.GLEventSource).
   *  In case of vs.ui.GLView its mandatory to set the extension.
   *  <p>
   *  The add is a lazy add! The child's view can be already in
   *  the HTML DOM. In that case, the add methode do not modify the DOM.
   *  <p>
   *  @example
   *  var myButton = new Button (conf);
   *  myObject.add (myButton, 'children');
   *
   * @name vs.ui.GLView#add
   * @function
   *
   * @param {vs.GLEventSource} child The component to be added.
   * @param {String} extension [optional] The hole into a vs.ui.GLView will be
   *       insert.
   */
  add : function (child)
  {
    if (!child) { return; }

    if (this.isChild (child)) { return; }

    this.__children.push (child);

    child.__parent = this;
    if (this.__i__ && child.__i__ && child.viewDidAdd) {
      child.viewDidAdd ();
    }
    
    vs.scheduleAction (function () {
      GLView.__should_render = true;
    });
  },

  /**
   *  Remove the specified child component from this component.
   *
   *  @example
   *  myObject.remove (myButton);
   *
   * @name vs.ui.GLView#remove
   * @function
   *
   * @param {vs.GLEventSource} child The component to be removed.
   */
  remove : function (child)
  {
    if (!child) { return; }
    
    if (!this.isChild (child)) { return; }

    this.__children.remove (child);
    child.__parent = null;
    
    vs.scheduleAction (function () {
      GLView.__should_render = true;
    });
  },

  /**
   *  Remove all children components from this component and free them.
   *
   *  @example
   *  myObject.removeAllChildren ();
   *
   * @name vs.ui.GLView#removeAllChild
   * @function
   * @param {Boolean} should_free free children
   * @param {String} extension [optional] The hole from witch all views will be
   *   removed
   * @return {Array} list of removed child if not should_free
   */
  removeAllChildren : function (should_free)
  {
    var child, children = [];

    while (this.__children.length) {
      child = this.__children [0];
      this.remove (child);
      if (should_free) util.free (child);
      else children.push (child);
    }
    
    return (should_free)?undefined:children;
    
    vs.scheduleAction (function () {
      GLView.__should_render = true;
    });
  },

/********************************************************************
                  GUI Utilities
********************************************************************/

  /**
   * @protected
   * @function
   * This function cost a lot!
   */
  _updateSizeAndPos : function ()
  {
    if (this._constraint) {
      this._constraint.__update_view (this);
    }

    this.__should_update_gl_vertices = true;
    this.__should_update_gl_matrix = true;
  },
  
/********************************************************************

********************************************************************/

  /**
   *  Force the redraw of your widget.
   *  <p>
   *  Some time a redraw is required to force the browser to rerender
   *  a part of you GUI or the entire GUI.
   *  Call redraw function on you Application object for a entire redraw or just
   *  on a specific widget.
   *
   * @name vs.ui.GLView#redraw
   * @function
   *
   * @param {Function} clb Optional function to call after the redraw
   */
  redraw : function (clb)
  {
    this._updateSizeAndPos ();
  },

  /**
   *  Displays the GUI Object
   *
   * @name vs.ui.GLView#show
   * @param {Function} clb a function to call a the end of show process
   * @function
   */
  show : function (clb)
  {
    if (this._visible) { return; }
    if (!util.isFunction (clb)) clb = undefined;

    this.__is_hidding = false;
    this.__is_showing = true;

    this._show_object (clb);
  },

  /**
   *  Show the GUI Object
   *
   * @private
   * @param {Function} clb a function to call a the end of show process
   * @function
   */
  _show_object : function (clb)
  {
    vs.scheduleAction (function () {
      GLView.__should_render = true;
    });
    
    this.__visibility_anim = undefined;

    if (!this.__is_showing) { return; }
    this.__is_showing = false;

    this._visible = true;
    var self = this;

    this.propertyChange ();
    if (clb) {
      if (clb) {
        vs.scheduleAction (function () {clb.call (self);});
      }
    }
  },

  __gl_update_animation : function (now) {
    var i = 0, l = this.__animations.length, anim;
    for (;i<l; i++) {
      anim = this.__animations [i];
      anim._clock (now);
    }
  },

  /**
   * @name vs.ui.View#_clone
   * @function
   * @private
   *
   * @param {vs.core.Object} obj The cloned object
   * @param {Object} map Map of cloned objects
   */
  _clone : function (obj, cloned_map)
  {
    var anim, a, key, child, l, hole, cloned_comp;

    GLEventSource.prototype._clone.call (this, obj, cloned_map);

    if (this._style) {
      if (!obj._style) {
        obj.style = this._style.clone ();
      }
      else {
        this._style.copy (obj._style);
      }
//      console.log (obj.style);
    }

    // remove parent link
    obj.__parent = undefined;

    function getClonedComp (comp, cloned_map) {
      if (!comp || !cloned_map) return null;
      
      if (cloned_map [comp._id]) return cloned_map [comp._id];
      
      var  view = cloned_map.__views__ [comp._id];
        
      return (view)?view._comp_:null;
    }
    
    var self = this;
    this.__children.forEach (function (child, index) {
      var cloned_child = child.clone ();
      
      cloned_map [child._id] = cloned_child;
      
      obj.add (cloned_child);
    });
  },

  /**
   *  Hides the GUI Object
   *
   * @name vs.ui.GLView#hide
   * @param {Function} clb a function to call a the end of show process
   * @function
   */
  hide : function (clb)
  {
    if (!this._visible && !this.__is_showing) { return; }
    if (!util.isFunction (clb)) clb = undefined; 

    this._visible = false;
    
    this.__is_showing = false;
    this.__is_hidding = true;

    this._hide_object (clb);
  },

  /**
   *  Hides the GUI Object
   *
   * @private
   * @function
   * @param {Function} clb a function to call a the end of show process
   */
  _hide_object: function (clb) {
    vs.scheduleAction (function () {
      GLView.__should_render = true;
    });
    
    if (this._visible) { return; }
    this.__visibility_anim = undefined;

    if (!this.__is_hidding) { return; }
    
    this.__is_hidding = false;
    if (clb) {
      if (clb) {
        vs.scheduleAction (function () {clb.call (self);});
      }
    }
    this.propertyChange ();
  },

/********************************************************************

********************************************************************/

  /**
   * @protected
   * @function
   */
  _propagateToParent : function (e)
  {
    if (this.__parent) {
      
      if (this.__parent.handleEvent) {
        to_propatate = this.__parent.handleEvent (e);
      }
      
      if (to_propatate) {
        this.__parent._propagateToParent (e);
      }
    }
  },

  /**
   * @name vs.ui.GLView#notifyToParent
   * @function
   */
  notifyToParent : function (e)
  {
    if (!this.__parent) { return; }
    if (this.__parent.handleEvent)
    {
      this.__parent.handleEvent (e);
    }
    else if (this.__parent.notify)
    {
      this.__parent.notify (e);
    }
  },

  /**
   * Did enable delegate
   * @name vs.ui.GLView#_didEnable
   * @protected
   */
  _didEnable : function () {},

  /*****************************************************************
   *                Animation methods
   ****************************************************************/

  _clone_properties_value : function (obj, cloned_map)
  {
    var key;
    
    for (key in this)
    {
      if (key == 'id' || key == 'view' || key == '__parent' ||
          key == 'style' || key == '_style') continue;

      // property value copy
      if (this.isProperty (key)) {
        vs.core.Object.__propertyCloneValue (key, this, obj);
      }
      else if (this [key] instanceof GLView) {
        obj [key] = cloned_map [this [key]._id];
      }
    }
  }
};
util.extend (GLView.prototype, vs.ui.RecognizerManager);
util.extendClass (GLView, GLEventSource);

/********************************************************************
                  Define class properties
********************************************************************/

util.defineClassProperties (GLView, {

  'size': {
    /**
     * Getter|Setter for size. Gives access to the size of the GUI Object
     * @name vs.ui.GLView#size
     *
     * @type {Array.<number>}
     */
    set : function (v)
    {
      if ((!util.isArray (v) && !(v instanceof Float32Array)) || v.length !== 2) { return; }
      if (!util.isNumber (v[0]) || !util.isNumber(v[1])) { return; }

      this._size [0] = v [0];
      this._size [1] = v [1];

      this._updateSizeAndPos ();
    },

    /**
     * @ignore
     * @type {Array.<number>}
     */
    get : function ()
    {
      return this._size;
    }
  },

  'position': {
    /**
     * Getter|Setter for position. Gives access to the position of the GUI
     * Object
     * @name vs.ui.GLView#position
     *
     * @type Array
     */
    set : function (v)
    {
      if (!v) { return; }
      if ((!util.isArray (v) && !(v instanceof Float32Array)) || (v.length != 2 && v.length != 3)) { return; }
      if (!util.isNumber (v[0]) || !util.isNumber(v[1])) { return; }
      if (!util.isNumber(v[2])) v[2] = 0;
      
      vec3.set (v, this._position);

      this._updateSizeAndPos ();
    },

    /**
     * @ignore
     * @type {Array.<number>}
     */
    get : function ()
    {
      return this._position;
    }
  },

  'visible': {

    /**
     * Hide or show the object.
     * obj.visible = true <=> obj.show (), obj.visible = false <=> obj.hide (),
     * @name vs.ui.GLView#visible
     * @type {boolean}
     */
    set : function (v)
    {
      if (v)
      { this.show (); }
      else
      { this.hide (); }
    },

    /**
     * Return true is the object is visible. False otherwise.
     * @ignore
     * @type {boolean}
     */
    get : function ()
    {
      return this._visible;
    }
  },

  'enable': {

    /**
     * Activate or deactivate a view.
     * @name vs.ui.GLView#enable
     * @type {boolean}
     */
    set : function (v)
    {
      if (v && !this._enable)
      {
        this._enable = true;
        this._didEnable ();
      }
      else if (!v && this._enable)
      {
        this._enable = false;
        this._didEnable ();
      }
      
      GLView.__should_render = true;
    },

    /**
     * @ignore
     * @return {boolean}
     */
    get : function ()
    {
      return this._enable;
    }
  },

  'translation': {

    /**
     * Translation vector [tx, ty]
     * <=> obj.translate (tx, ty)
     * @name vs.ui.GLView#translation
     * @type {Array}
     */
    set : function (v)
    {
      this._translation[0] = v[0];
      this._translation[1] = v[1];
      this._translation[2] = v[2] || 0;

      this.__should_update_gl_matrix = true;
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
  },

  'rotation': {

    /**
     * Rotation angle in degre
     * @name vs.ui.GLView#rotation
     * @type {float}
     */
    set : function (v)
    {
      this._rotation[0] = v[0] || 0;
      this._rotation[1] = v[1] || 0;
      this._rotation[2] = v[2] || 0;

      this.__should_update_gl_matrix = true;
    },

    /**
     * @ignore
     * @type {float}
     */
    get : function ()
    {
      return this._rotation;
    }
  },

  'scaling': {

    /**
     * Scale the view
     * @name vs.ui.GLView#scaling
     * @type {float}
     */
    set : function (v)
    {
      this._scaling = v || 1;

      this.__should_update_gl_matrix = true;
    },

    /**
     * @ignore
     * @type {float}
     */
    get : function ()
    {
      return this._scaling;
    }
  },

  'opacity': {

    /**
     * Scale the view
     * @name vs.ui.GLView#scaling
     * @type {float}
     */
    set : function (v)
    {
      this._style.opacity = v
    },

    /**
     * @ignore
     * @type {float}
     */
    get : function ()
    {
      return this._style.opacity;
    }
  },

  'transformOrigin': {

    /**
     * This property allows you to specify the origin of the 2D transformations.
     * Values are pourcentage of the view size.
     * <p>
     * The property is set by default to [50, 50], which is the center of
     * the view.
     * @name vs.ui.GLView#transformOrigin
     * @type Array.<number>
     */
    set : function (v)
    {
      if ((!util.isArray (v) && !(v instanceof Float32Array)) || v.length !== 2) { return; }
      if (!util.isNumber (v[0]) || !util.isNumber (v[1])) { return; }

      this._transform_origin [0] = v [0];
      this._transform_origin [1] = v [1];
      
      GLView.__should_render = true;
    },

    /**
     * @ignore
     * @return {Array}
     */
    get : function ()
    {
      return this._transform_origin;
    }
  },
  
  'style': {

    /**
     * Rotation angle in degre
     * @name vs.ui.GLView#style
     * @type {GLStyle}
     */
    set : function (v)
    {
      if (!(v instanceof GLStyle)) return; 
      this._style = v;
      GLView.__should_render = true;
    },

    /**
     * @ignore
     * @type {GLStyle}
     */
    get : function ()
    {
      return this._style;
    }
  },

  'constraint': {

    /**
     * Rotation angle in degre
     * @name vs.ui.GLView#constraint
     * @type {GLStyle}
     */
    set : function (v)
    {
      if (!(v instanceof GLConstraint)) return; 
      
      if (this._constraint) {
        delete (this._constraint);
      }
      
      this._constraint = v;
      GLView.__should_render = true;
    },

    /**
     * @ignore
     * @type {GLStyle}
     */
    get : function ()
    {
      if (!this._constraint) {
        this._constraint = new GLConstraint ();
      }
      return this._constraint;
    }
  }
});

/********************************************************************
                      Export
*********************************************************************/
/** @private */
vs.ui.GLView = GLView;
