require (['core', 'class'], function (core, klass) {

var Test = klass.createClass ({

  /** parent class */
  parent: core.Application,

  applicationStarted : function () {
    var view1 = new core.View ({
      position: [10, 10],
      size: [300, 400]
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
    
    // center
    var v_center = new core.View ({size: [20, 20]}).init ();
    view2.add (v_center);
    v_center.style.backgroundColor = core.Color.blue;

    v_center.constraint.middleX = 0;
    v_center.constraint.middleY = 0;
    
    // conner 1
    var v_conner = new core.View ({size: [20, 20]}).init ();
    view2.add (v_conner);
    v_conner.style.backgroundColor = core.Color.blue;

    v_conner.constraint.top = 10;
    v_conner.constraint.left = 10;
    
    // conner 2
    v_conner = new core.View ({size: [20, 20]}).init ();
    view2.add (v_conner);
    v_conner.style.backgroundColor = core.Color.blue;

    v_conner.constraint.top = 10;
    v_conner.constraint.right = 10;
    
    // conner 3
    v_conner = new core.View ({size: [20, 20]}).init ();
    view2.add (v_conner);
    v_conner.style.backgroundColor = core.Color.blue;

    v_conner.constraint.bottom = 10;
    v_conner.constraint.right = 10;

    // conner 4
    v_conner = new core.View ({size: [20, 20]}).init ();
    view2.add (v_conner);
    v_conner.style.backgroundColor = core.Color.blue;

    v_conner.constraint.bottom = 10;
    v_conner.constraint.left = 10;
  }
});

function launchTest (view) {
  var t = new Test ({id:"layout"}).init ();
  core.Application.start ();
  
  return t;
}

return launchTest ();

});