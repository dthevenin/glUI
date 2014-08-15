define ("TextsRendering", ['core', 'class'], function (core, klass) {

var
  width = window.test_view.offsetWidth - 6,
  height = window.test_view.offsetHeight - 6;

var testPerfAnim = klass.createClass ({

  /** parent class */
  parent: core.Application,

  initComponent : function () {
    this._super ();
    
    var self = this;
    
    function getRandomPos () {
      return [
        Math.random () * width - 200,
        Math.random () * height - 50,
        (Math.random () < 0.5)? 0: -Math.random () * 300
      ]
    }
    
    function generateTexts () {
      var testView = new core.Text ({
        size: [245, 20],
        position: getRandomPos (),
        text: "Center align, 16px, times"
      }).init ();
      self.add (testView);
    
      testView.style.fontSize = "16px";
      testView.style.fontFamily = "times";
      testView.style.color = core.Color.white;
      testView.style.textAlign = "center";
      testView.style.backgroundColor = new core.Color (50, 50, 50);

      testView = new core.Text ({
        size: [245, 50],
        position: getRandomPos (),
        text: "Multiline text, center align,\n bold text.\nWe manage the \"\\n\"."
      }).init ();
      self.add (testView);
    
      testView.style.fontSize = "14px";
      testView.style.fontFamily = "arial";
      testView.style.fontWeight = "bold";
      testView.style.color = core.Color.white;
      testView.style.textAlign = "center";
      testView.style.backgroundColor = core.Color.black;

      testView = new core.Text ({
        size: [245, 10],
        position: getRandomPos (),
        text: "Multiline text with long sentence, center align, bold text. We have to manage text caesura and the label height..."
      }).init ();
      self.add (testView);
    
      testView.style.fontSize = "14px";
      testView.style.fontFamily = "arial";
      testView.style.fontWeight = "bold";
      testView.style.color = core.Color.black;
      testView.style.textAlign = "center";
      testView.style.backgroundColor = core.Color.white;

      testView = new core.Text ({
        size: [245, 20],
        position: getRandomPos (),
        text: "Other example of caesura:\nSAMURAI DEFENDERがWAKUWAKUプラットフォームに追加されました！さっそくプレイしてクーポンをGETしよう！"
      }).init ();
      self.add (testView);
    
      testView.style.fontSize = "16px";
      testView.style.fontFamily = "times";
      testView.style.color = core.Color.white;
      testView.style.textAlign = "center";
      testView.style.backgroundColor = new core.Color (50, 50, 50);

      testView = new core.Text ({
        size: [245, 20],
        position: getRandomPos ()
      }).init ();
      self.add (testView);
    
      testView.style.fontSize = "14px";
      testView.style.fontFamily = "FontAwesome";
      testView.style.color = core.Color.black;
      testView.style.textAlign = "center";
      testView.style.backgroundColor = core.Color.white;
    
      testView.text = "Webfont support:   " + "\uf013";
    }
    
    for (var i = 0; i < 200; i++) {
      generateTexts ();
    }
  }
});

var app;

function startPerf (endClb) {

  setTimeout (function () {
    if (endClb) endClb ();
  }, 6000);
}

function launchTest (view) {
  var app = new testPerfAnim ({id:"test"}).init ();
  core.Application.start ();
  
  app.startPerf = startPerf;
  
  return app;
}

return launchTest;
});