var
  util = vs.util,
  core = vs.core,
  ui = vs.ui;


var __unique_gl_id = 1;
var GL_VIEWS = [];

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
  this.parent = core.EventSource;
  this.parent (config);
  this.constructor = GLView;
  
  // init recognizer support
  this.__pointer_recognizers = [];
  
  this.__gl_matrix = mat4.create ();
  mat4.identity (this.__gl_matrix);
  
  this.__gl_p_matrix = mat4.create ();
  this.__gl_m_matrix = mat4.create ();
  
  this._rotation = vec3.create ();

  this.__gl_id = __unique_gl_id ++;
  GL_VIEWS [this.__gl_id] = this;
  
  // contains position vertices
  this.__gl_vertices = new Float32Array (12);
  this.__gl_vertices_buffer = gl_ctx.createBuffer ();
  this.__vertex_1 = vec3.create ();
  this.__vertex_2 = vec3.create ();
  this.__vertex_3 = vec3.create ();
  this.__vertex_4 = vec3.create ();

  this.__children = [];
  this._pointerevent_handlers = [];
  
  this.view = this;
  this._pointer_start = [];
  this._pointer_move = [];
  this._pointer_end = [];

  // position and size : according autosizing rules, can change
  // automaticaly if the parent container is resized
  this._position = vec3.create ();
  this._size = [0, 0];
  this._transform_origin = [0, 0];

  // rules for positionning a object
  this._autosizing = [4,4];
  
  this.__animations = [];
}

GLView.__should_render = true;
GLView.__nb_animation = 0;

/********************************************************************
                    Layout constant
*********************************************************************/

/**
 * No particular layout
 * @see vs.ui.GLView#layout
 * @name vs.ui.GLView.DEFAULT_LAYOUT
 * @const
 */
GLView.DEFAULT_LAYOUT = null;

/**
 * Horizontal layout
 * @see vs.ui.GLView#layout
 * @name vs.ui.GLView.HORIZONTAL_LAYOUT
 * @const
 */
GLView.HORIZONTAL_LAYOUT = 'horizontal';

/**
 * Vertical layout
 * @see vs.ui.GLView#layout
 * @name vs.ui.GLView.VERTICAL_LAYOUT
 * @const
 */
GLView.VERTICAL_LAYOUT = 'vertical';

/**
 * Absolute layout
 * @see vs.ui.GLView#layout
 * @name vs.ui.GLView.ABSOLUTE_LAYOUT
 * @const
 */
GLView.ABSOLUTE_LAYOUT = 'absolute';

/**
 * Html flow layout
 * @see vs.ui.GLView#layout
 * @name vs.ui.GLView.FLOW_LAYOUT
 * @const
 */
GLView.FLOW_LAYOUT = 'flow';

/********************************************************************
                    Magnet contants
*********************************************************************/

/**
 * No magnet
 * @name vs.ui.GLView.MAGNET_NONE
 * @const
 */
GLView.MAGNET_NONE = 0;

/**
 * The widget will be fixed on left
 * @name vs.ui.GLView.MAGNET_LEFT
 * @const
 */
GLView.MAGNET_LEFT = 3;

/**
 * The widget will be fixed on bottom
 * @name vs.ui.GLView.MAGNET_BOTTOM
 * @const
 */
GLView.MAGNET_BOTTOM = 2;

/**
 * The widget will be fixed on top
 * @name vs.ui.GLView.MAGNET_TOP
 * @const
 */
GLView.MAGNET_TOP = 1;

/**
 * The widget will be fixed on right
 * @name vs.ui.GLView.MAGNET_RIGHT
 * @const
 */
GLView.MAGNET_RIGHT = 4;

/**
 * The widget will centered
 * @name vs.ui.GLView.MAGNET_CENTER
 * @const
 */
GLView.MAGNET_CENTER = 5;

/********************************************************************

*********************************************************************/

/**
 * @private
 */
GLView.NON_G_OBJECT = '_non_g_object';
/**
 * @private
 */
