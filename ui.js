import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createText, OrbitControls } from 'three/examples/jsm/Addons.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { Reflector } from 'three/examples/jsm/Addons.js';
import { LightProbeHelper } from 'three/addons/helpers/LightProbeHelper.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

import pianowireframeURL from './assets/pianowireframe.jpg';
import pianorigURL from './assets/pianorig.png';
import starorbitURL from './assets/starorbit.png';
import starinventoryURL from './assets/starinventory.png';
import lugiadataURL from './assets/lugiadata.png';
import dialgadataURL from './assets/dialgadata.png';

import tacticstoolURL from './assets/tacticstool.png';
import chalpromoURL from './assets/chalpromo.png';
import masterpromoURL from './assets/masterpromo.png';
import asolMasteryURL from './assets/asolmastery.png';
import pianoImageURL from './assets/pianoimage.png';
import frenchhornURL from './assets/frenchhorn.png';



import { wait } from './utils';
//-0.3855
export function createScreen(scene, screenColor, screenRotation) {
	
	const planeGeometry = new THREE.PlaneGeometry(0.885, 0.584);
	const planeMaterial = new THREE.MeshBasicMaterial({ color: screenColor, side: THREE.DoubleSide });
	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.rotation.x = screenRotation
	plane.position.set(0, 2.714, -0.38541);
	scene.add(plane);
	return plane;

}

async function createTextMesh(scene, menuScreen, text, fontsize, px, py, pz, screenRotation, writingColor) {

	const loader = new FontLoader();
	loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', async function (font) {

  	const textGeometry = new TextGeometry(text, {
    	font: font,
    	size: fontsize, // Font size
    	depth: 0.01, // Thickness of the text
    	curveSegments: 12,
    	bevelEnabled: false
  	});

	const textMaterial = new THREE.MeshBasicMaterial({ color: writingColor });
  	const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  	
	textGeometry.computeBoundingBox();
	const textBoundingBox = textGeometry.boundingBox;
	const textWidth = textBoundingBox.max.x - textBoundingBox.min.x;
	const textHeight = textBoundingBox.max.y - textBoundingBox.min.y;
	textGeometry.translate(-textWidth / 2, -textHeight / 2, 0);
	textMesh.position.set(px, py, pz);
	textMesh.rotation.x = screenRotation;
  	textMesh.rotation.y = Math.PI;
	scene.add(textMesh);
	menuScreen.add(textMesh);

	await wait(1000);

    menuScreen.remove(textMesh);
	scene.remove(textMesh);
	textMesh.geometry.dispose();
	textMesh.material.dispose();
	})
}

export function updateTimeMesh(scene, menuScreen, screenRotation, writingColor, daysOfWeek, months) {

	const date = new Date();

	//time
	const hours = date.getHours();      // (0-23)
	const minutes = date.getMinutes();  // (0-59)
	const seconds = date.getSeconds();  // (0-59)
	const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	createTextMesh(scene, menuScreen, formattedTime, 0.09, 0, 2.83, -0.358, screenRotation, writingColor);

	//date
	const dayName = daysOfWeek[date.getDay()];
  	const monthName = months[date.getMonth()];
  	const dayNumber = date.getDate();
	const formattedDate = `${dayName}, ${monthName} ${dayNumber}`;
	createTextMesh(scene, menuScreen, formattedDate, 0.025, 0, 2.925, -0.343, screenRotation, writingColor);
    

}

function createCircleButton(scene, screenColor, writingColor, screenRotation, px, py, pz, buttonRadius, borderRadius) {

	const buttonGeometry = new THREE.CircleGeometry(buttonRadius, 32);
	const buttonMaterial = new THREE.MeshBasicMaterial({ color: screenColor, side: THREE.DoubleSide }); 
	const buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);

	// Create a circle for the border 
	const borderGeometry = new THREE.CircleGeometry(borderRadius, 32); 
	const borderMaterial = new THREE.MeshBasicMaterial({ color: writingColor, side: THREE.DoubleSide }); 
	const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);

	buttonMesh.position.z = -0.0001;

	const buttonGroup = new THREE.Group();
	buttonGroup.add(buttonMesh);
	buttonGroup.add(borderMesh);

	buttonGroup.position.set(px, py, pz-0.0001);
	buttonGroup.rotation.x = screenRotation;
	

	scene.add(buttonGroup);
	
	return buttonGroup;

}

function createPlaySymbol(scene, writingColor, screenRotation, px, py, pz) {
	const triangleShape = new THREE.Shape();
	triangleShape.moveTo(-1, -1); // First vertex (bottom-left)
	triangleShape.lineTo(1, 0);   // Second vertex (middle-right)
	triangleShape.lineTo(-1, 1);  // Third vertex (top-left)
	triangleShape.lineTo(-1, -1); // Close the shape

	const geometry = new THREE.ShapeGeometry(triangleShape);
	const material = new THREE.MeshBasicMaterial({ color: writingColor, side: THREE.DoubleSide }); // White color for the play button
	const triangleMesh = new THREE.Mesh(geometry, material);
	const scalef = 0.05;
	triangleMesh.scale.set(scalef, scalef, scalef);
	triangleMesh.rotation.z = Math.PI; 
	triangleMesh.position.set(px, py, pz-0.0001);
	triangleMesh.rotation.x = screenRotation;
	scene.add(triangleMesh);
	return triangleMesh;
}

function createStopSymbol(scene, writingColor, screenRotation, px, py, pz) {
	const side = 0.07;
	const geometry = new THREE.PlaneGeometry(side, side); 
	const material = new THREE.MeshBasicMaterial({ color: writingColor, side: THREE.DoubleSide });
	const square = new THREE.Mesh(geometry, material);
	square.position.set(px, py, pz-0.0001);
	square.rotation.x = screenRotation;
	scene.add(square);
	return square;
}

function createPortfolioSymbol(scene, writingColor, screenRotation, px, py, pz, tbwidth, tbheight, lrwidth, lrheight) {

	const material = new THREE.MeshBasicMaterial({ color: writingColor });

    // Create the 4 rectangular pieces that will form the outer frame
	const depth = 0.01;

    // Top rectangle
    const topGeometry = new THREE.BoxGeometry(tbwidth, tbheight, depth);
    const topMesh = new THREE.Mesh(topGeometry, material);
    topMesh.position.set(0, (lrheight-tbheight) / 2, 0);

    // Bottom rectangle
    const bottomGeometry = new THREE.BoxGeometry(tbwidth, tbheight, depth);
    const bottomMesh = new THREE.Mesh(bottomGeometry, material);
    bottomMesh.position.set(0, -(lrheight-tbheight) / 2, 0);

    // Left rectangle
    const leftGeometry = new THREE.BoxGeometry(lrwidth, lrheight, depth);
    const leftMesh = new THREE.Mesh(leftGeometry, material);
    leftMesh.position.set(-(tbwidth+lrwidth) / 2, 0, 0);

    // Right rectangle
    const rightGeometry = new THREE.BoxGeometry(lrwidth, lrheight, depth);
    const rightMesh = new THREE.Mesh(rightGeometry, material);
    rightMesh.position.set((tbwidth+lrwidth) / 2, 0, 0);

    // Combine the 4 pieces into a group
    const portfolio = new THREE.Group();
    portfolio.add(topMesh);
    portfolio.add(bottomMesh);
    portfolio.add(leftMesh);
    portfolio.add(rightMesh);

    // Add the group to the scene
	portfolio.position.set(px, py, pz);
	portfolio.rotation.x = screenRotation;
    scene.add(portfolio);
	return portfolio;
		
}

