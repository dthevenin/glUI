/**
 * Copyright (C) 2009-2013. David Thevenin, ViniSketch (c), and 
 * contributors. All rights reserved
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

glui ('MyApplication', ['core', 'class'], function (core, klass) {

  var MyApplication = klass.createClass ({

    /** parent class */
    parent: core.Application,
  
    applicationStarted : function (event) {
      this.iconsView.position = [0, 0];
      this.image.size = [300, 300];
    }
  });

  return MyApplication;
});

glui ('MySuperView', ['core', 'class'], function (core, klass) {

  var MySuperView = klass.createClass ({

    /** parent class */
    parent: core.View,
  
    constructor: function (config) {

      if (!config.size) config.size = [100, 100];
      if (!config.position) config.position = [0, 100];
    
      this._super (config);
    },
  
    didInitialize : function () {
      if (!this.style.backgroundColor) {
        this.style.backgroundColor = core.Color.yellow;
      }
    }
  });

  if (core.declareComponent) {
    core.declareComponent (MySuperView, "MY-SUPER-VIEW");
  }

  return MySuperView;
});
