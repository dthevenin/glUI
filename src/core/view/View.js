
function View (config)
{
  this.parent = EventSource;
  this.parent (config);
  this.constructor = View;
  
  // init recognizer support
  this.__pointer_recognizers = [];
  
  this.view = this;

  // position and size : according constraints rules, can change
  // automaticaly if the parent container is resized
  this._position = vec3.create ();
  this._size = vec2.create ();
  
  Group.call (this);
  Transform.call (this);

  createSprite (this);
}
util.extend (View.prototype, Group.prototype);
util.extend (View.prototype, Transform.prototype);

View.__should_render = true;
View.__nb_animation = 0;

/********************************************************************

*********************************************************************/

/**
 * @private
 */
View._positionStyle = undefined;

/**
 * @private
 */
var _template_nodes = null;


/*****************************************************************
 *                Private members
 ****************************************************************/
/**
 * @protected
 * @type {boolean}
 */
View.prototype._visible = true;

/**
 *
 * @protected
 * @type {boolean}
 */
View.prototype._enable = true;

/**
 * @protected
 * @type {Array}
 */
View.prototype._position = null;

/**
 * @protected
 * @type {Array}
 */
View.prototype._size = null;
View.prototype._constraint = null;
View.prototype._style = null;

/*****************************************************************
 *
 ****************************************************************/

/**
 * @protected
 * @function
 */
View.prototype.destructor = function ()
{
  deleteSprite (this);

  this._remove_scroll ();
  this._scroll = false;

  Group.prototype.destructor.call (this);
  EventSource.prototype.destructor.call (this);
};

/**
 * @protected
 * @function
 */
View.prototype.refresh = function ()
{
  Group.prototype.refresh.call (this);
  this._updateSizeAndPos ();
  if (this.__scroll__) {
    this.__scroll__.refresh ();
  }
};

/**
 * @protected
 * @function
 */
View.prototype.initComponent = function ()
{
  EventSource.prototype.initComponent.call (this);

  this._style = new Style ();
  this._constraint = null;

  if (!this.__config__) this.__config__ = {};
  this.__config__.id = this.id;
  
  var templateName = this.templateName || this.__config__.templateName;
  
  if (templateName) {
    applyTemplate (templateName, this);
  }

  initSprite (this);
};

/**
 * Notifies that the component's view was added to the DOM.<br/>
 * You can override this method to perform additional tasks
 * associated with presenting the view.<br/>
 * If you override this method, you must call the parent method.
 *
 * @name vs.ui.View#viewDidAdd
 * @function
 */
View.prototype.viewDidAdd = function () {
  Group.prototype.viewDidAdd.call (this);
  this._updateSizeAndPos ();
};

View.prototype.setUdpateVerticesFunction= function (update_gl_vertices) {
  setUpdateVerticesSprite (this, update_gl_vertices);
},

View.prototype.setShadersProgram= function (program) {
  setShadersProgram (this, program);
},

View.prototype.setVerticesAllocationFunctions= function (resolution, sprite_vertices_func, normal_vertices_func, triangle_faces_func,
makeTextureProjection) {
  setVerticesAllocationFunctions (
    this,
    resolution,
    sprite_vertices_func,
    normal_vertices_func,
    triangle_faces_func,
    makeTextureProjection
  );
};

/********************************************************************
                GUI Utilities
********************************************************************/
View.prototype.redraw = function (clb)
{
  this._updateSizeAndPos ();
};

/**
 * @protected
 * @function
 * This function cost a lot!
 */
View.prototype._updateSizeAndPos = function ()
{
  if (this._constraint) {
    this._constraint.__update_view (this);
  }
  this.__should_update_gl_vertices = true;
  this.__should_update_gl_matrix = true;
  View.__should_render = true;
};

/********************************************************************

********************************************************************/


/**
 *  Displays the GUI Object
 *
 * @name vs.ui.View#show
 * @param {Function} clb a function to call a the end of show process
 * @function
 */
View.prototype.show = function (clb)
{
  if (this._visible) { return; }
  if (!util.isFunction (clb)) clb = undefined;

  this.__is_hidding = false;
  this.__is_showing = true;

  this._show_object (clb);
};

/**
 *  Show the GUI Object
 *
 * @private
 * @param {Function} clb a function to call a the end of show process
 * @function
 */
