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
 
define ('ListItem', ["core", "class"], function (core, klass) {

var titleStyle, typeStyle;
function setStyle () {
  if (!titleStyle) {
    titleStyle = new core.Style ();
    titleStyle.fontSize = "22px";
    titleStyle.fontWeight = "bold";
    titleStyle.fontFamily = "Arial";
    titleStyle.color = core.Color.black;

    typeStyle = new core.Style ();
    typeStyle.fontSize = "17px";
    typeStyle.fontWeight = "100";
    typeStyle.fontFamily = "Arial";
    typeStyle.color = new core.Color (128, 128, 128);
  }
}
 
var ListItem = klass.createClass ({

  /** parent class */
  parent: core.View,
  
  properties: {
    "name" : "titleLabel#text",
    "type" : "typeLabel#text",
    "icon" : "img#src"
  },
  
  initComponent: function () {
    this._super ();
 
    setStyle ();

    this.size = [80, 110]
    
    this.img = new core.Image ({
      size : [30, 30],
      position: [5, 20],
    }).init ();
    
    this.add (this.img);
    
    var img = new core.Image ({
      size : [30, 33],
      src : "assets/arrow.png"
    }).init ();
    img.constraint.top = 15;
    img.constraint.right = 5;
    
    this.add (img);
    
    this.titleLabel = new core.Text ({
      size : [300, 20],
      position: [40, 10],
      style : titleStyle
    }).init ();
    this.add (this.titleLabel);
    
    this.typeLabel = new core.Text ({
      size : [100, 20],
      position: [40, 35],
      style : typeStyle
    }).init ();
    this.add (this.typeLabel);
    
    var bar = new core.View ({
      size: [1, 1],
      position: [0, 70],
    }).init ();
    bar.constraint.left = 0;
    bar.constraint.right = 0;

    bar.style.backgroundColor = new core.Color (200, 200, 200);
    this.add (bar);
  }
});

return ListItem;

});