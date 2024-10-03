uniform vec2 uResolution;
uniform float uSize;
uniform float uTime;

attribute vec3 color;

varying vec3 vColor;
varying vec2 vUv;


void main()
{
    vUv = uv;
    vColor = color;

    vec3 newPos = position;
    vec4 originPos = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    vec4 axis = modelMatrix * vec4(0.0, 1.0, 0.0, 1.0);

    // Final position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    gl_PointSize = uSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);
}