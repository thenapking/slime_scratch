let basicDot;
let basicPoints; 
let basicBuffer;

const dotVSource = `#version 300 es
precision highp float;
in vec2 position; 
uniform float radius;  

void main() {
  gl_Position  = vec4(position, 0.0, 1.0);
  gl_PointSize = radius;
}`

const dotFSource = `#version 300 es
precision highp float;
out vec4 fragColor;
void main() {
  vec2 center = vec2(0.5);
  float dist = distance(gl_PointCoord, center);
  if(dist > 0.5) {
    discard;
  }
  fragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`



let basicVAOs = [];
function createDotProgram() {
  texture = create_texture(c.width, c.height);
  framebuffer = gl.createFramebuffer();
 
  basicDot = create_program(dotVSource, dotFSource);
  basicVAOs[0] = gl.createVertexArray();
  basicVAOs[1] = gl.createVertexArray();

  gl.bindVertexArray(basicVAOs[0]);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0]);
  const positionLoc = gl.getAttribLocation(basicDot, "position");
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 2 * 4, 0);
  gl.enableVertexAttribArray(positionLoc);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[1]);
  gl.bindVertexArray(basicVAOs[1]);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 2 * 4, 0);
  gl.enableVertexAttribArray(positionLoc);

  gl.bindVertexArray(null)
  
  gl.useProgram(basicDot);
  const radiusLoc = gl.getUniformLocation(basicDot, "radius");
  gl.uniform1f(radiusLoc, dotSize); // Set the radius uniform
  gl.useProgram(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function moveDots(){
  for(let i = 0; i < particle_data.length; i+=2){
    particle_data[i]   += 0.01 * (2 * Math.random() - 1);
    particle_data[i+1] += 0.01 * (2 * Math.random() - 1);
  }
}



let texture;
let framebuffer;


function drawDotOffscreen(){
  let readBufferIdx = current_buffer % 2;

  gl.useProgram(basicDot);
  gl.bindVertexArray(basicVAOs[readBufferIdx]);


  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[readBufferIdx]);

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    console.error("Framebuffer incomplete");
  }

  gl.viewport(0, 0, c.width, c.height);

  // Draw the particles
  gl.drawArrays(gl.POINTS, 0, n * n);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);  // unbind when done
}


function drawDot() {
  gl.useProgram(basicDot);
  gl.bindBuffer(gl.ARRAY_BUFFER, basicBuffer);
  
  moveDots();
  gl.bufferData(gl.ARRAY_BUFFER, particle_data, gl.STREAM_DRAW);

  // Draw the particles
  gl.drawArrays(gl.POINTS, 0, n * n);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
