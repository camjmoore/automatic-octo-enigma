import './style.scss'

let speed = 0;
let position = 0;
let block = document.getElementById('block');

window.addEventListener('wheel', e => {
  speed += e.deltaY*0.0002;
})

function raf(){
  position += speed;
  speed*=0.8;
  block.style.transform = `translate(0, ${position*100}px)`
  window.requestAnimationFrame(raf)
}

console.log('it works!')
raf();