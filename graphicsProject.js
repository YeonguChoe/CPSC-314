/////////////////////////////////////////////////////////////////////////////////////////
//  Graphics project
/////////////////////////////////////////////////////////////////////////////////////////

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.148/build/three.module.js';
import { OrbitControls } from './js/OrbitControls.js';
import { OBJLoader } from './js/OBJLoader.js';
import { Keyframe, Motion } from './motion.js';

var animation = true;
var meshesLoaded = false;
var RESOURCES_LOADED = false;
var degreeToRadian = Math.PI / 180;


var myboxMotion = new Motion(myboxSetMatrices);
var handMotion = new Motion(handSetMatrices);

let sphereMotion1 = new Motion(sphereSetMatrices);
let sphereMotion2 = new Motion(sphereSetMatrices);

//Giraffe motion
let giraffeMotion1 = new Motion(giraffeSetMatrices);
let giraffeMotion2 = new Motion(giraffeSetMatrices);
var link1, link2, link3, link4, link5;
var linkFrame1, linkFrame2, linkFrame3, linkFrame4, linkFrame5;
var sphere;
var mybox;
var meshes = {};

let giraffeDanceType = 1;

let redSphere, blueSphere;

//Giraffe bone

let gBody;
let gNeck, gRightFrontThigh, gLeftFrontThigh, gRightRearThigh, gLeftRearThigh,
  gTail;
let gHead, gRightFrontCalf, gLeftFrontCalf, gRightRearCalf, gLeftRearCalf;

//Giraffe joint
let giraffeFrame, gLower_NeckJoint, gRightFront_Pelvis, gLeftFront_Pelvis,
  gRightRear_Pelvis,
  gLeftRear_Pelvis, gTail_Joint;
let gHead_Joint;
let gRightFront_KneeJoint, gLeftFront_KneeJoint, gRightRear_KneeJoint,
  gLeftRear_KneeJoint;
// SETUP RENDERER & SCENE

var canvas = document.getElementById('canvas');
var camera;
var light;
var ambientLight;
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor('#C2B280');     // set background colour
canvas.appendChild(renderer.domElement);

//Audio play
let defaultMusic = new Audio('./music/Serenity.mp3');
let anotherMusic = new Audio('./music/Ehrling - Lounge.mp3');

//////////////////////////////////////////////////////////
//  initCamera():   SETUP CAMERA
//////////////////////////////////////////////////////////

function initCamera() {
  // set up M_proj    (internally:  camera.projectionMatrix )
  var cameraFov = 30;     // initial camera vertical field of view, in degrees
  // view angle, aspect ratio, near, far
  camera = new THREE.PerspectiveCamera(cameraFov, 1, 0.1, 1000);

  var width = 10;
  var height = 5;
  //    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000 );

  // set up M_view:   (internally:  camera.matrixWorldInverse )
  camera.position.set(0, 150, 150);
  camera.up = new THREE.Vector3(0, 1, 0);
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  // SETUP ORBIT CONTROLS OF THE CAMERA
  const controls = new OrbitControls(camera, renderer.domElement);
  //    var controls = new OrbitControls(camera);
  controls.damping = 0.2;
  controls.autoRotate = false;
}

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

//SCROLLBAR FUNCTION DISABLE
window.onscroll = function () {
  window.scrollTo(0, 0);
};

////////////////////////////////////////////////////////////////////////	
// init():  setup up scene
////////////////////////////////////////////////////////////////////////	

function init() {
  console.log('init called');

  initCamera();
  initMotions();
  initCustomSpheres();
  initLights();
  initGiraffe();
  initObjects();
  initHand();
  initFileObjects();

  window.addEventListener('resize', resize);
  resize();
}

////////////////////////////////////////////////////////////////////////
// initMotions():  setup Motion instances for each object that we wish to animate
////////////////////////////////////////////////////////////////////////

