//使用MeshLambertMaterial材质支持光源

function load15(){
    //创建一个场景
    var scene = new THREE.Scene();
    //创建一个相机
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    //创建一个渲染器
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor('#000000', 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //启用阴影映射
    renderer.shadowMapEnabled = true;
    //控制阴影类型
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //创建一个坐标轴（red: x轴，green：y轴，blue：z轴）
    var axes = new THREE.AxisHelper(20);
    scene.add(axes);

    //创建一个平面几何图形
    var planeGeometry = new THREE.PlaneGeometry(60,20);
    //创建一个指定颜色的材质
    var planeMaterial = new THREE.MeshLambertMaterial({color:0xcccccc});
    //将材质附着到平面几何图形上
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x -= 0.5 * Math.PI;
    plane.position.x = 20;
    plane.position.y = 0;
    plane.position.z = 0;
    //接受阴影
    plane.receiveShadow = true;
    scene.add(plane);

    //创建一个立方体
    var cubeGeometry = new THREE.CubeGeometry(4,4,4);
    var cubeMaterial = new THREE.MeshLambertMaterial({color:0xff0000, wireframe:true})
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    //投射阴影
    cube.castShadow = true;
    scene.add(cube);

    //添加一个球体
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial({color:0x7777ff, wireframe:true});
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    //投射阴影
    sphere.castShadow = true;
    scene.add(sphere);

    //添加一个光源(支持光源的两种材质：MeshLambertMaterial, MeshPhongMaterial)
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    //以下均为辅助参数
    //投射阴影
    spotLight.castShadow = true;
    //角度
    spotLight.angle = Math.PI / 4;
    //半影
    spotLight.penumbra = 0.05;
    //衰退
    spotLight.decay = 2;
    //距离
    //spotLight.distance = 200;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    //spotLight.shadow.camera.near = 1;
    //spotLight.shadow.camera.far = 200;
    scene.add(spotLight);

    //设置相机位置
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    $('#WebGL-output').append(renderer.domElement);
    renderer.render(scene, camera);
};