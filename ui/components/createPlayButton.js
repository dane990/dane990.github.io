import * as THREE from 'three';
import { createCircleButton } from '../primitives/createCircleButton.js';
import { createPlaySymbol } from '../primitives/createPlaySymbol.js';
import { createStopSymbol } from '../primitives/createStopSymbol.js';

export function createPlayButton({
    scene,
    screenColor,
    writingColor,
    screenRotation,
    position,
    buttonRadius,
    borderRadius,
}) {

    const group = new THREE.Group();

    const button = createCircleButton({
        scene: scene,
        screenColor: screenColor,
        writingColor: writingColor,
        screenRotation: screenRotation,
        position: position,
        buttonRadius: buttonRadius,
        borderRadius: borderRadius,
    });

    const playSymbol = createPlaySymbol({
        scene: scene,
        writingColor: writingColor,
        screenRotation: screenRotation,
        position: new THREE.Vector3(
            position.x - 0.01,
            position.y,
            position.z - 0.0002
        ),
    });

    const stopSymbol = createStopSymbol({
        scene: scene,
        writingColor: writingColor,
        screenRotation: screenRotation,
        position: new THREE.Vector3(
            position.x,
            position.y,
            position.z - 0.0002
        ),
    });

    stopSymbol.visible = false;

    group.add(button);
    group.add(playSymbol);
    group.add(stopSymbol);

    return {
        root: group,
        button: button,
        playSymbol: playSymbol,
        stopSymbol: stopSymbol,
    };
    
}
