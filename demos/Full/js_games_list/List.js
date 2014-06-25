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

var GamesList = vs.core.createClass ({

  /** parent class */
  parent: vs.gl.View,
  
  settings_open: false,

  onload : function (event) {
    this.buildList ();
  },
  
  buildList: function () {
    var size = [320, 500];
    
    var list = new vs.gl.List ({
      size : size,
      scroll: true
    }).init ();
    this.add (list);
    
    list.constraint.top = 0;
    list.constraint.bottom = 0;

    var l = Data.length;
    for (var i = 0; i < l * 5; i++) {
//    for (var i = 0; i < l * 1; i++) {
//    for (var i = 0; i < 2; i++) {
      var d = Data [i % l];
      var model = new vs.core.Model ().init ();
      model.parseData (d)

      var item = new ListItemGame ().init ();
      list.add (item);
      item.size = [size[0], 70];
      item.position = [0, 71 * i];
      item.link (model);
      item.constraint.right = 0;
      item.constraint.left = 0;

      item.style.backgroundColor = new vs.gl.Color (240, 240, 240);
    }
    
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