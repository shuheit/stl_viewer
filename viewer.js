var container, camera, controls, scene, mesh, renderer;

init();
render();

var button = document.getElementById("button");
button.addEventListener("change", function(event){
  scene.remove(mesh);
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload=function(event){
    var data = event.target.result;
    var blob = new Blob([data], {'type' : file.type}); 
    var url = window.URL.createObjectURL(blob);      
    console.log(url);
    var loader = new THREE.STLLoader();
    loader.addEventListener('load', function(res) {
      var geometry = res.content;
      var material = new THREE.MeshLambertMaterial( { ambient: 0xff5533, color: 0xff5533} );
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.set( 0, 0, 0 );
      scene.add( mesh );
    });
    loader.load(url);
  };
  reader.readAsArrayBuffer(file);
}, false);

function init(){
  container = document.getElementById("viewer");

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set( 0, 0, 50 );

  controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed = 0.3;
  controls.noPan = true;
  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.2;

  scene = new THREE.Scene();

  scene.add( new THREE.AmbientLight( 0x777777 ) );
  addShadowedLight( 1, 1, 1, 0xffffff, 1.0 );
  addShadowedLight( -1, 1, -1, 0xffffff, 0.8 );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0xffffff, 1 );
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMapEnabled = true;
  renderer.shadowMapCullFace = THREE.CullFaceBack;
  container.appendChild( renderer.domElement );
}

function addShadowedLight( x, y, z, color, intensity ) {
  var directionalLight = new THREE.DirectionalLight( color, intensity );
  directionalLight.position.set( x, y, z );
  scene.add( directionalLight );

  directionalLight.castShadow = true;

  var d = 1;
  directionalLight.shadowCameraLeft = -d;
  directionalLight.shadowCameraRight = d;
  directionalLight.shadowCameraTop = d;
  directionalLight.shadowCameraBottom = -d;

  directionalLight.shadowCameraNear = 1;
  directionalLight.shadowCameraFar = 4;

  directionalLight.shadowMapWidth = 1024;
  directionalLight.shadowMapHeight = 1024;

  directionalLight.shadowBias = -0.005;
  directionalLight.shadowDarkness = 0.15;
}

function render(){
  renderer.render( scene, camera );
  controls.update();
  requestAnimationFrame( render );
}
