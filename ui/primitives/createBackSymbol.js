import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const FONT_URL = 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';

export function createBackSymbol({
    scene,
    writingColor,
    screenRotation,
    position,
    callback,
}) {

    const loader = new FontLoader();

    loader.load(FONT_URL, function (font) {

        const textGeometry = new TextGeometry('>', {
            font: font,
            size: 0.045, // Font size
            depth: 0.01, // Thickness of the text
            curveSegments: 12,
            bevelEnabled: false,
        });

        const textMaterial = new THREE.MeshBasicMaterial({
            color: writingColor,
        });

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textMesh.position.set(
            position.x - 0.015,
            position.y - 0.12,
            position.z - 0.0193
        );

        textMesh.rotation.x = screenRotation;

        scene.add(textMesh);

        if (callback) {
            callback(textMesh);
        }
        
    });

}
