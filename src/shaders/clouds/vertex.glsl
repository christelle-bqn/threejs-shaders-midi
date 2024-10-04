varying vec2 vUv;
varying vec3 vPosition;
uniform float uAspectRatio;

void main(){
    vUv = uv;
    vPosition = position;
    vec2 adjustedPosition = vec2(position.x / uAspectRatio, position.y);
    gl_Position = vec4(adjustedPosition * 2., 0.0, 1.0);
}