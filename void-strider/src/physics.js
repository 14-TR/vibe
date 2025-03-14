// physics.js
import * as THREE from "three";

/**
 * Basic planetary gravity: returns acceleration from planet's gravity.
 * @param {THREE.Object3D} object
 * @param {THREE.Object3D} planet
 * @param {number} gravitationalConstant
 * @returns {THREE.Vector3} The gravitational acceleration
 */
export function applyPlanetGravity(object, planet, gravitationalConstant = 8000) {
  const displacement = new THREE.Vector3().subVectors(planet.position, object.position);
  const distSq = displacement.lengthSq();
  if (distSq === 0) return new THREE.Vector3(0, 0, 0);

  // G*M / r^2
  const forceMag = gravitationalConstant / distSq;
  const forceDir = displacement.normalize();
  return forceDir.multiplyScalar(forceMag);
}

/**
 * Checks if the object collides with the planet (simple sphere check).
 * @param {THREE.Object3D} object
 * @param {THREE.Object3D} planet
 * @param {number} planetRadius
 * @param {number} shipRadius
 * @returns {boolean} True if collision
 */
export function checkPlanetCollision(object, planet, planetRadius, shipRadius = 1.5) {
  const dist = object.position.distanceTo(planet.position);
  return dist < (planetRadius + shipRadius);
}

/**
 * Integrate ship physics with time-step. 
 * @param {THREE.Mesh} spaceship
 * @param {THREE.Vector3} velocity
 * @param {THREE.Vector3} acceleration
 * @param {number} dt
 * @param {number} damping
 */
export function integrateMovement(spaceship, velocity, acceleration, dt, damping) {
  // velocity
  velocity.addScaledVector(acceleration, dt);
  velocity.multiplyScalar(damping);

  // position
  const deltaPos = velocity.clone().multiplyScalar(dt);
  spaceship.position.add(deltaPos);
}
