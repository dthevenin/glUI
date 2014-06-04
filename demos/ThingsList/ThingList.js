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

var ThingList = vs.core.createClass ({

  /** parent class */
  parent: vs.ui.GLApplication,
  
  settings_open: false,

  applicationStarted : function (event) {
    window.app = this;
    
    this.style.backgroundColor = GLColor.white;
  
    this.config_panel = new ConfigPanel ({
      position: [0, 44],
      size: [window.innerWidth, window.innerHeight - 44]
    }).init ();
    this.add (this.config_panel);
    this.config_panel.hide ();
     
    this.buildList ();

    this.buildNavBar ();
  },
  
  openSettings: function () {
    var list_view = this.list_view;
    if (this.settings_open) {
      list_view.show ();
      this.config_panel.hide ();
      this.show_list_anim.process (list_view);
      this.nav_bar.style.backgroundColor = new GLColor (41, 41, 41);
    }
    else {
      this.config_panel.show ();
      this.hide_list_anim.process (list_view, function () {
        list_view.hide ();
      });
      this.nav_bar.style.backgroundColor = new GLColor (60, 60, 60);
    }    
    this.settings_open = !this.settings_open;
  },
  
  buildNavBar : function () {
  
    this.nav_bar = new vs.ui.GLView ({
      size: [window.innerWidth, 44],
      position: [0,0]
    }).init ();
    this.nav_bar.style.backgroundColor = new GLColor (41, 41, 41);

    this.add (this.nav_bar);
    
    this.titleLabel = new vs.ui.GLText ({
      size: [150, 25],
      position: [(window.innerWidth / 2) - 75,10],
      text : "THINGLIST"
    }).init ();
    this.titleLabel.style.fontSize = "22px";
    this.titleLabel.style.fontFamily = "arial";
    this.titleLabel.style.color = GLColor.white;
    this.titleLabel.style.textAlign = "center";

    this.nav_bar.add (this.titleLabel);

    var button = new vs.ui.GLButton ({
      size: [40, 40],
      position: [3, 0]
    }).init ();
    this.nav_bar.add (button);
    
    var button_default_style = button.style;
    button_default_style.backgroundImage = "assets/setting.png";
    button_default_style.backgroundImageUV = [-0.2,1.2, -0.2,-0.2, 1.2,1.2, 1.2,-0.2];
    
    button.bind ('select', this, this.openSettings);

    var button = new vs.ui.GLImage ({
      size: [32, 32],
      src: "assets/question.png"
    }).init ();
    this.nav_bar.add (button);
    
    button.constraint.top = 6;
    button.constraint.right = 5;
  },
  
  buildList : function () {
    var size = [window.innerWidth, window.innerHeight - 44];
    var list_view = new vs.ui.GLList ({
      position: [0, 44],
      size: size,
      scroll: true
    }).init ();
    
    this.add (list_view);
    list_view.style.backgroundColor = GLColor.white;
    this.list_view = list_view;

    for (var i = 0; i < DATA.length; i++)
    {
      var item = DATA[i];
      var itemView = new ListItem (item).init ();
      itemView.size = [size[0], 77];
      list_view.add (itemView);
    };
    
    list_view.refresh ();
    
    // Hide list animation
    
    this.hide_list_anim = new GLAnimation ({"translation": [0, size[1]]});
    this.hide_list_anim.keyFrame (0, {"translation":[0,0]});
    this.hide_list_anim.duration = 200;
    
    this.show_list_anim = new GLAnimation ({"translation": [0, 0]});
    this.show_list_anim.keyFrame (0, {"translation":[0, size[1]]});
    this.show_list_anim.duration = 200;
  }
});


var DATA = [
  {icon:'assets/place_small.png', name: 'Here', type: 'Place'},
  {icon:'assets/book_small.png', name: 'The Design Of Eve', type: 'Book'},
  {icon:'assets/book_small.png', name: 'The Phantom Tollbooth', type: 'Book'},
  {icon:'assets/book_small.png', name: 'Reading', type: 'Book'},
  {icon:'assets/person_small.png', name: 'Rob', type: 'Person'},
  {icon:'assets/idea_small.png', name: 'Ideaaah', type: 'Idea'},
  {icon:'assets/movie_small.png', name: 'Make a movie', type: 'Movie'}
];


function loadApplication () {
  new ThingList ({id:"thinglist", layout:vs.ui.View.ABSOLUTE_LAYOUT}).init ();
  vs.ui.Application.start ();
  
//  vs.scheduleAction (test, 100);
//  vs.scheduleAction (animate, 100);
}

function animate () {
//  _pickUp (20, 20);
  app.openSettings ();
}

function test () {
  console.profile("webgl");
  vs.scheduleAction (animate);
  vs.scheduleAction (animate, 1000);
  vs.scheduleAction (animate, 2000);
  vs.scheduleAction (animate, 3000);
  vs.scheduleAction (animate, 4000);
  vs.scheduleAction (animate, 5000);
//   vs.scheduleAction (animate, 6000);
//   vs.scheduleAction (animate, 7000);
//   vs.scheduleAction (animate, 8000);
//   vs.scheduleAction (animate, 9000);
//   vs.scheduleAction (animate, 10000);
//   vs.scheduleAction (animate, 11000);
//   vs.scheduleAction (animate, 12000);
//   vs.scheduleAction (animate, 13000);
//   vs.scheduleAction (animate, 14000);
//   vs.scheduleAction (animate, 15000);
//   vs.scheduleAction (animate, 16000);
//   vs.scheduleAction (animate, 17000);
//   vs.scheduleAction (animate, 18000);
  vs.scheduleAction (function () {
    console.profileEnd("webgl");
  }, 6000);
}