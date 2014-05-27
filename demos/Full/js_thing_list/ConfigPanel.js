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
 
var ConfigPanel = vs.core.createClass ({

  /** parent class */
  parent: vs.ui.GLView,

  initComponent: function () {
    this._super ();
    
    this.style.backgroundColor = new GLColor (22, 15, 58, 1);
    var size = this.__config__.size;
    if (!size) size = [300, 400];

    this.titleLabel = new vs.ui.GLText ({
      size : [200, 30],
      position: [(size[0] - 200)/2, 10],
      text : "FILTER BY:"
    }).init ();
    
    this.titleLabel.style.fontSize = "22px";
    this.titleLabel.style.fontFamily = "arial";
    this.titleLabel.style.color = new GLColor (196,189,233);
    this.titleLabel.style.textAlign = "center";

    this.add (this.titleLabel);

   var items = [
      {icon:'assets/bar.png', name: 'Bar'}, {icon:'assets/book.png', name: 'Book'},
      {icon:'assets/food.png', name: 'Food'}, {icon:'assets/idea.png', name: 'Idea'},
      {icon:'assets/movie.png', name: 'Movie'}, {icon:'assets/music.png', name: 'Music'},
      {icon:'assets/person.png', name: 'Person'}, {icon:'assets/place.png', name: 'Place'},
      {icon:'assets/product.png', name: 'Product'}
    ], item_view, item;
    
    var
      x = 0; y = 0, cx = 0, cy = 0, icons = [],
      dx = (size [0] - 280) / 2,
      dy = (size [1] - 400) / 2;
      
    for (var i = 0; i < items.length; i++)
    {
      item = items[i];
      this [item.name + '_icon'] = item_view = new ConfigIcon (item).init ();
      this.add (item_view);
      
      x = (i % 3) * 100; cx += x;
      y = 20 + Math.floor (i/3) * 130; cy += y
      item_view.position = [x + dx, y + dy];
      icons.push (item_view);
    };
    
    cx = size [0] / 2;
    cy = size [1] / 2;
    this.icons = icons;
  },

  show : function () {
    this._super ();
    this.icons.forEach (function (icon) {
      icon.show ();
    });
  },

  hide : function () {
    this.icons.forEach (function (icon) {
      icon.hide ();
    });
    var self = this;
    vs.scheduleAction (function () {
//      vs.ui.GLView.prototype.hide.call (self);
    }, 300);

  }
});
