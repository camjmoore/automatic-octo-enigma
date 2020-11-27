export default function vertexShader() {
  return `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform vec2 pixels;
    float PI = 3.141592653589793238;
    void main() {
        vUv = (uv - vec2(0.5))*0.9 + vec2(0.5);
        vec3 pos = position;
        pos.y += sin(PI*uv.x)*-0.05;
        pos.z += sin(PI*uv.x)*0.1;
        pos.y += sin(time*0.7)*0.02;
        vUv.y -= sin(time*0.7)*0.02;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    }
  `
}
