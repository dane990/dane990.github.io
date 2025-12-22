import * as THREE from 'three';

export function createStopSymbol({
    scene,
    writingColor,
    screenRotation,
    position,
}) {

    const side = 0.07;

    const geometry = new THREE.PlaneGeometry(side, side);
    const material = new THREE.MeshBasicMaterial({
        color: writingColor,
        side: THREE.DoubleSide,
    });

    const square = new THREE.Mesh(geometry, material);

    square.position.copy(position);
    square.position.z -= 0.0001;
    square.rotation.x = screenRotation;

    scene.add(square);

    return square;
    
}
