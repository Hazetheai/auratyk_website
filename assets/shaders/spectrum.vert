#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

varying vec2 vUv; 
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vMatCapUV;

uniform float uTime;

void main() {
    vUv = uv; 
    vNormal = normal;
    vPosition = position;


    float displaceWeight = 0.01;


    vec4 p = vec4( position, 1. );

    vec3 e = normalize( vec3( modelViewMatrix * p ) );
    vec3 n = normalize( normalMatrix * normal );

    vec3 r = reflect( e, n );
    float m = 2. * sqrt(
        pow( r.x, 2. ) +
        pow( r.y, 2. ) +
        pow( r.z + 1., 2. )
    );
    vMatCapUV = r.xy / m + .5;


    // displace fragment shader with noise (scaled by Y)
    // Calculate positional noise (Animate with uTime)
    float pN = snoise3(vec3(position.xz * 2., position.y - uTime * displaceWeight));
     // Scale the y position and add an offset
    float displaceIntensity = position.y * 0.4 - 0.5; 
     // Floor the y position (Don't go to negative values)
    if(displaceIntensity <= 0.) displaceIntensity = 0.;
    // Calc displacement
    float displace = pN *  displaceIntensity + 1.;

    vec3 pos = position;
    pos.xz *= displace;


    // vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0); // No Displacement
    vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);

    gl_Position = projectionMatrix * modelViewPosition; 
}