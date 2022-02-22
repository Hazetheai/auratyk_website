#ifdef GL_ES
precision highp float;
#endif

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uSpectrum;

uniform sampler2D texture0;

void main(void)
{
    vec2 uv = 2.0 * (gl_FragCoord.xy / uResolution) - 1.0;
    gl_FragColor = vec4(
        abs(sin(cos(uTime+3.*uv.y)*2.*uv.x+uTime)),
        abs(cos(sin(uTime+2.*uv.x)*3.*uv.y+uTime)),
        uSpectrum.x * 100.,
        1.0);
}