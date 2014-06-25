var TextDemo = vs.core.createClass ({

  /** parent class */
  parent: vs.gl.Text,

  initComponent : function () {
    this._super ();

    text1 = new vs.gl.Text ({
      size: [245, 20],
      position: [0, 5],
      text: "Left align text with white background"
    }).init ();
    this.add (text1);
    
   text1.style.textAlign = "left";
   text1.style.backgroundColor = vs.gl.Color.white;

    text2 = new vs.gl.Text ({
      size: [245, 20],
      position: [0, 55],
      text: "Right align, 14px, arial"
    }).init ();
    this.add (text2);
    
    text2.style.fontSize = "14px";
    text2.style.fontFamily = "arial";
    text2.style.color = vs.gl.Color.black;
    text2.style.textAlign = "right";
    text2.style.backgroundColor = vs.gl.Color.white;    
 
    text3 = new vs.gl.Text ({
      size: [245, 20],
      position: [0, 105],
      text: "Center align, 16px, times"
    }).init ();
    this.add (text3);
    
    text3.style.fontSize = "16px";
    text3.style.fontFamily = "times";
    text3.style.color = vs.gl.Color.white;
    text3.style.textAlign = "center";
    text3.style.backgroundColor = new vs.gl.Color (50, 50, 50);

    text4 = new vs.gl.Text ({
      size: [245, 50],
      position: [0, 140],
      text: "Multiline text, center align,\n bold text.\nWe manage the \"\\n\"."
    }).init ();
    this.add (text4);
    
    text4.style.fontSize = "14px";
    text4.style.fontFamily = "arial";
    text4.style.fontWeight = "bold";
    text4.style.color = vs.gl.Color.white;
    text4.style.textAlign = "center";
    text4.style.backgroundColor = vs.gl.Color.black;

    text5 = new vs.gl.Text ({
      size: [245, 10],
      position: [0, 200],
      text: "Multiline text with long sentence, center align, bold text. We have to manage text caesura and the label height..."
    }).init ();
    this.add (text5);
    
    text5.style.fontSize = "14px";
    text5.style.fontFamily = "arial";
    text5.style.fontWeight = "bold";
    text5.style.color = vs.gl.Color.black;
    text5.style.textAlign = "center";
    text5.style.backgroundColor = vs.gl.Color.white;

    text6 = new vs.gl.Text ({
      size: [245, 20],
      position: [0, 260],
      text: "Other example of caesura:\nSAMURAI DEFENDERがWAKUWAKUプラットフォームに追加されました！さっそくプレイしてクーポンをGETしよう！"
    }).init ();
    this.add (text6);
    
    text6.style.fontSize = "16px";
    text6.style.fontFamily = "times";
    text6.style.color = vs.gl.Color.white;
    text6.style.textAlign = "center";
    text6.style.backgroundColor = new vs.gl.Color (50, 50, 50);

    text7 = new vs.gl.Text ({
      size: [245, 20],
      position: [0, 350]
    }).init ();
    this.add (text7);
    
    text7.style.fontSize = "14px";
    text7.style.fontFamily = "FontAwesome";
    text7.style.color = vs.gl.Color.black;
    text7.style.textAlign = "center";
    text7.style.backgroundColor = vs.gl.Color.white;
    
    text7.text = "Webfont support:   " + "\uf013";
  }
});
