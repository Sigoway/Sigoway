///<reference path="typings/threejs/three.d.ts" />

var numberOfObjects = 0;

var stats = initStat();

function initStat(){
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.position = 'absolute';
    stats.domElement.left = '0';
    stats.domElement.top = '0';
    $('#Stats-output').append(stats.domElement);

    return stats;
}

var controls = new function(){
    this.rotationSpeed = 0.02;
    this.boncingSpeed = 0.03;
}

var gui = new dat.GUI();
gui.add(controls, 'rotationSpeed', 0, 0.5);
gui.add(controls, 'boncingSpeed', 0, 0.5);


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor('#000000', 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap

var planeGeometry = new THREE.PlaneGeometry(60, 40);
var planeMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x -= 0.5 * Math.PI;
plane.position.x = 20;
plane.position.y = 0;
plane.position.z = 0;
plane.receiveShadow = true;
scene.add(plane);

//环境光
var ambientLight = new THREE.AmbientLight(0x0c0c0c);
scene.add(ambientLight);

//照射光源
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-40, 60, -10);
scene.add(spotLight);

camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 30;
camera.lookAt(scene.position);

this.addCube = function(){
    var cubeSize = Math.ceil(Math.random() * 3);
    var cubeGeometry = new THREE.CubeGeometry(cubeSize, cubeSize, cubeSize);
    var cubeMaterial = new THREE.MeshLambertMaterial({ color:Math.random() * 0xffffff });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.name = "cube_" + scene.children.length;
    cube.position.x = -30 + Math.round(Math.random() * planeGeometry.parameters.width);
    cube.position.y = Math.round(Math.random() * 5);
    cube.position.z = -20 + Math.round(Math.random() * planeGeometry.parameters.height);

    scene.add(cube);
    this.numberOfObjects = scene.children.length;
}

this.removeCube = function(){
    var allChildren = scene.children;
    var lastObject = allChildren[allChildren.length - 1];
    if(lastObject instanceof THREE.Mesh){
        scene.remove(lastObject);
        this.numberOfObjects = scene.children.length;
    }
}

this.outputObjects = function(){
    console.log(scene.children);
}

$('#WebGL-output').append(renderer.domElement);
render();

function render(){
    stats.begin();

    if(this.numberOfObjects < 100){
        addCube();
    }

    scene.traverse(function(e){
        if(e instanceof THREE.Mesh && e != plane){
            e.rotation.x += controls.rotationSpeed;
            e.rotation.y += controls.rotationSpeed;
            e.rotation.z += controls.rotationSpeed;
        }
    });

    requestAnimationFrame(render);
    renderer.render(scene, camera);

    stats.end();
}