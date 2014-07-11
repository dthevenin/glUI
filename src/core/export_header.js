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

if (!window.glui) {
  if (window.requirejs) {
    window.glui = function (name, dependencies, func) {
      define (name, dependencies, func);
    } 
    glui.config = require.config.bind (require);
  }
  else {
    window.glui = function (name, dependencies, func) {
      var args = [];
      if (dependencies) dependencies.forEach (function (keys) {
        args.push (glui.__modules [keys]);
      })
      var module = func.apply ({}, args);
      if (name) window.glui.__modules [name] = module;
    }
    glui.__modules = {};
    glui.config = function () {};
  }
}

glui ("core", ["util"], function (util) {

  "use strict";
  