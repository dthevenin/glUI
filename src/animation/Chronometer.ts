// import { scheduleAction } from "../core/mainloop";

// export enum TaskState {
//   /**
//    * The task is started
//    * @const
//    * @name vs.core.TaskState.STARTED
//    */
//   STARTED = 1,

//   /**
//    * The task is stopped
//    * @const
//    * @name vs.core.TaskState.STOPPED
//    */
//   STOPPED = 0,

//   /**
//    * The task is paused
//    * @const
//    * @name vs.core.TaskState.PAUSED
//    */
//   PAUSED = 2,
// }

// export class Chronometer {
//   /** @protected */
//   protected _duration: number = 300;
//   /** @protected */
//   protected _begin: number = 0;
//   /** @protected */
//   // protected number = _steps: 0;
//   /** @protected */
//   protected _repeat: number = 1;
//   /** @protected */
//   protected _tick: number = 0;
//   /** @protected */
//   protected __time_decl: number = 0;
//   /** @protected */
//   protected __pause_time: number = 0;
//   /** @protected */
//   protected __end_time: number = 0;
//   /** @protected */
//   protected __repeat_dur: number = 0;
//   /** @protected */
//   protected __timings__: number[];
//   protected _state: TaskState;

//   constructor(params: any) {
//     this._state = TaskState.STOPPED;

//     if (params.duration) this._duration = params.duration;
//     if (params.begin) this._begin = params.begin;
//     //  if (params.steps) this._steps = params.steps;
//     if (params.repeat) this._repeat = params.repeat;

//     this.__timings__ = [];
//   }
  
//   /**
//    *  Starts the task
//    *
//    * @name Task#start
//    * @function
//    *
//    * @param {any} param any parameter (scalar, Array, Object)
//    */
//   start(param: any) {
//     var delegate = this.delegate, self = this;
    
//     if (this._state === TaskState.STARTED) return;

//     // schedule a chronometer cycle
//     function _start ()
//     {
//       this._start_clock ();
// //       if (this._steps === 0) this._start_clock ();
// //       else this._start_steps ();
//     }
    
//     this.__param = param;

//     if (this._state === TaskState.STOPPED)
//     {
//       var begin = this._begin || 0;
//       this.__time_decl = 0;
//       this.__pause_time = 0;
      
//       var now = performance.now ();
    
//       // manage delayed chronometer
//       if (begin > 0)
//       {
//         scheduleAction (_start.bind (this), begin);

//         this.__time_decl = 0;
//         this.__repeat_dur = this._repeat;
//         this._begin = 0;
//         this.__timings__.unshift (now + begin);
//         for (var i = 0; i < this.__repeat_dur; i++) {
//           this.__timings__.unshift (now + this._duration * (i + 1) + begin);
//         }
//         return;
//       }
    
//       // manage ended chronometer before started
//       if (-begin > this._repeat * this._duration)
//       {
//         this.stop ();
//         return;
//       }
    
//       this.__time_decl = -begin % this._duration;
//       var r_dec = (-begin / this._duration) | 0;
       
//       this.__repeat_dur = this._repeat - r_dec;

//       this.__timings__.unshift (now - this.__time_decl);
//       for (var i = 0; i < this.__repeat_dur; i++) {
//         this.__timings__.unshift (now + this._duration * (i + 1) - this.__time_decl);
//       }
//     }
    
//     _start.call (this);

//     if (delegate && delegate.taskDidStart) {
//       try {
//         delegate.taskDidStart (self);
//       }
//       catch (e) {
//         if (e.stack) console.log (e.stack)
//         console.error (e);
//       }
//     }
//   }
  
//   /**
//    * @function
//    * @private
//    */
//   _clock(currTime: number): void {
//     if (this._state !== TaskState.STARTED) return;

