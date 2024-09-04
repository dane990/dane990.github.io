import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createText, OrbitControls } from 'three/examples/jsm/Addons.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { Reflector } from 'three/examples/jsm/Addons.js';
import { LightProbeHelper } from 'three/addons/helpers/LightProbeHelper.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';



export function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Function to dispose of a mesh
function disposeMesh(mesh) {
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) {
        if (Array.isArray(mesh.material)) {
            // Dispose of each material if the mesh has multiple materials
            mesh.material.forEach(mat => mat.dispose());
        } else {
            mesh.material.dispose();
        }
    }
}

// Function to recursively dispose of a group and its children
export function disposeGroup(group) {
    group.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
            disposeMesh(child);
        } else if (child instanceof THREE.Group) {
            disposeGroup(child); // Recursively dispose of nested groups
        }
        group.remove(child); // Remove child from the group
    });
    group = null; // Ensure the group is set to null
}