// scene.js
import * as THREE from "three";
import { FlyControls } from "three/examples/jsm/controls/FlyControls.js";
import { createSpaceship } from "./spaceship.js";
import { createPlanet, createStarfield, addLights } from "./environment.js";

export function initScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // CAMERA SETUP
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.set(0, 100, 5000); // Start far away

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // LIGHTING
    addLights(scene);

    // SPACESHIP
    const spaceship = createSpaceship();
    scene.add(spaceship);

    // PLANET
    const planet = createPlanet();
    scene.add(planet);

    // STARFIELD
    const stars = createStarfield();
    scene.add(stars);

    // ✅ FLY CONTROLS ✅
    const controls = new FlyControls(camera, renderer.domElement);
    let baseSpeed = 1000; // Normal movement speed
    let boostSpeed = 5000; // Speed when boosting
    let isBoosting = false;
    controls.movementSpeed = baseSpeed;
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = false;

    let clock = new THREE.Clock(); // Used for smooth movement

    // ✅ TRACKING BOOST ✅
    let mouseDown = false;
    let keyWDown = false;

    // Mouse events to track click status
    window.addEventListener("mousedown", () => {
        mouseDown = true;
        if (keyWDown) enableBoost();
    });
    window.addEventListener("mouseup", () => {
        mouseDown = false;
        disableBoost();
    });

    // Keyboard events to track 'W' press
    window.addEventListener("keydown", (event) => {
        if (event.code === "KeyW") {
            keyWDown = true;
            if (mouseDown) enableBoost();
        }
    });
    window.addEventListener("keyup", (event) => {
        if (event.code === "KeyW") {
            keyWDown = false;
            disableBoost();
        }
    });

    // Enable Boost
    function enableBoost() {
        if (!isBoosting) {
            console.log("%c 🚀 BOOST ACTIVATED!", "color: yellow; font-weight: bold;");
            controls.movementSpeed = boostSpeed;
            isBoosting = true;
        }
    }

    // Disable Boost
    function disableBoost() {
        if (isBoosting) {
            console.log("%c 🛑 BOOST ENDED", "color: cyan;");
            controls.movementSpeed = baseSpeed;
            isBoosting = false;
        }
    }

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        controls.update(delta);

        renderer.render(scene, camera);
    }

    animate();

    // Handle Window Resize
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
