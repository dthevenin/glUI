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
 
var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var duration = 300;
var timing = vs.gl.Animation.EASE_OUT;

var weekLineOut = new vs.gl.Animation ({"translation": [0,0,0]});
weekLineOut.keyFrame (0, {"translation": [0,0,0]});
weekLineOut.duration = duration;
weekLineOut.timing = timing;

var weekLineIn = new vs.gl.Animation ({"translation": [0,0,0]});
weekLineIn.duration = duration;
weekLineIn.timing = timing;

var day1LineIn = new vs.gl.Animation ({"rotation": [0,0,0]});
day1LineIn.keyFrame (0, {"rotation": [-90,0,0]});
day1LineIn.duration = duration;
day1LineIn.timing = timing;

var day1LineOut = new vs.gl.Animation ({"rotation": [-90,0,0]});
day1LineOut.keyFrame (0, {"rotation": [0,0,0]});
day1LineOut.duration = duration;
day1LineOut.timing = timing;

var day2LineIn = new vs.gl.Animation ({"rotation": [0,0,0], "translation": [0,0,0]});
day2LineIn.keyFrame (0, {"rotation": [90,0,0], "translation": [0,0,0]});
day2LineIn.duration = duration;
day2LineIn.timing = timing;

var day2LineOut = new vs.gl.Animation ({"rotation": [90,0,0], "translation": [0,0,0]});
day2LineOut.keyFrame (0, {"rotation": [0,0,0], "translation": [0,0,0]});
day2LineOut.duration = duration;
day2LineOut.timing = timing;

var dayStyle, dateStyle, hourStyle, textStyle;

var Peek = vs.core.createClass ({

  /** parent class */
  parent: vs.gl.Application,
  
  settings_open: false,

  applicationStarted : function (event) {

    window.app = this;     

    this.__tap_recognizer = new vs.ui.TapRecognizer (this);
    
    this._week_view = [];
   
    this.initStyles ();
    this.buildNavBar ();
    this.buildDay ();
    this.buildCalendar();
    
    this.style.backgroundColor = new vs.gl.Color (26, 33, 51);
  },
  
  initStyles : function () {
    dayStyle = new vs.gl.Style ();
    dayStyle.fontSize = "12px";
    dayStyle.fontFamily = "arial";
    dayStyle.color = vs.gl.Color.white;
    dayStyle.textAlign = "center";
    dayStyle.backgroundColor = new vs.gl.Color (186, 204, 69);

    dateStyle = new vs.gl.Style ();
    dateStyle.fontSize = "18px";
    dateStyle.fontFamily = "arial";
    dateStyle.color = vs.gl.Color.white;
    dateStyle.textAlign = "center"; 
    dateStyle.backgroundColor = new vs.gl.Color (186, 204, 69);

    hourStyle = new vs.gl.Style ();
    hourStyle.fontSize = "18px";
    hourStyle.fontFamily = "arial";
    hourStyle.color = vs.gl.Color.white;
    hourStyle.backgroundColor = new vs.gl.Color (252, 181, 48);
    hourStyle.textAlign = "center";

    textStyle = new vs.gl.Style ();
    textStyle.fontSize = "18px";
    textStyle.fontFamily = "arial";
    textStyle.color = new vs.gl.Color (105, 137, 145);
    textStyle.textAlign = "left";
  },

  buildNavBar : function () {
  
    this.nav_bar = new vs.gl.View ({
      size: [window.innerWidth, 64],
      position: [0,0]
    }).init ();
    this.nav_bar.style.backgroundColor = new vs.gl.Color (26, 33, 51);

    this.add (this.nav_bar);
    
    var button = new vs.gl.Image ({
      size: [51, 64],
      src: "assets/leaf.png"
    }).init ();
    this.nav_bar.add (button);

    this.monthView = new vs.gl.Text ({
      size: [150, 20],
      text : "XXX"
    }).init ();
    this.monthView.constraint.middleX = 0;
    this.monthView.constraint.middleY = 0;
    
    this.monthView.style.fontSize = "18px";
    this.monthView.style.fontFamily = "arial";
    this.monthView.style.color = vs.gl.Color.white;
    this.monthView.style.textAlign = "center";
    this.nav_bar.add (this.monthView);

    this.yearView = new vs.gl.Text ({
      size: [50, 20],
      text : "2014"
    }).init ();
    this.yearView.constraint.right = 30;
    this.yearView.constraint.middleY = 0;
    
    this.yearView.style.fontSize = "15px";
    this.yearView.style.fontFamily = "arial";
    this.yearView.style.color = new vs.gl.Color (186, 204, 69);
    this.yearView.style.textAlign = "right";
    this.nav_bar.add (this.yearView);
  },
  
  buildCalendar : function () {
    var date = new Date ();
    var month = date.getMonth ();
    
    this.monthView.text = MONTHS [month];
    this.yearView.text = date.getYear () + 1900;
    // set the the bingining of the month
    date.setDate (1);
    // the calendar start to monday
    date.setTime (date.getTime () - (date.getDay () - 1) * 86400000);
    
    var y = 64, index = 0;    
    while (date.getMonth () <= month) {
      var line = new WeekView ({index: index++}).init ();
      line.position = [0, y];
      line.setDate (date);
      this.add (line);
      line.addPointerRecognizer (this.__tap_recognizer);
      
      this._week_view.push (line);
      y += 105;
    }
  },
  
  buildDay: function () {
    this.day1 = new DayView ({
      position : [0, 64],
      transformOrigin: [0,0],
      rotation: [-90, 0, 0],
      hour: "12:00",
      text: "Lunch with Sam"
    }).init ();
    this.day1.hide ();
    
    this.day2 = new DayView ({
      position : [0, 64],
      transformOrigin: [0,104],
      rotation: [90, 0, 0],
      hour: "20:00",
      text: "Roller Disco Party"
    }).init ();
    this.day2.hide ();

    this.add (this.day2);
    this.add (this.day1);
  },
  
  openWeek : function (index) {
    var dy = 208, self = this;
  
    this._week_opened = index
    this._is_animating = true;
    for (var i = index + 1; i < this._week_view.length; i++) {
      var line = this._week_view [i];
      weekLineOut.keyFrame (1, {"translation": [0,208,0]});
      weekLineOut.process (line);
    }
    
    this.day1.translation = [0, (index + 1) * 105];
    this.day1.show ();
    day1LineIn.process (this.day1, function () {
      self._is_animating = false;
    });
    
    this.day2.show ();
    day2LineIn.keyFrame (0, {"rotation": [90,0,0], "translation": [0, (index ) * 105,0]});
    day2LineIn.keyFrame (1, {"rotation": [0,0,0], "translation": [0, (index + 2) * 105,0]});
    day2LineIn.process (this.day2);
  },

  closeWeek : function (clb) {
    if (this._week_opened === undefined) {
      if (clb) clb ();
      return;
    }
    
    for (var i = this._week_opened + 1; i < this._week_view.length; i++) {
      var line = this._week_view [i];
      weekLineIn.keyFrame (0, {"translation": [0,208,0]});
      weekLineIn.process (line);
    }
    
    var nbEndAnim = 0, self = this;
    
    function endClose () {
      self._is_animating = false;
      if (clb) clb ();
    }

    var day1 = this.day1;
    day1LineOut.process (day1, function () {
      day1.hide ();
      nbEndAnim ++;
      if (nbEndAnim === 2) endClose ();
    });
    
    var day2 = this.day2;
    day2LineOut.keyFrame (0, {"rotation": [0,0,0], "translation": [0, (this._week_opened + 2) * 105,0]});
    day2LineOut.keyFrame (1, {"rotation": [90,0,0], "translation": [0, (this._week_opened ) * 105,0]});
    day2LineOut.process (day2, function () {
      day2.hide ();
      nbEndAnim ++;
      if (nbEndAnim === 2) endClose ();
    });

    this._week_opened = undefined;
    this._is_animating = true;
  },

  didTap : function (nb, elem) {
    if (this._is_animating) return;
    
    var index = elem.index, self = this;
    if (this._week_opened === index) {
      this.closeWeek ();
      return;
    }
    this.closeWeek (function () {
      self.openWeek (index);
    });
  }
    
});


