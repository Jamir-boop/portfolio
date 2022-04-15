window.addEventListener("load", init, false);

import * as THREE from "three";
import { GUI } from "dat.gui";
import Bowser from "bowser";

// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
// import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass.js";
// import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";

/*
	Init function
*/
function init() {
	checkClient();
	createScene();
	createLighting();
	loadObjects();
	createPrimitive();
}

/*
	Global Variables
	Scene + Camera + Renderer
*/
const scene = new THREE.Scene();
let camera, renderer, controls, composer, gui;
let start = Date.now();
let isMobile = false,
	isChromium = false; // check client browser

function createScene() {
	let SCREEN_WIDTH = window.innerWidth,
		SCREEN_HEIGHT = window.innerHeight,
		VIEW_ANGLE = 45,
		ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
		NEAR = 0.1,
		FAR = 2000;

	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	// camera = new THREE.OrthographicCamera( SCREEN_WIDTH, SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_HEIGHT, NEAR, 1000 );
	camera.position.set(0, 0, 0); //testing
	// camera.position.set(0, 0, 30);
	scene.add(camera);

	// Axes Helper
	const axesHelper = new THREE.AxesHelper(3);
	scene.add(axesHelper);

	renderer = new THREE.WebGLRenderer({
		// antialias: true,
		alpha: true,
		canvas: main__canvas,
	});
	composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));
	composer.setSize(window.innerWidth, window.innerHeight);
	composer.addPass(
		new UnrealBloomPass(
			{ x: window.innerWidth, y: window.innerHeight },
			2.0,
			0.4,
			0.375
		)
	);
	// composer.addPass(new GlitchPass(10));
	composer.addPass(new FilmPass(0.8, 0.325, 300, false));
	// composer.addPass(new SSAOPass(scene, camera, false, true));

	renderer.shadowMap.enabled = true;
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	controls = new OrbitControls(camera, renderer.domElement);

	// Event listeners
	window.addEventListener("resize", onWindowResize, false);
	window.addEventListener("mousemove", moveStatue, false);
	const scroll_aricle = document.getElementById("articlescroll");
	scroll_aricle.addEventListener("scroll", updateCameraOnScroll, false);
}

function createLighting() {
	// var ambientLight = new THREE.AmbientLight( 0xffffff, 1)
	// scene.add( ambientLight )

	// DIRECITONAL LIGHT
	const directionalLight = new THREE.DirectionalLight(0xff001e, 0.2);
	directionalLight.rotation.z = 10;
	scene.add(directionalLight);
	// const helperDirectional = new THREE.DirectionalLightHelper(
	// 	directionalLight
	// );
	// scene.add(helperDirectional);

	// HEMISPHERE LIGHT
	const hemisphereLigth = new THREE.HemisphereLight(0xffffff, 0x5f4ca4, 0.7);
	scene.add(hemisphereLigth);

	// AREA LIGHT
	const area_width = 0.5,
		area_height = 3.0;
	RectAreaLightUniformsLib.init();
	const areaLigth = new THREE.RectAreaLight(
		0xffffff,
		0.7,
		area_width,
		area_height
	);
	areaLigth.position.set(0, 0, -10);
	areaLigth.lookAt(0, 0, 1);
	scene.add(areaLigth);
	const rectLightHelper = new RectAreaLightHelper(areaLigth);
	areaLigth.add(rectLightHelper);

	// POINT LIGHT
	const pointLight = new THREE.PointLight(0xff001e, 1);
	pointLight.position.set(-2.47, 0, -15);
	scene.add(pointLight);
	// const helperPoint = new THREE.PointLightHelper(pointLight);
	// pointLight.add(helperPoint);
}

let planeMaterial,
	planeMaterialScale = true,
	statue;
function loadObjects() {
	/*
 	TEXTURE LOADERS
	*/
	const texture_loader = new THREE.TextureLoader();
	// const texture = texture_loader.load("assets/image/texture/base.jpg");
	const height = texture_loader.load("assets/image/texture/height2.png");
	const normal = texture_loader.load("assets/image/texture/normal.jpg");
	const alpha = texture_loader.load("assets/image/texture/alpha.png");

	/*
	TUNNEL PLANES
	*/
	const geometry = new THREE.PlaneBufferGeometry(60, 80, 100, 100);
	planeMaterial = new THREE.MeshStandardMaterial({
		color: 0x5f4ca4,
		// color: 'gray',
		side: THREE.DoubleSide,
		// map: texture,
		displacementMap: height,
		displacementScale: 10,
		normalMap: normal,
		alphaMap: alpha,
		transparent: true,
		// depthTest: false,
		roughness: 0.001,
		metalness: 0.4,
		flatShading: true,
	});

	const plane = new THREE.Mesh(geometry, planeMaterial);
	const plane2 = new THREE.Mesh(geometry, planeMaterial);
	scene.add(plane, plane2);
	plane.position.set(0, -2.5, 0);
	plane2.position.set(0, 2.5, 0);

	plane2.rotation.set(-1.65, 3.257, 0);
	plane.rotation.x = 29.9;

	/*
		STATUE
	*/
	const gltfLoader = new GLTFLoader(manager);
	gltfLoader.load("assets/models/statue.glb", (gltf) => {
		statue = gltf.scene;
		statue.scale.set(0.1, 0.1, 0.1);
		// statue.position.set(-0.3, -0.21, 0);
		_placeStatue();

		const material_gltf = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			roughness: 0.001,
			metalness: 0.4,
			flatShading: true,
		});
		statue.traverse((c) => {
			c.castShadow = true;
			c.material = material_gltf;
		});
		scene.add(statue);
	});
}

