var glEngine = {};

function getGLContext () {
  return gl_ctx;
}

var next_rendering_id = 0;
var render_ui;

function initRendering () {
  
  var renderLayerGraph = getLayerGraphRendered (gl_ctx);
  initLayerGraph ();

  render_ui = function (now, mode) {

    if (mode !== 1 && !View.__should_render && !View.__nb_animation) {
      next_rendering_id = requestAnimationFrame (render_ui);
      return
    }

    calculateLayerGraph (now);
    View.__should_render = false;
    
    if (gl_layer_graph_size) {
      renderLayerGraph (frame_size, now, mode);
    }
        
    if (mode !== 1) {
      next_rendering_id = requestAnimationFrame (render_ui);
    }
  }
  
  next_rendering_id = requestAnimationFrame (render_ui);
}

function handleContextLost (event) {
  console.log ("webglcontextlost");
  event.preventDefault ();
  cancelAnimationFrame (next_rendering_id);
  
  //delete (gl_ctx);
  gl_ctx = undefined;
  
  //delete (basicShaderProgram);
  basicShaderProgram = undefined;
  
  //delete (shadowShaderProgram);
  shadowShaderProgram = undefined;
  
  //delete (imageShaderProgram);
  imageShaderProgram = undefined;
  
  //delete (oneTextureShaderProgram);
  oneTextureShaderProgram = undefined;
  
  //delete (twoTexturesShaderProgram);
  twoTexturesShaderProgram = undefined;
}