var WeekView = vs.core.createClass ({

  /** parent class */
  parent: vs.gl.View,
  
  settings_open: false,
  
  properties: {
    index: vs.core.Object.PROPERTY_IN_OUT
  },
  
  constructor : function (config) {
    config = config || {};
    config.style = new vs.gl.Style ();
    config.style.backgroundColor = new vs.gl.Color (186, 204, 69);
    config.size = [window.innerWidth, 104];
    
    this._super (config);
  },

  setDate : function (date) {
    
    var days = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
    var size = this._size, width = size[0] / 7, x = 0;
    
    for (var i = 0; i < 7; i++) {
      var text = new vs.gl.Text ({
        size: [width, 20],
        position: [x, 40],
        style: dayStyle,
        text : days [i]
      }).init ();
      this.add (text);
      
      var text = new vs.gl.Text ({
        size: [width, 20],
        position: [x, 62],
        style: dateStyle,
        text : date.getDate ()
      }).init ();
      this.add (text);
      
      x += width;
      // one day increment
      date.setTime (date.getTime () + 86400000);
    }
  }
  
});

var DayView = vs.core.createClass ({

  /** parent class */
  parent: vs.gl.View,
  
  properties: {
    "hour": "hourView#text",
    "text": "textView#text"
  },
  
  constructor : function (config) {
    config = config || {};
    config.style = new vs.gl.Style ();
    config.style.backgroundColor = vs.gl.Color.white;
    config.size = [window.innerWidth, 104];
    
    this._super (config);
    
    this.hourView = new vs.gl.Text ({
      size: [60, 30],
      position: [20, 40],
      style: hourStyle
    }).init ();
    this.add (this.hourView);
  
    this.textView = new vs.gl.Text ({
      size: [400, 30],
      position: [90, 40],
      style: textStyle
    }).init ();
    this.add (this.textView);
  }
});