function initMotions() {
  sphereMotion1.addKeyFrame(new Keyframe('0', 0.0, [30, 0, 30]));
  sphereMotion1.addKeyFrame(new Keyframe('1', 4.0, [-30, 0, 30]));
  sphereMotion1.addKeyFrame(new Keyframe('0', 8.0, [30, 0, 30]));

  sphereMotion2.addKeyFrame(new Keyframe('0', 0.0, [30, 20, 30]));
  sphereMotion2.addKeyFrame(new Keyframe('1', 1.0, [20, 25, 20]));
  sphereMotion2.addKeyFrame(new Keyframe('1', 2.0, [0, 20, 0]));
  sphereMotion2.addKeyFrame(new Keyframe('1', 3.0, [-20, 25, -20]));
  sphereMotion2.addKeyFrame(new Keyframe('1', 4.0, [0, 20, 0]));
  sphereMotion2.addKeyFrame(new Keyframe('1', 5.0, [20, 25, 20]));
  sphereMotion2.addKeyFrame(new Keyframe('0', 6.0, [30, 20, 30]));

  // keyframes for the mybox animated motion:   name, time, [x, y, z, theta]
  myboxMotion.addKeyFrame(new Keyframe('rest pose', 0.0, [0, 0, 0, 0]));
  myboxMotion.addKeyFrame(new Keyframe('rest pose', 1.0, [-3, 0, 0, 0]));
  myboxMotion.addKeyFrame(new Keyframe('rest pose', 2.0, [-3, 10, 0, 0]));
  myboxMotion.addKeyFrame(new Keyframe('rest pose', 3.0, [0, 10, 0, 0]));
  myboxMotion.addKeyFrame(new Keyframe('rest pose', 4.0, [0, 0, 0, 0]));

  // basic interpolation test
  myboxMotion.currTime = 0.1;
  console.log('kf', myboxMotion.currTime, '=', myboxMotion.getAvars());    // interpolate for t=0.1
  myboxMotion.currTime = 2.9;
  console.log('kf', myboxMotion.currTime, '=', myboxMotion.getAvars());    // interpolate for t=2.9

  // keyframes for hand:    name, time, [x, y, Link1's theta1, right theta2, right.2 theta3, left theta4, left.2 theta5]
  handMotion.addKeyFrame(new Keyframe('straight', 0.0, [0, 0, 0, 0, 0, 0, 0]));
  handMotion.addKeyFrame(
    new Keyframe('right finger curl', 1.0, [2, 3, 0, +90, -90, 0, 0]));
  handMotion.addKeyFrame(new Keyframe('straight', 2.0, [2, 3, 30, 0, 0, 0, 0]));
  handMotion.addKeyFrame(
    new Keyframe('left finger curl', 3.0, [2, 3, 0, 0, 0, -90, -90]));
  handMotion.addKeyFrame(new Keyframe('straight', 4.0, [2, 3, 30, 0, 0, 0, 0]));
  handMotion.addKeyFrame(
    new Keyframe('both fingers curl', 4.5, [2, 3, 0, -90, -90, -90, -90]));
  handMotion.addKeyFrame(new Keyframe('straight', 6.0, [0, 0, 0, 0, 0, 0, 0]));

  //keyframes for giraffe
  //avars : [x, y ,z, body∠, neck∠, head∠,rightFront∠,leftFront∠,rightRear∠,leftRear∠,tail∠
  giraffeMotion1.addKeyFrame(
    new Keyframe('0', 0.0, [-14, 3, 1, 0, 90, -20, 0, 0, 0, 0, 20]));
  giraffeMotion1.addKeyFrame(
    new Keyframe('1', 1.0, [-14, 3, 1, 0, 60, 30, 20, 0, 30, 40, 40]));
  giraffeMotion1.addKeyFrame(
    new Keyframe('2', 2.0, [-14, 3, 4, 10, 60, 50, 20, 10, 0, 0, 40]));
  giraffeMotion1.addKeyFrame(
    new Keyframe('3', 3.0, [-14, 3, -2, 0, 90, -20, 0, 0, 0, 0, 20]));
  giraffeMotion1.addKeyFrame(
    new Keyframe('4', 4.0, [-14, 3, 1, 0, 90, -20, 0, 0, 0, 0, 20]));

  giraffeMotion2.addKeyFrame(
    new Keyframe('0', 0.0, [-14, 3, 1, 0, 90, -20, 0, 0, 0, 0, 20]));
  giraffeMotion2.addKeyFrame(
    new Keyframe('1', 1.0, [8, 5, 10, -10, 10, -20, 10, 30, 10, 20, -20]));
  giraffeMotion2.addKeyFrame(
    new Keyframe('2', 2.0, [-14, 10, 1, 20, 110, -20, 20, 40, 20, 20, 20]));
  giraffeMotion2.addKeyFrame(
    new Keyframe('3', 3.0, [8, 6, -10, -30, -30, -20, 0, 20, 30, 0, -20]));
  giraffeMotion2.addKeyFrame(
    new Keyframe('4', 4.0, [-14, 4, 1, 20, 30, -20, 30, 20, 10, 10, 20]));
  giraffeMotion2.addKeyFrame(
    new Keyframe('5', 5.0, [-14, 3, 1, 0, 90, -20, 0, 0, 0, 0, 20]));
}

