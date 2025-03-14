// environment.js
import * as THREE from "three";

/**
 * Adds directional + ambient lights.
 */
export function addLights(scene) {
    const sunLight = new THREE.DirectionalLight(0xffffff, 2);
    sunLight.position.set(50, 50, 50);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
}

/**
 * Creates a large sphere planet (radius 1000, for example).
 */
export function createPlanet(radius = 1000, color = 0x113355) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(0, 0, 0);
    return planet;
}

/**
 * Creates a simple starfield using random points.
 */
export function createStarfield(count = 1000) {
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < count; i++) {
        positions.push((Math.random() - 0.5) * 50000);
        positions.push((Math.random() - 0.5) * 50000);
        positions.push((Math.random() - 0.5) * 50000);
    }

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 50 });
    const stars = new THREE.Points(geometry, material);
    return stars;
}
