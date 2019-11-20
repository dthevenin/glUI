import { Constructor } from "../../types";
import { BaseView } from "./View";
import { scheduleAction } from "../mainloop";
import { ObjectConfig } from "../GLObject";

export class BaseGroup extends BaseView {
  /**
  * @protected
  * @type {Array.<View>}
  */
  protected __children: any[];

  constructor(config: ObjectConfig) {
    super(config);
    this.__children = [];
  }

  /**
   * @protected
   * @function
   */
  destructor() {
    var i, child;
    if (this.__parent) {
      this.__parent.remove(this);
    }

    for (i = 0; i < this.__children.length; i++) {
      child = this.__children[i];
      if (child) child.destructor();
    }
    this.__children.length = 0;
    super.destructor();
  }

  /**
   * @protected
   * @function
   */
  refresh() {
    var i = 0, l = this.__children.length, child;

    for (; i < l; i++) {
      child = this.__children[i];
      if (!child || !child.refresh) { continue; }
      child.refresh();
    }
    super.refresh();
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

  /**
   *  Return true if the set component is a child o the current component
   *
   * @name vs.ui.Group#isChild
   * @function
   *
   * @param {View} child The component to be removed.
   * @return {boolean}
   */
  isChild(child: BaseView): boolean {
    if (!child) { return false; }

    if (this.__children.indexOf(child) !== -1) {
      return true;
    }

    return false;
  };

  /**
   *  Add the specified child component to this component.
   *  <p>
   *  The component can be a graphic component (vs.ui.Group) or
   *  a non graphic component (View).
   *  In case of vs.ui.Group its mandatory to set the extension.
   *  <p>
   *  The add is a lazy add! The child's view can be already in
   *  the HTML DOM. In that case, the add methode do not modify the DOM.
   *  <p>
   *  @example
   *  var myButton = new Button (conf);
   *  myObject.add (myButton, 'children');
   *
   * @name vs.ui.Group#add
   * @function
   *
   * @param (View} child The component to be added.
   *       insert.
   */
  add(child: BaseView | BaseGroup): void {
    if (!child) { return; }

    if (this.isChild(child)) { return; }

    this.__children.push(child);

    child.__parent = this;
    // if (this.__i__ && child.__i__ && child.viewDidAdd) {
      child.viewDidAdd();
    // }

    BaseView.__should_render = true
  };

  /**
   *  Remove the specified child component from this component.
   *
   *  @example
   *  myObject.remove (myButton);
   *
   * @name vs.ui.Group#remove
   * @function
   *
   * @param {View} child The component to be removed.
   */
  remove(child: BaseView | BaseGroup): void {
    if (!child) { return; }

    if (!this.isChild(child)) { return; }

    // @ts-ignore
    this.__children.remove(child);
    child.__parent = null;

    BaseView.__should_render = true
  };

  /**
   *  Remove all children components from this component
   *
   *  @example
   *  myObject.removeAllChildren ();
   *
   * @name vs.ui.Group#removeAllChild
   * @function
   */
  removeAllChildren(): void {
    var child;

    while (this.__children.length) {
      child = this.__children[0];
      // @ts-ignore
      this.__children.remove(child);
      child.__parent = null;
    }

    BaseView.__should_render = true
  }
};