function giraffeSetMatrices(avars) {

  let x = avars[0];
  let y = avars[1];
  let z = avars[2];
  let giraffeAngle = avars[3] * degreeToRadian;
  let neckAngle = avars[4] * degreeToRadian;
  let headAngle = avars[5] * degreeToRadian;
  let rightFrontLegAngle = avars[6] * degreeToRadian;
  let leftFrontLegAngle = avars[7] * degreeToRadian;
  let rightRearLegAngle = avars[8] * degreeToRadian;
  let leftRearLegAngle = avars[9] * degreeToRadian;
  let tailAngle = avars[10] * degreeToRadian;

  var M = new THREE.Matrix4();
  // Lengths
  let bodyLength = 7; //increase palm's x
  let neckLength = 7;
  let bodyWidth = 3;
  let bodyThickness = 4;
  let thighLength = 3;
  let calfLength = 2;
  let tailLength = 3;

  ////////////// Body
  giraffeFrame.matrix.identity();
  giraffeFrame.matrix.multiply(M.makeTranslation(3, -1, -1));
  giraffeFrame.matrix.multiply(M.makeRotationY(-90 * degreeToRadian));
  giraffeFrame.matrix.multiply(
    M.makeTranslation(x + bodyLength,
      y + (thighLength + calfLength), z));
  giraffeFrame.matrix.multiply(M.makeRotationZ(giraffeAngle));
  // Frame 1 has been established, now setup the extra transformations for the scaled box geometry
  gBody.matrix.copy(giraffeFrame.matrix);
  gBody.matrix.multiply(M.makeTranslation(1, -2, 1));
  gBody.matrix.multiply(M.makeScale(bodyLength, bodyThickness, bodyWidth));

  ////////////// Neck
  gLower_NeckJoint.matrix.copy(giraffeFrame.matrix);      // start with parent frame
  gLower_NeckJoint.matrix.multiply(
    M.makeTranslation(bodyLength - 2, 0, 1));
  gLower_NeckJoint.matrix.multiply(M.makeRotationZ(neckAngle));
  // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  gNeck.matrix.copy(gLower_NeckJoint.matrix);
  gNeck.matrix.multiply(M.makeTranslation(1, 0, 0));
  gNeck.matrix.multiply(M.makeScale(neckLength, 1, 1));

  ///////////////  Head
  gHead_Joint.matrix.copy(gLower_NeckJoint.matrix);
  gHead_Joint.matrix.multiply(M.makeTranslation(neckLength * 0.55, 0, 0));
  gHead_Joint.matrix.multiply(M.makeRotationZ(headAngle));
  // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
  gHead.matrix.copy(gHead_Joint.matrix);
  gHead.matrix.multiply(M.makeTranslation(0, 0, 0));
  gHead.matrix.multiply(M.makeScale(1, 2, 1));

  ///////////////  Tail
  gTail_Joint.matrix.copy(giraffeFrame.matrix);      // start with parent frame
  gTail_Joint.matrix.multiply(
    M.makeTranslation(-2, 0, 1));
  gTail_Joint.matrix.multiply(M.makeRotationZ(tailAngle));
  // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  gTail.matrix.copy(gTail_Joint.matrix);
  gTail.matrix.multiply(M.makeTranslation(-2, 0, 0));
  gTail.matrix.multiply(M.makeScale(tailLength, 0.5, 0.5));

  ///////////////  Right Thigh
  gRightFront_Pelvis.matrix.copy(giraffeFrame.matrix);      // start with parent frame
  gRightFront_Pelvis.matrix.multiply(
    M.makeTranslation(4, -5, 2));
  gRightFront_Pelvis.matrix.multiply(M.makeRotationZ(-90 * degreeToRadian));
  gRightFront_Pelvis.matrix.multiply(M.makeRotationZ(rightFrontLegAngle));
  // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  gRightFrontThigh.matrix.copy(gRightFront_Pelvis.matrix);
  gRightFrontThigh.matrix.multiply(M.makeTranslation(0, 0, 0));
  gRightFrontThigh.matrix.multiply(M.makeScale(thighLength, 0.5, 0.5));

  ///////////////  Right Calf
  gRightFront_KneeJoint.matrix.copy(gRightFront_Pelvis.matrix);      // start with parent frame
  gRightFront_KneeJoint.matrix.multiply(
    M.makeTranslation(2, 0, 0));
  gRightFront_KneeJoint.matrix.multiply(M.makeRotationZ(-rightFrontLegAngle));
  // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  gRightFrontCalf.matrix.copy(gRightFront_KneeJoint.matrix);
  gRightFrontCalf.matrix.multiply(M.makeTranslation(0, 0, 0));
  gRightFrontCalf.matrix.multiply(M.makeScale(calfLength, 0.5, 0.5));

  ///////////////  Left Thigh
  gLeftFront_Pelvis.matrix.copy(giraffeFrame.matrix);      // start with parent frame
  gLeftFront_Pelvis.matrix.multiply(
    M.makeTranslation(4, -5, 0));
  gLeftFront_Pelvis.matrix.multiply(M.makeRotationZ(-90 * degreeToRadian));
  gLeftFront_Pelvis.matrix.multiply(M.makeRotationZ(leftFrontLegAngle));
  // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  gLeftFrontThigh.matrix.copy(gLeftFront_Pelvis.matrix);
  gLeftFrontThigh.matrix.multiply(M.makeTranslation(0, 0, 0));
  gLeftFrontThigh.matrix.multiply(M.makeScale(thighLength, 0.5, 0.5));

  ///////////////  Left Calf
  gLeftFront_KneeJoint.matrix.copy(gLeftFront_Pelvis.matrix);      // start with parent frame
  gLeftFront_KneeJoint.matrix.multiply(
    M.makeTranslation(2, 0, 0));
  gLeftFront_KneeJoint.matrix.multiply(M.makeRotationZ(-leftFrontLegAngle));
  // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  gLeftFrontCalf.matrix.copy(gLeftFront_KneeJoint.matrix);
  gLeftFrontCalf.matrix.multiply(M.makeTranslation(0, 0, 0));
  gLeftFrontCalf.matrix.multiply(M.makeScale(calfLength, 0.5, 0.5));

  //////////Rear!!!!

  ///////////////  Right Thigh
  gRightRear_Pelvis.matrix.copy(giraffeFrame.matrix);      // start with parent frame
  gRightRear_Pelvis.matrix.multiply(
    M.makeTranslation(-2, -5, 2));
  gRightRear_Pelvis.matrix.multiply(M.makeRotationZ(-90 * degreeToRadian));
  gRightRear_Pelvis.matrix.multiply(M.makeRotationZ(rightRearLegAngle));
  // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  gRightRearThigh.matrix.copy(gRightRear_Pelvis.matrix);
  gRightRearThigh.matrix.multiply(M.makeTranslation(0, 0, 0));
  gRightRearThigh.matrix.multiply(M.makeScale(thighLength, 0.5, 0.5));

  ///////////////  Right Calf
  gRightRear_KneeJoint.matrix.copy(gRightRear_Pelvis.matrix);      // start with parent frame
  gRightRear_KneeJoint.matrix.multiply(
    M.makeTranslation(2, 0, 0));
  gRightRear_KneeJoint.matrix.multiply(M.makeRotationZ(-rightRearLegAngle));
  // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  gRightRearCalf.matrix.copy(gRightRear_KneeJoint.matrix);
  gRightRearCalf.matrix.multiply(M.makeTranslation(0, 0, 0));
  gRightRearCalf.matrix.multiply(M.makeScale(calfLength, 0.5, 0.5));

  ///////////////  Left Thigh
  gLeftRear_Pelvis.matrix.copy(giraffeFrame.matrix);      // start with parent frame
  gLeftRear_Pelvis.matrix.multiply(
    M.makeTranslation(-2, -5, 0));
  gLeftRear_Pelvis.matrix.multiply(M.makeRotationZ(-90 * degreeToRadian));
  gLeftRear_Pelvis.matrix.multiply(M.makeRotationZ(leftRearLegAngle));
  // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  gLeftRearThigh.matrix.copy(gLeftRear_Pelvis.matrix);
  gLeftRearThigh.matrix.multiply(M.makeTranslation(0, 0, 0));
  gLeftRearThigh.matrix.multiply(M.makeScale(thighLength, 0.5, 0.5));

  ///////////////  Left Calf
  gLeftRear_KneeJoint.matrix.copy(gLeftRear_Pelvis.matrix);      // start with parent frame
  gLeftRear_KneeJoint.matrix.multiply(
    M.makeTranslation(2, 0, 0));
  gLeftRear_KneeJoint.matrix.multiply(M.makeRotationZ(-leftRearLegAngle));
  // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  gLeftRearCalf.matrix.copy(gLeftRear_KneeJoint.matrix);
  gLeftRearCalf.matrix.multiply(M.makeTranslation(0, 0, 0));
  gLeftRearCalf.matrix.multiply(M.makeScale(calfLength, 0.5, 0.5));

  giraffeFrame.updateMatrixWorld();
  gLower_NeckJoint.updateMatrixWorld();
  gRightFront_Pelvis.updateMatrixWorld();
  gLeftFront_Pelvis.updateMatrixWorld();
  gRightRear_Pelvis.updateMatrixWorld();
  gLeftRear_Pelvis.updateMatrixWorld();
  gTail_Joint.updateMatrixWorld();
  gHead_Joint.updateMatrixWorld();
  gRightFront_KneeJoint.updateMatrixWorld();
  gLeftFront_KneeJoint.updateMatrixWorld();
  gRightRear_KneeJoint.updateMatrixWorld();
  gLeftRear_KneeJoint.updateMatrixWorld();

  gNeck.updateMatrixWorld();
  gRightFrontThigh.updateMatrixWorld();
  gLeftFrontThigh.updateMatrixWorld();
  gRightRearThigh.updateMatrixWorld();
  gLeftRearThigh.updateMatrixWorld();
  gTail.updateMatrixWorld();
  gHead.updateMatrixWorld();
  gRightFrontCalf.updateMatrixWorld();
  gLeftFrontCalf.updateMatrixWorld();
  gRightRearCalf.updateMatrixWorld();
  gLeftRearCalf.updateMatrixWorld();
  gBody.updateMatrixWorld();

}

