import { GLObject, ObjectConfig } from "../GLObject";
import { Constraint } from "../Constraint";
import { vec3, vec2 } from "gl-matrix";
import { scheduleAction } from "../mainloop";
import { createSprite, deleteSprite, initSprite, setVerticesAllocationFunctions, VerticeFunction } from "../sprite";
import { Transform } from "./Transform";
import { setUpdateVerticesSprite, setShadersProgram } from "../spriteUtil";
import { GLEngineProgram } from "../GLProgram";
import { BaseGroup } from "./Group";
import { Style } from "../Style";
import { GLEventSource } from "../event/EventSource";
import { isFunction } from "../../util";

export class BaseView extends GLEventSource {

  static __should_render: boolean = true;
  static __nb_animation: number = 0;

  public __gl_id: number;

  /*****************************************************************
   *                Private members
   ****************************************************************/

  public __parent: BaseGroup | null;

  /**
   * @protected
   * @type {boolean}
   */
  protected _visible: boolean = true;

  /**
   * @protected
   * @type {boolean}
   */
  protected _scroll: boolean;

  /**
   *
   * @protected
   * @type {boolean}
   */
  protected _enable: boolean = true;

  /**
   * @protected
   * @type {Array}
   */
  public _position: vec3;

  /**
   * @protected
   * @type {Array}
   */
  public _size: vec2;
  protected _constraint: Constraint;
  protected _style: Style;

  public __should_update_gl_vertices: boolean = true;
  public __should_update_gl_matrix: boolean = true;

  public __is_showing: boolean = true;
  public __is_hidding: boolean = true;

  constructor(config: ObjectConfig) {
    super(config);
    
    // init recognizer support
    // this.__pointer_recognizers = [];

    // position and size : according constraints rules, can change
    // automaticaly if the parent container is resized
    this._position = vec3.create ();
    this._size = vec2.create ();

    createSprite(this);
  }

  /*****************************************************************
   *
   ****************************************************************/

  /**
   * @protected
   * @function
   */
  destructor() {
    deleteSprite(this);

    // this._remove_scroll();
    this._scroll = false;

    super.destructor();
  }

  /**
   * @protected
   * @function
   */
  refresh() {
    this._updateSizeAndPos();
    // if (this.__scroll__) {
    //   this.__scroll__.refresh();
    // }
  }

  /**
   * @protected
   * @function
   */
  initComponent() {
    super.initComponent();

    this._style = new Style();
    this._constraint = null;

    // if (!this.__config__) this.__config__ = {};
    // this.__config__.id = this.id;

    // var templateName = this.templateName || this.__config__.templateName;

    // if (templateName) {
    //   applyTemplate(templateName, this);
    // }

    initSprite(this);
  }

  /**
 * Notifies that the component's view was added to the DOM.<br/>
 * You can override this method to perform additional tasks
 * associated with presenting the view.<br/>
 * If you override this method, you must call the parent method.
 *
 * @name vs.ui.Group#viewDidAdd
 * @function
 */
  viewDidAdd() {
    this._updateSizeAndPos();
  };

  setUdpateVerticesFunction(update_gl_vertices: Float32Array): void {
    setUpdateVerticesSprite(this, update_gl_vertices);
  }

  setShadersProgram(program: GLEngineProgram): void {
    setShadersProgram(this, program);
  }

  setVerticesAllocationFunctions(
    resolution: number,
    sprite_vertices_func: VerticeFunction,
    normal_vertices_func: VerticeFunction,
    triangle_faces_func: VerticeFunction,
    texture_projection_func: VerticeFunction): void {
    setVerticesAllocationFunctions(
      this,
      resolution,
      sprite_vertices_func,
      normal_vertices_func,
      triangle_faces_func,
      texture_projection_func
    );
  }

  /********************************************************************
                  GUI Utilities
  ********************************************************************/
  redraw(clb?: any) {
    this._updateSizeAndPos();
  };

