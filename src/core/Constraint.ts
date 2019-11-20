/*
  COPYRIGHT NOTICE
  Copyright (C) 2009-2012. David Thevenin, ViniSketch SARL (c), and 
  contributors. All rights reserved
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Lesser General Public License for more details.
  
  You should have received a copy of the GNU Lesser General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { camelize } from "../util";
import { BaseView } from "./view/View";

/**
 *  The Constraint class
 *
*/
export class Constraint {
  private top: number = null;
  private bottom: number = null;
  private right: number = null;
  private left: number = null;
  private middleX: number = null;
  private middleY: number = null;

  static createObjectFromStringStyle(str: string): Constraint {
    const obj = new Constraint();
    obj.parseStringStyle(str);
    return obj;
  }

  public parseStringStyle(str: string): void {

    function clean(css: string): string {
      return css
        .replace(/\/\*[\W\w]*?\*\//g, "") // remove comments
        .replace(/^\s+|\s+$/g, "") // remove trailing spaces
        .replace(/\s*([:;{}])\s*/g, "$1") // remove trailing separator spaces
        .replace(/\};+/g, "}") // remove unnecessary separators
        .replace(/([^:;{}])}/g, "$1;}") // add trailing separators
    }

    function refine(cssStr: string, isBlock?: boolean) {
      if (/^@/.test(cssStr)) {
        const css = cssStr.split(" ");
        return {
          "identifier": css.shift().substr(1).toLowerCase(),
          "parameters": css.join(" ")
        }
      }
      else if ((isBlock ? /:$/ : /:/).test(cssStr)) {
        const css = cssStr.split(":")
        return {
          "property": css.shift(),
          "value": css.join(":"),
        }
      } else {
        return cssStr;
      }
    }

    function parse(css: string, regExp: RegExp, object: any) {
      for (var m; (m = regExp.exec(css)) != null;) {
        if (m[2] == "{") object.block.push(object = {
          "selector": refine(m[1], true),
          "block": [],
          "parent": object
        });
        else if (m[2] == "}") object = object.parent;
        else if (m[2] == ";") object.block.push(refine(m[1]));
      }
    }

    const parseStyle = (cssStr: string) => {
      const block: [] = [];
      const css = { block };
      parse(clean(cssStr), /([^{};]*)([;{}])/g, css);
      return css;
    };

    const style = parseStyle(str).block;

    style.forEach((block: any): void => {
      const p: string = camelize(block.property);
      const value: number = parseInt(block.value, 10);
      if (!isNaN(value)) {
        // @ts-ignore
        this[p] = value;
      }
    });
  }

  clone() {
    var obj = new Constraint();
    this.copy(obj);

    return obj;
  }

  copy(constraint: Constraint) {

    if (!constraint) return;

    constraint.top = this.top;
    constraint.bottom = this.bottom;
    constraint.right = this.right;
    constraint.left = this.left;
    constraint.middleX = this.middleX;
    constraint.middleY = this.middleY;
  }

  __update_view(view: BaseView): void {
    if (!view) return;

    var
      x = view._position[0], y = view._position[1],
      w = view._size[0], h = view._size[1],
      pWidth, pHeight,
      top = this.top,
      bottom = this.bottom,
      right = this.right,
      left = this.left,
      middleX = this.middleX,
      middleY = this.middleY;

    const parentView = view.__parent;
    if (parentView) {
      pWidth = parentView._size[0];
      pHeight = parentView._size[1];
    }

    /// HORIZONTAL MANAGEMENT

    if (left === null && middleX === null && right === null) {
      // nothing to do
    }
    else if (left !== null && middleX === null && right === null) {
      x = left;
    }
    else if (left === null && middleX !== null && right === null) {
      if (pWidth) {
        x = (pWidth - w) / 2 + middleX;
      }
    }
    else if (left === null && middleX === null && right !== null) {
      if (pWidth) {
        x = pWidth - (w + right);
      }
    }

    else if (left !== null && middleX !== null && right === null) {
      x = left;
      if (pWidth) {
        w = pWidth - left * 2;
      }
      x += middleX;
    }
    else if (left !== null && middleX === null && right !== null) {
      x = left;
      if (pWidth) {
        w = pWidth - (left + right);
      }
    }

    else if (left === null && middleX !== null && right !== null) {
      if (pWidth) {
        w = pWidth - right * 2;
        x = right;
      }
      x += middleX;
    }

    else if (left !== null && middleX !== null && right !== null) {
      console.log("IMPOSSIBLE CONSTRAINT");
      // nothing to do
    }

    /// VERTICAL MANAGEMENT

    if (top === null && middleY === null && bottom === null) {
      // nothing to do
    }
    else if (top !== null && middleY === null && bottom === null) {
      y = top;
    }
    else if (top === null && middleY !== null && bottom === null) {
      if (pHeight) {
        y = (pHeight - h) / 2 + middleY;
      }
    }
    else if (top === null && middleY === null && bottom !== null) {
      if (pHeight) {
        y = pHeight - (h + bottom);
      }

    }

    else if (top !== null && middleY !== null && bottom === null) {
      y = top;
      if (pHeight) {
        h = pHeight - top * 2;
      }
      y += middleY;
    }
    else if (top !== null && middleY === null && bottom !== null) {
      y = top;
      if (pHeight) {
        h = pHeight - (top + bottom);
      }
    }

    else if (top === null && middleY !== null && bottom !== null) {
      if (pHeight) {
        h = pHeight - bottom * 2;
        y = bottom + middleY;
      }
    }

    else if (top !== null && middleY !== null && bottom !== null) {
      console.log("IMPOSSIBLE CONSTRAINT");
      // nothing to do
    }

    // UPDATE VIEW POS AND SIZE
    view._position[0] = x;
    view._position[1] = y;
    view._size[0] = w;
    view._size[1] = h;
  }
}
