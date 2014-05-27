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
 

var ListItemGame = vs.core.createClass ({

  /** parent class */
  parent: vs.ui.GLView,
  
  properties: {
    "imageUrl": "imageView#src",
    "title": "titleView#text",
    "description": "infoView#text",
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
  
  initComponent: function () {
    this._super ();
    
    this.imageView = new vs.ui.GLImage ({
      position: [5, 5],
      size: [60, 60]
    }).init ();
    this.add (this.imageView);
    this.imageView.style.backgroundColor = GLColor.transparent;


    this.titleView = new vs.ui.GLText ({
      size: [245, 20],
      position: [70, 5]
    }).init ();
    
    this.titleView.style.fontSize = "18px";
    this.titleView.style.fontFamily = "arial";
    this.titleView.style.color = GLColor.black;
    this.titleView.style.textAlign = "left";

    this.add (this.titleView);

    this.infoView = new vs.ui.GLText ({
      size: [245, 20],
      position: [70, 25]
    }).init ();
    
    this.infoView.style.fontSize = "12px";
    this.infoView.style.fontFamily = "arial";
    this.infoView.style.color = GLColor.black;
    this.infoView.style.textAlign = "left";
    this.infoView.constraint.right = 5;
    this.infoView.constraint.left = 70;

    this.add (this.infoView);

    this.ratingView = new vs.ui.GLText ({
      size: [245, 20],
      position: [70, 50]
    }).init ();
    
    this.ratingView.style.fontSize = "10px";
    this.ratingView.style.fontFamily = "FontAwesome";
    this.ratingView.style.color = new GLColor (100, 100, 100);
    this.ratingView.style.textAlign = "right";
    this.ratingView.constraint.right = 5;

    this.add (this.ratingView);
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
