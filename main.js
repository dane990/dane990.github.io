import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createText, OrbitControls } from 'three/examples/jsm/Addons.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { Reflector } from 'three/examples/jsm/Addons.js';
import { LightProbeHelper } from 'three/addons/helpers/LightProbeHelper.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import skyTextureUrl from './assets/sky.jpg';
import sky2TextureUrl from './assets/sky2.jpg';
import sky3TextureUrl from './assets/sky3.jpg';
import sky4TextureUrl from './assets/sky4.jpg';
import sky5TextureUrl from './assets/sky5.jpg';

import { wait, daysOfWeek, months, disposeGroup } from './utils.js';
import { createScreen, updateTimeMesh, createMenuScreen, createVolumeIndicator, createSettingsScreen, createPortfolioScreen, createProjectsScreen, createAboutScreen, createHobbiesScreen} from './ui.js';
import { createProjects1, createProjects2, createProjects3, createHobbies1, createHobbies2, createHobbies3, } from './ui.js';
const { MathUtils, Vector3 } = THREE;

//scene, camera, renderer-------------------------------------------------------------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const sceneUrl = new URL('piano2.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xA3A3A3);
document.body.appendChild(renderer.domElement);

//loading screen-------------------------------------------------------------------------------------------
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = function(url, itemsLoaded, itemsTotal) {
	document.getElementById('loading-screen').style.display = 'flex';
};

loadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {
	const progress = Math.round((itemsLoaded / itemsTotal) * 100); // Calculate loading progress
    const progressElement = document.getElementById('loading-progress');
    if (progressElement) {  // Check if the element exists
        progressElement.textContent = `${progress}%`; // Update progress text
    }
};

loadingManager.onLoad = function() {
	setTimeout(() => {
		document.getElementById('loading-screen').style.display = 'none';
	}, 2000);	
};

//user controls-------------------------------------------------------------------------------------------
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0,3,-2.5);
orbit.target.set(0,2.4,-1);
orbit.enablePan = false;
orbit.maxDistance = 10;
orbit.minDistance = 0.7;
orbit.maxPolarAngle = Math.PI/2;
orbit.enableDamping = true;

let menuToPortfolio;
let portfolioToMenu;

//sound-------------------------------------------------------------------------------------------
const initialVolume = 0.5;
const listener = new THREE.AudioListener();
camera.add( listener );
const sound = new THREE.Audio( listener );
const audioLoader = new THREE.AudioLoader(loadingManager);
const soundUrl = new URL('pianosound.mp3', import.meta.url);

let screen;
let menuScreen;
let settingsScreen;
let portfolioScreen;
let projectsScreen;
let projects1;
let projects2;
let projects3;
let aboutScreen;
let hobbiesScreen;
let hobbies1;
let hobbies2;
let hobbies3;

audioLoader.load( soundUrl.href, function( buffer ) {
	sound.setBuffer( buffer );
	sound.setVolume(initialVolume);
});



//piano model/scene-------------------------------------------------------------------------------------------
const assetLoader = new GLTFLoader(loadingManager);

const screenColor = 0x22292b;
const writingColor = 0xffffff;
const screenRotation = THREE.MathUtils.degToRad(9.0243);
let mixer;
let action;
let hands;
let midButton;
let midButton2;
let playSymbol;
let stopSymbol;

let menuCameraPosition;
let menuTargetPosition;
let portCameraPosition;
let portTargetPosition;

let menuToPortAnim = false;
let portToMenuAnim = false;
let animStartTime = 0;

