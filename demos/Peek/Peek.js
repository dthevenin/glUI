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

require.config({
  baseUrl: "",
  paths: {
    'core' : '../lib/core',
    'class' : '../lib/class',
    'util' : '../lib/util',
    'recognizers' : '../lib/recognizers'
  }
});

require (["core", "class", "recognizers"],
  function (core, klass, recognizers) {

  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var duration = 300;
  var timing = core.Animation.EASE_OUT;

  var weekLineOut = new core.Animation ({"translation": [0,0,0]});
  weekLineOut.keyFrame (0, {"translation": [0,0,0]});
  weekLineOut.duration = duration;
  weekLineOut.timing = timing;

  var weekLineIn = new core.Animation ({"translation": [0,0,0]});
  weekLineIn.duration = duration;
  weekLineIn.timing = timing;

  var day1LineIn = new core.Animation ({"rotation": [0,0,0]});
  day1LineIn.keyFrame (0, {"rotation": [-90,0,0]});
  day1LineIn.duration = duration;
  day1LineIn.timing = timing;

  var day1LineOut = new core.Animation ({"rotation": [-90,0,0]});
  day1LineOut.keyFrame (0, {"rotation": [0,0,0]});
  day1LineOut.duration = duration;
  day1LineOut.timing = timing;

  var day2LineIn = new core.Animation ({"rotation": [0,0,0], "translation": [0,0,0]});
  day2LineIn.keyFrame (0, {"rotation": [90,0,0], "translation": [0,0,0]});
  day2LineIn.duration = duration;
  day2LineIn.timing = timing;

  var day2LineOut = new core.Animation ({"rotation": [90,0,0], "translation": [0,0,0]});
  day2LineOut.keyFrame (0, {"rotation": [0,0,0], "translation": [0,0,0]});
  day2LineOut.duration = duration;
  day2LineOut.timing = timing;

  var dayStyle, dateStyle, hourStyle, textStyle;

  var Peek = klass.createClass ({

    /** parent class */
    parent: core.Application,
  
    settings_open: false,

    applicationStarted : function (event) {

      window.app = this;     

      this.__tap_recognizer = new recognizers.TapRecognizer (this);
    
      this._week_view = [];
   
      this.initStyles ();

      this.mainView = new core.View ({
        scroll: true
      }).init ();
      this.mainView.constraint.top = 64;
      this.mainView.constraint.bottom = 0;
      this.mainView.constraint.left = 0;
      this.mainView.constraint.right = 0;
    
      this.add (this.mainView);

      this.buildNavBar ();
    
      this.buildDay ();
      this.buildCalendar();
    },
  
    initStyles : function () {
      dayStyle = new core.Style ();
      dayStyle.fontSize = "12px";
      dayStyle.fontFamily = "arial";
      dayStyle.color = core.Color.white;
      dayStyle.textAlign = "center";

      dateStyle = new core.Style ();
      dateStyle.fontSize = "18px";
      dateStyle.fontFamily = "arial";
      dateStyle.color = core.Color.white;
      dateStyle.textAlign = "center";  

      hourStyle = new core.Style ();
      hourStyle.fontSize = "18px";
      hourStyle.fontFamily = "arial";
      hourStyle.color = core.Color.white;
      hourStyle.backgroundColor = new core.Color (252, 181, 48);
      hourStyle.textAlign = "center";

      textStyle = new core.Style ();
      textStyle.fontSize = "18px";
      textStyle.fontFamily = "arial";
      textStyle.color = new core.Color (105, 137, 145);
      textStyle.textAlign = "left";
    },

    buildNavBar : function () {
  
      this.nav_bar = new core.View ({
        size: [window.innerWidth, 64],
        position: [0,0]
      }).init ();
      this.nav_bar.style.backgroundColor = new core.Color (26, 33, 51);

      this.add (this.nav_bar);
    
      var button = new core.Image ({
        size: [51, 64],
        src: "assets/leaf.png"
      }).init ();
      this.nav_bar.add (button);

      this.monthView = new core.Text ({
        size: [150, 20],
        text : "XXX"
      }).init ();
      this.monthView.constraint.middleX = 0;
      this.monthView.constraint.middleY = 0;
    
      this.monthView.style.fontSize = "18px";
      this.monthView.style.fontFamily = "arial";
      this.monthView.style.color = core.Color.white;
      this.monthView.style.textAlign = "center";
      this.nav_bar.add (this.monthView);

      this.yearView = new core.Text ({
        size: [50, 20],
        text : "2014"
      }).init ();
      this.yearView.constraint.right = 30;
      this.yearView.constraint.middleY = 0;
    
      this.yearView.style.fontSize = "15px";
      this.yearView.style.fontFamily = "arial";
      this.yearView.style.color = new core.Color (186, 204, 69);
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
    
      var y = 0, index = 0;    
      while (date.getMonth () <= month) {
        var line = new WeekView ({index: index++}).init ();
        line.position = [0, y];
        line.setDate (date);
        this.mainView.add (line);
        line.addPointerRecognizer (this.__tap_recognizer);
      
        this._week_view.push (line);
        y += 105;
      }
    },
  
    buildDay: function () {
      this.day1 = new DayView ({
        position : [0, 0],
        transformOrigin: [0,0],
        rotation: [-90, 0, 0],
        hour: "12:00",
        text: "Lunch with Sam"
      }).init ();
      this.day1.hide ();
    
      this.day2 = new DayView ({
        position : [0, 0],
        transformOrigin: [0,104],
        rotation: [90, 0, 0],
        hour: "20:00",
        text: "Roller Disco Party"
      }).init ();
      this.day2.hide ();

      this.mainView.add (this.day2);
      this.mainView.add (this.day1);
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
        self.mainView.refresh ();
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
        self.mainView.refresh ();
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

  var WeekView = klass.createClass ({

    /** parent class */
    parent: core.View,
  
    settings_open: false,
  
    properties: {
      index: core.Object.PROPERTY_IN_OUT
    },
  
    constructor : function (config) {
      config = config || {};
      config.style = new core.Style ();
      config.style.backgroundColor = new core.Color (186, 204, 69);
      config.size = [window.innerWidth, 104];
    
      this._super (config);
    },

    setDate : function (date) {
    
      var days = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
      var size = this._size, width = size[0] / 7, x = 0;
    
      for (var i = 0; i < 7; i++) {
        var text = new core.Text ({
          size: [width, 20],
          position: [x, 40],
          style: dayStyle,
          text : days [i]
        }).init ();
        this.add (text);
      
        var text = new core.Text ({
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

  var DayView = klass.createClass ({

    /** parent class */
    parent: core.View,
  
    properties: {
      "hour": "hourView#text",
      "text": "textView#text"
    },
  
    constructor : function (config) {
      config = config || {};
      config.style = new core.Style ();
      config.style.backgroundColor = core.Color.white;
      config.size = [window.innerWidth, 104];
    
      this._super (config);
    
      this.hourView = new core.Text ({
        size: [60, 30],
        position: [20, 40],
        style: hourStyle
      }).init ();
      this.add (this.hourView);
  
      this.textView = new core.Text ({
        size: [400, 30],
        position: [90, 40],
        style: textStyle
      }).init ();
      this.add (this.textView);
    }
  });

  function loadApplication () {
    new Peek ().init ();
    core.Application.start ();
  }

  loadApplication ();

});