///////////////////////////////////////////////////////////////////////////////////////
// myboxSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function myboxSetMatrices(avars) {
  mybox.matrixAutoUpdate = false;     // tell three.js not to over-write our updates
  mybox.matrix.identity();
  mybox.matrix.multiply(
    new THREE.Matrix4().makeTranslation(avars[0], avars[1], avars[2]));
  mybox.matrix.multiply(new THREE.Matrix4().makeRotationY(-Math.PI / 2));
  mybox.matrix.multiply(new THREE.Matrix4().makeScale(1.0, 1.0, 1.0));
  mybox.updateMatrixWorld();

}

function sphereSetMatrices(avars) {
  redSphere.matrixAutoUpdate = false;     // tell three.js not to over-write our updates
  redSphere.matrix.identity();
  redSphere.matrix.multiply(
    new THREE.Matrix4().makeTranslation(avars[0], avars[1], avars[2]));
  redSphere.updateMatrixWorld();

  blueSphere.matrixAutoUpdate = false;     // tell three.js not to over-write our updates
  blueSphere.matrix.identity();
  blueSphere.matrix.multiply(
    new THREE.Matrix4().makeTranslation(-avars[0], avars[1], -avars[2]));
  blueSphere.updateMatrixWorld();
}

///////////////////////////////////////////////////////////////////////////////////////
// handSetMatrices(avars)
///////////////////////////////////////////////////////////////////////////////////////