function _placeStatue() {
	let width = window.innerWidth;
	// width = (width / 3) * 0.0005;
	width = (width / 3) * 0.00005;
	if (width < 0.16) width = 0;
	if (width > 0.5) width = 0.2;
	statue.position.set(-width, -0.446, -0.2);
	// console.log(statue.position.x);
}

var mat;
var primitiveElement = function () {
	this.mesh = new THREE.Object3D();
	mat = new THREE.ShaderMaterial({
		wireframe: false,
		//fog: true,
		uniforms: {
			time: {
				type: "f",
				value: 0.0,
			},
			pointscale: {
				type: "f",
				value: 0.0,
			},
			decay: {
				type: "f",
				value: 0.0,
			},
			complex: {
				type: "f",
				value: 0.0,
			},
			waves: {
				type: "f",
				value: 0.0,
			},
			eqcolor: {
				type: "f",
				value: 0.0,
			},
			fragment: {
				type: "i",
				value: true,
			},
			redhell: {
				type: "i",
				value: true,
			},
		},
		vertexShader: document.getElementById("vertexShader").textContent,
		fragmentShader: document.getElementById("fragmentShader").textContent,
	});
	var geo = new THREE.IcosahedronBufferGeometry(3, 7);
	var mesh = new THREE.Points(geo, mat);

	//---
	this.mesh.add(mesh);
};

var _primitive;
function createPrimitive() {
	_primitive = new primitiveElement();
	// _primitive.mesh.scale.set(0.08, 0.08, 0.08);
	// scene.add(_primitive.mesh);
}

/**
 * Particles
 */
function addStar() {
	const star_geometry = new THREE.SphereGeometry(0.2, 20, 20);
	const star_material = new THREE.MeshStandardMaterial({ color: 0xffffff });
	const star = new THREE.Mesh(star_geometry, star_material);

	const [x, y, z] = Array(3)
		.fill()
		.map(() => THREE.MathUtils.randFloatSpread(60));

	star.position.set(x, y, z);
	scene.add(star);
}
Array(300).fill().forEach(addStar);

/**
 * Updates objects on each frame
 */
const clock = new THREE.Clock();
function tick() {
	const elapsedTime = clock.getElapsedTime();
	var performance = Date.now() * 0.003;

	/*
		STATUE 
	*/
	statue.rotation.y += 0.125 * elapsedTime;

	targetX = mouseX * 0.001;
	targetY = mouseY * 0.001;
	statue.rotation.y += 0.5 * (targetX - statue.rotation.y);
	statue.rotation.x += 0.01 * (targetY - statue.rotation.x);

	/*
		PLANES 
	*/
	if (
		planeMaterial.displacementScale >= 12 &&
		planeMaterial.displacementScale <= 13
	) {
		planeMaterialScale = true;
	} else if (
		planeMaterial.displacementScale >= 9 &&
		planeMaterial.displacementScale <= 10
	) {
		planeMaterialScale = false;
	}

	if (planeMaterialScale) {
		planeMaterial.displacementScale -= 0.003;
	} else {
		planeMaterial.displacementScale += 0.003;
	}

	/*
		PRIMITIVE
	*/
	_primitive.mesh.rotation.y += options.perlin.vel;
	_primitive.mesh.rotation.x =
		(Math.sin(performance * options.spin.sinVel) *
			options.spin.ampVel *
			Math.PI) /
		180;
	//---
	mat.uniforms["time"].value = options.perlin.speed * (Date.now() - start);
	mat.uniforms["pointscale"].value = options.perlin.perlins;
	mat.uniforms["decay"].value = options.perlin.decay;
	mat.uniforms["complex"].value = options.perlin.complex;
	mat.uniforms["waves"].value = options.perlin.waves;
	mat.uniforms["eqcolor"].value = options.perlin.eqcolor;
	mat.uniforms["fragment"].value = options.perlin.fragment;
	mat.uniforms["redhell"].value = options.perlin.redhell;

	/*
		RENDER
	*/
	// renderer.render( scene, camera );
	composer.render();
	window.requestAnimationFrame(tick);
}

