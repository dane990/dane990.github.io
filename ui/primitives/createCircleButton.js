import * as THREE from 'three';

export function createCircleButton({
    scene,
    screenColor,
    writingColor,
    screenRotation,
    position,
    buttonRadius,
    borderRadius,
}) {

    const buttonGeometry = new THREE.CircleGeometry(buttonRadius, 32);
    const buttonMaterial = new THREE.MeshBasicMaterial({
        color: screenColor,
        side: THREE.DoubleSide,
    });
    const buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);

    const borderGeometry = new THREE.CircleGeometry(borderRadius, 32);
    const borderMaterial = new THREE.MeshBasicMaterial({
        color: writingColor,
        side: THREE.DoubleSide,
    });
    const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);

    buttonMesh.position.z = -0.0001;

    const buttonGroup = new THREE.Group();
    buttonGroup.add(buttonMesh);
    buttonGroup.add(borderMesh);

    buttonGroup.position.copy(position);
    buttonGroup.position.z -= 0.0001;
    buttonGroup.rotation.x = screenRotation;

    scene.add(buttonGroup);

    return buttonGroup;
    
}
