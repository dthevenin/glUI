var Test = vs.core.createClass ({

  /** parent class */
  parent: vs.gl.Application,

  initComponent : function () {
    this._super ();

    var view1 = new vs.gl.View ({
      position: [50, 50],
      size: [400, 400]
    }).init ();
    this.add (view1);
    view1.style.backgroundColor = vs.gl.Color.red;

    var view2 = new vs.gl.View ({
      position: [50, 20],
      size: [200, 100]
    }).init ();
    view1.add (view2);
    view2.style.backgroundColor = vs.gl.Color.yellow;

    var constraint = view2.constraint;
    constraint.bottom = 30;
    constraint.right = 10;
    constraint.middleY = 0;
    view2.redraw ();
  }
});

function loadApplication () {
  new Test ({id:"test", layout:vs.ui.View.ABSOLUTE_LAYOUT}).init ();
  vs.gl.Application.start ();
}
