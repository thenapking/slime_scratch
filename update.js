
const updateVSource = `#version 300 es
precision highp float;

in vec2 i_P;
out vec2 v_P;

void main() {
  v_P = i_P + 0.1;
}
`

const updateFSource =  `#version 300 es
precision highp float;
in vec2 v_P;
void main() {
  discard;
}`

let buffers = [];
let textures = [];
let buffer_read = 0;
let buffer_write = 1;
let VAOs = [];
let updateParticles;
let readBuffer, writeBuffer, textureA, textureB, VAOA, VAOB;
let current_buffer = 0;

function createParticleProgram(){
  updatePresetArray()

  buffers[0] = gl.createBuffer();
  buffers[1] = gl.createBuffer();
  VAOs[0] = gl.createVertexArray();
  VAOs[1] = gl.createVertexArray();

  const varyings = ["v_P"];
  updateParticles = create_program(updateVSource, updateFSource, varyings)

  let other_data = new Float32Array(2 * n * n);
  for (let j = 0; j < n * n; j+=2) {
    other_data[j] = 2 * Math.random() - 1; // x position
    other_data[j + 1] = 2 * Math.random() - 1; // y position
  }
  console.log("init")
  console.log(other_data);

  gl.bindVertexArray(VAOs[0]);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0]);
  gl.bufferData(gl.ARRAY_BUFFER, other_data, gl.DYNAMIC_COPY);

  const ipLoc = gl.getAttribLocation(updateParticles, "i_P");
  gl.vertexAttribPointer(ipLoc, 2, gl.FLOAT, false, 2 * 4, 0);
  gl.enableVertexAttribArray(ipLoc);

  
  gl.bindVertexArray(VAOs[1]);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[1]);
  gl.bufferData(gl.ARRAY_BUFFER, other_data, gl.DYNAMIC_COPY);

  gl.vertexAttribPointer(ipLoc, 2, gl.FLOAT, false, 2 * 4, 0);
  gl.enableVertexAttribArray(ipLoc);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}


function calcParticles(){
  gl.useProgram(updateParticles);

  let readBufferIdx = current_buffer % 2
  let writeBufferIdx = (current_buffer + 1) % 2

  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers[writeBufferIdx]);  
  gl.bindVertexArray(VAOs[readBufferIdx]);

  gl.enable(gl.RASTERIZER_DISCARD);

  gl.beginTransformFeedback(gl.POINTS);
  gl.drawArrays(gl.POINTS, 0, n*n);
  gl.endTransformFeedback();

  gl.disable(gl.RASTERIZER_DISCARD);


  gl.bindVertexArray(null);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // this essentially swaps the buffer indexes   
  current_buffer++


//  log_buffer(buffers[writeBufferIdx], writeBufferIdx);
//  log_buffer(buffers[readBufferIdx], readBufferIdx);

}

  // THIS OUTPUTS IT TO THE CONSOLE NICELY

function log_buffer(buffer, buffer_name){
  const view = new Float32Array(n * n);
  gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, buffer);
  gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, view);
  console.log(buffer_name);
  console.log(view);
}


let currentPreset = {
  sensorDistanceBase: 0,
  sensorDistanceExponent: 4,
  sensorDistanceMultiplier: 0.3,
  sensorAngleBase: 0.1,
  sensorAngleExponent: 51.32,
  sensorAngleMultiplier: 20,
  turnAngleBase: 0.41,
  turnAngleExponent: 4,
  turnAngleMultiplier: 0,
  speedBase: 0.1,
  speedExponent: 6,
  speedpMultiplier: 0.1,
  verticalOffset: 0,
  horizontalOffset: 0,
  depositOpacity: 0.5,
  trailDecayFactor: 0.95,
  blurIterationCount: 1,
  renderOpacity: 0.5,
  clearOpacity: 0.1,
  particleDotSize: 2,
};

let presetArray = [];

function updatePresetArray() { 
  presetArray = [
    currentPreset.sensorDistanceBase,
    currentPreset.sensorDistanceExponent,
    currentPreset.sensorDistanceMultiplier,
    currentPreset.sensorAngleBase,
    currentPreset.sensorAngleExponent,
    currentPreset.sensorAngleMultiplier,
    currentPreset.turnAngleBase,
    currentPreset.turnAngleExponent,
    currentPreset.turnAngleMultiplier,
    currentPreset.speedBase,
    currentPreset.speedExponent,
    currentPreset.speedpMultiplier,
    currentPreset.verticalOffset,
    currentPreset.horizontalOffset,
    currentPreset.depositOpacity,
    currentPreset.trailDecayFactor,
    currentPreset.blurIterationCount,
    currentPreset.renderOpacity,
    currentPreset.clearOpacity,
  ];
}





