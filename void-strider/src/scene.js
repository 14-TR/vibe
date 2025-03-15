// scene.js
import * as THREE from "three";
import { FlyControls } from "three/examples/jsm/controls/FlyControls.js";
import { createSpaceship } from "./spaceship.js";
import { createPlanet, createStarfield, addLights, createCelestialGenerator } from "./environment.js";

export function initScene() {
    // SCENE + CAMERA
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        100000
    );
    camera.position.set(0, 50, 500);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // LIGHTS, PLANET, STARS
    addLights(scene);
    
    // Create procedural starfield
    const stars = createStarfield();
    scene.add(stars);
    
    // Initialize celestial object generator
    const celestialGenerator = createCelestialGenerator(scene);

    // OUR VISUAL SPACESHIP MESH
    const spaceship = createSpaceship();
    scene.add(spaceship);

    // FLY CONTROLS for the CAMERA
    const controls = new FlyControls(camera, renderer.domElement);

    // === BOOST VARIABLES ===
    let baseSpeed = 3000;     // normal speed
    let boostSpeed = 150000;   // boosted speed
    let isBoosting = false;
    let mouseDown = false;
    let keyWDown = false;

    // Initialize movement speed
    controls.movementSpeed = baseSpeed;
    controls.rollSpeed = Math.PI / 24;
    controls.dragToLook = false;

    // Variables to track rotation for banking
    let previousCameraQuaternion = new THREE.Quaternion().copy(camera.quaternion);
    let rotationDelta = new THREE.Quaternion();
    let rollAmount = 0;
    let pitchAmount = 0;
    
    // Simplified banking variables
    let isTurningLeft = false;
    let isTurningRight = false;
    
    // Mouse movement tracking for banking
    let lastMouseX = 0;
    let mouseMovementX = 0;
    const MOUSE_MOVEMENT_THRESHOLD = 2; // Minimum mouse movement to trigger banking
    
    // Track mouse movement directly using the mousemove event
    document.addEventListener("mousemove", function(event) {
        // Track mouse movement for banking
        if (lastMouseX !== 0) {
            mouseMovementX = event.movementX || event.clientX - lastMouseX;
        }
        lastMouseX = event.clientX;
        
        // Reset movement after a short delay (when mouse stops)
        setTimeout(() => {
            mouseMovementX = 0;
        }, 100);
    });

    // BOOST HELPER FUNCTIONS
    function enableBoost() {
        if (!isBoosting) {
            console.log("🚀 BOOST ACTIVATED!");
            controls.movementSpeed = boostSpeed;
            isBoosting = true;
        }
    }

    function disableBoost() {
        if (isBoosting) {
            console.log("🛑 BOOST ENDED");
            controls.movementSpeed = baseSpeed;
            isBoosting = false;
        }
    }

    // MOUSE events
    window.addEventListener("mousedown", () => {
        mouseDown = true;
        if (keyWDown) enableBoost();
    });
    window.addEventListener("mouseup", () => {
        mouseDown = false;
        disableBoost();
    });

    // KEYBOARD events
    window.addEventListener("keydown", (event) => {
        if (event.code === "KeyW") {
            keyWDown = true;
            if (mouseDown) enableBoost();
        }
        // Track turning for banking
        if (event.code === "KeyA" || event.code === "ArrowLeft") {
            isTurningLeft = true;
            isTurningRight = false;
        }
        if (event.code === "KeyD" || event.code === "ArrowRight") {
            isTurningRight = true;
            isTurningLeft = false;
        }
    });
    window.addEventListener("keyup", (event) => {
        if (event.code === "KeyW") {
            keyWDown = false;
            disableBoost();
        }
        // Reset turning state
        if (event.code === "KeyA" || event.code === "ArrowLeft") {
            isTurningLeft = false;
        }
        if (event.code === "KeyD" || event.code === "ArrowRight") {
            isTurningRight = false;
        }
    });

    // ANIMATION LOOP
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        // Update camera movement via FlyControls
        controls.update(delta);

        // Update procedural starfield based on camera position
        stars.updateStarfield(camera);
        
        // Update celestial objects (planets, nebulas, black holes)
        celestialGenerator.update(camera);

        // Calculate rotation change since last frame to detect mouse turning
        rotationDelta.copy(previousCameraQuaternion).invert().multiply(camera.quaternion);
        previousCameraQuaternion.copy(camera.quaternion);
        const euler = new THREE.Euler().setFromQuaternion(rotationDelta, 'XYZ');
        
        // Use mouse movement directly for banking detection
        // This is more reliable than trying to detect camera rotation
        let turnDirection = 0;
        
        // First check keyboard input
        if (isTurningLeft) {
            turnDirection = 1; // Left turn
        } else if (isTurningRight) {
            turnDirection = -1; // Right turn
        } 
        // Then check mouse movement if no keyboard input
        else if (Math.abs(mouseMovementX) > MOUSE_MOVEMENT_THRESHOLD) {
            turnDirection = Math.sign(mouseMovementX);
        }
        
        // Set roll amount based on turn direction
        rollAmount = turnDirection;
        
        // Apply banking to the spaceship
        spaceship.bank(rollAmount, 0);

        // LOCK SPACESHIP IN FRONT/BELOW CAMERA
        const offset = new THREE.Vector3(0, -5, -25);
        offset.applyQuaternion(camera.quaternion);
        spaceship.position.copy(camera.position).add(offset);
        
        // Copy camera quaternion
        spaceship.quaternion.copy(camera.quaternion);
        
        // Apply fixed banking on top of camera rotation
        if (rollAmount !== 0) {
            const bankAngle = Math.sign(rollAmount) * (Math.PI / 72); // 2.5 degrees
            const bankEuler = new THREE.Euler(0, 0, bankAngle, 'XYZ');
            const bankQuaternion = new THREE.Quaternion().setFromEuler(bankEuler);
            spaceship.quaternion.multiply(bankQuaternion);
        }

        // RENDER
        renderer.render(scene, camera);
    }
    animate();

    // HANDLE RESIZE
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