assetLoader.load(sceneUrl.href, function(gltf) {

	//add scene, invis hands
	const model = gltf.scene;
	scene.add(model);

	hands = model.getObjectByName('Ch36');
	hands.visible = false;

	//initialize animation
	mixer = new THREE.AnimationMixer(model);
	const clips = gltf.animations;
	const clip = THREE.AnimationClip.findByName(clips, 'Scene');
	action = mixer.clipAction(clip);
	action.setLoop(THREE.LoopOnce);

	//reset animation event
	mixer.addEventListener('finished', function() {

		midButton2.visible = false;
		stopSymbol.visible = false;

		hands.visible = false;
		mixer.stopAllAction();
		mixer.update(0);
		action.time = 0;
		sound.stop();

		midButton.visible = true;
		playSymbol.visible = true;

	});

	//create the uis
	screen = createScreen(scene, screenColor, screenRotation);	

	menuScreen = createMenuScreen(scene, screenColor, writingColor, screenRotation);
	const timeInterval = setInterval(function() {
	updateTimeMesh(scene, menuScreen, screenRotation, writingColor, daysOfWeek, months);
	}, 1000);
	settingsScreen = createSettingsScreen(scene, screenColor, writingColor, screenRotation, initialVolume);
	portfolioScreen = createPortfolioScreen(scene, screenColor, writingColor, screenRotation);

	projectsScreen = createProjectsScreen(scene, screenColor, writingColor, screenRotation);
	projects1 = createProjects1(scene, screenColor, writingColor, screenRotation);
	projects2 = createProjects2(scene, screenColor, writingColor, screenRotation);
	projects3 = createProjects3(scene, screenColor, writingColor, screenRotation);

	aboutScreen = createAboutScreen(scene, screenColor, writingColor, screenRotation);

	hobbiesScreen = createHobbiesScreen(scene, screenColor, writingColor, screenRotation)
	hobbies1 = createHobbies1(scene, screenColor, writingColor, screenRotation);
	hobbies2 = createHobbies2(scene, screenColor, writingColor, screenRotation);
	hobbies3 = createHobbies3(scene, screenColor, writingColor, screenRotation);

	//screen setup
	menuScreen.visible = true;
	settingsScreen.visible = false;
	settingsScreen.children[4].children[0].children[0].visible = false; //select first backround
	portfolioScreen.visible = false;

	projectsScreen.visible = false;
	projects1.visible = false;
	projects2.visible = false;
	projects3.visible = false;

	aboutScreen.visible = false;

	hobbiesScreen.visible = false;
	hobbies1.visible = false;
	hobbies2.visible = false;
	hobbies3.visible = false;

	//temp cam adjustment
	const camDist = 0.4;
	const cam_y = camDist*Math.sin(screenRotation);
	const cam_z = camDist*Math.cos(screenRotation);
	
	/*
	camera.position.set(0,screen.position.y+cam_y,screen.position.z-cam_z);
	//camera.position.set(screen.position.x, screen.position.y, screen.position.z);
	orbit.target.set(screen.position.x, screen.position.y-cam_y, screen.position.z+cam_z);
	camera.minDistance = 0;
	*/

	const menuCameraPosition = new THREE.Vector3(0,3,-2.5);
	const menuTargetPosition = new THREE.Vector3(0,2.4,-1);
	const portCameraPosition = new THREE.Vector3(0,screen.position.y+cam_y,screen.position.z-cam_z);
	const portTargetPosition = new THREE.Vector3(screen.position.x, screen.position.y-cam_y, screen.position.z+cam_z);

	menuToPortfolio = function() {
		let elapsedTime = 0;
  		const duration = 2; // Duration in seconds
  		const clock = new THREE.Clock();

  		function animate() {
    		requestAnimationFrame(animate);
			

    		elapsedTime += clock.getDelta();
    		const t = Math.min(elapsedTime / duration, 1); // Progress ratio from 0 to 1

    		// Interpolate the camera position
    		camera.position.lerpVectors(menuCameraPosition, portCameraPosition, t);

    		// Interpolate the orbit target
    		orbit.target.lerpVectors(menuTargetPosition, portTargetPosition, t);

    		// Update the orbit controls
    		orbit.update();

    		// Render the scene
    		renderer.render(scene, camera);

    // Stop the animation when complete
    		if (t === 1) return; // Stops calling `animate` when animation is done
  		}

  		animate();
	}
	renderer.setAnimationLoop(animate);
	//animate loop
	
	function animate() {

		//menu to port
		if (menuToPortAnim) {
			const cameraAnimationDuration = 2;
        	const elapsedTime = (Date.now() - animStartTime) / 1000; 
        	const t = Math.min(elapsedTime / cameraAnimationDuration, 1); 
        	camera.position.lerpVectors(menuCameraPosition, portCameraPosition, t);
        	orbit.target.lerpVectors(menuTargetPosition, portTargetPosition, t);
        	orbit.update();
        	if (t === 1) {
            	menuToPortAnim = false;
        	}
    	} else if (portToMenuAnim) {
			const cameraAnimationDuration = 2;
        	const elapsedTime = (Date.now() - animStartTime) / 1000; 
        	const t = Math.min(elapsedTime / cameraAnimationDuration, 1); 
        	camera.position.lerpVectors(portCameraPosition, menuCameraPosition, t);
        	orbit.target.lerpVectors(portTargetPosition, menuTargetPosition, t);
        	orbit.update();
        	if (t === 1) {
            	portToMenuAnim = false;
        	}
		}

		orbit.update();
		if (sphere) {
			sphere.rotation.y += 0.0001;
		}
	
		if (mixer) {
			mixer.update(clock.getDelta());
		}
		renderer.render(scene, camera);
}




}, undefined, function(error) {
	console.error(error);
});





