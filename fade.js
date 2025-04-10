let fadeProgram; // Shader program for clear/fade
let fadeVAO;

const fadeVertexSource = `#version 300 es
precision highp float;

in vec2 aPos; 
in vec2 aTexCoord;
out vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const fadeFragSource = `#version 300 es
precision highp float;
in vec2 vTexCoord;
out vec4 fragColor;
uniform float clearOpacity;  // Should be a normalized value in [0, 1]
void main() {
  fragColor = vec4(0.0, 0.0, 0.0, clearOpacity);
}
`

function createFadeProgram() {
  fadeProgram = create_program(fadeVertexSource, fadeFragSource);
  fadeVAO = gl.createVertexArray();

  gl.bindVertexArray(fadeVAO);
  
  let vertices = new Float32Array([
    // aPos       // aTexCoord
    -1,  1,      0, 1,  // Top-left
    -1, -1,      0, 0,  // Bottom-left
     1,  1,      1, 1,  // Top-right
     1, -1,      1, 0   // Bottom-right
  ]);
  
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
  let posLoc = gl.getAttribLocation(fadeProgram, "aPos");
  let texCoordLoc = gl.getAttribLocation(fadeProgram, "aTexCoord");
  
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 4 * 4, 0);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 4 * 4, 2 * 4);

  gl.enableVertexAttribArray(posLoc);
  gl.enableVertexAttribArray(texCoordLoc);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindVertexArray(null);
}

function applyFade() {
  gl.useProgram(fadeProgram);
  gl.enable(gl.BLEND);
  
  let clearOpacityLoc = gl.getUniformLocation(fadeProgram, "clearOpacity");
  gl.uniform1f(clearOpacityLoc, clearStrength);
  
  // Bind the framebuffer and attach texture as the render target.
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.viewport(0, 0, c.width, c.height);
  
  // Enable blending if not already enabled.
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  
  gl.bindVertexArray(fadeVAO);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  gl.bindVertexArray(null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
