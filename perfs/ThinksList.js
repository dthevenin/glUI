var
  width = window.test_view.offsetWidth - 6,
  height = window.test_view.offsetHeight - 6;

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

define ('ConfigPanel', ["core", "class", "ConfigIcon"],
  function (core, klass, ConfigIcon) {

  var ConfigPanel = klass.createClass ({

    /** parent class */
    parent: core.View,

    initComponent: function () {
      this._super ();
    
      this.style.backgroundColor = new core.Color (22, 15, 58, 1);
      var size = this.__config__.size;
      if (!size) size = [300, 400];

      this.titleLabel = new core.Text ({
        size : [200, 30],
        position: [(size[0] - 200)/2, 10],
        text : "FILTER BY:"
      }).init ();
    
      this.titleLabel.style.fontSize = "22px";
      this.titleLabel.style.fontFamily = "arial";
      this.titleLabel.style.color = new core.Color (196,189,233);
      this.titleLabel.style.textAlign = "center";

      this.add (this.titleLabel);

     var items = [
        {icon:'assets/ThinksList/bar.png', name: 'Bar'}, {icon:'assets/ThinksList/book.png', name: 'Book'},
        {icon:'assets/ThinksList/food.png', name: 'Food'}, {icon:'assets/ThinksList/idea.png', name: 'Idea'},
        {icon:'assets/ThinksList/movie.png', name: 'Movie'}, {icon:'assets/ThinksList/music.png', name: 'Music'},
        {icon:'assets/ThinksList/person.png', name: 'Person'}, {icon:'assets/ThinksList/place.png', name: 'Place'},
        {icon:'assets/ThinksList/product.png', name: 'Product'}
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
      core.scheduleAction (function () {
  //      core.View.prototype.hide.call (self);
      }, 300);

    }
  });

  return ConfigPanel;
});

define ("ThinksList", ["core", "class", "widgets", "ConfigPanel"],
  function (core, klass, widgets, ConfigPanel) {
      
var testPerfAnim = klass.createClass ({

  /** parent class */
  parent: core.Application,
  
  settings_open: false,

  applicationStarted : function (event) {
    window.app = this;
    
    this.buildConfigPanel ();
    this.buildList ();
    this.buildNavBar ();
  },
  
  buildConfigPanel: function () {
    this.config_panel = new ConfigPanel ({
      position: [0, 44],
      size: [width, height - 44]
    }).init ();
    this.add (this.config_panel);
    this.config_panel.hide ();
  },
  
  openSettings: function () {
    var list_view = this.list_view;
    if (this.settings_open) {
      list_view.show ();
      this.config_panel.hide ();
      this.show_list_anim.process (list_view);
      this.nav_bar.style.backgroundColor = new core.Color (41, 41, 41);

      this.buttonOpen.animate ({
        'rotation' : [0,0,0],
        'scaling': 1,
        'opacity': 1
      }, {
        'duration': 500
      })
      
      this.buttonClose.animate ({
        'rotation' : [0,0,-360],
        'scaling': 0.3,
        'opacity': 0
      }, {
        'duration': 500
      })
    }
    else {
      this.config_panel.show ();
      this.hide_list_anim.process (list_view, function () {
        list_view.hide ();
      });
      this.nav_bar.style.backgroundColor = new core.Color (60, 60, 60);
      
      this.buttonOpen.animate ({
        'rotation' : [0,0,360],
        'scaling': 0.3,
        'opacity': 0
      }, {
        'duration': 500
      })

      this.buttonClose.animate ({
        'rotation' : [0,0,0],
        'scaling': 1,
        'opacity': 1
      }, {
        'duration': 500
      })
    }    
    this.settings_open = !this.settings_open;
  },
  
  buildNavBar : function () {
  
    this.nav_bar = new core.View ({
      size: [width, 44],
      position: [0,0]
    }).init ();
    this.nav_bar.style.backgroundColor = new core.Color (41, 41, 41);

    this.add (this.nav_bar);
    
    this.titleLabel = new core.Text ({
      size: [150, 25],
      position: [(width / 2) - 75,10],
      text : "THINGLIST"
    }).init ();
    this.titleLabel.style.fontSize = "22px";
    this.titleLabel.style.fontFamily = "arial";
    this.titleLabel.style.color = core.Color.white;
    this.titleLabel.style.textAlign = "center";

    this.nav_bar.add (this.titleLabel);

    var button = new widgets.Button ({
      size: [40, 40],
      position: [3, 0],
      transformOrigin : [20, 20]
    }).init ();
    this.nav_bar.add (button);
    
    var button_default_style = button.style;
    button_default_style.backgroundImage = "assets/ThinksList/setting.png";
    button_default_style.backgroundImageUV = [-0.2,1.2, -0.2,-0.2, 1.2,1.2, 1.2,-0.2];
    
    this.buttonOpen = button;

    button = new widgets.Button ({
      size: [40, 40],
      position: [3, 3],
      transformOrigin : [20, 20],
      rotation : [0,0,-360],
      scaling: 0.3,
      opacity: 0
    }).init ();
    this.nav_bar.add (button);
    
    button_default_style = button.style;
    button_default_style.backgroundImage = "assets/ThinksList/x-icon.png";
    button_default_style.backgroundImageUV = [-0.2,1.2, -0.2,-0.2, 1.2,1.2, 1.2,-0.2];
    
    this.buttonClose = button;

    var button = new core.Image ({
      size: [32, 32],
      src: "assets/ThinksList/question.png"
    }).init ();
    this.nav_bar.add (button);
    
    button.constraint.top = 6;
    button.constraint.right = 5;
  },
  
  buildList : function () {
    var size = [width, height - 44];
    var list_view = new widgets.List ({
      position: [0, 44],
      size: size,
      scroll: true
    }).init ();
    
    this.add (list_view);
    list_view.style.backgroundColor = core.Color.white;
    this.list_view = list_view;

    list_view.refresh ();
    
    // Hide list animation
    
    this.hide_list_anim = new core.Animation ({"translation": [0, size[1]]});
    this.hide_list_anim.keyFrame (0, {"translation":[0,0]});
    this.hide_list_anim.duration = 200;
    
    this.show_list_anim = new core.Animation ({"translation": [0, 0]});
    this.show_list_anim.keyFrame (0, {"translation":[0, size[1]]});
    this.show_list_anim.duration = 200;
  }

});

var app;

function startPerf (endClb) {
  var i = 1;
  for (; i < 10; i++) {
    setTimeout (function () {
      app.openSettings ();
    }, i * 500);
  }
  setTimeout (function () {
    if (endClb) endClb ();
  }, i * 500);
}

function launchTest (view) {
  app = new testPerfAnim ({id:"test"}).init ();
  core.Application.start ();
  
  app.startPerf = startPerf;
  
  return app;
}

return launchTest;
});