function createSettingsIcon(scene, writingColor, screenRotation, px, py, pz) {

	// Material for all parts
	const material = new THREE.MeshBasicMaterial({ color: writingColor });
	const settingsIconGroup = new THREE.Group();

	const radius = 0.4;
	const circleGeometry = new THREE.CylinderGeometry(radius, radius, 0.01, 32);
    const circleMesh = new THREE.Mesh(circleGeometry, material);
    circleMesh.rotation.x = Math.PI / 2;
    settingsIconGroup.add(circleMesh); // Add the circle to the group

    // Create gear teeth using box geometries around the circle
    const teethCount = 8;
    const teethWidth = 0.2;
    const teethHeight = 0.2;
    const teethDepth = 0.01;
    

    for (let i = 0; i < teethCount; i++) {
        const angle = (i / teethCount) * Math.PI * 2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        const toothGeometry = new THREE.BoxGeometry(teethWidth, teethHeight, teethDepth);
        const toothMesh = new THREE.Mesh(toothGeometry, material);

        toothMesh.position.set(x, y, 0);
        toothMesh.rotation.z = -angle;

        settingsIconGroup.add(toothMesh); // Add each tooth to the group
    }

    // Add the group to the scene
	settingsIconGroup.position.set(px, py, pz);
	settingsIconGroup.rotation.x = screenRotation;
	const scalef = 0.13;
	settingsIconGroup.scale.set(scalef, scalef, scalef);
    scene.add(settingsIconGroup);

	return settingsIconGroup;

}

function createGearCenter(scene, screenColor, screenRotation, px, py, pz) {
	const buttonGeometry = new THREE.CircleGeometry(0.03, 32);
	const buttonMaterial = new THREE.MeshBasicMaterial({ color: screenColor, side: THREE.DoubleSide });
	const buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
	
	buttonMesh.position.set(px, py, pz);
	buttonMesh.rotation.x = screenRotation;
	scene.add(buttonMesh);
	return buttonMesh;
}

export function createMenuScreen(scene, screenColor, writingColor, screenRotation) {

    const ypbutton = 2.62;
    const zpbutton = -0.4013;
    const buttondist = 0.27;
	const buttonRadius = 0.1;
	const borderRadius = 0.107;

    //play button
    const midButton = createCircleButton(scene, screenColor, writingColor, screenRotation, 0, ypbutton, zpbutton, buttonRadius, borderRadius);
    const playSymbol = createPlaySymbol(scene, writingColor, screenRotation, -0.01, ypbutton, zpbutton-0.0002);

    //stop button
    const midButton2 = createCircleButton(scene, screenColor, writingColor, screenRotation, 0, ypbutton, zpbutton, buttonRadius, borderRadius);
    const stopSymbol = createStopSymbol(scene, writingColor, screenRotation, 0, ypbutton, zpbutton-0.0002);
    midButton2.visible = false;
    stopSymbol.visible = false;

    //portfolio button
    const leftButton = createCircleButton(scene, screenColor, writingColor, screenRotation, buttondist, ypbutton, zpbutton, buttonRadius, borderRadius); //tbw, tbh, lrw, lrh
    const portSymbol = createPortfolioSymbol(scene, writingColor, screenRotation, buttondist, ypbutton-0.014, zpbutton+0.0026, 0.05, 0.03, 0.04, 0.09);
    const portHandle = createPortfolioSymbol(scene, writingColor, screenRotation, buttondist, ypbutton+0.035, zpbutton+0.0104, 0.08, 0.01, 0.01, 0.05);

    //settings button
    const rightButton = createCircleButton(scene, screenColor, writingColor, screenRotation, -buttondist, ypbutton, zpbutton, buttonRadius, borderRadius);
    const settingsIcon = createSettingsIcon(scene, writingColor, screenRotation, -buttondist, ypbutton, zpbutton+0.0004)
    const gearCenter = createGearCenter(scene, screenColor, screenRotation, -buttondist, ypbutton, zpbutton-0.0003)

    const menuScreen = new THREE.Group();
    menuScreen.add(midButton);
    menuScreen.add(playSymbol);
    menuScreen.add(midButton2);
    menuScreen.add(stopSymbol);
    menuScreen.add(leftButton);
    menuScreen.add(portSymbol);
    menuScreen.add(portHandle);
    menuScreen.add(rightButton);
    menuScreen.add(settingsIcon);
    menuScreen.add(gearCenter);
    scene.add(menuScreen)
    return menuScreen;
}

function createVolumeBar(scene, writingColor, screenRotation, px, py, pz) {
	const boxWidth = 2.4;
    const boxHeight = 0.2;
    const boxDepth = 0.01;
    const rectangleGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const material = new THREE.MeshBasicMaterial({ color: writingColor, side: THREE.DoubleSide });
    const rectangle = new THREE.Mesh(rectangleGeometry, material);

    // Create circular ends (half cylinders)
    const radius = boxHeight / 2;
    const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, boxDepth, 32, 1, false, 0, Math.PI);
        
    // Rotate cylinders to match the rectangle
    const leftEnd = new THREE.Mesh(cylinderGeometry, material);
    leftEnd.position.x = -boxWidth / 2;  // Position at the left end
	leftEnd.rotation.x = Math.PI/2;
    leftEnd.rotation.z = Math.PI;  // Rotate to align with the rectangle

    const rightEnd = new THREE.Mesh(cylinderGeometry, material);
    rightEnd.position.x = boxWidth / 2;  // Position at the right end
	rightEnd.rotation.x = Math.PI/2;

    // Combine into a group
    const sliderGroup = new THREE.Group();
    sliderGroup.add(rectangle);
    sliderGroup.add(leftEnd);
    sliderGroup.add(rightEnd);
	sliderGroup.rotation.x = screenRotation;
	sliderGroup.position.set(px, py, pz);
	const scalef = 0.2
	sliderGroup.scale.set(scalef, scalef, scalef);
    scene.add(sliderGroup);
	return sliderGroup;
}

