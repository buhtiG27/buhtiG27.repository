/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.core.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var three_examples_jsm_loaders_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three/examples/jsm/loaders/GLTFLoader.js */ "./node_modules/three/examples/jsm/loaders/GLTFLoader.js");
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");
//23FI091　最終課題:『教室からの脱出』



 //最後にこれを追加してcanon-esが使えるようになります。
class ThreeJSContainer {
    scene;
    light;
    world;
    camera; // ← 追加
    clickableObjects = [];
    constructor() {
    }
    // 画面部分の作成(表示する枠ごとに)*
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする
        //カメラの設定
        this.camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.copy(cameraPos);
        this.camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 0, 0));
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_2__.OrbitControls(this.camera, renderer.domElement);
        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render = (time) => {
            orbitControls.update();
            renderer.render(this.scene, this.camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    // シーンの作成(全体で1回)
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        this.world = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.World({ gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(0, -9.82, 0) }); //この重力加速度をもつworldを作成。
        this.world.defaultContactMaterial.friction = 0.3; //摩擦係数や
        this.world.defaultContactMaterial.restitution = 0.0; //反発係数も設定可能。
        //場面の管理。新たに場面に名前をつけるときはphaseに追加。
        const phase = {
            OPENING: 0,
            TITLE: 1,
            PCOPENED: 2,
            SAFEOPENED: 3,
            ENDING: 4
        };
        let count = 0;
        for (const key in phase) {
            phase[key] = count;
            count++;
        }
        //console.log(phase["ENDING"]);
        const classroom = new Classroom(6, 9);
        this.scene.add(classroom.room);
        const distance = 0.5;
        const loader = new three_examples_jsm_loaders_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_4__.GLTFLoader();
        let chairIndex = 0;
        let deskIndex = 0;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 5; j++) {
                if (i < 5 || j == 0) {
                    loader.load('school_chair.glb', (gltf) => {
                        const model = gltf.scene;
                        model.position.set(-0.884 - 2 * distance + (0.442 + distance) * j, 0, -0.85 - 2 * distance + (0.425 + distance) * i);
                        model.scale.set(1, 1, 1);
                        model.rotateY(Math.PI / 2);
                        model.traverse((child) => {
                            if (child.isMesh) {
                                child.userData.label = `chair${chairIndex}`; // `deskIndex` のときも同様
                                this.clickableObjects.push(child); // Mesh単体を登録
                            }
                        });
                        chairIndex++;
                        this.scene.add(model);
                        //this.clickableObjects.push(model);
                    });
                    loader.load('school_desk.glb', (gltf) => {
                        const model = gltf.scene;
                        model.position.set(-0.884 - 2 * distance + (0.442 + distance) * j, 0, -1.35 - 2 * distance + (0.425 + distance) * i);
                        model.scale.set(1, 1, 1);
                        model.rotateY(Math.PI / 2);
                        // 椅子と机の読み込み部分でこのように修正m
                        model.traverse((child) => {
                            if (child.isMesh) {
                                child.userData.label = `desk${deskIndex}`; // `deskIndex` のときも同様
                                this.clickableObjects.push(child); // Mesh単体を登録
                            }
                        });
                        deskIndex++;
                        this.scene.add(model);
                        //this.clickableObjects.push(model);
                    });
                }
            }
        }
        const cubeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(0.5, 0.5, 0.5)); //CANNON.Boxのサイズはcubeの半分！！
        const cubeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({ mass: 1 }); //重さを設定します。単位はkg。
        loader.load('sakasama_woman.glb', (gltf) => {
            const model = gltf.scene;
            model.name = "woman";
            model.position.set(-5, 10, -1.5);
            model.scale.set(1, 1, 1);
            this.scene.add(model);
            //このcubeにcanonを追加するには、canonの世界用の物体を用意します。
            cubeBody.addShape(cubeShape);
            cubeBody.position.set(model.position.x, model.position.y, model.position.z); //最後に位置の状態と
            cubeBody.quaternion.set(model.quaternion.x, model.quaternion.y, model.quaternion.z, model.quaternion.w); //回転の状態をcubeからコピー
            this.world.addBody(cubeBody);
        });
        //地面の作成
        const phongMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial();
        const planeGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(6, 9);
        const planeMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(planeGeometry, phongMaterial);
        planeMesh.material.side = three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide; // 両面
        planeMesh.position.y = 2.3;
        planeMesh.rotateX(-Math.PI / 2);
        this.scene.add(planeMesh);
        const planeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(3, 0.5, 4.5));
        const planeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({ mass: 0 }); //重さを0にすると重力の影響を受けない物体を作ることができる！！！！！
        planeBody.addShape(planeShape);
        planeBody.position.set(planeMesh.position.x, planeMesh.position.y - 1, planeMesh.position.z);
        //planeBody.quaternion.set(planeMesh.quaternion.x, planeMesh.quaternion.y, planeMesh.quaternion.z, planeMesh.quaternion.w);
        this.world.addBody(planeBody);
        const gridHelper = new three__WEBPACK_IMPORTED_MODULE_1__.GridHelper(10);
        this.scene.add(gridHelper);
        const axesHelper = new three__WEBPACK_IMPORTED_MODULE_1__.AxesHelper(5);
        this.scene.add(axesHelper);
        //2.AmbientLight
        let light = new three__WEBPACK_IMPORTED_MODULE_1__.AmbientLight(0xffffff, 1.0); //(ライトの色,ライトの強さ)
        light.position.set(1, 1, 1); //ライトの位置
        //シーン全体に適用されるライトのため、方向とかはない。影も落ちない。
        this.scene.add(light);
        let wisPressed = false;
        let aisPressed = false;
        let sisPressed = false;
        let disPressed = false;
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'W':
                    wisPressed = true;
                    break;
                case 'a':
                    aisPressed = true;
                    break;
                case 's':
                    sisPressed = true;
                    break;
                case 'd':
                    disPressed = true;
                    break;
            }
        });
        document.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'W':
                    wisPressed = false;
                    break;
                case 'a':
                    aisPressed = false;
                    break;
                case 's':
                    sisPressed = false;
                    break;
                case 'd':
                    disPressed = false;
                    break;
            }
        });
        //クリックされたことを検知するためには、raycasterで光線を出す必要がある？？？(よくわからないし正しく動かない)
        const raycaster = new three__WEBPACK_IMPORTED_MODULE_1__.Raycaster();
        const mouse = new three__WEBPACK_IMPORTED_MODULE_1__.Vector2();
        window.addEventListener('click', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.clickableObjects, true);
            for (let i = 0; i < intersects.length; i++) {
                const obj = intersects[i].object;
                // GridHelperやAxesHelperなどを除外
                if (obj instanceof three__WEBPACK_IMPORTED_MODULE_1__.GridHelper || obj instanceof three__WEBPACK_IMPORTED_MODULE_1__.AxesHelper)
                    continue;
                // labelがあるオブジェクトのみ表示
                if (obj.userData && obj.userData.label) {
                    console.log("クリックされたオブジェクト:", obj.userData.label);
                }
                else {
                    console.log("クリックされたがラベルなし:", obj.name || obj.type);
                }
                break; // 最初に当たった1つだけ処理
            }
        });
        let update = (time) => {
            requestAnimationFrame(update);
            this.world.fixedStep(); //update関数では、これでworldの物理演算を実行します。
            const woman = this.scene.getObjectByName("woman");
            if (woman) {
                woman.position.set(cubeBody.position.x, cubeBody.position.y, cubeBody.position.z); //最後に位置の状態と
                woman.quaternion.set(cubeBody.quaternion.x, cubeBody.quaternion.y, cubeBody.quaternion.z, cubeBody.quaternion.w); //回転の状態をcubeからコピー
            }
            if (woman.position.y < -50) {
                cubeBody.position.set(0, 5, -1.5);
                setTimeout(() => {
                    //console.log("3秒経過しました");
                    cubeBody.position.set(-5, 10, -1.5);
                }, 30000);
            }
        };
        requestAnimationFrame(update);
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(2, 1.6, 2));
    document.body.appendChild(viewport);
}
class Classroom {
    room;
    constructor(width, height) {
        this.room = new three__WEBPACK_IMPORTED_MODULE_1__.Group();
        //地面の作成
        const tileWidth = 1;
        const tileHeight = 1;
        const geometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(tileWidth, tileHeight);
        const textureLoader = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader();
        const texture = textureLoader.load('floor.png');
        const material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ map: texture }); //こっちを使うとインポートした画像を使ったマテリアルを生成できます。
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const tile = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, material);
                tile.rotateX(-Math.PI / 2);
                tile.position.set(-width / 2 + tileWidth / 2 + tileWidth * j, 0, -height / 2 + tileHeight / 2 + tileHeight * i);
                //tiles.push(tile);  
                this.room.add(tile);
            }
        }
        //壁の作成
        const gtfLoader = new three_examples_jsm_loaders_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_4__.GLTFLoader();
        gtfLoader.load('classroom_wall.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('classroom_leftWindow.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('classroom_rightWindow.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('classroom_frontDoor.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('classroom_backDoor.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('classroom_ceiling.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('blackboard_center.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('blackboard_right.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('blackboard_back.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(-0.15, 0, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('teacher_desk.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(-1.2, 0, -3.25);
            model.scale.set(0.4 * width / 6, 0.25 * width / 6, 0.5 * width / 6);
            model.rotateY(-Math.PI);
            this.room.add(model);
        });
        gtfLoader.load('teacher_desk_leftDrawer.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(-1.2, 0, -3);
            model.scale.set(0.4 * width / 6, 0.25 * width / 6, 0.5 * width / 6);
            model.rotateY(-Math.PI);
            this.room.add(model);
        });
        gtfLoader.load('teacher_desk_rightDrawer1.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(-1.2, 0, -3.25);
            model.scale.set(0.4 * width / 6, 0.25 * width / 6, 0.5 * width / 6);
            model.rotateY(-Math.PI);
            this.room.add(model);
        });
        gtfLoader.load('teacher_desk_rightDrawer2.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(-1.2, 0, -3.25);
            model.scale.set(0.4 * width / 6, 0.25 * width / 6, 0.5 * width / 6);
            model.rotateY(-Math.PI);
            this.room.add(model);
        });
        gtfLoader.load('teacher_desk_rightDrawer3.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(-1.2, 0, -3.25);
            model.scale.set(0.4 * width / 6, 0.25 * width / 6, 0.5 * width / 6);
            model.rotateY(-Math.PI);
            this.room.add(model);
        });
        gtfLoader.load('curtain_closed.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(-0.75, 0.20, -0.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('curtain_opened.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(-1, 0.25, -1.75);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('bookshelf.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(-2.3, 0, -2);
            model.scale.set(0.3 * width / 6, 0.3 * width / 6, 0.3 * width / 6);
            //model.rotateZ(-Math.PI);
            this.room.add(model);
        });
        gtfLoader.load('blue_book.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0.7, 0.05, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('red_book.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(-0.25, 0.05, -1.5);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('cleaningLocker_opened.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(2.4, 0, 4.2);
            model.scale.set(0.3 * width / 6, 0.3 * width / 6, 0.3 * width / 6);
            model.rotateY(-Math.PI);
            this.room.add(model);
        });
        gtfLoader.load('houki.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(1.8, 0.25, 2.0);
            model.scale.set(0.25 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            model.rotateZ(-Math.PI / 12);
            this.room.add(model);
        });
        gtfLoader.load('locker.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(-1.0, 0, -1.5);
            model.scale.set(0.20 * width / 6, 0.25 * width / 6, 0.25 * width / 6);
            this.room.add(model);
        });
        gtfLoader.load('safe.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(-1, 0.7, 1.3);
            model.scale.set(0.1 * width / 6, 0.1 * width / 6, 0.1 * width / 6);
            model.rotateY(-Math.PI / 2);
            this.room.add(model);
        });
        for (let i = 0; i < 4; i++) {
            gtfLoader.load('diyal.glb', (gltf) => {
                const model = gltf.scene;
                model.position.set(-1 + 0.01 * i, 0.7, 1.3);
                model.scale.set(0.1 * width / 6, 0.1 * width / 6, 0.1 * width / 6);
                model.rotateY(-Math.PI / 2);
                this.room.add(model);
            });
        }
        gtfLoader.load('woman.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(1, 0.1, 2.5);
            model.scale.set(1 * width / 6, 1 * width / 6, 1 * width / 6);
            model.rotateZ(Math.PI / 2);
            this.room.add(model);
        });
        /*
        this.loadModel('bookshelf.glb',  { x: -0.5, y: 0, z: 0 }, 1);
        this.loadModel('blue_book.glb',  { x: -10, y: -5, z: 0 }, 1);
        this.loadModel('diyal.glb',  { x: 2, y: 0, z: 0 }, 1);
        this.loadModel('safe.glb',  { x: -0, y: 0, z: 0 }, 1);
        this.loadModel('safe_opened.glb',  { x: -2, y: -5, z: 0 }, 1);
        this.loadModel('woman.glb',  { x: 0, y: 0, z: 0 }, 1);
        this.loadModel('sakasama_woman.glb',  { x: 0, y: 0, z: 0 }, 1);*/
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_cannon-es_dist_cannon-es_js-node_modules_three_build_three_module_js-nod-11b64c"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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K0IsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3JELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDekIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFDLEtBQUssR0FBQyxDQUFDLEVBQUMsSUFBSSxHQUFDLEtBQUssR0FBQyxDQUFDLEVBQUMsR0FBRyxHQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0RCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsU0FBUyxDQUFDLElBQUksQ0FBQywrQkFBK0IsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3JELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDekIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFDLEtBQUssR0FBQyxDQUFDLEVBQUMsSUFBSSxHQUFDLEtBQUssR0FBQyxDQUFDLEVBQUMsR0FBRyxHQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0RCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsU0FBUyxDQUFDLElBQUksQ0FBQywrQkFBK0IsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3JELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDekIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFDLEtBQUssR0FBQyxDQUFDLEVBQUMsSUFBSSxHQUFDLEtBQUssR0FBQyxDQUFDLEVBQUMsR0FBRyxHQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0RCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsU0FBUyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1lBQzFDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDekIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFDLEtBQUssR0FBQyxDQUFDLEVBQUMsSUFBSSxHQUFDLEtBQUssR0FBQyxDQUFDLEVBQUMsSUFBSSxHQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztRQUNILFNBQVMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUMxQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3pCLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksR0FBQyxLQUFLLEdBQUMsQ0FBQyxFQUFDLElBQUksR0FBQyxLQUFLLEdBQUMsQ0FBQyxFQUFDLElBQUksR0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsQ0FBQyxDQUFDLENBQUM7UUFDSCxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3JDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDekIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFDLEtBQUssR0FBQyxDQUFDLEVBQUMsR0FBRyxHQUFDLEtBQUssR0FBQyxDQUFDLEVBQUMsR0FBRyxHQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyRCwwQkFBMEI7WUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsQ0FBQyxDQUFDLENBQUM7UUFDSCxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3JDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDekIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksR0FBQyxLQUFLLEdBQUMsQ0FBQyxFQUFDLElBQUksR0FBQyxLQUFLLEdBQUMs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aUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIi8vMjNGSTA5MeOAgOacgOe1guiqsumhjDrjgI7mlZnlrqTjgYvjgonjga7ohLHlh7rjgI9cblxuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzXCI7XG5pbXBvcnQgeyBHTFRGTG9hZGVyIH0gZnJvbSAndGhyZWUvZXhhbXBsZXMvanNtL2xvYWRlcnMvR0xURkxvYWRlci5qcyc7XG5pbXBvcnQgKiBhcyBDQU5OT04gZnJvbSAnY2Fubm9uLWVzJzsvL+acgOW+jOOBq+OBk+OCjOOCkui/veWKoOOBl+OBpmNhbm9uLWVz44GM5L2/44GI44KL44KI44GG44Gr44Gq44KK44G+44GZ44CCXG5cbmNsYXNzIFRocmVlSlNDb250YWluZXIge1xuICAgIHByaXZhdGUgc2NlbmU6IFRIUkVFLlNjZW5lO1xuICAgIHByaXZhdGUgbGlnaHQ6IFRIUkVFLkxpZ2h0O1xuICAgIHByaXZhdGUgd29ybGQ6Q0FOTk9OLldvcmxkO1xuXG4gICAgcHJpdmF0ZSBjYW1lcmE6IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhOyAvLyDihpAg6L+95YqgXG4gICAgcHJpdmF0ZSBjbGlja2FibGVPYmplY3RzOiBUSFJFRS5PYmplY3QzRFtdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIFxuICAgIH1cblxuICAgIC8vIOeUu+mdoumDqOWIhuOBruS9nOaIkCjooajnpLrjgZnjgovmnqDjgZTjgajjgaspKlxuICAgIHB1YmxpYyBjcmVhdGVSZW5kZXJlckRPTSA9ICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgY2FtZXJhUG9zOiBUSFJFRS5WZWN0b3IzKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHg0OTVlZCkpO1xuICAgICAgICByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IHRydWU7IC8v44K344Oj44OJ44Km44Oe44OD44OX44KS5pyJ5Yq544Gr44GZ44KLXG5cbiAgICAgICAgLy/jgqvjg6Hjg6njga7oqK3lrppcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpZHRoIC8gaGVpZ2h0LCAwLjEsIDEwMDApO1xuICAgICAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi5jb3B5KGNhbWVyYVBvcyk7XG4gICAgICAgIHRoaXMuY2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKSk7XG5cbiAgICAgICAgY29uc3Qgb3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKHRoaXMuY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lKCk7XG4gICAgICAgIC8vIOavjuODleODrOODvOODoOOBrnVwZGF0ZeOCkuWRvOOCk+OBp++8jHJlbmRlclxuICAgICAgICAvLyByZXFlc3RBbmltYXRpb25GcmFtZSDjgavjgojjgormrKHjg5Xjg6zjg7zjg6DjgpLlkbzjgbZcbiAgICAgICAgY29uc3QgcmVuZGVyOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICBvcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICByZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG5cbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5jc3NGbG9hdCA9IFwibGVmdFwiO1xuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLm1hcmdpbiA9IFwiMTBweFwiO1xuICAgICAgICByZXR1cm4gcmVuZGVyZXIuZG9tRWxlbWVudDtcbiAgICB9XG5cbiAgICAvLyDjgrfjg7zjg7Pjga7kvZzmiJAo5YWo5L2T44GnMeWbnilcblxuICAgIHByaXZhdGUgY3JlYXRlU2NlbmUgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICAgICAgdGhpcy53b3JsZD0gbmV3IENBTk5PTi5Xb3JsZCh7IGdyYXZpdHk6IG5ldyBDQU5OT04uVmVjMygwLCAtOS44MiwgMCl9KTsvL+OBk+OBrumHjeWKm+WKoOmAn+W6puOCkuOCguOBpHdvcmxk44KS5L2c5oiQ44CCXG4gICAgICAgIHRoaXMud29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5mcmljdGlvbiA9IDAuMzsvL+aRqeaTpuS/guaVsOOChFxuICAgICAgICB0aGlzLndvcmxkLmRlZmF1bHRDb250YWN0TWF0ZXJpYWwucmVzdGl0dXRpb24gPSAwLjA7Ly/lj43nmbrkv4LmlbDjgoLoqK3lrprlj6/og73jgIJcblxuXG4gICAgICAgIC8v5aC06Z2i44Gu566h55CG44CC5paw44Gf44Gr5aC06Z2i44Gr5ZCN5YmN44KS44Gk44GR44KL44Go44GN44GvcGhhc2Xjgavov73liqDjgIJcbiAgICAgICAgY29uc3QgcGhhc2U9e1xuICAgICAgICAgICAgT1BFTklORzowLFxuICAgICAgICAgICAgVElUTEU6MSxcbiAgICAgICAgICAgIFBDT1BFTkVEOjIsXG4gICAgICAgICAgICBTQUZFT1BFTkVEOjMsXG4gICAgICAgICAgICBFTkRJTkc6NFxuICAgICAgICB9XG4gICAgICAgIGxldCBjb3VudD0wO1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBwaGFzZSkge1xuICAgICAgICAgICAgcGhhc2Vba2V5XT1jb3VudDtcbiAgICAgICAgICAgIGNvdW50Kys7ICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgLy9jb25zb2xlLmxvZyhwaGFzZVtcIkVORElOR1wiXSk7XG5cbiAgICAgICAgY29uc3QgY2xhc3Nyb29tPW5ldyBDbGFzc3Jvb20oNiw5KTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoY2xhc3Nyb29tLnJvb20pO1xuICAgICAgICBcblxuICAgICAgICBjb25zdCBkaXN0YW5jZT0wLjU7XG4gICAgICAgIGNvbnN0IGxvYWRlciA9IG5ldyBHTFRGTG9hZGVyKCk7XG4gICAgICAgIGxldCBjaGFpckluZGV4ID0gMDtcbiAgICAgICAgbGV0IGRlc2tJbmRleCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDU7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChpIDwgNSB8fCBqID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbG9hZGVyLmxvYWQoJ3NjaG9vbF9jaGFpci5nbGInLCAoZ2x0ZikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBnbHRmLnNjZW5lO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwucG9zaXRpb24uc2V0KC0wLjg4NCAtIDIgKiBkaXN0YW5jZSArICgwLjQ0MiArIGRpc3RhbmNlKSAqIGosIDAsIC0wLjg1IC0gMiAqIGRpc3RhbmNlICsgKDAuNDI1ICsgZGlzdGFuY2UpICogaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMSwgMSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbC5yb3RhdGVZKE1hdGguUEkgLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsLnRyYXZlcnNlKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoY2hpbGQgYXMgVEhSRUUuTWVzaCkuaXNNZXNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLnVzZXJEYXRhLmxhYmVsID0gYGNoYWlyJHtjaGFpckluZGV4fWA7IC8vIGBkZXNrSW5kZXhgIOOBruOBqOOBjeOCguWQjOanmFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWNrYWJsZU9iamVjdHMucHVzaChjaGlsZCk7IC8vIE1lc2jljZjkvZPjgpLnmbvpjLJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYWlySW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKG1vZGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy5jbGlja2FibGVPYmplY3RzLnB1c2gobW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRlci5sb2FkKCdzY2hvb2xfZGVzay5nbGInLCAoZ2x0ZikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBnbHRmLnNjZW5lO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwucG9zaXRpb24uc2V0KC0wLjg4NCAtIDIgKiBkaXN0YW5jZSArICgwLjQ0MiArIGRpc3RhbmNlKSAqIGosIDAsIC0xLjM1IC0gMiAqIGRpc3RhbmNlICsgKDAuNDI1ICsgZGlzdGFuY2UpICogaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMSwgMSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbC5yb3RhdGVZKE1hdGguUEkgLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOakheWtkOOBqOacuuOBruiqreOBv+i+vOOBv+mDqOWIhuOBp+OBk+OBruOCiOOBhuOBq+S/ruato21cbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsLnRyYXZlcnNlKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoY2hpbGQgYXMgVEhSRUUuTWVzaCkuaXNNZXNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLnVzZXJEYXRhLmxhYmVsID0gYGRlc2ske2Rlc2tJbmRleH1gOyAvLyBgZGVza0luZGV4YCDjga7jgajjgY3jgoLlkIzmp5hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGlja2FibGVPYmplY3RzLnB1c2goY2hpbGQpOyAvLyBNZXNo5Y2Y5L2T44KS55m76YyyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNrSW5kZXgrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKG1vZGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy5jbGlja2FibGVPYmplY3RzLnB1c2gobW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdWJlU2hhcGUgPSBuZXcgQ0FOTk9OLkJveChuZXcgQ0FOTk9OLlZlYzMoMC41LCAwLjUsIDAuNSkpOy8vQ0FOTk9OLkJveOOBruOCteOCpOOCuuOBr2N1YmXjga7ljYrliIbvvIHvvIFcbiAgICAgICAgY29uc3QgY3ViZUJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoeyBtYXNzOiAxIH0pOy8v6YeN44GV44KS6Kit5a6a44GX44G+44GZ44CC5Y2Y5L2N44Gva2fjgIJcbiAgICAgICAgbG9hZGVyLmxvYWQoJ3Nha2FzYW1hX3dvbWFuLmdsYicsIChnbHRmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbD1nbHRmLnNjZW5lO1xuICAgICAgICAgICAgbW9kZWwubmFtZT1cIndvbWFuXCI7XG4gICAgICAgICAgICBtb2RlbC5wb3NpdGlvbi5zZXQoLTUsIDEwLCAtMS41KTtcbiAgICAgICAgICAgIG1vZGVsLnNjYWxlLnNldCgxLDEsMSk7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChtb2RlbCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8v44GT44GuY3ViZeOBq2Nhbm9u44KS6L+95Yqg44GZ44KL44Gr44Gv44CBY2Fub27jga7kuJbnlYznlKjjga7niankvZPjgpLnlKjmhI/jgZfjgb7jgZnjgIJcbiAgICAgICAgICAgIGN1YmVCb2R5LmFkZFNoYXBlKGN1YmVTaGFwZSk7XG4gICAgICAgICAgICBjdWJlQm9keS5wb3NpdGlvbi5zZXQobW9kZWwucG9zaXRpb24ueCwgbW9kZWwucG9zaXRpb24ueSwgbW9kZWwucG9zaXRpb24ueik7Ly/mnIDlvozjgavkvY3nva7jga7nirbmhYvjgahcbiAgICAgICAgICAgIGN1YmVCb2R5LnF1YXRlcm5pb24uc2V0KG1vZGVsLnF1YXRlcm5pb24ueCwgbW9kZWwucXVhdGVybmlvbi55LCBtb2RlbC5xdWF0ZXJuaW9uLnosIG1vZGVsLnF1YXRlcm5pb24udyk7Ly/lm57ou6Ljga7nirbmhYvjgpJjdWJl44GL44KJ44Kz44OU44O8XG4gICAgICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkoY3ViZUJvZHkpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy/lnLDpnaLjga7kvZzmiJBcbiAgICAgICAgY29uc3QgcGhvbmdNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCgpO1xuICAgICAgICBjb25zdCBwbGFuZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoNiw5KTtcbiAgICAgICAgY29uc3QgcGxhbmVNZXNoID0gbmV3IFRIUkVFLk1lc2gocGxhbmVHZW9tZXRyeSwgcGhvbmdNYXRlcmlhbCk7XG4gICAgICAgIHBsYW5lTWVzaC5tYXRlcmlhbC5zaWRlID0gVEhSRUUuRG91YmxlU2lkZTsgLy8g5Lih6Z2iXG4gICAgICAgIHBsYW5lTWVzaC5wb3NpdGlvbi55PTIuMztcbiAgICAgICAgcGxhbmVNZXNoLnJvdGF0ZVgoLU1hdGguUEkgLyAyKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQocGxhbmVNZXNoKTtcbiAgICAgICAgY29uc3QgcGxhbmVTaGFwZSA9IG5ldyBDQU5OT04uQm94KG5ldyBDQU5OT04uVmVjMygzLCAwLjUsIDQuNSkpXG4gICAgICAgIGNvbnN0IHBsYW5lQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAgfSkvL+mHjeOBleOCkjDjgavjgZnjgovjgajph43lipvjga7lvbHpn7/jgpLlj5fjgZHjgarjgYTniankvZPjgpLkvZzjgovjgZPjgajjgYzjgafjgY3jgovvvIHvvIHvvIHvvIHvvIFcbiAgICAgICAgcGxhbmVCb2R5LmFkZFNoYXBlKHBsYW5lU2hhcGUpXG4gICAgICAgIHBsYW5lQm9keS5wb3NpdGlvbi5zZXQocGxhbmVNZXNoLnBvc2l0aW9uLngsIHBsYW5lTWVzaC5wb3NpdGlvbi55LTEsIHBsYW5lTWVzaC5wb3NpdGlvbi56KTtcbiAgICAgICAgLy9wbGFuZUJvZHkucXVhdGVybmlvbi5zZXQocGxhbmVNZXNoLnF1YXRlcm5pb24ueCwgcGxhbmVNZXNoLnF1YXRlcm5pb24ueSwgcGxhbmVNZXNoLnF1YXRlcm5pb24ueiwgcGxhbmVNZXNoLnF1YXRlcm5pb24udyk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkQm9keShwbGFuZUJvZHkpOyAgICAgICAgXG5cbiAgICAgICAgY29uc3QgZ3JpZEhlbHBlciA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKCAxMCwpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZCggZ3JpZEhlbHBlciApOyAgXG5cbiAgICAgICAgY29uc3QgYXhlc0hlbHBlciA9IG5ldyBUSFJFRS5BeGVzSGVscGVyKCA1ICk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKCBheGVzSGVscGVyICk7XG4gICAgICAgIFxuICAgICAgICAvLzIuQW1iaWVudExpZ2h0XG4gICAgICAgIGxldCBsaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHhmZmZmZmYsIDEuMCk7Ly8o44Op44Kk44OI44Gu6ImyLOODqeOCpOODiOOBruW8t+OBlSlcbiAgICAgICAgbGlnaHQucG9zaXRpb24uc2V0KDEsIDEsIDEpOy8v44Op44Kk44OI44Gu5L2N572uXG4gICAgICAgIC8v44K344O844Oz5YWo5L2T44Gr6YGp55So44GV44KM44KL44Op44Kk44OI44Gu44Gf44KB44CB5pa55ZCR44Go44GL44Gv44Gq44GE44CC5b2x44KC6JC944Gh44Gq44GE44CCXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGxpZ2h0KTtcblxuICAgICAgICBsZXQgd2lzUHJlc3NlZD1mYWxzZTtcbiAgICAgICAgbGV0IGFpc1ByZXNzZWQ9ZmFsc2U7XG4gICAgICAgIGxldCBzaXNQcmVzc2VkPWZhbHNlO1xuICAgICAgICBsZXQgZGlzUHJlc3NlZD1mYWxzZTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdXJzpcbiAgICAgICAgICAgICAgICAgICAgd2lzUHJlc3NlZD10cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2EnOlxuICAgICAgICAgICAgICAgICAgICBhaXNQcmVzc2VkPXRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAncyc6XG4gICAgICAgICAgICAgICAgICAgIHNpc1ByZXNzZWQ9dHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgICAgICAgICAgICAgZGlzUHJlc3NlZD10cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQua2V5KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnVyc6XG4gICAgICAgICAgICAgICAgICAgIHdpc1ByZXNzZWQ9ZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYSc6XG4gICAgICAgICAgICAgICAgICAgIGFpc1ByZXNzZWQ9ZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAncyc6XG4gICAgICAgICAgICAgICAgICAgIHNpc1ByZXNzZWQ9ZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgICAgICAgICAgICAgIGRpc1ByZXNzZWQ9ZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgLy/jgq/jg6rjg4Pjgq/jgZXjgozjgZ/jgZPjgajjgpLmpJznn6XjgZnjgovjgZ/jgoHjgavjga/jgIFyYXljYXN0ZXLjgaflhYnnt5rjgpLlh7rjgZnlv4XopoHjgYzjgYLjgovvvJ/vvJ/vvJ8o44KI44GP44KP44GL44KJ44Gq44GE44GX5q2j44GX44GP5YuV44GL44Gq44GEKVxuICAgICAgICBjb25zdCByYXljYXN0ZXIgPSBuZXcgVEhSRUUuUmF5Y2FzdGVyKCk7XG4gICAgICAgIGNvbnN0IG1vdXNlID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBtb3VzZS54ID0gKGV2ZW50LmNsaWVudFggLyB3aW5kb3cuaW5uZXJXaWR0aCkgKiAyIC0gMTtcbiAgICAgICAgICAgIG1vdXNlLnkgPSAtKGV2ZW50LmNsaWVudFkgLyB3aW5kb3cuaW5uZXJIZWlnaHQpICogMiArIDE7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJheWNhc3Rlci5zZXRGcm9tQ2FtZXJhKG1vdXNlLCB0aGlzLmNhbWVyYSk7XG4gICAgICAgICAgICBjb25zdCBpbnRlcnNlY3RzID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdHModGhpcy5jbGlja2FibGVPYmplY3RzLCB0cnVlKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW50ZXJzZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9iaiA9IGludGVyc2VjdHNbaV0ub2JqZWN0O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIEdyaWRIZWxwZXLjgoRBeGVzSGVscGVy44Gq44Gp44KS6Zmk5aSWXG4gICAgICAgICAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIFRIUkVFLkdyaWRIZWxwZXIgfHwgb2JqIGluc3RhbmNlb2YgVEhSRUUuQXhlc0hlbHBlcikgY29udGludWU7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gbGFiZWzjgYzjgYLjgovjgqrjg5bjgrjjgqfjgq/jg4jjga7jgb/ooajnpLpcbiAgICAgICAgICAgICAgICBpZiAob2JqLnVzZXJEYXRhICYmIG9iai51c2VyRGF0YS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuOCr+ODquODg+OCr+OBleOCjOOBn+OCquODluOCuOOCp+OCr+ODiDpcIiwgb2JqLnVzZXJEYXRhLmxhYmVsKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuOCr+ODquODg+OCr+OBleOCjOOBn+OBjOODqeODmeODq+OBquOBlzpcIiwgb2JqLm5hbWUgfHwgb2JqLnR5cGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhazsgLy8g5pyA5Yid44Gr5b2T44Gf44Gj44GfMeOBpOOBoOOBkeWHpueQhlxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgdXBkYXRlOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG5cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuXG4gICAgICAgICAgICB0aGlzLndvcmxkLmZpeGVkU3RlcCgpOy8vdXBkYXRl6Zai5pWw44Gn44Gv44CB44GT44KM44Gnd29ybGTjga7niannkIbmvJTnrpfjgpLlrp/ooYzjgZfjgb7jgZnjgIJcbiAgICAgICAgICAgIGNvbnN0IHdvbWFuID0gdGhpcy5zY2VuZS5nZXRPYmplY3RCeU5hbWUoXCJ3b21hblwiKTtcbiAgICAgICAgICAgIGlmKHdvbWFuKXtcbiAgICAgICAgICAgICAgICB3b21hbi5wb3NpdGlvbi5zZXQoY3ViZUJvZHkucG9zaXRpb24ueCwgY3ViZUJvZHkucG9zaXRpb24ueSwgY3ViZUJvZHkucG9zaXRpb24ueik7Ly/mnIDlvozjgavkvY3nva7jga7nirbmhYvjgahcbiAgICAgICAgICAgICAgICB3b21hbi5xdWF0ZXJuaW9uLnNldChjdWJlQm9keS5xdWF0ZXJuaW9uLngsIGN1YmVCb2R5LnF1YXRlcm5pb24ueSwgY3ViZUJvZHkucXVhdGVybmlvbi56LCBjdWJlQm9keS5xdWF0ZXJuaW9uLncpOy8v5Zue6Lui44Gu54q25oWL44KSY3ViZeOBi+OCieOCs+ODlOODvFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYod29tYW4ucG9zaXRpb24ueTwtNTApe1xuICAgICAgICAgICAgICAgIGN1YmVCb2R5LnBvc2l0aW9uLnNldCgwLDUsLTEuNSk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCIz56eS57WM6YGO44GX44G+44GX44GfXCIpO1xuICAgICAgICAgICAgICAgICAgICBjdWJlQm9keS5wb3NpdGlvbi5zZXQoLTUsIDEwLCAtMS41KTtcbiAgICAgICAgICAgICAgICB9LCAzMDAwMCk7ICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICB9XG4gICAgXG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0KTtcbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgbGV0IGNvbnRhaW5lciA9IG5ldyBUaHJlZUpTQ29udGFpbmVyKCk7XG5cbiAgICBsZXQgdmlld3BvcnQgPSBjb250YWluZXIuY3JlYXRlUmVuZGVyZXJET00oNjQwLCA0ODAsIG5ldyBUSFJFRS5WZWN0b3IzKDIsIDEuNiwgMikpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlld3BvcnQpO1xufVxuXG5jbGFzcyBDbGFzc3Jvb217XG4gICAgcm9vbTogVEhSRUUuR3JvdXA7XG4gICAgY29uc3RydWN0b3Iod2lkdGgsaGVpZ2h0KXtcbiAgICAgICAgdGhpcy5yb29tPW5ldyBUSFJFRS5Hcm91cCgpO1xuICAgICAgICAvL+WcsOmdouOBruS9nOaIkFxuICAgICAgICBjb25zdCB0aWxlV2lkdGg9MTtjb25zdCB0aWxlSGVpZ2h0PTE7XG4gICAgICAgIGNvbnN0IGdlb21ldHJ5PW5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KHRpbGVXaWR0aCx0aWxlSGVpZ2h0KTtcbiAgICAgICAgY29uc3QgdGV4dHVyZUxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG4gICAgICAgIGNvbnN0IHRleHR1cmUgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoJ2Zsb29yLnBuZycpO1xuICAgICAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCggeyBtYXA6IHRleHR1cmV9ICk7Ly/jgZPjgaPjgaHjgpLkvb/jgYbjgajjgqTjg7Pjg53jg7zjg4jjgZfjgZ/nlLvlg4/jgpLkvb/jgaPjgZ/jg57jg4bjg6rjgqLjg6vjgpLnlJ/miJDjgafjgY3jgb7jgZnjgIJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxoZWlnaHQ7aSsrKXtcbiAgICAgICAgICAgIGZvcihsZXQgaj0wO2o8d2lkdGg7aisrKXtcbiAgICAgICAgICAgICAgICBjb25zdCB0aWxlPW5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LG1hdGVyaWFsKTtcbiAgICAgICAgICAgICAgICB0aWxlLnJvdGF0ZVgoLU1hdGguUEkvMik7XG4gICAgICAgICAgICAgICAgdGlsZS5wb3NpdGlvbi5zZXQoLXdpZHRoLzIrdGlsZVdpZHRoLzIrdGlsZVdpZHRoKmosMCwtaGVpZ2h0LzIrdGlsZUhlaWdodC8yK3RpbGVIZWlnaHQqaSk7XG4gICAgICAgICAgICAgICAgLy90aWxlcy5wdXNoKHRpbGUpOyAgXG4gICAgICAgICAgICAgICAgdGhpcy5yb29tLmFkZCh0aWxlKTsgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8v5aOB44Gu5L2c5oiQXG4gICAgICAgIGNvbnN0IGd0ZkxvYWRlciA9IG5ldyBHTFRGTG9hZGVyKCk7XG4gICAgICAgIGd0ZkxvYWRlci5sb2FkKCdjbGFzc3Jvb21fd2FsbC5nbGInLCAoZ2x0ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBnbHRmLnNjZW5lO1xuICAgICAgICAgICAgbW9kZWwucG9zaXRpb24uc2V0KDAsIDAsIC0xLjUpO1xuICAgICAgICAgICAgbW9kZWwuc2NhbGUuc2V0KDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYsMC4yNSp3aWR0aC82KTtcbiAgICAgICAgICAgIHRoaXMucm9vbS5hZGQobW9kZWwpO1xuICAgICAgICB9KTtcbiAgICAgICAgZ3RmTG9hZGVyLmxvYWQoJ2NsYXNzcm9vbV9sZWZ0V2luZG93LmdsYicsIChnbHRmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGdsdGYuc2NlbmU7XG4gICAgICAgICAgICBtb2RlbC5wb3NpdGlvbi5zZXQoMCwgMCwgLTEuNSk7XG4gICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYpO1xuICAgICAgICAgICAgdGhpcy5yb29tLmFkZChtb2RlbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBndGZMb2FkZXIubG9hZCgnY2xhc3Nyb29tX3JpZ2h0V2luZG93LmdsYicsIChnbHRmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGdsdGYuc2NlbmU7XG4gICAgICAgICAgICBtb2RlbC5wb3NpdGlvbi5zZXQoMCwgMCwgLTEuNSk7XG4gICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYpO1xuICAgICAgICAgICAgdGhpcy5yb29tLmFkZChtb2RlbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBndGZMb2FkZXIubG9hZCgnY2xhc3Nyb29tX2Zyb250RG9vci5nbGInLCAoZ2x0ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBnbHRmLnNjZW5lO1xuICAgICAgICAgICAgbW9kZWwucG9zaXRpb24uc2V0KDAsIDAsIC0xLjUpO1xuICAgICAgICAgICAgbW9kZWwuc2NhbGUuc2V0KDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYsMC4yNSp3aWR0aC82KTtcbiAgICAgICAgICAgIHRoaXMucm9vbS5hZGQobW9kZWwpO1xuICAgICAgICB9KTtcbiAgICAgICAgZ3RmTG9hZGVyLmxvYWQoJ2NsYXNzcm9vbV9iYWNrRG9vci5nbGInLCAoZ2x0ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBnbHRmLnNjZW5lO1xuICAgICAgICAgICAgbW9kZWwucG9zaXRpb24uc2V0KDAsIDAsIC0xLjUpO1xuICAgICAgICAgICAgbW9kZWwuc2NhbGUuc2V0KDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYsMC4yNSp3aWR0aC82KTtcbiAgICAgICAgICAgIHRoaXMucm9vbS5hZGQobW9kZWwpO1xuICAgICAgICB9KTtcbiAgICAgICAgZ3RmTG9hZGVyLmxvYWQoJ2NsYXNzcm9vbV9jZWlsaW5nLmdsYicsIChnbHRmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGdsdGYuc2NlbmU7XG4gICAgICAgICAgICBtb2RlbC5wb3NpdGlvbi5zZXQoMCwgMCwgLTEuNSk7XG4gICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYpO1xuICAgICAgICAgICAgdGhpcy5yb29tLmFkZChtb2RlbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGd0ZkxvYWRlci5sb2FkKCdibGFja2JvYXJkX2NlbnRlci5nbGInLCAoZ2x0ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBnbHRmLnNjZW5lO1xuICAgICAgICAgICAgbW9kZWwucG9zaXRpb24uc2V0KDAsIDAsIC0xLjUpO1xuICAgICAgICAgICAgbW9kZWwuc2NhbGUuc2V0KDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYsMC4yNSp3aWR0aC82KTtcbiAgICAgICAgICAgIHRoaXMucm9vbS5hZGQobW9kZWwpO1xuICAgICAgICB9KTtcbiAgICAgICAgZ3RmTG9hZGVyLmxvYWQoJ2JsYWNrYm9hcmRfcmlnaHQuZ2xiJywgKGdsdGYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZ2x0Zi5zY2VuZTtcbiAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnNldCgwLCAwLCAtMS41KTtcbiAgICAgICAgICAgIG1vZGVsLnNjYWxlLnNldCgwLjI1KndpZHRoLzYsMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNik7XG4gICAgICAgICAgICB0aGlzLnJvb20uYWRkKG1vZGVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGd0ZkxvYWRlci5sb2FkKCdibGFja2JvYXJkX2JhY2suZ2xiJywgKGdsdGYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZ2x0Zi5zY2VuZTtcbiAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnNldCgtMC4xNSwgMCwgLTEuNSk7XG4gICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYpO1xuICAgICAgICAgICAgdGhpcy5yb29tLmFkZChtb2RlbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBndGZMb2FkZXIubG9hZCgndGVhY2hlcl9kZXNrLmdsYicsIChnbHRmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGdsdGYuc2NlbmU7XG4gICAgICAgICAgICBtb2RlbC5wb3NpdGlvbi5zZXQoLTEuMiwgMCwgLTMuMjUpO1xuICAgICAgICAgICAgbW9kZWwuc2NhbGUuc2V0KDAuNCp3aWR0aC82LDAuMjUqd2lkdGgvNiwwLjUqd2lkdGgvNik7XG4gICAgICAgICAgICBtb2RlbC5yb3RhdGVZKC1NYXRoLlBJKTtcbiAgICAgICAgICAgIHRoaXMucm9vbS5hZGQobW9kZWwpO1xuICAgICAgICB9KTtcbiAgICAgICAgZ3RmTG9hZGVyLmxvYWQoJ3RlYWNoZXJfZGVza19sZWZ0RHJhd2VyLmdsYicsIChnbHRmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGdsdGYuc2NlbmU7XG4gICAgICAgICAgICBtb2RlbC5wb3NpdGlvbi5zZXQoLTEuMiwgMCwgLTMpO1xuICAgICAgICAgICAgbW9kZWwuc2NhbGUuc2V0KDAuNCp3aWR0aC82LDAuMjUqd2lkdGgvNiwwLjUqd2lkdGgvNik7XG4gICAgICAgICAgICBtb2RlbC5yb3RhdGVZKC1NYXRoLlBJKTtcbiAgICAgICAgICAgIHRoaXMucm9vbS5hZGQobW9kZWwpO1xuICAgICAgICB9KTtcbiAgICAgICAgZ3RmTG9hZGVyLmxvYWQoJ3RlYWNoZXJfZGVza19yaWdodERyYXdlcjEuZ2xiJywgKGdsdGYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZ2x0Zi5zY2VuZTtcbiAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnNldCgtMS4yLCAwLCAtMy4yNSk7XG4gICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMC40KndpZHRoLzYsMC4yNSp3aWR0aC82LDAuNSp3aWR0aC82KTtcbiAgICAgICAgICAgIG1vZGVsLnJvdGF0ZVkoLU1hdGguUEkpO1xuICAgICAgICAgICAgdGhpcy5yb29tLmFkZChtb2RlbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBndGZMb2FkZXIubG9hZCgndGVhY2hlcl9kZXNrX3JpZ2h0RHJhd2VyMi5nbGInLCAoZ2x0ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBnbHRmLnNjZW5lO1xuICAgICAgICAgICAgbW9kZWwucG9zaXRpb24uc2V0KC0xLjIsIDAsIC0zLjI1KTtcbiAgICAgICAgICAgIG1vZGVsLnNjYWxlLnNldCgwLjQqd2lkdGgvNiwwLjI1KndpZHRoLzYsMC41KndpZHRoLzYpO1xuICAgICAgICAgICAgbW9kZWwucm90YXRlWSgtTWF0aC5QSSk7XG4gICAgICAgICAgICB0aGlzLnJvb20uYWRkKG1vZGVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGd0ZkxvYWRlci5sb2FkKCd0ZWFjaGVyX2Rlc2tfcmlnaHREcmF3ZXIzLmdsYicsIChnbHRmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGdsdGYuc2NlbmU7XG4gICAgICAgICAgICBtb2RlbC5wb3NpdGlvbi5zZXQoLTEuMiwgMCwgLTMuMjUpO1xuICAgICAgICAgICAgbW9kZWwuc2NhbGUuc2V0KDAuNCp3aWR0aC82LDAuMjUqd2lkdGgvNiwwLjUqd2lkdGgvNik7XG4gICAgICAgICAgICBtb2RlbC5yb3RhdGVZKC1NYXRoLlBJKTtcbiAgICAgICAgICAgIHRoaXMucm9vbS5hZGQobW9kZWwpO1xuICAgICAgICB9KTtcbiAgICAgICAgZ3RmTG9hZGVyLmxvYWQoJ2N1cnRhaW5fY2xvc2VkLmdsYicsIChnbHRmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGdsdGYuc2NlbmU7XG4gICAgICAgICAgICBtb2RlbC5wb3NpdGlvbi5zZXQoLTAuNzUsIDAuMjAsIC0wLjUpO1xuICAgICAgICAgICAgbW9kZWwuc2NhbGUuc2V0KDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYsMC4yNSp3aWR0aC82KTtcbiAgICAgICAgICAgIHRoaXMucm9vbS5hZGQobW9kZWwpO1xuICAgICAgICB9KTtcbiAgICAgICAgZ3RmTG9hZGVyLmxvYWQoJ2N1cnRhaW5fb3BlbmVkLmdsYicsIChnbHRmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGdsdGYuc2NlbmU7XG4gICAgICAgICAgICBtb2RlbC5wb3NpdGlvbi5zZXQoLTEsIDAuMjUsIC0xLjc1KTtcbiAgICAgICAgICAgIG1vZGVsLnNjYWxlLnNldCgwLjI1KndpZHRoLzYsMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNik7XG4gICAgICAgICAgICB0aGlzLnJvb20uYWRkKG1vZGVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGd0ZkxvYWRlci5sb2FkKCdib29rc2hlbGYuZ2xiJywgKGdsdGYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZ2x0Zi5zY2VuZTtcbiAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnNldCgtMi4zLCAwLCAtMik7XG4gICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMC4zKndpZHRoLzYsMC4zKndpZHRoLzYsMC4zKndpZHRoLzYpO1xuICAgICAgICAgICAgLy9tb2RlbC5yb3RhdGVaKC1NYXRoLlBJKTtcbiAgICAgICAgICAgIHRoaXMucm9vbS5hZGQobW9kZWwpO1xuICAgICAgICB9KTtcbiAgICAgICAgZ3RmTG9hZGVyLmxvYWQoJ2JsdWVfYm9vay5nbGInLCAoZ2x0ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBnbHRmLnNjZW5lO1xuICAgICAgICAgICAgbW9kZWwucG9zaXRpb24uc2V0KDAuNywgMC4wNSwgLTEuNSk7XG4gICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYpO1xuICAgICAgICAgICAgdGhpcy5yb29tLmFkZChtb2RlbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBndGZMb2FkZXIubG9hZCgncmVkX2Jvb2suZ2xiJywgKGdsdGYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZ2x0Zi5zY2VuZTtcbiAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnNldCgtMC4yNSwgMC4wNSwgLTEuNSk7XG4gICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYpO1xuICAgICAgICAgICAgdGhpcy5yb29tLmFkZChtb2RlbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBndGZMb2FkZXIubG9hZCgnY2xlYW5pbmdMb2NrZXJfb3BlbmVkLmdsYicsIChnbHRmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGdsdGYuc2NlbmU7XG4gICAgICAgICAgICBtb2RlbC5wb3NpdGlvbi5zZXQoMi40LCAwLCA0LjIpO1xuICAgICAgICAgICAgbW9kZWwuc2NhbGUuc2V0KDAuMyp3aWR0aC82LDAuMyp3aWR0aC82LDAuMyp3aWR0aC82KTtcbiAgICAgICAgICAgIG1vZGVsLnJvdGF0ZVkoLU1hdGguUEkpO1xuICAgICAgICAgICAgdGhpcy5yb29tLmFkZChtb2RlbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBndGZMb2FkZXIubG9hZCgnaG91a2kuZ2xiJywgKGdsdGYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZ2x0Zi5zY2VuZTtcbiAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnNldCgxLjgsIDAuMjUsIDIuMCk7XG4gICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMC4yNSp3aWR0aC82LDAuMjUqd2lkdGgvNiwwLjI1KndpZHRoLzYpO1xuICAgICAgICAgICAgbW9kZWwucm90YXRlWigtTWF0aC5QSS8xMilcbiAgICAgICAgICAgIHRoaXMucm9vbS5hZGQobW9kZWwpO1xuICAgICAgICB9KTtcbiAgICAgICAgZ3RmTG9hZGVyLmxvYWQoJ2xvY2tlci5nbGInLCAoZ2x0ZikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBnbHRmLnNjZW5lO1xuICAgICAgICAgICAgbW9kZWwucG9zaXRpb24uc2V0KC0xLjAsIDAsIC0xLjUpO1xuICAgICAgICAgICAgbW9kZWwuc2NhbGUuc2V0KDAuMjAqd2lkdGgvNiwwLjI1KndpZHRoLzYsMC4yNSp3aWR0aC82KTtcbiAgICAgICAgICAgIHRoaXMucm9vbS5hZGQobW9kZWwpO1xuICAgICAgICB9KTtcbiAgICAgICAgZ3RmTG9hZGVyLmxvYWQoJ3NhZmUuZ2xiJywgKGdsdGYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZ2x0Zi5zY2VuZTtcbiAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnNldCgtMSwgMC43LCAxLjMpO1xuICAgICAgICAgICAgbW9kZWwuc2NhbGUuc2V0KDAuMSp3aWR0aC82LDAuMSp3aWR0aC82LDAuMSp3aWR0aC82KTtcbiAgICAgICAgICAgIG1vZGVsLnJvdGF0ZVkoLU1hdGguUEkvMik7XG4gICAgICAgICAgICB0aGlzLnJvb20uYWRkKG1vZGVsKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8NDtpKyspe1xuICAgICAgICAgICAgZ3RmTG9hZGVyLmxvYWQoJ2RpeWFsLmdsYicsIChnbHRmKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBnbHRmLnNjZW5lO1xuICAgICAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnNldCgtMSswLjAxKmksIDAuNywgMS4zKTtcbiAgICAgICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMC4xKndpZHRoLzYsMC4xKndpZHRoLzYsMC4xKndpZHRoLzYpO1xuICAgICAgICAgICAgICAgIG1vZGVsLnJvdGF0ZVkoLU1hdGguUEkvMik7XG4gICAgICAgICAgICAgICAgdGhpcy5yb29tLmFkZChtb2RlbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBndGZMb2FkZXIubG9hZCgnd29tYW4uZ2xiJywgKGdsdGYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZ2x0Zi5zY2VuZTtcbiAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnNldCgxLCAwLjEsIDIuNSk7XG4gICAgICAgICAgICBtb2RlbC5zY2FsZS5zZXQoMSp3aWR0aC82LDEqd2lkdGgvNiwxKndpZHRoLzYpO1xuICAgICAgICAgICAgbW9kZWwucm90YXRlWihNYXRoLlBJLzIpO1xuICAgICAgICAgICAgdGhpcy5yb29tLmFkZChtb2RlbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qXG4gICAgICAgIHRoaXMubG9hZE1vZGVsKCdib29rc2hlbGYuZ2xiJywgIHsgeDogLTAuNSwgeTogMCwgejogMCB9LCAxKTtcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ2JsdWVfYm9vay5nbGInLCAgeyB4OiAtMTAsIHk6IC01LCB6OiAwIH0sIDEpO1xuICAgICAgICB0aGlzLmxvYWRNb2RlbCgnZGl5YWwuZ2xiJywgIHsgeDogMiwgeTogMCwgejogMCB9LCAxKTtcbiAgICAgICAgdGhpcy5sb2FkTW9kZWwoJ3NhZmUuZ2xiJywgIHsgeDogLTAsIHk6IDAsIHo6IDAgfSwgMSk7XG4gICAgICAgIHRoaXMubG9hZE1vZGVsKCdzYWZlX29wZW5lZC5nbGInLCAgeyB4OiAtMiwgeTogLTUsIHo6IDAgfSwgMSk7XG4gICAgICAgIHRoaXMubG9hZE1vZGVsKCd3b21hbi5nbGInLCAgeyB4OiAwLCB5OiAwLCB6OiAwIH0sIDEpO1xuICAgICAgICB0aGlzLmxvYWRNb2RlbCgnc2FrYXNhbWFfd29tYW4uZ2xiJywgIHsgeDogMCwgeTogMCwgejogMCB9LCAxKTsqL1xuICAgIH1cbn1cblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc19jYW5ub24tZXNfZGlzdF9jYW5ub24tZXNfanMtbm9kZV9tb2R1bGVzX3RocmVlX2J1aWxkX3RocmVlX21vZHVsZV9qcy1ub2QtMTFiNjRjXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9