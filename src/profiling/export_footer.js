
window.getProfilingProbeId = getProfilingProbeId;
core_export.profile = profiling;
core_export.profile.data = _profiling_data;

return loadProfiling;

};


window.loadProfiling = __init_profiling (core_export).bind (this);
