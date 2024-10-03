#ifdef GL_ES
precision highp float;
#endif

uniform float uRotationAngle;

varying vec3 vPosition;
varying vec2 vTextCoord;

void main() {
    vTextCoord = uv;
    vPosition = position;

    float angle = uRotationAngle; 
    mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));

    vTextCoord = rotationMatrix * vTextCoord;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}