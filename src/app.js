import './style.scss';
import Sketch from './three/three-class-refactor.js';
import Glide from '@glidejs/glide'

let glide1 = new Glide('.glide1', {
  perView: 1,
  startAt: 0,
  hoverpause: true,
  autoplay: false
})

let glide2 = new Glide('.glide2', {
  perView: 1,
  startAt: 0,
  hoverpause: true,
  autoplay: 2700
})

glide1.mount()

setTimeout(() => {
  glide1.update()
  glide1.play(2700)
  console.log('update ran')
}, 1000)

let sketch = new Sketch({
  dom: document.getElementById('canvas')
})

let speed = 0;
let position = 0;
let rounded = 0;
let block = document.getElementById('block');
let wrap = document.getElementById('wrapper');
let elems = [...document.querySelectorAll('.n')];
let nav = [...document.querySelectorAll('li')];
let descrips = [...document.querySelectorAll('.description')];

window.addEventListener('wheel', e => {
  //slow down rate of change for y
  speed += e.deltaY*0.0003;
})

//create an array of object to iterate over
let objets = Array(5).fill({dist:0}) 

function raf(){
  position += speed;
  speed *= 0.8;
  rounded = Math.round(position);
  
  //iterate over the dist objects in the array we created
  objets.forEach((obj, i) => {
    obj.dist = Math.min(Math.abs(position - i), 1)
    obj.dist = 1 - obj.dist**2;
    elems[i].style.transform = `scale(${1 + 0.4*obj.dist})`
    let scale = 1 + 0.3*obj.dist;
    sketch.meshes[i].position.y = i*1.2 - position*1.2
    sketch.meshes[i].scale.set(scale,scale,scale)
    sketch.meshes[i].material.uniforms.distanceFromCenter.value = obj.dist

  })
  
  //acts as a lerp function
  let diff = (rounded - position);
  
  position += Math.sign(diff*0.050)*Math.pow(Math.abs(diff),0.7)*0.035;

  position > 1 ? position = Math.min(position, 4.1) : position = Math.max(position, 0.1)

  nav.forEach((el) => {
    el.addEventListener('mouseover', (e) => {
      e.target.getAttribute('data-nav') == 0 ? position = 0 : position = 4
    })
  })

  descrips.forEach((descrip) => {
    descrip.getAttribute('data-desc') == rounded ? descrip.classList.remove('display') : descrip.classList.add('display')
  })

  descrips.forEach((descrip) => {
    descrip.addEventListener('wheel', e => {
      e.preventdefault()
    })
  })
  
  // let displayed = `description${rounded}`
  // if className = `description${rounded}`
  
  // if(descrip.getAttribute('data-desc') == rounded){
  //   descrip.classList.remove('display')
  // } else {
  //   descrip.classList.add('display')
  // }

  //mesh positions should programmatically render trigger classes for scss animations
    //if rounded value is between a
    
    
  //mesh position values are only available within raf()


  // console.log(rounded)
  // block.style.transform = `translate(0, ${position*100}px)`
  // wrap.style.transform = `translate(0, ${-position*100 + 50}px)`

  //fix for discontinuity of resize function after page refresh
  sketch.resize()
  window.requestAnimationFrame(raf)
}

raf();