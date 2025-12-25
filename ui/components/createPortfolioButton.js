import * as THREE from 'three';
import { createCircleButton } from '../primitives/createCircleButton.js';
import { createPortfolioSymbol } from '../primitives/createPortfolioSymbol.js';

export function createPortfolioButton({
    scene,
    screenColor,
    writingColor,
    screenRotation,
    position,
    buttonRadius,
    borderRadius,
}) {
    
    const group = new THREE.Group();

    // Circle button (hitbox)
    const button = createCircleButton({
        scene: scene,
        screenColor: screenColor,
        writingColor: writingColor,
        screenRotation: screenRotation,
        position: position,
        buttonRadius: buttonRadius,
        borderRadius: borderRadius,
    });

    // Portfolio body
    const bodySymbol = createPortfolioSymbol({
        scene: scene,
        writingColor: writingColor,
        screenRotation: screenRotation,
        position: new THREE.Vector3(
            position.x,
            position.y - 0.014,
            position.z + 0.0026
        ),
        topBottomWidth: 0.05,
        topBottomHeight: 0.03,
        leftRightWidth: 0.04,
        leftRightHeight: 0.09,
    });

    // Portfolio handle
    const handleSymbol = createPortfolioSymbol({
        scene: scene,
        writingColor: writingColor,
        screenRotation: screenRotation,
        position: new THREE.Vector3(
            position.x,
            position.y + 0.035,
            position.z + 0.0104
        ),
        topBottomWidth: 0.08,
        topBottomHeight: 0.01,
        leftRightWidth: 0.01,
        leftRightHeight: 0.05,
    });

    group.add(button);
    group.add(bodySymbol);
    group.add(handleSymbol);

    return {
        root: group,
        button: button,
        bodySymbol: bodySymbol,
        handleSymbol: handleSymbol,
    };
}
