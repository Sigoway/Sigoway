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
var controls = new function(){
    this.cameraType = 'PerspectiveCamera';
    this.switchCamera = function(){
        if(camera instanceof THREE.PerspectiveCamera){
            camera = new THREE.OrthographicCamera(window.innerWidth / -6, window.innerWidth / 6,
                                                  window.innerHeight / 6, window.innerHeight / -6, -100, 500);
            // camera = new THREE.OrthographicCamera(-window.innerWidth, window.innerWidth, 
            //                                       window.innerHeight, -window.innerHeight);
            this.cameraType = 'OrthographicCamera';
        } else {
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.cameraType = 'PerspectiveCamera';
        }

        camera.position.set(-180, 90, -180);
        camera.lookAt(scene.position);
    }

    //环境光颜色
    this.ambientColor = ambientColor;
    //点光源距离
    this.distance = 50;
    //点光源强度
    this.intensity = 1;
}

var gui = new dat.GUI();
gui.add(controls, 'switchCamera');
gui.add(controls, 'cameraType').listen();

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set(-180, 90, -180);
camera.position.set(150, 150, 150);

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
// axes.rotateZ(-0.25 * Math.PI)
scene.add(axes);

var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
var cubeMaterial = new THREE.MeshLambertMaterial({ color:Math.random() * 0xffffff });

var halfPlaneWidth = planeGeometry.parameters.width / 2; 
var halfPlaneHeight = planeGeometry.parameters.height / 2; 
for(var x = 0; x < 5; x++){
    for(var z = 0; z < 5; z++){
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.x = -halfPlaneWidth + 2 * (x * 5);
        cube.position.y = 0;
        cube.position.z = -halfPlaneHeight + 2 * (z * 5);
        scene.add(cube);
    }
}

var sphereGeometyr = new THREE.SphereGeometry(5);
var sphereMaterials = [
    new THREE.MeshLambertMaterial({
        opacity:0.6,
        color:0x44ff44,
        transparent:true
    }),
    new THREE.MeshBasicMaterial({
        color:0x000000,
        wireframe:true
    })
];
    
//符合材质，本质上是创建了多个Mesh
var lookAtSphereGeom = THREE.SceneUtils.createMultiMaterialObject(sphereGeometyr, sphereMaterials);
lookAtSphereGeom.children.forEach(function(e){e.castShadow=true;})
lookAtSphereGeom.name='LookAtSphere';
lookAtSphereGeom.position.set(0, 10, 0);
scene.add(lookAtSphereGeom);

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

gui.addColor(controls, 'ambientColor').onChange(function(e){
    ambientLight.color = new THREE.Color(e);
});

//点光源
var pointLight = new THREE.PointLight('#ccffcc');
pointLight.distance = 30;
scene.add(pointLight);
//光源距离
gui.add(controls, 'distance', 1, 500).onChange(function(e){
    pointLight.distance = e;
});
//光源强度
gui.add(controls, 'intensity', 1, 10).onChange(function(e){
    pointLight.intensity = e;
});

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