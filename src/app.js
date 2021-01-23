import './style.scss';
import Sketch from './three/three-class-refactor.js';
import Glide from '@glidejs/glide'

let glide1 = new Glide('#glide1', {
  perView: 1,
  startAt: 0,
})

let glide2 = new Glide('#glide2', {
  perView: 1,
  startAt: 0,
})

let glide3 = new Glide('#glide3', {
  perView: 1,
  startAt: 0,
})


glide1.mount()
glide2.mount()
glide3.mount()

let canvas = document.getElementById('canvas')

let sketch = new Sketch({
  dom: canvas
})

let speed = 0;
let position = 0;
let rounded = 0;
let block = document.getElementById('block');
let wrap = document.getElementById('wrapper');
let elems = [...document.querySelectorAll('.n')];
let nav = [...document.querySelectorAll('.nav-li')];
let descrips = [...document.querySelectorAll('.description')];

let contact = document.getElementById('contact')
let modal = document.querySelector('.background')
let close = document.querySelector('.fa-times-circle')

contact.addEventListener('click', e => {
  e.stopPropagation()
  modal.style.display = 'flex';
})

close.addEventListener('click', (e) => {
  modal.style.display = 'none';
})

window.addEventListener('wheel', e => {
  // slow down rate of change for y
  speed += e.deltaY*0.0003;
})

// create an array of object to iterate over
let objets = Array(4).fill({dist:0}) 

function raf(){
  position += speed;
  speed *= 0.8;
  rounded = Math.round(position);
  
  //console log viewport width
  // console.log(canvas.offsetWidth)
  // console.log(window.innerWidth)

  //if innerwidth < 650
  //then canvas.style.left = '0 px'

  // if (window.innerWidth < 650) {
  //   console.log(sketch.group)
  // }
  // window.innerWidth < 650 ? canvas.style.left = '0px' : canvas.style.left = '300px'

  // iterate over the dist objects in the array we created
  objets.forEach((obj, i) => {
    obj.dist = Math.min(Math.abs(position - i), 1)
    obj.dist = 1 - obj.dist**2;
    elems[i].style.transform = `scale(${1 + 0.4*obj.dist})`
    let scale = 1 + 0.3*obj.dist;
    // remember that mesh position values are only available within raf()
    sketch.meshes[i].position.y = i*1.2 - position*1.2
    sketch.meshes[i].scale.set(scale,scale,scale)
    sketch.meshes[i].material.uniforms.distanceFromCenter.value = obj.dist
    
    if (window.innerWidth < 950 && window.innerWidth > 550) {
      canvas.style.left = '0px'
      sketch.groups[i].rotation.x = -0.3
      sketch.groups[i].rotation.y = 0
      sketch.groups[i].rotation.z = 0
      sketch.camera.position.set(0, 0, 1.75)
    } else if (window.innerWidth < 550) {
      canvas.style.left = '0px'
      wrap.style.left = '0px'
      sketch.groups[i].rotation.x = -0.3
      sketch.groups[i].rotation.y = 0
      sketch.groups[i].rotation.z = 0
      sketch.camera.position.set(0, 0, 3)
    } else {
      canvas.style.left = '300px'
      sketch.groups[i].rotation.x = -0.3
      sketch.groups[i].rotation.y = -0.3
      sketch.groups[i].rotation.z = -0.15
      sketch.camera.position.set(0, 0, 2)
    }
    // sketch.groups[i].rotation.y = 0
  })

  // acts as a lerp function
  let diff = (rounded - position);
  
  position += Math.sign(diff*0.050)*Math.pow(Math.abs(diff),0.7)*0.035;
  
  position > 1 ? position = Math.min(position, 3.1) : position = Math.max(position, 0.01)
  
  nav.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.target.getAttribute('data-nav') == 0 ? position = 0 : position = 3
      console.log('nav clicked!')
    })
  })
  
  descrips.forEach((descrip) => {
    descrip.getAttribute('data-desc') == rounded ? descrip.classList.remove('display') : descrip.classList.add('display')
  })

  // remaining sketch of the behavior for the scroll interaction
  // block.style.transform = `translate(0, ${position*100}px)`
  // wrap.style.transform = `translate(0, ${-position*100 + 50}px)`
  
  // refire resize function to fix canvas sizing after page refresh
  sketch.resize()
  // enables glides to resize properly after canvas resize
  glide1.update()
  glide2.update()
  glide3.update()
  window.requestAnimationFrame(raf)
}
    
raf();