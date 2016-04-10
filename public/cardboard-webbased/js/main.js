var camera, scene, renderer, stats;
var effect, controls, ball;
var element, container;
var sky;
var squareMesh = [];
var horiz = 0;
var count = 0;
var trueFalse = true;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), INTERSECTED;
var firebaseRef = "https://cardboard-webpage.firebaseIO.com/images/";

var clock = new THREE.Clock();

var address = window.location.href;
init("textures/patterns/starroom2.jpg");
animate();

function init(world) {
    renderer = new THREE.WebGLRenderer();
    element = renderer.domElement;
    container = document.getElementById('example');
    container.appendChild(element);

    effect = new THREE.StereoEffect(renderer);

    scene = new THREE.Scene();


    camera = new THREE.PerspectiveCamera(90, 1, 0.001, 7000000);
    camera.position.set(0, 10, 0);
    scene.add(camera);

    // Add OrbitControls so that we can pan around with the mouse.
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //stats
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild(stats.domElement);

    function setOrientationControls(e) {
        if (!e.alpha) {
            return;
        }

        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();

        element.addEventListener('click', fullscreen, false);

        window.removeEventListener('deviceorientation', setOrientationControls, true);
    }
    window.addEventListener('deviceorientation', setOrientationControls, true);
    window.addEventListener( 'mousemove', onMouseMove, false );


    var texture = THREE.ImageUtils.loadTexture(
        'textures/patterns/checker.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat = new THREE.Vector2(50, 50);
    texture.anisotropy = renderer.getMaxAnisotropy();

    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 20,
        shading: THREE.FlatShading,
        map: texture
    });

    //var Book = "Luke Skywalker has vanished. In his absence, the sinister FIRST ORDER has risen from the ashes of the Empire and will not rest until Skywalker, the last Jedi, has been destroyed. With the support of the REPUBLIC, General Leia Organa leads a brave RESISTANCE. She is desperate to find her brother Luke and gain his help in restoring peace and justice to the galaxy. Leia has sent her most daring pilot on a secret mission to Jakku, where an old ally has discovered a clue to Luke’s whereabouts . . . .";


    function exampleSquare() {
      // This code demonstrates how to draw a square
      var triangle = new THREE.Geometry();
      triangle.vertices.push( new THREE.Vector3( 100, 100, 0 ) );
      triangle.vertices.push( new THREE.Vector3( 300, 100, 0 ) );
      triangle.vertices.push( new THREE.Vector3( 300, 300, 0 ) );
      triangle.vertices.push( new THREE.Vector3( 100, 300, 0 ) );

      triangle.faces.push( new THREE.Face3( 0, 1, 2 ) );
      triangle.faces.push( new THREE.Face3( 0, 3, 2)  );

      return triangle;
    }


    var geometry = new THREE.PlaneGeometry(1000, 1000);

    //sky dome
    var skyGeo = new THREE.SphereGeometry(1000, 100, 100);
    var textureSky = THREE.ImageUtils.loadTexture(world);
    var materialSky = new THREE.MeshPhongMaterial({
      map: textureSky
    });
    textureSky.dispose();
    var sky = new THREE.Mesh(skyGeo, materialSky);

    sky.material.side = THREE.DoubleSide;

    //light sources
    var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
    scene.add(light);

    var ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);

    scene.add(sky);
    //typeWord("Look up to change Scenes");
    var geometryCursor = new THREE.RingGeometry(
      0.85*15 , 1*15 , 32
    );
    var materialCursor = new THREE.MeshBasicMaterial(
    {
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });

    var f = new Firebase(firebaseRef + 'pano/' + hash + '/comment/');
    f.once("value",function(snapshot){
      snapshot.forEach(function(data){
        
      });
    });
    // var cursor = new THREE.Mesh(geometryCursor,materialCursor);
    // camera.add(cursor);
    // cursor.position.z = -100;
    // cursor.lookAt( camera.position);
    // var sphereGeo = new THREE.SphereGeometry(100, 32, 16);

    // Commented out special ball geometry, may be useful at another day and time


    // var moonTexture = THREE.ImageUtils.loadTexture( "textures/patterns/014_pano3.jpg" );
    // var moonMaterial = new THREE.MeshBasicMaterial( { map: moonTexture } );
    // var moon = new THREE.Mesh(sphereGeo, moonMaterial);
    // scene.add(moon);
    // moon.position.set(-800,250,0);
    //
    // // create custom material from the shader code above
    // //   that is within specially labeled script tags
    // var customMaterial = new THREE.ShaderMaterial({
    //   uniforms: {  },
    //   vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
    //   fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
    //   side: THREE.DoubleSide,
    //   blending: THREE.AdditiveBlending,
    //   transparent: true
    // });
    // var ballGeometry = new THREE.SphereGeometry( 120, 32, 16 );
    // ball = new THREE.Mesh( ballGeometry, customMaterial );
    // scene.add( ball );
    // ball.position.set(-800,250,0);

    window.addEventListener('resize', resize, false);
    setTimeout(resize, 1);
}

// local scale factor to make the ring appear correct
var _SCALE = 3;

