import * as THREE from 'three';
import vertexShader from "../shaders/vertexShader.js";
import fragmentShader from "../shaders/fragmentShader.js";

let OrbitControls = require('three-orbit-controls')(THREE);

export default class Sketch {
  constructor(options){
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1.0); 
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerwidth / window.innerHeight,
      0.001,
      1000
    );

    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.isPlaying = true;

    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    this.materials = [];
    this.meshes = [];
    this.handleImages();
  }

  settings() {
    let that = this;
    this.settings = { 
      progress: 0,
    };
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width/ this.height;

    this.imageAspect = 853/1280;
    let a1; let a2;
    if(this.height/this.width>this.imageAspect) {
      a1 = (this.width/ this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = (this.height/this.width) / this.imageAspect;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable'
      },
      side: THREE.DoubleSide,
      uniforms: {
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
    //original mesh becamew redundant after we cloned everythin for the final images in handleImages
    // this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    // this.plane = new THREE.Mesh(this.geometry, this.material);
    // this.scene.add(this.plane);
  }

  handleImages() {
    let images = [...document.querySelectorAll('img')];
  
    images.forEach((img, i) => {
      let materialImg = this.material.clone()
      this.materials.push(materialImg)
      materialImg.uniforms.texture1.value = new THREE.Texture(img)
      materialImg.uniforms.texture1.value.needsUpdate = true
  
      let geom = new THREE.PlaneBufferGeometry(1.5,1,20,20)
      let mesh = new THREE.Mesh(geom, materialImg)
      this.scene.add(mesh)
      this.meshes.push(mesh);
      //mutate the y position of each subsequent plane to its index*1.2, so they successively stack
      mesh.position.y = i*1.2
      mesh.rotation.y = -0.3
      mesh.rotation.x = 0.5
    })
  }

  stop() {
    this.isPlaying = false;
  }
  
  play() {
    if(!this.isPlaying){
      this.render()
      this.isPlaying = true;
    }
  }
  
  render() {
    if(!this.isPlaying) return;
    this.time += 0.05;
    if(this.materials){
      this.materials.forEach( m => {
        m.uniforms.time.value = this.time;
      })
    }
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}
