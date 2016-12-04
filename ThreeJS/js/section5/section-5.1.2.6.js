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
camera.position.set(10, 10, 10);

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
        opacity:0.5
    }),
    new THREE.MeshBasicMaterial({
        color:0xffffff * Math.random(),
        wireframe:true,
        transparent:true,
        opacity:0.5
    })
];

var plane = new THREE.SceneUtils.createMultiMaterialObject(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI/2;
scene.add(plane);

function createMesh(geometry){
    var materials = [
        new THREE.MeshNormalMaterial({side:THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({wireframe:true})
    ];

    return THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
}

//甜甜圈
var polyhedron = createMesh(new THREE.IcosahedronGeometry(10, 0));
scene.add(polyhedron);

var controls = new function(){
    this.radius = 10;
    this.detail = 1;
    this.type = 'Icosahedron';

    this.redraw = function(){
        scene.remove(polyhedron);

        switch(controls.type){
            //具有20个相同的三角形的多面体(detail=0时)
            case 'Icosahedron':
                polyhedron = createMesh(new THREE.IcosahedronGeometry(controls.radius, controls.detail));
                break;
            //正四面体(4个三角形)
            case 'Tetrahedron':
                polyhedron = createMesh(new THREE.TetrahedronGeometry(controls.radius, controls.detail));
                break;
            //正八面体(8个面)
            case 'Octahedron':
                polyhedron = createMesh(new THREE.OctahedronGeometry(controls.radius, controls.detail));
                break;
            //正十二面体(8个面)
            case 'Dodecahedron':
                polyhedron = createMesh(new THREE.DodecahedronGeometry(controls.radius, controls.detail));
                break;
            case 'Custom':
            default:
                var vertices = [
                    1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1
                ];
                var faces =[
                    2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
                ];
                //多面体
                polyhedron = createMesh(new THREE.PolyhedronGeometry(vertices, faces, controls.q, controls.heightScale));
                break
        }
        scene.add(polyhedron);
    }
}

var gui = new dat.GUI();
gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
gui.add(controls, 'detail', 0, 10).step(1).onChange(controls.redraw);
gui.add(controls, 'type', ['Icosahedron', 'Tetrahedron', 'Octahedron', 'Dodecahedron', 'Custom']).onChange(controls.redraw);

var step = 0;

camera.lookAt(scene.position);
$('#WebGL-output').append(renderer.domElement);
render();

function render(){
    stats.begin();

    polyhedron.rotation.y = step += 0.01;
    polyhedron.rotation.x = step;
    polyhedron.rotation.z = step;

    requestAnimationFrame(render);
    renderer.render(scene, camera);

    stats.end();
}