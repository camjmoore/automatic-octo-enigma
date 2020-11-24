export default function vertexShader() {
  return `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform vec2 pixels;
    float PI = 3.141592653589793238;
    void main() {
        vUv = uv;
        vec3 pos = position;
        pos.y += sin(time)*0.02;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    }
  `
}