//     if (currTime >= this.__end_time)
//     {
//       this._tick = 1;
//       if (this.__clb) this.__clb (this._tick);
//       if (this.__repeat_dur > 1)
//       {
//         this.__repeat_dur --;
//         // schedule a new chronometer cycle
//         this._start_clock ();
//       }
//       else {
//         this.stop ();
//       }
//     }
//     else {
//       // schedule a new tick
//       this._tick = (currTime - this.__start_time) / this._duration;
//       if (this._tick < 0) this._tick = 0;
//       if (this._tick > 1) this._tick = 1;
//       if (this.__clb) this.__clb (this._tick);
//     }
//   }

//   /**
//    * @function
//    * @private
//    */
//   _start_clock(): void {
// //     if (this._state === TaskState.PAUSED)
// //     {
// //       var pause_dur = currTime - this.__pause_time;
// //       this.__start_time += pause_dur;
// //       this.__end_time += pause_dur;
// //       this._state = TaskState.STARTED;
// //       return;
// //     }
    
//     this.__start_time = this.__timings__ [this.__repeat_dur];
//     this.__time_decl = 0;
//     this.__end_time = this.__timings__ [this.__repeat_dur - 1];
    
//     if (util.isFunction (this.__param)) this.__clb = this.__param;

//     this._state = TaskState.STARTED;
//     this._tick = 0;
//     if (this.__clb) this.__clb (this._tick);
//   }

//   /**
//    * @function
//    * @private
//    */
// //   _step ()
// //   {
// //     if (this._state !== TaskState.STARTED) return;
// //     
// //     var step = (this._steps - this.__steps)
// //     this.__steps --;
// // 
// //     if (step === this._steps)
// //     {
// //       this._tick = 1;
// //       if (this.__clb) this.__clb (this._tick);
// //       if (this.__repeat_dur > 1)
// //       {
// //         this.__repeat_dur --;
// //         this._start_steps ();
// //       }
// //       else
// //       {
// //         this.stop ()
// //       }
// //     }
// //     else {
// //       this._tick = step / (this._steps - 1);
// //       if (this.__clb) this.__clb (this._tick);
// //       var step_dur = this._duration / this._steps
// //       scheduleAction (this._step.bind (this), step_dur);
// //     }
// //   }
  
//   /**
//    * @function
//    * @private
//    */
// //   _start_steps()
// //   {
// //     // step chronometer implement a simplistic time management and pause.
// //     if (this._state === TaskState.PAUSED)
// //     {
// //       this._state = TaskState.STARTED;
// //       this._step ();
// //       return;
// //     }
// // 
// //     if (util.isFunction (this.__param)) this.__clb = this.__param;
// // 
// //     this._state = TaskState.STARTED;
// //     this._tick = 0;
// //     if (this.__clb) this.__clb (this._tick);
// //     
// //     var step_dur = this._duration / this._steps;
// //     this.__steps = this._steps - 1 - Math.floor (this.__time_decl / step_dur);
// //     this.__time_decl = 0;
// //     
// //     scheduleAction (this._step.bind (this), step_dur);
// //   }

//   /**
//    *  Stops the task.<br />
//    *  When the task is stopped, it calls the TaskDelegate.taskDidStop
//    *  if it declared.
//    *
//    * @name Task#stop
//    * @function
//    */
//   stop(): void {
//     var delegate = this.delegate, self = this;
    
//     this._state = TaskState.STOPPED;
//     this.__pause_time = 0;
//     this.__timings__.length = 0;

//     this._tick = 1;
//     if (this.__clb) this.__clb (this._tick);

//     if (delegate && delegate.taskDidEnd) {
//       try {
//         delegate.taskDidEnd (self);
//       }
//       catch (e) {
//         if (e.stack) console.log (e.stack)
//         console.error (e);
//       }
//     }
//   }

//   /**
//    *  Pause the task.<br />
//    *  When the task is paused, it calls the TaskDelegate.taskDidPause
//    *  if it declared.
//    *
//    * @name Task#pause
//    * @function
//    */
//   pause(): void {
//     if (this._state !== TaskState.STARTED) return;
//     this._state = TaskState.PAUSED;
//     this.__pause_time = performance.now ();
//   }
// };
