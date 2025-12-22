import * as THREE from 'three';

export function createPlaySymbol({
    scene,
    writingColor,
    screenRotation,
    position,
}) {

    const triangleShape = new THREE.Shape();
    triangleShape.moveTo(-1, -1);
    triangleShape.lineTo(1, 0);
    triangleShape.lineTo(-1, 1);
    triangleShape.lineTo(-1, -1);

    const geometry = new THREE.ShapeGeometry(triangleShape);
    const material = new THREE.MeshBasicMaterial({
        color: writingColor,
        side: THREE.DoubleSide,
    });

    const triangleMesh = new THREE.Mesh(geometry, material);

    const scalef = 0.05;
    triangleMesh.scale.set(scalef, scalef, scalef);
    triangleMesh.rotation.z = Math.PI;
    triangleMesh.position.copy(position);
    triangleMesh.position.z -= 0.0001;
    triangleMesh.rotation.x = screenRotation;

    scene.add(triangleMesh);

    return triangleMesh;
    
}