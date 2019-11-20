/**
 * @author mrdoob / http://mrdoob.com/
 */

export interface StatsAPI {
  REVISION: number;
  domElement: HTMLDivElement;
  setMode: (mode: number) => void;
  reset: () => void;
  begin: () => void;
  end: () => number;
  update: () => void;
}

export const Stats = (): StatsAPI => {
  let startTime: number = performance.now(), prevTime = startTime;
  let ms = 0, msMin = Infinity, msMax = 0;
  let fps = 0, fpsMin = Infinity, fpsMax = 0;
  let frames = 0, mode = 0;

  const container = document.createElement('div');
  container.id = 'stats';
  container.addEventListener('mousedown', event => {
    event.preventDefault();
    setMode(++mode % 2)
  }, false);
  container.style.cssText = 'width:200px;cursor:pointer';

  const fpsDiv = document.createElement('div');
  fpsDiv.id = 'fps';
  fpsDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#002';
  container.appendChild( fpsDiv );

  const fpsText = document.createElement('div');
  fpsText.id = 'fpsText';
  fpsText.style.cssText = 'color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
  fpsText.innerHTML = 'FPS';
  fpsDiv.appendChild( fpsText );

  const fpsGraph = document.createElement('div');
  fpsGraph.id = 'fpsGraph';
  fpsGraph.style.cssText = 'position:relative;width:194px;height:30px;background-color:#0ff';
  fpsDiv.appendChild( fpsGraph );

  while ( fpsGraph.children.length < 194 ) {
    const bar = document.createElement('span');
    bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#113';
    fpsGraph.appendChild( bar );
  }

  const msDiv = document.createElement('div');
  msDiv.id = 'ms';
  msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;display:none';
  container.appendChild( msDiv );

  const msText = document.createElement('div');
  msText.id = 'msText';
  msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
  msText.innerHTML = 'MS';
  msDiv.appendChild( msText );

  const msGraph = document.createElement('div');
  msGraph.id = 'msGraph';
  msGraph.style.cssText = 'position:relative;width:194px;height:30px;background-color:#0f0';
  msDiv.appendChild(msGraph);

  while (msGraph.children.length < 194 ) {
    const bar = document.createElement('span');
    bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#131';
    msGraph.appendChild(bar);
  }

  const setMode = (value: number): void => {
    mode = value;
    switch (mode) {
      case 0:
        fpsDiv.style.display = 'block';
        msDiv.style.display = 'none';
        break;
      case 1:
        fpsDiv.style.display = 'none';
        msDiv.style.display = 'block';
        break;
    }
  }

  const reset = (): void => {
    startTime = performance.now(); prevTime = startTime;
    ms = 0; msMin = Infinity; msMax = 0;
    fps = 0; fpsMin = Infinity; fpsMax = 0;
    frames = 0; mode = 0;
  }

  const updateGraph = (dom: HTMLDivElement, value: number) => {
    const child = dom.appendChild(dom.firstChild);
    // WARNING
    // @ts-ignore
    child.style.height = `${value}px`;
  }

  const end = (): number => {
    const time = performance.now();

    ms = time - startTime;
    msMin = Math.min(msMin, ms);
    msMax = Math.max(msMax, ms);

    msText.textContent = (ms | 0) + ' MS (' + (msMin | 0) + '-' + (msMax | 0) + ')';
    updateGraph(msGraph, Math.min(30, 30 - (ms / 200) * 30));

    frames++;

    if (time > prevTime + 1000) {
      fps = Math.round((frames * 1000) / (time - prevTime));
      fpsMin = Math.min(fpsMin, fps);
      fpsMax = Math.max(fpsMax, fps);

      fpsText.textContent = fps + ' FPS (' + fpsMin + '-' + fpsMax + ')';
      updateGraph(fpsGraph, Math.min(30, 30 - (fps / 100) * 30));

      prevTime = time;
      frames = 0;
    }

    return time;
  }

  return {
    REVISION: 11,
    domElement: container,
    setMode,
    reset,
    begin: () => startTime = performance.now(),
    end,
    update: () => startTime = end(),
  }
};
