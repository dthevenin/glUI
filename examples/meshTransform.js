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

require (['CurtainDemo', 'CurtainImageDemo', 'FishEyeDemo'], function (CurtainDemo, CurtainImageDemo, FishEyeDemo) {

  var Test = vs.core.createClass ({

    /** parent class */
    parent: vs.ui.GLApplication,

    initComponent : function () {
      this._super ();

      this.style.backgroundColor = GLColor.white;

//      var view = new CurtainDemo ({ position: [10, 10] }).init ();
//      var view = new CurtainImageDemo ({ position: [0, 0] }).init ();
       var view = new FishEyeDemo ({ position: [50, 50] }).init ();

      this.add (view);
    }
  });

  new Test ().init ();
  vs.ui.Application.start ();
});
