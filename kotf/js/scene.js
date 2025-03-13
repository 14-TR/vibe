import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.min.js';

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 🏞️ CREATE GROUND (Battlefield)
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// 🎥 CAMERA SETUP
camera.position.set(0, 50, 80);
camera.lookAt(0, 0, 0);

// 🎮 ADD CONTROLS (Orbit + Zoom + Pan)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth movement
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 20;  // Minimum zoom in
controls.maxDistance = 150; // Maximum zoom out
controls.maxPolarAngle = Math.PI / 2; // Limit vertical movement

// 📏 HANDLE WINDOW RESIZE
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

export { scene, camera, renderer, controls };