export function createVolumeIndicator(scene, screenColor, screenRotation, px, py, pz, vol) {

	const scalef = 0.17
	const boxWidth = 2.81;
    const boxHeight = 0.2;
    const boxDepth = 0.01;
    
	const radius = boxHeight / 2;

	const barWidth = boxWidth + boxHeight;
	const barMaxPivot = - (barWidth * scalef / 2) - 0.11; 

	const material = new THREE.MeshBasicMaterial({ color: screenColor, side: THREE.DoubleSide });

	if ( (vol * barWidth) > (boxWidth + radius) ) {

		const semiCircleWidth = barWidth - vol * barWidth;
		const x = radius - semiCircleWidth;
		//create right half semi
		function createPartialCircleShape(radius, startAngle, endAngle) {

			const shape = new THREE.Shape();
			shape.moveTo(
				Math.cos(startAngle) * radius,
				Math.sin(startAngle) * radius
			);
			
			shape.absarc(0, 0, radius, startAngle, endAngle, false);
		
			// Close the shape by connecting the end of the arc to the center
			shape.lineTo(x, 0);
		
			return shape;
		}            

		const startAngle = -Math.acos(x/radius);           // Starting angle (in radians)
		const endAngle = Math.acos(x/radius);
		const partialCircleShape = createPartialCircleShape(radius, startAngle, endAngle);

		const extrudeSettings = { depth: 0.01, bevelEnabled: false };
		const geometry = new THREE.ExtrudeGeometry(partialCircleShape, extrudeSettings);

		// Create a material and mesh
		const material = new THREE.MeshBasicMaterial({ color: screenColor, side: THREE.DoubleSide });
		const partialSemiMesh = new THREE.Mesh(geometry, material);
		partialSemiMesh.rotation.x = screenRotation;
		partialSemiMesh.rotation.z = Math.PI;
		partialSemiMesh.position.set(barMaxPivot + radius*scalef, py, pz-0.0009);
		partialSemiMesh.scale.set(scalef,scalef,scalef)
		scene.add(partialSemiMesh);
		return partialSemiMesh;

	} else if ( (vol * barWidth) > (radius) ) {

		//create rect + right half semi
		const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, boxDepth, 32, 1, false, 0, Math.PI);
		const rightEnd = new THREE.Mesh(cylinderGeometry, material);
    	rightEnd.position.x = radius;  // Position at the right end
		rightEnd.rotation.x = Math.PI/2;
		rightEnd.rotation.z = Math.PI;

		const newRectWidth = ((1-vol) * barWidth) - radius;
		const rectangleGeometry = new THREE.BoxGeometry( newRectWidth, boxHeight, boxDepth);
    	const rectangle = new THREE.Mesh(rectangleGeometry, material);
		rectangle.position.x = radius + newRectWidth/2;

		const sliderGroup = new THREE.Group();
    	sliderGroup.add(rightEnd);
		sliderGroup.add(rectangle);
		sliderGroup.rotation.x = screenRotation;
		sliderGroup.position.set(barMaxPivot, py, pz);
		sliderGroup.scale.set(scalef, scalef, scalef);
    	scene.add(sliderGroup);
		return sliderGroup;

	} else {

		//create right half semi + rect + partial/full left half semi
		//create rect + right half semi
		const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, boxDepth, 32, 1, false, 0, Math.PI);
		const rightEnd = new THREE.Mesh(cylinderGeometry, material);
    	rightEnd.position.x = radius;  // Position at the right end
		rightEnd.rotation.x = Math.PI/2;
		rightEnd.rotation.z = Math.PI;

		const rectangleGeometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth);
    	const rectangle = new THREE.Mesh(rectangleGeometry, material);
		rectangle.position.x = radius + boxWidth/2;

		
		const x = barWidth - (barWidth * vol + boxWidth + radius);
		//create right half semi
		function createPartialCircleShape(radius, startAngle, endAngle) {

			const shape = new THREE.Shape();
			shape.moveTo(
				Math.cos(startAngle) * radius,
				Math.sin(startAngle) * radius
			);
			
			shape.absarc(0, 0, radius, startAngle, Math.PI/2, false);
			shape.lineTo(0, -radius);
			shape.absarc(0, 0, radius, -Math.PI/2, endAngle, false);
		
			// Close the shape by connecting the end of the arc to the center
			shape.lineTo(x, 0);
		
			return shape;
		}            

		const startAngle = Math.acos(x/radius);           // Starting angle (in radians)
		const endAngle = -Math.acos(x/radius);
		
		const partialCircleShape = createPartialCircleShape(radius, startAngle, endAngle);

		const extrudeSettings = { depth: 0.01, bevelEnabled: false };
		const geometry = new THREE.ExtrudeGeometry(partialCircleShape, extrudeSettings);

		// Create a material and mesh
				
		const partialSemiMesh = new THREE.Mesh(geometry, material);
		partialSemiMesh.position.set(boxWidth + radius, 0, pz+0.3529);//pz-0.0009

		const sliderGroup = new THREE.Group();
    	sliderGroup.add(rightEnd);
		sliderGroup.add(rectangle);
		sliderGroup.add(partialSemiMesh);
		sliderGroup.rotation.x = screenRotation;
		sliderGroup.position.set(barMaxPivot, py, pz);
		sliderGroup.scale.set(scalef, scalef, scalef);
    	scene.add(sliderGroup);
		return sliderGroup;
	}

}

function createSoundIcon(scene, writingColor, screenRotation, px, py, pz) {

    const material = new THREE.MeshBasicMaterial({ color: writingColor, side: THREE.DoubleSide });

    // Create a group to hold all shapes
    const soundIconGroup = new THREE.Group();

    // 1. Create the square (representing the speaker's body)
    const squareGeometry = new THREE.PlaneGeometry(1, 1);
    const square = new THREE.Mesh(squareGeometry, material);
    square.position.set(0.9, 0, 0);
    soundIconGroup.add(square);

    // 2. Create the triangle (representing the speaker's cone)
    const triangleShape = new THREE.Shape();
    triangleShape.moveTo(0, 0.5);
    triangleShape.lineTo(0, -0.5);
    triangleShape.lineTo(0.4, -0.25);
	triangleShape.lineTo(0.4, 0.25);
    triangleShape.lineTo(0, 0.5);

    const triangleGeometry = new THREE.ShapeGeometry(triangleShape);
    const triangle = new THREE.Mesh(triangleGeometry, material);
    triangle.position.set(0, 0, 0);
	triangle.scale.set(2,2,2);
    soundIconGroup.add(triangle);

    // 3. Create circular arcs (representing sound waves)
    function createThickPlaneArc(innerRadius, outerRadius, startAngle, endAngle, segments) {
		const shape = new THREE.Shape();

		// Outer arc (clockwise)
		for (let i = 0; i <= segments; i++) {
			const angle = startAngle + (i / segments) * (endAngle - startAngle);
			const x = Math.cos(angle) * outerRadius;
			const y = Math.sin(angle) * outerRadius;
			if (i === 0) {
				shape.moveTo(x, y);
			} else {
				shape.lineTo(x, y);
			}
		}

		// Inner arc (counterclockwise)
		for (let i = segments; i >= 0; i--) {
			const angle = startAngle + (i / segments) * (endAngle - startAngle);
			const x = Math.cos(angle) * innerRadius;
			const y = Math.sin(angle) * innerRadius;
			shape.lineTo(x, y);
		}

		const geometry = new THREE.ShapeGeometry(shape);
		const arc = new THREE.Mesh(geometry, material);
		return arc;
	}

	const arc1 = createThickPlaneArc(1.15, 1.25, -Math.PI / 4, Math.PI / 4, 64);
	arc1.position.set(0.35, 0, 0);
	arc1.rotation.y = Math.PI;
	soundIconGroup.add(arc1);

	const arc2 = createThickPlaneArc(1.75, 1.85, -Math.PI / 4, Math.PI / 4, 64);
	arc2.position.set(0.35, 0, 0);
	arc2.rotation.y = Math.PI;
	soundIconGroup.add(arc2);


    // Add the group to the scene
	soundIconGroup.position.set(px, py, pz);
	soundIconGroup.rotation.x = screenRotation;
	const scalef = 0.05;
	soundIconGroup.scale.set(scalef, scalef, scalef);
    scene.add(soundIconGroup);
	
    return soundIconGroup;
}

