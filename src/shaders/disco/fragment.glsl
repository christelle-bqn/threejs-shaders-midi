uniform sampler2D uTexture;
uniform float uTime;
uniform vec3 uColor;

varying vec3 vColor;
varying vec2 vUv;

void main()
{
    vec2 repeat = vec2(6., 4.);
    vec2 uv = fract(vUv * repeat);
    vec2 toCenter = vec2(0.5) - vUv;

    vec4 textureColor = texture2D(uTexture, uv);

    vec3 tintedColor = textureColor.rgb * uColor;

    gl_FragColor = vec4(tintedColor, textureColor.a);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
