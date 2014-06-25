var MapDemo = vs.core.createClass ({

  /** parent class */
  parent: vs.gl.View,

  initComponent : function () {

    this._super ();

    this.input = new vs.ui.InputField ({
      position: [20, 10],
      size: [700, 35]
    }).init ();
    document.body.appendChild (this.input.view);

  },

  onload : function () {

    this.closeButton.bind ('select', this);
    this.NewYorkButton.bind ('select', this);
    this.ParisButton.bind ('select', this);
    this.ESECButton.bind ('select', this);
    
    var size = this._size;
    this.mapView.size = [size[0] - 40, size [1] - 115];
    
    this.mapView.transformOrigin = [(size[0] - 40)/2, (size [1] - 105)/2];
    this.input.size = [size[0] - 40, 35];
    
    this.input.hide ();
  },
  
  notify : function (event) {

    if (event.src === this.closeButton) {
      this.hide ();
    }

    else if (event.src === this.NewYorkButton) {
      this.mapView.setLocation (40.7143, -74.0060);
    }

    else if (event.src === this.ParisButton) {
      this.mapView.setLocation (48.8534, 2.3485);
    }

    else if (event.src === this.ESECButton) {
      this.mapView.setLocation (35.6105, 139.8019);
    }
  },
  
  hide : function () {
    var self = this;
    
    vs.ext.fx.Animation.FadeOutUp.process (this.input);
  
    vs.gl.Animation.FadeOutDown.duration = 300;
    vs.gl.Animation.FadeOutDown.process (this.closeButton);
    vs.gl.Animation.FadeOutUp.duration = 300;
    vs.gl.Animation.FadeOutUp.process (this.NewYorkButton);
    vs.gl.Animation.FadeOutUp.process (this.ESECButton);
    vs.gl.Animation.FadeOutUp.process (this.ParisButton);

    this.mapView.hide (function () {
      vs.gl.View.prototype.hide.call (self);
    });
  },
  
  show : function () {
    this._super ();
    
    this.input.show ();
    vs.ext.fx.Animation.FadeInDown.process (this.input);
    this.mapView.show ();
    vs.gl.Animation.FadeInUp.process (this.closeButton);
    vs.gl.Animation.FadeInUp.duration = 300;    

    vs.gl.Animation.FadeInDown.duration = 300;
    vs.gl.Animation.FadeInDown.process (this.NewYorkButton);
    vs.gl.Animation.FadeInDown.process (this.ESECButton);
    vs.gl.Animation.FadeInDown.process (this.ParisButton);
  }
});


