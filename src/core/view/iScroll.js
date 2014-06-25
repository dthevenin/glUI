
/*! iScroll v5.1.1 ~ (c) 2008-2014 Matteo Spinelli ~ http://cubiq.org/license */
(function (window, Math) {

var quadratic = function (k) {
  return k * ( 2 - k );
};

var circular = function (k) {
  return Math.sqrt( 1 - ( --k * k ) );
};

var back = function (k) {
  var b = 4;
  return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
};

var bounce = function (k) {
  if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
    return 7.5625 * k * k;
  } else if ( k < ( 2 / 2.75 ) ) {
    return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
  } else if ( k < ( 2.5 / 2.75 ) ) {
    return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
  } else {
    return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
  }
};

var elastic = function (k) {
  var f = 0.22,
    e = 0.4;

  if ( k === 0 ) { return 0; }
  if ( k == 1 ) { return 1; }

  return ( e * Math.pow( 2, - 10 * k ) * Math.sin( ( k - f / 4 ) * ( 2 * Math.PI ) / f ) + 1 );
};

var momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
  var distance = current - start,
    speed = Math.abs(distance) / time,
    destination,
    duration;

  deceleration = deceleration === undefined ? 0.0006 : deceleration;

  destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
  duration = speed / deceleration;

  if ( destination < lowerMargin ) {
    destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
    distance = Math.abs(destination - current);
    duration = distance / speed;
  } else if ( destination > 0 ) {
    destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
    distance = Math.abs(current) + destination;
    duration = distance / speed;
  }

  return {
    destination: Math.round(destination),
    duration: duration
  };
};

function __iscroll (el, options) {
  this.wrapper = el;

  this.options = {

// INSERT POINT: OPTIONS 

    startX: 0,
    startY: 0,
    scrollY: true,
    directionLockThreshold: 5,
    momentum: true,

    bounce: true,
    bounceTime: 600,
    preventDefault: true,
  };

  for ( var i in options ) {
    this.options [i] = options[i];
  }

  // Normalize options
  this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
  this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

  // If you want eventPassthrough I have to lock one of the axes
  this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
  this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

  // With eventPassthrough we also need lockDirection mechanism
  this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
  this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

  this.options.bounceEasing = circular;

  // Some defaults  
  this.pos = this.wrapper.__gl_scroll;
  this.directionX = 0;
  this.directionY = 0;
  this._events = {};

  this.wrapper.addEventListener (vs.POINTER_START, this);
  this.refresh ();

  this.enable ();
}

