var renderingTexture = {};

(function () {

  function initTexture (frame_size, device_pixel_ratio) {
  
  }

  function setupSprite (sprite, width, height) {
    if (sprite._framebuffer) {
      gl_ctx.deleteFramebuffer (sprite._framebuffer);
    }
    if (sprite._renderbuffer) {
      gl_ctx.deleteRenderbuffer (sprite._renderbuffer);
    }
    if (sprite._frametexture) {
      gl_ctx.deleteTexture (sprite._frametexture);
    }  
  
    if (width === 0 || height === 0) return;
  
    var framebuffer = gl_ctx.createFramebuffer();
    sprite._framebuffer = framebuffer;
  
    gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, framebuffer);
    framebuffer.width = width * gl_device_pixel_ratio;
    framebuffer.height = height * gl_device_pixel_ratio;

    var texture = gl_ctx.createTexture();
    sprite._frametexture = texture;

    function isPowerOfTwo (x) {
      return (x !== 0) && ((x & (x - 1)) === 0);
    }
  
    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, texture);
    gl_ctx.texImage2D (gl_ctx.TEXTURE_2D, 0, gl_ctx.RGBA, framebuffer.width, framebuffer.height, 0, gl_ctx.RGBA, gl_ctx.UNSIGNED_BYTE, null);

    // POT images
    if (isPowerOfTwo (frame_size [0] * gl_device_pixel_ratio) &&
      isPowerOfTwo (frame_size [1] * gl_device_pixel_ratio)) {

      gl_ctx.texParameteri
      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MAG_FILTER, gl_ctx.LINEAR);

      gl_ctx.texParameteri
      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.NEAREST_MIPMAP_LINEAR);

      gl_ctx.generateMipmap (gl_ctx.TEXTURE_2D);
    }
    // NPOT images
    else {
      //gl_ctx.NEAREST is also allowed, instead of gl_ctx.LINEAR, as neither mipmap.
      gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.LINEAR);
      //Prevents s-coordinate wrapping (repeating).
      gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_S, gl_ctx.CLAMP_TO_EDGE);
      //Prevents t-coordinate wrapping (repeating).
      gl_ctx.texParameteri (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_T, gl_ctx.CLAMP_TO_EDGE);
    }

    var renderbuffer = gl_ctx.createRenderbuffer();
    sprite._renderbuffer = renderbuffer;
  
    gl_ctx.bindRenderbuffer(gl_ctx.RENDERBUFFER, renderbuffer);
    gl_ctx.renderbufferStorage(gl_ctx.RENDERBUFFER, gl_ctx.DEPTH_COMPONENT16, framebuffer.width, framebuffer.height);

    gl_ctx.framebufferTexture2D(gl_ctx.FRAMEBUFFER, gl_ctx.COLOR_ATTACHMENT0, gl_ctx.TEXTURE_2D, texture, 0);
    gl_ctx.framebufferRenderbuffer(gl_ctx.FRAMEBUFFER, gl_ctx.DEPTH_ATTACHMENT, gl_ctx.RENDERBUFFER, renderbuffer);

    gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, null);
    gl_ctx.bindRenderbuffer(gl_ctx.RENDERBUFFER, null);
    gl_ctx.bindFramebuffer(gl_ctx.FRAMEBUFFER, null);
  }

  function removeSprite (sprite) {
  
  }

  renderingTexture.init = initTexture;
  renderingTexture.setupSprite = setupSprite;
  renderingTexture.removeSprite = removeSprite;

}) ()