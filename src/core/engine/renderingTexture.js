var renderingTexture = {};

// simple version
(function () {
  
  var device_pixel_ratio;
  var draw_texture_uv_buffer;
  var gl_ctx;

  function initTexture (ctx, frame_size, pixel_ratio) {
    gl_ctx = ctx;
    device_pixel_ratio = pixel_ratio;

    if (draw_texture_uv_buffer) {
      gl_ctx.deleteBuffer (draw_texture_uv_buffer);
    }
    draw_texture_uv_buffer = gl_ctx.createBuffer ();
    gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, draw_texture_uv_buffer);
    gl_ctx.bufferData (
      gl_ctx.ARRAY_BUFFER,
      new Float32Array ([0,1, 0,0, 1,1, 1,0]),
      gl_ctx.STATIC_DRAW
    );
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
    
    // setup texture view port
    if (!sprite.__view_port) {
      sprite.__view_port = [];
    }
    sprite.__view_port [0] = 0;
    sprite.__view_port [1] = 0;
    sprite.__view_port [2] = width * device_pixel_ratio;
    sprite.__view_port [3] = height * device_pixel_ratio;

    // setup texture projection
    sprite.__texture_uv_buffer = draw_texture_uv_buffer;
  
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
//      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.NEAREST_MIPMAP_LINEAR);
      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.LINEAR);

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

  // renderingTexture.init = initTexture;
  // renderingTexture.setupSprite = setupSprite;
  // renderingTexture.removeSprite = removeSprite;
}) ();


