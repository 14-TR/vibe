// spaceship.js
import * as THREE from "three";

export function createSpaceship() {
    // Create a group for the entire spaceship
    const spaceship = new THREE.Group();
    
    // Main body - triangular shape
    const bodyShape = new THREE.Shape();
    // Start at the nose
    bodyShape.moveTo(0, 8);
    // Draw the triangular body (right side)
    bodyShape.lineTo(4, -6);
    // Draw the back
    bodyShape.lineTo(-4, -6);
    // Close the shape
    bodyShape.lineTo(0, 8);
    
    const bodyExtrudeSettings = {
        steps: 1,
        depth: 0.8,
        bevelEnabled: true,
        bevelThickness: 0.3,
        bevelSize: 0.2,
        bevelSegments: 3
    };
    
    const bodyGeom = new THREE.ExtrudeGeometry(bodyShape, bodyExtrudeSettings);
    const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x3B4252,
        emissive: 0x2E3440,
        metalness: 0.8,
        roughness: 0.2
    });
    
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    // Rotate the body to be flat on the XZ plane (pointing forward along Z)
    body.rotation.x = -Math.PI / 2;
    
    // Wings - more angular and integrated with the triangular design
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(8, -2);
    wingShape.lineTo(6, -4);
    wingShape.lineTo(0, -1);
    wingShape.lineTo(0, 0);
    
    const wingExtrudeSettings = {
        steps: 1,
        depth: 0.3,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 2
    };
    
    const wingGeom = new THREE.ExtrudeGeometry(wingShape, wingExtrudeSettings);
    const wingMat = new THREE.MeshStandardMaterial({
        color: 0x5E81AC,
        metalness: 0.7,
        roughness: 0.3
    });
    
    const leftWing = new THREE.Mesh(wingGeom, wingMat);
    leftWing.rotation.x = -Math.PI / 2;
    leftWing.position.set(-0.4, 0, 0.4);
    
    const rightWing = new THREE.Mesh(wingGeom, wingMat);
    rightWing.rotation.x = -Math.PI / 2;
    rightWing.position.set(-0.4, 0, -0.4);
    rightWing.scale.z = -1; // Mirror the wing
    
    // Add engine thrusters
    const thrusterGeom = new THREE.CylinderGeometry(0.6, 0.8, 1.5, 16);
    const thrusterMat = new THREE.MeshStandardMaterial({
        color: 0x4C566A,
        emissive: 0xBF616A,
        metalness: 0.7,
        roughness: 0.3
    });
    
    const leftThruster = new THREE.Mesh(thrusterGeom, thrusterMat);
    leftThruster.position.set(-1.5, -0.5, -5.5);
    
    const rightThruster = new THREE.Mesh(thrusterGeom, thrusterMat);
    rightThruster.position.set(1.5, -0.5, -5.5);
    
    const centerThruster = new THREE.Mesh(thrusterGeom, thrusterMat);
    centerThruster.position.set(0, -0.5, -5.5);
    centerThruster.scale.set(1.2, 1.2, 1.2); // Slightly larger center thruster
    
    // Add thruster glow
    const glowGeom = new THREE.ConeGeometry(0.7, 2, 16);
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0xFF6347,
        transparent: true,
        opacity: 0.7
    });
    
    const leftGlow = new THREE.Mesh(glowGeom, glowMat);
    leftGlow.position.set(-1.5, -0.5, -6.5);
    
    const rightGlow = new THREE.Mesh(glowGeom, glowMat);
    rightGlow.position.set(1.5, -0.5, -6.5);
    
    const centerGlow = new THREE.Mesh(glowGeom, glowMat);
    centerGlow.position.set(0, -0.5, -6.5);
    centerGlow.scale.set(1.2, 1.2, 1.2); // Match center thruster
    
    // Add cockpit
    const cockpitGeom = new THREE.SphereGeometry(1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const cockpitMat = new THREE.MeshStandardMaterial({
        color: 0x88C0D0,
        metalness: 0.1,
        roughness: 0.1,
        transparent: true,
        opacity: 0.8
    });
    
    const cockpit = new THREE.Mesh(cockpitGeom, cockpitMat);
    cockpit.position.set(0, 1, 0);
    cockpit.rotation.x = Math.PI / 2;
    
    // Add decorative stripes
    const stripeGeom = new THREE.BoxGeometry(6, 0.2, 0.1);
    const stripeMat = new THREE.MeshStandardMaterial({
        color: 0xD08770,
        emissive: 0xBF616A,
    });
    
    const topStripe = new THREE.Mesh(stripeGeom, stripeMat);
    topStripe.position.set(0, 0.5, 2);
    
    // Add all components to the spaceship group
    spaceship.add(
        body, leftWing, rightWing, 
        leftThruster, rightThruster, centerThruster,
        leftGlow, rightGlow, centerGlow,
        cockpit, topStripe
    );
    
    // Position the ship in the world
    spaceship.position.set(0, 100, 5000);
    
    // Add a method to handle banking during turns - simplified to prevent spinning
    spaceship.bank = function(rollAmount, pitchAmount) {
        // Fixed tiny bank angle based on sign of roll amount
        const bankAngle = Math.sign(rollAmount) * (Math.PI / 36); // Just 2.5 degrees max
        
        // Set a fixed rotation instead of interpolating
        this.rotation.z = bankAngle;
        
        // No pitch effect to avoid complications
        this.rotation.x = 0;
    };
    
    return spaceship;
}