function handSetMatrices(avars) {
  var xPosition = avars[0];
  var yPosition = avars[1];
  var theta1 = avars[2] * degreeToRadian;
  var theta2 = avars[3] * degreeToRadian;
  var theta3 = avars[4] * degreeToRadian;
  var theta4 = avars[5] * degreeToRadian;
  var theta5 = avars[6] * degreeToRadian;
  var M = new THREE.Matrix4();
  // Lengths
  let lengthOfLink1 = 7; //increase palm's x
  let lengthOfLink2 = 5;
  let lengthOfLink3 = 4;
  let lengthOfLink4 = 5;
  let lengthOfLink5 = 3;
  let palmWidth = 8;

  ////////////// link1
  linkFrame1.matrix.identity();
  linkFrame1.matrix.multiply(
    M.makeTranslation(xPosition + lengthOfLink1, yPosition, 0));
  linkFrame1.matrix.multiply(M.makeRotationZ(theta1));
  // Frame 1 has been established, now setup the extra transformations for the scaled box geometry
  link1.matrix.copy(linkFrame1.matrix);
  link1.matrix.multiply(M.makeTranslation(2, 0, 0));
  link1.matrix.multiply(M.makeScale(lengthOfLink1, 1, palmWidth));

  ////////////// link2
  linkFrame2.matrix.copy(linkFrame1.matrix);      // start with parent frame
  linkFrame2.matrix.multiply(M.makeTranslation(lengthOfLink2, 0, 1));
  linkFrame2.matrix.multiply(M.makeRotationZ(theta2));
  // Frame 2 has been established, now setup the extra transformations for the scaled box geometry
  link2.matrix.copy(linkFrame2.matrix);
  link2.matrix.multiply(M.makeTranslation(2, 0, 0));
  link2.matrix.multiply(M.makeScale(lengthOfLink2, 1, 1));

  ///////////////  link3
  linkFrame3.matrix.copy(linkFrame2.matrix);
  linkFrame3.matrix.multiply(M.makeTranslation(lengthOfLink3, 0, 0));
  linkFrame3.matrix.multiply(M.makeRotationZ(theta3));
  // Frame 3 has been established, now setup the extra transformations for the scaled box geometry
  link3.matrix.copy(linkFrame3.matrix);
  link3.matrix.multiply(M.makeTranslation(2, 0, 0));
  link3.matrix.multiply(M.makeScale(lengthOfLink3, 1, 1));

  /////////////// link4
  linkFrame4.matrix.copy(linkFrame1.matrix);
  linkFrame4.matrix.multiply(M.makeTranslation(lengthOfLink4, 0, -1));
  linkFrame4.matrix.multiply(M.makeRotationZ(theta4));
  // Frame 4 has been established, now setup the extra transformations for the scaled box geometry
  link4.matrix.copy(linkFrame4.matrix);
  link4.matrix.multiply(M.makeTranslation(2, 0, 0));
  link4.matrix.multiply(M.makeScale(lengthOfLink4, 1, 1));

  // link5
  linkFrame5.matrix.copy(linkFrame4.matrix);
  linkFrame5.matrix.multiply(M.makeTranslation(lengthOfLink5, 0, 0));
  linkFrame5.matrix.multiply(M.makeRotationZ(theta5));
  // Frame 5 has been established, now setup the extra transformations for the scaled box geometry
  link5.matrix.copy(linkFrame5.matrix);
  link5.matrix.multiply(M.makeTranslation(2, 0, 0));
  link5.matrix.multiply(M.makeScale(lengthOfLink5, 1, 1));

  link1.updateMatrixWorld();
  link2.updateMatrixWorld();
  link3.updateMatrixWorld();
  link4.updateMatrixWorld();
  link5.updateMatrixWorld();

  linkFrame1.updateMatrixWorld();
  linkFrame2.updateMatrixWorld();
  linkFrame3.updateMatrixWorld();
  linkFrame4.updateMatrixWorld();
  linkFrame5.updateMatrixWorld();
}

