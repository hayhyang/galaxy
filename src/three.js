import * as THREE from "../node_modules/three/build/three.module.js";
import { OrbitControls } from "./OrbitControls";
import { createPlanet } from "./lib/util";
import { Shaders } from "./shader";

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

export const scene = new THREE.Scene();
export const textureLoader = new THREE.TextureLoader();

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

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const atmosphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    c: { type: "f", value: 0.7 },
    p: { type: "f", value: 5.0 },
  },
  vertexShader: Shaders.atmosphere.vertexShader,
  fragmentShader: Shaders.atmosphere.fragmentShader,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
  transparent: true,
});
const atm = new THREE.Mesh(sunGeo, atmosphereMaterial);
atm.scale.set(1.3, 1.3, 1.3);
scene.add(atm);

const mercury = createPlanet(0.4, mercuryTexture, 28);
const venus = createPlanet(0.9, venusTexture, 35);
const earth = createPlanet(1, earthTexture, 50);
const mars = createPlanet(0.5, marsTexture, 65);
const jupiter = createPlanet(11.2, jupiterTexture, 90);
const saturn = createPlanet(9.4, saturnTexture, 125, {
  innerRadius: 10,
  outerRadius: 15,
  texture: saturnRingTexture,
});
const uranus = createPlanet(4, uranusTexture, 160);
const neptune = createPlanet(3.9, neptuneTexture, 190);

const moonGeo = new THREE.SphereGeometry(0.25, 30, 30);
const moonMat = new THREE.MeshStandardMaterial({
  map: textureLoader.load(moonTexture),
});
const moon = new THREE.Mesh(moonGeo, moonMat);
earth.mesh.add(moon);
moon.position.x = 2;

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
