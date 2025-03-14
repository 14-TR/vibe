// scene.js
import * as THREE from "three";
import { FlyControls } from "three/examples/jsm/controls/FlyControls.js";
import { createSpaceship } from "./spaceship.js";
import { createPlanet, createStarfield, addLights } from "./environment.js";

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
    const planet = createPlanet(1000, 0x113355);
    scene.add(planet);

    const stars = createStarfield(2000);
    scene.add(stars);

    // OUR VISUAL SPACESHIP MESH
    const spaceship = createSpaceship();
    scene.add(spaceship);

    // FLY CONTROLS for the CAMERA
    const controls = new FlyControls(camera, renderer.domElement);

    // === BOOST VARIABLES ===
    let baseSpeed = 300;     // normal speed
    let boostSpeed = 1500;   // boosted speed
    let isBoosting = false;
    let mouseDown = false;
    let keyWDown = false;

    // Initialize movement speed
    controls.movementSpeed = baseSpeed;
    controls.rollSpeed = Math.PI / 24;
    controls.dragToLook = false;

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
    });
    window.addEventListener("keyup", (event) => {
        if (event.code === "KeyW") {
            keyWDown = false;
            disableBoost();
        }
    });

    // ANIMATION LOOP
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        // Update camera movement via FlyControls
        controls.update(delta);

        // LOCK SPACESHIP IN FRONT/BELOW CAMERA
        const offset = new THREE.Vector3(0, -8, -25);
        offset.applyQuaternion(camera.quaternion);
        spaceship.position.copy(camera.position).add(offset);
        spaceship.quaternion.copy(camera.quaternion);

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
