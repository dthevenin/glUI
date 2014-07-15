/*
  COPYRIGHT NOTICE
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
 *  The widget.Button class
 *
 *  @extends core.View
 *  @class
 *  The GLButton class is a subclass of core.View that intercepts pointer-down
 *  events and sends an 'select' event to a target object when it’s clicked
 *  or pressed.
 *
 *  Events:
 *  <ul>
 *    <li /> select: Fired after the button is clicked or pressed.
 *  </ul>
 *  <p>
 *  @example
 *  // Simple example: (the button will have the platform skin)
 *  var config = {}
 *  var config.id = 'mybutton';
 *  var config.text = 'Hello';
 *
 *  var myButton = GLButton (config);
 *  myButton.init ();
 *
 *  @example
 *  // GLButton with our own style
 *  var config = {}
 *  var config.id = 'mybutton';
 *  var config.text = 'Hello';
 *
 *  var myButton = core.Button (config);
 *  myButton.init ();
 *
 * <p>
 *
 *  @author David Thevenin
 * @name widget.Button
 *
 *  @constructor
 *   Creates a new widget.Button.
 *
 * @param {Object} config the configuration structure [mandatory]
*/
function Button (config)
{
  this.parent = core.View;
  this.parent (config);
  this.constructor = Button;
}

Button.prototype = {
  
  /*****************************************************************
   *               private/protected members
   ****************************************************************/
   
  /**
   *
   * @private
   * @type {PointerRecognizer}
   */
  __tap_recognizer: null,

  /**
   *
   * @protected
   * @type {boolean}
   */
  _selected: false,

  /**
   *
   * @protected
   * @type {string}
   */
  _text: "",

  /**
   *
   * @protected
   * @type {string}
   */
  _released_image: "",

  /**
   *
   * @protected
   * @type {string}
   */
  _selected_image: "",

  /**
   *
   * @protected
   * @type {string}
   */
  _disabled_image: "",

  /*****************************************************************
   *               General methods
   ****************************************************************/
    
  /**
   * @protected
   * @function
   */
  didTouch : function () {
    this._selected = true;
  },
  
  /**
   * @protected
   * @function
   */
  didUntouch : function () {
    this._selected = false;
  },
  
  didTap : function () {
    var event = new core.Event ('select');
    this.dispatchEvent (event);
  },
  
  /**
   * @protected
   * @function
   */
  destructor : function () {
    if (this.__tap_recognizer) {
      this.removePointerRecognizer (this.__tap_recognizer);
      this.__tap_recognizer = null;
    }
    core.View.prototype.destructor.call (this);
  },

  /**
   * @protected
   * @function
   */
  initComponent : function () {
    core.View.prototype.initComponent.call (this);
    
    if (!this.__tap_recognizer) {
      this.__tap_recognizer = new recognizers.TapRecognizer (this);
      this.addPointerRecognizer (this.__tap_recognizer);
    }

    this.__init_text_view (this._size);

    if (this._text) {
      this.__update_text (this._text);
    }
    
    var self = this;
    this.addEventListener ('webglcontextrestored', function () {
      update_texture (self, self.__text_canvas_node);
    });
  },

  refresh: function () {
    core.View.prototype.refresh.call (this);

    if (this._text) {
      this.__update_text_view (this._size);
      this.__update_text (this._text);
    }
  }
};
util.extend (Button.prototype, core.__text_management);
util.extendClass (Button, core.View);

/********************************************************************
                  Define class properties
********************************************************************/

util.addClassProperties (Button, {
  'text': {
    /** 
     * Getter|Setter for text. Allow to get or change the text draw
     * by the button
     * @name core.Button#text 
     * @type String
     */ 
    set : function (v) {
      if (v === null || typeof (v) === "undefined") { v = ''; }
      else if (util.isNumber (v)) { v = '' + v; }
      else if (!util.isString (v)) {
        if (!v.toString) { return; }
        v = v.toString ();
      }
  
      if (v == this._text) return;
     
      this._text = v;
      this.__update_text (this._text);
    },
  
    /** 
     * @ignore
     * @return {string}
     */ 
    get : function () {
      return this._text;
    }
  },

  "size": {
   /** 
     * Getter|Setter for size. Gives access to the size of the core.Button
     * @name core.Button#size 
     *
     * @type {Array.<number>}
     */ 
    set : function (v)
    {
      if (!v) { return; } 
      if (!util.isArray (v) || v.length !== 2) { return; }
      if (!util.isNumber (v[0]) || !isNumber(v[1])) { return; }

      this._size [0] = v [0];
      this._size [1] = v [1];
    
      this._updateSizeAndPos ();

      this.__update_text_view (this._size);
      if (this._text != "") {
        this.__update_text (this._text);
      }
    },

    /**
     * @ignore
     * @type {Array.<number>}
     */
    get : function ()
    {
      return this._size;
    }
  }
});

if (core.declareComponent) {
  core.declareComponent (Button, "VS-BUTTON", core.__TEXT_CONTENT);
}
