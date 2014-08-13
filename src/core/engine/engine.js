var glEngine = {};
glEngine.need_repaint = true;
glEngine.need_redraw = true;

/**
 * @public
 * @function
 */
glEngine.shouldRepaint = function (gl_view) {
  this.need_repaint = true;
};

/**
 * @public
 * @function
 */
glEngine.shouldRedraw = function (gl_view) {
  this.need_redraw = true;
};

function getGLContext () {
  return gl_ctx;
}

var next_rendering_id = 0;
var render_ui;

function initRendering () {
  
  var renderLayerGraph = getLayerGraphRendered (gl_ctx);
  initLayerGraph ();

  render_ui = function (now, mode) {

    if (mode !== 1 && !glEngine.need_repaint && !glEngine.need_redraw && !View.__nb_animation) {
      next_rendering_id = requestAnimationFrame (render_ui);
      return
    }

    calculateLayerGraph (now);
    
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
