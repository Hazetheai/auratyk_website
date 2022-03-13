#ifdef GL_ES
precision highp float;
#endif

#define NUM_OCTAVES 5

float smoothClamp(float x, float a, float b)
{
    return smoothstep(0., 1., (x - a)/(b - a))*(b - a) + a;
}

float softClamp(float x, float a, float b)
{
    return smoothstep(0., 1., (2./3.)*(x - a)/(b - a) + (1./6.))*(b - a) + a;
}


float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    
    float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
}

float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

float pcurve( float x, float a, float b ){
    float k = pow(a+b,a+b) / (pow(a,a)*pow(b,b));
    return k * pow( x, a ) * pow( 1.0-x, b );
}

float cubicPulse( float c, float w, float x ){
    x = abs(x - c);
    if( x>w ) return 0.0;
    x /= w;
    return 1.0 - x*x*(3.0-2.0*x);
}


uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uSpectrum;
uniform float uSpectrumDamping;
uniform float uWaveIntensity;

uniform sampler2D texture0;


void main(void)
{

    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    float x = gl_FragCoord.x / uResolution.x;
    
///// Gradient /////////////////////
    
    float xCurve = pcurve(x, 9.128, 4.160);
    float xPulse = cubicPulse(0.7, 0.03, x) * .4;
 
    float oscFactor = (uSpectrum.x * 100. * uSpectrumDamping) + uTime;
    float osc = abs( ( sin( oscFactor * .15 ) ));
    float oscillate = softClamp(osc, 0.4, 0.65);
    
    vec4 color = vec4(vec3(mix(xPulse, xCurve, x * osc )), 1.0);
 
///////////////////////////////////

//// Refraction /////////////////////////

    uv.y = 1.0 - uv.y;
    
    float strength = smoothstep(0.5, 1.0, uv.y);
    float waveIntensity = uWaveIntensity;    
    vec2 surface = strength * vec2(
    // run noise over position && mix to normalize fbm output
    mix(-0.3, 0.3, fbm(waveIntensity * uv+uTime * .5)), 
    mix(-0.3, 0.3,fbm(waveIntensity * uv+uTime * .5))
    );
    
    uv += refract(vec2(0.0, 0.0), surface, 1.0 / 1.333);
    
///////////////////////////////////
color *= texture2D(texture0, uv);        
//    color *= vec4(uv.y);

// color = vec4(uSpectrum.x);
//    color.rb += .02;

    gl_FragColor = color;
}