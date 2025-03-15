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
 * Creates a large sphere planet with the given parameters.
 */
export function createPlanet(radius = 1000, color = 0x113355, position = new THREE.Vector3(0, 0, 0)) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ 
        color,
        roughness: 0.7,
        metalness: 0.1
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.copy(position);
    return planet;
}

/**
 * Creates a nebula using particle system.
 */
export function createNebula(size = 10000, particleCount = 5000, position = new THREE.Vector3(0, 0, 0)) {
    // Create particle geometry
    const particles = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    
    // Choose a color scheme for this nebula
    const colorSchemes = [
        { primary: new THREE.Color(0x8844aa), secondary: new THREE.Color(0x4422aa) }, // Purple/Blue
        { primary: new THREE.Color(0xaa4422), secondary: new THREE.Color(0xaaaa22) }, // Red/Yellow
        { primary: new THREE.Color(0x22aa44), secondary: new THREE.Color(0x22aaaa) }, // Green/Cyan
    ];
    const colorScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    
    // Generate particles in a cloud-like formation
    for (let i = 0; i < particleCount; i++) {
        // Use gaussian distribution for more central density
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = size * Math.pow(Math.random(), 0.5); // Concentrated toward center
        
        const x = position.x + r * Math.sin(phi) * Math.cos(theta);
        const y = position.y + r * Math.sin(phi) * Math.sin(theta);
        const z = position.z + r * Math.cos(phi);
        
        positions.push(x, y, z);
        
        // Mix between primary and secondary colors
        const mixFactor = Math.random();
        const color = new THREE.Color().lerpColors(
            colorScheme.primary,
            colorScheme.secondary,
            mixFactor
        );
        
        colors.push(color.r, color.g, color.b);
    }
    
    particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    // Create particle material
    const material = new THREE.PointsMaterial({
        size: 100,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    // Create the particle system
    const nebula = new THREE.Points(particles, material);
    nebula.userData.type = 'nebula';
    
    return nebula;
}

/**
 * Creates a black hole with event horizon and accretion disk.
 */
export function createBlackHole(radius = 500, position = new THREE.Vector3(0, 0, 0)) {
    const blackHoleGroup = new THREE.Group();
    
    // Event horizon (black sphere)
    const horizonGeom = new THREE.SphereGeometry(radius, 32, 32);
    const horizonMat = new THREE.MeshBasicMaterial({ 
        color: 0x000000,
        transparent: true,
        opacity: 0.9
    });
    const horizon = new THREE.Mesh(horizonGeom, horizonMat);
    
    // Accretion disk (glowing ring)
    const diskGeom = new THREE.RingGeometry(radius * 1.5, radius * 4, 64);
    const diskMat = new THREE.MeshBasicMaterial({
        color: 0xff3311,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        emissive: 0xff5500,
        emissiveIntensity: 1
    });
    const disk = new THREE.Mesh(diskGeom, diskMat);
    disk.rotation.x = Math.PI / 2; // Make it horizontal
    
    // Add glow effect
    const glowGeom = new THREE.SphereGeometry(radius * 1.2, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0x220000,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeom, glowMat);
    
    blackHoleGroup.add(horizon, disk, glow);
    blackHoleGroup.position.copy(position);
    blackHoleGroup.userData.type = 'blackhole';
    
    return blackHoleGroup;
}

/**
 * Creates a procedural starfield system that gives the illusion of infinite stars.
 * The stars are organized in multiple "star cubes" that move with the camera.
 */
export function createStarfield() {
    // Create a group to hold all star systems
    const starfieldGroup = new THREE.Group();
    
    // Configuration for our star system
    const config = {
        cubeSize: 100000,           // Size of each star cube
        starsPerCube: 1000,        // Number of stars in each cube
        visibleDistance: 50000,    // How far stars are visible
        starSize: 30,              // Size of each star
        starColors: [              // Various star colors
            0xFFFFFF,  // White
            0xFFEFD5,  // Cream
            0xFFE4B5,  // Pale yellow
            0xADD8E6,  // Light blue
            0xE6E6FA,  // Lavender
            0xFF9999   // Light red
        ]
    };
    
    // Create a reusable star geometry
    const starGeometry = new THREE.BufferGeometry();
    
    // Function to create a star cube at a specific position
    function createStarCube(x, y, z) {
        const positions = [];
        const colors = [];
        const sizes = [];
        
        // Generate random stars within this cube
        for (let i = 0; i < config.starsPerCube; i++) {
            // Position within the cube
            const px = x + (Math.random() - 0.5) * config.cubeSize;
            const py = y + (Math.random() - 0.5) * config.cubeSize;
            const pz = z + (Math.random() - 0.5) * config.cubeSize;
            
            positions.push(px, py, pz);
            
            // Random star color
            const colorIndex = Math.floor(Math.random() * config.starColors.length);
            const color = new THREE.Color(config.starColors[colorIndex]);
            colors.push(color.r, color.g, color.b);
            
            // Random star size variation
            const size = config.starSize * (0.5 + Math.random() * 0.5);
            sizes.push(size);
        }
        
        // Create a clone of the geometry for this cube
        const cubeGeometry = starGeometry.clone();
        
        // Set attributes
        cubeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        cubeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        cubeGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        
        // Create material with custom shaders for better-looking stars
        const starMaterial = new THREE.PointsMaterial({
            size: 1,
            vertexColors: true,
            transparent: true,
            sizeAttenuation: true
        });
        
        // Create the star system
        const starSystem = new THREE.Points(cubeGeometry, starMaterial);
        starSystem.position.set(x, y, z);
        starSystem.userData = { basePosition: { x, y, z } };
        
        return starSystem;
    }
    
    // Create initial star cubes in a 3x3x3 grid around the origin
    const gridSize = 1;
    for (let x = -gridSize; x <= gridSize; x++) {
        for (let y = -gridSize; y <= gridSize; y++) {
            for (let z = -gridSize; z <= gridSize; z++) {
                const cube = createStarCube(
                    x * config.cubeSize,
                    y * config.cubeSize,
                    z * config.cubeSize
                );
                starfieldGroup.add(cube);
            }
        }
    }
    
    // Function to update star positions based on camera movement
    starfieldGroup.updateStarfield = function(camera) {
        // Calculate which grid cell the camera is in
        const gridX = Math.round(camera.position.x / config.cubeSize);
        const gridY = Math.round(camera.position.y / config.cubeSize);
        const gridZ = Math.round(camera.position.z / config.cubeSize);
        
        // Check each star cube
        this.children.forEach(cube => {
            const basePos = cube.userData.basePosition;
            
            // Calculate grid position of this cube
            const cubeGridX = Math.round(basePos.x / config.cubeSize);
            const cubeGridY = Math.round(basePos.y / config.cubeSize);
            const cubeGridZ = Math.round(basePos.z / config.cubeSize);
            
            // If the cube is too far from the camera, reposition it
            if (Math.abs(cubeGridX - gridX) > gridSize || 
                Math.abs(cubeGridY - gridY) > gridSize || 
                Math.abs(cubeGridZ - gridZ) > gridSize) {
                
                // Calculate new position
                const newX = gridX + (Math.random() * 2 - 1) * gridSize;
                const newY = gridY + (Math.random() * 2 - 1) * gridSize;
                const newZ = gridZ + (Math.random() * 2 - 1) * gridSize;
                
                // Update the cube's position
                cube.position.set(
                    newX * config.cubeSize,
                    newY * config.cubeSize,
                    newZ * config.cubeSize
                );
                
                // Update the base position
                cube.userData.basePosition = {
                    x: cube.position.x,
                    y: cube.position.y,
                    z: cube.position.z
                };
            }
        });
    };
    
    return starfieldGroup;
}

/**
 * Creates a procedural celestial object generator that spawns planets, nebulas, and black holes.
 */
export function createCelestialGenerator(scene) {
    // Configuration for celestial object generation
    const config = {
        spawnDistance: 80000,      // Distance from camera to spawn objects
        despawnDistance: 150000,   // Distance from camera to remove objects
        minObjectDistance: 30000,  // Minimum distance between objects
        maxObjects: 10,            // Maximum number of objects to have at once
        spawnProbabilities: {      // Relative probabilities of spawning each type
            planet: 0.075,           // 70% chance for planets
            nebula: 0.25,          // 25% chance for nebulas
            blackhole: 0      // 5% chance for black holes
        },
        planetSizes: {
            min: 2000,
            max: 8000
        },
        nebulaSizes: {
            min: 10000,
            max: 30000
        },
        blackholeSizes: {
            min: 1000,
            max: 3000
        },
        // Planet color palettes
        planetColors: [
            0x3B6AA0, // Blue
            0x8B4513, // Brown
            0x228B22, // Forest Green
            0xA52A2A, // Red-Brown
            0x708090, // Slate Gray
            0xCD853F, // Peru/Orange
            0x800080, // Purple
            0x2F4F4F  // Dark Slate Gray
        ]
    };
    
    // Store all generated objects
    const celestialObjects = [];
    
    // Function to generate a random position at the specified distance from the camera
    function generateRandomPosition(camera, distance) {
        // Generate random direction
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        // Convert to Cartesian coordinates
        const x = distance * Math.sin(phi) * Math.cos(theta);
        const y = distance * Math.sin(phi) * Math.sin(theta);
        const z = distance * Math.cos(phi);
        
        // Add to camera position
        return new THREE.Vector3(
            camera.position.x + x,
            camera.position.y + y,
            camera.position.z + z
        );
    }
    
    // Function to check if a position is too close to existing objects
    function isTooClose(position) {
        for (const obj of celestialObjects) {
            const distance = position.distanceTo(obj.position);
            if (distance < config.minObjectDistance) {
                return true;
            }
        }
        return false;
    }
    
    // Function to determine which type of object to spawn
    function determineObjectType() {
        const rand = Math.random();
        if (rand < config.spawnProbabilities.planet) {
            return 'planet';
        } else if (rand < config.spawnProbabilities.planet + config.spawnProbabilities.nebula) {
            return 'nebula';
        } else {
            return 'blackhole';
        }
    }
    
    // Function to create a new celestial object
    function createCelestialObject(camera) {
        // Determine what type of object to create
        const objectType = determineObjectType();
        
        // Generate position at spawn distance
        let position;
        let attempts = 0;
        const maxAttempts = 10;
        
        // Try to find a position that's not too close to existing objects
        do {
            position = generateRandomPosition(camera, config.spawnDistance);
            attempts++;
        } while (isTooClose(position) && attempts < maxAttempts);
        
        // If we couldn't find a good position, skip this spawn
        if (attempts >= maxAttempts) {
            return null;
        }
        
        let object;
        
        // Create the appropriate type of object
        switch (objectType) {
            case 'planet':
                const radius = Math.random() * (config.planetSizes.max - config.planetSizes.min) + config.planetSizes.min;
                const colorIndex = Math.floor(Math.random() * config.planetColors.length);
                object = createPlanet(radius, config.planetColors[colorIndex], position);
                object.userData.type = 'planet';
                break;
                
            case 'nebula':
                const size = Math.random() * (config.nebulaSizes.max - config.nebulaSizes.min) + config.nebulaSizes.min;
                const particleCount = Math.floor(size / 4);
                object = createNebula(size, particleCount, position);
                break;
                
            case 'blackhole':
                const bhRadius = Math.random() * (config.blackholeSizes.max - config.blackholeSizes.min) + config.blackholeSizes.min;
                object = createBlackHole(bhRadius, position);
                break;
        }
        
        if (object) {
            // Add to scene and tracking array
            scene.add(object);
            celestialObjects.push(object);
            return object;
        }
        
        return null;
    }
    
    // Function to update celestial objects based on camera position
    function updateCelestialObjects(camera) {
        // Remove objects that are too far away
        for (let i = celestialObjects.length - 1; i >= 0; i--) {
            const object = celestialObjects[i];
            const distance = camera.position.distanceTo(object.position);
            
            if (distance > config.despawnDistance) {
                scene.remove(object);
                celestialObjects.splice(i, 1);
            }
        }
        
        // Spawn new objects if we're below the maximum
        if (celestialObjects.length < config.maxObjects) {
            // Chance to spawn a new object
            if (Math.random() < 0.1) {  // 10% chance per update
                createCelestialObject(camera);
            }
        }
    }
    
    // Return the update function
    return {
        update: updateCelestialObjects
    };
}
