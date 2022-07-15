import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import spaceTexture from "../images/space.jpeg";
import sunTexture from "../images/texture/sun.jpeg";
import earthTexture from "../images/texture/earth.webp";

const renderer = new THREE.WebGLRenderer();
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

camera.position.set(-90, 140, 140);
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

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const earthGeo = new THREE.SphereGeometry(3.2, 30, 30);
const earthMat = new THREE.MeshStandardMaterial({
  map: textureLoader.load(earthTexture),
});
const earth = new THREE.Mesh(earthGeo, earthMat);
sun.add(earth);
earth.position.x = 28;

const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

function animate() {
  sun.rotateY(0.004);
  earth.rotateY(0.004);
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
