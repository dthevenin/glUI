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
 
define ('ConfigIcon', ["core", "class"], function (core, klass) {

  var iconStyle;
  function getStyle () {
    if (!iconStyle) {
      iconStyle = new core.Style ();
      iconStyle.fontSize = "18px";
      iconStyle.fontFamily = "arial";
      iconStyle.color = new core.Color (196,189,233);
      iconStyle.textAlign = "center";
      iconStyle.backgroundColor = core.Color.transparent;
    }
    return iconStyle;
  }

  var showTitle = new core.Animation ({"scaling": 1});
  showTitle.keyFrame (0, {"scaling": 0.3});
  showTitle.duration = 300;
  showTitle.begin = 100;

  var hideTitle = new core.Animation ({"scaling": 0});
  hideTitle.keyFrame (0, {"scaling": 1});
  hideTitle.duration = 400;

  var showIcon = new core.Animation ({"scaling": 1});
  showIcon.keyFrame (0, {"scaling": 0.3});
  showIcon.duration = 300;
  showIcon.begin = 100;

  var hideIcon = new core.Animation ({"scaling": 0});
  hideIcon.keyFrame (0, {"scaling": 1});
  hideIcon.duration = 400;

  var ConfigIcon = klass.createClass ({

    /** parent class */
    parent: core.View,
  
    properties: {
      "name" : "titleLabel#text",
      "icon" : "img#src"
    },
  
    initComponent: function () {
      this._super ();
 
      this.style = getStyle ();

      this.size = [80, 110]
    
      this.img = new core.Image ({
        size : [80, 80],
        transformOrigin: [40, 40],
        position: [0, 0],
      });
    
      this.img.init ();
      this.add (this.img);
    
      this.titleLabel = new core.Text ({
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
        core.View.prototype.hide.call (self);
        if (clb) clb ();
      });
    }
  });

  return ConfigIcon;

});