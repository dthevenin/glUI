

/**

Class: "#name"
Template: "@name"
Property: ":name"
Object name: "name"
Child object: ".name"

ex:

Class view has size 50px * 50px
#View:size = "[50,50]"

@myTemplate:size = "[50,50]"

myView:size = "[50,150]"

myView.subView:size = "[10,10]"


*/

var selector_regexp = /(#|@)?(\w*[\.\w*]+)(:(\w*))?\s?=\s?([\w\W]*)$/;

var Configurations = {};
var TemplateConfigurations = {}

function Configuration () {}

Configuration.parse = function (text) {
  var lines = text.trim().split ('\n');
  
  function parseOneLine (line) {
    
    line = line.trim ();
    if (!line) return;
    
    if (!selector_regexp.test (line)) {
      console.warn ("Invid configration line: " + line);
      return;
    }
  
    var match = selector_regexp.exec (line);
    if (match.length !== 6) {
      console.warn ("Invid configration line: " + line);
      return;
    }
    var isClass = match [1] == '#';
    var isTemplate = match [1] == '@';
    var path = match [2];
    var property = match [4];
    var value = match [5];
  
    var configuration = {};
  
    if (isClass) configuration.mode = 1;
    else if (isTemplate) configuration.mode = 2;
    else configuration.mode = 0;
  
    configuration.path = path.split ('.');
    configuration.property = property;
    configuration.value = JSON.parse (value);
    
    if (property === "constraint" && vs.util.isString (configuration.value)) {
      configuration.value =
        Constraint.createObjectFromStringStyle (configuration.value);
    }
  
//    var entry = (match [1] || '') + configuration.path [0];
    var entry = configuration.path [0];
    
    var data;
  
    if (isTemplate) {
      data = TemplateConfigurations [entry];
      if (!data) {
        data = [];
        TemplateConfigurations [entry] = data;
      }
    }
    else {
      data = Configurations [entry];
      if (!data) {
        data = [];
        Configurations [entry] = data;
      }
    }
    data.push (configuration);
  }
  
  lines.forEach (parseOneLine);
}

Configuration.applyToTemplate = function (template_name, base) {
  
  function applyConfiguration (base, configuration) {
    var path = configuration.path;
    var l = path.length, i = 1;
    while (base && i < l) {
      base = base [path [i++]];
    }
    
    if (base && i === l) {
      if (configuration.property === "constraint") {
        if (vs.util.isString (configuration.value)) {
          base.constraint.parseStringStyle (configuration.value)
        }
        else {
          base.constraint.parseObjectStyle (configuration.value)
        }
      }
      else if (configuration.property === "style") {
        if (vs.util.isString (configuration.value)) {
          base.style.parseStringStyle (configuration.value)
        }
        else {
          base.style.parseObjectStyle (configuration.value)
        }
      }
      else {
        base [configuration.property] = configuration.value;
      }
    }
  }
  
  var configurations = TemplateConfigurations [template_name];
  if (configurations) configurations.forEach (function (configuration) {
    // Tempalte reference
    if (configuration.mode === 2) {
      applyConfiguration (base, configuration);
    }
  }) 
}

Configuration.applyToApplication = function (base) {
  var configurations, key;
  
  function applyConfiguration (base, configuration) {
    var path = configuration.path;
    var l = path.length, i = 0;
    while (base && i < l) {
      base = base [path [i++]];
    }
    
    if (base && i === l) {
      if (configuration.property === "constraint") {
        if (vs.util.isString (configuration.value)) {
          base.constraint.parseStringStyle (configuration.value)
        }
        else {
          base.constraint.parseObjectStyle (configuration.value)
        }
      }
      else if (configuration.property === "style") {
        if (vs.util.isString (configuration.value)) {
          base.style.parseStringStyle (configuration.value)
        }
        else {
          base.style.parseObjectStyle (configuration.value)
        }
      }
      else {
        base [configuration.property] = configuration.value;
      }
    }
  }
  
  for (key in Configurations) {
    configurations = Configurations [key];
    if (configurations) configurations.forEach (function (configuration) {
      // Object reference
      if (configuration.mode === 0) {
        applyConfiguration (base, configuration);
      }
    }) 
  }
}

/********************************************************************
                      Export
*********************************************************************/
/** @private */
vs.gl.Configuration = Configuration;