/**
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/


/**********************************************************************
        
        
*********************************************************************/

/**
 *  The widget.List class
 *
 *  @extends widget.AbstractList
 *  @class
 *  The widget.List class draw a list of ListItem and allows the user to 
 *  select one object from it.
 *  <p>
 *  Events:
 *  <ul>
 *    <li />itemselect, fired when a item is selected.
 *          Event Data = {index, item data}
 *  </ul>
 *  <p>
 *  To reduce performance issues, you can deactivate events handling
 *  for the list, using widget.List#itemsSelectable property.
 *
 * Data can be filtered. The filter he array contains the member to filters
 * and filter:
 * @ex:
 *   list.filters = [{
 *      property:'title',
 *      value:'o',
 *      matching:widget.List.FILTER_CONTAINS,
 *      strict:true
 *   }];
 *  @author David Thevenin
 *
 *  @constructor
 *   Creates a new widget.List.
 * @name widget.List
 *
 * @param {Object} config the configuration structure [mandatory]
 */
function List (config)
{
  if (config.scroll === undefined) config.scroll = 1;
  
  this.parent = AbstractList;
  this.parent (config);
  this.constructor = List;
}

List.prototype = {

 /**********************************************************************
                 General data for the list
  *********************************************************************/
  
  /**
   * @private
   * @type {number}
   */
  _selected_index: 0,
  
  /**
   * @private
   * @type {number}
   */
  _selected_item: 0,
       
 /**********************************************************************
                  Data Used for managing scroll states
  *********************************************************************/

  /**
   *  @private
   */
   __elem : null,
     
  /**
   * @private
   * @type {vs.core.Object}
   */
  __template_obj: null,
  __template_class: null,

 /**********************************************************************

  *********************************************************************/

  /**
   * Return the list of items in the widget.List
   *
   * @name widget.List#getItems 
   * @function
   * @return {Array} the items
   */
  getItems : function ()
  {
    if (this.__item_obs)
    {
      return this.__children.slice ();
    }
    return [];
  },
  
  /**
   * @protected
   * @function
   */
  _renderData : defaultListRenderData,
  
  /**
   * @protected
   * @function
   */
  _modelChanged : function (event)
  {
    // TODO   on peut mieux faire : au lieu de faire
    // un init skin qui vire tout et reconstruit tout, on pourrait
    // ne gerer que la difference
    this._renderData (this._items_selectable);
  },

  /**
   * @protected
   * @function
   */
  _touchItemFeedback : function (item)
  {
    item.pressed = true;
  },
  
  /**
   * @private
   * @function
   */
  _untouchItemFeedback : function (item)
  {
    item.pressed = false;
  },
      
  /**
   * @protected
   * @function
   */
  _updateSelectItem : function (item)
  {
    this._selected_index = item.index;
    this._selected_item = this._model.item (this._selected_index);
    if (item.didSelect) item.didSelect ();
    
    this.outPropertyChange ();
    var event = new core.Event ('itemselect', {
      index: this._selected_index,
      item: this._selected_item
    });
                
    this.dispatchEvent (event);
  }
};
util.extendClass (List, AbstractList);

/********************************************************************
                  Define class properties
********************************************************************/

util.addClassProperties (List, {
  'itemsSelectable': {
    /** 
     * Allow deactivate the list item selection.
     * <p>
     * This is use full to set this property to false, if you do not listen
     * the event 'itemselect'. It will prevent unnecessary inter event 
     * management
     * which uses processing time.
     * By default its set to true
     * @name widget.List#itemsSelectable 
     * @type {boolean}
     */ 
    set : function (v)
    {
      if (v && this._items_selectable) { return; }
      if (!v && !this._items_selectable) { return; }
      
//       if (v)
//       {
//         this._items_selectable = true;
//         for (i = 0; i < this.__item_obs.length; i++)
//         {
//           obj = this.__item_obs [i];
//           vs.addPointerListener (obj.view, core.POINTER_START, this, true);
//         }
//       }
//       else
//       {
//         this._items_selectable = false;
//         for (i = 0; i < this.__item_obs.length; i++)
//         {
//           obj = this.__item_obs [i];
//           vs.removePointerListener (obj.view, core.POINTER_START, this, true);
//         }
//       }
    }
  },
  
  'selectedIndex': {
    /** 
     * Getter for selectedIndex.
     * @name widget.List#selectedIndex 
     * @type {number}
     */ 
    get : function ()
    {
      return this._selected_index;
    }
  },
  
  
  'selectedItem': {
    /** 
     * Getter for selectedItem.
     * @name widget.List#selectedItem 
     * @type {Object}
     */ 
    get : function ()
    {
      return this._selected_item;
    }
  }
});

