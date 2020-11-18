import './style.scss'

let speed = 0;
let position = 0;
let rounded = 0;
let block = document.getElementById('block');

window.addEventListener('wheel', e => {
  //slow down rate of change for y
  speed += e.deltaY*0.0003;
})

function raf(){
  position += speed;
  speed*=0.8;
  rounded = Math.round(position);

  //acts as a lerp functionx
  let diff = (rounded - position);

  position += Math.sign(diff*0.050)*Math.pow(Math.abs(diff),0.7)*0.015;

  console.log(rounded)
  block.style.transform = `translate(0, ${position*100}px)`
  window.requestAnimationFrame(raf)
}

console.log('it works!')
raf();