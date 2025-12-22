import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { wait } from '../../utils.js';

const FONT_URL = 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';

export async function createTextMesh({
    scene,
    parent,
    text,
    fontSize,
    position,
    screenRotation,
    color,
    duration = 1000,
}) {
    
    const loader = new FontLoader();

    loader.load(FONT_URL, async function (font) {

        const geometry = new TextGeometry(text, {
            font: font,
            size: fontSize,
            depth: 0.01,
            curveSegments: 12,
            bevelEnabled: false,
        });

        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        const textWidth = boundingBox.max.x - boundingBox.min.x;
        const textHeight = boundingBox.max.y - boundingBox.min.y;
        geometry.translate(-textWidth / 2, -textHeight / 2, 0);

        const material = new THREE.MeshBasicMaterial({ color: color });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.copy(position);
        mesh.rotation.x = screenRotation;
        mesh.rotation.y = Math.PI;

        scene.add(mesh);
        parent.add(mesh);

        await wait(duration);

        parent.remove(mesh);
        scene.remove(mesh);

        mesh.geometry.dispose();
        mesh.material.dispose();

    });
}
