import vertexShader from '../shaders/vertexShader.js';
import fragmentShader from '../shaders/fragmentShader.js';
import {  raf } from '../app.js';

// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // time: 0,
  attributes: { antialias: true },
};

let meshPositions = 0;

export const PassPosition = (position) => {
  meshPositions = position
  console.log(meshPositions)
  return meshPositions
}

export const Sketch = ({ context }) => {
  // Setup your scene
  const scene = new THREE.Scene();
  let time = 0;
  
  //attach the canvas to the dom
  const container = context.canvas
  let width = container.offsetWidth
  let height = container.offsetHeight

  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });
  
  // WebGL background color
  renderer.setClearColor(0xeeeeee, 1);
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;

  // Append the render target to the dom
  container.appendChild(renderer.domElement)

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerwidth/window.innerHeight,
    0.001,
    1000
  );

  camera.position.set(0, 0, 2);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup a geometry
  let material = new THREE.ShaderMaterial({
    extensions: {
      derivatives: '#extension GL_OES_standard_derivatives : enable'
    },
    color: '0xffff00',
    side:  THREE.DoubleSide,
    uniforms:{
      time: { type: "f", value: 0 },
      texture1: { type: "t", value: null },
      resolution: { type: "v4", value: new THREE.Vector4() },
      uvRate1: {
        value: new THREE.Vector2(1, 1)
      }
    },
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader(),
  })

  // Map our images from our html into our shader material texture
  let materials = [];
  let meshes = [];
  let images = [...document.querySelectorAll('img')];

  images.forEach((img, i) => {
    let materialImg = material.clone()
    materials.push(materialImg)
    materialImg.uniforms.texture1.value = new THREE.Texture(img)
    materialImg.uniforms.texture1.value.needsUpdate = true

    let geom = new THREE.PlaneBufferGeometry(1.5,1,20,20)
    let mesh = new THREE.Mesh(geom, materialImg)
    scene.add(mesh)
    meshes.push(mesh);
    //mutate the y position of each subsequent plane to its index*1.2, so they successively stack
    mesh.position.y = i*1.2
    // mesh.rotation.y = -0.5
    // mesh.rotation.x = 0.5
  })

  // draw each frame
  return {
    materials: materials,
    meshes: meshes,
    // Handle resize events here
    resize() {
      let width = container.offsetWidth;
      let height =  container.offsetHeight;
      renderer.setSize(width, height);
      camera.aspect = width/ height;
      
      let imageAspect = 853/1280;
      let a1; 
      let a2;
      if(height/width > imageAspect) {
        a1 = (width/ height) * imageAspect;
        a2 = 1;
      } else {
        a1 = 1;
        a2 = (height/ width) / imageAspect;
      }

      material.uniforms.resolution.value.x = width;
      material.uniforms.resolution.value.y = height;
      material.uniforms.resolution.value.z = a1;
      material.uniforms.resolution.value.w = a2;
      
      camera.updateProjectionMatrix();

      // console.log(meshes)
    },
    // Update & render your scene here
    render({time}) {
      time += 0.05;
      //applying time to the cloned materials
      materials.forEach( m => {
        m.uniforms.time.value = time;
      })
      // material.uniforms.time.value = time;
      //applying positions to mesh positions
      // meshes.forEach((mesh, i) => {
      //   mesh.position.y = i*1.2 + meshPositions*1.2
      // })
      controls.update();
      renderer.render(scene, camera);
      // return meshes
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    },  
  };
};

let meshArray = []

export const GiveMesh = () => {
  canvasSketch(Sketch, settings).then((value) => {meshArray.push(value.sketch.meshes)})
  return meshArray
}

console.log(meshArray)
canvasSketch(Sketch, settings);