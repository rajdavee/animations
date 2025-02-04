const terrainVertexShader = `
    uniform float uTime;
    uniform float uMorphFactor;
    
    varying vec2 vUv;
    varying float vElevation;

    float noise(vec2 p) {
        return sin(p.x * 10.0) * sin(p.y * 10.0);
    }

    void main() {
        vUv = uv;
        
        vec3 pos = position;
        float noiseValue = noise(pos.xy + uTime * 0.3);
        float elevation = sin(pos.x * 2.0 + uTime) * cos(pos.z * 2.0 + uTime) * 2.0;
        
        pos.y += mix(noiseValue, elevation, uMorphFactor) * 2.0;
        vElevation = pos.y;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const terrainFragmentShader = `
    varying vec2 vUv;
    varying float vElevation;

    void main() {
        float height = (vElevation + 2.0) * 0.25;
        vec3 color1 = vec3(0.1, 0.3, 0.5);
        vec3 color2 = vec3(0.6, 0.8, 0.9);
        vec3 finalColor = mix(color1, color2, height);
        
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;
