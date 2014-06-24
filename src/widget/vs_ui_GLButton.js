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
 *  The vs.ui.GLButton class
 *
 *  @extends vs.ui.GLView
 *  @class
 *  The GLButton class is a subclass of vs.ui.GLView that intercepts pointer-down
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
 *  var myButton = vs.ui.GLButton (config);
 *  myButton.init ();
 *
 * <p>
 *
 *  @author David Thevenin
 * @name vs.ui.GLButton
 *
 *  @constructor
 *   Creates a new vs.ui.GLButton.
 *
 * @param {Object} config the configuration structure [mandatory]
*/
function GLButton (config)
{
  this.parent = GLView;
  this.parent (config);
  this.constructor = GLButton;
}

GLButton.prototype = {
  
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
    this.propagate ('select');
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
    GLView.prototype.destructor.call (this);
  },

  /**
   * @protected
   * @function
   */
  initComponent : function () {
    GLView.prototype.initComponent.call (this);
    
    if (!this.__tap_recognizer) {
      this.__tap_recognizer = new vs.ui.TapRecognizer (this);
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
    GLView.prototype.refresh.call (this);

    if (this._text) {
      this.__update_text_view (this._size);
      this.__update_text (this._text);
    }
  }
};
util.extend (GLButton.prototype, __text_management);
util.extendClass (GLButton, GLView);

/********************************************************************
                  Define class properties
********************************************************************/

util.defineClassProperties (GLButton, {
  'text': {
    /** 
     * Getter|Setter for text. Allow to get or change the text draw
     * by the button
     * @name vs.ui.GLButton#text 
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
     * Getter|Setter for size. Gives access to the size of the vs.ui.GLCanvas
     * @name vs.ui.GLCanvas#size 
     *
     * @type {Array.<number>}
     */ 
    set : function (v)
    {
      if (!v) { return; } 
      if (!util.isArray (v) || v.length !== 2) { return; }
      if (!util.isNumber (v[0]) || !util.isNumber(v[1])) { return; }

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
      return this._size.slice ();
    }
  }
});

/********************************************************************
                      Export
*********************************************************************/
/** @private */
ui.GLButton = GLButton;
