import './style.scss';
import sketch from './three/three-stuff';
import canvasSketch from 'canvas-sketch';

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};


let speed = 0;
let position = 0;
let rounded = 0;
let block = document.getElementById('block');
let wrap = document.getElementById('wrapper');
let elems = [...document.querySelectorAll('.n')];

window.addEventListener('wheel', e => {
  //slow down rate of change for y
  speed += e.deltaY*0.0003;
})

//create an array of object to iterate over
let objets = Array(5).fill({dist:0}) 

function raf(){
  position += speed;
  speed*=0.8;
  rounded = Math.round(position);
  
  //iterate over the dist objects in the array we created
  objets.forEach((obj, index) => {
    obj.dist = Math.min(Math.abs(position - index), 1)
    obj.dist = 1 - obj.dist**2;
    elems[index].style.transform = `scale(${1 + 0.4*obj.dist})`
  })
  
  //acts as a lerp function
  let diff = (rounded - position);
  
  position += Math.sign(diff*0.050)*Math.pow(Math.abs(diff),0.7)*0.015;
  
  console.log(rounded)
  // block.style.transform = `translate(0, ${position*100}px)`
  wrap.style.transform = `translate(0, ${-position*100 + 50}px)`
  window.requestAnimationFrame(raf)
}

console.log('it works!')
canvasSketch(sketch, settings);
raf();