function Cursor() { //make a ring to allow users to see where the center is onscreen
  var geometryCursor = new THREE.RingGeometry(
    0.85 * Cursor.SIZE * _SCALE, 1 * Cursor.SIZE * _SCALE, 32
    );
      var materialCursor = new THREE.MeshBasicMaterial(
      {
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
      }
    );
  THREE.Mesh.call(this, geometryCursor, materialCursor);
}
function onMouseMove( event ) {

// calculate mouse position in normalized device coordinates
// (-1 to +1) for both components

mouse.x = 0;//( window.innerWidth / 2);// * 2 - 1;
mouse.y = 0;//- ( window.innerHeight / 2);// * 2 + 1;

}
function typeWord(text){ //will put the entered phrase onto the screen
    for (j = 0; j< text.length;j++ ){
    if(text.charCodeAt(j) == 32) // if a space we keep going with the program
      continue;

    var geometry = new THREE.PlaneGeometry(15,15);//exampleSquare();
    var textWords = THREE.ImageUtils.loadTexture( "textures/text/olSb3.png" );
    textWords.minFilter = textWords.magFilter = THREE.NearestFilter;
    var squareMaterial =  new THREE.MeshPhongMaterial({ map:textWords,color:0xffffff });
    squareMesh[0+j] = new THREE.Mesh( geometry, squareMaterial );
    squareMesh[j].material.side = THREE.DoubleSide;
    squareMesh[j].material.opacity = 0.6;
    squareMesh[j].material.transparent = true;


    //change to display letters

    geometry.computeBoundingBox();
    var squarefaces = geometry.faces;
    var max = geometry.boundingBox.max,
      min = geometry.boundingBox.min;
    var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
    geometry.faceVertexUvs[0] = [];

    //convert to the ascii of the character on this run through
    var hexNum = (text.charCodeAt(j)).toString(16);
    var xindex = parseInt(hexNum[1],16);//(text.charCodeAt(j))%16,
      yindex = 15-parseInt(hexNum[0],16);//((text.charCodeAt(j))-xindex)/16;

    //For the text to be made find the index on the canvas that the letter is mapped to
    var multx =	(xindex)/16;
    var multy = (yindex)/16;
    for (i = 0; i < geometry.faces.length ; i++) {
      var v1 = geometry.vertices[squarefaces[i].a],
        v2 = geometry.vertices[squarefaces[i].b],
        v3 = geometry.vertices[squarefaces[i].c];
      geometry.faceVertexUvs[0].push([
        new THREE.Vector2((1/16)*(v1.x + offset.x)/range.x + multx,(1/16)*(v1.y + offset.y)/range.y + multy),
        new THREE.Vector2((1/16)*(v2.x + offset.x)/range.x + multx,(1/16)*(v2.y + offset.y)/range.y + multy),
        new THREE.Vector2((1/16)*(v3.x + offset.x)/range.x + multx,(1/16)*(v3.y + offset.y)/range.y + multy)
      ]);
    }

    geometry.uvsNeedUpdate = true;
    camera.add(squareMesh[j]);

    count++;
    // Position tiles
    if (count == 27 ){ // will send the text to a newline when it is to long
      horiz += 20;
      count=1;
    }
    squareMesh[j].position.set(15*(j%27)-15*27/2,-horiz,-10*27 - 30);//27 - arbitrary length choosen for Star Wars
    }
}

function resize() {
    var width = container.offsetWidth;
    var height = container.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    effect.setSize(width, height);
}

THREE.Utils = {
  cameraLookDir: function(camera) {
    var vector = new THREE.Vector3(0,0,-1);
    vector.applyEuler(camera.rotation, camera.eulerOrder);
    return vector;
  }
}

function update(dt) {
    resize();
    var timer = new Date().getTime() * 0.0005;

    camera.updateProjectionMatrix();

    //THREE.Utils.cameraLookDir(camera);
    controls.update(dt);
    stats.update();
}

function render(dt) {
    var timer = new Date().getTime() * 0.0005;
    raycaster.setFromCamera( mouse, camera );

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects( scene.children );
    for ( var i = 0; i < intersects.length; i++ ) {
      //console.log(intersects[i].object.material);
      try{
        //intersects[ i ].object.material.color.set( 0xff0000 );
        if(ball == intersects[i].object){
          console.log("Working");
        }
      }catch(e){console.log(e);}
    }

    fadeEffect(squareMesh,((Math.cos(timer))/(Math.cos(Math.PI))) );

    effect.render(scene, camera);
}

function fadeEffect(words,value){
    for(k=0;k<(words.length);k++){
      if(words[k] == null)
        continue;
      if((words[k].material.opacity = value) < 0)
        words[k].material.opacity = words[k].material.opacity * -1;
    }
}

function eraseWorld() {
    document.getElementById('example').innerHTML = "";
    while (scene.children.length > 0) {
        scene.remove(scene.children[scene.children.length - 1]);
    }
    while (camera.children.length > 0) {
        camera.remove(camera.children[camera.children.length - 1]);
    }
    while (container.children.length > 0) {
        container.remove(container.children[container.children.length - 1]);
    }
    camera = null;
    scene = null;
    renderer = null;
    effect = null;
    controls = null;
    element = null;
    container = null;
    sky = null;
    squareMesh = [];
    horiz = 0;
    count = 0;
}

function animate(t) {
    requestAnimationFrame(animate);

    update(clock.getDelta());
    render(clock.getDelta());
    controls.update();
}

function fullscreen() {
    if (container.requestFullscreen) {
        container.requestFullscreen();
    } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
    } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
    }
}
