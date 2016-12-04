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

function createCylinder(geometry){
    var cylinderGeometry = geometry || new THREE.CylinderGeometry();
    var materials = [
        new THREE.MeshNormalMaterial({side:THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({wireframe:true})
    ];

    return THREE.SceneUtils.createMultiMaterialObject(cylinderGeometry,materials);
}

//圆柱体
var cylinder = createCylinder();
scene.add(cylinder);

var controls = new function(){
    this.radiusTop = 20;
    this.radiusBottom = 20;
    this.height = 100;
    this.radiusSegments = 8;
    this.heightSegments = 1;
    this.openEnded = true;
    this.thetaStart = 0;
    this.thetaLength = Math.PI;

    this.redraw = function(){
        scene.remove(cylinder);
        cylinder = createCylinder(new THREE.CylinderGeometry(controls.radiusTop, controls.radiusBottom,
            controls.height, controls.radiusSegments, controls.heightSegments,
            controls.openEnded, controls.thetaStart, controls.thetaLength));
        scene.add(cylinder);
    }
}

var gui = new dat.GUI();
gui.add(controls, 'radiusTop', -100, 100).onChange(controls.redraw);
gui.add(controls, 'radiusBottom', -100, 100).onChange(controls.redraw);
gui.add(controls, 'height', 0, 500).onChange(controls.redraw);
gui.add(controls, 'radiusSegments', 0, 50).onChange(controls.redraw);
gui.add(controls, 'heightSegments', 0, 50).onChange(controls.redraw);
gui.add(controls, 'openEnded', 0, 1).onChange(controls.redraw);
gui.add(controls, 'thetaStart', 0, 2 * Math.PI).onChange(controls.redraw);
gui.add(controls, 'thetaLength', 0, 2*Math.PI).onChange(controls.redraw);

var step = 0;

camera.lookAt(scene.position);
$('#WebGL-output').append(renderer.domElement);
render();

function render(){
    stats.begin();

    cylinder.rotation.y = step += 0.01;
    cylinder.rotation.x = step;
    cylinder.rotation.z = step;

    requestAnimationFrame(render);
    renderer.render(scene, camera);

    stats.end();
}