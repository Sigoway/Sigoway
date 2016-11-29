///<reference path="typings/threejs/three.d.ts" />

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

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set(-180, 90, -180);
//camera.position.set(150, 150, 150);
camera.position.set(100, 100, 100);

//参数antialias使线条平滑锯齿少
var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setClearColor('#000000', 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap

//二维平面几何
var planeGeometry = new THREE.PlaneGeometry(120, 80, 40, 40);
var planeMaterial = [
    //计算法向颜色各个面颜色不一样
    new THREE.MeshNormalMaterial({
        side:THREE.DoubleSide,
        transparent:true,
        opacity:0.6
    }),
    new THREE.MeshBasicMaterial({
        color:0xffffff * Math.random(),
        wireframe:true,
        transparent:true,
        opacity:0.6
    })
];

var plane = new THREE.SceneUtils.createMultiMaterialObject(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI/2;
scene.add(plane);

//立体几何，各面分段
var cubeGeometry = new THREE.CubeGeometry(20, 20, 20, 10, 10, 10);
var cubeMaterial = [
    //计算法向颜色各个面颜色不一样
    new THREE.MeshNormalMaterial({
        opacity:0.8,
        transparent:true,
    }),
    new THREE.MeshBasicMaterial({
        color:0x000000,
        wireframe:true,
        shading:THREE.FlatShading
    })
];
var cube = THREE.SceneUtils.createMultiMaterialObject(cubeGeometry, cubeMaterial); 
scene.add(cube);

function createSphere(geom){
    var materials = [
        new THREE.MeshNormalMaterial({side:THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({wireframe:true})
    ];

    return THREE.SceneUtils.createMultiMaterialObject(geom,materials);
}

//球
var sphere = createSphere(new THREE.SphereGeometry(4,10,10));
sphere.position.set(-50, 10, -50);
scene.add(sphere);

var controls = new function(){
    this.radius = sphere.children[0].geometry.parameters.radius;
    this.widthSegments = sphere.children[0].geometry.parameters.widthSegments;
    this.heightSegments = sphere.children[0].geometry.parameters.heightSegments;
    this.phiStart = 0;
    this.phiLength = 2 * Math.PI;
    this.thetaStart = 0;
    this.thetaLength = Math.PI;

    this.redraw = function(){
        scene.remove(sphere);
        sphere = createSphere(new THREE.SphereGeometry(controls.radius, controls.widthSegments,
            controls.heightSegments, controls.phiStart, controls.phiLength,
            controls.thetaStart, controls.thetaLength));
        sphere.position.set(-50, 10, -50);
        scene.add(sphere);
    }
}

var gui = new dat.GUI();
gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
gui.add(controls, 'widthSegments', 0, 20).onChange(controls.redraw);
gui.add(controls, 'heightSegments', 0, 20).onChange(controls.redraw);
gui.add(controls, 'phiStart', 0, 2*Math.PI).onChange(controls.redraw);
gui.add(controls, 'phiLength', 0, 2*Math.PI).onChange(controls.redraw);
gui.add(controls, 'thetaStart', 0, 2*Math.PI).onChange(controls.redraw);
gui.add(controls, 'thetaLength', 0, 2*Math.PI).onChange(controls.redraw);

var step = 0;

camera.lookAt(scene.position);
$('#WebGL-output').append(renderer.domElement);
render();

function render(){
    stats.begin();

    sphere.rotation.y = step += 0.01;
    
    cube.rotation.x = step;
    cube.rotation.y = step;
    cube.rotation.z = step;

    requestAnimationFrame(render);
    renderer.render(scene, camera);

    stats.end();
}