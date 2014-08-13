window._profiling_data = _profiling_data;
window.getProfilingProbeId = getProfilingProbeId;

return loadProfiling;

};

window.loadProfiling = __init_profiling ().bind (this);
