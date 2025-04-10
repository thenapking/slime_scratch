function setup_webgl(){
  const dpr = window.devicePixelRatio || 1;

  c = document.getElementById("slimewebgl");

  c.width = renderSize * dpr;
  c.height = renderSize * dpr;

  c.style.width  = Math.floor(renderSize/2) + "px";   // or `${renderSize}px`
  c.style.height = Math.floor(renderSize/2) + "px";
  
  gl = c.getContext("webgl2");		

  gl.viewport(0, 0, c.width, c.height);
  gl.getExtension("EXT_color_buffer_float");
  gl.getExtension("OES_texture_float_linear");
  gl.getExtension("EXT_float_blend");

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 1);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function create_program(vsSource, fsSource, transformFeedbackVaryings) {
  let program = gl.createProgram();

  let vertexShader = create_shader(gl.VERTEX_SHADER, vsSource)
  let fragmentShader =  create_shader(gl.FRAGMENT_SHADER, fsSource)

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  if (transformFeedbackVaryings) {
    gl.transformFeedbackVaryings(program, transformFeedbackVaryings, gl.INTERLEAVED_ATTRIBS);
  }

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
  }
  
  gl.useProgram(program);

  return program;
}

function create_shader(type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
  } else {
      alert("Didn't compile shader. Info: " + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
  }
}

function create_texture(w, h) {
  let tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, w, h, 0, gl.RGBA, gl.FLOAT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
}
