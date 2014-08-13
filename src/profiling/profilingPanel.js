var panel_css = '\
  width:200px;\
  height:auto;\
  padding: 5px 0;\
  opacity:0.5;\
  top: 0px;\
  right:0px;\
  position: fixed;\
  background-color: black;\
  cursor:pointer\
';

var label_css = '\
  color:white;\
  font-family: helvetica, arial;\
  font-size: 12px;\
';


var initPanel = function () {

	var panel = document.createElement ("div");
	panel.id = 'gl_profiling';
//	panel.addEventListener ('mousedown', function ( event ) { event.preventDefault(); setMode( ++ mode % 2 ) }, false );
	panel.style.cssText = panel_css;
  
  var
    stats = Stats (),
    collect_profile_selected = false,
    continous_rendering_selected = false,
    stats_selected = false;
  
  panel.appendChild (stats.domElement)
  stats.domElement.style.display = "none";
  
  function activateState (v) {
    if (v) {
      profiling.setStats (stats);
      stats.domElement.style.display = "block";
    }
    else {
      profiling.setStats (null);
      stats.domElement.style.display = "none";
    }
  }

  var panelConfig = [
    {
      "name": "Show paint rectangles",
      "message": "Show paint rectangles",
      "action" : function () {
      }
    },
//    {
//      "name": "Show composited layer borders",
//      "message": "Show composited layer borders",
//      "action" : function () {
//      }
//    },
    {
      "name": "Show FPS meter",
      "message": "Show FPS meter",
      "action" : function (event) {
        stats_selected = event.srcElement.checked;
        activateState (continous_rendering_selected || stats_selected);
      }
    },

    {
      "name": "Enable continuous page repainting",
      "message": "Enable continuous page repainting",
      "action" : function (event) {
        continous_rendering_selected = event.srcElement.checked;
        profiling.setContinousRendering (continous_rendering_selected);
        activateState (continous_rendering_selected || stats_selected);
      }
    },
    
    {
      "name": "Collect CPU/GPU profile",
      "message": "Collect CPU/GPU profile",
      "action" : function (event) {
        collect_profile_selected = event.srcElement.checked;
        profiling.setCollectProfile (collect_profile_selected);
      }
    }
  ];
  
  panelConfig.forEach (function (data) {
    var p = document.createElement ("p");
    p.style.cssText = "margin:0;padding:0;padding-left:20px;";
    
    var label = document.createElement ("label");
    var input = document.createElement ("input");
    input.type = "checkbox";
    input.name = data.name;
    input.style.cssText = "margin-left:-17px;padding:0";
    input.onchange = data.action;
    
    label.appendChild (input);
    label.appendChild (document.createTextNode (data.message));
    label.style.cssText = label_css;
    p.appendChild (label);
    panel.appendChild (p);
  });

  document.body.appendChild (panel);

	return {
    panel: panel
	}
};
