let simSize = 512;
let renderSize = 2048;
let n = 500
let dotSize = 2.0
let decayFactor = 0.99
let clearStrength = 0.05
let t = 0;
let particle_data = create_static_particles(n);
let other_data;


setup_webgl()
createParticleProgram();

createDotProgram();
createBlurProgram();
createFadeProgram();
createRenderProgram();



function create_static_particles(){
  let arr = [];
  for (let j = 0; j < n * n; ++j) {
    arr.push(2 * Math.random() - 1); // x position
    arr.push(2 * Math.random() - 1); // y position
  }
  return new Float32Array(arr);
}




function animate(timestamp) {
  t++;
  calcParticles();
  
  // drawDot();
  // moveDots();
  drawDotOffscreen();
  applyBlur();
  applyFade();
  drawDotOffscreen();
  drawRender();

  requestAnimationFrame(animate);
}



requestAnimationFrame(animate);
