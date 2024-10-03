import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer, RenderPass } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

import waterVertexShader from "./shaders/water/vertex.glsl";
import waterFragmentShader from "./shaders/water/fragment.glsl";
import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";
import voronoiVertexShader from "./shaders/voronoi/vertex.glsl";
import voronoiFragmentShader from "./shaders/voronoi/fragment.glsl";
import discoVertexShader from "./shaders/disco/vertex.glsl";
import discoFragmentShader from "./shaders/disco/fragment.glsl";
import discoFragmentPostShader from "./shaders/disco/fragmentPost.glsl";
//import Stats from "three/examples/jsm/libs/stats.module.js";

/**
 * Base
 */

// // Stats
// let stats1 = new Stats();
// stats1.showPanel(0); // Panel 0 = fps
// stats1.domElement.style.cssText = "position:absolute;top:0px;left:0px;";
// document.body.appendChild(stats1.domElement);

// let stats2 = new Stats();
// stats2.showPanel(1); // Panel 1 = ms
// stats2.domElement.style.cssText = "position:absolute;top:0px;left:80px;";
// document.body.appendChild(stats2.domElement);

// Debug
const gui = new GUI({ width: 340 });
const debugObject = {};
gui.hide();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// 3D Object
const holder = new THREE.Group();

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Box
 */
// Segments
// let widthSeg = Math.floor(THREE.MathUtils.randInt(5, 20));
// let heightSeg = Math.floor(THREE.MathUtils.randInt(1, 40));
// let depthSeg = Math.floor(THREE.MathUtils.randInt(5, 80));
let widthSeg = 12;
let heightSeg = 10;
let depthSeg = 70;

// Geometry
const geometryBox = new THREE.BoxGeometry(
  1,
  1,
  1,
  widthSeg,
  heightSeg,
  depthSeg
);
const materialBox = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  vertexShader: particlesVertexShader,
  fragmentShader: particlesFragmentShader,
  transparent: true,
  uniforms: {
    uTime: { value: 0 },
    uOffsetSize: { value: 2 },
    uSize: { value: 5.0 },
    uFrequency: { value: 0.1 },
    uAmplitude: { value: 0.8 },
    uOffsetGain: { value: 0.0 },
    uMaxDistance: { value: 1.8 },
  },
});

// Mesh
let pointsMesh = new THREE.Points(geometryBox, materialBox);
pointsMesh.name = "pointsMesh";

// Debug
gui
  .add(materialBox.uniforms.uFrequency, "value")
  .min(0)
  .max(5)
  .step(0.001)
  .name("uFrequency");

gui
  .add(materialBox.uniforms.uAmplitude, "value")
  .min(0)
  .max(2)
  .step(0.001)
  .name("uAmplitude");

gui
  .add(materialBox.uniforms.uOffsetGain, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uOffsetGain");

gui
  .add(materialBox.uniforms.uSize, "value")
  .min(0)
  .max(5)
  .step(0.001)
  .name("uSize");

// Segments Folder
let segmentsFolder = gui.addFolder("Segments");
segmentsFolder.open();

// Segment controls
const segmentControls = {
  width: widthSeg,
  height: heightSeg,
  depth: depthSeg,
};

segmentsFolder
  .add(segmentControls, "width")
  .min(5)
  .max(20)
  .step(1)
  .name("width")
  .onChange(updateGeometry);

segmentsFolder
  .add(segmentControls, "height")
  .min(1)
  .max(40)
  .step(1)
  .name("height")
  .onChange(updateGeometry);

segmentsFolder
  .add(segmentControls, "depth")
  .min(5)
  .max(80)
  .step(1)
  .name("depth")
  .onChange(updateGeometry);

function updateGeometry() {
  holder.remove(pointsMesh);

  widthSeg = segmentControls.width;
  heightSeg = segmentControls.height;
  depthSeg = segmentControls.depth;

  const newGeometry = new THREE.BoxGeometry(
    1,
    1,
    1,
    widthSeg,
    heightSeg,
    depthSeg
  );

  pointsMesh = new THREE.Points(newGeometry, materialBox);

  holder.add(pointsMesh);
}

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

// Color
debugObject.depthColor = "#154a8e"; //"#186691";
debugObject.surfaceColor = "#bfa3ff"; //"#9bd8ff";

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

// Debug
gui
  .add(waterMaterial.uniforms.uBigWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uBigWavesElevation");

gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "x")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uBigWavesFrequencyX");

gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "y")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uBigWavesFrequencyY");

