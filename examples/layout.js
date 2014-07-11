require.config ({ baseUrl: "../lib" });

require (['core', 'class'], function (core, klass) {

var Test = klass.createClass ({

  /** parent class */
  parent: core.Application,

  applicationStarted : function () {
    var view1 = new core.View ({
      position: [50, 50],
      size: [400, 400]
    }).init ();
    this.add (view1);
    view1.style.backgroundColor = core.Color.red;

    var view2 = new core.View ({
      position: [50, 20],
      size: [200, 100]
    }).init ();
    view1.add (view2);
    view2.style.backgroundColor = core.Color.yellow;

    var constraint = view2.constraint;
    constraint.bottom = 30;
    constraint.right = 10;
    constraint.middleY = 0;
    view2.redraw ();
  }
});

function loadApplication () {
  new Test ({id:"test"}).init ();
  core.Application.start ();
}

loadApplication ();
});