View.prototype._show_object = function (clb)
{
  scheduleAction (function () {
    View.__should_render = true;
  });

  this.__visibility_anim = undefined;

  if (!this.__is_showing) { return; }
  this.__is_showing = false;

  this._visible = true;
  var self = this;

  if (clb) {
    if (clb) {
      scheduleAction (function () {clb.call (self);});
    }
  }
};

/**
 *  Hides the GUI Object
 *
 * @name vs.ui.View#hide
 * @param {Function} clb a function to call a the end of show process
 * @function
 */
View.prototype.hide = function (clb)
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
View.prototype._hide_object= function (clb) {
  scheduleAction (function () {
    View.__should_render = true;
  });

  if (this._visible) { return; }
  this.__visibility_anim = undefined;

  if (!this.__is_hidding) { return; }

  this.__is_hidding = false;
  if (clb) {
    if (clb) {
      scheduleAction (function () {clb.call (self);});
    }
  }
};

/********************************************************************

********************************************************************/

/**
 * Did enable delegate
 * @name vs.ui.View#_didEnable
 * @protected
 */
View.prototype._didEnable = function () {};

/********************************************************************
                  scrolling management
*********************************************************************/


View.prototype._setup_scroll = function () {

  this.__gl_scroll = vec3.create ();

  this._remove_scroll ();

  var config = {};
  config.scrollY = false;
  config.scrollX = false;

  config.scrollY = true;
  /*
  if (this._scroll === vs.ui.ScrollView.VERTICAL_SCROLL) {
    config.scrollY = true;
  }
  else if (this._scroll === vs.ui.ScrollView.HORIZONTAL_SCROLL) {
    config.scrollX = true;
  }
  else if (this._scroll === vs.ui.ScrollView.SCROLL) {
    config.scrollX = true;
    config.scrollY = true;
  }
*/
  
  this.__scroll__ = new __iscroll (this, config);
  this.refresh ();
},

View.prototype.__gl_update_scroll = function (now) {
  if (this.__scroll__) {
    this.__scroll__.__gl_update_scroll (now);
  }
},

View.prototype._remove_scroll = function () {
  if (this.__scroll__)
  {
    this.__scroll__.destroy ();
    this.__scroll__ = undefined;
  }
}

util.extendClass (View, EventSource);

/********************************************************************
                  Define class properties
********************************************************************/

util.addClassProperties (View, {

  'size': {
    /**
     * Getter|Setter for size. Gives access to the size of the GUI Object
     * @name vs.ui.View#size
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
     * @name vs.ui.View#position
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
     * @name vs.ui.View#visible
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
     * @name vs.ui.View#enable
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
      
      View.__should_render = true;
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

  'opacity': {

    /**
     * Scale the view
     * @name vs.ui.View#scaling
     * @type {float}
     */
    set : function (v)
    {
      this._style.opacity = v
      
      View.__should_render = true;
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
  
  'style': {

    /**
     * Rotation angle in degre
     * @name vs.ui.View#style
     * @type {Style}
     */
    set : function (v)
    {
      if (!(v instanceof Style)) return; 
      this._style = v;
      View.__should_render = true;
    },

    /**
     * @ignore
     * @type {Style}
     */
    get : function ()
    {
      return this._style;
    }
  },

  'constraint': {

    /**
     * Rotation angle in degre
     * @name vs.ui.View#constraint
     * @type {Style}
     */
    set : function (v)
    {
      if (!(v instanceof Constraint)) return; 
      
      if (this._constraint) {
        delete (this._constraint.__view)
        delete (this._constraint);
      }
      
      this._constraint = v;
      this._constraint.__view = this;
      View.__should_render = true;
    },

    /**
     * @ignore
     * @type {Style}
     */
    get : function ()
    {
      if (!this._constraint) {
        this._constraint = new Constraint ();
        this._constraint.__view = this;
      }
      return this._constraint;
    }
  }
});

util.addClassProperty (View, 'scroll', {
  /** 
   * Allow to scroll the view.
   * By default it not allowed
   * @name View#scroll 
   * @type {boolean|number}
   */ 
  set : function (v)
  {
    if (v === this._scroll) return;
    if (!v) {
      this._scroll = false;
      this._remove_scroll ();
    }
    else if (v === true || v === 1 || v === 2 || v === 3) {
      if (v === true) { v = 1; }
      
      this._scroll = v;
      this._setup_scroll ();
    }
  },
  
  /** 
   * @ignore
   * @type {boolean}
   */ 
  get : function () {
    return this._scroll;
  }
});
