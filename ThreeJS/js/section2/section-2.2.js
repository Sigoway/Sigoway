///<reference path="../typings/threejs/three.d.ts" />

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
    this.scaleOffset = 10;
}

var gui = new dat.GUI();
gui.add(controls, 'rotationSpeed', 0, 0.5);
gui.add(controls, 'boncingSpeed', 0, 0.5);
gui.add(controls, 'fogDensity', 0, 1);
gui.add(controls, 'scaleOffset', 0, 10);


var scene = new THREE.Scene();
//给场景设置雾化效果
//scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
//雾化方式2
//scene.fog = new THREE.FogExp2(0xffffff, controls.fogDensity);
//强制场景内所有物体使用相同的材质
//scene.overrideMaterial = new THREE.MeshLambertMaterial({color:0xff0000, wireframe: true});

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
//参数antialias使线条平滑锯齿少
var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setClearColor('#000000', 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap

var planeGeometry = new THREE.PlaneGeometry(60, 40);
var planeMaterial = new THREE.MeshLambertMaterial({
    color:0xffffff, 
    opacity:0.5,
    transparent:true
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x -= 0.5 * Math.PI;
plane.position.x = 20;
plane.position.y = 0;
plane.position.z = 0;
plane.receiveShadow = true;
scene.add(plane);

var axes = new THREE.AxisHelper(50);
// axes.rotateZ(-0.25 * Math.PI)
scene.add(axes);

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

this.addCubeByName = function(name){
    var cubeSize = Math.ceil(Math.random() * 3);
    var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    var cubeMaterial = new THREE.MeshLambertMaterial({ color:Math.random() * 0xffffff });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.name = name;
    cube.position.x = -30 + Math.round(Math.random() * planeGeometry.parameters.width);
    cube.position.y = Math.round(Math.random() * 5);
    cube.position.z = -20 + Math.round(Math.random() * planeGeometry.parameters.height);

    scene.add(cube);
    this.numberOfObjects = scene.children.length;
}
this.addCube = function(){
    this.addCubeByName("cube_" + (++numberOfCubes));
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

function addCustomMesh(){
    //parameter is axes
    var vertices = [
        new THREE.Vector3(1,3,1),
        new THREE.Vector3(1,3,-1),
        new THREE.Vector3(1,-1,1),
        new THREE.Vector3(1,-1,-1),
        new THREE.Vector3(-1,3,-1),
        new THREE.Vector3(-1,3,1),
        new THREE.Vector3(-1,-1,1),
        new THREE.Vector3(-1,-1,1)
    ];

    //parameter is index of the vertices array 
    var faces = [
        new THREE.Face3(0,2,1),
        new THREE.Face3(2,3,1),
        new THREE.Face3(4,6,5),
        new THREE.Face3(6,7,5),
        new THREE.Face3(4,5,1),
        new THREE.Face3(5,0,1),
        new THREE.Face3(7,6,2),
        new THREE.Face3(6,3,2),
        new THREE.Face3(5,7,0),
        new THREE.Face3(7,2,0),
        new THREE.Face3(1,3,4),
        new THREE.Face3(3,6,4)
    ];

    var geometry = new THREE.Geometry();
    geometry.vertices = vertices;
    geometry.faces = faces;
    geometry.computeVertexNormals();
    geometry.mergeVertices();

    var materials = [
        new THREE.MeshLambertMaterial({
            opacity:0.6,
            color:0x44ff44,
            transparent:true
        }),
        new THREE.MeshBasicMaterial({
            color:0xffffff,
            wireframe:true
        })
    ];
    
    //符合材质，本质上是创建了多个Mesh
    var meshMulti = new THREE.SceneUtils.createMultiMaterialObject(geometry,materials);
    meshMulti.children.forEach(function(e){e.castShadow=true;})
    meshMulti.name='multiMesh';
    return meshMulti;
}

this.addCubeByName('cube_100');

var mesh = addCustomMesh();
scene.add(mesh);

$('#WebGL-output').append(renderer.domElement);
render();

var hiddenCubes = 0;

var scaleOffset = 0.01;

var translateTimes = 0;

function render(){
    stats.begin();

    requestAnimationFrame(render);
    renderer.render(scene, camera);

    stats.end();
}

function translateObject(name){
    var cubeMesh = scene.getObjectByName(name);
    if(cubeMesh != null){
        if(isChecked('cbx') && isChecked('cby') && isChecked('cbz')){
            cubeMesh.translate(1,axes);
            return;
        }
        if(isChecked('cbx')){
            cubeMesh.translateX(1);
        }
        if(isChecked('cby')){
            cubeMesh.translateY(1);
        }
        if(isChecked('cbz')){
            cubeMesh.translateZ(1);
        }
    }
}

function isChecked(id){
    //方式1
    return $('#'+id).is(':checked');
    //方式2
    //return $("#hideWire").prop("checked");
}

function getValue(id){
    return $('#'+id).val();
}

function setValue(id, value){
    return $('#'+id).val(value);
}

function scaleObject(name){
    var cubeMesh = scene.getObjectByName(name);
    if(cubeMesh != null && cubeMesh instanceof THREE.Mesh){
        var width = getValue('txtX');
        var height = getValue('txtY');
        var depth = getValue('txtZ');
        var scaleX = width / cubeMesh.geometry.parameters.width;
        var scaleY = height / cubeMesh.geometry.parameters.height;
        var scaleZ = depth / cubeMesh.geometry.parameters.depth;
        cubeMesh.geometry.scale(scaleX, scaleY, scaleZ);

         cubeMesh.geometry.parameters.width = width;
         cubeMesh.geometry.parameters.height = height;
         cubeMesh.geometry.parameters.depth = depth;

    }
}

function resizeObject(name){
    var cubeMesh = scene.getObjectByName(name);
    if(cubeMesh != null && cubeMesh instanceof THREE.Mesh){
        //设置Size不起作用
         cubeMesh.geometry.parameters.depth = getValue('txtZ');
         cubeMesh.geometry.computeFaceNormals();
    }
}

function init(){
    var cubeMesh = scene.getObjectByName('cube_100');
    if(cubeMesh != null && cubeMesh instanceof THREE.Mesh){
         setValue('txtX', cubeMesh.geometry.parameters.width);
         setValue('txtY', cubeMesh.geometry.parameters.height);
         setValue('txtZ', cubeMesh.geometry.parameters.depth);
    }
}

function cloneObject(){
    try{

    var cloned = mesh.children[0].geometry.clone();
    var materials = [
        new THREE.MeshLambertMaterial({
            opacity:0.6,
            color:0x44ff44,
            transparent:true
        }),
        new THREE.MeshBasicMaterial({
            color:0xffffff,
            wireframe:true
        })
    ];

    var cloneMesh = new THREE.SceneUtils.createMultiMaterialObject(cloned, materials);
    cloneMesh.translateX(5);
    cloneMesh.translateZ(3);
    cloneMesh.name='clone';
    scene.remove(scene.getObjectByName('clone'));
    scene.add(cloneMesh);
    }catch(err){
        window.alert(err);
    }
}

function hideWire (){
    if($("#hideWire").prop("checked")){
        mesh.children[1].visible = false;
    }else{
        mesh.children[1].visible = true;
    }
}