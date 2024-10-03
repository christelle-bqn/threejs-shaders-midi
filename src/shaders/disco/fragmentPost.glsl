uniform sampler2D uTexture;
uniform float uTime;

varying vec3 vColor;
varying vec2 vUv;

float PI = 3.14159265;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main()
{
    vec4 t = texture2D(uTexture, vUv);

    vec2 toCenter = vec2(0.5) - vUv;

    //t += texture2D(uTexture, vUv + toCenter * 0.1);
    vec4 original = texture2D(uTexture, vUv);

    vec4 color = vec4(0.0);
    float total = 0.0;

    for(float i = 0.; i < 30.; i++) {
        float lerp = (i + rand(vec2(gl_FragCoord.xy))) / 30.;
        float weight = sin(lerp * PI);

        vec4 mysample = texture2D(uTexture, vUv + toCenter * lerp * 0.35);
        mysample.rgb *= mysample.a;
        color += mysample * weight;
        total += weight;
    }

    color.a = 1.0;
    color.rgb /= total;

    vec4 finalColor = 1. - (1. - color) * (1. - original);


    gl_FragColor = vec4(toCenter, 0.0, 1.0);
    gl_FragColor = color;
    gl_FragColor = finalColor;

    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

