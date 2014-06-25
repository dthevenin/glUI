var Test = vs.core.createClass ({

  /** parent class */
  parent: vs.gl.Application,

  initComponent : function () {
    this._super ();
    
    this.style.backgroundColor = vs.gl.Color.white;
    
    var view = new vs.gl.View ({
      position: [50, 80],
      size: [150, 100]
    }).init ();
    this.add (view);
    view.style.backgroundColor = vs.gl.Color.yellow;
    view.style.shadowColor = vs.gl.Color.black;
    
    view = new vs.gl.View ({
      position: [200, 200],
      size: [200, 100]
    }).init ();
    this.add (view);
    view.style.backgroundColor = vs.gl.Color.red;
    view.opacity = 0.001
    
    view.style.shadowOffset = [0, 0];
    view.style.shadowBlur = 50;
    view.style.shadowColor = new vs.gl.Color (0, 0, 153, 0.8);
    view.style.opacity = 1;

    window.view = view
    view.translation = [-50, -50, 0];
    view.rotation = [00, 0, 30];
  }
});

function loadApplication () {
  new Test ({id:"test", layout:vs.ui.View.ABSOLUTE_LAYOUT}).init ();
  vs.ui.Application.start ();
}

ACTIVATE_STATS = true