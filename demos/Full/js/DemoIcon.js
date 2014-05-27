

function createStyle () {
  if (!DemoIcon.style) {
    DemoIcon.style = new GLStyle ();
    DemoIcon.style.fontFamily = "arial";
    DemoIcon.style.color = GLColor.white;
    DemoIcon.style.textAlign = "center";
  }
}

var DemoIcon = vs.core.createClass ({

  /** parent class */
  parent: vs.ui.GLView,
  
  /*****************************************************************
   *               private/protected members
   ****************************************************************/
   
  /**
   *
   * @private
   * @type {PointerRecognizer}
   */
  __tap_recognizer: null,

  /**
   *
   * @protected
   * @type {boolean}
   */
  _selected: false,

  properties: {
    "name" : "titleLabel#text",
    "img": "imageView#src"
  },
  
  /**
   * @protected
   * @function
   */
  constructor : function (config) {
    this._super (config);
    
    createStyle ();
    
    var sizeIcon = config.size [0] / 3;
    var dy;
    
    if (config.size [0] === 75) {
      dy = 25;
      DemoIcon.style.fontSize = "14px";
    }
    else {
      dy = 50;
      DemoIcon.style.fontSize = "20px";
    }


    this.imageView = new GLImage ({
      size : [sizeIcon, sizeIcon],
      position : [sizeIcon,20]
    }).init ();
    
    this.add (this.imageView);

    this.titleLabel = new vs.ui.GLText ({
      size : [config.size [0], 30],
      position: [0, config.size [1] - dy],
      style : DemoIcon.style
    }).init ();
    this.add (this.titleLabel);

    if (!this.__tap_recognizer) {
      this.__tap_recognizer = new vs.ui.TapRecognizer (this);
      this.addPointerRecognizer (this.__tap_recognizer);
    }
  },
  
  /**
   * @protected
   * @function
   */
  destructor : function () {
    if (this.__tap_recognizer) {
      this.removePointerRecognizer (this.__tap_recognizer);
      this.__tap_recognizer = null;
    }
    
    this._super ();
  },

  /*****************************************************************
   *               Event methods
   ****************************************************************/
    
  /**
   * @protected
   * @function
   */
  didTouch : function () {
    this._selected = true;
    
    this.__back_color = this.style.backgroundColor ;
    this.style.backgroundColor = GLColor.lightGrey;
  },
  
  /**
   * @protected
   * @function
   */
  didUntouch : function () {
    this._selected = false;
    
    this.style.backgroundColor = this.__back_color;
    this.__back_color = null;
  },
  
  didTap : function () {
    this.propagate ('select');
  }
});
