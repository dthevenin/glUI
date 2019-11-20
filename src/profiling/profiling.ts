import { StatsAPI } from "./stats";

export interface Profiling {
  begin: (id: number) => void;
  end: (id: number) => void;
  setCollectProfile: (value: boolean) => void;
  setStats: (stats?: StatsAPI) => void;
  setContinousRendering: (value: boolean) => void;
}

type Measure = number[];

interface ProfilingData {
  name: string;
  info: string;
  measures: Measure[];
}

class _Profiling implements Profiling {
  private collect = false;
  private stats: StatsAPI = undefined;
  private continousRendering: boolean = false;
  private profilingData: ProfilingData[] = [];

  constructor() {
  }
  
  setCollectProfile (value: boolean): void {
    if (!value) {
      this.collect = false;
      this.printProfilingData();
      console.log("End prolile collect.");
    }
    else {
      console.log("Start prolile collect.");
      this.cleanProfilingData();
      this.collect = true;
    }
  }

  setStats (stats?: StatsAPI): void {
    this.stats = stats;
  }

  setContinousRendering (value: boolean): void {
    this.continousRendering = value;
  }

  private getData(idx: number) {
    let data = this.profilingData[idx];
    if (!data) {
      this.profilingData[idx] = data = {
        name: "",
        info: "",
        measures: []
      };
    }
    return data;
  }

  begin(idx: number): void {
    const data = this.getData(idx);
    data.measures.push([0, performance.now()]);
  }

  end(idx: number): void {
    const data = this.getData(idx);
    data.measures.push([1, performance.now()]);
  }

  getProfilingProbeId(name: string, info: string): number {
    this.profilingData.push({
      name,
      info,
      measures: []
    });

    return this.profilingData.length;
  }

  cleanProfilingData(): void {
    this.profilingData.forEach(data => {
      data.measures.length = 0;
    })
  }

  printProfilingData(): void {
    this.profilingData.forEach(data => {

      let nb_mesure = 0, total = 0, temp = 0;

      data.measures.forEach(measure => {
        if (measure[0] === 0) {
          // begin
          temp = measure[1];
        }
        if (measure[0] === 1 && temp) {
          total += (measure[1] - temp);
          temp = 0;
          nb_mesure++;
        }
      })

      console.log(
        "Measure '" + data.name + "' [" + nb_mesure + "]:  " +
        (total / nb_mesure) + "ms"
      )
    })
  }
}

// let _profiling_id = 0;


// var RENDER_PROB_ID = getProfilingProbeId ("render");

// function loadProfiling () {
  
//   // save the default render_ui
//   var default_render_ui = render_ui;
  
//   _profiling = profiling;
  
//   // patch render_ui
//   const render_ui = (now, mode) => {
    
//     if (profiling.collect) profiling.begin (RENDER_PROB_ID);

//     // If continuous rendering, force full rendering
//     if (continousRendering) BaseView.__should_render = true;

//     // Stats is activated, start data calculation
//     if (stats && mode !== 1) stats.begin ();

//     default_render_ui (now, mode);
    
//     // Stats is activated, end data calculation
//     if (stats && mode !== 1) {
//       // force synchronisation (not need with chrome because flush => finish)
//       gl_ctx.finish ();
//       // end stat
//       stats.end ();
//     }

//     if (profiling.collect) profiling.end (RENDER_PROB_ID);
//   }
  
//   return initPanel ();
// }

export const profiling = new _Profiling();
