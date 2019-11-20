
export function allocateMeshVertices(resolution: number, c: Float32Array): Float32Array {

  //(resolution + 1) * (resolution + 1) vertices; vertexe = 3 numbers
  if (!c) {
    c = new Float32Array ((resolution + 1) * (resolution + 1) * 3); 
  }
  
  var i = 0, xs, ys, x, y;

  for (xs = 0; xs < resolution + 1; xs++) {
    c[i++] = 0;
    c[i++] = 0;
    c[i++] = 0;

    for (ys = 1; ys < resolution + 1; ys++) {
      c[i++] = 0;
      c[i++] = 0;
      c[i++] = 0;
    }
  }
  return c;
}

export function allocateNormalVertices(resolution: number, c: Float32Array): Float32Array {
  //(resolution + 1) * (resolution + 1) vertices; vertexe = 3 numbers
  if (!c) {
    c = new Float32Array ((resolution + 1) * (resolution + 1) * 3); 
  }
  
  var i = 0, xs, ys, x, y;

  for (xs = 0; xs < resolution + 1; xs++) {
    c[i++] = 0.0;
    c[i++] = 0.0;
    c[i++] = 1.0;

    for (ys = 1; ys < resolution + 1; ys++) {
      c[i++] = 0.0;
      c[i++] = 0.0;
      c[i++] = 1.0;
    }
  }
  return c;
}

export function makeTextureProjection(resolution: number, c: Float32Array): Float32Array {
  var r = 1 / resolution;
  
  //(resolution + 1) * (resolution + 1) vertices; vertexe = 3 numbers
  if (!c) {
    c = new Float32Array ((resolution + 1) * (resolution + 1) * 2);
  }

  var i = 0, xs, ys, x, y;

  for (xs = 0; xs < resolution + 1; xs++) {
    x = r * xs;
    y = 0;
    
    c[i++] = x;
    c[i++] = y;
 
    for (ys = 1; ys < resolution + 1; ys++) {

      y = r * ys;

      c[i++] = x;
      c[i++] = y;
    }
  }
  
  return c;
}

export function allocateTriangleFaces(resolution: number, c: Uint16Array): Uint16Array {

  //resolution * resolution rectangles; rectangle = 2 facets; facet = 3 vertices
  if (!c) {
    c = new Uint16Array (resolution * resolution * 6);
  }
  
  var i = 0, xs, ys, j = 0;

  for (xs = 0; xs < resolution; xs++) {
    for (ys = 0; ys < resolution ; ys++) {

      // first facet
      c[i++] = j;
      c[i++] = j + resolution + 1;
      c[i++] = j + 1;

      // second facet
      c[i++] = j + 1;
      c[i++] = j + resolution + 1;
      c[i++] = j + resolution + 2;
      
      j++;
    }
    j++;
  }
  
  return c;
}

function initMeshVeticesValues(resolution: number, pos_x: number, pos_y: number, width: number, height: number, c: Float32Array): Float32Array {

  var rx = width / resolution;
  var ry = height / resolution;
  
  //(resolution + 1) * (resolution + 1) vertices; vertexe = 3 numbers
  if (!c) {
    return;
  }
  
  var i = 0, xs, ys, x, y;

  for (xs = 0; xs < resolution + 1; xs++) {
    x = pos_x + rx * xs;
    y = pos_y;
    
    c[i++] = x;
    c[i++] = y;
    c[i++] = 0;

    for (ys = 1; ys < resolution + 1; ys++) {
      y = pos_y + ry * ys;
      
      c[i++] = x;
      c[i++] = y;
      c[i++] = 0;
    }
  }
  return c;
}
