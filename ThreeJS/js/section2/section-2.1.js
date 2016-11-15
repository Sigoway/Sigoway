///<reference path="typings/threejs/three.d.ts" />

var numberOfObjects = 0;
var numberOfCubes = 0;

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
    this.fogDensity = 0.015
}

var gui = new dat.GUI();
gui.add(controls, 'rotationSpeed', 0, 0.5);
gui.add(controls, 'boncingSpeed', 0, 0.5);
gui.add(controls, 'fogDensity', 0, 1);


var scene = new THREE.Scene();
//给场景设置雾化效果
//scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
//雾化方式2
//scene.fog = new THREE.FogExp2(0xffffff, controls.fogDensity);
//强制场景内所有物体使用相同的材质
//scene.overrideMaterial = new THREE.MeshLambertMaterial({color:0xff0000, wireframe: true});

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
    var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    var cubeMaterial = new THREE.MeshLambertMaterial({ color:Math.random() * 0xffffff });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.name = "cube_" + (++numberOfCubes);
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
        this.numberOfCubes--;
        this.numberOfObjects = scene.children.length;
    }
}

this.outputObjects = function(){
    console.log(scene.children);
}

$('#WebGL-output').append(renderer.domElement);
render();

var hiddenCubes = 0;

function render(){
    stats.begin();

    if(this.numberOfCubes <= 100){
        addCube();
    }

    scene.traverse(function(e){
        if(e instanceof THREE.Mesh && e != plane){
            e.rotation.x += controls.rotationSpeed;
            e.rotation.y += controls.rotationSpeed;
            e.rotation.z += controls.rotationSpeed;
        }
    });

    var cubeName = 'cube_' + Math.floor(Math.random() * 100);
    //cubeName = 'cube_2';
    var cubeMesh = scene.getObjectByName(cubeName);
    if(cubeMesh != null && cubeMesh instanceof THREE.Mesh) {
        //设置size不起作用
        // cubeMesh.geometry.normalsNeedUpdate = false;
        // cubeMesh.geometry.width += 1;
        // cubeMesh.geometry.height += 1;
        // cubeMesh.geometry.depth += 1;
        // cubeMesh.geometry.normalsNeedUpdate = true;

        if(this.hiddenCubes >= 90){
            cubeMesh.visible = true;
            this.hiddenCubes--;
        } else {
            cubeMesh.visible = false;
            this.hiddenCubes++;
        }
    }

    //雾化方式
    //scene.fog = new THREE.Fog(0xffffff, controls.fogDensity, 100);

    requestAnimationFrame(render);
    renderer.render(scene, camera);

    stats.end();
}