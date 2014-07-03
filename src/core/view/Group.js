
function Group ()
{
  this.__children = [];
}

/**
 * @protected
 * @type {Array.<View>}
 */
Group.prototype.__children = null;

/*****************************************************************
 *
 ****************************************************************/

/**
 * @protected
 * @function
 */
Group.prototype.destructor = function ()
{
  var i, child;
  if (this.__parent) {
    this.__parent.remove (this);
  }

  for (i = 0; i < this.__children.length; i++) {
    child = this.__children [i];
    util.free (child);
  }
  this.__children = undefined;
};

/**
 * @protected
 * @function
 */
Group.prototype.refresh = function ()
{
  var i = 0, l = this.__children.length, child;

  for (; i < l; i++) {
    child = this.__children [i];
    if (!child || !child.refresh) { continue; }
    child.refresh ();
  }
};

/**
 * Notifies that the component's view was added to the DOM.<br/>
 * You can override this method to perform additional tasks
 * associated with presenting the view.<br/>
 * If you override this method, you must call the parent method.
 *
 * @name vs.ui.Group#viewDidAdd
 * @function
 */
Group.prototype.viewDidAdd = function () {};

/**
 *  Return true if the set component is a child o the current component
 *
 * @name vs.ui.Group#isChild
 * @function
 *
 * @param {View} child The component to be removed.
 * @return {boolean}
 */
Group.prototype.isChild = function (child)
{
  if (!child) { return false; }

  if (this.__children.indexOf (child) !== -1) {
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
Group.prototype.add = function (child)
{
  if (!child) { return; }

  if (this.isChild (child)) { return; }

  this.__children.push (child);

  child.__parent = this;
  if (this.__i__ && child.__i__ && child.viewDidAdd) {
    child.viewDidAdd ();
  }

  scheduleAction (function () {
    View.__should_render = true;
  });
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
Group.prototype.remove = function (child)
{
  if (!child) { return; }

  if (!this.isChild (child)) { return; }

  this.__children.remove (child);
  child.__parent = null;

  scheduleAction (function () {
    View.__should_render = true;
  });
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
Group.prototype.removeAllChildren = function ()
{
  var child;

  while (this.__children.length) {
    child = this.__children [0];
    this.__children.remove (child);
    child.__parent = null;
  }

  scheduleAction (function () {
    View.__should_render = true;
  });
}