//play animation-------------------------------------------------------------------------------------------
const clock = new THREE.Clock();

// Helper function to get the current time in milliseconds
function getCurrentTime() {
    return performance.now();
}

async function playAnimation() {
    if (sound && mixer && action) {
        const startTime = getCurrentTime(); // Record the start time


        // Play sound
        sound.play();
       

        // Wait until the sound and animation are in sync
     
        const waitUntil = startTime + 100; // Adjust if necessary (in milliseconds)
        while (getCurrentTime() < waitUntil) {
            await new Promise(resolve => setTimeout(resolve, 10)); // Small delay to prevent blocking
        }

		 // Set the action to play at the same time
        action.reset();
        action.play();
        hands.visible = true;
		
    }
}

function stopAndResetAnimation() {
	hands.visible = false;
	mixer.stopAllAction();
	mixer.update(0);
	action.time = 0;
	
	sound.stop();

}



//background-------------------------------------------------------------------------------------------
const light = new THREE.PointLight( 0xFFFFFF , 500); // soft white light
const light2 = new THREE.AmbientLight(0xFFFFFF, 10);
//light.position.set(0, 8, -10)
light.position.set(0, 8, -10)
scene.add( light );


const textureLoader = new THREE.TextureLoader();

let sphere;
textureLoader.load(skyTextureUrl, function(texture) {
    const sphereGeometry = new THREE.SphereGeometry(200, 32, 32); // Large radius
    const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
});

function updateSphereTexture(newTextureUrl) {
    // Load the new texture
    textureLoader.load(newTextureUrl, function(newTexture) {
        // Update the sphere's material map with the new texture
        sphere.material.map = newTexture;
        sphere.material.needsUpdate = true; // Notify Three.js to update the material
    });
}




//floor-------------------------------------------------------------------------------------------
const circleGeometry = new THREE.CircleGeometry(400);
const groundMirror = new Reflector( circleGeometry, {
	clipBias: 0.003,
	textureWidth: window.innerWeight * window.devicePixelRatio * 3,
	textureHeight: window.innerHeight * window.devicePixelRatio * 3,
	color: 0xb5b5b5
});
groundMirror.rotateX( -Math.PI/2 );
scene.add( groundMirror );


window.addEventListener('resize', function() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});