gui
  .add(waterMaterial.uniforms.uBigWavesSpeed, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uBigWavesSpeed");

gui
  .addColor(debugObject, "depthColor")
  .name("depthColor")
  .onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
  });

gui
  .addColor(debugObject, "surfaceColor")
  .name("surfaceColor")
  .onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
  });

gui
  .add(waterMaterial.uniforms.uColorOffset, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uColorOffset");

gui
  .add(waterMaterial.uniforms.uColorMultiplier, "value")
  .min(0)
  .max(5)
  .step(0.001)
  .name("uColorMultiplier");

gui
  .add(waterMaterial.uniforms.uSmallWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uSmallWavesElevation");

gui
  .add(waterMaterial.uniforms.uSmallWavesFrequency, "value")
  .min(0)
  .max(30)
  .step(0.001)
  .name("uSmallWavesFrequency");

gui
  .add(waterMaterial.uniforms.uSmallWavesSpeed, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uSmallWavesSpeed");

gui
  .add(waterMaterial.uniforms.uSmallWavesIterations, "value")
  .min(0)
  .max(5)
  .step(1)
  .name("uSmallWavesIterations");

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.name = "water";

water.rotation.x = -Math.PI * 0.3;
water.rotation.z = Math.PI * 0.8;
water.position.y = 0;
water.position.z = -0.5;
water.scale.set(1.3, 1.3, 1.3);

holder.add(water);

/**
 * Voronoi
 */
const voronoiGeometry = new THREE.PlaneGeometry(4, 4, 32, 32);

// Material
const voronoiMaterial = new THREE.ShaderMaterial({
  vertexShader: voronoiVertexShader,
  fragmentShader: voronoiFragmentShader,
  uniforms: {
    uResolution: new THREE.Uniform(
      new THREE.Vector2(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio
      )
    ),
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0xff004f) },
    uVoronoiScale: { value: 3.0 },
    uWaveFrequency: { value: 0.0 },
    uWaveAmplitude: { value: 0.0 },
    uRotationAngle: { value: 0.0 },
  },
  transparent: true,
  side: THREE.DoubleSide,
});

// Mesh
const voronoi = new THREE.Mesh(voronoiGeometry, voronoiMaterial);
voronoi.name = "voronoi";

/**
 * Disco
 */

//Postprocessing
const baseTexture = new THREE.WebGLRenderTarget(sizes.width, sizes.height, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat,
});

const materialOrtho = new THREE.ShaderMaterial({
  extensions: {
    derivatives: "#extension GL_OES_standard_derivatives : enable",
  },
  vertexShader: discoVertexShader,
  fragmentShader: discoFragmentPostShader,
  uniforms: {
    uTexture: {
      value: null,
    },
  },
  side: THREE.DoubleSide,
});

const meshOrtho = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), materialOrtho);

const sceneOrtho = new THREE.Scene();
sceneOrtho.add(meshOrtho);

let frustumSize = 1;
let aspect = 1;

const postCamera = new THREE.OrthographicCamera(
  (frustumSize * aspect) / -2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  frustumSize / -2,
  -1000,
  1000
);

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(sceneOrtho, postCamera);
composer.addPass(renderPass);

/**
 * Disco
 */
const disco = {};

// Geometry
disco.geometry = new THREE.SphereGeometry(0.5, 30, 30);

// Textures
const logoTextureOriginal = new THREE.TextureLoader().load(
  "/images/logo_66Origin_fill_white_multiple.png",
  (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;

    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    texture.anisotropy = 0;

    texture.needsUpdate = true;
  }
);

const logoTextureOutine = new THREE.TextureLoader().load(
  "/images/logo_66Origin_strokeS_white_multiple.png",
  (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;

    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    texture.anisotropy = 0;

    texture.needsUpdate = true;
  }
);

const logoTextureMultiColors = new THREE.TextureLoader().load(
  "/images/logo_66Origin_fill_multicolors_multiple.png",
  (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;

    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    texture.anisotropy = 0;

    texture.needsUpdate = true;
  }
);