/////////////////////////////////////
// initLights():  SETUP LIGHTS
/////////////////////////////////////	

function initLights() {
  light = new THREE.PointLight(0xffffff);
  light.position.set(0, 4, 2);
  scene.add(light);
  ambientLight = new THREE.AmbientLight(0x606060);
  scene.add(ambientLight);
}

/////////////////////////////////////	
// MATERIALS
/////////////////////////////////////	

var diffuseMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
var diffuseMaterial2 = new THREE.MeshLambertMaterial(
  { color: 0xffffff, side: THREE.DoubleSide });
var basicMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var armadilloMaterial = new THREE.MeshBasicMaterial({ color: 0x7fff7f });
//Cars
let redCarMaterial = new THREE.MeshLambertMaterial({ color: 'red' });
let blueCarMaterial = new THREE.MeshLambertMaterial({ color: 'blue' });

/////////////////////////////////////	
// initObjects():  setup objects in the scene
/////////////////////////////////////	

function initObjects() {
  var worldFrame = new THREE.AxesHelper(5);
  scene.add(worldFrame);

  // mybox
  var myboxGeometry = new THREE.BoxGeometry(1, 1, 1);    // width, height, depth
  mybox = new THREE.Mesh(myboxGeometry, diffuseMaterial);
  mybox.position.set(4, 4, 0);
  scene.add(mybox);

  // textured floor
  var floorTexture = new THREE.TextureLoader().load('images/minecraft grass floor.jpg');
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(1, 1);
  var floorMaterial = new THREE.MeshBasicMaterial(
    { map: floorTexture, side: THREE.DoubleSide });
  var floorGeometry = new THREE.PlaneGeometry(100, 100);
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -1.1;
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);

  // sphere, located at light position
  var sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);    // radius, segments, segments
  sphere = new THREE.Mesh(sphereGeometry, basicMaterial);
  sphere.position.set(0, 4, 2);
  sphere.position.set(light.position.x, light.position.y, light.position.z);
  scene.add(sphere);

}

/////////////////////////////////////////////////////////////////////////////////////
//  initHand():  define all geometry associated with the hand
/////////////////////////////////////////////////////////////////////////////////////

function initHand() {
  var handMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  var boxGeometry = new THREE.BoxGeometry(1, 1, 1);    // width, height, depth

  link1 = new THREE.Mesh(boxGeometry, handMaterial);
  scene.add(link1);
  linkFrame1 = new THREE.AxesHelper(1);
  scene.add(linkFrame1);
  link2 = new THREE.Mesh(boxGeometry, handMaterial);
  scene.add(link2);
  linkFrame2 = new THREE.AxesHelper(1);
  scene.add(linkFrame2);
  link3 = new THREE.Mesh(boxGeometry, handMaterial);
  scene.add(link3);
  linkFrame3 = new THREE.AxesHelper(1);
  scene.add(linkFrame3);
  link4 = new THREE.Mesh(boxGeometry, handMaterial);
  scene.add(link4);
  linkFrame4 = new THREE.AxesHelper(1);
  scene.add(linkFrame4);
  link5 = new THREE.Mesh(boxGeometry, handMaterial);
  scene.add(link5);
  linkFrame5 = new THREE.AxesHelper(1);
  scene.add(linkFrame5);

  link1.matrixAutoUpdate = false;
  link2.matrixAutoUpdate = false;
  link3.matrixAutoUpdate = false;
  link4.matrixAutoUpdate = false;
  link5.matrixAutoUpdate = false;
  linkFrame1.matrixAutoUpdate = false;
  linkFrame2.matrixAutoUpdate = false;
  linkFrame3.matrixAutoUpdate = false;
  linkFrame4.matrixAutoUpdate = false;
  linkFrame5.matrixAutoUpdate = false;
}

function initCustomSpheres() {
  let sphere1 = new THREE.SphereGeometry(3, 100, 100);
  let sphere1Material = new THREE.MeshLambertMaterial({ color: 'red' });
  let sphere2 = new THREE.SphereGeometry(3, 100, 100);
  let sphere2Material = new THREE.MeshLambertMaterial({ color: 'blue' });

  redSphere = new THREE.Mesh(sphere1, sphere1Material);
  scene.add(redSphere);
  blueSphere = new THREE.Mesh(sphere2, sphere2Material);
  scene.add(blueSphere);

  redSphere.matrixAutoUpdate = false;
  blueSphere.matrixAutoUpdate = false;
}

