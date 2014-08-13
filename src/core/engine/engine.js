function getGLContext () {
  return gl_ctx;
}

var next_rendering_id = 0;
var render_ui;


var _stats = undefined;
var _continous_rendering = false;
var profiling = {};

profiling.setStats = function (stats) {
  if (!stats) {
    _stats = undefined;
  }
  else {
    _stats = stats;
  }
}

profiling.setContinousRendering = function (value) {
  if (value) {
    _continous_rendering = true;
  }
  else {
    _continous_rendering = false;
  }
}

function initRendering () {
  
  var renderLayerGraph = initRenteringBis (gl_ctx);
  initLayerGraph ();

  var default_faces_activated = false;
  var previous_program = null;
  var attribute = {}, texture1 = {}, texture2 = {};
  
  render_ui = function (now, mode) {

    if (!_continous_rendering && mode !== 1 && (!View.__should_render && !View.__nb_animation)) {
      next_rendering_id = requestAnimationFrame (render_ui);
      return
    }

    if (_stats) _stats.begin ();

    calculateLayerGraph (now);
    View.__should_render = false;
    
    if (gl_layer_graph_size) {
      renderLayerGraph (frame_size, now, mode);
    }
    
    if (_stats) {
      // force synchronisation (not need with chrome because flush => finish)
      gl_ctx.finish ();
      // end stat
      _stats.end ();
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
