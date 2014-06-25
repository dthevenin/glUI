var Demo = vs.core.createClass ({

  parent: vs.gl.Application,
  demos_list : null,
  
  constructor: function (config) {
    window.app = this;
    this._super ();
    
    this.demos_list = [];
    
    var elem = document.body;
    elem.className ="theme application absolute_layout" ;
  },
  
  /** The application is initialized */
  onload : function ()
  {
    this.style.backgroundColor = vs.gl.Color.black;
    var full_size = [window.innerWidth, window.innerHeight];
    var mode = 1; // tablet
    if (full_size[0] < 450) mode = 0;
    
    var
      size = this._size,
      sizeIcon = (mode === 0)?75:150,
      dx = (this._size [0] - Math.floor (this._size [0] / (sizeIcon + 10)) * (sizeIcon + 10)) / 2,
      x = dx,
      y = size [1] - (sizeIcon + 20);
    
    for (var i = 0; i < DEMOS_LIST.length; i++) {
      var data = DEMOS_LIST [i];
      var demoIcon = new DemoIcon ({
        position : [x, y],
        size: [sizeIcon, sizeIcon],
        name: data.name,
        img: data.img
      }).init ();
      demoIcon.style.backgroundColor = new vs.gl.Color ();
      demoIcon.style.backgroundColor.setRGBAColor.apply (
        demoIcon.style.backgroundColor,
        data.rgb
      );
      
      this.iconsView.add (demoIcon);
      
      demoIcon.bind ('select', this);
      
      if (i < DEMOS_LIST.length - 1) {
        x += sizeIcon + 10;
        if (x + sizeIcon> size [0]) {
          x = dx;
          y -= (sizeIcon + 10);
        }
      }
    }
    
    var text = new vs.gl.Text ({
      size: [245, 20],
      position: [dx, y - 30],
      text: "Mini Application demos:"
    }).init ();
    this.iconsView.add (text);
    
    text.style.fontSize = "15px";
    text.style.fontFamily = "Arial";
    text.style.fontWeight = "bold";
    text.style.color = vs.gl.Color.white;
    text.style.textAlign = "left";
    
    var bar = new vs.gl.View ({
      size: [size [0] - 2 * dx, 2],
      position: [dx, y - 10],
    }).init ();
    this.iconsView.add (bar);
    bar.style.backgroundColor = vs.gl.Color.white;
    
    x = dx;
    y -= (sizeIcon + 10 + 30);
    for (var i = 0; i < TEST_LIST.length; i++) {
      var data = TEST_LIST [i];
      var demoIcon = new DemoIcon ({
        position : [x, y],
        size: [sizeIcon, sizeIcon],
        name: data.name,
        img: data.img
      }).init ();
      demoIcon.style.backgroundColor = new vs.gl.Color ();
      demoIcon.style.backgroundColor.setRGBAColor.apply (
        demoIcon.style.backgroundColor,
        data.rgb
      );
      
      this.iconsView.add (demoIcon);
      
      demoIcon.bind ('select', this);
      
      if (i < TEST_LIST.length - 1) {
        x += sizeIcon + 10;
        if (x + sizeIcon> size [0]) {
          x = dx;
          y -= (sizeIcon + 10);
        }
      }
    }

    text = new vs.gl.Text ({
      size: [245, 20],
      position: [dx, y - 30],
      text: "Samples:"
    }).init ();
    this.iconsView.add (text);
    
    text.style.fontSize = "15px";
    text.style.fontFamily = "Arial";
    text.style.fontWeight = "bold";
    text.style.color = vs.gl.Color.white;
    text.style.textAlign = "left";
    
    bar = new vs.gl.View ({
      size: [size [0] - 2 * dx, 2],
      position: [dx, y - 10],
    }).init ();
    this.iconsView.add (bar);
    bar.style.backgroundColor = vs.gl.Color.white;
    
    
    //force hiding
    if (this.mapDemo) {
      vs.gl.View.prototype.hide.call (this.mapDemo);
    }
    if (this.thingList) {
      vs.gl.View.prototype.hide.call (this.thingList);
      if (mode === 0) {
        this.thingList.demoPanel.size = full_size;
      }
    }
    if (this.peek) {
      vs.gl.View.prototype.hide.call (this.peek);
      if (mode === 0) {
        this.peek.demoPanel.size = full_size;
      }
    }
    if (this.longList) {
      vs.gl.View.prototype.hide.call (this.longList);
      if (mode === 0) {
        this.longList.demoPanel.size = full_size;
      }
    }
    if (this.imagesDemo) {
      vs.gl.View.prototype.hide.call (this.imagesDemo);
    }
    if (this.animationsDemo) {
      vs.gl.View.prototype.hide.call (this.animationsDemo);
      if (mode === 0) {
        this.animationsDemo.size = full_size;
      }
    }
    if (this.textDemo) {
      vs.gl.View.prototype.hide.call (this.textDemo);
    }
    if (this.canvasDemo) {
      vs.gl.View.prototype.hide.call (this.canvasDemo);
    }
  },

  /** The application is initialized */
  applicationStarted : function (event) {
//    this.mapDemo.show ();
  },
  
  notify : function (event)
  {
    switch (event.src.name) {
      case "Map":
        this.mapDemo.show ();
        break;
    
      case "GamesList":
        this.longList.show ();
        break;
    
      case "ThingList":
        this.thingList.show ();
        break;
    
      case "Peek":
        this.peek.show ();
        break;
    
      case "Images":
        this.imagesDemo.show ();
        break;
    
      case "Animations":
        this.animationsDemo.show ();
        break;
    
      case "Text":
        this.textDemo.show ();
        break;
    
      case "Canvas":
        this.canvasDemo.show ();
        break;
    }
  }
});

var DEMOS_LIST = [
  {
    name: "Map",
    rgb: [0,174,235],
    img: "assets/map_100.png"
  },

  {
    name: "GamesList",
    rgb: [211,211,1],
    img: "assets/list_100.png"
  },

  {
    name: "ThingList",
    rgb: [0,164,124],
    img: "assets/folder_100.png"
  },

  {
    name: "Peek",
    rgb: [64, 64, 64],
    img: "assets/list_100.png"
  }
]

var TEST_LIST = [
  {
    name: "Images",
    rgb: [243,56,1],
    img: "assets/image_100.png"
  },

  {
    name: "Animations",
    rgb: [164,0,168],
    img: "assets/animation_100.png"
  },

  {
    name: "Text",
    rgb: [5,108,200],
    img: "assets/text_100.png"
  },

  {
    name: "Canvas",
    rgb: [70,31,173],
    img: "assets/canvas_100.png"
  }
];