function initGiraffe() {
  let gBodyGeometry = new THREE.BoxGeometry(1, 1, 1);
  let giraffeMaterial = new THREE.MeshLambertMaterial({ color: 'yellow' });
  gBody = new THREE.Mesh(gBodyGeometry, giraffeMaterial);
  scene.add(gBody);
  gNeck = new THREE.Mesh(gBodyGeometry, giraffeMaterial);
  scene.add(gNeck);

  gHead = new THREE.Mesh(gBodyGeometry, giraffeMaterial);
  scene.add(gHead);

  gTail = new THREE.Mesh(gBodyGeometry, giraffeMaterial);
  scene.add(gTail);

  gRightFrontThigh = new THREE.Mesh(gBodyGeometry, giraffeMaterial);
  scene.add(gRightFrontThigh);

  gLeftFrontThigh = new THREE.Mesh(gBodyGeometry, giraffeMaterial);
  scene.add(gLeftFrontThigh);

  gRightRearThigh = new THREE.Mesh(gBodyGeometry, giraffeMaterial);
  scene.add(gRightRearThigh);

  gLeftRearThigh = new THREE.Mesh(gBodyGeometry, giraffeMaterial);
  scene.add(gLeftRearThigh);

  gRightFrontCalf = new THREE.Mesh(gBodyGeometry, giraffeMaterial);
  scene.add(gRightFrontCalf);

  gLeftFrontCalf = new THREE.Mesh(gBodyGeometry, giraffeMaterial);
  scene.add(gLeftFrontCalf);

  gRightRearCalf = new THREE.Mesh(gBodyGeometry, giraffeMaterial);
  scene.add(gRightRearCalf);

  gLeftRearCalf = new THREE.Mesh(gBodyGeometry, giraffeMaterial);
  scene.add(gLeftRearCalf);

  giraffeFrame = new THREE.AxesHelper(3);
  scene.add(giraffeFrame);

  gLower_NeckJoint = new THREE.AxesHelper(1);
  scene.add(gLower_NeckJoint);

  gHead_Joint = new THREE.AxesHelper(1);
  scene.add(gHead_Joint);

  gTail_Joint = new THREE.AxesHelper(1);
  scene.add(gTail_Joint);

  gRightFront_Pelvis = new THREE.AxesHelper(1);
  scene.add(gRightFront_Pelvis);

  gLeftFront_Pelvis = new THREE.AxesHelper(1);
  scene.add(gLeftFront_Pelvis);

  gRightRear_Pelvis = new THREE.AxesHelper(1);
  scene.add(gRightRear_Pelvis);

  gLeftRear_Pelvis = new THREE.AxesHelper(1);
  scene.add(gLeftRear_Pelvis);

  gRightFront_KneeJoint = new THREE.AxesHelper(1);
  scene.add(gRightFront_KneeJoint);

  gLeftFront_KneeJoint = new THREE.AxesHelper(1);
  scene.add(gLeftFront_KneeJoint);

  gRightRear_KneeJoint = new THREE.AxesHelper(1);
  scene.add(gRightRear_KneeJoint);

  gLeftRear_KneeJoint = new THREE.AxesHelper(1);
  scene.add(gLeftRear_KneeJoint);

  giraffeFrame.matrixAutoUpdate = false;
  gLower_NeckJoint.matrixAutoUpdate = false;
  gRightFront_Pelvis.matrixAutoUpdate = false;
  gLeftFront_Pelvis.matrixAutoUpdate = false;
  gRightRear_Pelvis.matrixAutoUpdate = false;
  gLeftRear_Pelvis.matrixAutoUpdate = false;
  gTail_Joint.matrixAutoUpdate = false;
  gHead_Joint.matrixAutoUpdate = false;
  gRightFront_KneeJoint.matrixAutoUpdate = false;
  gLeftFront_KneeJoint.matrixAutoUpdate = false;
  gRightRear_KneeJoint.matrixAutoUpdate = false;
  gLeftRear_KneeJoint.matrixAutoUpdate = false;

  gNeck.matrixAutoUpdate = false;
  gRightFrontThigh.matrixAutoUpdate = false;
  gLeftFrontThigh.matrixAutoUpdate = false;
  gRightRearThigh.matrixAutoUpdate = false;
  gLeftRearThigh.matrixAutoUpdate = false;
  gTail.matrixAutoUpdate = false;
  gHead.matrixAutoUpdate = false;
  gRightFrontCalf.matrixAutoUpdate = false;
  gLeftFrontCalf.matrixAutoUpdate = false;
  gRightRearCalf.matrixAutoUpdate = false;
  gLeftRearCalf.matrixAutoUpdate = false;
  gBody.matrixAutoUpdate = false;

}

/////////////////////////////////////////////////////////////////////////////////////
//  create customShader material
/////////////////////////////////////////////////////////////////////////////////////

var customShaderMaterial = new THREE.ShaderMaterial({
  //        uniforms: { textureSampler: {type: 't', value: floorTexture}},
  vertexShader: document.getElementById('customVertexShader').textContent,
  fragmentShader: document.getElementById('customFragmentShader').textContent,
});

