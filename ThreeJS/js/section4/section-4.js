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

var ambientColor = '#0c0c0c';

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set(-180, 90, -180);
camera.position.set(150, 150, 150);
//camera.position.set(0, -100, -100);

//参数antialias使线条平滑锯齿少
var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setClearColor('#000000', 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap

var planeGeometry = new THREE.PlaneGeometry(180, 180);
var planeMaterial = new THREE.MeshLambertMaterial({
    color:0xffffff, 
    opacity:0.5,
    transparent:true
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(0, 0, 0);
plane.receiveShadow = true;
scene.add(plane);

var axes = new THREE.AxisHelper(50);
scene.add(axes);

var cubeSize = 10;
var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
var cubeMaterial = new THREE.MeshDepthMaterial(/*{wireframe:true, transparent:true, opacity:0.1}*/);

function addCube(){
    var materialColor = Math.random() * 0xffffff;
    var colorMaterial = new THREE.MeshPhongMaterial({
         color:materialColor,
         specular:materialColor,
         transparent:true,
         blending: THREE.MultiplyBlending
     });

    var halfPlaneWidth = planeGeometry.parameters.width / 2; 
    var halfPlaneHeight = planeGeometry.parameters.height / 2; 
    var cube = THREE.SceneUtils.createMultiMaterialObject(cubeGeometry, [colorMaterial, cubeMaterial]);
    cube.children[1].geometry.scale(0.99, 0.99, 0.99);
    cube.position.x = (Math.random() * 50);
    cube.position.y = 10;
    cube.position.z = (Math.random() * 50);
    scene.add(cube);
}

var controls = new function(){
    this.cameraNear = 0.1;
    this.cameraFar = 1000;
    this.addCube = function(){
        addCube();
    }
}

var gui = new dat.GUI();
gui.add(controls, 'addCube');
gui.add(controls, 'cameraNear').listen();
gui.add(controls, 'cameraFar').listen();

var sphereGeometry = new THREE.SphereGeometry(25);
var sphereMaterials = [
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

//符合材质，本质上是创建了多个Mesh
var lookAtSphereGeom = THREE.SceneUtils.createMultiMaterialObject(sphereGeometry, sphereMaterials);
lookAtSphereGeom.children.forEach(function(e){e.castShadow=true;})
lookAtSphereGeom.name='LookAtSphere';
lookAtSphereGeom.position.set(0, 10, 0);

for(var faceIndex = 0, faceLength = lookAtSphereGeom.children[0].geometry.faces.length; faceIndex < faceLength; faceIndex++){
    var face = lookAtSphereGeom.children[0].geometry.faces[faceIndex];
    var arrow = new THREE.ArrowHelper(face.normal, face.normal, 50, 0xffffff);
    lookAtSphereGeom.add(arrow);
}
scene.add(lookAtSphereGeom);

//MeshBasicMaterial
var matArray = [
    new THREE.MeshBasicMaterial({color:Math.random()*0xffffff}),
    new THREE.MeshBasicMaterial({color:Math.random()*0xff00ff}),
    new THREE.MeshBasicMaterial({color:Math.random()*0xffff00}),
    new THREE.MeshBasicMaterial({color:Math.random()*0x00ffff}),
    new THREE.MeshBasicMaterial({color:Math.random()*0xff00ff}),
    new THREE.MeshBasicMaterial({color:Math.random()*0xffff00})
];
var faceMaterial = new THREE.MeshFaceMaterial(matArray);
var cubeGeometry = new THREE.CubeGeometry(25,25,25);
var cube = new THREE.Mesh(cubeGeometry, faceMaterial);
cube.position.set(0,25,60);
scene.add(cube);

function getPoints(start, end){
    var points = [];
    // for(var i = start; i<end; i++){
    //     points.push(new THREE.Vector3(i*100, Math.abs(Math.sin(i) * 100), 0))
    // }
    points.push(new THREE.Vector3(0, 50, 0));
    points.push(new THREE.Vector3(50, 50, 0));
    points.push(new THREE.Vector3(50, 0, 0));
    points.push(new THREE.Vector3(50, 0, 50));
    points.push(new THREE.Vector3(50, 50, 50));
    points.push(new THREE.Vector3(0, 50, 50));

    return points;
}

var points = getPoints(4, 60);
var lines = new THREE.Geometry();
var colors = [];
var index = 0;
points.forEach(function(e){
    lines.vertices.push(new THREE.Vector3(e.x, e.y, e.z));
    colors[index] = new THREE.Color(0xffffff);
    colors[index].setHSL(e.x, e.y * 20, 0.8);
    index++;
});
lines.colors = colors;

var lineMaterial = new THREE.LineBasicMaterial({
    opacity:1.0,
    linewidth:1,
    vertexColors:THREE.VertexColors
});

lines.computeLineDistances();//用来计算线缝隙，如果不执行语句不会显示点线效果
lineMaterial = new THREE.LineDashedMaterial({
    vertexColors:true,
    color:0xffffff,
    dashSize:10,//线段长度
    gapSize:1,//线段间隙
    scale:1//缩放比例，<1: dashSize和gapSize会扩大，反之缩小
});

var line = new THREE.Line(lines, lineMaterial);
scene.add(line);

//照射光源
var directionLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionLight.position.set(-20, 40, 60);
directionLight.shadowCameraNear = 2;
directionLight.shadowCameraFar = 200;
directionLight.shadowCameraLeft = -50;
directionLight.shadowCameraRight = 50;
directionLight.shadowCameraTop = 100;
directionLight.shadowCameraBottom = -100;
scene.add(directionLight);

//环境光
var ambientLight = new THREE.AmbientLight(ambientColor);
scene.add(ambientLight);

// gui.addColor(controls, 'ambientColor').onChange(function(e){
//     ambientLight.color = new THREE.Color(e);
// });

//点光源
var pointLight = new THREE.PointLight('#ccffcc');
pointLight.distance = 30;
scene.add(pointLight);
// //光源距离
// gui.add(controls, 'distance', 1, 500).onChange(function(e){
//     pointLight.distance = e;
// });
// //光源强度
// gui.add(controls, 'intensity', 1, 10).onChange(function(e){
//     pointLight.intensity = e;
// });

var spotLight = new THREE.SpotLight('#ffffff');
spotLight.position.set(60, 60, -10);
spotLight.castShadow = true;
// spotLight.shadowCameraFov = 1;
//阴影映射宽度（使阴影平滑）
//spotLight.shadowMapWidth = 99;
//阴影映射高度（使阴影平滑）
//spotLight.shadowMapHeight = 99;
//显示光源
spotLight.shadow.camera.visible = true;
// spotLight.exponent = 1;
// spotLight.angle = 1;
scene.add(spotLight);

camera.near = controls.cameraNear;
camera.near = controls.cameraFar;

camera.lookAt(scene.position);
$('#WebGL-output').append(renderer.domElement);
render();

var step = 0;

function render(){
    stats.begin();

    // step += 0.02;
    // if(camera instanceof THREE.Camera){
    //     var x = 10 + (100 * Math.sin(step));
    //     var newPosition = new THREE.Vector3(x, 10, 0); 
    //     camera.lookAt(newPosition);
    //     lookAtSphereGeom.position.copy(newPosition);
    // }
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    stats.end();
}