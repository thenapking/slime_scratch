let simSize = 512;
let renderSize = 2048;
let n = 400
let dotSize = 2.0
let clearStrength = 0.05
let t = 0;
let particle_data;


setup_webgl()
createGUI();
calculate_colours();


createParticleProgram();
createDotProgram();
createBlurProgram();
createFadeProgram();
createRenderProgram();




function animate(timestamp) {
  t++;
  calcParticles();
  
  drawDotOffscreen();
  applyBlur();
  applyFade();
  drawDotOffscreen();
  drawRender();

  requestAnimationFrame(animate);
}



requestAnimationFrame(animate);
