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

require.config (
  { paths: {
    "data": "data",
    "ListItem": "ListItem",
    "core": "../lib/core",
    "recognizers": "../lib/recognizers",
    "widget": "../lib/widget",
    "class": "../lib/class",
    "util": "../lib/util"
  } });

require (['core', 'class', 'recognizers', 'widget', 'data', 'ListItem'],
function (core, klass, recognizers, widget, Data, ListItem) {
  
var CoverFlow = klass.createClass ({

  /** parent class */
  parent: core.Application,
  
  settings_open: false,

  applicationStarted : function () {
    this.buildList ();
  },
  
  buildList: function () {
    var size = this.size;
  
    var list = new widget.List ({
      size : [300, size[1]],
      position: [(size[0] - 300)/2, 0],
      scroll: true
    }).init ();
    
    var __tap_recognizer = new recognizers.TapRecognizer (list);
    
    list.add = function (item) {
      item.__index = this.__children.length;
      core.View.prototype.add.call (list, item);
      
      item.addPointerRecognizer (__tap_recognizer);
    }
    
    list.refresh = function () {
      core.View.prototype.refresh.call (this);

      var children = this.__children;
      if (!children || children.length === 0) return;

      if (this.__scroll__) {
        this.__scroll__.refresh ();
      }
    };
    
    var open_item;
    list._updateSelectItem = function (item) {

      if (item.__index === undefined) {
        return;
      }
      
      if (open_item) {
        this.closeItem ();
      }
      
      if (item === open_item) {
        open_item = null;
        return;
      }
      
      this.openItem (item.__index);
      open_item = item;
    };
    
    var duration = 200;
    var timing = core.Animation.LINEAR;
  
    var animationPanelShow = new core.Animation ();
    animationPanelShow.keyFrame (0, {
      'rotation': [-40, 0, 0],
      'translation': [0, 0, 0]
    });
    animationPanelShow.duration = duration;
    animationPanelShow.timing = timing;

    var animationPageOut = new core.Animation ({
      'rotation': [-40, 0, 0],
      'translation': [0, 0, 0]
    });
    animationPageOut.duration = duration;
    animationPageOut.timing = timing;
    
    var movebackPanel = new core.Animation ({'translation': [0,0,0]});
    movebackPanel.duration = duration;
    movebackPanel.timing = timing;      

    var hidePanelAnim = new core.Animation ();
    hidePanelAnim.duration = duration;
    hidePanelAnim.timing = timing;
    
    list.openItem = function (index) {
      var item, scrollPos = list.__gl_scroll;
      
      list.__index = index;
      var dy = 0;
      
      for (var i = 1; i < index; i ++) {
        item = this.__children [i];

        itemPos = item.position;
        
        // do not animate not visible panel
        if (itemPos [1] < - scrollPos [1]) continue;
        
        ty = - (itemPos [1] - dy) - scrollPos [1];
        dy += 10;

        hidePanelAnim.keyFrame (1, {'translation': [0, ty, 0]});
        hidePanelAnim.process (item);
      }
     
      item = this.__children [index];

      animationPanelShow.keyFrame (1, {
        'rotation': [0, 0, 0],
        'translation': [0, (size[1] - 300) / 2  - scrollPos [1] - item.position [1]]
      });
      animationPanelShow.process (item);

      index++;
      dy = 0;
      var l = this.__children.length;
      while (index < l) {
        item = this.__children [--l];
        
        itemPos = item.position;

        // do not animate not visible panel
        if (itemPos [1] > size[1] - scrollPos [1]) continue;

        ty = size[1] - itemPos [1] - dy - scrollPos [1];
        dy += 10;

        hidePanelAnim.keyFrame (1, {'translation': [0, ty, 0]});
        hidePanelAnim.process (item);
      }
      
      list.scroll = false;
    }
    
    list.closeItem = function () {
      var item, index = list.__index;
      
      for (var i = 0; i < index; i ++) {
        item = this.__children [i];
        
        // do not animate not moved panels
        if (item.translation [1] === 0) continue;
        
        movebackPanel.process (item);
      }
     
      item = this.__children [index];
      animationPageOut.process (item);
    
      index++;
      for (index; index < this.__children.length; index ++) {
        item = this.__children [index];

        // do not animate not moved panels
        if (item.translation [1] === 0) continue;
        
        movebackPanel.process (item);  
      }
      
      list.scroll = true;
    }
    
    this.add (list);
    var l = Data.length;
    for (var i = 0; i < l * 10; i++) {

      var d = Data [i % l];
//      var model = new vs.core.Model ().init ();
//      model.parseData (d)

      var item = new ListItem ({
        size : [300, 300],
        position : [0, 100 * i],
        rotation: [-40, 0, 0]
      }).init ();
      list.add (item);
//      item.configure (model);
      item.configure (d);

      item.style.backgroundColor = new core.Color (240, 240, 240);
      item.style.shadowOffset = [0, 0];
      item.style.shadowBlur = 150;
      item.style.shadowColor = new core.Color (0, 0, 0, 0.5);;
    }
    
    window.list = list;
    return;
  }
});

function loadApplication () {
  new CoverFlow ().init ();
  core.Application.start ();
}

loadApplication ();
});