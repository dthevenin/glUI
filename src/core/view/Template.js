
var Templates = {};

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
  if (util.isArray (result)) return result;
  
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
  if (util.isNumber (old_value)) return INT_DECODER (value);
  if (util.isArray (old_value)) return ARRAY_DECODER (value);
  if (util.isString (old_value)) return STRING_DECODER (value);
  if (isUndefined (old_value)) return STRING_DECODER (value);
  if (isObject (old_value)) return OBJECT_DECODER (value);
  
  return STRING_DECODER (value);
}

var ATTRIBUTE_DECODERS = {
  "magnet": INT_DECODER,
  "range": ARRAY_DECODER
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

      var style = new Style ();
      style.parseStringStyle (attribute.value);

      config [name] = style;
    }
    else if (name == "constraint") {

      var constraint = new Constraint ();
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

function applyTemplate (template_name, view) {

  var template = Templates [template_name];
  if (!template) return;
  
  function instanciateTemplate (template) {
    var obj = new template._class (template.config);
    obj.init ();
    
    // Clone the view's children
    var child, i = 0, l;
    if (template.children && template.children.length) {
      l = template.children.length;
      for (; i < l; i++) {
        child = instanciateTemplate (template.children [i]);
        obj.add (child);
        if (template.children [i].name) {
          obj [template.children [i].name] = child;
        }

        if (template.comp_properties) {
          _setCompProperties (obj, template.comp_properties);
        }
        
      }
    }
    
    // Style
    // TODO
    
    // Constraints
    // TODO
    
    return obj;
  }
  
  // Clone the view's children
  if (template.children && template.children.length) {
    var l = template.children.length, i = 0, child;
    for (; i < l; i++) {
      child = instanciateTemplate (template.children [i]);
      view.add (child);
      if (template.children [i].name) {
        view [template.children [i].name] = child;
      }

      if (template.comp_properties) {
        _setCompProperties (view, template.comp_properties);
      }

    }
  }
  
  view.configure (template.config);
  
  Configuration.applyToTemplate (template_name, view);
}

function getTemplate (name) {
  var template_node = Templates [name];
  if (!template_node) return;
  
  return cloneTemplate (template_node);
}

function getClassFromTagName (tagName) {
  for (var i = 0; i < LIST_COMPONENT.length; i ++) {
    item = LIST_COMPONENT [i];
    
    if (item [1] === tagName) return item[0];
  }
}

function parseTemplate (node) {
  var template = {};
  
  // view configuration
  template.config = buildConfiguration (node);
  
  // template class 
  var class_name = node.getAttribute ("class"), _class;
  
  if (!class_name) {
    class_name = getClassFromTagName (node.tagName);
    if (!class_name) {
      console.log ("ERROR: Unknown tag name: " + node.tagName);
      return;
    }
  }
  
  var
    namespaces = class_name.split ('.'),
    i = 0,
    temp_name = window [namespaces[i++]];
    
  while (temp_name && i < namespaces.length) {
    temp_name = temp_name [namespaces[i++]];
  }
  
  if (temp_name && i === namespaces.length) {
    _class = temp_name;
  }

  if (_class) template._class = _class;
  else {
    console.log ("ERROR: Unknown class name: " + class_name);
    return;
  }
  
  // Object name
  template.name = node.getAttribute ("name");

  // Object properties
  template.comp_properties = parsePropertiesDeclaration (node.getAttribute ("properties"));
  
  // Children
  var l = node.childElementCount, child;
  template.children = [];
  for (i = 0; i < l; i ++) {
    child = node.children [i];
    template.children.push (parseTemplate (child));
  }
  
  return template;
}

function newTemplate (name, template_node) {
  if (!name || !template_node) return;
  
  var template = parseTemplate (template_node);
  Templates [name] = template;
}