// Material
disco.material = new THREE.ShaderMaterial({
  vertexShader: discoVertexShader,
  fragmentShader: discoFragmentShader,
  uniforms: {
    uSize: new THREE.Uniform(0.4),
    uResolution: new THREE.Uniform(
      new THREE.Vector2(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio
      )
    ),
    uTime: { value: 0 },
    uTexture: { value: logoTextureOriginal },
    uColor: { value: new THREE.Color(0xff004f) },
    uAmplitude: { value: 0.5 },
    uSpeed: { value: 1.0 },
  },

  //   blending: THREE.CustomBlending,
  //   blendingEquation: THREE.MaxEquation,
  transparent: true,
  side: THREE.DoubleSide,
});

// Points
const discoball = new THREE.Mesh(disco.geometry, disco.material);
discoball.rotation.z = -Math.PI * 0.1;
discoball.scale.set(1.5, 1.5, 1.5);
discoball.position.y = -0.1;
discoball.name = "disco";

scene.add(holder);

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 2.3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * MIDI
 */

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
  console.log("MIDI access obtained");
  for (var input of midiAccess.inputs.values()) {
    input.onmidimessage = getMIDIMessage;
  }
}

function updateGeometryMIDI(newWidthSeg, newHeightSeg, newDepthSeg) {
  holder.remove(pointsMesh);

  console.log(newWidthSeg, newHeightSeg, newDepthSeg);

  const newGeometry = new THREE.BoxGeometry(
    1,
    1,
    1,
    newWidthSeg,
    newHeightSeg,
    newDepthSeg
  );

  pointsMesh = new THREE.Points(newGeometry, materialBox);
  pointsMesh.rotation.y = rotationY;
  pointsMesh.rotation.x = rotationX;

  pointsMesh.name = "pointsMesh";

  holder.add(pointsMesh);
}

function mapVelocityToRange(velocity, min, max) {
  return Math.floor(min + (max - min) * (velocity / 127));
}

let rotationY;
let rotationX;

