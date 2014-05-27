// add/ child / peg / hole


// propriété ref sur un autre composant

// associer du code


// OK content text ex: <vs-button>Salut</vs-button>
// OK events

// OK propriété non scalaire (Array, object)
// 3 approches: namespace, dynamic, default string

var UNMUTABLE_ATTRIBUTES = ["id", "is", "properties", "name"];

function NO_CONTENT (node) {
  vs.util.removeAllElementChild (node);
}

function TEXT_CONTENT (node, config) {
  var text = node.textContent;
  vs.util.removeAllElementChild (node);
  
  if (text) config.text = text;
}

function RADIO_CHECK_BUTTON_CONTENT (node, config) {
  var
    model = [],
    items = node.children,
    i = 0,
    l = items.length,
    item;
    
  for (; i < l; i ++) {
    item = items.item (i);
    if (item.nodeName == "VS-ITEM") model.push (item.textContent);
  }
  
  vs.util.removeAllElementChild (node);
  
  config.model = model;
}

var EXTERN_COMPONENT = {}, LOADING_CLBS = {};

function get_extern_component (href, result_clb) {

  var node = EXTERN_COMPONENT [href], data, clbs;
  
  if (!vs.util.isFunction (result_clb)) result_clb = null;

  if (node) {
    if (result_clb) result_clb (node);
    return;
  }
  
  if (result_clb) {
    clbs = LOADING_CLBS [href];
    if (!clbs) {
      LOADING_CLBS [href] = clbs = [];
    }
    clbs.push (result_clb);
  }
  
  function send_result (href, data) {
    var clbs = LOADING_CLBS [href];
    if (clbs) {
      clbs.forEach (function (result_clb) {
        vs.scheduleAction (function () {result_clb (data)});
      })
      clbs = [];
      delete (LOADING_CLBS [href]);
    }
  }
  
  var xmlRequest = new XMLHttpRequest ();
  xmlRequest.open ("GET", href, false);
  xmlRequest.send (null);

  if (xmlRequest.readyState === 4)
  {
    if (xmlRequest.status === 200 || xmlRequest.status === 0)
    {
      data = xmlRequest.responseText;
      node = vs.ui.Template.parseHTML (data);
      EXTERN_COMPONENT [href] = node;
      send_result (href, node);
    }
    else
    {
      console.error ("Template file for component '" + comp_name + "' unfound.");
      send_result (href, node);
      return;
    }
  }
  else
  {
    console.error ("Pb when load the component '" + comp_name + "' template.");
    send_result (href, node);
    return;
  }
  xmlRequest = null;
}


function declare_extern_component () {

  var
    node,
    comp_proto;
  
  node = vs.ui.Template.parseHTML ("<div></div>");
  comp_proto = Object.create (node.constructor.prototype);
  
  comp_proto.createdCallback = function () {
  
    var href = this.getAttribute ('href');
    if (!href) return;
    
    // force component to be load
    get_extern_component (href);
  };
  
  comp_proto.attachedCallback = function () {
  
    var
      self = this,
      href = this.getAttribute ('href'),
      id = this.getAttribute ('id');
    
    get_extern_component (href, function (data) {
      if (!data) return;
      
      var
        parentNode = self.parentNode,
        importNode = document.importNode (data, true);
        
      if (id) {
        importNode.setAttribute ('id', id);
      }
      console.log (importNode);
      
      parentNode.insertBefore (importNode, self);
      parentNode.removeChild (self);
    });
  };
        
  comp_proto.detachedCallback = function () {
    console.log ("detachedCallback");
  };
        
  comp_proto.attributeChangedCallback = function (name, oldValue, newValue) {};
  
  document.registerElement ("vs-import", {prototype: comp_proto});
}



var property_reg = /(\w+):(\w+[.\w+]*)#(\w+)/;

function parsePropertiesDeclaration (properties_str) {

  var
    comp_properties = {},
    properties = properties_str.split (';'),
    prop_decl;
  
  for (var i = 0; i < properties.length; i++) {
    prop_decl = property_reg.exec (properties [i]);
    if (!prop_decl || prop_decl.length != 4) {
      console.error ("Problem with properties declaration \"%s\"",
        properties [i]);
      continue;
    }
    comp_properties [prop_decl[1]] = [prop_decl [2], prop_decl [3]];
  }

  return comp_properties;
}

