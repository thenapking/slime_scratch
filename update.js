
const updateVSource = `#version 300 es
precision highp float;

uniform sampler2D uTexture;
uniform vec2 uTextureSize;
in vec2 i_P;
in float i_T;
out vec2 v_P;
out float v_T;

uniform float[19] v;

vec2 bd(vec2 pos) {
  pos *= 0.5;
  pos += vec2(0.5);
  pos -= floor(pos);
  pos -= vec2(0.5);
  pos *= 2.0;
  return pos;
}

float gn(in vec2 coordinate, in float seed) {
  return fract(tan(distance(coordinate * (seed + 0.118446744073709551614),
                           vec2(0.118446744073709551614, 0.314159265358979323846264)))
               * 0.141421356237309504880169);
}

void main() {
  vec2 dir = vec2(cos(i_T), sin(i_T));
  float hd = uTextureSize.x / 2.0;
  vec2 sp = 0.5 * (i_P + vec2(1.0));
  float sv = texture(uTexture, bd(sp + v[13] / hd * dir + vec2(0.0, v[12] / hd))).x;
  sv = max(sv, 0.000000001);

  float sd = v[0] / hd + v[2] * pow(sv, v[1]) * 250.0 / hd;
  float md = v[9] / hd + v[11] * pow(sv, v[10]) * 250.0 / hd;
  float sa = v[3] + v[5] * pow(sv, v[4]);
  float ra = v[6] + v[8] * pow(sv, v[7]);

  float m = texture(uTexture, bd(sp + sd * vec2(cos(i_T), sin(i_T)))).x;
  float l = texture(uTexture, bd(sp + sd * vec2(cos(i_T + sa), sin(i_T + sa)))).x;
  float r = texture(uTexture, bd(sp + sd * vec2(cos(i_T - sa), sin(i_T - sa)))).x;
  float h = i_T;

  if (m > l && m > r) {
    // do nothing
  } else if (m < l && m < r) {
    if (gn(i_P * 1332.4324, i_T) > 0.5)
      h += ra;
    else
      h -= ra;
  } else if (l < r)
    h -= ra;
  else if (l > r)
    h += ra;

  vec2 nd = vec2(cos(h), sin(h));
  vec2 op = i_P + nd * md;

  v_P = bd(op);
  v_T = h;
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

  const varyings = ["v_P", "v_T"];
  updateParticles = create_program(updateVSource, updateFSource, varyings)

  let other_data = new Float32Array(3 * n * n);
  for (let j = 0; j < n * n; j+=3) {
    other_data[j] = 2 * Math.random() - 1; // x position
    other_data[j + 1] = 2 * Math.random() - 1; // y position
    other_data[j + 2] = 2 * Math.random() - 1; // angle
  }

  console.log("init")
  console.log(other_data);

  gl.bindVertexArray(VAOs[0]);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0]);
  gl.bufferData(gl.ARRAY_BUFFER, other_data, gl.DYNAMIC_COPY);

  const ipLoc = gl.getAttribLocation(updateParticles, "i_P");
  gl.vertexAttribPointer(ipLoc, 2, gl.FLOAT, false, 3 * 4, 0);
  gl.enableVertexAttribArray(ipLoc);

  const iaLoc = gl.getAttribLocation(updateParticles, "i_T");
  gl.vertexAttribPointer(iaLoc, 1, gl.FLOAT, false, 3 * 4, 2 * 4);
  gl.enableVertexAttribArray(iaLoc);

  
  gl.bindVertexArray(VAOs[1]);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[1]);
  gl.bufferData(gl.ARRAY_BUFFER, other_data, gl.DYNAMIC_COPY);

  gl.vertexAttribPointer(ipLoc, 2, gl.FLOAT, false, 3 * 4, 0);
  gl.enableVertexAttribArray(ipLoc);

  gl.vertexAttribPointer(iaLoc, 1, gl.FLOAT, false, 3 * 4, 2 * 4);
  gl.enableVertexAttribArray(iaLoc);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}


function calcParticles(){
  gl.useProgram(updateParticles);

  let readBufferIdx = current_buffer % 2
  let writeBufferIdx = (current_buffer + 1) % 2

  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers[writeBufferIdx]); 
  
  // could this bit be wrong?
  // could we first need to render off screen to a texture that is 512*512?
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  gl.uniform1i( gl.getUniformLocation(updateParticles, "uTexture"), 1); 
  gl.uniform2f( gl.getUniformLocation(updateParticles, "uTextureSize"), c.width, c.height);
  gl.uniform1fv(gl.getUniformLocation(updateParticles, "v"), presetArray);

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
}

  // THIS OUTPUTS IT TO THE CONSOLE NICELY

function log_buffer(buffer, buffer_name){
  const view = new Float32Array(3 * n * n);
  gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, buffer);
  gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, view);
  console.log(buffer_name);
  console.log(view);
}