function createBackButton(scene, screenColor, writingColor, screenRotation, px, py, pz) {
    const buttonGeometry = new THREE.CircleGeometry(0.04, 32);
	const buttonMaterial = new THREE.MeshBasicMaterial({ color: screenColor, side: THREE.DoubleSide }); 
	const buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);

	// Create a circle for the border 
	const borderGeometry = new THREE.CircleGeometry(0.045, 32); 
	const borderMaterial = new THREE.MeshBasicMaterial({ color: writingColor, side: THREE.DoubleSide }); 
	const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);

	buttonMesh.position.z = -0.0001;

	const buttonGroup = new THREE.Group();
	buttonGroup.add(buttonMesh);
	buttonGroup.add(borderMesh);

	buttonGroup.position.set(px, py-0.1, pz-0.016);
	buttonGroup.rotation.x = screenRotation;
	
	scene.add(buttonGroup);
	
	return buttonGroup;
}

function createBackSymbol(scene, writingColor, screenRotation, px, py, pz, callback) {
    const loader = new FontLoader();
    let textMesh;
	loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', async function (font) {

  	const textGeometry = new TextGeometry('>', {
    	font: font,
    	size: 0.045, // Font size
    	depth: 0.01, // Thickness of the text
    	curveSegments: 12,
    	bevelEnabled: false
  	});

	const textMaterial = new THREE.MeshBasicMaterial({ color: writingColor });
  	textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(px-0.015, py-0.12, pz-0.0193);
    textMesh.rotation.x = screenRotation;
    scene.add(textMesh);

    if (callback) callback(textMesh);
    });

}

function createEnvIndicator(scene, screenColor, writingColor, screenRotation, xp, yp, zp, pages) {
	const pageIndicator = new THREE.Group();
	const dx = 0.13
	const circleRadius = 0.04
	const circleBorder = 0.044

	if (pages % 2 == 0) {
		
		for (let i = dx/2 + dx*(pages/2-1); i >= -dx/2 - dx*(pages/2-1); i -= dx) {
			const button = createCircleButton(scene, screenColor, writingColor, screenRotation, i, yp+0.33, zp+0.0524, circleRadius, circleBorder);
			pageIndicator.add(button);
		}
		
	} else {

		for (let i = dx*(Math.floor(pages/2)); i >= -dx*(Math.floor(pages/2)); i -= dx) {
			const button = createCircleButton(scene, screenColor, writingColor, screenRotation, i, yp+0.33, zp+0.0524, circleRadius, circleBorder);
			pageIndicator.add(button);
		}
	}

	

	return pageIndicator;
}

export function createSettingsScreen(scene, screenColor, writingColor, screenRotation, volInitial) {

    const ypbutton = 2.62;
    const zpbutton = -0.4013;
    const volBar = createVolumeBar(scene, writingColor, screenRotation, -0.11, ypbutton+0.27, zpbutton+0.0448);
    var currentVolumeIndicator = createVolumeIndicator(scene, screenColor, screenRotation, -0.11, ypbutton+0.27, zpbutton+0.0446, volInitial);
    const soundIcon = createSoundIcon(scene, writingColor, screenRotation, 0.29, ypbutton+0.27, zpbutton+0.0427);
    const settingsBackButton = createBackButton(scene, screenColor, writingColor, screenRotation, 0, ypbutton, zpbutton);

	const yp = 2.62;
    const zp = -0.4013;
	const yoffset = -0.25;
	const envIndicator = createEnvIndicator(scene, screenColor, writingColor, screenRotation, 0, yp+yoffset, zp+zoffset(yoffset), 5)

    const settingsGroup = new THREE.Group();
    settingsGroup.add(volBar);
    settingsGroup.add(currentVolumeIndicator);
    settingsGroup.add(soundIcon);
    settingsGroup.add(settingsBackButton);
	settingsGroup.add(envIndicator);
    createBackSymbol(scene, writingColor, screenRotation, 0, ypbutton, zpbutton, function(textMesh) {
        settingsGroup.add(textMesh);
    })
   
    scene.add(settingsGroup);
    return settingsGroup;
}

function createPortText(scene, text, fontsize, writingColor, screenRotation, px, py, pz, callback) {
	const loader = new FontLoader();
    let textMesh;
	loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', async function (font) {

  	const textGeometry = new TextGeometry(text, {
    	font: font,
    	size: fontsize, // Font size
    	depth: 0.001, // Thickness of the text
    	curveSegments: 12,
    	bevelEnabled: false
  	});

	const textMaterial = new THREE.MeshBasicMaterial({ color: writingColor });
  	textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(px, py, pz);
    textMesh.rotation.x = screenRotation;
	textMesh.rotation.y = Math.PI;
	textGeometry.computeBoundingBox();
	const textBoundingBox = textGeometry.boundingBox;
	const textWidth = textBoundingBox.max.x - textBoundingBox.min.x;
	const textHeight = textBoundingBox.max.y - textBoundingBox.min.y;
	textGeometry.translate(-textWidth / 2, -textHeight / 2, 0);
    scene.add(textMesh);

    if (callback) callback(textMesh);
    });
}

export function createPortfolioScreen(scene, screenColor, writingColor, screenRotation) {

	const ypbutton = 2.62;
    const zpbutton = -0.4013;
	const buttondist = 0.26;

	const backButton = createBackButton(scene, screenColor, writingColor, screenRotation, 0, ypbutton, zpbutton);

	const leftButton = createCircleButton(scene, 0x178731, writingColor, screenRotation, buttondist, ypbutton, zpbutton, 0.13, 0.135);
	const midButton = createCircleButton(scene, 0x914316, writingColor, screenRotation, 0, ypbutton+0.21, zpbutton+0.0333, 0.13, 0.135);
	const rightButton = createCircleButton(scene, 0x1b748f, writingColor, screenRotation, -buttondist, ypbutton, zpbutton, 0.13, 0.135);


	const portfolioGroup = new THREE.Group();

	portfolioGroup.add(backButton);
	createBackSymbol(scene, writingColor, screenRotation, 0, ypbutton, zpbutton, function(textMesh) {
        portfolioGroup.add(textMesh);
    })

	portfolioGroup.add(leftButton);
	createPortText(scene, 'Projects', 0.03, writingColor, screenRotation, buttondist, ypbutton, zpbutton+0.0008, function(textMesh){
		portfolioGroup.add(textMesh);
	});

	portfolioGroup.add(midButton);
	createPortText(scene, 'About Me', 0.03, writingColor, screenRotation, 0, ypbutton+0.21, zpbutton+0.0341, function(textMesh){
		portfolioGroup.add(textMesh);
	});

	portfolioGroup.add(rightButton);
	createPortText(scene, 'Hobbies', 0.03, writingColor, screenRotation, -buttondist, ypbutton, zpbutton+0.0008, function(textMesh){
		portfolioGroup.add(textMesh);
	});
	
	scene.add(portfolioGroup);
	return portfolioGroup;
}

