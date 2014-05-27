var GenericDemo = vs.core.createClass ({

  /** parent class */
  parent: vs.ui.GLView,

  constructor: function (config) {
    this._super (config);
    
    this.fadeIn = new GLAnimation (['opacity', 1]);
    this.fadeIn.addKeyFrame (0, [0]);
    this.fadeIn.duration = 300;

    this.fadeOut = new GLAnimation (['opacity', 0]);
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

    GLAnimation.FadeOutDown.process (this.closeButton,function () {
      vs.ui.GLView.prototype.hide.call (self);
    });
    GLAnimation.FadeOutDown.duration = 300;
  },
  
  show : function () {
    this._super ();

//    this.fadeIn.process (this.demoPanel);

    GLAnimation.FadeInUp.process (this.closeButton);
    GLAnimation.FadeInUp.duration = 300;    
    
    if (this.demoPanel && this.demoPanel.runDemo) {
      this.demoPanel.runDemo ();
    }
  }
});