GLView.ANY_PLACE = 'children';
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
  __gl_context: null,
  __gl_object: true,
  __gl_texture: null,
  __gl_vertices_buffer: null,
  __gl_id: null,
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
   * @protected
   * @type {number}
   */
  _magnet: GLView.MAGNET_NONE,

  /**
   * @private
   * @type {Array.<int>}
   */
  _autosizing: null,

  /**
   * @protected
   * @type {Object}
   */
  _pointerevent_handlers: null,

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
   * Translate value on x
   * @private
   * @type {number}
   */
  __view_t_x : 0,

  /**
   * Translate value on y
   * @private
   * @type {number}
   */
  __view_t_y : 0,

  /**
   * @protected
   * @type {Array}
   */
  _size : null,
  
  /**
   * @protected
   * @type {Array}
   */
  __gl_vertices: null,
  __gl_matrix: null,
  __gl_m_matrix: null,
  __gl_p_matrix: null,

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

   /**
   * @protected
   * @type {String}
   */
  _layout: null,
  
  
  _constraint: null,
  _style: null,

  /**
   * @protected
   * @type {Array.<number>}
   */
  _transform_origin: null,

  /**
   * @protected
   * @type {vs.CSSMatrix}
   */
  _transforms_stack: null,

  /**
   * @protected
   * @type {vs.fx.Animation}
   */
  _show_animation: null,
  __show_clb: null,

  /**
   * @protected
   * @type {vs.fx.Animation}
   */
  _hide_animation: null,
  __hide_clb: null,

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
    
    if (this.__gl_texture) {
      gl_ctx.deleteTexture (this.__gl_texture);
      this.__gl_texture = null;
    }

    core.EventSource.prototype.destructor.call (this);
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
    core.EventSource.prototype.initComponent.call (this);

    this._style = new GLStyle ();
    this._constraint = null;

    if (!this.__config__) this.__config__ = {};
    this.__config__.id = this.id;
  },

  /**
   * @protected
   * @function
   */
  componentDidInitialize : function ()
  {
    core.EventSource.prototype.componentDidInitialize.call (this);

    if (this._magnet === GLView.MAGNET_CENTER)
    {
      this._updateSizeAndPos ();
//      this._applyTransformation ();
    }
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
  
  _pointer_start : null,
  _pointer_move : null,
  _pointer_end : null,
  
  addEventListener: function (type, handler, useCapture) {
    switch (type) {
      case vs.POINTER_START:
        this._pointer_start.push (handler);
        __gl_activate_pointer_start ()
        break;
    
      case vs.POINTER_MOVE:
        this._pointer_move.push (handler);
        __gl_activate_pointer_move ()
        break;
    
      case vs.POINTER_END:
        this._pointer_end.push (handler);
        __gl_activate_pointer_end ()
        break;
    }
//    console.log ("addEventListener:" + type);  
  },

  removeEventListener: function (type, handler, useCapture) {
    switch (type) {
      case vs.POINTER_START:
        this._pointer_start.remove (handler);
        __gl_deactivate_pointer_start ()
        break;
    
      case vs.POINTER_MOVE:
        this._pointer_move.remove (handler);
        __gl_deactivate_pointer_move ()
        break;
    
      case vs.POINTER_END:
        this._pointer_end.remove (handler);
        __gl_deactivate_pointer_end ()
        break;
    }
//    console.log ("removeEventListener: " + type);  
  },

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
   * @param {vs.core.EventSource} child The component to be removed.
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
   *  a non graphic component (vs.core.EventSource).
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
   * @param {vs.core.EventSource} child The component to be added.
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
   * @param {vs.core.EventSource} child The component to be removed.
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
   *  The event bind method to listen events
   *  <p>
   *  When you want listen an event generated by this object, you can
   *  bind your object (the observer) to this object using 'bind' method.
   *  <p>
   *  Warning:<br>
   *  If you know the process of your callback can take time or can be blocking
   *  you should set delay to 'true' otherwise you application will be stuck.
   *  But be careful this options add an overlay in the event propagation.
   *  For debug purpose or more secure coding you can force delay to true, for
   *  all bind using global variable vs.core.FORCE_EVENT_PROPAGATION_DELAY.<br/>
   *  You just have set as true (vs.core.FORCE_EVENT_PROPAGATION_DELAY = true)
   *  at beginning of your program.
   *
   * @name vs.ui.GLView#bind
   * @function
   *
   * @param {string} spec the event specification [mandatory]
   * @param {vs.core.Object} obj the object interested to catch the event
   *    [mandatory]
   * @param {string} func the name of a callback. If its not defined
   *        notify method will be called [optional]
   * @param {boolean} delay if true the callback 'func' will be call within
   *        an other "simili thread".
   */
//  bind : function (spec, obj, func, delay) { /* TODO */ },

  /**
   *  The event unbind method
   *  <p>
   *  Should be call when you want stop event listening on this object
   *
   * @name vs.ui.GLView#unbind
   * @function
   *
   * @param {string} spec the event specification [mandatory]
   * @param {vs.core.Object} obj the object you want unbind [mandatory]
   */
//  unbind : function (spec, obj) { /* TODO */ },

/********************************************************************
                  GUI Utilities
********************************************************************/

  /**
   * @protected
   * @function
   */
  _setMagnet : function (code)
  {
    this._magnet = code;
    
    this._updateSizeAndPos ();
 //   this._applyTransformation ();
  },

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

    this.__update_gl_vertices ();
    this.__update_transform_gl_matrix ();
  },
  
  __update_gl_vertices : function () {
    var
      obj_size = this._size,
      obj_pos = this._position,
      x = obj_pos[0],
      y = obj_pos[1],
      w = obj_size [0],
      h = obj_size [1],
      m = this.__gl_vertices;
          
    // setup position vertices
    m[0] = x; m[1] = y; m[2] = 0;
    m[3] = x; m[4] = y + h; m[5] = 0;
    m[6] = x + w; m[7] = y; m[8] = 0;
    m[9] = x + w; m[10] = y + h; m[11] = 0;
    
    gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, this.__gl_vertices_buffer);
    gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, m, gl_ctx.STATIC_DRAW); 
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

    if (this._show_animation) {
      this._show_animation.process (this, function () {
        this._show_object (clb);
      }, this);
    }
    else {
      this._show_object (clb);
    }
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
    if (this.__show_clb || clb) {
      if (this._show_animation) {
        if (this.__show_clb) this.__show_clb.call (this);
        if (clb) clb.call (this);
      }
      else {
        if (this.__show_clb) {
          vs.scheduleAction (function () {self.__show_clb.call (self);});
        }
        if (clb) {
          vs.scheduleAction (function () {clb.call (self);});
        }
      }
    }
  },

  /**
   *  Set the animation used when the view will be shown.
   *  <br/>
   * Options :
   * <ul>
   *   <li /> duration: animation duration for all properties
   *   <li /> timing: animation timing for all properties
   *   <li /> origin: Specifies the number of times an animation iterates.
   *   <li /> iterationCount: Sets the origin for the transformations
   *   <li /> delay: The time to begin executing an animation after it
   *          is applied
   * </ul>
   *
   *  Ex:
   *  @example
   *  myComp.setShowAnimation ([['translate', '0,0,0'], ['opacity', '1']]);
   *
   *  @example
   *  myAnim = new ABTranslateAnimation (50, 50);
   *  myComp.setShowAnimation (myAnim);
   *
   * @name vs.ui.GLView#setShowAnimation
   * @function
   *
   * @param animations {Array|vs.fx.Animation} array of animation <property,
   *        value>, or an vs.fx.Animation object
   * @param options {Object} list of animation options
   * @param clb {Function} the method to call when the animation end
   * @return {String} return the identifier of the animation process. You can
   *       use it to stop the animation.
   */
  setShowAnimation:function (animations, options, clb)
  {
    if (typeof animations === "undefined" || animations === null)
    {
      this._show_animation = null;
    }
    else
    {
      if (animations instanceof vs.fx.Animation)
      {
        this._show_animation = animations.clone ();
      }
      else if (util.isArray (animations))
      {
        this._show_animation = new vs.fx.Animation ();
        this._show_animation.setAnimations (animations);
      }
      else
      {
        console.warn ('vs.ui.GLView.setShowAnimation invalid parameters!');
        return;
      }
      if (options)
      {
        if (options.duration)
        { this._show_animation.duration = options.duration; }
        if (options.timing)
        { this._show_animation.timing = options.timing; }
        if (options.origin)
        { this._show_animation.origin = options.origin; }
        if (options.iterationCount)
        { this._show_animation.iterationCount = options.iterationCount; }
        if (options.delay)
        { this._show_animation.delay = options.delay; }
      }
    }
    if (util.isFunction (clb)) { this.__show_clb = clb; }
    else { this.__show_clb = clb; }
  },

  __gl_update_animation : function (now) {
    if (this.__animations.length) {
      this.__animations.forEach (function (chrono) {
        chrono._clock (now);
      });
    }
  },














  /**
   * @name vs.ui.View#clone
   * @function
   * @private
   *
   * @param {vs.core.Object} obj The cloned object
   * @param {Object} map Map of cloned objects
   */
  clone : function (config, cloned_map)
  {
//     function _getPaths (root, nodes)
//     {
//       var paths = [], i = 0, l = nodes.length, node;
//       for (; i < l; i++)
//       {
//         node = nodes[i];
//         paths.push ([node, _getPath (root, node)]);
//       }
//       return paths;
//     }
// 
//     function _evalPaths (root, paths, clonedViews)
//     {
//       var nodes = [], i = 0, l = paths.length, path;
//       for (; i < l; i++)
//       {
//         path = paths[i];
//         if (!path.id) path.id = core.createId ();
//         clonedViews [path[0].id] = _evalPath (root, path[1]);
//       }
//     }
// 
//     function makeClonedNodeMap (comp, clonedViews)
//     {
//       var
//         clonedNode = comp.view.cloneNode (true),
//         nodes = [], paths;
//         
//       function manageChild (child)
//       {
//         if (child.__gui_object__hack_view__)
//         { nodes.push (child.__gui_object__hack_view__); }
//         else if (child.view) { nodes.push (child.view); }
//       
//         retreiveChildNodes (child);
//       }
//         
//       function retreiveChildNodes (comp)
//       {
//         var key, a, i, l, child;
//         for (key in comp.__children)
//         {
//           a = comp.__children [key];
//           if (!a) { continue; }
//           
//           if (util.isArray (a))
//           {
//             l = a.length;
//             for (i = 0; i < l; i++)
//             {
//               manageChild (a [i]);
//             }
//           }
//           else manageChild (a);
//         }
//       }
//       
//       retreiveChildNodes (comp);
//       
//       paths = _getPaths (comp.view, nodes);
//       _evalPaths (clonedNode, paths, clonedViews);
//       
//       return clonedNode;
//     }
    
    if (!cloned_map) { cloned_map = {}; }
//    if (!cloned_map.__views__) { cloned_map.__views__ = {}; }    
    if (!config) { config = {}; }
//     if (!config.node)
//     {
//       var node = cloned_map.__views__ [this.view.id];
//       if (!node)
//       {
//         node = makeClonedNodeMap (this, cloned_map.__views__);
//       }
//       config.node = node;
//     }

    return core.EventSource.prototype.clone.call (this, config, cloned_map);
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

    core.EventSource.prototype._clone.call (this, obj, cloned_map);

    // animations clone
//     if (this._show_animation)
//     {
//       anim = cloned_map [this._show_animation._id];
//       if (anim)
//         obj._show_animation = anim;
//       else
//         obj._show_animation = this._show_animation.clone ();
// 
//       obj.__show_clb = this.__show_clb;
//     }
//     if (this._hide_animation)
//     {
//       anim = cloned_map [this._hide_animation._id];
//       if (anim)
//         obj._hide_animation = anim;
//       else
//         obj._hide_animation = this._hide_animation.clone ();
// 
//       obj.__hide_clb = this.__hide_clb;
//     }

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
    
    if (this._hide_animation) {
      this._hide_animation.process (this, function () {
        this._hide_object (clb);
      }, this);
    }
    else {
      this._hide_object (clb);
    }
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
    if (this.__hide_clb || clb) {
      if (this._show_animation) {
        if (this.__hide_clb) this.__hide_clb.call (this);
        if (clb) clb.call (this);
      }
      else {
        if (this.__hide_clb) {
          vs.scheduleAction (function () {self.__hide_clb.call (self);});
        }
        if (clb) {
          vs.scheduleAction (function () {clb.call (self);});
        }
      }
    }
    this.propertyChange ();
  },

  /**
   *  Set the animation used when the view will be hidden.
   * <br/>
   * Options :
   * <ul>
   *   <li /> duration: animation duration for all properties
   *   <li /> timing: animation timing for all properties
   *   <li /> origin: Specifies the number of times an animation iterates.
   *   <li /> iterationCount: Sets the origin for the transformations
   *   <li /> delay: The time to begin executing an animation after it
   *          is applied
   * </ul>
   *
   *  Ex:
   *  @example
   *  myComp.setHideAnimation ([['translate', '100px,0,0'], ['opacity', '0']], options);
   *
   *  @example
   *  myAnim = new ABTranslateAnimation (50, 50);
   *  myComp.setHideAnimation (myAnim, t);
   *
   * @name vs.ui.GLView#setHideAnimation
   * @function
   *
   * @param animations {Array|vs.fx.Animation} array of animation <property,
   *        value>, or an vs.fx.Animation object
   * @param options {Object} list of animation options
   * @param clb {Function} the method to call when the animation end
   * @return {String} return the identifier of the animation process. You can
   *       use it to stop the animation.
   */
  setHideAnimation: function (animations, options, clb)
  {
    if (typeof animations === "undefined" || animations === null)
    {
      this._hide_animation = null;
    }
    else
    {
      if (animations instanceof vs.fx.Animation)
      {
        this._hide_animation = animations.clone ();
      }
      else if (util.isArray (animations))
      {
        this._hide_animation = new vs.fx.Animation ();
        this._hide_animation.setAnimations (animations);
      }
      else
      {
        console.warn ('vs.ui.GLView.setHideAnimation invalid parameters!');
        return;
      }
      if (options)
      {
        if (options.duration)
        { this._hide_animation.duration = options.duration; }
        if (options.timing)
        { this._hide_animation.timing = options.timing; }
        if (options.origin)
        { this._hide_animation.origin = options.origin; }
        if (options.iterationCount)
        { this._hide_animation.iterationCount = options.iterationCount; }
        if (options.delay)
        { this._hide_animation.delay = options.delay; }
      }
    }
    if (util.isFunction (clb)) { this.__hide_clb = clb; }
    else { this.__hide_clb = clb; }
  },