function createPageIndicator(scene, screenColor, writingColor, screenRotation, xp, yp, zp, radius, borderRadius, pages) {

	const pageIndicator = new THREE.Group();
	const dx = 0.05
	const circleRadius = 0.013
	const circleBorder = 0.015

	if (pages % 2 == 0) {
		
		for (let i = dx/2 + dx*(pages/2-1); i >= -dx/2 - dx*(pages/2-1); i -= dx) {
			const button = createCircleButton(scene, screenColor, writingColor, screenRotation, i, yp+0.33, zp+0.0524, circleRadius, circleBorder);
			pageIndicator.add(button);
		}
		
	} else {

		for (let i = dx*(Math.floor(pages/2)); i >= -dx*(Math.floor(pages/2)); i -= dx) {
			const button = createCircleButton(scene, screenColor, writingColor, screenRotation, i, yp+0.33, zp+0.0524, circleRadius, circleBorder);
			pageIndicator.add(button);
		}
	}

	

	return pageIndicator;
}

function create3dImage(scene, texturePath, width, height, border, xp, yp, zp, writingColor, screenRotation) {

	const geometry = new THREE.PlaneGeometry(width, height);
	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load(texturePath);
	const material = new THREE.MeshBasicMaterial({ map: texture });
	const plane = new THREE.Mesh(geometry, material);
	plane.position.set(xp, yp, zp-0.0001);
	plane.rotation.y = Math.PI;
	plane.rotation.x = screenRotation;

	const borderGeometry = new THREE.PlaneGeometry(width+2*border, height+2*border);
	const borderMaterial = new THREE.MeshBasicMaterial({ color: writingColor });
	const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
	borderMesh.position.set(xp, yp, zp);
	borderMesh.rotation.y = Math.PI;
	borderMesh.rotation.x = screenRotation;

	const image = new THREE.Group();
	image.add(plane);
	image.add(borderMesh);
  
	return image;
}

function zoffset(y) {
	return y*Math.tan(THREE.MathUtils.degToRad(9.0243));
}

