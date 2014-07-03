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

function CONFIGURATION_CONTENT (node, config) {
}

function CONFIGURATION_CREATED_CALLBACK () {
  this.parentNode.removeChild (this);
};

function CONFIGURATION_ATTACHED_CALLBACK () {
  var text = this.textContent;

  Configuration.parse (text);
};

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
  
  if (!util.isFunction (result_clb)) result_clb = null;

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
        core.scheduleAction (function () {result_clb (data)});
      })
      clbs = [];
      LOADING_CLBS [href] = undefined;
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

function TEMPLATE_CREATED_CALLBACK () {

/*
  var
    config = buildConfiguration (this),
    _comp_;

  ALLOW_CHILD_CONTENT (this, config);
  
  _comp_ = new vs.gl.View (config);

  this._comp_ = _comp_;

  var properties_str = this.getAttribute ("properties");
  if (properties_str) {
    var comp_properties = parsePropertiesDeclaration (properties_str);
    _setCompProperties (_comp_, comp_properties);
  }
*/

//  _comp_.init ();

  
  var template_name = this.getAttribute ("name");
//  buildBinding (this, _comp_);
//  newTemplate (template_name, _comp_);
  newTemplate (template_name, this);
  
  this.parentNode.removeChild (this);
};

function TEMPLATE_ATTACHED_CALLBACK () {

  if (!this._comp_) return;

  var parentComp, name;

  parentComp = getParentComp (this);
  name = this.getAttribute ("name")

/*
  if (parentComp) {
    parentComp.add (this._comp_);
    if (name) {
      parentComp [name] = this._comp_;
      this.classList.add (name);
    }
  }
*/

//   console.log (this.nodeName);
};

var ce_property_reg = /(\w+):(\w+[.\w+]*)#(\w+)/;

function parsePropertiesDeclaration (properties_str) {

  if (!properties_str) return;

  var
    comp_properties = {},
    properties = properties_str.split (';'),
    prop_decl;
  
  for (var i = 0; i < properties.length; i++) {
    prop_decl = ce_property_reg.exec (properties [i]);
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
  if (!comp || !properties) return;
  
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
    
    util.defineProperty (comp, prop_name, desc);
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
    var template = new vs.gl.Template (str_template);
    
    // generate the comp
    var config = buildConfiguration (item);
    var comp = template.compileView ("vs.gl.AbstractListItem", config);
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
    this.__ext_template = undefined;
    
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

function ALLOW_CHILD_CONTENT (node) {}

var LIST_COMPONENT = [
  ["vs.gl.Text", "VS-LABEL", TEXT_CONTENT],
  ["vs.gl.Button", "VS-BUTTON", TEXT_CONTENT],
  ["vs.gl.Application", "VS-APPLICATION", ALLOW_CHILD_CONTENT],
  ["vs.gl.Canvas", "VS-CANVAS", NO_CONTENT],
  ["vs.gl.Image", "VS-IMAGE", NO_CONTENT],
  ["vs.gl.List", "VS-LIST", LIST_TEMPLATE_CONTENT, null, LIST_ATTACHED_CALLBACK],
  ["vs.gl.View", "VS-VIEW", ALLOW_CHILD_CONTENT],
  ["vs.gl.View", "VS-TEMPLATE", null, TEMPLATE_CREATED_CALLBACK, TEMPLATE_ATTACHED_CALLBACK],
  ["vs.gl.Configuration", "VS-CONFIGURATION", CONFIGURATION_CONTENT, CONFIGURATION_CREATED_CALLBACK, CONFIGURATION_ATTACHED_CALLBACK]
]

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

function declareComponent (className, comp_name, _manage_content,
  createdCallback, attachedCallback, detachedCallback) {

  var
    _class = resolveClass (className),
    node,
    comp_proto,
    decl,
    html_comp,
    manage_content = _manage_content;
  
  if (!_class) return;

  node = vs.ui.Template.parseHTML ("<div></div>");
  
  comp_proto = Object.create (node.constructor.prototype);
  
  if (util.isFunction (createdCallback)) {
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

    config.templateName = this.getAttribute ("template");
    
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
  
  if (util.isFunction (attachedCallback)) {
    comp_proto.attachedCallback = attachedCallback;
  }
  else comp_proto.attachedCallback = function () {
  
    if (!this._comp_) return;
    
    var parentComp, name;
      
    parentComp = getParentComp (this);
    name = this.getAttribute ("name")
    
    if (parentComp) {
      if (this.nodeName == "VS-TEMPLATE") {
        if (parentComp instanceof vs.gl.List) {
          window.list = parentComp;
          parentComp.__template_obj = this._comp_;
//          parentComp._renderData ();
        }
      }
      else {
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
    }
    
 //   console.log (this.nodeName);
  };
        
  if (util.isFunction (detachedCallback)) {
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
      if (comp.isProperty && comp.isProperty (name)) {
        comp [name] = JSON_DECODER (newValue);
      }
    }

    else if (comp.isProperty && comp.isProperty (name)) {
      var decoder = ATTRIBUTE_DECODERS [name]
      if (decoder) comp [name] = decoder (newValue);
      else comp [name] = DYNAMIC_DECODER (newValue, comp, name);
      comp.propagateChange (name);
    }
  };
  
  decl = {prototype: comp_proto};
  
  if (className == "vs.gl.Application") {
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
  
  ONLOAD_METHODS.forEach (function (item) { item.call (); });
  
  // show body now that everything is ready
  vs.gl.Application.start ();
  
  core.scheduleAction (function () {
    document.body.style.opacity = 1;
  });
});

