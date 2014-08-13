var
  profiling = {},
  _stats = undefined,
  _continous_rendering = false;

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

function loadProfiling () {
  
  // save the default render_ui
  var default_render_ui = render_ui;
  
  // patch render_ui
  render_ui = function (now, mode) {

    // If continuous rendering, force full rendering
    if (_continous_rendering) View.__should_render = true;

    // Stats is activated, start data calculation
    if (_stats && mode !== 1) _stats.begin ();

    default_render_ui (now, mode);
    
    // Stats is activated, end data calculation
    if (_stats && mode !== 1) {
      // force synchronisation (not need with chrome because flush => finish)
      gl_ctx.finish ();
      // end stat
      _stats.end ();
    }
  }
  
  return initPanel ();
}