function _setCompProperties (comp, properties)
{
  var desc, prop_name, value;
  
  if (!comp.__properties__) comp.__properties__ = [];
  
  for (prop_name in properties) {

    value = properties [prop_name];
    desc = {};
    
    desc.set = (function (_path, _prop_name) {
      return function (v) {
        var base = this, namespaces = _path.split ('.');
        
        this [_prop_name] = v;
        
        while (base && namespaces.length) {
          base = base [namespaces.shift ()];
        }
        if (base) {
          base [_prop_name] = v;
        }
        this.propertyChange (_prop_name);
      };
    }(value[0], value[1]));

    desc.get = (function (_path, _prop_name) {
      return function () {
        var base = this, namespaces = _path.split ('.');
        while (base && namespaces.length) {
          base = base [namespaces.shift ()];
        }
        if (base) {
          this [_prop_name] = base [_prop_name];
        }
        return;
      };
    }(value[0], value[1]));
    
    vs.util.defineProperty (comp, prop_name, desc);
    comp.__properties__.push (prop_name);
  }
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
      if (UNMUTABLE_ATTRIBUTES.indexOf (attribute.name) !== -1) continue;
      str_template += ' ' + attribute.name + "=\"" + attribute.value + "\"";
    }

    // copy the template content
    str_template += ">" + item.innerHTML + "</vs-view>";

    // create the template object
    var template = new vs.ui.GLTemplate (str_template);
    
    // generate the comp
    var config = buildConfiguration (item);
    var comp = template.compileView ("vs.ui.GLAbstractListItem", config);
//    _setCompProperties (comp, comp_properties);
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
  
//  vs.util.removeAllElementChild (node);
  
//  config.__template_obj = template_comp;
}

