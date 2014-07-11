require.config ({ baseUrl: "../lib" });

require (['core', 'class'], function (core, klass) {

var Text = klass.createClass ({

  /** parent class */
  parent: core.Application,

  initComponent : function () {
    this._super ();

    this.view1 = new core.View ({
      size: [100, 100],
      id: 'view1',
      position: [50, 50],
    }).init ();
    
    this.view1.style.backgroundColor = core.Color.red;

    this.add (this.view1);
    this._tmp_translation = core.vec3.create ();
 
    this.addEventListener (core.POINTER_START, this);
  },

  handleEvent : function (e) {

    if (e.type === core.POINTER_START) {
      document.addEventListener (core.POINTER_MOVE, this);
      document.addEventListener (core.POINTER_END, this);

      this._screenX = e.screenX;
      this._screenY = e.screenY;

      core.vec3.set (this.view1.translation, this._tmp_translation);
    }
    else if (e.type === core.POINTER_MOVE) {

      var
        dx = e.screenX - this._screenX,
        dy = e.screenY - this._screenY;
      
      var t = this.view1.translation;
      t[0] = this._tmp_translation [0] + dx;
      t[1] = this._tmp_translation [1] + dy;

      // update position and will force graphic update
      this.view1.translation = t;
    }
    else if (e.type === core.POINTER_END) {
      document.removeEventListener (core.POINTER_MOVE, this);
      document.removeEventListener (core.POINTER_END, this);
    }
  }
});

function loadApplication () {
  new Text ({id:"test"}).init ();
  core.Application.start ();
}

loadApplication ();
});