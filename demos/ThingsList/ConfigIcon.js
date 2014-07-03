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
 
var iconStyle;
function getStyle () {
  if (!iconStyle) {
    iconStyle = new vs.gl.Style ();
    iconStyle.fontSize = "18px";
    iconStyle.fontFamily = "arial";
    iconStyle.color = new vs.gl.Color (196,189,233);
    iconStyle.textAlign = "center";
    iconStyle.backgroundColor = vs.gl.Color.transparent;
  }
  return iconStyle;
}

var showTitle = new vs.gl.Animation ({"scaling": 1});
showTitle.keyFrame (0, {"scaling": 0.3});
showTitle.duration = 300;
showTitle.begin = 100;

var hideTitle = new vs.gl.Animation ({"scaling": 0});
hideTitle.keyFrame (0, {"scaling": 1});
hideTitle.duration = 400;

var showIcon = new vs.gl.Animation ({"scaling": 1});
showIcon.keyFrame (0, {"scaling": 0.3});
showIcon.duration = 300;
showIcon.begin = 100;

var hideIcon = new vs.gl.Animation ({"scaling": 0});
hideIcon.keyFrame (0, {"scaling": 1});
hideIcon.duration = 400;

var ConfigIcon = vs.gl.createClass ({

  /** parent class */
  parent: vs.gl.View,
  
  properties: {
    "name" : "titleLabel#text",
    "icon" : "img#src"
  },
  
  initComponent: function () {
    this._super ();
 
    this.style = getStyle ();

    this.size = [80, 110]
    
    this.img = new vs.gl.Image ({
      size : [80, 80],
      transformOrigin: [40, 40],
      position: [0, 0],
    });
    
    this.img.init ();
    this.add (this.img);
    
    this.titleLabel = new vs.gl.Text ({
      size : [80, 20],
      position: [0, 85],
      transformOrigin: [40, 40],
      style : iconStyle
    }).init ();
    this.add (this.titleLabel);
  },
  
  show : function (clb) {
    this._super ();
    
    showTitle.process (this.titleLabel);
    showIcon.process (this.img);
  },
  
  hide : function (clb) {
    var self = this;
    
    hideIcon.process (this.titleLabel);
    hideIcon.process (this.img, function () {
      vs.gl.View.prototype.hide.call (self);
      if (clb) clb ();
    });
  }
});