// Raycaster and mouse setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function updateRaycaster(event, menuScreen, settingsScreen) {

	// Convert mouse position to normalized device coordinates (NDC)
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	// Update the raycaster based on the camera and mouse position
	raycaster.setFromCamera(mouse, camera);

	const intersects = {
		//menu
		midButton: raycaster.intersectObject(menuScreen.children[0]),
		playSymbol: raycaster.intersectObject(menuScreen.children[1]),
		midButton2: raycaster.intersectObject(menuScreen.children[2]),
		stopSymbol: raycaster.intersectObject(menuScreen.children[3]),
		leftButton: raycaster.intersectObject(menuScreen.children[4]),
		portSymbol: raycaster.intersectObject(menuScreen.children[5]),
		portHandle: raycaster.intersectObject(menuScreen.children[6]),
		rightButton: raycaster.intersectObject(menuScreen.children[7]),
		settingsIcon: raycaster.intersectObject(menuScreen.children[8]),
		gearCenter: raycaster.intersectObject(menuScreen.children[9]),
		//settings
		volBar: raycaster.intersectObject(settingsScreen.children[0]),
		backButton: raycaster.intersectObject(settingsScreen.children[3]),
		backSymbol: raycaster.intersectObject(settingsScreen.children[5]),
		settings1Button: raycaster.intersectObject(settingsScreen.children[4].children[0]),
		settings2Button: raycaster.intersectObject(settingsScreen.children[4].children[1]),
		settings3Button: raycaster.intersectObject(settingsScreen.children[4].children[2]),
		settings4Button: raycaster.intersectObject(settingsScreen.children[4].children[3]),
		settings5Button: raycaster.intersectObject(settingsScreen.children[4].children[4]),
		//portfolio
		portBackButton: raycaster.intersectObject(portfolioScreen.children[0]),
		portLeftButton: raycaster.intersectObject(portfolioScreen.children[1]),
		portMidButton: raycaster.intersectObject(portfolioScreen.children[2]),
		portRightButton: raycaster.intersectObject(portfolioScreen.children[3]),
		//projects
		projectsCloseButton: raycaster.intersectObject(projectsScreen.children[0]),
		projects1Button: raycaster.intersectObject(projectsScreen.children[1].children[0]),
		projects2Button: raycaster.intersectObject(projectsScreen.children[1].children[1]),
		projects3Button: raycaster.intersectObject(projectsScreen.children[1].children[2]),

		aboutCloseButton: raycaster.intersectObject(aboutScreen.children[0]),
		//hobbies
		hobbiesCloseButton: raycaster.intersectObject(hobbiesScreen.children[0]),
		hobbies1Button: raycaster.intersectObject(hobbiesScreen.children[1].children[0]),
		hobbies2Button: raycaster.intersectObject(hobbiesScreen.children[1].children[1]),
		hobbies3Button: raycaster.intersectObject(hobbiesScreen.children[1].children[2]),
	
	}
	
	return intersects;
}

