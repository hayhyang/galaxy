import * as THREE from "three";
import { OrbitControls } from "./lib/controls/OrbitControls";
import { createPlanet } from "./lib/util.js";

import spaceTexture from "./images/space.jpeg";
import sunTexture from "./images/texture/sun.webp";
import mercuryTexture from "./images/texture/mercury.webp";
import venusTexture from "./images/texture/venus.webp";
import earthTexture from "./images/texture/earth.webp";
import marsTexture from "./images/texture/mars.webp";
import jupiterTexture from "./images/texture/jupiter.webp";
import saturnTexture from "./images/texture/saturn.webp";
import uranusTexture from "./images/texture/uranus.webp";
import neptuneTexture from "./images/texture/neptune.webp";
import moonTexture from "./images/texture/moon.webp";
import saturnRingTexture from "./images/texture/saturn_ring.png";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-45, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  spaceTexture,
  spaceTexture,
  spaceTexture,
  spaceTexture,
  spaceTexture,
  spaceTexture,
]);
const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

const textureLoader = new THREE.TextureLoader();

const vertexShader = () => {
  return `
    varying vec2 vUv; 

    void main() {
      vUv = uv; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `;
};

const fragmentShader = () => {
  return `
    uniform sampler2D texture1; 
    uniform sampler2D texture2; 
    varying vec2 vUv;

    void main() {
      vec4 color1 = texture2D(texture1, vUv);
      vec4 color2 = texture2D(texture2, vUv);
      gl_FragColor = mix(color1, color2, vUv.y);
    }
  `;
};

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.ShaderMaterial({
  uniforms: {
    globeTexture: {
      value: textureLoader.load(sunTexture),
    },
  },
  fragmentShader: fragmentShader(),
  vertexShader: vertexShader(),
});
// const sunMat = new THREE.MeshBasicMaterial({
//   map: textureLoader.load(sunTexture),
// });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const atmosphere = new THREE.Mesh(
  sunGeo,
  new THREE.ShaderMaterial({
    fragmentShader: fragmentShader(),
    vertexShader: vertexShader(),
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  })
);
atmosphere.scale.set(1.1, 1.1, 1.1);
scene.add(atmosphere);

// const atmosphere = new THREE.ShaderMaterial({
//   uniforms: {
//     globeTexture: {
//       value: textureLoader.load(sunTexture),
//     },
//   },
//   fragmentShader: fragmentShader(),
//   vertexShader: vertexShader(),
// });
// scene.add(atmosphere);

const mercury = createPlanet(scene, 0.4, mercuryTexture, 28);
const venus = createPlanet(scene, 0.9, venusTexture, 35);
const earth = createPlanet(scene, 1, earthTexture, 50);
const mars = createPlanet(scene, 0.5, marsTexture, 65);
const jupiter = createPlanet(scene, 11.2, jupiterTexture, 90);
const saturn = createPlanet(scene, 9.4, saturnTexture, 125, {
  innerRadius: 10,
  outerRadius: 15,
  texture: saturnRingTexture,
});
const uranus = createPlanet(scene, 4, uranusTexture, 160);
const neptune = createPlanet(scene, 3.9, neptuneTexture, 190);

const moonGeo = new THREE.SphereGeometry(1, 30, 30);
const moonMat = new THREE.MeshStandardMaterial({
  map: textureLoader.load(moonTexture),
});
const moon = new THREE.Mesh(moonGeo, moonMat);
earth.mesh.add(moon);
moon.position.x = 5;

function animate() {
  sun.rotateY(0.002);
  mercury.mesh.rotateY(0.004);
  mercury.object.rotateY(0.001);
  venus.mesh.rotateY(0.0008);
  venus.object.rotateY(0.0008);
  earth.mesh.rotateY(0.001);
  earth.object.rotateY(0.001);
  mars.mesh.rotateY(0.001);
  mars.object.rotateY(0.001);
  jupiter.mesh.rotateY(0.001);
  jupiter.object.rotateY(0.0008);
  saturn.mesh.rotateY(0.0005);
  saturn.object.rotateY(0.0002);
  uranus.mesh.rotateY(0.0005);
  uranus.object.rotateY(0.0005);
  neptune.mesh.rotateY(0.0005);
  neptune.object.rotateY(0.00005);
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
