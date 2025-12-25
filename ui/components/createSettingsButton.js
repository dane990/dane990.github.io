import * as THREE from 'three';
import { createCircleButton } from '../primitives/createCircleButton.js';
import { createSettingsSymbol } from '../primitives/createSettingsSymbol.js';

export function createSettingsButton({
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

    // Settings symbol (gear)
    const settingsSymbol = createSettingsSymbol({
        scene: scene,
        writingColor: writingColor,
        screenColor: screenColor,
        screenRotation: screenRotation,
        position: new THREE.Vector3(
            position.x,
            position.y,
            position.z + 0.0004
        ),
    });

    group.add(button);
    group.add(settingsSymbol);

    return {
        root: group,
        button: button,
        symbol: settingsSymbol,
    };
}
