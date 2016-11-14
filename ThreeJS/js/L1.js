/// <reference path="../libs/typings/tsd.d.ts" />

//创建一个场景
var scene = new THREE.Scene();
//创建一个相机
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//创建一个渲染器
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//renderer.setSize( window.innerWidth/2, window.innerHeight/2, false );
document.body.appendChild( renderer.domElement );

//添加一个立方体
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
camera.position.z = 5;

//在屏幕中渲染
function render() {
    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;
    
    requestAnimationFrame( render );
    renderer.render( scene, camera );
}
render();