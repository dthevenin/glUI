require.config ({ baseUrl: "../lib" });

require (['core', 'class'], function (core, klass) {

var Text = klass.createClass ({

  /** parent class */
  parent: core.Application,

  initComponent : function () {
    this._super ();

    text1 = new core.Text ({
      size: [245, 20],
      position: [20, 5],
      text: "Text 1 Ceci est un titre"
    }).init ();
    this.add (text1);
    
    text1.style.fontSize = "18px";
    text1.style.fontFamily = "arial";
    text1.style.color = core.Color.black;
    text1.style.textAlign = "left";
    text1.style.backgroundColor = new core.Color (240, 240, 240);

    text2 = new core.Text ({
      size: [245, 20],
      position: [20, 55],
      text: "Text 2 Ceci est une description"
    }).init ();
    this.add (text2);
    
    text2.style.fontSize = "12px";
    text2.style.fontFamily = "arial";
    text2.style.color = core.Color.black;
    text2.style.textAlign = "right";
    text2.style.backgroundColor = core.Color.red;    
 
    text3 = new core.Text ({
      size: [245, 20],
      position: [20, 105],
      text: "Text 3 Ceci est une description"
    }).init ();
    this.add (text3);
    
    text3.style.fontSize = "12px";
    text3.style.fontFamily = "times";
    text3.style.color = core.Color.yellow;
    text3.style.textAlign = "center";
    text3.style.backgroundColor = core.Color.blue;

    text4 = new core.Text ({
      size: [245, 50],
      position: [20, 140],
      text: "Text 4 Ceci est une text sur plusieurs\n lignes, alors bon il faut gérer\n cela aussi..."
    }).init ();
    this.add (text4);
    
    text4.style.fontSize = "12px";
    text4.style.fontFamily = "times";
    text4.style.fontWeight = "bold";
    text4.style.color = core.Color.yellow;
    text4.style.textAlign = "center";
    text4.style.backgroundColor = core.Color.blue;

    text5 = new core.Text ({
      size: [245, 20],
      position: [20, 200],
      text: "Text 4 Ceci est une text sur plusieurs\n lignes, alors bon il faut gérer\n cela aussi..."
    }).init ();
    this.add (text5);
    
    text5.style.fontSize = "12px";
    text5.style.fontFamily = "times";
    text5.style.color = core.Color.yellow;
    text5.style.textAlign = "center";
    text5.style.backgroundColor = core.Color.red;

    text6 = new core.Text ({
      size: [245, 20],
      position: [20, 260],
      text: "SAMURAI DEFENDERがWAKUWAKUプラットフォームに追加されました！さっそくプレイしてクーポンをGETしよう！"
    }).init ();
    this.add (text6);
    
    text6.style.fontSize = "14px";
    text6.style.fontFamily = "times";
    text6.style.color = core.Color.green;
    text6.style.textAlign = "left";
    text6.style.backgroundColor = core.Color.red;

    text7 = new core.Text ({
      size: [245, 20],
      position: [20, 320]
    }).init ();
    this.add (text7);
    
    text7.style.fontSize = "14px";
    text7.style.fontFamily = "FontAwesome";
    text7.style.color = core.Color.black;
    text7.style.textAlign = "center";
    text7.style.backgroundColor = core.Color.white;
    
    text7.text = "  " + "\uf013";
  }
});

function loadApplication () {
  new Text ({id:"test"}).init ();
  core.Application.start ();
}

});
