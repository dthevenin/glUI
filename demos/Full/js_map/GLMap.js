/**
 * Copyright (C) 2009-2013. David Thevenin, ViniSketch (c), and 
 * contributors. All rights reserved
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
 
var GLMap = vs.core.createClass ({

  /** parent class */
  parent: vs.ui.GLCanvas,
  tick : 0,

  initComponent : function () {

    this.zoom = 13;
    this.lat = 35.6105;
    this.lon = 139.8019;

    this._super ();
    this.__gl_user_program = GLMap__program;
    
    var self = this;

    // Show list animation
    this.show_anim = new GLAnimation ({
      'tick': 0,
      'scaling': 1,
      'rotation': [0, 0, 0]
    });
    this.show_anim.keyFrame (0, [1, 0.1, [30, 40, 0]]);
    this.show_anim.keyFrame (0.3, [1, 1, [30, 40, 0]]);
    this.show_anim.duration = 1000;

    // Hide list animation
    this.hide_anim = new GLAnimation ({
      'tick': 1,
      'scaling': 0.1,
      'rotation': [30, 40, 0]
    });
    this.hide_anim.keyFrame (0, [0, 1, [0, 0, 0]]);
    this.hide_anim.keyFrame (0.7, [1, 1, [30, 40, 0]]);
    this.hide_anim.duration = 1000;
    
    this._dx = 0;
    this._dy = 0;

    this.__recognizer = new vs.ui.DragRecognizer (this);
    this.addPointerRecognizer (this.__recognizer);
    
    this.__images = null;
    
    window.map = this;
  },
  
  __allocate_images : function () {
    var
      self = this,
      tile_size = 256,
      width = this.size[0],
      height = this.size[1],
      maxTileX = Math.floor (width / tile_size) + 2,
      maxTileY = Math.floor (height / tile_size) + 2;
      
    this.__images = [];
    
    for (j = 0; j < maxTileY; j++) {
      for (i = 0; i < maxTileX; i++) {
        var img = document.createElement ('img');
        img._x = 0;
        img._y = 0;
        
        img.onload = function () {
          self.c_drawImage (
            this,
            this._x * gl_device_pixel_ratio,
            this._y * gl_device_pixel_ratio,
            tile_size * gl_device_pixel_ratio,
            tile_size * gl_device_pixel_ratio
          );
          self.__update_texture ();
        }
        
        this.__images.push (img);
      }
    }
  },
  
  __update_gl_vertices : function () {
    var
      obj_size = this._size,
      obj_pos = this._position,
      x = obj_pos[0],
      y = obj_pos[1],
      w = obj_size [0],
      h = obj_size [1];
     
    if (this.__gl_user_vertices) {
      delete (this.__gl_user_vertices);
    }
    if (this.__gl_user_triangle_faces) {
      delete (this.__gl_user_triangle_faces);
    }
    if (this.__gl_user_texture_mapping) {
      delete (this.__gl_user_texture_mapping);
    }

    this.__gl_user_vertices = makeMesh (GLMap__resolution, x, y, w, h);
    this.__gl_user_triangle_faces = makeTriangles (GLMap__resolution);
    this.__gl_user_texture_mapping = makeTextureProjection (GLMap__resolution);

    gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, this.__gl_vertices_buffer);
    gl_ctx.bufferData (gl_ctx.ARRAY_BUFFER, this.__gl_user_vertices, gl_ctx.STATIC_DRAW);
    
    gl_view.__should_update_gl_vertices = false;
  },
  
  setZoom : function (zoom) {
    this.zoom = zoom;

    this.__loadTiles (this.lat, this.lon, this.zoom);
  },
  
  setLocation : function (lat, lon) {
    this.lat = lat;
    this.lon = lon;

    this.__loadTiles (this.lat, this.lon, this.zoom);
  },
  
  __loadTiles : function (lat, lon, zoom) {
  
    function long2tile (lon, zoom) {
      return (Math.floor((lon+180)/360*Math.pow(2,zoom)));
    }

    function lat2tile (lat, zoom)  {
      return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
    }
 
    var
      tile_size = 256,
      width = this.size[0],
      height = this.size[1],
      base_tilex = long2tile (lon, zoom), tilex,
      tiley = lat2tile (lat, zoom),
      i = 0, j = 0, index = 0,
      self = this,
      maxTileX = Math.floor (width / tile_size) + 2,
      maxTileY = Math.floor (height / tile_size) + 2,
      dTileX = Math.floor (maxTileX / 2),
      dTileY = Math.floor (maxTileY / 2);
      
    if (width <= 0) return;
    if (height <= 0) return;
    
    this._dx = 0;
    this._dy = 0;
    
    if (!this.__images) { this.__allocate_images (); }
  
    tiley = tiley - dTileY + 1;
    for (j = 0; j < maxTileY; j++) {
      tilex = base_tilex - dTileX;
      for (i = 0; i < maxTileX; i++) {
        var img = this.__images [index++];
        img._x = this._tileX2X (tilex) + this._dx;
        img._y = this._tileY2Y (tiley) + this._dx;
        img.src = "/openstreetmap/" +  zoom + "/" + tilex + "/" + tiley + ".png";
        
//    console.log (base_tilex, tilex, img._x, img._x + tile_size);
        tilex++;
      }
      tiley++;
    }
  },
  
  
  _tileX2X : function (tilex) {
    function long2tile (lon, zoom) {
      return (Math.floor((lon+180)/360*Math.pow(2,zoom)));
    }

    var tile_size = 256;
    var base_tilex = long2tile (this.lon, this.zoom);
    var dtileX = tilex - base_tilex;
    var dx = dtileX * tile_size;
    var cx = this.size [0] / 2;
    
    return dx + cx - tile_size / 2;
  },
  
  _tileY2Y : function (tiley) {
    function lat2tile (lat, zoom)  {
      return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
    }

    var tile_size = 256;
    var base_tiley = lat2tile (this.lat, this.zoom);
    var dtileY = tiley - base_tiley;
    var dy = dtileY * tile_size;
    var cy = this.size [1] / 2;
    
    return dy + cy - tile_size / 2;
  },
  
  __updateTilePosition : function (drag_x, drag_y) {
  
    function long2tile (lon, zoom) {
      return (Math.floor((lon+180)/360*Math.pow(2,zoom)));
    }

    function lat2tile (lat, zoom)  {
      return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
    }

    var
      tile_size = 256,
      i = 0, j = 0,
      width = this._size [0],
      height = this._size [1],
      base_tilex = long2tile (this.lon, this.zoom), tilex,
      tiley = lat2tile (this.lat, this.zoom),
      maxTileX = Math.floor (width / tile_size) + 2,
      dTileX = Math.floor (maxTileX / 2),
      maxTileY = Math.floor (height / tile_size) + 2,
      dTileY = Math.floor (maxTileY / 2);
      
    if (!this.__images) { return; }
    
    if (!drag_x) drag_x = 0;
    if (!drag_y) drag_y = 0;
    
    this.c_clearRect (
      0, 0,
      width * gl_device_pixel_ratio,
      height * gl_device_pixel_ratio
    );

    var index = 0;
    tiley = tiley - dTileY + 1;
    for (j = 0; j < maxTileY; j++) {
      tilex = base_tilex - dTileX;
      for (i = 0; i < maxTileX; i++) {
        var img = this.__images [index++];
        img._x = this._tileX2X (tilex) + this._dx + drag_x;
        img._y = this._tileY2Y (tiley) + this._dy + drag_y;
        
        this.c_drawImage (
          img,
          img._x * gl_device_pixel_ratio,
          img._y * gl_device_pixel_ratio,
          tile_size * gl_device_pixel_ratio,
          tile_size * gl_device_pixel_ratio
        );
        tilex++;
      }
      tiley++;
    }
    this.__update_texture ();
  },

  didDrag : function (drag_info, event) {
    this.__dy = drag_info.dy,
    this.__dx = drag_info.dx;
      
//    console.log (this.__dx, this.__dy);
    
    this.__updateTilePosition (this.__dx, this.__dy);
  },

  didDragEnd : function () {
    this._dx += this.__dx;
    this._dy += this.__dy;
  },
  
  draw : function () {
    this.__loadTiles (this.lat, this.lon, this.zoom);
  },
    
  runDemo : function () {},
    
  update_vectices : function (pourcentage) {
    this.tick = pourcentage / 100;
  },
  
  hide: function (clb) {
    this.hide_anim.process (this, function () {
      vs.ui.GLCanvas.prototype.hide.call (this);
      
      if (clb) clb ();
    }, this);
  },
  
  show: function (clb) {
    this._super ();
    this.show_anim.process (this, clb, this);
  }
});

