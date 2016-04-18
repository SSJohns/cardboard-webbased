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

//will put the entered phrase onto the screen
//wait for time sec and then delete it
function typeWordTimed(text, time){
    var timer = new Date().getTime();
    console.log("Timer: ", timer);
    timer += time;
    console.log("Time: ", timer);

    for (j = 0; j< text.length;j++ ){
    if(text.charCodeAt(j) == 32) // if a space we keep going with the program
      continue;

      //Init the tiles and map a letter to each one
    var geometry = new THREE.PlaneGeometry(15,15);
    var textWords = THREE.ImageUtils.loadTexture( "textures/text/olSb3.png" );
    textWords.minFilter = textWords.magFilter = THREE.NearestFilter;
    var lostMaterial =  new THREE.MeshPhongMaterial({ map:textWords,color:0xffffff });

    //go to the current tile and initiize it
    lostMesh[0+j] = new THREE.Mesh( geometry, lostMaterial );
    lostMesh[j].material.side = THREE.DoubleSide;
    lostMesh[j].material.opacity = 0.6;
    lostMesh[j].material.transparent = true;

    //change to display letters by adjusting
    //where on the letter platform we can see
    geometry.computeBoundingBox();
    var lostfaces = geometry.faces;
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
      var v1 = geometry.vertices[lostfaces[i].a],
        v2 = geometry.vertices[lostfaces[i].b],
        v3 = geometry.vertices[lostfaces[i].c];
      geometry.faceVertexUvs[0].push([
        new THREE.Vector2((1/16)*(v1.x + offset.x)/range.x + multx,(1/16)*(v1.y + offset.y)/range.y + multy),
        new THREE.Vector2((1/16)*(v2.x + offset.x)/range.x + multx,(1/16)*(v2.y + offset.y)/range.y + multy),
        new THREE.Vector2((1/16)*(v3.x + offset.x)/range.x + multx,(1/16)*(v3.y + offset.y)/range.y + multy)
      ]);
    }

    geometry.uvsNeedUpdate = true;
    camera.add(lostMesh[j]);
    console.log("Added: ", lostMesh[j]);

    count++;
    // Position tiles
    if (count == 27 ){ // will send the text to a newline when it is to long
      horiz += 20;
      count=1;
    }
    lostMesh[j].position.set(15*(j%27)-15*27/2,-horiz,-10*27 - 30);//27 - arbitrary length choosen for Star Wars
    }
}
