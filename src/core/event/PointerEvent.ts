import { setupMousePointerEvent } from "./MouseEvent";
import { GLEvent } from "./GLEvent";
import { BaseView } from "../view/View";
import * as util from "../../util";

const defaultInDict: PointerEventInit = {};

const MOUSE_PROPS = [
  'bubbles',
  'cancelable',
  'view',
  'detail',
  'screenX',
  'screenY',
  'clientX',
  'clientY',
  'ctrlKey',
  'altKey',
  'shiftKey',
  'metaKey',
  'button',
  'relatedTarget',
  'pageX',
  'pageY'
];

const MOUSE_DEFAULTS = [
  false,
  false,
  null,
  null,
  0,
  0,
  0,
  0,
  false,
  false,
  false,
  false,
  0,
  null,
  0,
  0
];

export class GLPointerEvent extends GLEvent implements PointerEvent {
  height: number;
  isPrimary: boolean;
  pointerId: number;
  pointerType: string;
  pressure: number;
  tangentialPressure: number;
  tiltX: number;
  tiltY: number;
  twist: number;
  width: number;
  which: number;
  buttons: number;
  movementX: number;
  movementY: number;
  offsetX: number;
  offsetY: number;
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
  x: number;
  y: number;
  nbPointers: number;

  pointerList: GLEvent[];
  targetPointerList: GLEvent[];
  changedPointerList: GLEvent[];

  constructor() {
    super();

    this.pointerList = [];
    this.targetPointerList = [];
    this.changedPointerList = [];
  }

  getModifierState(keyArg: string): boolean {
    throw new Error("Method not implemented.");
  }

  initMouseEvent(
    typeArg: string,
    canBubbleArg: boolean,
    cancelableArg: boolean,
    viewArg: Window,
    detailArg: number,
    screenXArg: number,
    screenYArg: number,
    clientXArg: number,
    clientYArg: number,
    ctrlKeyArg: boolean,
    altKeyArg: boolean,
    shiftKeyArg: boolean,
    metaKeyArg: boolean,
    buttonArg: number,
    relatedTargetArg: EventTarget): void {
    throw new Error("Method not implemented.");
  }

  // define the properties of the PointerEvent interface
  init(
    inType: string,
    inDict: PointerEventInit, 
    src: any): void {
    inDict = inDict || defaultInDict;

    super.initEvent(
      inType,
      inDict.bubbles || false,
      inDict.cancelable || false
    );

    var e = this, i = 0, length_props = MOUSE_PROPS.length, prop;

    this.setSrcElement(src);
    this.setTarget(src);

    // define inherited MouseEvent properties
    for (; i < length_props; i++) {
      prop = MOUSE_PROPS[i];
      //@ts-ignore
      e[prop] = inDict[prop] || MOUSE_DEFAULTS[i];
    }
    this.buttons = inDict.buttons || 0;

    // Spec requires that pointers without pressure specified use 0.5 for down
    // state and 0 for up state.
    var pressure = 0;
    if (inDict.pressure) {
      pressure = inDict.pressure;
    } else {
      pressure = this.buttons ? 0.5 : 0;
    }

    // add x/y properties aliased to clientX/Y
    this.x = this.clientX;
    this.y = this.clientY;

    // define the properties of the PointerEvent interface
    this.pointerId = inDict.pointerId || 0;
    this.width = inDict.width || 0;
    this.height = inDict.height || 0;
    this.pressure = pressure;
    this.tiltX = inDict.tiltX || 0;
    this.tiltY = inDict.tiltY || 0;
    this.pointerType = inDict.pointerType || '';
    this.isPrimary = inDict.isPrimary || false;

    this.nbPointers = 0;
    this.pointerList.length = 0;
    this.targetPointerList.length = 0;
    this.changedPointerList.length = 0;
  };

  setSrcElement(src: any): void {
    super.setSrcElement(src);
    const _setSrcElement = (event: GLEvent): void => event.srcElement = src

    this.pointerList.forEach(_setSrcElement);
    this.targetPointerList.forEach(_setSrcElement);
    this.changedPointerList.forEach(_setSrcElement);
  }

  setTarget(src: any): void {
    super.setTarget(src);

    const _setTarget = (event: GLEvent): void => {
      event.target = src;
      event.currentTarget = src;
    }

    this.pointerList.forEach(_setTarget);
    this.targetPointerList.forEach(_setTarget);
    this.changedPointerList.forEach(_setTarget);
  }
}


export class Pointer extends GLPointerEvent {
  static _pointers: Pointer[] = [];
  identifier: number;

  constructor(identifier: number) {
    super();
    this.identifier = identifier;
  }

  configure(event: PointerEvent, srcElement: EventTarget, target: EventTarget, clientX?: number, clientY?: number): void {
    super.init(event.type, event, srcElement);

    this.pageX = event.pageX;
    this.pageY = event.pageY;
    if (clientX !== undefined) this.clientX = clientX;
    else this.clientX = event.clientX;
    if (clientY !== undefined) this.clientY = clientY;
    else this.clientY = event.clientY;

    if (srcElement) this.srcElement = srcElement;
    else this.srcElement = event.srcElement;

    if (target) this.target = target;
    else this.target = event.target;

    // Legacy property
    if (target) this.currentTarget = target;
    else this.currentTarget = event.currentTarget;
  }

