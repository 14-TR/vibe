// spaceship.js
import * as THREE from "three";

export function createSpaceship() {
    // “Body” of the ship
    const bodyGeom = new THREE.CylinderGeometry(2.5, 1.5, 10, 16, 1, false);
    const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x666666,
        emissive: 0x111111,
        metalness: 0.6,
        roughness: 0.3
    });
    const body = new THREE.Mesh(bodyGeom, bodyMat);

    // Nose cone
    const noseGeom = new THREE.ConeGeometry(2.5, 3, 16);
    const nose = new THREE.Mesh(noseGeom, bodyMat);
    nose.position.y = 6.5;  // attach to top of cylinder

    // Wings (just as an example: two flattened boxes)
    const wingGeom = new THREE.BoxGeometry(0.5, 2, 6);
    const wingMat = new THREE.MeshStandardMaterial({
        color: 0x999999,
        metalness: 0.7,
        roughness: 0.2
    });

    const leftWing = new THREE.Mesh(wingGeom, wingMat);
    leftWing.position.set(-2, 0, 0);

    const rightWing = new THREE.Mesh(wingGeom, wingMat);
    rightWing.position.set(2, 0, 0);

    // Group them together
    const spaceship = new THREE.Group();
    spaceship.add(body, nose, leftWing, rightWing);

    // Rotate to face forward (+Z) if you prefer
    
    spaceship.rotation.x = -Math.PI * 0.5;
    spaceship.position.set(0, 100, 5000);

    return spaceship;
}