// Handle mouse click event
function onClick(event) {

	const inter = updateRaycaster(event, menuScreen, settingsScreen)
	midButton = menuScreen.children[0];
	playSymbol = menuScreen.children[1];
	midButton2 = menuScreen.children[2];
	stopSymbol = menuScreen.children[3];

 	 // Check if an intersection occurred
  	if ( (inter.midButton.length > 0) && midButton.visible && menuScreen.visible ) {

		midButton.visible = false;
		playSymbol.visible = false;
		playAnimation();
		midButton2.visible = true;
		stopSymbol.visible = true;

  	} else if ( (inter.midButton2.length > 0 || inter.stopSymbol.length > 0) && midButton2.visible && menuScreen.visible ) {

		midButton2.visible = false;
		stopSymbol.visible = false;
		stopAndResetAnimation();
		midButton.visible = true;
		playSymbol.visible = true;

  	} else if ( (inter.leftButton.length > 0 || inter.portSymbol.length > 0 || inter.portHandle.length > 0) && menuScreen.visible ) {

		if (menuToPortAnim) return;

		menuToPortAnim = true;
		animStartTime = Date.now();
		camera.minDistance = 0;
		orbit.enableRotate = false;
		
		setTimeout(() => {
			menuScreen.visible = false;
			portfolioScreen.visible = true;
		}, 2000);
		

	} else if ( (inter.rightButton.length > 0 || inter.settingsIcon.length > 0 || inter.gearCenter.length > 0) && menuScreen.visible ) {

		if (menuToPortAnim) return;
		menuScreen.visible = false;
		settingsScreen.visible = true;
		settingsScreen.children[1].visible = true;

	} else if ( (inter.volBar.length > 0 && settingsScreen.visible) ) { //&& settingsscreenvisible
		
		const x = inter.volBar[0].point.x
		const ypbutton = 2.62;
    	const zpbutton = -0.4013;
		const maxX = -(0.17*3.01/2 + 0.11);
		const minX = 0.17*3.01/2 - 0.11;
		
		var currentVolumeIndicator = settingsScreen.children[1];

		if ( x <= minX && x >= maxX ) {
			
			if (currentVolumeIndicator) {
				scene.remove(currentVolumeIndicator);
				settingsScreen.remove(currentVolumeIndicator);
				disposeGroup(currentVolumeIndicator);
				currentVolumeIndicator = null;
			}

			function mapRange(value, inMin, inMax, outMin, outMax) {
				return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
			}
			const volume = mapRange(x, minX, maxX, 0, 1);
			currentVolumeIndicator = createVolumeIndicator(scene, screenColor, screenRotation, -0.11, ypbutton+0.27, zpbutton+0.0446, volume);
			settingsScreen.children.splice(1, 0, currentVolumeIndicator);
			sound.setVolume(volume);
		} //0.14- 0.36

	} else if ( (inter.settings1Button.length > 0 ) && settingsScreen.visible ) {
		
		if (settingsScreen.children[4].children[0].children[0].visible) {

			if (!settingsScreen.children[4].children[1].children[0].visible) {

				settingsScreen.children[4].children[1].children[0].visible = true;

			} else if (!settingsScreen.children[4].children[2].children[0].visible) {

				settingsScreen.children[4].children[2].children[0].visible = true;
				
			} else if (!settingsScreen.children[4].children[3].children[0].visible) {

				settingsScreen.children[4].children[3].children[0].visible = true;

			} else if (!settingsScreen.children[4].children[4].children[0].visible) {

				settingsScreen.children[4].children[4].children[0].visible = true;
			}

			settingsScreen.children[4].children[0].children[0].visible = false;
		}
		updateSphereTexture(skyTextureUrl);

	} else if ( (inter.settings2Button.length > 0 ) && settingsScreen.visible ) {
		
		if (settingsScreen.children[4].children[1].children[0].visible) {

			if (!settingsScreen.children[4].children[0].children[0].visible) {

				settingsScreen.children[4].children[0].children[0].visible = true;

			} else if (!settingsScreen.children[4].children[2].children[0].visible) {

				settingsScreen.children[4].children[2].children[0].visible = true;
				
			} else if (!settingsScreen.children[4].children[3].children[0].visible) {

				settingsScreen.children[4].children[3].children[0].visible = true;

			} else if (!settingsScreen.children[4].children[4].children[0].visible) {

				settingsScreen.children[4].children[4].children[0].visible = true;
			}

			settingsScreen.children[4].children[1].children[0].visible = false;
		}
		updateSphereTexture(sky2TextureUrl);

	} else if ( (inter.settings3Button.length > 0 ) && settingsScreen.visible ) {
		
		if (settingsScreen.children[4].children[2].children[0].visible) {

			if (!settingsScreen.children[4].children[1].children[0].visible) {

				settingsScreen.children[4].children[1].children[0].visible = true;

			} else if (!settingsScreen.children[4].children[0].children[0].visible) {

				settingsScreen.children[4].children[0].children[0].visible = true;
				
			} else if (!settingsScreen.children[4].children[3].children[0].visible) {

				settingsScreen.children[4].children[3].children[0].visible = true;

			} else if (!settingsScreen.children[4].children[4].children[0].visible) {

				settingsScreen.children[4].children[4].children[0].visible = true;
			}

			settingsScreen.children[4].children[2].children[0].visible = false;
		}
		updateSphereTexture(sky3TextureUrl);

	} else if ( (inter.settings4Button.length > 0 ) && settingsScreen.visible ) {
		
		if (settingsScreen.children[4].children[3].children[0].visible) {

			if (!settingsScreen.children[4].children[1].children[0].visible) {

				settingsScreen.children[4].children[1].children[0].visible = true;

			} else if (!settingsScreen.children[4].children[2].children[0].visible) {

				settingsScreen.children[4].children[2].children[0].visible = true;
				
			} else if (!settingsScreen.children[4].children[0].children[0].visible) {

				settingsScreen.children[4].children[0].children[0].visible = true;

			} else if (!settingsScreen.children[4].children[4].children[0].visible) {

				settingsScreen.children[4].children[4].children[0].visible = true;
			}

			settingsScreen.children[4].children[3].children[0].visible = false;
		}
		updateSphereTexture(sky4TextureUrl);

	} else if ( (inter.settings5Button.length > 0 ) && settingsScreen.visible ) {
		
		if (settingsScreen.children[4].children[4].children[0].visible) {

			if (!settingsScreen.children[4].children[1].children[0].visible) {

				settingsScreen.children[4].children[1].children[0].visible = true;

			} else if (!settingsScreen.children[4].children[2].children[0].visible) {

				settingsScreen.children[4].children[2].children[0].visible = true;
				
			} else if (!settingsScreen.children[4].children[3].children[0].visible) {

				settingsScreen.children[4].children[3].children[0].visible = true;

			} else if (!settingsScreen.children[4].children[0].children[0].visible) {

				settingsScreen.children[4].children[0].children[0].visible = true;
			}

			settingsScreen.children[4].children[4].children[0].visible = false;
		}
		updateSphereTexture(sky5TextureUrl);

	} else if ( (inter.backButton.length > 0 ) && settingsScreen.visible ) {
		
		settingsScreen.visible = false;
		settingsScreen.children[1].visible = false; //negative sound indicator
		menuScreen.visible = true;

	} else if ( (inter.portBackButton.length > 0 ) && portfolioScreen.visible ) {

		if (portToMenuAnim) return;
		portToMenuAnim = true;
		animStartTime = Date.now();
		orbit.minDistance = 0.7;
		orbit.enableRotate = true;
		
		setTimeout(() => {
			portfolioScreen.visible = false;
			menuScreen.visible = true;
		}, 2000);

	} else if ( (inter.portLeftButton.length > 0 ) && portfolioScreen.visible ) {
		
		if (portToMenuAnim) return;
		portfolioScreen.visible = false;
		projectsScreen.visible = true;
		projects1.visible = true;
		projectsScreen.children[1].children[0].children[0].material.color.set(0x178731);

	} else if ( (inter.portMidButton.length > 0 ) && portfolioScreen.visible ) {
		
		if (portToMenuAnim) return;
		portfolioScreen.visible = false;
		aboutScreen.visible = true;
		
	} else if ( (inter.portRightButton.length > 0 ) && portfolioScreen.visible ) {
		
		if (portToMenuAnim) return;
		portfolioScreen.visible = false;
		hobbiesScreen.visible = true;
		hobbies1.visible = true;
		hobbiesScreen.children[1].children[0].children[0].material.color.set(0x1b748f);
		
	} else if ( (inter.projectsCloseButton.length > 0 ) && projectsScreen.visible ) {
		
		projectsScreen.visible = false;
		if (projects1.visible) {
			projects1.visible = false;
			projectsScreen.children[1].children[0].children[0].material.color.set(screenColor);
		} else if (projects2.visible) {
			projects2.visible = false;
			projectsScreen.children[1].children[1].children[0].material.color.set(screenColor);
		} else if (projects3.visible) {
			projects3.visible = false;
			projectsScreen.children[1].children[2].children[0].material.color.set(screenColor);
		}
		portfolioScreen.visible = true;
		
	} else if ( (inter.aboutCloseButton.length > 0 ) && aboutScreen.visible ) {
		
		aboutScreen.visible = false;
		portfolioScreen.visible = true;
		
	} else if ( (inter.hobbiesCloseButton.length > 0 ) && hobbiesScreen.visible ) {
		
		hobbiesScreen.visible = false;
		if (hobbies1.visible) {
			hobbies1.visible = false;
			hobbiesScreen.children[1].children[0].children[0].material.color.set(screenColor);
		} else if (hobbies2.visible) {
			hobbies2.visible = false;
			hobbiesScreen.children[1].children[1].children[0].material.color.set(screenColor);
		} else if (hobbies3.visible) {
			hobbies3.visible = false;
			hobbiesScreen.children[1].children[2].children[0].material.color.set(screenColor);
		} 
		portfolioScreen.visible = true;
		
	} else if ( (inter.projects1Button.length > 0 ) && projectsScreen.visible ) {
		
		if (!projects1.visible) {

			if (projects2.visible) {
				projects2.visible = false;
				projectsScreen.children[1].children[1].children[0].material.color.set(screenColor);
			} else if (projects3.visible) {
				projects3.visible = false;
				projectsScreen.children[1].children[2].children[0].material.color.set(screenColor);
			}
			projects1.visible = true;
			projectsScreen.children[1].children[0].children[0].material.color.set(0x178731);
		}
		
	} else if ( (inter.projects2Button.length > 0 ) && projectsScreen.visible ) {
		
		if (!projects2.visible) {

			if (projects1.visible) {
				projects1.visible = false;
				projectsScreen.children[1].children[0].children[0].material.color.set(screenColor);
				
			} else if (projects3.visible) {
				projects3.visible = false;
				projectsScreen.children[1].children[2].children[0].material.color.set(screenColor);
			}
			projects2.visible = true;
			projectsScreen.children[1].children[1].children[0].material.color.set(0x178731);
		}
		
		
	} else if ( (inter.projects3Button.length > 0 ) && projectsScreen.visible ) {
		
		if (!projects3.visible) {

			if (projects1.visible) {
				projects1.visible = false;
				projectsScreen.children[1].children[0].children[0].material.color.set(screenColor);
			} else if (projects2.visible) {
				projects2.visible = false;
				projectsScreen.children[1].children[1].children[0].material.color.set(screenColor);
			}
			projects3.visible = true;
			projectsScreen.children[1].children[2].children[0].material.color.set(0x178731);
		}
		
	} else if ( (inter.hobbies1Button.length > 0 ) && hobbiesScreen.visible ) {
		
		if (!hobbies1.visible) {

			if (hobbies2.visible) {
				hobbies2.visible = false;
				hobbiesScreen.children[1].children[1].children[0].material.color.set(screenColor);
			} else if (hobbies3.visible) {
				hobbies3.visible = false;
				hobbiesScreen.children[1].children[2].children[0].material.color.set(screenColor);
			} 
			hobbies1.visible = true;
			hobbiesScreen.children[1].children[0].children[0].material.color.set(0x1b748f);
		}
		
	} else if ( (inter.hobbies2Button.length > 0 ) && hobbiesScreen.visible ) {
		
		if (!hobbies2.visible) {

			if (hobbies1.visible) {
				hobbies1.visible = false;
				hobbiesScreen.children[1].children[0].children[0].material.color.set(screenColor);
			} else if (hobbies3.visible) {
				hobbies3.visible = false;
				hobbiesScreen.children[1].children[2].children[0].material.color.set(screenColor);
			} 
			hobbies2.visible = true;
			hobbiesScreen.children[1].children[1].children[0].material.color.set(0x1b748f);
		}
		
	} else if ( (inter.hobbies3Button.length > 0 ) && hobbiesScreen.visible ) {
		
		if (!hobbies3.visible) {

			if (hobbies1.visible) {
				hobbies1.visible = false;
				hobbiesScreen.children[1].children[0].children[0].material.color.set(screenColor);
			} else if (hobbies2.visible) {
				hobbies2.visible = false;
				hobbiesScreen.children[1].children[1].children[0].material.color.set(screenColor);
			} 
			hobbies3.visible = true;
			hobbiesScreen.children[1].children[2].children[0].material.color.set(0x1b748f);
		}
	} 
}

