<!DOCTYPE html>
<html><head>
<meta http-equiv="content-type" content="text/html; charset=windows-1252">
  <title>doc/three.js/src/core/Geometry.js</title>
  <link rel="stylesheet" type="text/css" href="Geometry_files/github.css">
  <link rel="stylesheet" type="text/css" href="Geometry_files/find.css">
  <script src="Geometry_files/highlight.js"></script>
  <script>
    hljs.initHighlightingOnLoad()
  </script>
  <script src="Geometry_files/find.js"></script>
</head>
<body>
<pre><code class="js javascript"><span class="comment">/**
 * @author mr.doob / http://mrdoob.com/
 * @author kile / http://kile.stravaganza.org/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */</span>

THREE.Geometry = <span class="function"><span class="keyword">function</span> <span class="params">()</span> {</span>

	<span class="keyword">this</span>.id = THREE.GeometryCount ++;

	<span class="keyword">this</span>.vertices = [];
	<span class="keyword">this</span>.colors = []; <span class="comment">// one-to-one vertex colors, used in ParticleSystem, Line and Ribbon</span>

	<span class="keyword">this</span>.materials = [];

	<span class="keyword">this</span>.faces = [];

	<span class="keyword">this</span>.faceUvs = [[]];
	<span class="keyword">this</span>.faceVertexUvs = [[]];

	<span class="keyword">this</span>.morphTargets = [];
	<span class="keyword">this</span>.morphColors = [];

	<span class="keyword">this</span>.skinWeights = [];
	<span class="keyword">this</span>.skinIndices = [];

	<span class="keyword">this</span>.boundingBox = <span class="literal">null</span>;
	<span class="keyword">this</span>.boundingSphere = <span class="literal">null</span>;

	<span class="keyword">this</span>.hasTangents = <span class="literal">false</span>;

	<span class="keyword">this</span>.dynamic = <span class="literal">false</span>; <span class="comment">// unless set to true the *Arrays will be deleted once sent to a buffer.</span>

};

