import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function initScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background for space

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, -8); // Start behind the ship

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 🌞 Add Lighting to Make Ship Visible
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Soft background glow
    scene.add(ambientLight);

    // 🚀 Spaceship Model
    const geometry = new THREE.ConeGeometry(1, 3, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const spaceship = new THREE.Mesh(geometry, material);
    spaceship.position.y = 1.5;
    spaceship.rotation.set(Math.PI / 2, 0, 0); // Rotate to face forward in Z direction


    scene.add(spaceship);

    // 🛰️ Add Stars for Space Environment
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];

    // 🌌 Generate Initial Stars
    function generateStars(count = 1000) {
        for (let i = 0; i < count; i++) {
            starVertices.push((Math.random() - 0.5) * 2000); // X
            starVertices.push((Math.random() - 0.5) * 2000); // Y
            starVertices.push((Math.random() - 0.5) * 2000); // Z
        }
        starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3));
    }
    generateStars();

    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // 🛰️ Regenerate Stars as the Player Moves
    function updateStars() {
        for (let i = 0; i < starVertices.length; i += 3) {
            if (Math.abs(starVertices[i] - spaceship.position.x) > 1000 ||
                Math.abs(starVertices[i + 1] - spaceship.position.y) > 1000 ||
                Math.abs(starVertices[i + 2] - spaceship.position.z) > 1000) {
                // Reposition faraway stars
                starVertices[i] = spaceship.position.x + (Math.random() - 0.5) * 2000;
                starVertices[i + 1] = spaceship.position.y + (Math.random() - 0.5) * 2000;
                starVertices[i + 2] = spaceship.position.z + (Math.random() - 0.5) * 2000;
            }
        }
        starGeometry.attributes.position.needsUpdate = true;
    }


    // 🚀 Physics Variables
    let velocity = new THREE.Vector3(0, 0, 0);
    let acceleration = new THREE.Vector3(0, 0, 0);
    const thrustPower = 0.02;
    const dampingFactor = 0.99;

    // 🎮 Controls
    const keys = {};
    window.addEventListener("keydown", (event) => keys[event.code] = true);
    window.addEventListener("keyup", (event) => keys[event.code] = false);

    let pitch = 0;
    let yaw = 0;

    // 🖱️ Mouse Movement
    window.addEventListener("mousemove", (event) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        yaw = (event.clientX - centerX) * 0.002;  // Left/Right rotation
        pitch = (event.clientY - centerY) * 0.002; // Up/Down pitch
    });

    function handleMovement() {
        acceleration.set(0, 0, 0);
    
        // 🚀 Thruster Movement
        if (keys["KeyW"]) acceleration.z -= thrustPower;
        if (keys["KeyS"]) acceleration.z += thrustPower;
        if (keys["KeyA"]) acceleration.x -= thrustPower;
        if (keys["KeyD"]) acceleration.x += thrustPower;
        if (keys["Space"]) acceleration.y += thrustPower;
        if (keys["ShiftLeft"]) acceleration.y -= thrustPower;
    
        velocity.add(acceleration);
        velocity.multiplyScalar(dampingFactor);
        spaceship.position.add(velocity);
    
        // 🖱️ Full 360° Mouse Rotation Using Quaternions
        const quaternion = new THREE.Quaternion();
        const pitchQuat = new THREE.Quaternion();
        const yawQuat = new THREE.Quaternion();
    
        // Apply mouse input to Pitch (X) & Yaw (Y)
        pitchQuat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -pitch);
        yawQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -yaw);
    
        // Combine rotations
        quaternion.multiply(yawQuat);
        quaternion.multiply(pitchQuat);
    
        // Apply to spaceship
        spaceship.quaternion.multiplyQuaternions(spaceship.quaternion, quaternion);
    }
    

    function animate() {
        requestAnimationFrame(animate);
        handleMovement();

        // 🎥 Camera Tracking System
        const forwardDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(spaceship.quaternion);

        const camOffset = forwardDirection.clone().multiplyScalar(-10).add(new THREE.Vector3(0, 3, 0));
        camera.position.copy(spaceship.position).add(camOffset);

        // Camera looks ahead in the ship's true movement direction
        camera.lookAt(spaceship.position.clone().add(forwardDirection.multiplyScalar(5)));

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
}
