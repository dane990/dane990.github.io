import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { Reflector } from 'three/examples/jsm/Addons.js';
import { LightProbeHelper } from 'three/addons/helpers/LightProbeHelper.js';

const { MathUtils, Vector3 } = THREE;

const playButton = document.getElementById('playButton');

//wait function
function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

//scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const sceneUrl = new URL('piano.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xA3A3A3);
document.body.appendChild(renderer.domElement);


//user controls
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0,4,-5);
orbit.target.set(0,2,-1);
orbit.enablePan = false;
orbit.maxDistance = 10;
orbit.minDistance = 1;
orbit.maxPolarAngle = Math.PI/2;
orbit.enableDamping = true;



//sound
const listener = new THREE.AudioListener();
camera.add( listener );
const sound = new THREE.Audio( listener );
const audioLoader = new THREE.AudioLoader();
const soundUrl = new URL('pianosound.mp3', import.meta.url);
audioLoader.load( soundUrl.href, function( buffer ) {
	sound.setBuffer( buffer );
});

//piano animation
const assetLoader = new GLTFLoader();

let mixer;
let action;
let hands;
assetLoader.load(sceneUrl.href, function(gltf) {

	const model = gltf.scene;
	scene.add(model);
	console.log(model);

	hands = model.getObjectByName('Ch36');
	hands.visible = false;

	//animation clip
	mixer = new THREE.AnimationMixer(model);
	const clips = gltf.animations;
	const clip = THREE.AnimationClip.findByName(clips, 'Scene');
	action = mixer.clipAction(clip);
	action.setLoop(THREE.LoopOnce);

	mixer.addEventListener('finished', function() {
		sound.stop();
		sound.currentTime = 0;
		playButton.style.display = 'block';
		hands.visible = false;
	});

}, undefined, function(error) {
	console.error(error);
});


//play animation
const clock = new THREE.Clock();



playButton.addEventListener('click', async function() {
	
	if (sound && mixer && action) {
		
		playButton.style.display = 'none';
		sound.play();
		/*0.7s delay
		await wait(700);
		*/
		//await wait(60);
		action.reset();
		action.play();
		hands.visible = true;

	}
	
})


renderer.setAnimationLoop(animate);

//environment
/*
const grid = new THREE.GridHelper(10,10);
scene.add(grid);
*/
const light = new THREE.PointLight( 0xFFFFFF , 600); // soft white light
light.position.set(0, 8, -10)
scene.add( light );




const textureLoader = new THREE.TextureLoader();

let sphere;
textureLoader.load('sky.jpg', function(texture) {
    const sphereGeometry = new THREE.SphereGeometry(200, 32, 32); // Large radius
    const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
});

function animate() {
	orbit.update();
	if (sphere) {
		sphere.rotation.y += 0.0001;
	}
	
	if(mixer) {
		mixer.update(clock.getDelta());
	}
	renderer.render(scene, camera);
}

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





/*
renderer.setAnimationLoop(animate)
document.body.appendChild(renderer.domElement);

const geometry = new THREE.CircleGeometry( 1, 4);
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );

}
*/