THREE.Geometry.prototype = {

	constructor : THREE.Geometry,

	applyMatrix: <span class="function"><span class="keyword">function</span> <span class="params">( matrix )</span> {</span>

		<span class="keyword">var</span> matrixRotation = <span class="keyword">new</span> THREE.Matrix4();
		matrixRotation.extractRotation( matrix, <span class="keyword">new</span> THREE.Vector3( <span class="number">1</span>, <span class="number">1</span>, <span class="number">1</span> ) );

		<span class="keyword">for</span> ( <span class="keyword">var</span> i = <span class="number">0</span>, il = <span class="keyword">this</span>.vertices.length; i &lt; il; i ++ ) {

			<span class="keyword">var</span> vertex = <span class="keyword">this</span>.vertices[ i ];

			matrix.multiplyVector3( vertex.position );

		}

		<span class="keyword">for</span> ( <span class="keyword">var</span> i = <span class="number">0</span>, il = <span class="keyword">this</span>.faces.length; i &lt; il; i ++ ) {

			<span class="keyword">var</span> face = <span class="keyword">this</span>.faces[ i ];

			matrixRotation.multiplyVector3( face.normal );

			<span class="keyword">for</span> ( <span class="keyword">var</span> j = <span class="number">0</span>, jl = face.vertexNormals.length; j &lt; jl; j ++ ) {

				matrixRotation.multiplyVector3( face.vertexNormals[ j ] );

			}

			matrix.multiplyVector3( face.centroid );

		}

	},

	computeCentroids: <span class="function"><span class="keyword">function</span> <span class="params">()</span> {</span>

		<span class="keyword">var</span> f, fl, face;

		<span class="keyword">for</span> ( f = <span class="number">0</span>, fl = <span class="keyword">this</span>.faces.length; f &lt; fl; f ++ ) {

			face = <span class="keyword">this</span>.faces[ f ];
			face.centroid.set( <span class="number">0</span>, <span class="number">0</span>, <span class="number">0</span> );

			<span class="keyword">if</span> ( face <span class="keyword">instanceof</span> THREE.Face3 ) {

				face.centroid.addSelf( <span class="keyword">this</span>.vertices[ face.a ].position );
				face.centroid.addSelf( <span class="keyword">this</span>.vertices[ face.b ].position );
				face.centroid.addSelf( <span class="keyword">this</span>.vertices[ face.c ].position );
				face.centroid.divideScalar( <span class="number">3</span> );

			} <span class="keyword">else</span> <span class="keyword">if</span> ( face <span class="keyword">instanceof</span> THREE.Face4 ) {

				face.centroid.addSelf( <span class="keyword">this</span>.vertices[ face.a ].position );
				face.centroid.addSelf( <span class="keyword">this</span>.vertices[ face.b ].position );
				face.centroid.addSelf( <span class="keyword">this</span>.vertices[ face.c ].position );
				face.centroid.addSelf( <span class="keyword">this</span>.vertices[ face.d ].position );
				face.centroid.divideScalar( <span class="number">4</span> );

			}

		}

	},

	computeFaceNormals: <span class="function"><span class="keyword">function</span> <span class="params">()</span> {</span>

		<span class="keyword">var</span> n, nl, v, vl, vertex, f, fl, face, vA, vB, vC,
		cb = <span class="keyword">new</span> THREE.Vector3(), ab = <span class="keyword">new</span> THREE.Vector3();

		<span class="keyword">for</span> ( f = <span class="number">0</span>, fl = <span class="keyword">this</span>.faces.length; f &lt; fl; f ++ ) {

			face = <span class="keyword">this</span>.faces[ f ];

			vA = <span class="keyword">this</span>.vertices[ face.a ];
			vB = <span class="keyword">this</span>.vertices[ face.b ];
			vC = <span class="keyword">this</span>.vertices[ face.c ];

			cb.sub( vC.position, vB.position );
			ab.sub( vA.position, vB.position );
			cb.crossSelf( ab );

			<span class="keyword">if</span> ( !cb.isZero() ) {

				cb.normalize();

			}

			face.normal.copy( cb );

		}

	},

	computeVertexNormals: <span class="function"><span class="keyword">function</span> <span class="params">()</span> {</span>

		<span class="keyword">var</span> v, vl, f, fl, face, vertices;

		<span class="comment">// create internal buffers for reuse when calling this method repeatedly</span>
		<span class="comment">// (otherwise memory allocation / deallocation every frame is big resource hog)</span>

		<span class="keyword">if</span> ( <span class="keyword">this</span>.__tmpVertices === undefined ) {

			<span class="keyword">this</span>.__tmpVertices = <span class="keyword">new</span> Array( <span class="keyword">this</span>.vertices.length );
			vertices = <span class="keyword">this</span>.__tmpVertices;

			<span class="keyword">for</span> ( v = <span class="number">0</span>, vl = <span class="keyword">this</span>.vertices.length; v &lt; vl; v ++ ) {

				vertices[ v ] = <span class="keyword">new</span> THREE.Vector3();

			}

			<span class="keyword">for</span> ( f = <span class="number">0</span>, fl = <span class="keyword">this</span>.faces.length; f &lt; fl; f ++ ) {

				face = <span class="keyword">this</span>.faces[ f ];

				<span class="keyword">if</span> ( face <span class="keyword">instanceof</span> THREE.Face3 ) {

					face.vertexNormals = [ <span class="keyword">new</span> THREE.Vector3(), <span class="keyword">new</span> THREE.Vector3(), <span class="keyword">new</span> THREE.Vector3() ];

				} <span class="keyword">else</span> <span class="keyword">if</span> ( face <span class="keyword">instanceof</span> THREE.Face4 ) {

					face.vertexNormals = [ <span class="keyword">new</span> THREE.Vector3(), <span class="keyword">new</span> THREE.Vector3(), <span class="keyword">new</span> THREE.Vector3(), <span class="keyword">new</span> THREE.Vector3() ];

				}

			}

		} <span class="keyword">else</span> {

			vertices = <span class="keyword">this</span>.__tmpVertices;

			<span class="keyword">for</span> ( v = <span class="number">0</span>, vl = <span class="keyword">this</span>.vertices.length; v &lt; vl; v ++ ) {

				vertices[ v ].set( <span class="number">0</span>, <span class="number">0</span>, <span class="number">0</span> );

			}

		}

		<span class="keyword">for</span> ( f = <span class="number">0</span>, fl = <span class="keyword">this</span>.faces.length; f &lt; fl; f ++ ) {

			face = <span class="keyword">this</span>.faces[ f ];

			<span class="keyword">if</span> ( face <span class="keyword">instanceof</span> THREE.Face3 ) {

				vertices[ face.a ].addSelf( face.normal );
				vertices[ face.b ].addSelf( face.normal );
				vertices[ face.c ].addSelf( face.normal );

			} <span class="keyword">else</span> <span class="keyword">if</span> ( face <span class="keyword">instanceof</span> THREE.Face4 ) {

				vertices[ face.a ].addSelf( face.normal );
				vertices[ face.b ].addSelf( face.normal );
				vertices[ face.c ].addSelf( face.normal );
				vertices[ face.d ].addSelf( face.normal );

			}

		}

		<span class="keyword">for</span> ( v = <span class="number">0</span>, vl = <span class="keyword">this</span>.vertices.length; v &lt; vl; v ++ ) {

			vertices[ v ].normalize();

		}

		<span class="keyword">for</span> ( f = <span class="number">0</span>, fl = <span class="keyword">this</span>.faces.length; f &lt; fl; f ++ ) {

			face = <span class="keyword">this</span>.faces[ f ];

			<span class="keyword">if</span> ( face <span class="keyword">instanceof</span> THREE.Face3 ) {

				face.vertexNormals[ <span class="number">0</span> ].copy( vertices[ face.a ] );
				face.vertexNormals[ <span class="number">1</span> ].copy( vertices[ face.b ] );
				face.vertexNormals[ <span class="number">2</span> ].copy( vertices[ face.c ] );

			} <span class="keyword">else</span> <span class="keyword">if</span> ( face <span class="keyword">instanceof</span> THREE.Face4 ) {

				face.vertexNormals[ <span class="number">0</span> ].copy( vertices[ face.a ] );
				face.vertexNormals[ <span class="number">1</span> ].copy( vertices[ face.b ] );
				face.vertexNormals[ <span class="number">2</span> ].copy( vertices[ face.c ] );
				face.vertexNormals[ <span class="number">3</span> ].copy( vertices[ face.d ] );

			}

		}

	},

	computeTangents: <span class="function"><span class="keyword">function</span> <span class="params">()</span> {</span>

		<span class="comment">// based on http://www.terathon.com/code/tangent.html</span>
		<span class="comment">// tangents go to vertices</span>

		<span class="keyword">var</span> f, fl, v, vl, i, il, vertexIndex,
			face, uv, vA, vB, vC, uvA, uvB, uvC,
			x1, x2, y1, y2, z1, z2,
			s1, s2, t1, t2, r, t, test,
			tan1 = [], tan2 = [],
			sdir = <span class="keyword">new</span> THREE.Vector3(), tdir = <span class="keyword">new</span> THREE.Vector3(),
			tmp = <span class="keyword">new</span> THREE.Vector3(), tmp2 = <span class="keyword">new</span> THREE.Vector3(),
			n = <span class="keyword">new</span> THREE.Vector3(), w;

		<span class="keyword">for</span> ( v = <span class="number">0</span>, vl = <span class="keyword">this</span>.vertices.length; v &lt; vl; v ++ ) {

			tan1[ v ] = <span class="keyword">new</span> THREE.Vector3();
			tan2[ v ] = <span class="keyword">new</span> THREE.Vector3();

		}

		<span class="function"><span class="keyword">function</span> <span class="title">handleTriangle</span><span class="params">( context, a, b, c, ua, ub, uc )</span> {</span>

			vA = context.vertices[ a ].position;
			vB = context.vertices[ b ].position;
			vC = context.vertices[ c ].position;

			uvA = uv[ ua ];
			uvB = uv[ ub ];
			uvC = uv[ uc ];

			x1 = vB.x - vA.x;
			x2 = vC.x - vA.x;
			y1 = vB.y - vA.y;
			y2 = vC.y - vA.y;
			z1 = vB.z - vA.z;
			z2 = vC.z - vA.z;

			s1 = uvB.u - uvA.u;
			s2 = uvC.u - uvA.u;
			t1 = uvB.v - uvA.v;
			t2 = uvC.v - uvA.v;

			r = <span class="number">1.0</span> / ( s1 * t2 - s2 * t1 );
			sdir.set( ( t2 * x1 - t1 * x2 ) * r,
					  ( t2 * y1 - t1 * y2 ) * r,
					  ( t2 * z1 - t1 * z2 ) * r );
			tdir.set( ( s1 * x2 - s2 * x1 ) * r,
					  ( s1 * y2 - s2 * y1 ) * r,
					  ( s1 * z2 - s2 * z1 ) * r );

			tan1[ a ].addSelf( sdir );
			tan1[ b ].addSelf( sdir );
			tan1[ c ].addSelf( sdir );

			tan2[ a ].addSelf( tdir );
			tan2[ b ].addSelf( tdir );
			tan2[ c ].addSelf( tdir );

		}

		<span class="keyword">for</span> ( f = <span class="number">0</span>, fl = <span class="keyword">this</span>.faces.length; f &lt; fl; f ++ ) {

			face = <span class="keyword">this</span>.faces[ f ];
			uv = <span class="keyword">this</span>.faceVertexUvs[ <span class="number">0</span> ][ f ]; <span class="comment">// use UV layer 0 for tangents</span>

			<span class="keyword">if</span> ( face <span class="keyword">instanceof</span> THREE.Face3 ) {

				handleTriangle( <span class="keyword">this</span>, face.a, face.b, face.c, <span class="number">0</span>, <span class="number">1</span>, <span class="number">2</span> );

			} <span class="keyword">else</span> <span class="keyword">if</span> ( face <span class="keyword">instanceof</span> THREE.Face4 ) {

				handleTriangle( <span class="keyword">this</span>, face.a, face.b, face.c, <span class="number">0</span>, <span class="number">1</span>, <span class="number">2</span> );
				handleTriangle( <span class="keyword">this</span>, face.a, face.b, face.d, <span class="number">0</span>, <span class="number">1</span>, <span class="number">3</span> );

			}

		}

		<span class="keyword">var</span> faceIndex = [ <span class="string">'a'</span>, <span class="string">'b'</span>, <span class="string">'c'</span>, <span class="string">'d'</span> ];

		<span class="keyword">for</span> ( f = <span class="number">0</span>, fl = <span class="keyword">this</span>.faces.length; f &lt; fl; f ++ ) {

			face = <span class="keyword">this</span>.faces[ f ];

			<span class="keyword">for</span> ( i = <span class="number">0</span>; i &lt; face.vertexNormals.length; i++ ) {

				n.copy( face.vertexNormals[ i ] );

				vertexIndex = face[ faceIndex[ i ] ];

				t = tan1[ vertexIndex ];

				<span class="comment">// Gram-Schmidt orthogonalize</span>

				tmp.copy( t );
				tmp.subSelf( n.multiplyScalar( n.dot( t ) ) ).normalize();

				<span class="comment">// Calculate handedness</span>

				tmp2.cross( face.vertexNormals[ i ], t );
				test = tmp2.dot( tan2[ vertexIndex ] );
				w = (test &lt; <span class="number">0.0</span>) ? -<span class="number">1.0</span> : <span class="number">1.0</span>;

				face.vertexTangents[ i ] = <span class="keyword">new</span> THREE.Vector4( tmp.x, tmp.y, tmp.z, w );

			}

		}

		<span class="keyword">this</span>.hasTangents = <span class="literal">true</span>;

	},

	computeBoundingBox: <span class="function"><span class="keyword">function</span> <span class="params">()</span> {</span>

		<span class="keyword">var</span> vertex;

		<span class="keyword">if</span> ( <span class="keyword">this</span>.vertices.length &gt; <span class="number">0</span> ) {

			<span class="keyword">this</span>.boundingBox = { <span class="string">'x'</span>: [ <span class="keyword">this</span>.vertices[ <span class="number">0</span> ].position.x, <span class="keyword">this</span>.vertices[ <span class="number">0</span> ].position.x ],
			<span class="string">'y'</span>: [ <span class="keyword">this</span>.vertices[ <span class="number">0</span> ].position.y, <span class="keyword">this</span>.vertices[ <span class="number">0</span> ].position.y ],
			<span class="string">'z'</span>: [ <span class="keyword">this</span>.vertices[ <span class="number">0</span> ].position.z, <span class="keyword">this</span>.vertices[ <span class="number">0</span> ].position.z ] };

			<span class="keyword">for</span> ( <span class="keyword">var</span> v = <span class="number">1</span>, vl = <span class="keyword">this</span>.vertices.length; v &lt; vl; v ++ ) {

				vertex = <span class="keyword">this</span>.vertices[ v ];

				<span class="keyword">if</span> ( vertex.position.x &lt; <span class="keyword">this</span>.boundingBox.x[ <span class="number">0</span> ] ) {

					<span class="keyword">this</span>.boundingBox.x[ <span class="number">0</span> ] = vertex.position.x;

				} <span class="keyword">else</span> <span class="keyword">if</span> ( vertex.position.x &gt; <span class="keyword">this</span>.boundingBox.x[ <span class="number">1</span> ] ) {

					<span class="keyword">this</span>.boundingBox.x[ <span class="number">1</span> ] = vertex.position.x;

				}

				<span class="keyword">if</span> ( vertex.position.y &lt; <span class="keyword">this</span>.boundingBox.y[ <span class="number">0</span> ] ) {

					<span class="keyword">this</span>.boundingBox.y[ <span class="number">0</span> ] = vertex.position.y;

				} <span class="keyword">else</span> <span class="keyword">if</span> ( vertex.position.y &gt; <span class="keyword">this</span>.boundingBox.y[ <span class="number">1</span> ] ) {

					<span class="keyword">this</span>.boundingBox.y[ <span class="number">1</span> ] = vertex.position.y;

				}

				<span class="keyword">if</span> ( vertex.position.z &lt; <span class="keyword">this</span>.boundingBox.z[ <span class="number">0</span> ] ) {

					<span class="keyword">this</span>.boundingBox.z[ <span class="number">0</span> ] = vertex.position.z;

				} <span class="keyword">else</span> <span class="keyword">if</span> ( vertex.position.z &gt; <span class="keyword">this</span>.boundingBox.z[ <span class="number">1</span> ] ) {

					<span class="keyword">this</span>.boundingBox.z[ <span class="number">1</span> ] = vertex.position.z;

				}

			}

		}

	},

	computeBoundingSphere: <span class="function"><span class="keyword">function</span> <span class="params">()</span> {</span>

		<span class="comment">// var radius = this.boundingSphere === null ? 0 : this.boundingSphere.radius;</span>

		<span class="keyword">var</span> radius = <span class="number">0</span>;

		<span class="keyword">for</span> ( <span class="keyword">var</span> v = <span class="number">0</span>, vl = <span class="keyword">this</span>.vertices.length; v &lt; vl; v ++ ) {

			radius = Math.max( radius, <span class="keyword">this</span>.vertices[ v ].position.length() );

		}

		<span class="keyword">this</span>.boundingSphere = { radius: radius };

	},

	<span class="comment">/*
	 * Checks for duplicate vertices with hashmap.
	 * Duplicated vertices are removed
	 * and faces' vertices are updated.
	 */</span>

	mergeVertices: <span class="function"><span class="keyword">function</span><span class="params">()</span> {</span>

		<span class="keyword">var</span> verticesMap = {}; <span class="comment">// Hashmap for looking up vertice by position coordinates (and making sure they are unique)</span>
		<span class="keyword">var</span> unique = [], changes = [];

		<span class="keyword">var</span> v, key;
		<span class="keyword">var</span> precisionPoints = <span class="number">4</span>; <span class="comment">// number of decimal points, eg. 4 for epsilon of 0.0001</span>
		<span class="keyword">var</span> precision = Math.pow( <span class="number">10</span>, precisionPoints );
		<span class="keyword">var</span> i,il, face;

		<span class="keyword">for</span> ( i = <span class="number">0</span>, il = <span class="keyword">this</span>.vertices.length; i &lt; il; i ++ ) {

			v = <span class="keyword">this</span>.vertices[ i ].position;
			key = [ Math.round( v.x * precision ), Math.round( v.y * precision ), Math.round( v.z * precision ) ].join( <span class="string">'_'</span> );

			<span class="keyword">if</span> ( verticesMap[ key ] === undefined ) {

				verticesMap[ key ] = i;
				unique.push( <span class="keyword">this</span>.vertices[ i ] );
				changes[ i ] = unique.length - <span class="number">1</span>;

			} <span class="keyword">else</span> {

				<span class="comment">//console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);</span>
				changes[ i ] = changes[ verticesMap[ key ] ];

			}

		};


		<span class="comment">// Start to patch face indices</span>

		<span class="keyword">for</span>( i = <span class="number">0</span>, il = <span class="keyword">this</span>.faces.length; i &lt; il; i ++ ) {

			face = <span class="keyword">this</span>.faces[ i ];

			<span class="keyword">if</span> ( face <span class="keyword">instanceof</span> THREE.Face3 ) {

				face.a = changes[ face.a ];
				face.b = changes[ face.b ];
				face.c = changes[ face.c ];

			} <span class="keyword">else</span> <span class="keyword">if</span> ( face <span class="keyword">instanceof</span> THREE.Face4 ) {

				face.a = changes[ face.a ];
				face.b = changes[ face.b ];
				face.c = changes[ face.c ];
				face.d = changes[ face.d ];

			}

		}

		<span class="comment">// Use unique set of vertices</span>

		<span class="keyword">this</span>.vertices = unique;

	}

};

THREE.GeometryCount = <span class="number">0</span>;
</code></pre>


<div class="keyword-box"><input id="keyword"><button>Search</button></div></body></html>