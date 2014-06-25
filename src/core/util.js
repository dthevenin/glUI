vs.gl = {};

var
  util = vs.util,
  core = vs.core,
  ui = vs.ui,
  gl = vs.gl,
  VSObject = vs.core.Object;


// Fallback for systems that don't support WebGL
if(typeof Float32Array != 'undefined') {
	glMatrixArrayType = Float32Array;
} else {
	glMatrixArrayType = Array;
}

function deepArrayClone (data) {
  var result, len, i;
  
  if (data instanceof window.Float32Array) {
    result = new Float32Array (data.length);
    result.set(data);
  }
  else if (data instanceof Array) {
    len = data.length
    result = new Array (len);

    for (i = 0; i < len; i++) {
      result [i] = deepArrayClone (data [i]);
    }
  }
  else result = data;

  return result;
}

function CubicBezier (t,p1x,p1y,p2x,p2y)
{
  var ax=0,bx=0,cx=0,ay=0,by=0,cy=0,epsilon=1.0/200.0;
  function sampleCurveX(t) {return ((ax*t+bx)*t+cx)*t;};
  function sampleCurveY(t) {return ((ay*t+by)*t+cy)*t;};
  function sampleCurveDerivativeX(t) {return (3.0*ax*t+2.0*bx)*t+cx;};
  function solve(x) {return sampleCurveY(solveCurveX(x));};
  function fabs(n) {if(n>=0) {return n;}else {return 0-n;}};
  
  function solveCurveX (x)
  {
    var t0,t1,t2,x2,d2,i;
    for (t2 = x, i = 0; i < 8; i++) {
      x2 = sampleCurveX (t2) - x;
      if (fabs (x2) < epsilon) return t2;
      d2 = sampleCurveDerivativeX (t2);
      if (fabs (d2) < 1e-6) break;
      t2 = t2 - x2 / d2;
    }
    t0=0.0; t1=1.0; t2=x;
    if (t2 < t0) return t0;
    if (t2 > t1) return t1;
    while (t0 < t1) {
      x2 = sampleCurveX(t2);
      if (fabs(x2-x)<epsilon) return t2;
      if (x > x2) {t0=t2;}
      else {t1=t2;}
      t2 = (t1 - t0) * 0.5 + t0;
    }
    return t2; // Failure.
  };
  cx = 3.0 * p1x;
  bx = 3.0 * (p2x - p1x) - cx;
  ax = 1.0 - cx - bx;
  cy = 3.0 * p1y;
  by = 3.0 * (p2y - p1y) - cy;
  ay = 1.0 - cy - by;
  
  return solve (t);
}

/**
 *  generateCubicBezierFunction(x1, y1, x2, y2) -> Function
 *
 *  Generates a transition easing function that is compatible
 *  with WebKit's CSS transitions `-webkit-transition-timing-function`
 *  CSS property.
 *
 *  The W3C has more information about 
 *  <a href="http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag">
 *  CSS3 transition timing functions</a>.
 **/
function generateCubicBezierFunction (x1, y1, x2, y2) {
  return (function(pos) {return CubicBezier (pos,x1,y1,x2,y2);});
}

(function(){
  // prepare base perf object
  if (typeof window.performance === 'undefined') {
    window.performance = {};
  }
  
  if (!window.performance.now) {
    var nowOffset = Date.now ();
 
    if (performance.timing && performance.timing.navigationStart) {
      nowOffset = performance.timing.navigationStart
    }

    window.performance.now = function now () {
      return Date.now() - nowOffset;
    }
  }
})();