__iscroll.prototype = {
  version: '5.1.1',

  destroy: function () {
    this.wrapper.removeEventListener (vs.POINTER_START, this);
  },

  _start: function (e) {
    // React to left mouse button only
//     if ( e.button !== 0 ) {
//       return;
//     }

    if ( !this.enabled ) {
      return;
    }

    var point = e.targetPointerList ? e.targetPointerList[0] : e,
      pos;

    this.moved    = false;
    this.distX    = 0;
    this.distY    = 0;
    this.directionX = 0;
    this.directionY = 0;
    this.directionLocked = 0;

    this.startTime = performance.now ();

    if ( this.isInTransition ) {
      this.isInTransition = false;
      if (this.isAnimating) {
        View.__nb_animation --;
        this.isAnimating = false;
        this.wrapper.__is_scrolling = false;
      }
      this._translate (Math.round(this.pos [0]), Math.round(this.pos [1]));
      this._execEvent ('scrollEnd');
    } else if ( this.isAnimating ) {
      this.isAnimating = false;
      View.__nb_animation --;
      this.wrapper.__is_scrolling = false;
      this._execEvent('scrollEnd');
    }

    this.startX    = this.pos [0];
    this.startY    = this.pos [1];
    this.absStartX = this.pos [0];
    this.absStartY = this.pos [1];
    this.pointX    = point.pageX;
    this.pointY    = point.pageY;

    this._execEvent ('beforeScrollStart');
    
    vs.addPointerListener (document, vs.POINTER_MOVE, this);
    vs.addPointerListener (document, vs.POINTER_CANCEL, this);
    vs.addPointerListener (document, vs.POINTER_END, this);

    this._tap = true;
  },

  _move: function (e) {
    if ( !this.enabled ) {
      return;
    }

    if ( this.options.preventDefault ) {  // increases performance on Android? TODO: check!
      e.preventDefault();
    }

    var point   = e.targetPointerList ? e.targetPointerList[0] : e,
      deltaX    = point.pageX - this.pointX,
      deltaY    = point.pageY - this.pointY,
      timestamp = performance.now (),
      newX, newY,
      absDistX, absDistY;

    this.pointX   = point.pageX;
    this.pointY   = point.pageY;

    this.distX    += deltaX;
    this.distY    += deltaY;
    absDistX    = Math.abs(this.distX);
    absDistY    = Math.abs(this.distY);
    
    if ( this._tap && (Math.abs (this.distX) > 5 || Math.abs (this.distY) > 5)) {
      this._tap = false;
    }

    // We need to move at least 10 pixels for the scrolling to initiate
    if ( timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10) ) {
      return;
    }

    // If you are scrolling in one direction lock the other
    if ( !this.directionLocked && !this.options.freeScroll ) {
      if ( absDistX > absDistY + this.options.directionLockThreshold ) {
        this.directionLocked = 'h';   // lock horizontally
      } else if ( absDistY >= absDistX + this.options.directionLockThreshold ) {
        this.directionLocked = 'v';   // lock vertically
      } else {
        this.directionLocked = 'n';   // no lock
      }
    }

    if ( this.directionLocked == 'h' ) {
      if ( this.options.eventPassthrough == 'vertical' ) {
        e.preventDefault();
      } else if ( this.options.eventPassthrough == 'horizontal' ) {
        return;
      }

      deltaY = 0;
    } else if ( this.directionLocked == 'v' ) {
      if ( this.options.eventPassthrough == 'horizontal' ) {
        e.preventDefault();
      } else if ( this.options.eventPassthrough == 'vertical' ) {
        return;
      }

      deltaX = 0;
    }

    deltaX = this.hasHorizontalScroll ? deltaX : 0;
    deltaY = this.hasVerticalScroll ? deltaY : 0;

    newX = this.pos [0] + deltaX;
    newY = this.pos [1] + deltaY;

    // Slow down if outside of the boundaries
    if ( newX > 0 || newX < this.maxScrollX ) {
      newX = this.options.bounce ? this.pos [0] + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
    }
    if ( newY > 0 || newY < this.maxScrollY ) {
      newY = this.options.bounce ? this.pos [1] + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
    }

    this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
    this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

    if ( !this.moved ) {
      this._execEvent('scrollStart');
    }

    this.moved = true;

    this._translate (newX, newY);

    if ( timestamp - this.startTime > 300 ) {
      this.startTime = timestamp;
      this.startX = this.pos [0];
      this.startY = this.pos [1];
    }
  },

  _end: function (e) {
    if ( !this.enabled ) {
      return;
    }

    vs.removePointerListener (document, vs.POINTER_MOVE, this);
    vs.removePointerListener (document, vs.POINTER_CANCEL, this);
    vs.removePointerListener (document, vs.POINTER_END, this);

    var point = e.changedTouches ? e.changedTouches[0] : e,
      momentumX,
      momentumY,
      duration = performance.now () - this.startTime,
      newX = Math.round(this.pos [0]),
      newY = Math.round(this.pos [1]),
      distanceX = Math.abs(newX - this.startX),
      distanceY = Math.abs(newY - this.startY),
      time = 0,
      easing = '';

    this.isInTransition = 0;
    this.endTime = performance.now ();
    
    if (this._tap && this.wrapper.didTap) {
//      this.wrapper.didTap (1, null, point.src, point);
    }

    // reset if we are outside of the boundaries
    if ( this.resetPosition(this.options.bounceTime) ) {
      return;
    }

    this.scrollTo (newX, newY); // ensures that the last position is rounded

    // we scrolled less than 10 pixels
    if ( !this.moved ) {
      this._execEvent('scrollCancel');
      return;
    }

    if ( this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100 ) {
      this._execEvent('flick');
      return;
    }

    // start momentum animation if needed
    if ( this.options.momentum && duration < 300 ) {
      momentumX = this.hasHorizontalScroll ? momentum (this.pos [0], this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
      momentumY = this.hasVerticalScroll ? momentum (this.pos [1], this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
      newX = momentumX.destination;
      newY = momentumY.destination;
      time = Math.max(momentumX.duration, momentumY.duration);
      this.isInTransition = 1;
    }

    if ( newX != this.pos [0] || newY != this.pos [1] ) {
      // change easing function when scroller goes out of the boundaries
      if ( newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY ) {
        easing = quadratic;
      }

      this.scrollTo (newX, newY, time, easing);
      return;
    }

    this._execEvent('scrollEnd');
  },

  resetPosition: function (time) {
    var x = this.pos [0],
      y = this.pos [1];

    time = time || 0;

    if ( !this.hasHorizontalScroll || this.pos [0] > 0 ) {
      x = 0;
    } else if ( this.pos [0] < this.maxScrollX ) {
      x = this.maxScrollX;
    }

    if ( !this.hasVerticalScroll || this.pos [1] > 0 ) {
      y = 0;
    } else if ( this.pos [1] < this.maxScrollY ) {
      y = this.maxScrollY;
    }

    if ( x == this.pos [0] && y == this.pos [1] ) {
      return false;
    }

    this.scrollTo (x, y, time, this.options.bounceEasing);

    return true;
  },

  disable: function () {
    this.enabled = false;
  },

  enable: function () {
    this.enabled = true;
  },

  refresh: function () {

    var self = this;
    function buildViewPort () {

      self.scrollerWidth = 0;
      self.scrollerHeight = 0;

      var children = self.wrapper.__children;
      if (!children) return;
      var maxX = 0, maxY = 0, i = 0, l = children.length, view, pos, size;
      for (; i < l; i++) {
        view = children[i];
        pos = view._position;
        size = view._size;
        
        if (pos [0] + size [0] > maxX) {
          maxX = pos [0] + size [0];
        }
        if (pos [1] + size [1] > maxY) {
          maxY = pos [1] + size [1];
        }
      }
      
      self.scrollerWidth = maxX;
      self.scrollerHeight = maxY;
    }

    this.wrapperWidth = this.wrapper._size [0];
    this.wrapperHeight  = this.wrapper._size [1];

    buildViewPort ();

    this.maxScrollX   = this.wrapperWidth - this.scrollerWidth;
    this.maxScrollY   = this.wrapperHeight - this.scrollerHeight;

    this.hasHorizontalScroll  = this.options.scrollX && this.maxScrollX < 0;
    this.hasVerticalScroll    = this.options.scrollY && this.maxScrollY < 0;

    if ( !this.hasHorizontalScroll ) {
      this.maxScrollX = 0;
      this.scrollerWidth = this.wrapperWidth;
    }

    if ( !this.hasVerticalScroll ) {
      this.maxScrollY = 0;
      this.scrollerHeight = this.wrapperHeight;
    }

    this.endTime = 0;
    this.directionX = 0;
    this.directionY = 0;

    this._execEvent ('refresh');

    this.resetPosition();
  },

  _execEvent: function (type) {
    if ( !this._events[type] ) {
      return;
    }

    var i = 0,
      l = this._events[type].length;

    if ( !l ) {
      return;
    }

    for ( ; i < l; i++ ) {
      this._events[type][i].apply(this, [].slice.call(arguments, 1));
    }
  },

  scrollBy: function (x, y, time, easing) {
    x = this.pos [0] + x;
    y = this.pos [1] + y;
    time = time || 0;

    this.scrollTo (x, y, time, easing);
  },

  scrollTo: function (x, y, time, easing) {
    easing = easing || circular;

    this.isInTransition = time > 0;

    if ( !time ) {
      this._translate(x, y);
    } else {
      this._animate(x, y, time, easing);
    }
  },

  _translate: function (x, y) {
    this.pos [0] = x;
    this.pos [1] = y;

    this.wrapper.__invalid_matrixes = true;
    View.__should_render = true;
  },
  
  __gl_update_scroll : function (now) {
    if ( !this.isAnimating ) return;
    
    var newX, newY, easing;

    if ( now >= (this.anim_startTime + this.anim_duration) ) {
      this.isAnimating = false;
      View.__nb_animation --;
      this.wrapper.__is_scrolling = false;
      this._translate (this.anim_destX, this.anim_destY);

      if ( !this.resetPosition(this.options.bounceTime) ) {
        this._execEvent('scrollEnd');
      }
      return;
    }

    now = ( now - this.anim_startTime ) / this.anim_duration;
    easing = this.anim_easingFn (now);
    newX = ( this.anim_destX - this.anim_startX ) * easing + this.anim_startX;
    newY = ( this.anim_destY - this.anim_startY ) * easing + this.anim_startY;
    this._translate (newX, newY);
  },

  _animate: function (destX, destY, duration, easingFn) {
    this.anim_startX = this.pos [0],
    this.anim_startY = this.pos [1];
      
    this.anim_startTime = performance.now (),
    this.anim_duration = duration;
    this.anim_easingFn = easingFn;
    this.anim_destX = destX;
    this.anim_destY = destY;
    
    if (!this.isAnimating) {
      this.isAnimating = true;
      View.__nb_animation ++;
    }
    this.wrapper.__invalid_matrixes = true;
    this.wrapper.__is_scrolling = true;
    View.__should_render = true;
  },
  
  handleEvent: function (e) {
    var type = e.type;
    if (type === vs.POINTER_MOVE) {
      this._move(e);
    }
    else if (type === vs.POINTER_START) {
      this._start(e);
    }
    else if (type === vs.POINTER_END || type === vs.POINTER_CANCEL) {
      this._end(e);
    }
    else if (type === 'wheel' ||
             type === 'DOMMouseScroll' ||
             type === 'mousewheel') {
      this._wheel(e);
    }
    else if (type === 'keydown') {
      this._key(e);
    }
  }
};

gl.__iscroll = __iscroll;

})(window, Math);
