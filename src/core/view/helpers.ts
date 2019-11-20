import { getGLContext } from "../engine"
import { BaseView } from "./View";
import { Style } from "../Style";
import { Color } from "../engine/Color";
import { gl_device_pixel_ratio } from "../engineInit";

export const isPowerOfTwo = (x: number): boolean => (x !== 0) && ((x & (x - 1)) === 0);


export function __create_multiline_text(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lines: string[]
) {
  var currentText = "";
  var futureText, futureFutureText;
  var subWidth = 0;
  var maxLineWidth = 0;

  var wordArray = text.split(" ");
  var wordsInCurrent, wordArrayLength;
  wordsInCurrent = wordArrayLength = wordArray.length;
  var index = 0, index_c, l_text;

  while (index < wordArrayLength) {
    var text = wordArray[index];
    if (currentText != "") {
      futureText = currentText + " " + text;
    }
    else {
      futureText = text;
    }
    if (ctx.measureText(futureText).width < maxWidth) {
      currentText = futureText;
      index++;
    }
    else {
      if (ctx.measureText(text).width < maxWidth) {
        lines.push(currentText);
        currentText = text;
        index++;
      } else {
        // Caesura management
        index_c = 0;
        l_text = text.length;
        futureText = currentText + " ";
        while (index_c < l_text) {
          futureFutureText = futureText + text[index_c];
          if (ctx.measureText(futureFutureText).width >= maxWidth) {
            lines.push(futureText);
            currentText = text.substr(index_c);
            index++;
            break;
          }
          else {
            futureText = futureFutureText;
            index_c++;
          }
        }
      }
    }
  }

  if (currentText) {
    if (ctx.measureText(currentText).width < maxWidth) {
      lines.push(currentText);
    }
    else {
      // Caesura management
      index_c = 0;
      l_text = currentText.length;
      futureText = "";
      while (index_c < l_text) {
        futureFutureText = futureText + currentText[index_c];
        if (ctx.measureText(futureFutureText).width >= maxWidth) {
          lines.push(futureText);
          futureText = currentText[index_c];
          index_c++;
        }
        else {
          futureText = futureFutureText;
          index_c++;
        }
      }
      if (futureText) {
        lines.push(futureText);
      }
    }
    currentText = "";
  }

  // Return the maximum line width
  return 0;//maxLineWidth;
}

export function _create_multiline_text(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lines: string[]): number {

  let multilines = text.split("\n"), maxLineWidth = 0;

  multilines.forEach((text: string): void => {
    maxLineWidth = Math.max(
      maxLineWidth,
      __create_multiline_text(ctx, text, maxWidth, lines));
  });

  return maxLineWidth;
}

export function __render_text_into_canvas_ctx(
  text: string,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  style: Style): number {
  ctx.clearRect(0, 0, width, height);
  let
    color = style.color,
    lines: string[] = [],
    offsetY: number = 0;

  if (!color) color = Color.white;

  var
    font = style.fontWeight + " " +
      (style._font_size * gl_device_pixel_ratio) + "px " +
      style.fontFamily;

  // This determines the text colour, it can take a hex value or rgba value (e.g. rgba(255,0,0,0.5))
  ctx.fillStyle = color.getRgbaString();
  ctx.strokeStyle = color.getRgbaString();
  // This determines the size of the text and the font family used
  ctx.font = font;

  ctx.textAlign = style.textAlign;
  ctx.textBaseline = "middle";

  _create_multiline_text(ctx, text, width, lines);
  offsetY = height / 2 - (lines.length - 1) * (style._font_size * gl_device_pixel_ratio) / 2;

  lines.forEach((line, i) => {
    var dy = i * (style._font_size * gl_device_pixel_ratio) + offsetY;
    switch (style.textAlign) {
      case "left":
        ctx.fillText(line, 0, dy);
        break;

      case "right":
        const textWidth = ctx.measureText(line).width;
        ctx.fillText(line, width, dy);
        break;

      case "center":
        ctx.fillText(line, width / 2, dy);
        break;
    }
  });

  return lines.length * style._font_size;
}

export function __copy_image_into_webgl_texture(image: TexImageSource, texture?: WebGLTexture): WebGLTexture {
  const gl_ctx = getGLContext();

  if (!texture) {
    texture = gl_ctx.createTexture();
  }

  gl_ctx.pixelStorei(gl_ctx.UNPACK_FLIP_Y_WEBGL, false);
  gl_ctx.pixelStorei(gl_ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, texture);

  gl_ctx.texImage2D(
    gl_ctx.TEXTURE_2D, 0,
    gl_ctx.RGBA, gl_ctx.RGBA,
    gl_ctx.UNSIGNED_BYTE, image
  );

  // POT images
  if (isPowerOfTwo(image.width) && isPowerOfTwo(image.height)) {
    gl_ctx.texParameteri
      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MAG_FILTER, gl_ctx.LINEAR);

    gl_ctx.texParameteri
      (gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.NEAREST_MIPMAP_LINEAR);

    gl_ctx.generateMipmap(gl_ctx.TEXTURE_2D);
  }
  // NPOT images
  else {
    //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
    gl_ctx.texParameteri(gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_MIN_FILTER, gl_ctx.LINEAR);
    //Prevents s-coordinate wrapping (repeating).
    gl_ctx.texParameteri(gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_S, gl_ctx.CLAMP_TO_EDGE);
    //Prevents t-coordinate wrapping (repeating).
    gl_ctx.texParameteri(gl_ctx.TEXTURE_2D, gl_ctx.TEXTURE_WRAP_T, gl_ctx.CLAMP_TO_EDGE);
  }
  gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, null);

  BaseView.__should_render = true;

  return texture
}