import waterVertexShader from "../shaders/water/vertex.glsl";
import waterFragmentShader from "../shaders/water/fragment.glsl";

function createWater() {
  // Geometry
  const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

  // Color
  const debugObject = {};
  debugObject.depthColor = "#113e78"; // Deep water color
  debugObject.surfaceColor = "#a584f0"; // Surface color

  // Material
  const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms: {
      uTime: { value: 0 },

      uBigWavesElevation: { value: 0.2 },
      uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
      uBigWavesSpeed: { value: 0.75 },

      uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
      uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
      uColorOffset: { value: 0.08 },
      uColorMultiplier: { value: 1.8 },

      uSmallWavesElevation: { value: 0.15 },
      uSmallWavesFrequency: { value: 3 },
      uSmallWavesSpeed: { value: 0.2 },
      uSmallWavesIterations: { value: 4.0 },
    },
  });

  // Create water mesh
  const water = new THREE.Mesh(waterGeometry, waterMaterial);
  water.name = "water";

  // Set position, rotation, and scale
  water.rotation.x = -Math.PI * 0.3;
  water.rotation.z = Math.PI * 0.8;
  water.position.y = 0;
  water.position.z = -0.5;
  water.scale.set(1.3, 1.3, 1.3);

  // Return the water mesh
  return water;
}