/**
 * Updates statue on mouse move
 */
let mouseX = 0,
	mouseY = 0,
	targetX = 0,
	targetY = 0;
const windowX = window.innerWidth / 2,
	windowY = window.innerHeight / 2;
function moveStatue(event) {
	mouseX = (event.clientX - windowX) / 2;
	mouseY = (event.clientY - windowY) / 8;
}

/**
 * Updates camera on scroll
 */
function updateCameraOnScroll() {
	const scroll_aricle = document.getElementById("articlescroll");
	let pos = scroll_aricle.scrollTop / 200;
	camera.position.z = pos;
	// console.log({
	// 	raw: scroll_aricle.scrollTop,
	// 	new: camera.position.z,
	// });
}

/**
 * Handles window resize events
 */
function onWindowResize() {
	_placeStatue();

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	composer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Updates objects on each frame
 */

var options = {
	perlin: {
		vel: 0.002,
		speed: 0.0005,
		perlins: 4.0,
		decay: 0.1,
		complex: 0.3,
		waves: 20.0,
		eqcolor: 11.0,
		fragment: true,
		redhell: true,
	},
	spin: {
		sinVel: 0.0,
		ampVel: 80.0,
	},
};
function createGUI() {
	gui = new GUI();

	const cameraFolder = gui.addFolder("Camera");
	cameraFolder.add(camera.position, "x", 0.0, 60.0).step(0.001);
	cameraFolder.add(camera.position, "y", 0.0, 60.0).step(0.001);
	cameraFolder.add(camera.position, "z", 0.0, 60.0).step(0.001);
	// cameraFolder.open();

	// var mathGUI = gui.addFolder("Math Options");
	// mathGUI.add(options.spin, "sinVel", 0.0, 0.5).name("Sine").listen();
	// mathGUI.add(options.spin, "ampVel", 0.0, 90.0).name("Amplitude").listen();
	//mathGUI.open();

	// var perlinGUI = gui.addFolder("Setup Perlin Noise");
	// perlinGUI.add(options.perlin, "perlins", 1.0, 5.0).name("Size").step(1);
	// perlinGUI.add(options.perlin, "speed", 0.0, 0.0005).name("Speed").listen();
	// perlinGUI.add(options.perlin, "decay", 0.0, 1.0).name("Decay").listen();
	// perlinGUI.add(options.perlin, "waves", 0.0, 20.0).name("Waves").listen();
	// perlinGUI.add(options.perlin, "fragment", true).name("Fragment");
	// perlinGUI.add(options.perlin, "complex", 0.1, 1.0).name("Complex").listen();
	// perlinGUI.add(options.perlin, "redhell", true).name("Electroflow");
	// perlinGUI.add(options.perlin, "eqcolor", 0.0, 15.0).name("Hue").listen();
	// perlinGUI.open();

	var primitivePosGUI = gui.addFolder("Primitive POS");
	primitivePosGUI.add(_primitive.mesh.position, "x", 0.0, 20.0).step(0.001);
	primitivePosGUI.add(_primitive.mesh.position, "y", 0.0, 20.0).step(0.001);
	primitivePosGUI.add(_primitive.mesh.position, "z", 0.0, 20.0).step(0.001);
	// primitivePosGUI.open();

	var statueGUI = gui.addFolder("Statue Pos");
	statueGUI.add(statue.position, "x", -1.0, 1.0).step(0.001);
	statueGUI.add(statue.position, "y", -1.0, 1.0).step(0.001);
	statueGUI.add(statue.position, "z", -1.0, 1.0).step(0.001);
	// statueGUI.open();
}

/*
	Loading Manager
*/
const manager = new THREE.LoadingManager();
manager.onStart = function (url, itemsLoaded, itemsTotal) {
	console.log(
		"Started loading file: " +
			url +
			".\nLoaded " +
			itemsLoaded +
			" of " +
			itemsTotal +
			" files."
	);
};
manager.onProgress = function (url, itemsLoaded, itemsTotal) {
	console.log(
		"Loading file: " +
			url +
			".\nLoaded " +
			itemsLoaded +
			" of " +
			itemsTotal +
			" files."
	);
};
manager.onLoad = function () {
	console.log("Loading complete!");
	tick();
	// createGUI();
};

function checkClient() {
	// instancia de bowser
	let result = Bowser.getParser(navigator.userAgent).getResult();
	// console.table(result);
	/*
		FIX SCROLL SNAP CROMIUM BASED BROWSERS
	*/
	isChromium = !!window.chrome;
	if (result.platform.type == "mobile") isMobile = true;
	// Quitar scroll-snap si el cliente es cromium y no es mobil
	if (isChromium && !isMobile) {
		const elements = document.querySelectorAll(".section");
		elements.forEach((element) => {
			element.classList.replace("section", "section_noscroll");
		});
	}
	// console.log({ isChromium, isMobile });
}
