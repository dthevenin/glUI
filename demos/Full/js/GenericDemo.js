var GenericDemo = vs.core.createClass ({

  /** parent class */
  parent: vs.gl.View,

  constructor: function (config) {
    this._super (config);
    
    this.fadeIn = new vs.gl.Animation (['opacity', 1]);
    this.fadeIn.addKeyFrame (0, [0]);
    this.fadeIn.duration = 300;

    this.fadeOut = new vs.gl.Animation (['opacity', 0]);
    this.fadeOut.addKeyFrame (0, [1]);
    this.fadeOut.duration = 300;
  },

  onload : function () {
    this.closeButton.bind ('select', this);
  },
  
  notify : function (event) {

    if (event.src === this.closeButton) {
      this.hide ();
    }

  },
  
  hide : function () {
    if (this.demoPanel && this.demoPanel.stopDemo) {
      this.demoPanel.stopDemo ();
    }

    var self = this;
    
//    this.fadeOut.process (this.demoPanel);

    vs.gl.Animation.FadeOutDown.process (this.closeButton,function () {
      vs.gl.View.prototype.hide.call (self);
    });
    vs.gl.Animation.FadeOutDown.duration = 300;
  },
  
  show : function () {
    this._super ();

//    this.fadeIn.process (this.demoPanel);

    vs.gl.Animation.FadeInUp.process (this.closeButton);
    vs.gl.Animation.FadeInUp.duration = 300;    
    
    if (this.demoPanel && this.demoPanel.runDemo) {
      this.demoPanel.runDemo ();
    }
  }
});


