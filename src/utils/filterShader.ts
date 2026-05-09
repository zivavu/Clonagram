export const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
in vec2 a_texCoord;
out vec2 v_texCoord;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}`;

export const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 v_texCoord;
uniform sampler2D u_image;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_temperature;
uniform float u_fade;
uniform float u_vignette;
uniform mat4 u_colorMatrix;

out vec4 outColor;

void main() {
  vec4 color = texture(u_image, v_texCoord);
  
  // Apply color matrix for preset effects
  color = u_colorMatrix * color;
  
  // Brightness (-0.5 to 0.5 range mapped from -50 to 50)
  color.rgb += u_brightness;
  
  // Contrast (0.5 to 1.5 range mapped from -50 to 50, 1 = neutral)
  color.rgb = (color.rgb - 0.5) * u_contrast + 0.5;
  
  // Saturation (0 to 2 range, 1 = neutral)
  float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(vec3(luminance), color.rgb, u_saturation);
  
  // Temperature (-1 to 1 range mapped from -100 to 100)
  float temp = u_temperature;
  color.r += temp * 0.08;
  color.g += temp * 0.02;
  color.b -= temp * 0.1;
  
  // Fade (-1 to 1 range mapped from -100 to 100)
  if (u_fade > 0.0) {
    // Positive: lift blacks toward mid-gray
    color.rgb = color.rgb * (1.0 - u_fade * 0.8) + u_fade * 0.3;
  } else if (u_fade < 0.0) {
    // Negative: increase contrast, darken midtones
    color.rgb = pow(color.rgb, vec3(1.0 - u_fade * 0.3));
  }
  
  // Vignette (0 to 1 range mapped from 0 to 100)
  vec2 center = v_texCoord - 0.5;
  float dist = length(center) * 1.4142;
  float vignetteAmount = 1.0 - dist * u_vignette * 1.5;
  color.rgb *= clamp(vignetteAmount, 0.0, 1.0);
  
  // Clamp final color
  color.rgb = clamp(color.rgb, 0.0, 1.0);
  
  outColor = color;
}`;

export function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
   const shader = gl.createShader(type);
   if (!shader) return null;
   gl.shaderSource(shader, source);
   gl.compileShader(shader);
   if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
   }
   return shader;
}

export function createProgram(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string): WebGLProgram | null {
   const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
   const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
   if (!vertexShader || !fragmentShader) return null;

   const program = gl.createProgram();
   if (!program) return null;

   gl.attachShader(program, vertexShader);
   gl.attachShader(program, fragmentShader);
   gl.linkProgram(program);

   if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
   }

   return program;
}

export const IDENTITY_MATRIX = new Float32Array([
   1, 0, 0, 0,
   0, 1, 0, 0,
   0, 0, 1, 0,
   0, 0, 0, 1,
]);

export const PRESET_MATRICES: Record<string, Float32Array> = {
   Original: IDENTITY_MATRIX,
   Clarendon: new Float32Array([
      1.1, 0, 0, 0,
      0, 1.1, 0, 0,
      0, 0, 1.1, 0,
      0, 0, 0, 1,
   ]),
   Gingham: new Float32Array([
      0.95, 0.05, 0, 0,
      0.02, 0.95, 0.03, 0,
      0, 0.05, 0.9, 0,
      0, 0, 0, 1,
   ]),
   Moon: new Float32Array([
      0.299, 0.299, 0.299, 0,
      0.587, 0.587, 0.587, 0,
      0.114, 0.114, 0.114, 0,
      0, 0, 0, 1,
   ]),
   Lark: new Float32Array([
      1.1, 0, 0, 0,
      0, 1.05, 0, 0,
      0, 0, 1.15, 0,
      0, 0, 0, 1,
   ]),
   Reyes: new Float32Array([
      0.95, 0.08, 0, 0,
      0.05, 0.9, 0.05, 0,
      0, 0.08, 0.85, 0,
      0, 0, 0, 1,
   ]),
   Juno: new Float32Array([
      1.15, 0, 0, 0,
      0, 1.05, 0, 0,
      0, 0, 1.2, 0,
      0, 0, 0, 1,
   ]),
   Aden: new Float32Array([
      1.05, 0.05, 0, 0,
      0.02, 1.0, 0.03, 0,
      0, 0.05, 0.95, 0,
      0, 0, 0, 1,
   ]),
   Perpetua: new Float32Array([
      1.05, 0, 0, 0,
      0, 1.05, 0, 0,
      0, 0, 1.05, 0,
      0, 0, 0, 1,
   ]),
   Crema: new Float32Array([
      1.05, 0.05, 0, 0,
      0.03, 1.0, 0.02, 0,
      0, 0.05, 0.95, 0,
      0, 0, 0, 1,
   ]),
   Ludwig: new Float32Array([
      1.1, 0, 0, 0,
      0, 1.05, 0, 0,
      0, 0, 1.1, 0,
      0, 0, 0, 1,
   ]),
   Slumber: new Float32Array([
      0.9, 0.08, 0, 0,
      0.05, 0.88, 0.05, 0,
      0, 0.08, 0.85, 0,
      0, 0, 0, 1,
   ]),
};

export function loadTexture(gl: WebGL2RenderingContext, image: HTMLImageElement | HTMLCanvasElement): WebGLTexture {
   const texture = gl.createTexture();
   gl.bindTexture(gl.TEXTURE_2D, texture);

   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

   return texture;
}
