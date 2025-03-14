// spaceship.js
import * as THREE from "three";

export function createSpaceship() {
    const geometry = new THREE.ConeGeometry(3, 6, 8); // Make it bigger for visibility
    const material = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0x550000,
        metalness: 0.2,
        roughness: 0.5
    });

    const spaceship = new THREE.Mesh(geometry, material);
    spaceship.rotation.set(Math.PI * 0.5, 0, 0); // Face forward
    spaceship.position.set(0, 100, 5000); // Start far from the planet

    return spaceship;
}