  static getPointer(identifier: number): Pointer {
    var pointer = Pointer._pointers[identifier];

    if (!pointer) {
      pointer = new Pointer(identifier);
      Pointer._pointers[identifier] = pointer;
    }

    return pointer;
  }
}

export enum PointerTypes {
  TOUCH = 2,
  PEN = 3,
  MOUSE = 4,
};

export const {
  POINTER_START,
  POINTER_MOVE,
  POINTER_END,
  POINTER_CANCEL,
  buildEvent
} = setupMousePointerEvent();

interface BindingHandler {
  target: BaseView | HTMLElement | HTMLDocument;
  type: string;
  listener: any;
  handler: any;
  doc_handler?: (event: Event) => void;
  node_handler?: (event: Event) => void;
};

function getBindingIndex(
  target: BaseView | HTMLElement | HTMLDocument,
  type: string,
  listener: any): number
{
  if (!type || !listener || !listener.__event_listeners) return -1;
  for (let i = 0; i < listener.__event_listeners.length; i++) {
    const binding = listener.__event_listeners [i];
    if (binding.target === target &&
        binding.type === type &&
        binding.listener === listener)
      return i;
  }
  return -1;
}

/**
 * Option 2: Replace addEventListener with a custom version.
 */
export function addPointerListener(
  node: BaseView | HTMLElement | HTMLDocument, 
  type: string,
  listener: any,
  useCapture?: boolean): void {
  if (!type || !node) return;
  
//   if (node instanceof HTMLElement) {
//     node.addEventListener (type, listener, useCapture);
//     return;
//   }
  if (!listener) {
    console.error ("addPointerListener no listener");
    return;
  }
  let func = listener;
  if (!util.isFunction(listener)) {
    func = listener.handleEvent;
    if (util.isFunction(func)) func = func.bind (listener);
  }

  if (getBindingIndex(node, type, listener) !== -1) {
    console.error ("addPointerListener binding already existing");
    return;
  }

  if (!listener.__event_listeners) {
    listener.__event_listeners = [] as BindingHandler[];
  }

  const binding: BindingHandler = {
    target: node,
    type: type,
    listener: listener,
    handler: func,
  };
  listener.__event_listeners.push(binding);

  if (node instanceof BaseView) {
    node.addEventListener (type, binding.handler, useCapture);
  }
  else if (node instanceof Document) {
    // @ts-ignore
    binding.doc_handler = (event: Event): void => {
      const e = buildEvent(type, event, node);
      if (util.isFunction (binding.handler)) {
        binding.handler.call(node, e);
      }
      else if (util.isFunction (binding.handler.handleEvent)) {
        binding.handler.handleEvent.call(binding.handler, e);
      }
    };
    node.addEventListener (type, binding.doc_handler, useCapture);
  }
  else if (node instanceof HTMLElement) {
    binding.node_handler = (event: Event): void => {
      const e = buildEvent(type, event, node);
      if (util.isFunction (binding.handler)) {
        binding.handler.call(node, e);
      }
      else if (util.isFunction (binding.handler.handleEvent)) {
        binding.handler.handleEvent.call(binding.handler, e);
      }
    };
    node.addEventListener (type, binding.node_handler, useCapture);
  }
}

export function removePointerListener(
  node: BaseView | HTMLElement | HTMLDocument,
  type: string,
  listener: any,
  useCapture?: boolean): void
{
  if (!type || !node) return;
  
//   if (node instanceof HTMLElement) {
//     node.removeEventListener (type, listener, useCapture);
//     return;
//   }
  
  if (!listener) {
    console.error ("removePointerListener no listener");
    return;
  }

  var index = getBindingIndex(node, type, listener);
  if (index === -1) {
    console.error ("removePointerListener no binding");
    return;
  }
  var binding = listener.__event_listeners [index];
  listener.__event_listeners.remove (index);

  if (node instanceof BaseView) {
    node.removeEventListener(type, binding.handler, useCapture);
  }
  else if (node instanceof HTMLElement) {
    node.removeEventListener(type, binding.node_handler, useCapture);
  }
  else if (node instanceof Document) {
    node.removeEventListener(type, binding.doc_handler, useCapture);
  }
}

function _dispatch_event (obj: any, list: [], e: GLEvent) {
  e.currentTarget = obj;
  
  list.forEach ((handler: any) => {
    if (util.isFunction(handler)) {
      handler.call(obj, e);
    }
    else if (util.isFunction(handler.handleEvent)) {
      handler.handleEvent.call(handler, e);
    }
  });
}

export function dispatch_event(type: string, obj: any, event: GLEvent): void {
  let event_type;
  
  if (type === POINTER_START) event_type = "_pointer_start";
  else if (type === POINTER_MOVE) event_type = "_pointer_move";
  else if (type === POINTER_END || type === POINTER_END) event_type = "_pointer_end";

  const e = buildEvent (type, event, obj);
  let path = e.path, list, i = 0;
  for (; i < path.length; i ++) {
    obj = path [i];
    list = obj[event_type];
    if (list && list.length) {
      e.setTarget (obj);
      _dispatch_event (obj, list, e);
    }
  }
}
