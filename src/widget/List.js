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
 *  The vs.gl.List class
 *
 *  @extends vs.gl.AbstractList
 *  @class
 *  The vs.gl.List class draw a list of ListItem and allows the user to 
 *  select one object from it.
 *  <p>
 *  Events:
 *  <ul>
 *    <li />itemselect, fired when a item is selected.
 *          Event Data = {index, item data}
 *  </ul>
 *  <p>
 *  To reduce performance issues, you can deactivate events handling
 *  for the list, using vs.gl.List#itemsSelectable property.
 *
 * Data can be filtered. The filter he array contains the member to filters
 * and filter:
 * @ex:
 *   list.filters = [{
 *      property:'title',
 *      value:'o',
 *      matching:vs.gl.List.FILTER_CONTAINS,
 *      strict:true
 *   }];
 *  @author David Thevenin
 *
 *  @constructor
 *   Creates a new vs.gl.List.
 * @name vs.gl.List
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
   * Return the list of items in the vs.gl.List
   *
   * @name vs.gl.List#getItems 
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
    var event = new vs.gl.Event ('itemselect', {
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

util.defineClassProperties (List, {
  'itemsSelectable': {
    /** 
     * Allow deactivate the list item selection.
     * <p>
     * This is use full to set this property to false, if you do not listen
     * the event 'itemselect'. It will prevent unnecessary inter event 
     * management
     * which uses processing time.
     * By default its set to true
     * @name vs.gl.List#itemsSelectable 
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
     * @name vs.gl.List#selectedIndex 
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
     * @name vs.gl.List#selectedItem 
     * @type {Object}
     */ 
    get : function ()
    {
      return this._selected_item;
    }
  }
});

/********************************************************************
                      Export
*********************************************************************/
/** @private */
gl.List = List;

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
