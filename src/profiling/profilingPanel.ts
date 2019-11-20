import { Stats } from "./stats";
import { profiling } from "./profiling";

export interface ConfigPanel {
  name: string;
  message: string
  action : (event: Event) => void;
}

const panel_css = '\
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

const label_css = '\
  color:white;\
  font-family: helvetica, arial;\
  font-size: 12px;\
';


var initPanel = function () {

  const panel = document.createElement ("div");
  panel.id = 'gl_profiling';
//	panel.addEventListener ('mousedown', function ( event ) 
// { event.preventDefault(); setMode( ++ mode % 2 ) }, false );
  panel.style.cssText = panel_css;
  
  const stats = Stats();
  let collect_profile_selected = false;
  let continous_rendering_selected = false;
  let stats_selected = false;
  
  panel.appendChild (stats.domElement);
  stats.domElement.style.display = "none";
  
  function activateState (v: boolean): void {
    if (v) {
      profiling.setStats(stats);
      stats.domElement.style.display = "block";
    }
    else {
      profiling.setStats();
      stats.domElement.style.display = "none";
    }
  }

  const panelConfig: ConfigPanel[] = [
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
      "action" : (event: Event): void => {
        // @ts-ignore
        stats_selected = event.target.checked;
        activateState (continous_rendering_selected || stats_selected);
      }
    },

    {
      "name": "Enable continuous page repainting",
      "message": "Enable continuous page repainting",
      "action" : (event: Event): void => {
        // @ts-ignore
        continous_rendering_selected = event.target.checked;
        profiling.setContinousRendering (continous_rendering_selected);
        activateState (continous_rendering_selected || stats_selected);
      }
    },
    
    {
      "name": "Collect CPU/GPU profile",
      "message": "Collect CPU/GPU profile",
      "action": (event: Event): void => {
        // @ts-ignore
        collect_profile_selected = event.target.checked;
        profiling.setCollectProfile (collect_profile_selected);
      }
    },
  ];
  
  panelConfig.forEach ((config: ConfigPanel) => {
    var p = document.createElement ("p");
    p.style.cssText = "margin:0;padding:0;padding-left:20px;";
    
    var label = document.createElement ("label");
    var input = document.createElement ("input");
    input.type = "checkbox";
    input.name = config.name;
    input.style.cssText = "margin-left:-17px;padding:0";
    input.onchange = config.action;
    
    label.appendChild (input);
    label.appendChild (document.createTextNode (config.message));
    label.style.cssText = label_css;
    p.appendChild (label);
    panel.appendChild (p);
  });

  document.body.appendChild (panel);

  return {
    panel
  }
};
