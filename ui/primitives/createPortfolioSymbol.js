import * as THREE from 'three';

export function createPortfolioSymbol({
    scene,
    writingColor,
    screenRotation,
    position,
    topBottomWidth,
    topBottomHeight,
    leftRightWidth,
    leftRightHeight,
}) {
    
    const material = new THREE.MeshBasicMaterial({
        color: writingColor,
    });

    const depth = 0.01;

    const topGeometry = new THREE.BoxGeometry(topBottomWidth, topBottomHeight, depth);
    const topMesh = new THREE.Mesh(topGeometry, material);
    topMesh.position.set(0, (leftRightHeight - topBottomHeight) / 2, 0);

    const bottomGeometry = new THREE.BoxGeometry(topBottomWidth, topBottomHeight, depth);
    const bottomMesh = new THREE.Mesh(bottomGeometry, material);
    bottomMesh.position.set(0, -(leftRightHeight - topBottomHeight) / 2, 0);

    const leftGeometry = new THREE.BoxGeometry(leftRightWidth, leftRightHeight, depth);
    const leftMesh = new THREE.Mesh(leftGeometry, material);
    leftMesh.position.set(-(topBottomWidth + leftRightWidth) / 2, 0, 0);

    const rightGeometry = new THREE.BoxGeometry(leftRightWidth, leftRightHeight, depth);
    const rightMesh = new THREE.Mesh(rightGeometry, material);
    rightMesh.position.set((topBottomWidth + leftRightWidth) / 2, 0, 0);

    const portfolio = new THREE.Group();
    portfolio.add(topMesh);
    portfolio.add(bottomMesh);
    portfolio.add(leftMesh);
    portfolio.add(rightMesh);

    portfolio.position.copy(position);
    portfolio.rotation.x = screenRotation;

    scene.add(portfolio);

    return portfolio;

}
