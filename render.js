let renderProgram;
let renderVAO;
let renderBuffer;


const renderVSource = `#version 300 es
precision highp float;
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_texCoord;
out vec2 v_texCoord;
void main() {
  v_texCoord = a_texCoord;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const renderFSource = `#version 300 es
precision highp float;
in vec2 v_texCoord;
uniform sampler2D u_texture;
out vec4 fragColor;
void main() {
  fragColor = texture(u_texture, v_texCoord);
}`;

function createRenderProgram() {

  renderProgram = create_program(renderVSource, renderFSource);

  renderVAO = gl.createVertexArray();
  renderBuffer = gl.createBuffer();

  gl.bindVertexArray(renderVAO);
  gl.bindBuffer(gl.ARRAY_BUFFER, renderBuffer);
  const vertices = new Float32Array([
    -1.0, -1.0, 0.0, 0.0,
     1.0, -1.0, 1.0, 0.0,
    -1.0,  1.0, 0.0, 1.0,
     1.0,  1.0, 1.0, 1.0
  ]);

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(0); // a_position
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 4 * 4, 0);

  gl.enableVertexAttribArray(1); // a_texCoord
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 4 * 4, 2 * 4);

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

}

function drawRender() {
  gl.bindFramebuffer(gl.FRAMEBUFFER, null); // bind to the canvas
  gl.viewport(0, 0, c.width, c.height);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(renderProgram);

  // Bind the texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(gl.getUniformLocation(renderProgram, "u_texture"), 0);

  // Bind the VAO and draw
  gl.bindVertexArray(renderVAO);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.bindVertexArray(null);
}
