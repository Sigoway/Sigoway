///<reference path="../typings/threejs/three.d.ts" />

function load14(){
    //创建一个场景
    var scene = new THREE.Scene();
    //创建一个相机
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    //创建一个渲染器
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor('#000000');
    renderer.setSize(window.innerWidth, window.innerHeight);

    //创建一个坐标轴（red: x轴，green：y轴，blue：z轴）
    var axes = new THREE.AxisHelper(20);
    scene.add(axes);

    //创建一个平面几何图形
    var planeGeometry = new THREE.PlaneGeometry(60,20);
    //创建一个指定颜色的材质
    var planeMaterial = new THREE.MeshBasicMaterial({color:0xcccccc});
    //将材质附着到平面几何图形上
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x -= 0.5 * Math.PI;
    plane.position.x = 20;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    //创建一个立方体
    var cubeGeometry = new THREE.CubeGeometry(4,4,4);
    var cubeMaterial = new THREE.MeshBasicMaterial({color:0xff0000, wireframe:true})
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    scene.add(cube);

    //添加一个球体
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshBasicMaterial({color:0x7777ff, wireframe:true});
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    scene.add(sphere);

    //设置相机位置
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    $('#WebGL-output').append(renderer.domElement);
    renderer.render(scene, camera);
};