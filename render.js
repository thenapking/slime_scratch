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
uniform vec3 u_palette[256];

out vec4 fragColor;
void main() {
  // Sample the monochrome texture. Assuming the texture is grayscale, use the red channel.
  vec4 mono = texture(u_texture, v_texCoord);
  float intensity = mono.r;
  
  // Map the intensity (0.0 - 1.0) to an index (0-255).
  // Using clamp to ensure it stays within bounds.
  int index = int(clamp(intensity, 0.0, 1.0) * 255.0);
  
  // Look up the color from the palette.
  vec3 color = u_palette[index];
  
  fragColor = vec4(color, mono.a);
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

  // Get the uniform location for the palette and set it.
  const paletteLocation = gl.getUniformLocation(renderProgram, "u_palette");
  gl.uniform3fv(paletteLocation, mapped_colours);

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
