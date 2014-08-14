var
  profiling = {},
  _stats = undefined,
  _continous_redrawing = false,
  _continous_repainting = false,
  _paused_rendering = false,
  _profiling_data = [],
  _profiling_id = 0,
  _start_profiling_time = 0,
  _end_profiling_time = 0;

profiling.setCollectProfile = function (value) {
  if (!value) {
    profiling.collect = false;
    _end_profiling_time = performance.now ();
    return printProfilingData ();
  }
  else {
    _start_profiling_time = performance.now ();
    cleanProfilingData ();
    profiling.collect = true;
  }
}

profiling.setPauseRendering = function (value) {
  if (!value) {
    profiling._paused_rendering = false;
  }
  else {
    profiling._paused_rendering = true;
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

profiling.setContinousRepainting = function (value) {
  if (value) {
    _continous_repainting = true;
  }
  else {
    _continous_repainting = false;
  }
}

profiling.setContinousRedrawing = function (value) {
  if (value) {
    _continous_redrawing = true;
  }
  else {
    _continous_redrawing = false;
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

function cleanProfilingData () {
  _profiling_data.forEach (function (data) {
    data.measures.length = 0;
  })
}

function printProfilingData () {
  var
    log_table = {},
    duration = _end_profiling_time - _start_profiling_time;
  
  console.log ("Profiling result: duration = " + duration.toFixed (2) + "ms");

  _profiling_data.forEach (function (data) {
    
    var nb_mesure = 0, total = 0, temp = 0;
    
    data.measures.forEach (function (measure) {
      if (measure[0] === 0) {
        // bigin
        temp = measure[1];
      }
      if (measure[0] === 1 && temp) {
        total += (measure[1] - temp);
        temp = 0;
        nb_mesure ++;
      }
    })
    
    var average = nb_mesure?total / nb_mesure:0;
    
    // console.log (
    //   "Measure '" + data.name + "' [" + nb_mesure + "]:  " +
    //   average.toFixed (2) + "ms [" + Math.floor (total / duration * 100) + "%]."
    // )
    log_table [data.name] = {
      "nb cycle"      : nb_mesure,
      "Total (ms)"   : total.toFixed (2),
      "Average per cycle (ms)" : average.toFixed (2),
      "Pourcentage (%)":  Math.floor (total / duration * 100)
    };
  })
  
  console.table (log_table);
  return log_table;
}

profiling.begin = start_profiling_data;
profiling.end = end_profiling_data;

var RENDER_PROB_ID = getProfilingProbeId ("render");
var LAYER_GRAPH_PROB_ID = getProfilingProbeId ("layer graph gen");
var ANIMATION_ONE_STEP_PROB_ID = getProfilingProbeId ("do one step animation");

function loadProfiling () {
  
  // save the default render_ui
  var default_render_ui = render_ui;
  
  _profiling = profiling;
  
  // patch render_ui
  render_ui = function (now, mode) {
    
    if (profiling._paused_rendering) {
      if (mode !== 1) {
        next_rendering_id = requestAnimationFrame (render_ui);
      }
      return;
    }
    
    if (profiling.collect) profiling.begin (RENDER_PROB_ID);

    // If continuous rendering, force full rendering
    if (_continous_repainting) glEngine.forced_repaint = true;
    else glEngine.forced_repaint = false;
    if (_continous_redrawing) glEngine.forced_redraw = true;
    else glEngine.forced_redraw = false;

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
  
  var default_calculateLayerGraph = calculateLayerGraph;
  
  calculateLayerGraph = function (now) {
    
    if (profiling.collect) profiling.begin (LAYER_GRAPH_PROB_ID);
    default_calculateLayerGraph (now);
    if (profiling.collect) profiling.end (LAYER_GRAPH_PROB_ID);

  }
  
  var default_newStepToAllAnimations = newStepToAllAnimations;
  
  newStepToAllAnimations = function (now) {
    
    if (profiling.collect) profiling.begin (ANIMATION_ONE_STEP_PROB_ID);
    default_newStepToAllAnimations (now);
    if (profiling.collect) profiling.end (ANIMATION_ONE_STEP_PROB_ID);

  }
  
  return initPanel ();
}
