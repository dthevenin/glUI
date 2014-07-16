 
define ('ListItem', ["core", "class"], function (core, klass) {

var ListItem = klass.createClass ({

  /** parent class */
  parent: core.View,
  
  properties: {
    "imageUrl": "imageView#src",
    "title": "titleView#text",
    "description": "infoView#text",
    "rating": {
      set: function (v) {
        v = parseFloat (v);
        if (isNaN (v) || v < 0) { v = 0; }
        if (v > 5) { v = 5; }
        
        this._rating = v;
        this.setRating (v);
      }
    }
  },
  
  initComponent: function () {
    this._super ();
    
    var size = this.__config__.size;
    if (!size) {
      size = [300, 70]
    }
    
    this.imageView = new core.Image ({
      position: [5, 5],
      size: [60, 60]
    }).init ();
    this.add (this.imageView);
    this.imageView.style.backgroundColor = core.Color.transparent;


    this.titleView = new core.Text ({
      size: [size [0] - 80, 20],
      position: [70, 5]
    }).init ();
    
    this.titleView.style.fontSize = "18px";
    this.titleView.style.fontFamily = "arial";
    this.titleView.style.color = core.Color.black;
    this.titleView.style.textAlign = "left";

    this.add (this.titleView);

    this.infoView = new core.Text ({
      size: [size [0] - 80, 20],
      position: [70, 25]
    }).init ();
    
    this.infoView.style.fontSize = "12px";
    this.infoView.style.fontFamily = "arial";
    this.infoView.style.color = core.Color.black;
    this.infoView.style.textAlign = "left";

    this.add (this.infoView);

    this.ratingView = new core.Text ({
      size: [100, 15],
      position: [size [0] - 120, size[1] - 15]
    }).init ();
    
    this.ratingView.style.fontSize = "10px";
    this.ratingView.style.fontFamily = "FontAwesome";
    this.ratingView.style.color = new core.Color (100, 100, 100);
    this.ratingView.style.textAlign = "right";

    this.add (this.ratingView);
  },

  setRating : function (rating) {
    var text = rating + ": ";

    for (var i = 1; i < 6; i++) {
      if (rating >= i)
        text += "\uf005";
      else if (rating < i && rating > i - 1)
        text += "\uf123";
      else
        text += "\uf006";
    }
    
    this.ratingView.text = text;
  }
});

return ListItem;
});