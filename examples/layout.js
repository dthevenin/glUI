var Test = vs.core.createClass ({

  /** parent class */
  parent: vs.ui.GLApplication,

  initComponent : function () {
    this._super ();

    this.glView1 = new vs.ui.GLView ({
      position: [50, 50],
      size: [400, 400]
    }).init ();
    this.add (this.glView1);
    this.glView1.style.backgroundColor = GLColor.red;

    this.glView2 = new vs.ui.GLView ({
      position: [50, 20],
      size: [200, 100]
    }).init ();
    this.glView1.add (this.glView2);
    this.glView2.style.backgroundColor = GLColor.yellow;

    var constraint = this.glView2.constraint;
    constraint.top = 30;
    constraint.right = 10;
    constraint.middleY = 0;
    this.glView2.redraw ();
  }
});

function loadApplication () {
  new Test ({id:"test", layout:vs.ui.View.ABSOLUTE_LAYOUT}).init ();
  vs.ui.Application.start ();
}