export function createProjects1(scene, screenColor, writingColor, screenRotation) {

	const yp = 2.62;
    const zp = -0.4004;
	const zpText = -0.3994;

	const y1 = -0.04;
	const y2 = -0.04;
	const pianowireframe = create3dImage(scene, pianowireframeURL, 0.26, 0.23, 0.002, 0.27, yp+y1, zp+zoffset(y1), writingColor, screenRotation);
	const pianorig = create3dImage(scene, pianorigURL, 0.26, 0.23, 0.002, -0.27, yp+y2, zp+zoffset(y2), writingColor, screenRotation);

	const pageGroup = new THREE.Group();
	pageGroup.add(pianowireframe);
	pageGroup.add(pianorig);

	const fontsize = 0.012;

	const ytitle = 0.27;
	const y3 = 0.22;
	const y4 = 0.195;
	const y5 = 0.17;
	const y6 = 0.145;
	const y7 = 0.12;

	const title = 'Portfolio Website';
	const t1 = 'A creative portfolio website I created to showcase my frontend skills in 3D modeling, animation, and web';
	const t2 = 'development. This website features a 3D interactive scene created using three.js, with an interactive iPad';
	const t3 = 'and an animated piano scene created using blender. The piano scene has over 7000 frames at 30fps, each';
	const t4 = 'frame was meticulously designed to match my real playing and the techniques of the piece. The actual portfolio';
	const t5 = 'is presented inside the iPad created using three.js objects.';

	const p1 = 'Technical Skills';
	const p1y = 0.04;
	const p2 = 'Creative Skills';
	const p2y = 0;
	const p3 = 'Attention to detail';
	const p3y = -0.04;
	const p4 = 'Problem-solving';
	const p4y = -0.08;
	const p5 = 'Implementation';
	const p5y = -0.12;

	createPortText(scene, title, 0.018, writingColor, screenRotation, 0, yp+ytitle, zpText+zoffset(ytitle), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t1, fontsize, writingColor, screenRotation, 0, yp+y3, zpText+zoffset(y3), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t2, fontsize, writingColor, screenRotation, 0, yp+y4, zpText+zoffset(y4), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t3, fontsize, writingColor, screenRotation, 0, yp+y5, zpText+zoffset(y5), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t4, fontsize, writingColor, screenRotation, 0, yp+y6, zpText+zoffset(y6), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t5, fontsize, writingColor, screenRotation, 0, yp+y7, zpText+zoffset(y7), function(textMesh) {
		pageGroup.add(textMesh);
	});

	createPortText(scene, p1, fontsize, writingColor, screenRotation, 0, yp+p1y, zpText+zoffset(p1y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p2, fontsize, writingColor, screenRotation, 0, yp+p2y, zpText+zoffset(p2y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p3, fontsize, writingColor, screenRotation, 0, yp+p3y, zpText+zoffset(p3y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p4, fontsize, writingColor, screenRotation, 0, yp+p4y, zpText+zoffset(p4y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p5, fontsize, writingColor, screenRotation, 0, yp+p5y, zpText+zoffset(p5y), function(textMesh) {
		pageGroup.add(textMesh);
	});

	scene.add(pageGroup);
	return pageGroup;
}

export function createProjects2(scene, screenColor, writingColor, screenRotation) {

	const yp = 2.62;
    const zp = -0.4004;
	const zpText = -0.3994;

	const y1 = -0.04;
	const y2 = -0.04;
	const pianowireframe = create3dImage(scene, starorbitURL, 0.26, 0.23, 0.002, 0.27, yp+y1, zp+zoffset(y1), writingColor, screenRotation);
	const pianorig = create3dImage(scene, starinventoryURL, 0.26, 0.23, 0.002, -0.27, yp+y2, zp+zoffset(y2), writingColor, screenRotation);

	const pageGroup = new THREE.Group();
	pageGroup.add(pianowireframe);
	pageGroup.add(pianorig);

	const fontsize = 0.012;

	const ytitle = 0.27;
	const y3 = 0.22;
	const y4 = 0.195;
	const y5 = 0.17;
	const y6 = 0.145;
	const y7 = 0.12;

	const title = 'Star Simulator';
	const t1 = 'Star Simulator is a game I developed on Roblox where players collect different stars to sell them and upgrade';
	const t2 = 'their orbit (star storage), with a custom inventory system sorted by orbit, allowing players to customize the';
	const t3 = 'orbit surrounding their player character. This project showcases my skills in scripting, game design, map creation,';
	const t4 = 'and both frontend and backend development. For the frontend I used Roblox\'s GUI tools to create a fully functional';
	const t5 = 'inventory interface and used Roblox\'s data stores for the backend to save player progress and data in Lua.';

	const p1 = 'Technical Skills';
	const p1y = 0.04;
	const p2 = 'Creative Skills';
	const p2y = 0;
	const p3 = 'Environment design';
	const p3y = -0.04;
	const p4 = 'Problem-solving';
	const p4y = -0.08;
	const p5 = 'Project Management';
	const p5y = -0.12;

	createPortText(scene, title, 0.018, writingColor, screenRotation, 0, yp+ytitle, zpText+zoffset(ytitle), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t1, fontsize, writingColor, screenRotation, 0, yp+y3, zpText+zoffset(y3), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t2, fontsize, writingColor, screenRotation, 0, yp+y4, zpText+zoffset(y4), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t3, fontsize, writingColor, screenRotation, 0, yp+y5, zpText+zoffset(y5), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t4, fontsize, writingColor, screenRotation, 0, yp+y6, zpText+zoffset(y6), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t5, fontsize, writingColor, screenRotation, 0, yp+y7, zpText+zoffset(y7), function(textMesh) {
		pageGroup.add(textMesh);
	});

	createPortText(scene, p1, fontsize, writingColor, screenRotation, 0, yp+p1y, zpText+zoffset(p1y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p2, fontsize, writingColor, screenRotation, 0, yp+p2y, zpText+zoffset(p2y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p3, fontsize, writingColor, screenRotation, 0, yp+p3y, zpText+zoffset(p3y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p4, fontsize, writingColor, screenRotation, 0, yp+p4y, zpText+zoffset(p4y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p5, fontsize, writingColor, screenRotation, 0, yp+p5y, zpText+zoffset(p5y), function(textMesh) {
		pageGroup.add(textMesh);
	});

	scene.add(pageGroup);
	return pageGroup;
}

export function createProjects3(scene, screenColor, writingColor, screenRotation) {

	const yp = 2.62;
    const zp = -0.4004;
	const zpText = -0.3994;

	const y1 = -0.04;
	const y2 = -0.04;
	const lugiadata = create3dImage(scene, lugiadataURL, 0.20, 0.23, 0.002, 0.28, yp+y1, zp+zoffset(y1), writingColor, screenRotation);
	const dialgadata = create3dImage(scene, dialgadataURL, 0.20, 0.23, 0.002, -0.28, yp+y2, zp+zoffset(y2), writingColor, screenRotation);

	const pageGroup = new THREE.Group();
	pageGroup.add(lugiadata);
	pageGroup.add(dialgadata);

	const fontsize = 0.012;

	const ytitle = 0.27;
	const y3 = 0.22;
	const y4 = 0.195;
	const y5 = 0.17;
	const y6 = 0.145;
	const y7 = 0.12;

	const title = 'Pokemon Webscraping Project';
	const t1 = 'A Python-based web scraping tool I made using the Beautiful Soup library to extract detailed data from a';
	const t2 = 'Pokemon database website. This project allows users to conveniently access and display information such as';
	const t3 = 'Pokedex number, stats, and level-up moves for any Pokemon directly from the terminal with simple commands.';
	const t4 = 'The raw HTML data is first extracted using Requests and Beautiful Soup libraries and the targetted data is';
	const t5 = 'then processed by parsing the HTML text and is then organized into a dictionary data structure for easy access.';

	const p1 = 'Web Scraping';
	const p1y = 0.04;
	const p2 = 'Python Scripting';
	const p2y = 0;
	const p3 = 'Data Processing';
	const p3y = -0.04;
	const p4 = 'Attention to Detail';
	const p4y = -0.08;
	const p5 = 'HTML Knowledge';
	const p5y = -0.12;

	createPortText(scene, title, 0.018, writingColor, screenRotation, 0, yp+ytitle, zpText+zoffset(ytitle), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t1, fontsize, writingColor, screenRotation, 0, yp+y3, zpText+zoffset(y3), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t2, fontsize, writingColor, screenRotation, 0, yp+y4, zpText+zoffset(y4), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t3, fontsize, writingColor, screenRotation, 0, yp+y5, zpText+zoffset(y5), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t4, fontsize, writingColor, screenRotation, 0, yp+y6, zpText+zoffset(y6), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t5, fontsize, writingColor, screenRotation, 0, yp+y7, zpText+zoffset(y7), function(textMesh) {
		pageGroup.add(textMesh);
	});

	createPortText(scene, p1, fontsize, writingColor, screenRotation, 0, yp+p1y, zpText+zoffset(p1y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p2, fontsize, writingColor, screenRotation, 0, yp+p2y, zpText+zoffset(p2y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p3, fontsize, writingColor, screenRotation, 0, yp+p3y, zpText+zoffset(p3y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p4, fontsize, writingColor, screenRotation, 0, yp+p4y, zpText+zoffset(p4y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p5, fontsize, writingColor, screenRotation, 0, yp+p5y, zpText+zoffset(p5y), function(textMesh) {
		pageGroup.add(textMesh);
	});

	scene.add(pageGroup);
	return pageGroup;
}

export function createProjectsScreen(scene, screenColor, writingColor, screenRotation) {

	const yp = 2.62;
    const zp = -0.4013;

	const projectsColor = 0x178731;
	const closeButton = createCircleButton(scene, screenColor, writingColor, screenRotation, -0.383, yp+0.33, zp+0.0524, 0.02, 0.022);
	const pageIndicator = createPageIndicator(scene, screenColor, writingColor, screenRotation, 0, yp, zp, 1, 1.1, 3)
	


	const projectsGroup = new THREE.Group();

	projectsGroup.add(closeButton);
	projectsGroup.add(pageIndicator);
	createPortText(scene, 'x', 0.02, writingColor, screenRotation, -0.383, yp+0.33, zp+0.0524, function(textMesh) {
		projectsGroup.add(textMesh);
	});
	

	scene.add(projectsGroup);
	return projectsGroup;

}

export function createAboutScreen(scene, screenColor, writingColor, screenRotation) {

	const yp0 = 2.62;
    const zp0 = -0.4013;
	const aboutColor = 0x914316;
	const closeButton = createCircleButton(scene, screenColor, writingColor, screenRotation, -0.383, yp0+0.33, zp0+0.0524, 0.02, 0.022);

	const pageGroup = new THREE.Group();

	pageGroup.add(closeButton);
	createPortText(scene, 'x', 0.02, writingColor, screenRotation, -0.383, yp0+0.33, zp0+0.0524, function(textMesh) {
		pageGroup.add(textMesh);
	});

	const dy = 0.02;
	const yp = 2.62;
    const zp = -0.4004;
	const zpText = -0.3994;

	const fontsize = 0.012;
	
	const y3 = 0.22+dy;
	const y4 = 0.195+dy;
	const y5 = 0.17+dy;
	const y6 = 0.145+dy;
	const y7 = 0.12+dy;
	const y8 = 0.095+dy;
	
	const y9 = 0.04+dy;
	const y10 = dy;
	const y11 = -0.04+dy;
	
	const t1 = 'Hi I\'m Dane, a third-year software engineering student at the University of Alberta. I have a passion for';
	const t2 = 'creating immersive and interactive games and digital experiences. I love using code as a tool to bring ideas';
	const t3 = 'to life, such as this portfolio website. I wanted to recreate my piano setup at home as an interactive ';
	const t4 = 'experience that not only showcases my technical skills, but also reflects my hobbies, interests, and love for ';
	const t5 = 'music. Throughout my studies and personal projects, I have gained hands-on experience in a wide range of';
	const t6 = 'programming languages and tools, allowing me to explore both front-end and back-end development.';

	const t7 = 'Languages: Assembly, Bash, C, C++, CSS, HTML, JavaScript, Lua, MATLAB, Python, VHDL';
	const t8 = 'Software: Blender, Excel, GitHub, Google Drive, PowerPoint, Vivado';
	const t9 = 'Contact: daneaiir0@gmail.com / dswong1@ualberta.ca';

	const p1 = 'Web Scraping';
	const p1y = 0.04;
	const p2 = 'Python Scripting';
	const p2y = 0;
	const p3 = 'Data Processing';
	const p3y = -0.04;
	const p4 = 'Attention to Detail';
	const p4y = -0.08;
	const p5 = 'HTML Knowledge';
	const p5y = -0.12;

	createPortText(scene, t1, fontsize, writingColor, screenRotation, 0, yp+y3, zpText+zoffset(y3), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t2, fontsize, writingColor, screenRotation, 0, yp+y4, zpText+zoffset(y4), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t3, fontsize, writingColor, screenRotation, 0, yp+y5, zpText+zoffset(y5), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t4, fontsize, writingColor, screenRotation, 0, yp+y6, zpText+zoffset(y6), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t5, fontsize, writingColor, screenRotation, 0, yp+y7, zpText+zoffset(y7), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t6, fontsize, writingColor, screenRotation, 0, yp+y8, zpText+zoffset(y8), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t7, fontsize, writingColor, screenRotation, 0, yp+y9, zpText+zoffset(y9), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t8, fontsize, writingColor, screenRotation, 0, yp+y10, zpText+zoffset(y10), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t9, fontsize, writingColor, screenRotation, 0, yp+y11, zpText+zoffset(y11), function(textMesh) {
		pageGroup.add(textMesh);
	});
	
	
	scene.add(pageGroup);
	return pageGroup;

}

export function createHobbies1(scene, screenColor, writingColor, screenRotation) {

	const yp = 2.62;
    const zp = -0.4004;
	const zpText = -0.3994;

	const y1 = -0.04;
	const y2 = -0.04;
	const chalpromo = create3dImage(scene, chalpromoURL, 0.14, 0.23, 0.002, 0.33, yp+y1, zp+zoffset(y1), writingColor, screenRotation);
	const tacticstool = create3dImage(scene, tacticstoolURL, 0.13, 0.23, 0.002, -0.34, yp+y2, zp+zoffset(y2), writingColor, screenRotation);

	const pageGroup = new THREE.Group();
	pageGroup.add(chalpromo);
	pageGroup.add(tacticstool);

	const fontsize = 0.012;

	const ytitle = 0.27;
	const y3 = 0.22;
	const y4 = 0.195;
	const y5 = 0.17;
	const y6 = 0.145;
	const y7 = 0.12;

	const title = 'Teamfight Tactics';
	const t1 = 'TFT is a strategy-based autobattler game that is based on characters from League of Legends.';
	const t2 = 'I\'ve been playing TFT for over three years and have reached the highest rank Challenger, placing me';
	const t3 = 'among the top ~250 players in North America. Reaching this rank involved competing against professional';
	const t4 = 'players and climbing a highly competitive ladder. Through this experience, I developed valuable skills';
	const t5 = 'that are transferable to a professional setting in software engineering, such as:';

	const p1 = 'Problem-solving';
	const p1y = 0.04;
	const p2 = 'Attention to detail';
	const p2y = 0;
	const p3 = 'Flexibility and Adaptability';
	const p3y = -0.04;
	const p4 = 'Consistency';
	const p4y = -0.08;
	const p5 = 'Awareness';
	const p5y = -0.12;

	createPortText(scene, title, 0.018, writingColor, screenRotation, 0, yp+ytitle, zpText+zoffset(ytitle), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t1, fontsize, writingColor, screenRotation, 0, yp+y3, zpText+zoffset(y3), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t2, fontsize, writingColor, screenRotation, 0, yp+y4, zpText+zoffset(y4), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t3, fontsize, writingColor, screenRotation, 0, yp+y5, zpText+zoffset(y5), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t4, fontsize, writingColor, screenRotation, 0, yp+y6, zpText+zoffset(y6), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t5, fontsize, writingColor, screenRotation, 0, yp+y7, zpText+zoffset(y7), function(textMesh) {
		pageGroup.add(textMesh);
	});

	createPortText(scene, p1, fontsize, writingColor, screenRotation, 0, yp+p1y, zpText+zoffset(p1y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p2, fontsize, writingColor, screenRotation, 0, yp+p2y, zpText+zoffset(p2y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p3, fontsize, writingColor, screenRotation, 0, yp+p3y, zpText+zoffset(p3y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p4, fontsize, writingColor, screenRotation, 0, yp+p4y, zpText+zoffset(p4y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p5, fontsize, writingColor, screenRotation, 0, yp+p5y, zpText+zoffset(p5y), function(textMesh) {
		pageGroup.add(textMesh);
	});

	scene.add(pageGroup);
	return pageGroup;
}

export function createHobbies2(scene, screenColor, writingColor, screenRotation) {

	const yp = 2.62;
    const zp = -0.4004;
	const zpText = -0.3994;

	const y1 = -0.04;
	const y2 = -0.04;
	const masterpromo = create3dImage(scene, masterpromoURL, 0.14, 0.23, 0.002, 0.33, yp+y1, zp+zoffset(y1), writingColor, screenRotation);
	const asolmastery = create3dImage(scene, asolMasteryURL, 0.13, 0.23, 0.002, -0.34, yp+y2, zp+zoffset(y2), writingColor, screenRotation);

	const pageGroup = new THREE.Group();
	pageGroup.add(masterpromo);
	pageGroup.add(asolmastery);

	const fontsize = 0.012;

	const ytitle = 0.27;
	const y3 = 0.22;
	const y4 = 0.195;
	const y5 = 0.17;
	const y6 = 0.145;
	const y7 = 0.12;

	const title = 'League of Legends';
	const t1 = 'LoL is a highly popular and competitive MOBA game that has 160+ unique champions each with their own';
	const t2 = 'abilities and interactions with one another. Achieving a high rank in this game requires dedication,';
	const t3 = 'skill, and application of knowledge. I have been playing LoL for 4 years and recently promoted to master';
	const t4 = 'tier (top 1%) in season 2024. LoL has a lot of the same skill sets from TFT, but since LoL is a 5v5 game, there is a';
	const t5 = 'much larger emphasis on how you can apply your individual skill within a more dynamic team environment.';

	const p1 = 'Strategic Thinking';
	const p1y = 0.04;
	const p2 = 'Team Coordination';
	const p2y = 0;
	const p3 = 'Adaptability';
	const p3y = -0.04;
	const p4 = 'Time and Resource Management';
	const p4y = -0.08;
	const p5 = 'Resilience';
	const p5y = -0.12;

	createPortText(scene, title, 0.018, writingColor, screenRotation, 0, yp+ytitle, zpText+zoffset(ytitle), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t1, fontsize, writingColor, screenRotation, 0, yp+y3, zpText+zoffset(y3), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t2, fontsize, writingColor, screenRotation, 0, yp+y4, zpText+zoffset(y4), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t3, fontsize, writingColor, screenRotation, 0, yp+y5, zpText+zoffset(y5), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t4, fontsize, writingColor, screenRotation, 0, yp+y6, zpText+zoffset(y6), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t5, fontsize, writingColor, screenRotation, 0, yp+y7, zpText+zoffset(y7), function(textMesh) {
		pageGroup.add(textMesh);
	});

	createPortText(scene, p1, fontsize, writingColor, screenRotation, 0, yp+p1y, zpText+zoffset(p1y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p2, fontsize, writingColor, screenRotation, 0, yp+p2y, zpText+zoffset(p2y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p3, fontsize, writingColor, screenRotation, 0, yp+p3y, zpText+zoffset(p3y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p4, fontsize, writingColor, screenRotation, 0, yp+p4y, zpText+zoffset(p4y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p5, fontsize, writingColor, screenRotation, 0, yp+p5y, zpText+zoffset(p5y), function(textMesh) {
		pageGroup.add(textMesh);
	});

	scene.add(pageGroup);
	return pageGroup;
}

export function createHobbies3(scene, screenColor, writingColor, screenRotation) {

	const yp = 2.62;
    const zp = -0.4004;
	const zpText = -0.3994;

	const y1 = -0.065;
	const y2 = -0.065;
	const pianoimage = create3dImage(scene, pianoImageURL, 0.14, 0.2, 0.002, 0.33, yp+y1, zp+zoffset(y1), writingColor, screenRotation);
	const frenchhorn = create3dImage(scene, frenchhornURL, 0.14, 0.2, 0.002, -0.34, yp+y2, zp+zoffset(y2), writingColor, screenRotation);

	const pageGroup = new THREE.Group();
	pageGroup.add(pianoimage);
	pageGroup.add(frenchhorn);

	const fontsize = 0.012;

	const ytitle = 0.27;
	const y3 = 0.22;
	const y4 = 0.195;
	const y5 = 0.17;
	const y6 = 0.145;
	const y7 = 0.12;
	const y8 = 0.095
	const y9 = 0.07

	const xseparation = 0.217;

	const title = 'Piano';
	const t1 = 'I have been playing the piano for 8 years enjoying';
	const t2 = 'all kinds of genres of music including pop, anime,';
	const t3 = 'video game soundtracks, romantic, and classical.';
	const t4 = 'Through my journey so far I have not only honed my';
	const t5 = 'musical abilities, but also have gained and developed';
	const t6 = 'a variety of transferable skills that are valuable in';
	const t7 = 'both personal and professional settings.'

	const title2 = 'French Horn';
	const s1 = 'I have 6 years of experience playing the french';
	const s2 = 'horn throughout junior high and high school, playing';
	const s3 = 'in the honour bands and for events at the school.';
	const s4 = 'Playing the french horn as a second instrument has';
	const s5 = 'helped me gain a broader understanding of music';
	const s6 = 'in general and developed my relative pitch, as well';
	const s7 = 'as skills such as discipline, practice, and patience.';

	const p1 = 'Creativity and Expression';
	const p1y = 0.02;
	const p2 = 'Concentration';
	const p2y = -0.02;
	const p3 = 'Commitment';
	const p3y = -0.06;
	const p4 = 'Discipline';
	const p4y = -0.1;
	const p5 = 'Attention to detail';
	const p5y = -0.14;

	createPortText(scene, title, 0.018, writingColor, screenRotation, xseparation, yp+ytitle, zpText+zoffset(ytitle), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t1, fontsize, writingColor, screenRotation, xseparation, yp+y3, zpText+zoffset(y3), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t2, fontsize, writingColor, screenRotation, xseparation, yp+y4, zpText+zoffset(y4), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t3, fontsize, writingColor, screenRotation, xseparation, yp+y5, zpText+zoffset(y5), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t4, fontsize, writingColor, screenRotation, xseparation, yp+y6, zpText+zoffset(y6), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t5, fontsize, writingColor, screenRotation, xseparation, yp+y7, zpText+zoffset(y7), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t6, fontsize, writingColor, screenRotation, xseparation, yp+y8, zpText+zoffset(y8), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, t7, fontsize, writingColor, screenRotation, xseparation, yp+y9, zpText+zoffset(y9), function(textMesh) {
		pageGroup.add(textMesh);
	});

	createPortText(scene, title2, 0.018, writingColor, screenRotation, -xseparation, yp+ytitle, zpText+zoffset(ytitle), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, s1, fontsize, writingColor, screenRotation, -xseparation, yp+y3, zpText+zoffset(y3), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, s2, fontsize, writingColor, screenRotation, -xseparation, yp+y4, zpText+zoffset(y4), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, s3, fontsize, writingColor, screenRotation, -xseparation, yp+y5, zpText+zoffset(y5), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, s4, fontsize, writingColor, screenRotation, -xseparation, yp+y6, zpText+zoffset(y6), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, s5, fontsize, writingColor, screenRotation, -xseparation, yp+y7, zpText+zoffset(y7), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, s6, fontsize, writingColor, screenRotation, -xseparation, yp+y8, zpText+zoffset(y8), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, s7, fontsize, writingColor, screenRotation, -xseparation, yp+y9, zpText+zoffset(y9), function(textMesh) {
		pageGroup.add(textMesh);
	});



	createPortText(scene, p1, fontsize, writingColor, screenRotation, 0, yp+p1y, zpText+zoffset(p1y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p2, fontsize, writingColor, screenRotation, 0, yp+p2y, zpText+zoffset(p2y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p3, fontsize, writingColor, screenRotation, 0, yp+p3y, zpText+zoffset(p3y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p4, fontsize, writingColor, screenRotation, 0, yp+p4y, zpText+zoffset(p4y), function(textMesh) {
		pageGroup.add(textMesh);
	});
	createPortText(scene, p5, fontsize, writingColor, screenRotation, 0, yp+p5y, zpText+zoffset(p5y), function(textMesh) {
		pageGroup.add(textMesh);
	});

	scene.add(pageGroup);
	return pageGroup;
}

export function createHobbiesScreen(scene, screenColor, writingColor, screenRotation) {

	const yp = 2.62;
    const zp = -0.4013;

	const hobbiesColor = 0x1b748f;
	const closeButton = createCircleButton(scene, screenColor, writingColor, screenRotation, -0.383, yp+0.33, zp+0.0524, 0.02, 0.022);
	const pageIndicator = createPageIndicator(scene, screenColor, writingColor, screenRotation, 0, yp, zp, 1, 1.1, 3)


	const hobbiesGroup = new THREE.Group();

	hobbiesGroup.add(closeButton);
	hobbiesGroup.add(pageIndicator);
	createPortText(scene, 'x', 0.02, writingColor, screenRotation, -0.383, yp+0.33, zp+0.0524, function(textMesh) {
		hobbiesGroup.add(textMesh);
	});
	
	scene.add(hobbiesGroup);
	return hobbiesGroup;

}