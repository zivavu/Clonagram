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

uniform float u_presetActive;
uniform float u_pBrightness;
uniform float u_pContrast;
uniform float u_pSaturation;
uniform float u_pSepia;
uniform float u_pHue;
uniform vec4 u_pShadowTint;
uniform vec4 u_pHighlightTint;
uniform vec4 u_pFade;
uniform vec3 u_pColorBalance;
uniform float u_pVignette;
uniform float u_pBlendMode;
uniform vec4 u_pBlendTop;
uniform vec4 u_pBlendBottom;
uniform float u_filterStrength;

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

vec3 applySepia(vec3 c, float amount) {
  vec3 sepia = vec3(
    dot(c, vec3(0.393, 0.769, 0.189)),
    dot(c, vec3(0.349, 0.686, 0.168)),
    dot(c, vec3(0.272, 0.534, 0.131))
  );
  return mix(c, sepia, amount);
}

vec3 applyHueRotate(vec3 c, float angle) {
  float ca = cos(angle);
  float sa = sin(angle);
  mat3 m = mat3(
    0.213 + ca * 0.787 - sa * 0.213, 0.213 - ca * 0.213 + sa * 0.143, 0.213 - ca * 0.213 - sa * 0.787,
    0.715 - ca * 0.715 - sa * 0.715, 0.715 + ca * 0.285 + sa * 0.140, 0.715 - ca * 0.715 + sa * 0.715,
    0.072 - ca * 0.072 + sa * 0.928, 0.072 - ca * 0.072 - sa * 0.283, 0.072 + ca * 0.928 + sa * 0.072
  );
  return m * c;
}

float softLightChannel(float b, float s) {
  if (s < 0.5) return b - (1.0 - 2.0 * s) * b * (1.0 - b);
  float d = (b <= 0.25) ? ((16.0 * b - 12.0) * b + 4.0) * b : sqrt(b);
  return b + (2.0 * s - 1.0) * (d - b);
}

vec3 blendColor(vec3 base, vec3 blend, float mode) {
  if (mode < 1.5) {
    return vec3(
      softLightChannel(base.r, blend.r),
      softLightChannel(base.g, blend.g),
      softLightChannel(base.b, blend.b)
    );
  }
  if (mode < 2.5) {
    vec3 lo = 2.0 * base * blend;
    vec3 hi = 1.0 - 2.0 * (1.0 - base) * (1.0 - blend);
    return mix(lo, hi, step(0.5, base));
  }
  if (mode < 3.5) return base * blend;
  if (mode < 4.5) return min(base, blend);
  if (mode < 5.5) return max(base, blend);
  return 1.0 - (1.0 - base) * (1.0 - blend);
}

void main() {
  vec4 color = texture(u_image, v_texCoord);
  vec3 originalRGB = color.rgb;
  vec3 filtered = color.rgb;

  if (u_presetActive > 0.5) {
    filtered = applyCurves(filtered);
    if (u_pSepia > 0.0) filtered = applySepia(filtered, u_pSepia);
    if (abs(u_pHue) > 0.0001) filtered = applyHueRotate(filtered, u_pHue);
    filtered = setSaturation(filtered, u_pSaturation);
    filtered += u_pColorBalance;

    float lum = dot(clamp(filtered, 0.0, 1.0), LUM_WEIGHTS);
    if (u_pShadowTint.a > 0.0) {
      float mask = pow(1.0 - lum, 1.8) * u_pShadowTint.a;
      filtered = mix(filtered, u_pShadowTint.rgb, mask);
    }
    if (u_pHighlightTint.a > 0.0) {
      float mask = pow(lum, 1.6) * u_pHighlightTint.a;
      filtered = mix(filtered, u_pHighlightTint.rgb, mask);
    }

    if (u_pFade.a > 0.0) {
      float mask = pow(1.0 - lum, 1.2) * u_pFade.a;
      filtered = mix(filtered, u_pFade.rgb, mask);
    }

    filtered = (filtered - 0.5) * u_pContrast + 0.5;
    filtered += u_pBrightness;

    if (u_pBlendMode > 0.5) {
      vec3 blendRGB = mix(u_pBlendBottom.rgb, u_pBlendTop.rgb, v_texCoord.y);
      float blendAmount = mix(u_pBlendBottom.a, u_pBlendTop.a, v_texCoord.y);
      vec3 blended = blendColor(clamp(filtered, 0.0, 1.0), blendRGB, u_pBlendMode);
      filtered = mix(filtered, blended, blendAmount);
    }
  }

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

  color.rgb = mix(originalRGB, filtered, u_filterStrength);

  outColor = color;
}`;
