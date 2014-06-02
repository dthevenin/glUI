var Chronometer = function (params) {
  this._state = vs.core.Task.STOPPED;
  
  if (params.duration) this._duration = params.duration;
  if (params.begin) this._begin = params.begin;
//  if (params.steps) this._steps = params.steps;
  if (params.repeat) this._repeat = params.repeat;
  
  this.__timings__ = [];
}

Chronometer.prototype = {
  /** @protected */
  _duration: 300,
  /** @protected */
  _begin: 0,
  /** @protected */
//  _steps: 0,
  /** @protected */
  _repeat: 1,
  /** @protected */
  _tick: 0,
  /** @protected */
  __time_decl: 0,
  /** @protected */
  __pause_time: 0,
  /** @protected */
  __end_time: 0,
  /** @protected */
  __timings__: null,
  
  /**
   *  Starts the task
   *
   * @name vs.core.Task#start
   * @function
   *
   * @param {any} param any parameter (scalar, Array, Object)
   */
  start: function (param)
  {
    var delegate = this.delegate, self = this;
    
    if (this._state === vs.core.Task.STARTED) return;

    // schedule a chronometer cycle
    function _start ()
    {
      this._start_clock ();
//       if (this._steps === 0) this._start_clock ();
//       else this._start_steps ();
    }
    
    this.__param = param;

    if (this._state === vs.core.Task.STOPPED)
    {
      var begin = this._begin || 0;
      this.__time_decl = 0;
      this.__pause_time = 0;
      
      var now = performance.now ();
    
      // manage delayed chronometer
      if (begin > 0)
      {
        vs.scheduleAction (_start.bind (this), begin);

        this.__time_decl = 0;
        this.__repeat_dur = this._repeat;
        this._begin = 0;
        this.__timings__.unshift (now + begin);
        for (var i = 0; i < this.__repeat_dur; i++) {
          this.__timings__.unshift (now + this._duration * (i + 1) + begin);
        }
        return;
      }
    
      // manage ended chronometer before started
      if (-begin > this._repeat * this._duration)
      {
        this.stop ();
        return;
      }
    
      this.__time_decl = -begin % this._duration;
      var r_dec = (-begin / this._duration) | 0;
       
      this.__repeat_dur = this._repeat - r_dec;

      this.__timings__.unshift (now - this.__time_decl);
      for (var i = 0; i < this.__repeat_dur; i++) {
        this.__timings__.unshift (now + this._duration * (i + 1) - this.__time_decl);
      }
    }
    
    _start.call (this);

    if (delegate && delegate.taskDidStart) {
      try {
        delegate.taskDidStart (self);
      }
      catch (e) {
        if (e.stack) console.log (e.stack)
        console.error (e);
      }
    }
  },
  
  /**
   * @function
   * @private
   */
  _clock : function (currTime)
  {
    if (this._state !== vs.core.Task.STARTED) return;

    if (currTime >= this.__end_time)
    {
      this._tick = 1;
      if (this.__clb) this.__clb (this._tick);
      if (this.__repeat_dur > 1)
      {
        this.__repeat_dur --;
        // schedule a new chronometer cycle
        this._start_clock ();
      }
      else
      {
        this.stop ();
      }
    }
    else {
      // schedule a new tick
      this._tick = (currTime - this.__start_time) / this._duration;
      if (this._tick < 0) this._tick = 0;
      if (this._tick > 1) this._tick = 1;
      if (this.__clb) this.__clb (this._tick);
    }
  },

  /**
   * @function
   * @private
   */
  _start_clock: function ()
  {
//     if (this._state === vs.core.Task.PAUSED)
//     {
//       var pause_dur = currTime - this.__pause_time;
//       this.__start_time += pause_dur;
//       this.__end_time += pause_dur;
//       this._state = vs.core.Task.STARTED;
//       return;
//     }
    
    this.__start_time = this.__timings__ [this.__repeat_dur];
    this.__time_decl = 0;
    this.__end_time = this.__timings__ [this.__repeat_dur - 1];
    
    if (vs.util.isFunction (this.__param)) this.__clb = this.__param;

    this._state = vs.core.Task.STARTED;
    this._tick = 0;
    if (this.__clb) this.__clb (this._tick);
  },

  /**
   * @function
   * @private
   */
//   _step : function ()
//   {
//     if (this._state !== vs.core.Task.STARTED) return;
//     
//     var step = (this._steps - this.__steps)
//     this.__steps --;
// 
//     if (step === this._steps)
//     {
//       this._tick = 1;
//       if (this.__clb) this.__clb (this._tick);
//       if (this.__repeat_dur > 1)
//       {
//         this.__repeat_dur --;
//         this._start_steps ();
//       }
//       else
//       {
//         this.stop ()
//       }
//     }
//     else {
//       this._tick = step / (this._steps - 1);
//       if (this.__clb) this.__clb (this._tick);
//       var step_dur = this._duration / this._steps
//       vs.scheduleAction (this._step.bind (this), step_dur);
//     }
//   },
  
  /**
   * @function
   * @private
   */
//   _start_steps: function ()
//   {
//     // step chronometer implement a simplistic time management and pause.
//     if (this._state === vs.core.Task.PAUSED)
//     {
//       this._state = vs.core.Task.STARTED;
//       this._step ();
//       return;
//     }
// 
//     if (vs.util.isFunction (this.__param)) this.__clb = this.__param;
// 
//     this._state = vs.core.Task.STARTED;
//     this._tick = 0;
//     if (this.__clb) this.__clb (this._tick);
//     
//     var step_dur = this._duration / this._steps;
//     this.__steps = this._steps - 1 - Math.floor (this.__time_decl / step_dur);
//     this.__time_decl = 0;
//     
//     vs.scheduleAction (this._step.bind (this), step_dur);
//   },

  /**
   *  Stops the task.<br />
   *  When the task is stopped, it calls the TaskDelegate.taskDidStop
   *  if it declared.
   *
   * @name vs.core.Task#stop
   * @function
   */
  stop: function ()
  {
    var delegate = this.delegate, self = this;
    
    this._state = vs.core.Task.STOPPED;
    this.__pause_time = 0;
    this.__timings__.length = 0;

    this._tick = 1;
    if (this.__clb) this.__clb (this._tick);

    if (delegate && delegate.taskDidEnd) {
      try {
        delegate.taskDidEnd (self);
      }
      catch (e) {
        if (e.stack) console.log (e.stack)
        console.error (e);
      }
    }
  },

  /**
   *  Pause the task.<br />
   *  When the task is paused, it calls the TaskDelegate.taskDidPause
   *  if it declared.
   *
   * @name vs.core.Task#pause
   * @function
   */
  pause: function ()
  {
    if (!this._state === vs.core.Task.STARTED) return;
    this._state = vs.core.Task.PAUSED;
    this.__pause_time = performance.now ();
  }
};
