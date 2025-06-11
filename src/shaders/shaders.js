// Vertex shader for particle effects
export const particleVertexShader = `
uniform float uTime;
uniform float uSize;
attribute vec3 aRandomness;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Add some movement based on time and randomness
    modelPosition.x += sin(uTime + aRandomness.x) * 0.1;
    modelPosition.y += cos(uTime + aRandomness.y) * 0.1;
    modelPosition.z += sin(uTime + aRandomness.z) * 0.1;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
    gl_PointSize = uSize * (1.0 / -viewPosition.z);
}
`;

// Fragment shader for particle effects
export const particleFragmentShader = `
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uTime;

void main() {
    // Create circular particles
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 3.0);
    
    // Animate colors
    vec3 color = mix(uColor1, uColor2, sin(uTime) * 0.5 + 0.5);
    
    gl_FragColor = vec4(color, strength);
}
`;

// Vertex shader for geometric shapes
export const geometryVertexShader = `
uniform float uTime;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    vPosition = position;
    vNormal = normal;
    
    vec3 pos = position;
    
    // Add subtle wave deformation
    pos.x += sin(pos.y * 4.0 + uTime) * 0.01;
    pos.y += cos(pos.x * 4.0 + uTime) * 0.01;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

// Fragment shader for geometric shapes
export const geometryFragmentShader = `
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uTime;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    // Create gradient based on position
    float mixFactor = sin(vPosition.x + vPosition.y + uTime) * 0.5 + 0.5;
    vec3 color = mix(uColor1, uColor2, mixFactor);
    
    // Add rim lighting effect
    float fresnel = dot(vNormal, vec3(0.0, 0.0, 1.0));
    fresnel = pow(1.0 - fresnel, 2.0);
    
    color += fresnel * 0.3;
    
    gl_FragColor = vec4(color, 0.8);
}
`;
