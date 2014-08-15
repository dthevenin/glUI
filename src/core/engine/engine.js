var glEngine = {};
glEngine.need_repaint = true;
glEngine.need_redraw = true;

/**
 * @public
 * @function
 */
glEngine.shouldRepaint = function (gl_view) {
  if (!gl_view) return;
  
  var sprite = SPRITES [gl_view.__gl_id];
  
  // not a graphic object
  if (!sprite) return;
  
  // set the rapaint state for the sprite and for global paint
  sprite.invalid_paint = true;
  this.need_repaint = true;
  
  // ask for a global redraw
  this.need_redraw = true;
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
  renderingTexture.init (gl_ctx, frame_size, gl_device_pixel_ratio);

  render_ui = function (now, mode) {

    if (mode !== 1 &&
        !glEngine.need_repaint && !glEngine.forced_repaint &&
        !glEngine.need_redraw && !glEngine.forced_redraw &&
        !View.__nb_animation) {
      next_rendering_id = requestAnimationFrame (render_ui);
      return
    }

    newStepToAllAnimations (now);
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
