#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vMatCapUV;

uniform sampler2D  uMatCap;
uniform float uSpecterSize;
uniform float  uTime;
uniform float  uWaveBorderSize;
uniform float  uWaveSpeed;
uniform vec3  uBorderColor;

void main() {
    float nPeriod = 2.;         // 2.
    float maskTop = 1.;         // 1.
    float waveFreq = 5.;       // 5.
    float waveTimeDamping = .5; // .5
    float nExponent = .1;       // .1

    // Create noise Fn  
    float n3 = snoise3(vec3(vPosition.xz * nPeriod, uTime * nExponent)) * waveTimeDamping;

    // Create Wave size
    float wave = sin(vPosition.y * waveFreq - uTime * uWaveSpeed);

    // Mask the noise with the wave
    float mcMask = step(wave, n3 - uSpecterSize);


    // Create mask to sub from existing wave (Same as mcMask)
    float borderMask = step(wave, n3 - uSpecterSize);
    // Offset size of border
    borderMask -= step(wave, n3 - (uSpecterSize + uWaveBorderSize));
    // Apply color from uniform
    vec4 borderOut = vec4(uBorderColor * borderMask, borderMask);


    // Use the Matcap texture and apply UVs from vert shader
    vec4 matCap = texture2D(uMatCap, vMatCapUV);
    // Use the noise mask on the matcap texture
    vec4 matCapOut = vec4(matCap.xyz, mcMask);


    // Opacity Mask => Uses zero position set in model (Blender) to use y as UV
    float opMask = maskTop - vPosition.y;
    // +/- to see difference
    opMask *= 0.15;
    opMask += 0.5;
    vec4 opMaskOut = vec4(1., 1., 1., opMask);

    vec4 col = matCapOut + borderOut;
    col *= opMaskOut;

    // View only wave
    // gl_FragColor = vec4(matCapOut);
    // View Only mask
    // gl_FragColor = vec4(vec3(mcMask), 1.);
    // View the Border Mask
    // gl_FragColor = vec4(vec3(borderMask), 1.);
    // View the Border Color
    // gl_FragColor = vec4(borderOut);


    // // Visualize the vertex displacement (spectrum.vert) **
    // // Scale the y position and add an offset
    // float yPos = vPosition.y * 0.2 - 0.4;
    // // Floor the y position (Don't go to negative values)
    // if(yPos <= 0.) yPos = 0.;
    // col = vec4(yPos);
    // gl_FragColor = vec4(col.rgb, 1.);



    gl_FragColor = vec4(col);
}