// new version
(function () {
  
  var device_pixel_ratio;
  var gl_ctx;
  
  var the_texture_size;
  var the_frame_buffer;
  var the_render_buffer;
  var the_frame_texture;
  
  var maxTexSize;
  var maxCubeSize;
  var maxRenderbufferSize;

  function initTexture (ctx, frame_size, pixel_ratio) {
    gl_ctx = ctx;
    device_pixel_ratio = pixel_ratio;
    
    maxTexSize = gl_ctx.getParameter (gl_ctx.MAX_TEXTURE_SIZE);
    maxCubeSize = gl_ctx.getParameter (gl_ctx.MAX_CUBE_MAP_TEXTURE_SIZE);
    maxRenderbufferSize = gl_ctx.getParameter (gl_ctx.MAX_RENDERBUFFER_SIZE);

    // if (draw_texture_uv_buffer) {
    //   gl_ctx.deleteBuffer (draw_texture_uv_buffer);
    // }

    // assumes the framebuffer is bound
    var valid = gl_ctx.checkFramebufferStatus (gl_ctx.FRAMEBUFFER);
    switch(valid){
      case gl_ctx.FRAMEBUFFER_UNSUPPORTED:
        throw 'Framebuffer is unsupported';
      case gl_ctx.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
        throw 'Framebuffer incomplete attachment';
      case gl_ctx.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
        throw 'Framebuffer incomplete dimensions';
      case gl_ctx.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
        throw 'Framebuffer incomplete missing attachment';
      default:
    }
    
    allocateTextureAndBuffers ();
  }
  
  function calculateTextureSize () {
    
    var nextPowerOfTwo =
      Math.pow (2, Math.ceil (
        Math.log (frame_size [0] * device_pixel_ratio) / Math.log (2)
      ));

    if (nextPowerOfTwo < 1024 && maxTexSize >= 1024) nextPowerOfTwo = 1024;
    if (nextPowerOfTwo > maxTexSize) {
      throw 'To small texture size';
    }
    if (frame_size [1] * device_pixel_ratio > maxTexSize) {
      throw 'To small texture size';
    }
    
    return [
      nextPowerOfTwo,
      maxTexSize
     ];
  }
  
  function allocateTextureAndBuffers () {

    the_frame_buffer = gl_ctx.createFramebuffer();
    
    the_texture_size = calculateTextureSize ()
  
    gl_ctx.bindFramebuffer (gl_ctx.FRAMEBUFFER, the_frame_buffer);
    the_frame_buffer.width = the_texture_size [0];
    the_frame_buffer.height = the_texture_size [1];

    the_frame_texture = gl_ctx.createTexture();

    gl_ctx.bindTexture (gl_ctx.TEXTURE_2D, the_frame_texture);
    gl_ctx.texImage2D (gl_ctx.TEXTURE_2D, 0, gl_ctx.RGBA, the_frame_buffer.width, the_frame_buffer.height, 0, gl_ctx.RGBA, gl_ctx.UNSIGNED_BYTE, null);

    // POT texture
    gl_ctx.texParameteri
      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MAG_FILTER, gl_ctx.LINEAR);

    gl_ctx.texParameteri
//      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.NEAREST_MIPMAP_LINEAR);
    (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.LINEAR);

    gl_ctx.generateMipmap (gl_ctx.TEXTURE_2D);    
    
    
    the_render_buffer = gl_ctx.createRenderbuffer ();
  
    gl_ctx.bindRenderbuffer (gl_ctx.RENDERBUFFER, the_render_buffer);
    gl_ctx.renderbufferStorage (gl_ctx.RENDERBUFFER, gl_ctx.DEPTH_COMPONENT16, the_frame_buffer.width, the_frame_buffer.height);

    gl_ctx.framebufferTexture2D (gl_ctx.FRAMEBUFFER, gl_ctx.COLOR_ATTACHMENT0, gl_ctx.TEXTURE_2D, the_frame_texture, 0);
    gl_ctx.framebufferRenderbuffer (gl_ctx.FRAMEBUFFER, gl_ctx.DEPTH_ATTACHMENT, gl_ctx.RENDERBUFFER, the_render_buffer);

    gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, null);
    gl_ctx.bindRenderbuffer(gl_ctx.RENDERBUFFER, null);
    gl_ctx.bindFramebuffer(gl_ctx.FRAMEBUFFER, null);
  }
  
  var
    shelf_nf_alloc_next_shelf_dec_y = 0,
    shelf_nf_alloc_offset_x = 0,
    shelf_nf_alloc_offset_y = 0;
  function shelf_nf_allocation (sprite, width, height) {
    
    var viewport = sprite.__view_port;
 
    function isFitCurrentShelf (width, height) {
      
      // does not fit because to high
      if (shelf_nf_alloc_offset_y + (height * device_pixel_ratio) > the_texture_size [1]) {
        return false;
      }
      
      // fit or does not fit because to wide
      return (
        (the_texture_size [0] - shelf_nf_alloc_offset_x)
        > 
        (width * device_pixel_ratio)
      );
    }
    
    function openNewShelf (height) {

      shelf_nf_alloc_offset_x = 0;
      
      // Calculate the new shelft's high
      shelf_nf_alloc_offset_y += shelf_nf_alloc_next_shelf_dec_y;

      // allocate a new texture if the new sprite does not fit onto the current one
      if (shelf_nf_alloc_offset_y + (height * device_pixel_ratio) > the_texture_size [1]) {
        // create new texture
        allocateTextureAndBuffers ();

        shelf_nf_alloc_offset_y = 0;
      }
      // or keep the actual texture and reserve a new shelf

      shelf_nf_alloc_next_shelf_dec_y = height;
    }
    
    function allocateSpaceInCurrentShelf (viewport, width, height) {
      
      shelf_nf_alloc_next_shelf_dec_y = Math.max (
        shelf_nf_alloc_next_shelf_dec_y,
        height  * device_pixel_ratio
      );
      
      viewport [0] = shelf_nf_alloc_offset_x;
      viewport [1] = shelf_nf_alloc_offset_y;
      viewport [2] = width * device_pixel_ratio;
      viewport [3] = height * device_pixel_ratio;     
      
      shelf_nf_alloc_offset_x += width * device_pixel_ratio;
    }
    
    if (!isFitCurrentShelf (width, height)) {
      openNewShelf (height);
    }
    
    allocateSpaceInCurrentShelf (viewport, width, height);

    sprite._framebuffer = the_frame_buffer;
    sprite._renderbuffer = the_render_buffer;
    sprite._frametexture = the_frame_texture;
  }
  
  var v_alloc_offset_y = 0;
  function vertical_allocation (viewport, width, height) {

    viewport [0] = 0;
    viewport [1] = v_alloc_offset_y;
    viewport [2] = width * device_pixel_ratio;
    viewport [3] = height * device_pixel_ratio;
    
    v_alloc_offset_y += height * device_pixel_ratio;
  }
  
  function createTextureProjection (sprite) {
    var draw_texture_uv_buffer = gl_ctx.createBuffer ();
    
    var view_p = sprite.__view_port;
    
    //bottom/right
    var x1 = view_p[0] / the_texture_size [0];
    var y1 = view_p[1] / the_texture_size [1];
    //top/left
    var x2 = (view_p[0] + view_p[2]) / the_texture_size [0];
    var y2 = (view_p[1] + view_p[3]) / the_texture_size [1];
    
    gl_ctx.bindBuffer (gl_ctx.ARRAY_BUFFER, draw_texture_uv_buffer);
    gl_ctx.bufferData (
      gl_ctx.ARRAY_BUFFER,
      new Float32Array ([x1,y2, x1,y1, x2,y2, x2,y1]),
      gl_ctx.STATIC_DRAW
    );

    sprite.__texture_uv_buffer = draw_texture_uv_buffer;
  }

  function setupSprite (sprite, width, height) {
    sprite._framebuffer = null;
    sprite._renderbuffer = null;
    sprite._frametexture = null;
  
    if (width === 0 || height === 0) return;
    
    // setup texture view port
    if (!sprite.__view_port) {
      sprite.__view_port = [];
    }
    //vertical_allocation (sprite.__view_port, width, height);
    shelf_nf_allocation (sprite, width, height);
    
    // setup texture projection
    createTextureProjection (sprite);
  }

  function removeSprite (sprite) {
  
  }

  renderingTexture.init = initTexture;
  renderingTexture.setupSprite = setupSprite;
  renderingTexture.removeSprite = removeSprite;
}) ();