var GLMap__image_vertex_shader = "\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
uniform float posx;\n\
uniform float tick;\n\
uniform float resolution;\n\
uniform float width;\n\
attribute vec2 uv;\n\
varying vec2 vUV;\n\
const float fold = 20.0;\n\
const float PI = 3.1415;\n\
const float degToRad = PI / 180.0;\n\
void main(void) {\n\
  float phi = degToRad * 90.0;\n\
  vec3 pos = position;\n\
  \n\
  float step = (pos.x - posx) / width;\n\
  pos.z = cos(mod(step * resolution, 4.0) * (3.0 * PI / 2.0)) * tick * fold;\n\
  \n\
  float ox = width * -tick * 0.9 / 2.0;\n\
  pos.x = pos.x - step * (tick * 0.9) * width - ox;\n\
  \n\
  gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(pos, 1.);\n\
  vUV=uv;\n\
}";

var GLMap__image_shader_fragment = "\n\
precision lowp float;\n\
varying vec2 vUV;\n\
uniform sampler2D uMainTexture;\n\
uniform vec4 color;\n\
uniform float uAlpha;\n\
varying highp vec3 vLighting;\n\
void main(void) {\n\
  vec4 mainTextureColor = texture2D(uMainTexture, vUV);\n\
  gl_FragColor = vec4(mainTextureColor.rgb, mainTextureColor.a);\n\
  gl_FragColor.a *= uAlpha;\n\
}";

