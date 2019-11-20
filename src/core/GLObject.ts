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
 * Returns a local unique Id <p>
 * The algorithm is based on an index initialized when the page is loaded.
 *
 * @memberOf core
 *
 * @return {String}
 */
let _id_index_ = 1;
const createId = (): string => `vs_id_${_id_index_++}`;

export type ObjectConfig = {
  [name: string]: any;
};

/********************************************************************

*********************************************************************/
/**
 *  @class Object
 *  Object is the root class of most class hierarchies. Through
 *  Object, objects inherit a basic interface for configuration
 *  and clone mechanism. It provides an unique identifier for objects.
 *
 *  @author David Thevenin
 *
 *  @constructor
 *  Main constructor
 *
 * @name Object
 *
 * @param {Object} config the configuration structure
*/
export class GLObject {
  protected static _obs: {[id: string]: GLObject;} = {};

  /**
   * @protected
   * @String
   */
  protected _id: string;

  private __configuration_process: boolean = false;

  /**
   * @protected
   * @object
   */
  private __config__: ObjectConfig;

  constructor(config?: ObjectConfig) {
    if (config && config.id) { this._id = config.id; }
    else this._id = createId();

    if (config) {
      this.__config__ = config;
    }
  }

  /**
   *  Object default init. <p>
   *
   * @name Object#init
   * @function
   *
   *  @example
   *  myObject = new Object (core.createId ());
   *  myObject.init ();
   *  @return {Object} this
   */
  init(): void {
    // if (this.__i__) { return this; }

    if (!this._id) {
      this._id = createId ();
    }
    
    if (GLObject._obs[this._id]) {
      console.warn ("Impossible to create an object with an already used id.");
      const old_id = this._id;
      this._id = createId ();
      console.warn
        ("The id \"" + old_id + "\" is replaced by \"" + this._id + "\".");
    }

    // save the current object
    GLObject._obs[this._id] = this;

    this.initComponent ();

    if (this.__config__) {
      this.configure(this.__config__);
      this.__config__ = null;
    }

    // Call optional end initialization method
    this.didInitialize ();

    return this;
  }

  /**
   * @protected
   * @function
   */
  protected initComponent(): void {}

  protected didInitialize(): void {}

  /**
   *  Object configuation method. <p>
   *  Call this method to adjust some properties of the internal components
   *  using one call. <br/>
   *  It takes as parameters, an associated array <propertyName, value>.
   *  <br/><br/>
   *  Ex:
   *  @example
   *  var myObject = new Object ({id: 'myobject'});
   *  myObject.init ();
   *
   *  myObject.configure ({prop1: "1", prop2: 'hello', ..});
   *  <=>
   *  myObject.prop1 = "1";
   *  myObject.prop2 = "hello";
   *  ...
   *
   * @name Object#configure
   * @function
   *
   * @param {Object} config the associated array used for configuring the
   *        object.
   */
  configure(config: ObjectConfig): void {
    if (typeof (config) !== 'object') { return; }
    var key, i;

    this.__configuration_process = true;

    if (config) {
      delete config.id;
      Object.assign(this, config);
    }

    this.__configuration_process = false;
  }
  
  /**
   *  This method is called by the dataflow algorithm when input properties have
   *  been changed.
   *  You should reimplement this method if you want make specific calculation
   *  on properties changed, and/or modifying output properties.
   *  If you have modifying an output property (and want to continue the
   *  dataflow propagation) you have to return 'false' or nothing.
   *  Otherwise return 'true' to and the propagation will terminate.
   *
   * @name Object#propertiesDidChange
   * @function
   * @return {boolean} true if you wants stop de propagation, false otherwise
   */
  propertiesDidChange(): boolean { return false; }
  
  /**
   * @protected
   * @function
   */
  destructor(): void {
    // remove the current object
    delete GLObject._obs [this._id];
  }

  get id(): string {
    return this._id;
  }
};