  /**
   * @protected
   * @function
   * This function cost a lot!
   */
  _updateSizeAndPos() {
    if (this._constraint) {
      this._constraint.__update_view(this);
    }

    this.__should_update_gl_vertices = true;
    this.__should_update_gl_matrix = true;
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
  show(clb?: any) {
    if (this._visible) { return; }
    if (!isFunction(clb)) clb = undefined;

    this.__is_hidding = false;
    this.__is_showing = true;

    this._show_object(clb);
  }

  /**
   *  Show the GUI Object
   *
   * @private
   * @param {Function} clb a function to call a the end of show process
   * @function
   */
  _show_object(clb?: any) {
    // this.__visibility_anim = undefined;

    if (!this.__is_showing) { return; }
    this.__is_showing = false;

    this._visible = true;
    var self = this;

    if (clb) {
      scheduleAction(function () { clb.call(self); });
    }
    BaseView.__should_render = true;
  }

  /**
   *  Hides the GUI Object
   *
   * @name vs.ui.View#hide
   * @param {Function} clb a function to call a the end of show process
   * @function
   */
  hide(clb?: any) {
    if (!this._visible && !this.__is_showing) { return; }
    if (!isFunction(clb)) clb = undefined;

    this._visible = false;

    this.__is_showing = false;
    this.__is_hidding = true;

    this._hide_object(clb);
  }

  /**
   *  Hides the GUI Object
   *
   * @private
   * @function
   * @param {Function} clb a function to call a the end of show process
   */
  _hide_object(clb?: any) {
    if (this._visible) { return; }
    // this.__visibility_anim = undefined;

    if (!this.__is_hidding) { return; }

    this.__is_hidding = false;
    if (clb) {
      scheduleAction(() => clb.call(this));
    }
    BaseView.__should_render = true;
  }

  /********************************************************************
  
  ********************************************************************/

  /**
   * Did enable delegate
   * @name vs.ui.View#_didEnable
   * @protected
   */
  _didEnable() { }

  /********************************************************************
                    scrolling management
  *********************************************************************/


  // _setup_scroll() {

  //   this.__gl_scroll = vec3.create();

  //   this._remove_scroll();

  //   var config = {};
  //   config.scrollY = false;
  //   config.scrollX = false;

  //   config.scrollY = true;
  //   /*
  //   if (this._scroll === vs.ui.ScrollView.VERTICAL_SCROLL) {
  //     config.scrollY = true;
  //   }
  //   else if (this._scroll === vs.ui.ScrollView.HORIZONTAL_SCROLL) {
  //     config.scrollX = true;
  //   }
  //   else if (this._scroll === vs.ui.ScrollView.SCROLL) {
  //     config.scrollX = true;
  //     config.scrollY = true;
  //   }
  // */

  //   // this.__scroll__ = new __iscroll(this, config);
  //   this.refresh();
  // }

  // __gl_update_scroll(now) {
  //   if (this.__scroll__) {
  //     this.__scroll__.__gl_update_scroll(now);
  //   }
  // }

  // _remove_scroll() {
  //   if (this.__scroll__) {
  //     this.__scroll__.destroy();
  //     this.__scroll__ = undefined;
  //   }
  // }

  /** 
   * Allow to scroll the view.
   * By default it not allowed
   * @name View#scroll 
   * @type {boolean|number}
   */
  // set scroll(v: boolean) {
  //   if (v === this._scroll) return;
  //   if (!v) {
  //     this._scroll = false;
  //     this._remove_scroll();
  //   }
  //   else if (v === true || v === 1 || v === 2 || v === 3) {
  //     if (v === true) { v = 1; }

  //     this._scroll = v;
  //     this._setup_scroll();
  //   }
  // }

  // /** 
  //  * @ignore
  //  * @type {boolean}
  //  */
  // get scroll(): boolean {
  //   return this._scroll;
  // }

  /**
  * Getter|Setter for size. Gives access to the size of the GUI Object
  * @name vs.ui.View#size
  *
  * @type {Array.<number>}
  */
  set size(v: number[]) {
    if (v.length !== 2) { return; }
    vec2.copy(this._size, v);
    this._updateSizeAndPos();
  }

  /**
   * @ignore
   * @type {Array.<number>}
   */
  get size(): number[] {
    return Array.from(this._size);
  }

  /**
   * Getter|Setter for position. Gives access to the position of the GUI
   * Object
   * @name vs.ui.View#position
   *
   * @type Array
   */
  set position(v: number[] | vec3) {
    if (v.length !== 2 && v.length !== 3) { return; }
    vec3.copy(this._position, v);
    this._updateSizeAndPos();
  }

  /**
   * @ignore
   * @type {Array.<number>}
   */
  get position(): number[] {
    return Array.from(this._position);
  }

  /**
   * Hide or show the object.
   * obj.visible = true <=> obj.show (), obj.visible = false <=> obj.hide (),
   * @name vs.ui.View#visible
   * @type {boolean}
   */
  set visible(v: boolean){
    if (v) { this.show(); }
    else { this.hide(); }
  }

  /**
   * Return true is the object is visible. False otherwise.
   * @ignore
   * @type {boolean}
   */
  get visible(): boolean {
    return this._visible;
  }

  /**
   * Activate or deactivate a view.
   * @name vs.ui.View#enable
   * @type {boolean}
   */
  set enable(v: boolean) {
    if (v && !this._enable) {
      this._enable = true;
      this._didEnable();
    }
    else if (!v && this._enable) {
      this._enable = false;
      this._didEnable();
    }

    BaseView.__should_render = true;
  }

  /**
   * @ignore
   * @return {boolean}
   */
  get enable(): boolean {
    return this._enable;
  }

  /**
   * Scale the view
   * @name vs.ui.View#scaling
   * @type {float}
   */
  set opacity(v: number) {
    this._style.opacity = v

    BaseView.__should_render = true;
  }

  /**
   * @ignore
   * @type {float}
   */
  get opacity(): number {
    return this._style.opacity;
  }

  /**
   * Rotation angle in degre
   * @name vs.ui.View#style
   * @type {Style}
   */
  set style(v: Style) {
    this._style = v;
    BaseView.__should_render = true;
  }

  /**
   * @ignore
   * @type {Style}
   */
  get style(): Style {
    return this._style;
  }

  /**
   * Rotation angle in degre
   * @name vs.ui.View#constraint
   * @type {Style}
   */
  set constraint(v) {
    if (!(v instanceof Constraint)) return;

    if (this._constraint) {
      delete (this._constraint);
    }

    this._constraint = v;
    BaseView.__should_render = true;
  }

  /**
   * @ignore
   * @type {Style}
   */
  get constraint() {
    if (!this._constraint) {
      this._constraint = new Constraint();
    }
    return this._constraint;
  }
}




// /**
//  * @private
//  */
// View._positionStyle = undefined;

// /**
//  * @private
//  */
// var _template_nodes = null;

