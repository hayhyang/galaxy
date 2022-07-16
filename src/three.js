import * as THREE from "three";
import { OrbitControls } from "./lib/controls/OrbitControls";
import { createPlanet } from "./lib/util.js";

import spaceTexture from "./images/space.jpeg";
import sunTexture from "./images/texture/sun.webp";
import earthTexture from "./images/texture/earth.webp";
import moonTexture from "./images/texture/moon.webp";
import mercuryTexture from "./images/texture/mercury.webp";
import venusTexture from "./images/texture/venus.webp";
import saturnTexture from "./images/texture/saturn.webp";
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

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const earth = createPlanet(scene, 3.2, earthTexture, 60);
const mercury = createPlanet(scene, 2, mercuryTexture, 28);
const venus = createPlanet(scene, 7, venusTexture, 100);
const saturn = createPlanet(scene, 10, saturnTexture, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture,
});

const moonGeo = new THREE.SphereGeometry(1, 30, 30);
const moonMat = new THREE.MeshStandardMaterial({
  map: textureLoader.load(moonTexture),
});
const moon = new THREE.Mesh(moonGeo, moonMat);
earth.mesh.add(moon);
moon.position.x = 5;

function animate() {
  sun.rotateY(0.002);
  earth.mesh.rotateY(0.001);
  earth.object.rotateY(0.001);
  mercury.mesh.rotateY(0.004);
  mercury.object.rotateY(0.004);
  venus.mesh.rotateY(0.0008);
  venus.object.rotateY(0.0008);
  saturn.mesh.rotateY(0.0005);
  saturn.object.rotateY(0.0005);
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
