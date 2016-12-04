///<reference path="../typings/threejs/three.d.ts" />

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

function createMesh(geometry){
    var meshGeometry = geometry || new THREE.TorusGeometry();
    var materials = [
        new THREE.MeshNormalMaterial({side:THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({wireframe:true})
    ];

    return THREE.SceneUtils.createMultiMaterialObject(meshGeometry, materials);
}

//甜甜圈
var mesh = createMesh();
scene.add(mesh);

var controls = new function(){
    this.radius = 100;
    this.tube = 40;
    this.radialSegments = 8;
    this.tubularSegments = 6;
    this.arc = 2 * Math.PI;

    this.redraw = function(){
        scene.remove(mesh);
        mesh = createMesh(new THREE.TorusGeometry(controls.radius, controls.tube,
            controls.radialSegments, controls.tubularSegments, controls.arc));
        scene.add(mesh);
    }
}

var gui = new dat.GUI();
gui.add(controls, 'radius', -100, 100).onChange(controls.redraw);
gui.add(controls, 'tube', -100, 100).onChange(controls.redraw);
gui.add(controls, 'radialSegments', 0, 50).onChange(controls.redraw);
gui.add(controls, 'tubularSegments', 0, 50).onChange(controls.redraw);
gui.add(controls, 'arc', 0, 2*Math.PI).onChange(controls.redraw);

var step = 0;

camera.lookAt(scene.position);
$('#WebGL-output').append(renderer.domElement);
render();

function render(){
    stats.begin();

    mesh.rotation.y = step += 0.01;
    mesh.rotation.x = step;
    mesh.rotation.z = step;

    requestAnimationFrame(render);
    renderer.render(scene, camera);

    stats.end();
}