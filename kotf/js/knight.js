import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';
import { scene } from './scene.js';

class Knight {
    constructor(color, startX, startZ, team, flankDirection = 0) {
        this.geometry = new THREE.BoxGeometry(1, 2, 1);
        this.material = new THREE.MeshBasicMaterial({ color });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(startX, 1, startZ);
        this.health = 100;
        this.stamina = 100;
        this.isAttacking = false;
        this.isBlocking = false;
        this.isDodging = false;
        this.isRetreating = false;
        this.isDead = false;
        this.inCombat = false;
        this.isCharging = false;
        this.team = team;
        this.flankDirection = flankDirection; // Determines if knight is flanking
        scene.add(this.mesh);

        // 🏹 ADD A SWORD (Simple Thin Box)
        const swordGeometry = new THREE.BoxGeometry(0.2, 1, 0.1);
        const swordMaterial = new THREE.MeshBasicMaterial({ color: 0x999999 }); // Gray Sword
        this.sword = new THREE.Mesh(swordGeometry, swordMaterial);
        this.sword.position.set(0.5, 1, 0); // Attach sword to right hand
        this.mesh.add(this.sword);
    }

    move(direction) {
        if (!this.isDead && !this.isAttacking && !this.isDodging && !this.isRetreating && !this.inCombat) {
            let flankAmount = this.flankDirection * 0.08; // Flank movement
            let speed = this.isCharging ? 0.12 : 0.05;

            this.mesh.position.x += direction * speed;
            this.mesh.position.z += flankAmount;
            this.recoverStamina();  // 🔥 FIX: Ensure stamina is recovered
        }
    }

    recoverStamina() {  // 🔥 FIX: Define this function in the class
        if (this.stamina < 100) {
            this.stamina += 0.5;
        }
    }

    charge(direction) {
        if (!this.isCharging && !this.isAttacking) {
            this.isCharging = true;
            console.log(`${this.team} knight is CHARGING!`);
        }
    }

    attack(target) {
        if (this.isDead || this.isAttacking) return;
        this.inCombat = true;
        this.isAttacking = true;

        // 🏹 SWORD SWING ANIMATION
        const initialRotation = this.sword.rotation.z;
        this.sword.rotation.z = -Math.PI / 4; // Swing forward
        setTimeout(() => {
            this.sword.rotation.z = initialRotation; // Reset swing
        }, 200);

        setTimeout(() => {
            target.defendOrTakeDamage(Math.random() * 20 + 5);
            this.isAttacking = false;
        }, 300);

        setTimeout(() => {
            this.inCombat = false;
        }, 1500);
    }

    defendOrTakeDamage(amount) {
        if (Math.random() < 0.3 && this.stamina > 20) {
            this.isBlocking = true;
            setTimeout(() => {
                this.isBlocking = false;
            }, 300);
        } else if (Math.random() < 0.2 && this.stamina > 30) {
            this.isDodging = true;
            setTimeout(() => {
                this.isDodging = false;
            }, 200);
        } else {
            this.takeDamage(amount);
        }
    }

    takeDamage(amount) {
        if (this.isDead) return;
        this.health -= amount;
        
        // 🔴 FLASH RED WHEN HIT
        const originalColor = this.material.color.getHex();
        this.material.color.set(0xff0000);
        setTimeout(() => {
            this.material.color.set(originalColor);
        }, 200);

        if (this.health <= 0) this.die();
        this.retreat();
    }

    retreat() {
        if (!this.isRetreating && this.health < 30) {
            this.isRetreating = true;
            console.log(`${this.team} knight is retreating!`);
            let retreatDirection = (this.team === "red") ? -0.1 : 0.1;

            let retreatInterval = setInterval(() => {
                if (this.health > 50 || this.stamina > 60) {
                    this.isRetreating = false;
                    clearInterval(retreatInterval);
                }
                this.mesh.position.x += retreatDirection;
                this.recoverStamina();
            }, 100);
        }
    }

    die() {
        this.isDead = true;
        this.inCombat = false;
        this.isCharging = false;

        // ☠️ DEATH ANIMATION: FALL TO GROUND
        this.mesh.rotation.x = -Math.PI / 2;
        setTimeout(() => {
            scene.remove(this.mesh);
        }, 1000);
    }
}

export { Knight };