var GLMap__resolution = 20;

var GLMap__program, GLMap__texture_proj = {}, GLMap__texture = {};

function initGLMap () {
  GLMap__program = createProgram (GLMap__image_vertex_shader, GLMap__image_shader_fragment);
  GLMap__program.setMatrixes (jsProjMatrix, jsViewMatrix);
  
  GLMap__program.useIt ();

  GLMap__program.uniform.tick (0);
  GLMap__program.uniform.resolution (GLMap__resolution);
  
  GLMap__texture_proj.normalize = false;
  GLMap__texture_proj.type = gl_ctx.FLOAT;
  GLMap__texture_proj.stride = 0;
  GLMap__texture_proj.offset = 0;
  GLMap__texture_proj.buffer = gl_ctx.createBuffer ();
  GLMap__texture_proj.numComponents = 2;

  GLMap__texture.bindToUnit = function(unit, gl_view) {
    gl_ctx.activeTexture (gl_ctx.TEXTURE0 + unit);
    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, gl_view.__gl_texture);
  };
  
  GLMap__program.configureParameters = function (gl_view, style) {
    var
      x = gl_view._position[0],
      w = gl_view._size [0];
      
    GLMap__program.uniform.tick (gl_view.tick);
    GLMap__program.uniform.posx (x);
    GLMap__program.uniform.width (w);

    GLMap__program.attrib.uv (GLMap__texture_proj);

    gl_ctx.bufferData (
      gl_ctx.ARRAY_BUFFER,
      gl_view.__gl_user_texture_mapping,
      gl_ctx.STATIC_DRAW
    );
      
    GLMap__program.textures.uMainTexture (GLMap__texture, gl_view);
  }
}

glAddInitFunction (initGLMap);

