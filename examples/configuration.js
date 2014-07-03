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


var TemplateTest = vs.gl.createClass ({

  /** parent class */
  parent: vs.gl.Application,
  
  applicationStarted : function (event) { 
  }
});

var Item = vs.gl.createClass ({

  /** parent class */
  parent: vs.gl.View,
  
  properties: {
    "rating": {
      set: function (v) {
        v = parseFloat (v);
        if (isNaN (v) || v < 0) { v = 0; }
        if (v > 5) { v = 5; }
        
        this._rating = v;
        this.setRating (v);
      }
    }
  },

  setRating : function (rating) {
    var text = rating + ": ";

    for (var i = 1; i < 6; i++) {
      if (rating >= i)
        text += "\uf005";
      else if (rating < i && rating > i - 1)
        text += "\uf123";
      else
        text += "\uf006";
    }
    
    this.ratingView.text = text;
  }
});