/********************************************************************
                  state management
********************************************************************/

  /**
   *  Set the visibility of the vs.ui.GLView.
   *
   *  <p>
   *  @example
   *  myObject.setVisible (false);
   *
   * @name vs.ui.GLView#setVisible
   * @function
   *
   * @param {Boolean} visibility The visibility can be 'true' or 'false'.
   */
//   setVisible: function (visibility)
//   {
//   },


/********************************************************************

********************************************************************/

  /**
   * @protected
   * @function
   */
  _propagateToParent : function (e)
  {
    var to_propatate = this._bubbling;
    if (!to_propatate) return;
    
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
  },
  
  /**
   *  Animate the component view.
   *
   *  Ex:
   *  @example
   *  myComp.animate ([['translate', '100px,0,0'], ['opacity', '0']]);
   *
   *  @example
   *  myAnim = new ABTranslateAnimation (50, 50);
   *  myComp.animate (myAnim); //<=> myAnim.process (myAnim);
   *
   * Options :
   * <ul>
   *   <li /> duration: animation duration for all properties
   *   <li /> timing: animation timing for all properties
   *   <li /> origin: Specifies the number of times an animation iterates.
   *   <li /> iterationCount: Sets the origin for the transformations
   *   <li /> delay: The time to begin executing an animation after it
   *          is applied
   * </ul>
   *
   * @name vs.ui.GLView#animate
   * @function
   *
   * @param animations {Array|vs.fx.Animation} array of animation
   *     <property, value>, or an vs.fx.Animation object
   * @param options {Object} list of animation options
   * @param clb {Function} the method to call when the animation end
   * @return {String} return the identifier of the animation process. You can
   *       use it to stop the animation.
   */
  animate: function (animations, options, clb)
  {
    var anim;
    if (animations instanceof vs.fx.Animation)
    {
      anim = animations
    }
    else if (util.isArray (animations))
    {
      var anim = new vs.fx.Animation ();
      anim.setAnimations (animations);
    }
    else
    {
      console.warn ('vs.ui.GLView.animate invalid parameters!');
      return;
    }
    if (options)
    {
      if (options.duration) { anim.duration = options.duration; }
      if (options.timing) { anim.timing = options.timing; }
      if (options.origin) { anim.origin = options.origin; }
      if (options.iterationCount)
      { anim.iterationCount = options.iterationCount; }
      if (options.delay) { anim.delay = options.delay; }
    }
    return anim.process (this, clb, this);
  },

  /*****************************************************************
   *                Transformation methods
   ****************************************************************/

  /**
   *  Move the view in x, y.
   *
   * @name vs.ui.GLView#translate
   * @function
   *
   * @param x {int} translation over the x axis
   * @param y {int} translation over the y axis
   */
  translate: function (x, y)
  {
    if (!util.isNumber (x) || !util.isNumber (y)) { return };
    if (this.__view_t_x === x && this.__view_t_y === y) { return; }

    this.__view_t_x = x;
    this.__view_t_y = y;

    this.__update_transform_gl_matrix ();
  },

  /**
   *  Rotate the view about the horizontal and vertical axes.
   *  <p/>The angle units is radians.
   *
   * @name vs.ui.GLView#rotate
   * @function
   *
   * @param r {float} rotion angle
   */
  rotate: function (rx, ry, rz)
  {
    if (!util.isNumber (rx)) { return };
    if (!util.isNumber (ry)) { return };
    if (!util.isNumber (rz)) { return };

    this._rotation [0] = rx;
    this._rotation [1] = ry;
    this._rotation [2] = rz;

    this.__update_transform_gl_matrix ();
  },

  /**
   *  Scale the view
   *  <p/>The scale is limited by a max and min scale value.
   *
   * @name vs.ui.GLView#scale
   * @function
   *
   * @param s {float} scale value
   */
  scale: function (s)
  {
    if (!util.isNumber (s)) { return };

    if (s < 0) { s = 0; }
    if (this._scaling === s) { return; }

    this._scaling = s;

    this.__update_transform_gl_matrix ();
  },

  /**
   *  Define a new transformation matrix, using the transformation origin
   *  set as parameter.
   * @public
   * @function
   *
   * @param {Object} origin is a object reference a x and y position
   */
  setNewTransformOrigin : function (origin)
  {
    if (!origin) { return; }
    if (!util.isNumber (origin.x) || !util.isNumber (origin.y)) { return; }

    this.flushTransformStack ();
    
    this._transform_origin = [origin.x, origin.y];
    
    GLView.__should_render = true;
  },

  /**
   *  Flush all current transformation, into the transformation stack.
   * @public
   * @function
   */
  flushTransformStack : function ()
  {
    // Save current transform into a matrix
    var matrix = new vs.CSSMatrix ();
    matrix = matrix.translate
      (this._transform_origin [0], this._transform_origin [1], 0);
    matrix = matrix.translate (this.__view_t_x, this.__view_t_y, 0);
    matrix = matrix.rotate (this._rotation[0], this._rotation[1], this._rotation[2]);
    matrix = matrix.scale (this._scaling, this._scaling, 1);
    matrix = matrix.translate
      (-this._transform_origin [0], -this._transform_origin [1], 0);

    if (!this._transforms_stack) this._transforms_stack = matrix;
    {
      this._transforms_stack = matrix.multiply (this._transforms_stack);
      delete (matrix);
    }

    // Init a new transform space
    this.__view_t_x = 0;
    this.__view_t_y = 0;
    this._scaling = 1;
    this._rotation [0] = 0;
    this._rotation [1] = 0;
    this._rotation [2] = 0;
    
    GLView.__should_render = true;
  },

  /**
   * Push a new transformation matrix into your component transformation
   * stack.
   *
   * @public
   * @function
   *
   * @param {vs.CSSMatrix} matrix the matrix you want to add
   */
  pushNewTransform : function (matrix)
  {
    if (!matrix) { return; }

    if (!this._transforms_stack) this._transforms_stack = matrix;
    else
    {
      this._transforms_stack = matrix.multiply (this._transforms_stack);
    }
  },

  /**
   *  Remove all previous transformations set for this view
   * @public
   * @function
   */
  clearTransformStack : function ()
  {
    if (this._transforms_stack) delete (this._transforms_stack);
    this._transforms_stack = undefined;
    
    GLView.__should_render = true;
  },

  /**
   *  Return the current transform matrix apply to this graphic Object.
   * @public
   * @function
   * @return {vs.CSSMatrix} the current transform matrix
   */
  getCTM: function ()
  {
    return this.__gl_matrix;
  },

  /**
   * @protected
   * @function
   */
  __update_transform_gl_matrix: function ()
  {
    var
      matrix,
      pos = this._position,
      tx = this._transform_origin [0] + pos [0],
      ty = this._transform_origin [1] + pos [1],
      rot = this._rotation,
      m = this.__gl_vertices;
      
    matrix = this.__gl_matrix;
    // apply current transformation
    mat4.identity (matrix);
    mat4.translate (matrix, [
      tx + this.__view_t_x,
      ty + this.__view_t_y,
      0]
    );
  
    if (rot[0]) mat4.rotateX (matrix, rot[0] * Math.PI / 180);
    if (rot[1]) mat4.rotateY (matrix, rot[1] * Math.PI / 180);
    if (rot[2]) mat4.rotateZ (matrix, rot[2] * Math.PI / 180);
    
    mat4.scale (matrix, [this._scaling, this._scaling, 1]);
    mat4.translate (matrix, [-tx, -ty, 0]);

    /*====================================================== */
    // Update vertices vectors for the culling algorithm
    this.__update_envelop_vertices ();

    this.__invalid_matrixes = true;
    GLView.__should_render = true;
  },
  
  /**
   * Update vertices vectors for the culling algorithm
   * @protected
   * @function
   */
  __update_envelop_vertices : function ()
  {
    var
      matrix = this.__gl_matrix,
       obj_size = this._size,
      obj_pos = this._position,
      x = obj_pos[0],
      y = obj_pos[1],
      w = obj_size [0],
      h = obj_size [1];

    vec3.set_p (x    , y    , 0, this.__vertex_1);
    vec3.set_p (x    , y + h, 0, this.__vertex_2);
    vec3.set_p (x + w, y    , 0, this.__vertex_3);
    vec3.set_p (x + w, y + h, 0, this.__vertex_4);
    
    mat4.multiplyVec3 (matrix, this.__vertex_1);
    mat4.multiplyVec3 (matrix, this.__vertex_2);
    mat4.multiplyVec3 (matrix, this.__vertex_3);
    mat4.multiplyVec3 (matrix, this.__vertex_4);
  }  
};
util.extend (GLView.prototype, vs.ui.RecognizerManager);
util.extendClass (GLView, core.EventSource);

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
      return this._size.slice ();
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
      return vec3.create (this._position);
    }
  },

  'autosizing': {

    /**
     * Set size and position behavior according parent size.
     * @name vs.ui.GLView#autosizing
     *
     * @type Array
     */
    set : function (v)
    {
      if (!v) { return; }
      if ((!util.isArray (v) && !(v instanceof Float32Array)) || v.length != 2) { return; }
      if (!util.isNumber (v[0]) || !util.isNumber(v[1])) { return; }

      if (this._autosizing [0] === v [0] && this._autosizing [1] === v [1])
      { return; }

      this._autosizing [0] = v [0];
      this._autosizing [1] = v [1];

      this._updateSizeAndPos ();
    }
  },

  'magnet': {

    /**
     * Set magnet
     * @name vs.ui.GLView#magnet
     *
     * @type Number
     */
    set : function (code)
    {
      if (this._magnet === code) return;
      if (!util.isNumber (code) || code < 0 || code > 5) return;
      this._setMagnet (code);
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

  'bubbling': {

    /**
     * Allow pointer event bubbling between views (by default set to false)
     * @name vs.ui.GLView#bubbling
     * @type boolean
     */
    set : function (v)
    {
      if (v) { this._bubbling = true; }
      else { this._bubbling = false; }
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
      if ((!util.isArray (v) && !(v instanceof Float32Array)) || v.length !== 2) { return };

      this.translate (v[0], v[1]);
    },

    /**
     * @ignore
     * @type {Array}
     */
    get : function ()
    {
      return [this.__view_t_x, this.__view_t_y];
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
  },


  'rotation': {

    /**
     * Rotation angle in degre
     * @name vs.ui.GLView#rotation
     * @type {float}
     */
    set : function (v)
    {
      this.rotate (v[0], v[1], v[2]);
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
      this.scale (v);
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
      return this._transform_origin.slice ();
    }
  },

  'showAnimmation': {

    /**
     * Set the Animation when the view is shown
     * @name vs.ui.GLView#showAnimmation
     * @type {vs.fx.Animation}
     */
    set : function (v)
    {
      this.setShowAnimation (v);
    }
  },

  'hideAnimation': {

    /**
     * Set the Animation when the view is hidden
     * @name vs.ui.GLView#hideAnimation
     * @type {vs.fx.Animation}
     */
    set : function (v)
    {
      this.setHideAnimation (v);
    }
  },

  'layout': {

    /**
     * This property allows you to specify a layout for the children
     * <p>
     * <ul>
     *    <li /> vs.ui.GLView.DEFAULT_LAYOUT
     *    <li /> vs.ui.GLView.HORIZONTAL_LAYOUT
     *    <li /> vs.ui.GLView.VERTICAL_LAYOUT
     *    <li /> vs.ui.GLView.ABSOLUTE_LAYOUT
     *    <li /> vs.ui.GLView.FLOW_LAYOUT
     * </ul>
     * @name vs.ui.GLView#layout
     * @type String
     */
    set : function (v)
    {
      if (v !== GLView.HORIZONTAL_LAYOUT &&
          v !== GLView.DEFAULT_LAYOUT &&
          v !== GLView.ABSOLUTE_LAYOUT &&
          v !== GLView.VERTICAL_LAYOUT &&
          v !== GLView.FLOW_LAYOUT && v)
      {
        console.error ("Unsupported layout '" + v + "'!");
        return;
      }

      if (!v || v.indexOf ("_layout") !== -1) this._layout = v;
      else this._layout = v + "_layout";
    },
  }
});

/********************************************************************
                      Export
*********************************************************************/
/** @private */
vs.ui.GLView = GLView;
