/**
 * @private
 * @const
 */
const NULL_TYPE = 'Null';

/**
 * @private
 * @const
 */
const UNDEFINED_TYPE = 'Undefined';

/**
 * @private
 * @const
 */
const BOOLEAN_TYPE = 'Boolean';

/**
 * @private
 * @const
 */
const NUMBER_TYPE = 'Number';

/**
 * @private
 * @const
 */
const STRING_TYPE = 'String';

/**
 * @private
 * @const
 */
const OBJECT_TYPE = 'Object';

/**
 * @private
 * @const
 */
const BOOLEAN_CLASS = '[object Boolean]';

/**
 * @private
 * @const
 */
const NUMBER_CLASS = '[object Number]';

/**
 * @private
 * @const
 */
const STRING_CLASS = '[object String]';

/**
 * @private
 * @const
 */
const ARRAY_CLASS = '[object Array]';

/**
 * @private
 **/
const _toString = Object.prototype.toString;


/**
 *  Returns `true` if `object` is an Function; `false` otherwise.
 *
 *  @memberOf util
 *
 * @param {Object} object The object to test.
 **/
export function isFunction(object: any): boolean {
  return typeof object === "function";
};

/**
 *  Returns `true` if `object` is of type `undefined`; `false` otherwise.
 *
 *  @example
 *
 *  util.isUndefined ();
 *  //-> true
 *
 *  util.isUndefined (undefined);
 *  //-> true
 *
 *  util.isUndefined (null);
 *  //-> false
 *
 *  util.isUndefined (0);
 *  //-> false
 *
 *  @memberOf util
 *
 * @param {Object} object The object to test.
 **/
export function isUndefined(object: any): boolean {
  return typeof object === "undefined";
};

/**
 *  Returns `true` if `object` is an "pure" Object; `false` otherwise.
 *
 *  @example
 *
 *  util.isObject (123);
 *  //-> false
 *
 *  util.isObject ([]);
 *  //-> false
 *
 *  util.isObject ({});
 *  //-> true
 *
 *  util.isObject (document);
 *  //-> false // YEP !
 *
 *  util.isObject (util);
 *  //-> true
 *
 *  util.isObject (new Date);
 *  //-> false // YEP !
 *
 *  @memberOf util
 *
 * @param {Object} object The object to test.
 **/
export function isObject(object: any): boolean {
  try {
    return (Object.getPrototypeOf (object) === Object.prototype);
  } catch (e) {
    return false;
  }
};


/********************************************************************
                    String manipulation
*********************************************************************/

/**
 * HTML-encodes a string and returns the encoded string.
 *
 *  @memberOf util
 *
 * @param {String} str String The string
 */
