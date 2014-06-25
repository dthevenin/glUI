
var __gl_textures_ref = {};

function gl_get_texture_from_image_url (src, clb) {
  
  var handler = __gl_textures_ref [src];
  if (handler) {
    handler.ref_count ++;
    if (vs.util.isFunction (clb)) {
      if (handler.texture) {
        try {
          clb (handler.texture);
        }
        catch (exp) {
          if (exp.stack) console.log (exp.stack);
          console.log (exp);
        }
      }
      else {
        handler.clbs.push (clb)
      }
    }
    return;
  }
  
  handler = {};
  handler.texture = null;
  handler.ref_count = 1;
  handler.clbs = [];
  if (vs.util.isFunction (clb)) {
    handler.clbs.push (clb);
  }
  __gl_textures_ref [src] = handler;

  var image = new Image();
  image.src = src;

  image.onload = function (e) {
    var texture;
    
    var handler = __gl_textures_ref [src];
    if (!handler) {
      // image has been deleted before it's available
      return;
    }

    texture = __copy_image_into_webgl_texture (image, texture);
    
    handler.texture = texture;
    var clbs = handler.clbs; handler.clbs = [];
    clbs.forEach (function (clb) {
      try {
        clb (texture, [image.width, image.height]);
      }
      catch (exp) {
        if (exp.stack) console.log (exp.stack);
        console.log (exp);
      }
    })
  }
}

function gl_get_texture_from_image_url_not_optimize (src, clb) {
  
  var image = new Image();
  image.src = src;

  image.onload = function (e) {
    var texture;
    texture = __copy_image_into_webgl_texture (image, texture);
    
    try {
      clb (texture, [image.width, image.height]);
    }
    catch (exp) {
      if (exp.stack) console.log (exp.stack);
      console.log (exp);
    }
  }
}

function gl_free_texture_image (src) {
  
  var handler = __gl_textures_ref [src];
  if (!handler) return;
  
  handler.ref_count --;
  if (handler.ref_count > 0) return;
  
  if (handler.texture) {
    gl_ctx.deleteTexture (handler.texture);
  }
  delete (__gl_textures_ref [src]);
}
