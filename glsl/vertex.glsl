varying float vUv;

void main() {
  // modelViewMatrix, position and projectionMatrix are magical
  // attributes that Three.js defines for us.

  // Transform current vertex by the modelViewMatrix
  // (bundled model world position & camera world position matrix).
  vec4 mvPosition = modelViewMatrix * position;

  // Project camera-space vertex to screen coordinates
  // using the camera's projection matrix.
  vec4 p = projectionMatrix * mvPosition;

  // uv is another magical attribute from Three.js.
  // We're passing it to the fragment shader unchanged.
  vUv = uv;

  gl_Position = p;
}