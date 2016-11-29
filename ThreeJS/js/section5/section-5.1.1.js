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
camera.position.set(50, 100, 100);

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
        side:THREE.DoubleSide
    }),
    new THREE.MeshBasicMaterial({
        color:0xffffff * Math.random(),
        wireframe:true
    })
];

var plane = new THREE.SceneUtils.createMultiMaterialObject(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI/2;
scene.add(plane);

//二维平面圆形
var circleGeometry = new THREE.CircleGeometry(10,20);
var circleMaterial = [
    new THREE.MeshBasicMaterial({color: 0xff0000}),
    new THREE.MeshBasicMaterial({color: 0xffffff, wireframe:true})
];
var circle = new THREE.SceneUtils.createMultiMaterialObject(circleGeometry, circleMaterial);
circle.position.y = 20;
circle.rotation.x = -Math.PI/2;
scene.add(circle);

//半圆
var halfCircleGeometry = new THREE.CircleGeometry(10,20, 0, Math.PI);
var halfCircle = new THREE.SceneUtils.createMultiMaterialObject(halfCircleGeometry, circleMaterial);
halfCircle.position.x = 30;
halfCircle.position.y = 20;
halfCircle.rotation.x = -Math.PI/2;
scene.add(halfCircle);

var axes = new THREE.AxisHelper(50);
scene.add(axes);

function drawShape(){
    var shape = new THREE.Shape();
    //移动点(10,10)，startPoint
    shape.moveTo(10, 10);

    //straight line upwards
    shape.lineTo(10, 40);
    //贝塞尔曲线（三次曲线，曲线点1[15,25], 曲线点2[25,25], 终点[30,40]）
    shape.bezierCurveTo(15, 25, 25, 25, 30, 40);
    //光滑曲线
    shape.splineThru([
        new THREE.Vector2(32, 30),
        new THREE.Vector2(28, 20),
        new THREE.Vector2(30, 10)
    ]);
    //二次曲线(曲线点[25,15], 端点[10,10])
    shape.quadraticCurveTo(25, 15, 10, 10);
    //画圆(圆心相对于起点的偏移量[x:16, y:24];x轴半径:2; y轴半径:3;起始角度:0°，终止角度:360°；顺时针画:true)
    var hole1 = new THREE.Path();
    hole1.absellipse(16, 24, 2, 3, 0, Math.PI*2, true);
    shape.holes.push(hole1);
    //
    var hole2 = new THREE.Path();
    hole2.absellipse(23, 24, 2, 3, 0, Math.PI*2, true);
    shape.holes.push(hole2);
    //画弧(圆心相对于起点的偏移量[x:26, y:16];半径:2;起始角度:0°，终止角度:180°；顺时针画:true)
    var hole3 = new THREE.Path();
    hole3.absarc(20, 16, 2, 0, Math.PI, true);
    shape.holes.push(hole3);
    
    return shape;
}

//二维几何图形
var shape = drawShape();
var shapeGeometry = new THREE.ShapeGeometry(shape);
var shapeMesh = new THREE.Mesh(shapeGeometry, new THREE.MeshBasicMaterial({color:0x00ff00}));
shapeMesh.position.set(0, 10, 50);
scene.add(shapeMesh);

//画shape的线框
var line = new THREE.Line(shape.createPointsGeometry(10), new THREE.LineBasicMaterial({color:0xff3333, linewidth:2}));
scene.add(line);

var controls = new function(){
    this.width = 180;
    this.height = 200;
    this.widthSegment = 18;
    this.heightSegment = 10;
}

var gui = new dat.GUI();
gui.add(controls, 'height', 100, 1000);
gui.add(controls, 'width', 100, 1000);
gui.add(controls, 'widthSegment').listen();
gui.add(controls, 'heightSegment').listen();

camera.lookAt(scene.position);
$('#WebGL-output').append(renderer.domElement);
render();

function render(){
    stats.begin();

    for(var childIndex in plane.children){
        plane.children[childIndex].geometry.width = controls.width;
        plane.children[childIndex].geometry.widthSegment = controls.widthSegment;
        plane.children[childIndex].geometry.height = controls.height;
        plane.children[childIndex].geometry.heightSegment = controls.heightSegment;
        plane.children[childIndex].geometry.needUpdate= true;
    };
    
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    stats.end();
}