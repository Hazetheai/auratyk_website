// uniform vec3 colorA; 
    // uniform vec3 colorB; 
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec3 u_spectrum;
    uniform vec2 u_mouse;
    varying vec3 vUv;
    bool swap = false;
    vec3 colorA = vec3(0.149,0.141,0.912);
    vec3 colorB = vec3(1.000,0.833,0.224);
    
    float plot (vec2 st, float pct){
      return  smoothstep( pct-0.01, pct, st.y) -
              smoothstep( pct, pct+0.01, st.y);
    }
    
    void main() {
     
      vec2 uv = 2.0 * (gl_FragCoord.xy / u_resolution) - 1.0;
      float col = sin (0.0);
      float i = 1.0;
      float col2 = 0.0;
      float vol = tan(u_spectrum.y*u_spectrum.y*u_time);
      uv.y = abs(uv.y);
      float rotate = uv.y/uv.x +sin(u_time);
       
      if(u_spectrum.y>0.065 || swap){
        swap = true;
        rotate = uv.y/uv.x +sin(u_time/u_spectrum.y);
      }
  
  
      rotate -= uv.x += sin (i*2.0 +vol * cos (5.0 * vol) * u_time + uv.x * .5) *(vol);
      
          col += abs((u_spectrum.x) / rotate) * sin(uv.y/vol)*u_time*vol;
          col += col + col2*uv.y/u_time;
          col2 = sin (col*col2) / 2.;
  
          gl_FragColor = vec4(col, col + col2, col, 1.0);
    }