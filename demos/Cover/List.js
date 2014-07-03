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

var info_pasquale = "Pasquale is a masculine Italian given name and a surname found all over Italy. It is a cognate of the French name Pascal, the Spanish Pascual, the Portuguese Pascoal and the Catalan Pasqual. Pasquale derives from the Latin paschalis or pashalis, which means \"relating to Easter\", from Latin pascha (\"Easter\"), Greek Πάσχα, Aramaic pasḥā, in turn from the Hebrew פֶּסַח, which means \"to be born on, or to be associated with, Passover day\". Since the Hebrew holiday Passover coincides closely with the later Christian holiday of Easter, the Latin word came to be used for both occasions."
var info_bar = "Part of the new wave of more eclectic and sophisticated gay hangouts that have steadily been gaining in prevalence and popularity in the Castro, the dapper and convivial Blackbird Bar (2124 Market St., 415-503-0630) is along the hip Church Street corridor (right at the intersection with Market Street). ";
var info_design = "The Shape of Design is an odd little design book. Instead of talking about typography, grids, or logos, it focuses on storytelling, co-dependency, and craft. It tries to supplement the abundance of technical talk and how-to elsewhere by elevating why great work is done. "

var CoverFlow = vs.gl.createClass ({

  /** parent class */
  parent: vs.gl.Application,
  
  settings_open: false,

  applicationStarted : function () {
    this.buildList ();
  },
  
  buildList: function () {
    var size = this.size;
  
    var list = new vs.gl.List ({
      size : [300, size[1]],
      position: [(size[0] - 300)/2, 0],
      scroll: true
    }).init ();
    
    var __tap_recognizer = new vs.ui.TapRecognizer (list);
    
    list.add = function (item) {
      item.__index = this.__children.length;
      vs.gl.View.prototype.add.call (list, item);
      
      item.addPointerRecognizer (__tap_recognizer);
    }
    
    list.refresh = function () {
      vs.gl.View.prototype.refresh.call (this);

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
    var timing = vs.gl.Animation.LINEAR;
  
    var animationPanelShow = new vs.gl.Animation ();
    animationPanelShow.keyFrame (0, {
      'rotation': [-40, 0, 0],
      'translation': [0, 0, 0]
    });
    animationPanelShow.duration = duration;
    animationPanelShow.timing = timing;

    var animationPageOut = new vs.gl.Animation ({
      'rotation': [-40, 0, 0],
      'translation': [0, 0, 0]
    });
    animationPageOut.duration = duration;
    animationPageOut.timing = timing;
    
    var movebackPanel = new vs.gl.Animation ({'translation': [0,0,0]});
    movebackPanel.duration = duration;
    movebackPanel.timing = timing;      

    var hidePanelAnim = new vs.gl.Animation ();
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
      var model = new vs.core.Model ().init ();
      model.parseData (d)

      var item = new ListItem ({
        size : [300, 300],
        position : [0, 100 * i],
        rotation: [-40, 0, 0]
      }).init ();
      list.add (item);
      item.configure (model);

      item.style.backgroundColor = new vs.gl.Color (240, 240, 240);
      item.style.shadowOffset = [0, 0];
      item.style.shadowBlur = 150;
      item.style.shadowColor = new vs.gl.Color (0, 0, 0, 0.5);;
    }
    
    window.list = list;
    return;
  }
});


var Data = [
  {
    "imageUrl": "assets/Caslte Clash.png",
    "title": "Caslte Clash",
    "description": "Build and battle your way to glory in Castle Clash! With over 30 million clashers worldwide.",
    "rating": 4.5
  },
  {
    "imageUrl": "assets/Cat War.png",
    "title": "Cat War",
    "description": "私は\"ケトピンクス\"と呼ばれる神です。",
    "rating": 3.5
  },
  {
    "imageUrl": "assets/Dragons Of Atlantis.png",
    "title": "Dragons Of Atlantis",
    "description": "ドラゴンズ オブ アトランティス：継承者。",
    "rating": 4.7
  },
  {
    "imageUrl": "assets/EXP3D.png",
    "title": "EXP3D",
    "description": "スクリーンをタッチして船を動かし、敵の弾丸をかわします。",
    "rating": 5
  },
  {
    "imageUrl": "assets/Football Freekick.png",
    "title": "Football Freekick",
    "description": "Free Kick Master is the most addictive football game ever.",
    "rating": 4.2
  },
  {
    "imageUrl": "assets/Magic of the Unicorn.png",
    "title": "Magic of the Unicorn",
    "description": "Magic of the Unicorn",
    "rating": 3.1
  },
  {
    "imageUrl": "assets/Ninja Run.png",
    "title": "Ninja Run",
    "description": "Ninja Run",
    "rating": 2.5
  },
  {
    "imageUrl": "assets/Pitfall.png",
    "title": "Pitfall",
    "description": "On his 30th Anniversary, take control of Pitfall Harry once again in PITFALL!",
    "rating": 3.5
  },
  {
    "imageUrl": "assets/Samurai Defender.png",
    "title": "Samurai Defender",
    "description": "戦国時代を舞台とした単純明快ディフェンス型アクションゲーム迫り来る敵兵からお城を守りきれ！",
    "rating": 4.1
  },
  {
    "imageUrl": "assets/Sapce Kaeru.png",
    "title": "Space Kaeru",
    "description": "憧れの火星を目指してカエル三兄弟が今、宇宙へ旅立つ!!",
    "rating": 1
  },
  {
    "imageUrl": "assets/Slim vs Mushroom.png",
    "title": "Slim vs Mushroom",
    "description": "魔界キノコ軍団が平和なスライムの村を侵略しようとしています。",
    "rating": 2.4
  },
  {
    "imageUrl": "assets/SummitX Snowboarding.png",
    "title": "SummitX Snowboarding",
    "description": "SummitX Snowboarding",
    "rating": 2.9
  }
]