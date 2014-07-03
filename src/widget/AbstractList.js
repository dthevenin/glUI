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


/**
 *  The vs.gl.AbstractList class
 *
 *  @extends vs.gl.View
 *  @class
 *  @author David Thevenin
 *
 *  @constructor
 *   Creates a new vs.gl.AbstractList.
 * @name vs.gl.AbstractList
 *
 * @param {Object} config the configuration structure [mandatory]
 */
function AbstractList (config)
{
  this.parent = View;
  this.parent (config);
  this.constructor = View;
}

AbstractList.prototype = {

 /**********************************************************************
                 General data for the list
  *********************************************************************/

  /**
   *
   * @private
   * @type {PointerRecognizer}
   */
  __tap_recognizer: null,
  __list_time_out: 0,

   /**
   * @protected
   * @type {boolean}
   */
  _items_selectable : true,
  
   /**
   * @protected
   * @type {boolean}
   */
  _scroll: 0,
  
  /**
   * @private
   * @type {vs.core.Array}
   */
  _model: null,
       
 /**********************************************************************
                  Data Used for managing scroll states
  *********************************************************************/
  
  /**
   *  @private
   */
   __elem : null,
     
  /**
   * @private
   * @type {int}
   */
  __scroll_start: 0,

 /**********************************************************************

  *********************************************************************/
  
  /**
   * @protected
   * @function
   */
  destructor: function ()
  {
    View.prototype.destructor.call (this);
    
//     if (this.__tap_recognizer)
//     {
//       this.removePointerRecognizer (this.__tap_recognizer);
//       this.__tap_recognizer = null;
//     }

    this._model.unbindChange (null, this, this._modelChanged);
    if (this._model_allocated) util.free (this._model);
    this._model_allocated = false;
  },
  
  /**
   * @protected
   * @function
   */
  initComponent: function ()
  {
    View.prototype.initComponent.call (this);
    
    this._model = new vs.core.Array ();
    this._model.init ();
    this._model_allocated = true;
    this._model.bindChange (null, this, this._modelChanged);
    
    // manage list template without x-hag-hole="item_children"
//     if (!this._holes.item_children) {
//       this._holes.item_children = this.view.querySelector ('ul');
//     }
//     
//     this._list_items = this._sub_view = this._holes.item_children;

//     if (!this.__tap_recognizer)
//     {
//       this.__tap_recognizer = new TapRecognizer (this);
//       this.addPointerRecognizer (this.__tap_recognizer);
//     }

    this.refresh ();
  },
    

  /**
   * @protected
   * @function
   */
  refresh : function ()
  {
    var children = this.__children;
    if (children && children.length) {
      var i = 0, l = children.length, view, y = 0, size;
      for (; i < l; i++) {
        view = children [i];
        view.position = [0, y];
        size = view._size;
        y += size [1];
      }
    }
    
    View.prototype.refresh.call (this);
  },

  /**
   * @protected
   * @function
   */
  _modelChanged : function ()
  {
    // TODO   on peut mieux faire : au lieu de faire
    // un init skin qui vire tout et reconstruit tout, on pourrait
    // ne gerer que la difference
    this._renderData (this._items_selectable);
    this.refresh ();
  },
    
  /**
   * @protected
   * @function
   */
  propertiesDidChange: function () {
    this._modelChanged ();
    return true;
  },
  
  /**
   * @protected
   * @function
   */
  _renderData : function () {},
    
  /**
   * @protected
   * @function
   */
  _touchItemFeedback : function (item) {},
      
  /**
   * @protected
   * @function
   */
  _untouchItemFeedback : function (item) {},

  /**
   * @protected
   * @function
   */
  _updateSelectItem : function (item) {},

  /**
   * @protected
   * @function
   */
  didTouch : function (target, e)
  {
    if (!this._items_selectable) { return false; }
    
    if (target === this._sub_view || target === this.view) {
      this.__elem = null;
      return;
    }
    
    this.__elem = target;
    if (this.__list_time_out) {
      clearTimeout (this.__list_time_out);
      this.__list_time_out = 0;
    }
    if (this.__elem_to_unselect)
    {
      this._untouchItemFeedback (this.__elem_to_unselect);
      this.__elem_to_unselect = null;
    }
    this.__elem_to_unselect = target;
    if (target) this._touchItemFeedback (target);
  },
  
  /**
   * @protected
   * @function
   */
  didUntouch : function (e, target)
  {
    if (!this.__list_time_out && this.__elem_to_unselect)
    {
      this._untouchItemFeedback (this.__elem_to_unselect);
      this.__elem_to_unselect = null;
    }
    this.__elem = null;
  },
  
  didTap : function (nb_tap, target, e)
  {
    var self = this;
    this.__elem_to_unselect = target;
    if (target) {
      this._updateSelectItem (target);

      this.__list_time_out = setTimeout (function () {
        if (target) {
          self._untouchItemFeedback (target);
        }
        self.__list_time_out = 0;
      }, vs.ui.View.UNSELECT_DELAY);
    }
  },

  /**
   * Scroll the list to the element at the set index
   * <p>
   * If to time is defined, the default time is set to 200ms.
   *
   * @name vs.gl.AbstractList#scrollToElementAt 
   * @function
   * @param {Number} index the element index
   * @param {Number} time [Optional] the scroll duration
   */
  scrollToElementAt: function (index, time)
  {
    if (!this.__iscroll__) { return; }
    if (!util.isNumber (time)) { time = 200; }
    var elem = this.__item_obs [index];
    if (!elem) { return; }

		var pos = this.__iscroll__._offset (elem.view);
		pos.top += this.__iscroll__.wrapperOffsetTop;

		pos.top = pos.top > this.__iscroll__.minScrollY ?
		  this.__iscroll__.minScrollY :
		  pos.top < this.__iscroll__.maxScrollY ?
		    this.__iscroll__.maxScrollY : pos.top;
		    
		this.__scroll__.scrollTo (0, pos.top, 200);
  }
};
extendClass (AbstractList, View);


/********************************************************************
                      Export
*********************************************************************/
/** @private */
gl.AbstractList = AbstractList;
