
if (window.GL_INIT_MANUAL === true) {
  window.gl_init = initWebGLRendering;
}
else {
  initWebGLRendering (document.body, window.innerWidth, window.innerHeight);
}

/********************************************************************
                      Export
*********************************************************************/

core_export.POINTER_START = POINTER_START;
core_export.POINTER_MOVE = POINTER_MOVE;
core_export.POINTER_END = POINTER_END;
core_export.POINTER_CANCEL = POINTER_CANCEL;
core_export.addPointerListener = addPointerListener;
core_export.removePointerListener = removePointerListener;
//  EVENT_SUPPORT_GESTURE,
//  GESTURE_START,
//  GESTURE_CHANGE,
//  GESTURE_END,
core_export.scheduleAction = scheduleAction;
core_export.ON_NEXT_FRAME = ON_NEXT_FRAME;
core_export.Object = GLObject;
core_export.Style = Style;
core_export.Color = Color;
core_export.Event = Event;
core_export.Group = Group;
core_export.Transform = Transform;
core_export.Image = gl_Image;
core_export.Text = Text;
core_export.View = View;
core_export.Application = Application;
core_export.newTemplate = newTemplate;
core_export.Configuration = Configuration;
core_export.__text_management = __text_management;
core_export.Animation = Animation;
core_export.buildConfiguration = buildConfiguration;
core_export.UNMUTABLE_ATTRIBUTES = UNMUTABLE_ATTRIBUTES;

// extenstion code TODO Should be better implemented
core_export.glAddInitFunction = glAddInitFunction;
core_export.allocateMeshVertices = allocateMeshVertices;
core_export.allocateNormalVertices = allocateNormalVertices;
core_export.makeTextureProjection = makeTextureProjection;
core_export.allocateTriangleFaces = allocateTriangleFaces;
core_export.initMeshVeticesValues = initMeshVeticesValues;
core_export.createProgram = createProgram;

core_export.math = {
  vec2: vec2,
  vec3: vec3,
  mat3: mat3,
  mat4: mat4
};
  
core_export.animations = {
  TrajectoryVect1D: TrajectoryVect1D,
  TrajectoryVect2D: TrajectoryVect2D,
  TrajectoryVect3D: TrajectoryVect3D
};

core_export.getGLContext = getGLContext;

core_export.engine = glEngine;


return core_export;

function exportDebug () {

  core_export.frame_size = frame_size;
  core_export.drawShaderProgram = drawShaderProgram;
  core_export.jsProjMatrix = jsProjMatrix;
  core_export.jsViewMatrix = jsViewMatrix;
  
}

//gl.createCustomEvent = createCustomEvent;
//gl.removePointerListener = removePointerListener;
//gl.addPointerListener = addPointerListener;
//gl.PointerTypes = PointerTypes;

});
