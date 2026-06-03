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
uniform sampler2D u_curves;

// Preset uniforms
uniform float u_presetActive;
uniform float u_pBrightness;
uniform float u_pContrast;
uniform float u_pSaturation;
uniform vec4 u_pShadowTint;
uniform vec4 u_pHighlightTint;
uniform vec4 u_pFade;
uniform vec3 u_pColorBalance;
uniform float u_pVignette;
uniform float u_filterStrength;

// User-controlled adjustments
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_temperature;
uniform float u_fade;
uniform float u_vignette;

out vec4 outColor;

const vec3 LUM_WEIGHTS = vec3(0.2126, 0.7152, 0.0722);

// Half-texel correction ensures we always hit exact LUT texel centers,
// eliminating linear interpolation error on the identity curve.
vec3 applyCurves(vec3 c) {
  const float S = 255.0 / 256.0;
  const float B = 0.5 / 256.0;
  c.r = texture(u_curves, vec2(c.r * S + B, 0.5)).r;
  c.g = texture(u_curves, vec2(c.g * S + B, 0.5)).g;
  c.b = texture(u_curves, vec2(c.b * S + B, 0.5)).b;
  return c;
}

vec3 setSaturation(vec3 c, float amount) {
  float lum = dot(c, LUM_WEIGHTS);
  return mix(vec3(lum), c, amount);
}

void main() {
  vec4 color = texture(u_image, v_texCoord);
  vec3 originalRGB = color.rgb;
  vec3 filtered = color.rgb;

  if (u_presetActive > 0.5) {
    // 1. Per-channel tone curves (single-pass)
    filtered = applyCurves(filtered);

    // 2. Preset saturation
    filtered = setSaturation(filtered, u_pSaturation);

    // 3. Preset color balance shift
    filtered += u_pColorBalance;

    // 4. Split toning: luminance-weighted color tint for shadows and highlights
    float lum = dot(clamp(filtered, 0.0, 1.0), LUM_WEIGHTS);
    if (u_pShadowTint.a > 0.0) {
      float mask = pow(1.0 - lum, 1.8) * u_pShadowTint.a;
      filtered = mix(filtered, u_pShadowTint.rgb, mask);
    }
    if (u_pHighlightTint.a > 0.0) {
      float mask = pow(lum, 1.6) * u_pHighlightTint.a;
      filtered = mix(filtered, u_pHighlightTint.rgb, mask);
    }

    // 5. Preset fade (lifts shadows toward a matte color)
    if (u_pFade.a > 0.0) {
      float mask = pow(1.0 - lum, 1.2) * u_pFade.a;
      filtered = mix(filtered, u_pFade.rgb, mask);
    }

    // 6. Preset contrast + brightness
    filtered = (filtered - 0.5) * u_pContrast + 0.5;
    filtered += u_pBrightness;
  }

  // ── User adjustments ──
  filtered += u_brightness;
  filtered = (filtered - 0.5) * u_contrast + 0.5;
  filtered = setSaturation(filtered, u_saturation);
  filtered.r += u_temperature * 0.08;
  filtered.g += u_temperature * 0.02;
  filtered.b -= u_temperature * 0.10;

  if (u_fade > 0.0) {
    filtered = filtered * (1.0 - u_fade * 0.7) + u_fade * 0.35;
  } else if (u_fade < 0.0) {
    filtered = pow(max(filtered, vec3(0.0)), vec3(1.0 - u_fade * 0.3));
  }

  vec2 vc = v_texCoord - 0.5;
  float dist = length(vc) * 1.4142;
  float v = u_pVignette + u_vignette;
  filtered *= clamp(1.0 - dist * v * 1.4, 0.0, 1.0);

  filtered = clamp(filtered, 0.0, 1.0);

  // Blend filtered result with the original based on filter strength
  color.rgb = mix(originalRGB, filtered, u_filterStrength);

  outColor = color;
}`;