/**
 * @private
 */
function defaultListRenderData (itemsSelectable)
{
  if (!this._model) { return; }
     
  var index = 0, item, title, y = 0,
    s, width, titles, i, items, listItem;
   
  // remove all children
  this.removeAllChildren (true);
        
  while (index < this._model.length)
  {
    item = this._model.item (index);
    if (this.__template_class)
    {
      listItem = new this.__template_class () .init ();
    }
    else if (this.__template_obj)
    {
      listItem = this.__template_obj.clone ();
    }
//     else
//     {
//       listItem = new DefaultListItem ().init ();
//     }

    if (!listItem) {
      index ++;
      continue;
    }
    
    listItem.position = [0, y];
    y += listItem._size [1];
    
    // model update management
    if (item instanceof core.Model)
    {
      listItem.link (item);
    }
    else
    {
      listItem.configure (item);
    }
    listItem.index = index;

    if (itemsSelectable)
    {
      vs.addPointerListener (listItem.view, core.POINTER_START, this);
    }
    this.add (listItem);
    listItem.__parent = this;
    index ++;
    
    listItem = null;
  }
  
  this.refresh ();
};

function LIST_ATTACHED_CALLBACK () {

  if (!this._comp_) return;

  console.log ("LIST attachedCallback");
 
  var href = this.__ext_template, self = this;
  if (href) {
    this.__ext_template = undefined;
  
    get_extern_component (href, function (data) {
      if (!data) return;

      var config = core.buildConfiguration (data);
      config.node = document.importNode (data, true);

      var comp = new core.AbstractListItem (config).init ();
//      var comp = new vs.ui.AbstractListItem (config);
    
      var properties_str = data.getAttribute ("properties");
      if (properties_str) {
        var comp_properties = parsePropertiesDeclaration (properties_str);
        setCompProperties (comp, comp_properties);
      }
  
      self._comp_.setItemTemplate (comp);
      self._comp_._modelChanged ();
    });
  }
 
  var
    parentComp = core.__getParentComp (this),
    name = this.getAttribute ("name");

  if (parentComp) {
    parentComp.add (this._comp_);
    if (name) {
      if (parentComp.isProperty && parentComp.isProperty (name)) {
        console.error (
          "Impossible to define a child, type \"%s\", with the same name " +
          "\"%s\" of a property. Change the component name on your template.",
          this.nodeName, name);
        console.log (this);
      }
      else {
        parentComp [name] = this._comp_;
        this.classList.add (name);
      }
    }
  }

//   console.log (this.nodeName);
}

function LIST_TEMPLATE_CONTENT (node, config) {

  var template_comp, comp_properties;

  function buildTemplate (item) {
  
    var str_template = "<vs-view";
    var attributes = item.attributes, l = attributes.length, attribute;
  
    // copy attributes
    while (l--) {
      attribute = attributes.item (l);
      if (attribute.name == "properties") {
        //properties declaration
        comp_properties = parsePropertiesDeclaration (attribute.value);
        continue;
      }
      if (core.UNMUTABLE_ATTRIBUTES.indexOf (attribute.name) !== -1) continue;
      str_template += ' ' + attribute.name + "=\"" + attribute.value + "\"";
    }

    // copy the template content
    str_template += ">" + item.innerHTML + "</vs-view>";

    // create the template object
    var template = new core.Template (str_template);
  
    // generate the comp
    var config = core.buildConfiguration (item);
    var comp = template.compileView ("core.AbstractListItem", config);
//    setCompProperties (comp, comp_properties);
//    return comp;

//    return template._shadow_view.__node._comp_;
  }

  var item = node.firstElementChild;

//  while (item) {
//   
//     if (item.nodeName == "VS-TEMPLATE") {
//     
//       var href = item.getAttribute ("href");
//       if (href) {
//         get_extern_component (href);
//         node.__ext_template = href;
//       }
//       else {
//         template_comp = buildTemplate (item);
//       }
//       
//       break;
//     }
//  }

//  util.removeAllElementChild (node);

//  config.__template_obj = template_comp;

}

core.declareComponent (List, "VS-LIST", LIST_TEMPLATE_CONTENT, null, LIST_ATTACHED_CALLBACK)