function onMouseMove(event) {
	
	const inter = updateRaycaster(event, menuScreen, settingsScreen)

	// Change cursor to pointer if hovering over the plane, otherwise reset to default
	if ( (inter.midButton.length > 0 || inter.playSymbol.length > 0) && menuScreen.visible ) {

	  	document.body.style.cursor = 'pointer';

	} else if ( (inter.midButton2.length > 0 || inter.stopSymbol.length > 0) && menuScreen.visible ) {

		document.body.style.cursor = 'pointer';

	} else if ( (inter.leftButton.length > 0 || inter.portSymbol.length > 0 || inter.portHandle.length > 0) && menuScreen.visible ) {

		document.body.style.cursor = 'pointer';

	} else if ( (inter.rightButton.length > 0 || inter.settingsIcon.length > 0 || inter.gearCenter.length > 0) && menuScreen.visible ) {

		document.body.style.cursor = 'pointer';

	} else if ( (inter.volBar.length > 0 && settingsScreen.visible) ) {

		const x = inter.volBar[0].point.x
		const maxX = -(0.17*3.01/2 + 0.11);
		const minX = 0.17*3.01/2 - 0.11;
		if ( x <= minX && x >= maxX) {
			document.body.style.cursor = 'pointer';
		}

	} else if ( (inter.settings1Button.length > 0 ) && settingsScreen.visible ) {
		
		document.body.style.cursor = 'pointer';

	} else if ( (inter.settings2Button.length > 0 ) && settingsScreen.visible ) {
		
		document.body.style.cursor = 'pointer';

	} else if ( (inter.settings3Button.length > 0 ) && settingsScreen.visible ) {
		
		document.body.style.cursor = 'pointer';

	} else if ( (inter.settings4Button.length > 0 ) && settingsScreen.visible ) {
		
		document.body.style.cursor = 'pointer';

	} else if ( (inter.settings5Button.length > 0 ) && settingsScreen.visible ) {
		
		document.body.style.cursor = 'pointer';

	} else if ( (inter.backButton.length > 0 ) && settingsScreen.visible ) {
		
		document.body.style.cursor = 'pointer';

	} else if ( (inter.portBackButton.length > 0 ) && portfolioScreen.visible ) {
		
		document.body.style.cursor = 'pointer';

	} else if ( (inter.portLeftButton.length > 0 ) && portfolioScreen.visible ) {
		
		document.body.style.cursor = 'pointer';

	} else if ( (inter.portMidButton.length > 0 ) && portfolioScreen.visible ) {
		
		document.body.style.cursor = 'pointer';
		
	} else if ( (inter.portRightButton.length > 0 ) && portfolioScreen.visible ) {
		
		document.body.style.cursor = 'pointer';
		
	} else if ( (inter.projectsCloseButton.length > 0 ) && projectsScreen.visible ) {
		
		document.body.style.cursor = 'pointer';
		
	} else if ( (inter.aboutCloseButton.length > 0 ) && aboutScreen.visible ) {
		
		document.body.style.cursor = 'pointer';
		
	} else if ( (inter.hobbiesCloseButton.length > 0 ) && hobbiesScreen.visible ) {
		
		document.body.style.cursor = 'pointer';
		
	} else if ( (inter.projects1Button.length > 0 ) && projectsScreen.visible ) {
		
		document.body.style.cursor = 'pointer';
		
	} else if ( (inter.projects2Button.length > 0 ) && projectsScreen.visible ) {
		
		document.body.style.cursor = 'pointer';
		
	} else if ( (inter.projects3Button.length > 0 ) && projectsScreen.visible ) {
		
		document.body.style.cursor = 'pointer';
		
	} else if ( (inter.hobbies1Button.length > 0 ) && hobbiesScreen.visible ) {
		
		document.body.style.cursor = 'pointer';
		
	} else if ( (inter.hobbies2Button.length > 0 ) && hobbiesScreen.visible ) {
		
		document.body.style.cursor = 'pointer';
		
	} else if ( (inter.hobbies3Button.length > 0 ) && hobbiesScreen.visible ) {
		
		document.body.style.cursor = 'pointer';
		
	} else {

		document.body.style.cursor = 'default';

	}
  }

// Add the event listener for clicks
renderer.domElement.addEventListener('click', onClick);
renderer.domElement.addEventListener('mousemove', onMouseMove);