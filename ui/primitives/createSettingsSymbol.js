import * as THREE from 'three';

export function createSettingsSymbol({
    scene,
    writingColor,
    screenColor,
    screenRotation,
    position,
}) {

    const material = new THREE.MeshBasicMaterial({
        color: writingColor,
    });

    const group = new THREE.Group();

    /* =========================
       Outer gear circle (Gear Group)
    ========================= */

    const gearGroup = new THREE.Group();

    const radius = 0.4;
    const circleGeometry = new THREE.CylinderGeometry(radius, radius, 0.01, 32);
    const circleMesh = new THREE.Mesh(circleGeometry, material);
    circleMesh.rotation.x = Math.PI / 2;
    gearGroup.add(circleMesh);

    /* =========================
       Gear teeth (Gear Group)
    ========================= */

    const teethCount = 8;
    const teethWidth = 0.2;
    const teethHeight = 0.2;
    const teethDepth = 0.01;

    for (let i = 0; i < teethCount; i++) {
        const angle = (i / teethCount) * Math.PI * 2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        const toothGeometry = new THREE.BoxGeometry(
            teethWidth,
            teethHeight,
            teethDepth
        );
        const toothMesh = new THREE.Mesh(toothGeometry, material);

        toothMesh.position.set(x, y, 0);
        toothMesh.rotation.z = -angle;

        gearGroup.add(toothMesh);
    }

    const scalef = 0.13;
    gearGroup.scale.set(scalef, scalef, scalef);

    group.add(gearGroup);

    /* =========================
       Gear center circle
    ========================= */

    const centerGeometry = new THREE.CircleGeometry(0.03, 32);
    const centerMaterial = new THREE.MeshBasicMaterial({
        color: screenColor,
        side: THREE.DoubleSide,
    });
    const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
    centerMesh.position.z -= 0.0007;
    group.add(centerMesh);

    /* =========================
       Transform + add to scene
    ========================= */

    group.position.copy(position);
    group.rotation.x = screenRotation;

    scene.add(group);

    return group;
}