function getMIDIMessage(message) {
  var command = message.data[0];
  var note = message.data[1];
  var velocity = message.data.length > 2 ? message.data[2] : 0;

  // Handle knobs (Control Change messages)
  if (command === 176) {
    if (holder.children[0].name === "water") {
      console.log("WATER");
      switch (note) {
        case 1: // Knob 1
          waterMaterial.uniforms.uBigWavesElevation.value = Math.min(
            1,
            (velocity / 127) * 0.5
          );
          break;

        case 2: // Knob 2
          waterMaterial.uniforms.uSmallWavesElevation.value = Math.min(
            1,
            (velocity / 127) * 0.5
          );

          waterMaterial.uniforms.uSmallWavesFrequency.value = Math.min(
            2,
            (velocity / 127) * 4
          );
          break;
      }
    } else if (holder.children[0].name === "voronoi") {
      switch (note) {
        case 1: // Knob 1
          voronoiMaterial.uniforms.uVoronoiScale.value = Math.min(
            25.0,
            Math.max(3.0, (velocity / 127) * 25)
          );
          break;

        case 2: // Knob 2
          voronoiMaterial.uniforms.uWaveFrequency.value = Math.min(
            10.0,
            (velocity / 127) * 10
          );

          voronoiMaterial.uniforms.uWaveAmplitude.value = Math.min(
            1.0,
            velocity / 127
          );
          break;
      }
    } else if (holder.children[0].name === "pointsMesh") {
      switch (note) {
        case 1: // Knob 1
          materialBox.uniforms.uFrequency.value =
            Math.max(0.05, velocity / 127) * 2;
          break;

        case 2: // Knob 2
          materialBox.uniforms.uOffsetGain.value = (velocity / 127) * 1;

          materialBox.uniforms.uAmplitude.value = Math.max(
            0.8,
            (velocity / 127) * 2
          );
          break;
      }
    } else if (holder.children[0].name === "disco") {
      switch (note) {
        case 1: // Knob 1
          targetSpeedMultiplier = Math.max(2, (velocity / 127) * 8);
          break;
      }
    }

    materialBox.needsUpdate = true;
    waterMaterial.needsUpdate = true;
    voronoiMaterial.needsUpdate = true;
    disco.material.needsUpdate = true;
    renderer.render(scene, camera);
  } else if (command === 144 && velocity > 0) {
    const clear = () => {
      geometryBox.dispose();
      materialBox.dispose();
      waterGeometry.dispose();
      waterMaterial.dispose();
      voronoiGeometry.dispose();
      voronoiMaterial.dispose();
      disco.geometry.dispose();
      disco.material.dispose();
      composer.dispose();
      renderer.setRenderTarget(null);
      holder.clear();
    };

    switch (note) {
      case 40: // Pad 5
        clear();
        holder.add(water);
        break;

      case 41: // Pad 6
        clear();
        holder.add(pointsMesh);
        break;

      case 42: // Pad 7
        clear();
        holder.add(voronoi);
        break;

      case 43: // Pad 8
        clear();
        holder.add(discoball);
        break;
    }

    if (holder.children[0].name === "voronoi") {
      switch (note) {
        case 36: // Pad 1
          let darkRed = Math.random() * 0.3;
          let darkGreen = Math.random() * 0.3;
          let darkBlue = Math.random() * 0.3;

          voronoiMaterial.uniforms.uColor.value = new THREE.Color(
            darkRed,
            darkGreen,
            darkBlue
          );
          break;
      }
    } else if (holder.children[0].name === "pointsMesh") {
      switch (note) {
        case 36: // Pad 1
          console.log("PAD 1");
          widthSeg = mapVelocityToRange(velocity * 5, 5, 20);
          updateGeometryMIDI(widthSeg, heightSeg, depthSeg);
          break;

        case 37: // Pad 2
          console.log("PAD 2");
          heightSeg = mapVelocityToRange(velocity, 1, 40);
          updateGeometryMIDI(widthSeg, heightSeg, depthSeg);
          break;

        case 38: // Pad 3
          console.log("PAD 3");
          depthSeg = mapVelocityToRange(velocity * 5, 5, 80);
          updateGeometryMIDI(widthSeg, heightSeg, depthSeg);
          break;
      }
    } else if (holder.children[0].name === "water") {
    } else if (holder.children[0].name === "disco") {
      switch (note) {
        case 36: // Pad 1
          disco.material.uniforms.uColor.value = new THREE.Color(0xff004f);
          disco.material.uniforms.uTexture.value = logoTextureOriginal;
          break;

        case 37: // Pad 2
          disco.material.uniforms.uColor.value = new THREE.Color(0xff004f);
          disco.material.uniforms.uTexture.value = logoTextureOutine;
          break;

        case 38: // Pad 3
          disco.material.uniforms.uColor.value = new THREE.Color(0xffffff);
          disco.material.uniforms.uTexture.value = logoTextureMultiColors;
          break;

        case 39: // Pad 4
          disco.material.uniforms.uColor.value = new THREE.Color(
            Math.random(),
            Math.random(),
            Math.random()
          );
          break;
      }
    }

    waterMaterial.needsUpdate = true;
    materialBox.needsUpdate = true;
    voronoiMaterial.needsUpdate = true;
    disco.material.needsUpdate = true;

    renderer.render(scene, camera);
  }
}

function onMIDIFailure() {
  console.log("Could not access your MIDI devices.");
}

const lerp = (start, end, alpha) => start * (1 - alpha) + end * alpha;

let targetSpeedMultiplier = 2;
let currentSpeedMultiplier = 2;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // // Stats
  // stats1.update();
  // stats2.update();

  // Update water
  waterMaterial.uniforms.uTime.value = elapsedTime;
  materialBox.uniforms.uTime.value = elapsedTime;

  // Update points
  pointsMesh.rotation.y += 0.004;
  rotationY = pointsMesh.rotation.y;

  pointsMesh.rotation.x += 0.002 * Math.sin(elapsedTime * 0.2);
  rotationX = pointsMesh.rotation.x;

  // Update voronoi
  voronoiMaterial.uniforms.uTime.value = elapsedTime;

  // Update disco
  disco.material.uniforms.uTime.value = elapsedTime;

  currentSpeedMultiplier = lerp(
    currentSpeedMultiplier,
    targetSpeedMultiplier,
    0.1
  );

  discoball.rotation.y = -elapsedTime * 0.1 * currentSpeedMultiplier;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  if (holder.children[0].name === "disco") {
    renderer.setRenderTarget(baseTexture);
    materialOrtho.uniforms.uTexture.value = baseTexture.texture;
    composer.render();
  }

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
