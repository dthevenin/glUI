var
  profiling = {},
  _stats = undefined,
  _continous_rendering = false,
  _profiling_data = [],
  _profiling_id = 0;

profiling.setCollectProfile = function (value) {
  if (!value) {
    profiling.collect = false;
  }
  else {
    profiling.collect = true;
  }
}

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

profiling.collect = false;
function start_profiling_data (id) {
  var data = _profiling_data [id];
    
  if (!data) {
    _profiling_data [id] = data = {
      name: "",
      info: "",
      measures : []
    };
  }
  data.measures.push ([0, performance.now ()]);
}

function end_profiling_data (id) {
  var data = _profiling_data [id];
    
  if (!data) {
    _profiling_data [id] = data = {
      name: "",
      info: "",
      measures : []
    };
  }
  data.measures.push ([1, performance.now ()]);
}

function getProfilingProbeId (name, info) {
  
  _profiling_data [_profiling_id] = {
    name: name,
    info: info,
    measures : []
  };

  return _profiling_id++;
}

profiling.begin = start_profiling_data;
profiling.end = end_profiling_data;

var RENDER_PROB_ID = getProfilingProbeId ("render");

function loadProfiling () {
  
  // save the default render_ui
  var default_render_ui = render_ui;
  
  _profiling = profiling;
  
  // patch render_ui
  render_ui = function (now, mode) {
    
    if (profiling.collect) profiling.begin (RENDER_PROB_ID);

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

    if (profiling.collect) profiling.end (RENDER_PROB_ID);
  }
  
  return initPanel ();
}
