// environment.js
import * as THREE from "three";

/**
 * Add lighting to the scene.
 */
export function addLights(scene) {
    const sunLight = new THREE.DirectionalLight(0xffffff, 3);
    sunLight.position.set(20, 20, 20);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
}

/**
 * Create a large-scale planet.
 */
export function createPlanet(radius = 6371, color = 0x113355) {
    const geometry = new THREE.SphereGeometry(radius, 64, 64);
    const material = new THREE.MeshStandardMaterial({ color });

    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(0, 0, 0); // Planet in center

    return planet;
}

/**
 * Create a starfield background.
 */
export function createStarfield(count = 2000) {
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < count; i++) {
        positions.push((Math.random() - 0.5) * 100000);
        positions.push((Math.random() - 0.5) * 100000);
        positions.push((Math.random() - 0.5) * 100000);
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 50 });
    const stars = new THREE.Points(geometry, material);
    
    return stars;
}