function LIST_ATTACHED_CALLBACK () {
  
  if (!this._comp_) return;
  
   console.log ("LIST attachedCallback");
   
  var href = this.__ext_template, self = this;
  if (href) {
    delete (this.__ext_template);
    
    get_extern_component (href, function (data) {
      if (!data) return;

      var config = buildConfiguration (data);
      config.node = document.importNode (data, true);

      var comp = new vs.ui.AbstractListItem (config).init ();
//      var comp = new vs.ui.AbstractListItem (config);
      
      var properties_str = data.getAttribute ("properties");
      if (properties_str) {
        var comp_properties = parsePropertiesDeclaration (properties_str);
        _setCompProperties (comp, comp_properties);
      }
    
      self._comp_.setItemTemplate (comp);
      self._comp_._modelChanged ();
    });
  }
   
  var parentComp = getParentComp (this), name = this.getAttribute ("name");
  
  if (parentComp) {
    parentComp.add (this._comp_);
    if (name) {
      if (parentComp.isProperty (name)) {
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

function ALLOW_CHILD_CONTENT (node) {}

var LIST_COMPONENT = [
  ["vs.ui.GLText", "vs-text", TEXT_CONTENT],
  ["vs.ui.GLButton", "vs-button", TEXT_CONTENT],
  ["vs.ui.GLApplication", "vs-application", ALLOW_CHILD_CONTENT],
  ["vs.ui.GLCanvas", "vs-canvas", NO_CONTENT],
  ["vs.ui.GLImage", "vs-image", NO_CONTENT],
  ["vs.ui.GLList", "vs-list", LIST_TEMPLATE_CONTENT, null, LIST_ATTACHED_CALLBACK],
  ["vs.ui.GLScrollView", "vs-scroll-view", ALLOW_CHILD_CONTENT],
  ["vs.ui.GLView", "vs-view", ALLOW_CHILD_CONTENT],
  ["vs.ui.GLView", "vs-template", ALLOW_CHILD_CONTENT]
]

function INT_DECODER (value) {
  return parseInt (value, 10)
}

function BOOL_DECODER (value) {
  return Boolean (value)
}

function REF_DECODER (value) {
  var result;
  try {
    result = eval (value);
  }
  catch (exp) {
    if (exp.stack) console.error (exp.stack);
    console.error (exp);
  }
  return result;
}

function JSON_DECODER (value) {
  var result;
  try {
    result = JSON.parse (value);
  }
  catch (exp) {
    if (exp.stack) console.error (exp.stack);
    console.error (exp);
  }
  return result;
}

function ARRAY_DECODER (value) {
  var result;
  try {
    result = JSON.parse (value);
  }
  catch (exp) {
    if (exp.stack) console.error (exp.stack);
    console.error (exp);
  }
  if (vs.util.isArray (result)) return result;
  
  return;
}

function OBJECT_DECODER (value) {
  var result;
  try {
    result = JSON.parse (value);
  }
  catch (exp) {
    if (exp.stack) console.error (exp.stack);
    console.error (exp);
  }
  
  return result;
}

function STRING_DECODER (value) {
  return "" + value;
}

function DYNAMIC_DECODER (value, comp, prop_name) {
  if (!comp || !prop_name) return STRING_DECODER (value);
  
  var old_value = comp [prop_name];
  if (vs.util.isNumber (old_value)) return INT_DECODER (value);
  if (vs.util.isArray (old_value)) return ARRAY_DECODER (value);
  if (vs.util.isString (old_value)) return STRING_DECODER (value);
  if (vs.util.isUndefined (old_value)) return STRING_DECODER (value);
  if (vs.util.isObject (old_value)) return OBJECT_DECODER (value);
  
  return STRING_DECODER (value);
}

var ATTRIBUTE_DECODERS = {
  "magnet": INT_DECODER,
  "range": ARRAY_DECODER
}

var ONLOAD_METHODS = [];

/**
 * @private
 */
function resolveClass (name) {
  if (!name) { return null; }

  var namespaces = name.split ('.');
  var base = window;
  while (base && namespaces.length) {
    base = base [namespaces.shift ()];
  }

  return base;
}

function buildConfiguration (node) {

  var
    config = {},
    name,
    attributes = node.attributes,
    l = attributes.length,
    attribute;
  
  while (l--) {
    attribute = attributes.item (l);
    name = vs.util.camelize (attribute.name);
    if (name == "id") {
      config.id = attribute.value;
      continue;
    }
    else if (name == "class") continue;
    else if (UNMUTABLE_ATTRIBUTES.indexOf (attribute.name) !== -1) continue;
    else if (name.indexOf ("on") === 0) continue; // Event
    else if (name.indexOf ("json:") === 0) {
      config [name.replace ("json:", "")] = JSON_DECODER (attribute.value);
    }
    else if (name == "size" || name == "position" ||
             name == "rotation" || name == "translation") {
      config [name] = JSON_DECODER (attribute.value);
    }
    else if (name == "style") {

      var style = new GLStyle ();
      style.parseStringStyle (attribute.value);

      config [name] = style;
    }
    else if (name == "constraint") {

      var constraint = new GLConstraint ();
      constraint.parseStringStyle (attribute.value);

      config [name] = constraint;
    }
    else if (name.indexOf ("ref:") === 0) {
      config [name.replace ("ref:", "")] = REF_DECODER (attribute.value);
    }
    else {
      var decoder = ATTRIBUTE_DECODERS [name]
      if (decoder) config [name] = decoder (attribute.value);
      else config [name] = DYNAMIC_DECODER (attribute.value);
    }
  }
  
  return config;
}

function buildBinding (node, comp) {

  var
    attributes = node.attributes,
    i,
    attribute,
    spec;
    
  for (i = 0; i < attributes.length; ) {
    attribute = attributes.item (i);
    name = vs.util.camelize (attribute.name);
    if (name == "onload") {
      var value = attribute.value;
      if (value) {
        ONLOAD_METHODS.push (function (event) {
          try { 
            eval (value);
          } catch (exp) {
            if (exp.stack) console.error (exp.stack);
            console.error (exp);
          }
        });
      }
      node.removeAttribute (name);
    }
    else if (name.indexOf ("on") === 0) {
      spec = name.substring (2);
      var value = attribute.value;
      node.removeAttribute (name);
      comp.bind (spec, window, function (event) {
        try { 
          eval (value);
        } catch (exp) {
          if (exp.stack) console.error (exp.stack);
          console.error (exp);
        }
      });
    }
    else i++;
  }
}

function getParentComp (node) {
  if (!node) return null;
  var parentNode = node.parentNode;
  if (parentNode && parentNode._comp_) return parentNode._comp_;
  else return getParentComp (parentNode);
}

function declareComponent (className, comp_name, manage_content,
  createdCallback, attachedCallback, detachedCallback) {

  var
    _class = resolveClass (className),
    node,
    comp_proto,
    decl,
    html_comp;
  
  if (!_class) return;

  node = vs.ui.Template.parseHTML ("<div></div>");
  
  comp_proto = Object.create (node.constructor.prototype);
  
  if (vs.util.isFunction (createdCallback)) {
    comp_proto.createdCallback = createdCallback;
  }
  else comp_proto.createdCallback = function () {

    var
      config = buildConfiguration (this),
      _comp_;

    if (manage_content) {
      manage_content (this, config);
    }
    else NO_CONTENT (this);
    
    var over_class_name = this.getAttribute ("class"), over_class;
    
    if (over_class_name) {
      var
        namespaces = over_class_name.split ('.'),
        i = 0,
        temp_name = window [namespaces[i++]];
        
      while (temp_name && i < namespaces.length) {
        temp_name = temp_name [namespaces[i++]];
      }
      
      if (temp_name && i === namespaces.length) {
        over_class = temp_name;
      }
    }

    if (over_class) _comp_ = new over_class (config);
    else _comp_ = new _class (config);
    
    this._comp_ = _comp_;

    if (this.nodeName == "BODY") {
      this.style.width = frame_size[0] + "px";
      this.style.height = frame_size[1] + "px";
      this.style.overflow = "hidden";
    }

    var properties_str = this.getAttribute ("properties");
    if (properties_str) {
      var comp_properties = parsePropertiesDeclaration (properties_str);
      _setCompProperties (_comp_, comp_properties);
    }
    
    _comp_.init ();
    if (over_class) {
      ONLOAD_METHODS.push (function (event) {
        try { 
          if (_comp_ && _comp_.onload) {
            _comp_.onload ();
          }
        } catch (exp) {
          if (exp.stack) console.error (exp.stack);
          console.error (exp);
        }
      });
    }
    
    buildBinding (this, _comp_);
  };
  
  if (vs.util.isFunction (attachedCallback)) {
    comp_proto.attachedCallback = attachedCallback;
  }
  else comp_proto.attachedCallback = function () {
  
    if (!this._comp_) return;
    
    var parentComp, name;
      
    parentComp = getParentComp (this);
    name = this.getAttribute ("name")
    
    if (parentComp) {
      if (this.nodeName == "VS-TEMPLATE") {
        if (parentComp instanceof vs.ui.GLList) {
          window.list = parentComp;
          parentComp.__template_obj = this._comp_;
//          parentComp._renderData ();
        }
      }
      else {
        parentComp.add (this._comp_);
        if (name) {
          if (parentComp.isProperty (name)) {
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
    }
    
 //   console.log (this.nodeName);
  };
        
  if (vs.util.isFunction (detachedCallback)) {
    comp_proto.detachedCallback = detachedCallback;
  }
  else comp_proto.detachedCallback = function () {
    console.log ("detachedCallback");
  };
        
  comp_proto.attributeChangedCallback = function (name, oldValue, newValue) {
  
    if (UNMUTABLE_ATTRIBUTES.indexOf (name) !== -1) return;
    
    var comp = this._comp_;
    name = vs.util.camelize (name)
    
    if (!comp) return;

    else if (name.indexOf ("json:") === 0) {
      name = name.replace ("json:", "");
      if (comp.isProperty (name)) {
        comp [name] = JSON_DECODER (newValue);
      }
    }

    else if (comp.isProperty (name)) {
      var decoder = ATTRIBUTE_DECODERS [name]
      if (decoder) comp [name] = decoder (newValue);
      else comp [name] = DYNAMIC_DECODER (newValue, comp, name);
      comp.propagateChange (name);
    }
  };
  
  decl = {prototype: comp_proto};
  
  if (className == "vs.ui.GLApplication") {
    decl.extends = "body";
  }
  
  html_comp = document.registerElement (comp_name, decl);

  return html_comp;
}

LIST_COMPONENT.forEach (function (item) {
  declareComponent.apply (this, item);
});

declare_extern_component ();

window.addEventListener ('DOMContentLoaded', function() {
  document.body.style.opacity = 0;
});
  
window.addEventListener ('WebComponentsReady', function() {

//  list._renderData ();
//  endInit ();
  
  ONLOAD_METHODS.forEach (function (item) { item.call (); });
  
  // show body now that everything is ready
  vs.ui.Application.start ();
  vs.scheduleAction (function () {
    document.body.style.opacity = 1;
  });
});


function endInit () {
//   var apps = vs.Application_applications, key;
// 
//   function _initComponent (component) {
//     var i, l, child, children;
//         
//     children = component.__children;
//     l = children.length;
//     for (i = 0; i < l; i++) {
//       child = children [i];
//       _initComponent (child, p_matrix, new_p_matrix, new_view_p);
//     }
//     
//     component.init ();
// 
//     for (i = 0; i < l; i++) {
//       child = children [i];
//       if (child.viewDidAdd) {
//         child.viewDidAdd ();
//       }
//     }
//   }
// 
//   for (key in apps) {
//     var app = apps[key];
//     _initComponent (app);
//   }
}