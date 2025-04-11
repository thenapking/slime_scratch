let blurProgram;
let blurVAO;
let blurTexture;

// there is some difference here,
const blurVertexSource = `#version 300 es
precision highp float;

in vec2 aPos;      // Full-screen quad vertex position (clip space)

in vec2 aTexCoord; // Texture coordinate
out vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const blurFragSource = `#version 300 es
precision highp float;

uniform vec2 uTextureSize;   // Dimensions of the texture (in pixels)
uniform sampler2D uTexture;  // Input texture (the offscreen trail texture)
in vec2 vTexCoord;
out vec4 fragColor;
uniform float uDecay;        // Decay factor (e.g. 0.95)


void main() {
    vec2 onePixel = 1.0 / uTextureSize;
    vec4 sum = vec4(0.0);
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            sum += texture(uTexture, vTexCoord + onePixel * vec2(x, y));
        }
    }
    vec4 blurred = sum / 9.0;
    blurred = clamp(blurred, 0.0, 1.0); // Clamp the color to [0, 1]
    fragColor = blurred * uDecay;
}`


function createBlurProgram() {
  blurTexture = create_texture(c.width, c.height);
  blurProgram = create_program(blurVertexSource, blurFragSource);
  blurVAO = gl.createVertexArray();
  gl.bindVertexArray(blurVAO);
  
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
  
  let posLoc = gl.getAttribLocation(blurProgram, "aPos");
  let texCoordLoc = gl.getAttribLocation(blurProgram, "aTexCoord");
  
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 4 * 4, 0);
  gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 4 * 4, 2 * 4);

  gl.enableVertexAttribArray(posLoc);
  gl.enableVertexAttribArray(texCoordLoc);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindVertexArray(null);
}

function applyBlur() {
  gl.disable(gl.BLEND);

  gl.bindVertexArray(blurVAO);
  gl.useProgram(blurProgram);

  gl.bindTexture(gl.TEXTURE_2D, blurTexture);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, blurTexture, 0);
  
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  gl.uniform1i(gl.getUniformLocation(blurProgram, "uTexture"), 1); 
  gl.uniform2f(gl.getUniformLocation(blurProgram, "uTextureSize"), c.width, c.height);
  gl.uniform1f(gl.getUniformLocation(blurProgram, "uDecay"), currentPreset.trailDecayFactor);

  gl.viewport(0, 0, c.width, c.height);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  
  // Swap the textures: the blurred result becomes the new texture.
  let tmp = texture;
  texture = blurTexture;
  blurTexture = tmp;

  gl.bindVertexArray(null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  gl.enable(gl.BLEND);
}




