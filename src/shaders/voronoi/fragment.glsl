#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;  
uniform float uTime;   
uniform vec3 uColor;
uniform float uVoronoiScale;
uniform float uWaveFrequency;
uniform float uWaveAmplitude;

#include "lygia/space/ratio.glsl"       
#include "lygia/generative/voronoi.glsl"

void main(void) {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y; 

    vec3 color = vec3(0.0, 0.0, 0.0);

    float wave = sin(st.x * uWaveFrequency + uTime) * uWaveAmplitude;
    st.y += wave;

    vec3 voronoiColor = voronoi(st * uVoronoiScale, uTime * 0.2); 

    float distanceToCellEdge = length(voronoiColor - vec3(0.5, 0.5, 0.5));

    float borderWidth = 0.5; 
    vec3 borderColor = vec3(1.);

    float border = smoothstep(0.0, borderWidth, distanceToCellEdge);

    color = mix(borderColor, voronoiColor, border);

    float grayscale = dot(color, vec3(0.299, 0.587, 0.114));

    gl_FragColor = vec4(vec3(grayscale) + uColor, 1.0);
}
