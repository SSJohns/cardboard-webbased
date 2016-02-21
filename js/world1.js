function initPlane(world) {
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

            var sky = new THREE.Mesh(skyGeo, materialSky);

            sky.material.side = THREE.DoubleSide;



            //light sources
			var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
            scene.add(light);

            var ambient = new THREE.AmbientLight(0xffffff);
            scene.add(ambient);


            //creating a loop that folows our eyes

            scene.add(sky);
			typeWord("Look up to change Scenes");

            window.addEventListener('resize', resize, false);
            setTimeout(resize, 1);
        }