function htmlEncode (str: string): string {
  return str.replace (/&/g, "&amp;").
    replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 *  Strips all leading and trailing whitespace from a string.
 *
 *  @memberOf util
 *
 * @param {String} str String The string
 */
export function strip (str: string): string {
  return str.replace(/^\s+/, '').replace(/\s+$/, '');
}

/**
 *  Converts a string separated by dashes into a camelCase equivalent
 *
 *  @memberOf util
 *
 * @param {String} str String The string
 * @return {String} the result
 */
export function camelize (str: string): string {
  var parts = str.split ('-'), len = parts.length;
  if (len === 1) { return parts [0]; }

  var camelized = str.charAt (0) === '-'
    ? parts [0].charAt (0).toUpperCase () + parts [0].substring (1)
    : parts [0];

  for (var i = 1; i < len; i++)
    camelized += parts[i].charAt (0).toUpperCase() + parts[i].substring (1);

  return camelized;
}

/**
 *  Converts a string separated by dashes into a camelCase equivalent
 *
 *  @memberOf util
 *
 * @param {String} str String The string
 * @return {String} the result
 */
export function capitalize (str: string): string {
  return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
}

/**
 *  Converts a camelized string into a series of words separated by an
 *  underscore (_).
 *
 *  @memberOf util
 *
 * @param {String} str String The string
 * @return {String} the result
 */
export function underscore(str: string): string {
  return str.replace (/::/g, '/')
            .replace (/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace (/([a-z\d])([A-Z])/g, '$1_$2')
            .replace (/-/g, '_')
            .toLowerCase ();
}

/********************************************************************
                    Array extension
*********************************************************************/

/**
 * Removes the elements in the specified interval of this Array.<br/>
 * Shifts any subsequent elements to the left (subtracts one from their indices).<br/>
 * This method extends the JavaScript Array prototype.
 * By John Resig (MIT Licensed)
 *
 * @param {int} from Index of the first element to be removed
 * @param {int} to Index of the last element to be removed
 */
Array.prototype._remove = function (from: number, to?: number) {
  var rest = this.slice ((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply (this, rest);
};

/**
 * Removes the elements in the specified interval of this Array.<br/>
 * Shifts any subsequent elements to the left (subtracts one from their indices).<br/>
 * This method extends the JavaScript Array prototype.
 *
 * @param {int} from Index of the first element to be removed
 * @param {int} to Index of the last element to be removed
 * @return {Array} the modified array
 */
Array.prototype.remove = function (from: number, to?: number) {
  if ((typeof(from) === "object") || isString (from)) {
    var i = 0;
    while (i < this.length) {
      if (this[i] === from) {
        this._remove (i);
      }
      else {
        i++;
      }
    }
  }
  else {
    this._remove(from, to);
  }
  return this;
};

/**
 * Removes all elements of this Array.<br/>
 *
 * @return {Array} the modified array
 */
Array.prototype.removeAll = function () {
  while (this.length > 0) {
    this._remove (0);
  }
  return this;
};

export function deepArrayClone (data) {
  var result, len, i;
  
  if (data instanceof window.Float32Array) {
    result = new Float32Array (data.length);
    result.set(data);
  }
  else if (data instanceof Array) {
    len = data.length
    result = new Array (len);

    for (i = 0; i < len; i++) {
      result [i] = deepArrayClone (data [i]);
    }
  }
  else result = data;

  return result;
}

function CubicBezier(t: number, p1x: number, p1y: number, p2x: number, p2y: number) {
  const epsilon=1.0/200.0;
  const sampleCurveX = (t: number): number => ((ax*t+bx)*t+cx)*t;
  const sampleCurveY = (t: number): number => ((ay*t+by)*t+cy)*t;
  const sampleCurveDerivativeX = (t: number): number => (3.0*ax*t+2.0*bx)*t+cx;
  const solve = (x: number): number => sampleCurveY(solveCurveX(x));
  const fabs = (n: number): number => n >= 0 ? n : -n;
  
  function solveCurveX(x: number): number {
    var t0,t1,t2,x2,d2,i;
    for (t2 = x, i = 0; i < 8; i++) {
      x2 = sampleCurveX (t2) - x;
      if (fabs (x2) < epsilon) return t2;
      d2 = sampleCurveDerivativeX (t2);
      if (fabs (d2) < 1e-6) break;
      t2 = t2 - x2 / d2;
    }
    t0=0.0; t1=1.0; t2=x;
    if (t2 < t0) return t0;
    if (t2 > t1) return t1;
    while (t0 < t1) {
      x2 = sampleCurveX(t2);
      if (fabs(x2-x)<epsilon) return t2;
      if (x > x2) {t0=t2;}
      else {t1=t2;}
      t2 = (t1 - t0) * 0.5 + t0;
    }
    return t2; // Failure.
  };
  const cx = 3.0 * p1x;
  const bx = 3.0 * (p2x - p1x) - cx;
  const ax = 1.0 - cx - bx;
  const cy = 3.0 * p1y;
  const by = 3.0 * (p2y - p1y) - cy;
  const ay = 1.0 - cy - by;
  
  return solve (t);
}

/**
 *  Remove all element children
 *
 *  @memberOf util
 *
 * @param {Element} elem The element
 **/
export function removeAllElementChild (elem) {
  if (!elem || !elem.childNodes) {
    return;
  }

  var l = elem.childNodes.length;
  while (l--) {
    elem.removeChild (elem.firstChild);
  }
};

/**
 *  generateCubicBezierFunction(x1, y1, x2, y2) -> Function
 *
 *  Generates a transition easing function that is compatible
 *  with WebKit's CSS transitions `-webkit-transition-timing-function`
 *  CSS property.
 *
 *  The W3C has more information about 
 *  <a href="http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag">
 *  CSS3 transition timing functions</a>.
 **/
export function generateCubicBezierFunction(x1: number, y1: number, x2: number, y2: number) {
  return (function (pos: number) {return CubicBezier (pos,x1,y1,x2,y2);});
}

// function addClassProperty (_class, name, descriptor) {
//   if (!_class || !_class.prototype) {
//     console.error ("addClassProperty: Invalid class");
//     return;
//   }
  
//   if (!isString (name)) {
//     console.error ("addClassProperty: Invalid property name: " + name);
//     return;
//   }
//   if (!descriptor) {
//     console.error ("addClassProperty: Invalid descriptor");
//     return;
//   }
  
//   descriptor.enumerable = true;
//   Object.defineProperty (_class.prototype, name, descriptor);
// }

// function addClassProperties (_class, descriptors) {
//   if (!_class || !_class.prototype) {
//     console.error ("addClassProperty: Invalid class");
//     return;
//   }
  
//   if (!descriptors) return;
  
//   for (var name in descriptors) {
//     addClassProperty (_class, name, descriptors [name]);
//   }
// }

// /**
//  * Extends a the prototype of a object
//  *
//  * @memberOf util
//  *
//  * @param {Object} destination The Class to receive the new properties.
//  * @param {Object} source The Class whose properties will be duplicated.
//  **/
// function extendClass (obj, extension)
// {
//   if (!obj || !extension) { return; }
//   if (!obj.prototype || !extension.prototype) { return; }

//   try
//   {
//     if (Object.__proto__)
//     {
//       obj.prototype.__proto__ = extension.prototype;
//     }
//     else
//     {
//       var proto = obj.prototype;
//       obj.prototype = new extension ();

//       extend (obj.prototype, proto);
//     }

//     if (!obj.__properties__) obj.__properties__ = [];
//     if (extension.__properties__)
//     {
//       obj.__properties__ = obj.__properties__.concat (extension.__properties__);
//     }

//     return obj;
//   }
//   catch (e)
//   {
//     console.error (e.message ());
//   }
// }

// /**
//  * defineProperty with Object.defineProperty API
//  *
//  * @private
//  */
// function defineProperty(obj: any, prop_name: PropertyKey, desc: PropertyDescriptor): void {
//   const hasProperty = (obj: any, prop: PropertyKey) =>
//     Object.prototype.hasOwnProperty.call (obj, prop);


//   var d = {};

//   if (hasProperty (desc, "enumerable")) d.enumerable = !!desc.enumerable;
//   else d.enumerable = true;
//   if (hasProperty (desc, "configurable")) d.configurable = !!desc.configurable;
//   else d.configurable = true;
//   if (hasProperty (desc, "value")) d.value = desc.value;
//   if (hasProperty (desc, "writable")) d.writable = !!desc.writable;
//   if (hasProperty (desc, "get"))
//   {
//     var g = desc.get;
//     if (isFunction (g)) d.get = g;
//   }
//   if (hasProperty (desc, "set"))
//   {
//     var s = desc.set;
//     if (isFunction (s)) d.set = s;
//   }

//   if (("get" in d || "set" in d) && ("value" in d || "writable" in d))
//     throw new TypeError("identity-confused descriptor");

//   Object.defineProperty(obj, prop_name, d);
// }

// /**
//  * extend with Object.defineProperty compatible API
//  *
//  * @private
//  */
// function extend (destination, source)
// {
//   for (var property in source) {
//     var desc = Object.getOwnPropertyDescriptor (source, property);

//     if (desc && (desc.get || desc.set)) {
//       defineProperty (destination, property, desc);
//     }
//     else {
//       destination [property] = source [property];
//     }
//   }
//   return destination;
// }
