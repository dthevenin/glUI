import { BaseView } from "../view";
import { GLEventSource } from "./EventSource";

export class GLEvent implements Event {
  public path: GLEventSource[];
  bubbles: boolean;
  cancelBubble: boolean;
  cancelable: boolean;
  clipboardData: any;
  timeStamp: number;
  type: string;
  view: any;
  detail: any;
  screenX: number;
  screenY: number;
  clientX: number;
  clientY: number;
  ctrlKey: any;
  altKey: any;
  shiftKey: any;
  metaKey: any;
  button: any;
  relatedTarget: any;
  pageX: any;
  page: any;
  currentTarget: any;
  srcElement: any;
  target: any;
  defaultPrevented: boolean;
  eventPhase: number;
  returnValue: boolean;

  composed: boolean;
  isTrusted: boolean;
  AT_TARGET: number;
  BUBBLING_PHASE: number;
  CAPTURING_PHASE: number;
  NONE: number;

  constructor() {
    this.path = [];
  }

  initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void {
    this.bubbles = bubbles || false;
    this.cancelBubble = false;
    this.cancelable = cancelable || false;
    this.clipboardData = undefined;
    this.currentTarget = null;
    this.defaultPrevented = false;
    this.eventPhase = 0;
    this.path.length = 0;
    this.returnValue = true;
    this.srcElement = null;
    this.target = null;
    this.timeStamp = Date.now();
    this.type = type || '';
  }

  setSrcElement(src: GLEventSource): void {
    this.srcElement = src;
    this.target = src;
    // legacy code
    this.currentTarget = src;
    while (src) {
      this.path.push(src);
      const gl_view = src as unknown as BaseView;
      src = gl_view.__parent;
    }
  }

  setTarget(src: EventTarget): void {
    this.target = src;
    // legacy code
    this.currentTarget = src;
  }

  preventDefault(): void {
    this.defaultPrevented = true;
  }

  composedPath(): EventTarget[] {
    throw new Error("Method not implemented.");
  }

  stopImmediatePropagation(): void {
    throw new Error("Method not implemented.");
  }

  stopPropagation(): void {
    throw new Error("Method not implemented.");
  }
}
