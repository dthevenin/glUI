require.config ({ baseUrl: "../lib" });

require (['core', 'class'], function (core, klass) {

var Test = klass.createClass ({

  /** parent class */
  parent: core.Application,

  initComponent : function () {
    this._super ();
    
    this.style.backgroundColor = core.Color.white;
    
    var view = new core.View ({
      position: [50, 80],
      size: [150, 100]
    }).init ();
    this.add (view);
    view.style.backgroundColor = core.Color.yellow;
    view.style.shadowColor = core.Color.black;
    
    view = new core.View ({
      position: [200, 200],
      size: [200, 100]
    }).init ();
    this.add (view);
    view.style.backgroundColor = core.Color.red;
    view.opacity = 0.001
    
    view.style.shadowOffset = [0, 0];
    view.style.shadowBlur = 50;
    view.style.shadowColor = new core.Color (0, 0, 153, 0.8);
    view.style.opacity = 1;

    window.view = view
    view.translation = [-50, -50, 0];
    view.rotation = [00, 0, 30];
  }
});

function loadApplication () {
  new Test ({id:"test"}).init ();
  core.Application.start ();
}

loadApplication ();
});