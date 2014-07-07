　require.config({
  baseUrl: "",
  paths: {
    'CurtainDemo' : 'CurtainDemo',
    'CurtainView' : 'meshTransform/CurtainView',
    'CurtainImageDemo' : 'CurtainImageDemo',
    'CurtainTextureView' : 'meshTransform/CurtainTextureView',
    'FishEyeDemo' : 'FishEyeDemo',
    'FishEyeView' : 'meshTransform/FishEyeView'
   }
});

require (['CurtainDemo', 'CurtainImageDemo', 'FishEyeDemo', 'class', 'core'],
  function (CurtainDemo, CurtainImageDemo, FishEyeDemo, klass, core) {

  var Test = klass.createClass ({

    /** parent class */
    parent: core.Application,

    initComponent : function () {
      this._super ();

      this.style.backgroundColor = core.Color.white;

      var view = new CurtainDemo ({ position: [10, 10] }).init ();
//      var view = new CurtainImageDemo ({ position: [50, 50] }).init ();
//       var view = new FishEyeDemo ({ position: [0, 0] }).init ();

      this.add (view);
    }
  });

  new Test ().init ();
  core.Application.start ();
});