// var ctx = renderer.context;
// ctx.getShaderInfoLog = function () { return '' };   // stops shader warnings, seen in some browsers

////////////////////////////////////////////////////////////////////////	
// initFileObjects():    read object data from OBJ files;  see onResourcesLoaded() for instances
////////////////////////////////////////////////////////////////////////	

var models;

function initFileObjects() {
  // list of OBJ files that we want to load, and their material
  models = {
    teapot: { obj: 'obj/teapot.obj', mtl: customShaderMaterial, mesh: null },
    extraTeapot: {
      obj: 'obj/teapot.obj',
      mtl: customShaderMaterial,
      mesh: null,
    },
  };

  var manager = new THREE.LoadingManager();
  manager.onLoad = function () {
    console.log('loaded all resources');
    RESOURCES_LOADED = true;
    onResourcesLoaded();
  };
  var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };
  var onError = function (xhr) {
  };

  // Load models;  asynchronous in JS, so wrap code in a fn and pass it the index
  for (var _key in models) {
    console.log('Key:', _key);
    (function (key) {
      var objLoader = new OBJLoader(manager);
      objLoader.load(models[key].obj, function (object) {
        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material = models[key].mtl;
            child.material.shading = THREE.SmoothShading;
          }
        });
        models[key].mesh = object;
      }, onProgress, onError);
    })(_key);
  }
}

/////////////////////////////////////////////////////////////////////////////////////
// onResourcesLoaded():  once all OBJ files are loaded, this gets called.
//                       Object instancing is done here
/////////////////////////////////////////////////////////////////////////////////////

function onResourcesLoaded() {

  // Clone models into meshes;   [Michiel:  AFAIK this makes a "shallow" copy of the model,
  //                             i.e., creates references to the geometry, and not full copies ]

  meshes['teapot1'] = models.teapot.mesh.clone();
  meshes['extraTeapot1'] = models.extraTeapot.mesh.clone();

  // position the object instances and parent them to the scene, i.e., WCS
  // For static objects in your scene, it is ok to use the default postion / rotation / scale
  // to build the object-to-world transformation matrix. This is what we do below.
  //
  // Three.js builds the transformation matrix according to:  M = T*R*S,
  // where T = translation, according to position.set()
  //       R = rotation, according to rotation.set(), and which implements the following "Euler angle" rotations:
  //            R = Rx * Ry * Rz
  //       S = scale, according to scale.set()

  meshes['teapot1'].position.set(3, 0, 3);
  meshes['teapot1'].scale.set(0.5, 0.5, 0.5);
  scene.add(meshes['teapot1']);

  meshes['extraTeapot1'].position.set(-5, -1, -5);
  scene.add(meshes['extraTeapot1']);

  meshesLoaded = true;
}

///////////////////////////////////////////////////////////////////////////////////////
// LISTEN TO KEYBOARD
///////////////////////////////////////////////////////////////////////////////////////

// movement
document.addEventListener('keydown', onDocumentKeyDown, false);

function onDocumentKeyDown(event) {
  var keyCode = event.which;
  // up
  if (keyCode == 'W'.charCodeAt()) {          // W = up
    light.position.y += 0.11;
    // down
  } else if (keyCode == 'S'.charCodeAt()) {   // S = down
    light.position.y -= 0.11;
    // left
  } else if (keyCode == 'A'.charCodeAt()) {   // A = left
    light.position.x -= 0.1;
    // right
  } else if (keyCode == 'D'.charCodeAt()) {   // D = right
    light.position.x += 0.11;
  } else if (keyCode == ' '.charCodeAt()) {   // space
    animation = !animation;
  } else if (keyCode == 'P'.charCodeAt()) {   // P = Another dance move!
    console.log('P pressed');
    giraffeDanceType = 2;
    defaultMusic.pause();
    anotherMusic.play();
    renderer.setClearColor('black');

  } else if (keyCode == 'O'.charCodeAt()) {   // O = back to original dance move!
    anotherMusic.pause();
    defaultMusic.play();
    console.log('O pressed');
    giraffeDanceType = 1;
    renderer.setClearColor('#C2B280');
  }
}

///////////////////////////////////////////////////////////////////////////////////////
// UPDATE CALLBACK:    This is the main animation loop
///////////////////////////////////////////////////////////////////////////////////////

function update() {
  // console.log('update()');
  var dt = 0.02;
  if (animation && meshesLoaded) {
    // advance the motion of all the animated objects
    myboxMotion.timestep(dt);
    handMotion.timestep(dt);
    if (giraffeDanceType == 1) {
      giraffeMotion1.timestep(dt);
      sphereMotion1.timestep(dt);

    } else if (giraffeDanceType == 2) {
      giraffeMotion2.timestep(dt);
      sphereMotion2.timestep(dt);
    }

  }
  if (meshesLoaded) {
    sphere.position.set(light.position.x, light.position.y, light.position.z);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(update);      // requests the next update call;  this creates a loop
}

init();
update();

