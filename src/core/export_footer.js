
initWebGLRendering ();
  
/********************************************************************
                      Export
*********************************************************************/
return {
  POINTER_START: POINTER_START,
  POINTER_MOVE: POINTER_MOVE,
  POINTER_END: POINTER_END,
  POINTER_CANCEL: POINTER_CANCEL,
//  EVENT_SUPPORT_GESTURE,
//  GESTURE_START,
//  GESTURE_CHANGE,
//  GESTURE_END,
  scheduleAction: scheduleAction,
  ON_NEXT_FRAME: ON_NEXT_FRAME,
  Object: GLObject,
  Style: Style,
  Color: Color,
  Event: Event,
  Group: Group,
  Transform: Transform,
  Canvas: Canvas,
  Image: gl_Image,
  Text: Text,
  View: View,
  Application: Application,
  
  Animation: Animation,
  
  buildConfiguration: buildConfiguration,
  UNMUTABLE_ATTRIBUTES: UNMUTABLE_ATTRIBUTES
};

//gl.createCustomEvent = createCustomEvent;
//gl.removePointerListener = removePointerListener;
//gl.addPointerListener = addPointerListener;
//gl.PointerTypes = PointerTypes;

});
