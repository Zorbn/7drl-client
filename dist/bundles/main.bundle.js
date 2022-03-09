/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gameApp.ts":
/*!************************!*\
  !*** ./src/gameApp.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GameApp": () => (/* binding */ GameApp)
/* harmony export */ });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/dist/esm/pixi.js");

class GameApp extends pixi_js__WEBPACK_IMPORTED_MODULE_0__.Application {
    constructor(backgroundColor) {
        super({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor
        });
        document.body.appendChild(this.view);
    }
    registerListeners() {
        window.addEventListener("resize", () => {
            this.renderer.resize(window.innerWidth, window.innerHeight);
        });
    }
}


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! socket.io-client */ "./node_modules/socket.io-client/build/esm/index.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/dist/esm/pixi.js");
/* harmony import */ var _gameApp__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gameApp */ "./src/gameApp.ts");
/* harmony import */ var _tileMap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tileMap */ "./src/tileMap.ts");




const socket = socket_io_client__WEBPACK_IMPORTED_MODULE_0__.io( /* The client is served by the server, so no domain needs t obe specified */);
const targetFps = 144;
const frameTime = 1 / targetFps;
const frameTimeMs = 1000 / targetFps;
let sprites = [
    "../assets/floor.png",
    "../assets/wall.png",
];
let textures = [];
for (let i = 0; i < sprites.length; i++) {
    textures[i] = pixi_js__WEBPACK_IMPORTED_MODULE_1__.Texture.from(sprites[i]);
}
let gameApp = new _gameApp__WEBPACK_IMPORTED_MODULE_2__.GameApp(0x00a1db);
gameApp.registerListeners();
let map = new _tileMap__WEBPACK_IMPORTED_MODULE_3__.TileMap();
map.registerListeners(socket);
gameApp.stage.addChild(map.container);
setInterval(() => {
    map.updateGfx(textures);
}, frameTimeMs);
/*
import * as SocketIo from "socket.io-client";
import * as Pixi from "pixi.js";
import { GameApp } from "./gameApp";
import {
    addEntity,
    createWorld,
    defineComponent,
    defineQuery,
    defineSystem, enterQuery,
    exitQuery,
    IWorld,
    pipe,
    Types,
    addComponent,
} from "bitecs";
*/
//const socket = SocketIo.io(/* The client is served by the server, so no domain needs to be specified */);
/*
const world = createWorld();
let gameApp = new GameApp(0x00a1db);
gameApp.registerListeners();

const targetFps = 144;
const frameTime = 1 / targetFps;
const frameTimeMs = 1000/ targetFps;

let heldKeys: string[] = [];
let pressedKeys: string[] = [];

document.addEventListener("keydown", (event) => {
    if (!heldKeys.includes(event.key)) {
        heldKeys.push(event.key);
    }
});

document.addEventListener("keyup", (event) => {
    const index = heldKeys.indexOf(event.key);
    if (index > -1) {
        heldKeys.splice(index, 1);
    }
});

document.addEventListener("keypress", (event) => {
    if (!pressedKeys.includes(event.key)) {
        pressedKeys.push(event.key);
    }
});

const spriteScale = 4;
let spriteList: { [id: number]: Pixi.Sprite } = {};
let sprites: { [index: number]: string } = {
    0: "../assets/player.png",
};
Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST;

const Vector2 = { x: Types.f32, y: Types.f32 };
const Sprite = defineComponent({ spriteIndex: Types.i32 });
const Position = defineComponent(Vector2);
const Player = defineComponent();
const LocalPlayer = defineComponent();
const NetTracker = defineComponent({ netId: Types.i32 });
const Speed = defineComponent({ speed: Types.f32 });

const spriteQuery = defineQuery([Sprite]);
const spritePositionQuery = defineQuery([Sprite, Position]);

const spritePositionSystem = defineSystem((world: IWorld): IWorld => {
    const entities = spritePositionQuery(world);
    for (let i = 0; i < entities.length; i++) {
        const eid = entities[i];
        if (spriteList[eid] == undefined) continue;

        spriteList[eid].position.x = Position.x[eid];
        spriteList[eid].position.y = Position.y[eid];
    }
    return world;
});

const spriteExitQuery = exitQuery(spriteQuery);
const spriteExitSystem = defineSystem((world: IWorld): IWorld => {
    const entities = spriteExitQuery(world);
    for (let i = 0; i < entities.length; i++) {
        const eid = entities[i];
        gameApp.stage.removeChild(spriteList[eid]);
        delete spriteList[eid];
    }
    return world;
});

const spriteEnterQuery = enterQuery(spriteQuery);
const spriteEnterSystem = defineSystem((world: IWorld): IWorld => {
    const entities = spriteEnterQuery(world);
    for (let i = 0; i < entities.length; i++) {
        const eid = entities[i];

        let sprite = Pixi.Sprite.from(sprites[Sprite.spriteIndex[eid]]);
        sprite.scale.x = spriteScale;
        sprite.scale.y = spriteScale;
        sprite.x = 5;
        sprite.y = 5;
        spriteList[eid] = sprite;

        gameApp.stage.addChild(sprite);
    }
    return world;
});

const localPlayerMovementQuery = defineQuery([LocalPlayer, Position, Speed]);
const localPlayerMovementSystem = defineSystem((world: IWorld): IWorld => {
    const entities = localPlayerMovementQuery(world);
    for (let i = 0; i < entities.length; i++) {
        const eid = entities[i];

        let moveX = 0, moveY = 0;

        if (heldKeys.includes("ArrowLeft"))  moveX -= 1;
        if (heldKeys.includes("ArrowRight")) moveX += 1;
        if (heldKeys.includes("ArrowUp"))    moveY -= 1;
        if (heldKeys.includes("ArrowDown"))  moveY += 1;

        let moveMag = Math.sqrt(moveX * moveX + moveY * moveY);
        if (moveMag != 0) {
            moveX /= moveMag;
            moveY /= moveMag;
        }

        Position.x[eid] += moveX * Speed.speed[eid] * frameTime;
        Position.y[eid] += moveY * Speed.speed[eid] * frameTime;
    }
    return world;
});

const pipeline = pipe(spritePositionSystem, spriteEnterSystem, spriteExitSystem, localPlayerMovementSystem);

// Run systems at a fixed frame-rate
setInterval(() => {
    pipeline(world);
    pressedKeys = [];
}, frameTimeMs);

const playerId = addEntity(world);
addComponent(world, Sprite, playerId);
Sprite.spriteIndex[playerId] = 0;
addComponent(world, Player, playerId);
addComponent(world, LocalPlayer, playerId);
addComponent(world, Position, playerId);
addComponent(world, Speed, playerId);
Speed.speed[playerId] = 150;
*/ 


/***/ }),

/***/ "./src/tileMap.ts":
/*!************************!*\
  !*** ./src/tileMap.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TileMap": () => (/* binding */ TileMap)
/* harmony export */ });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "./node_modules/pixi.js/dist/esm/pixi.js");

class TileMap {
    constructor(tileSize = 16) {
        this.tiles = [];
        this.tileSprites = [];
        this.width = 0;
        this.height = 0;
        this.tileSize = tileSize;
        this.container = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Container();
        this.initialized = false;
    }
    registerListeners(socket) {
        socket.on("MapInfo", (mapInfo) => {
            if (mapInfo == undefined)
                return;
            this.width = mapInfo.width;
            this.height = mapInfo.height;
            for (let x = 0; x < this.width; x++) {
                this.tiles[x] = [];
                this.tileSprites[x] = [];
                for (let y = 0; y < this.height; y++) {
                    this.tiles[x][y] = mapInfo.defaultTile;
                    this.tileSprites[x][y] = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Sprite();
                    this.container.addChild(this.tileSprites[x][y]);
                }
            }
            this.initialized = true;
            socket.on("MapUpdate", (mapData) => {
                this.tiles = mapData.tiles;
            });
        });
    }
    updateGfx(textures) {
        if (!this.initialized)
            return;
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let currentTile = this.tileSprites[x][y];
                currentTile.texture = textures[this.tiles[x][y]];
                currentTile.x = x * this.tileSize;
                currentTile.y = y * this.tileSize;
                currentTile.width = this.tileSize;
                currentTile.height = this.tileSize;
            }
        }
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
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
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
/******/ 		var chunkLoadingGlobal = self["webpackChunk_7drl_client"] = self["webpackChunk_7drl_client"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors"], () => (__webpack_require__("./src/index.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDSkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vN2RybC1jbGllbnQvLi9zcmMvZ2FtZUFwcC50cyIsIndlYnBhY2s6Ly83ZHJsLWNsaWVudC8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly83ZHJsLWNsaWVudC8uL3NyYy90aWxlTWFwLnRzIiwid2VicGFjazovLzdkcmwtY2xpZW50L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLzdkcmwtY2xpZW50L3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vN2RybC1jbGllbnQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vN2RybC1jbGllbnQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLzdkcmwtY2xpZW50L3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vN2RybC1jbGllbnQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly83ZHJsLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLzdkcmwtY2xpZW50L3dlYnBhY2svcnVudGltZS9ub2RlIG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vN2RybC1jbGllbnQvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vN2RybC1jbGllbnQvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly83ZHJsLWNsaWVudC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vN2RybC1jbGllbnQvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFBpeGkgZnJvbSBcInBpeGkuanNcIjtcblxuZXhwb3J0IGNsYXNzIEdhbWVBcHAgZXh0ZW5kcyBQaXhpLkFwcGxpY2F0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihiYWNrZ3JvdW5kQ29sb3I6IG51bWJlcikge1xuICAgICAgICBzdXBlcih7XG4gICAgICAgICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvclxuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnZpZXcpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3Rlckxpc3RlbmVycygpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZXNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJpbXBvcnQgKiBhcyBTb2NrZXRJbyBmcm9tIFwic29ja2V0LmlvLWNsaWVudFwiO1xuaW1wb3J0ICogYXMgUGl4aSBmcm9tIFwicGl4aS5qc1wiO1xuaW1wb3J0IHsgR2FtZUFwcCB9IGZyb20gXCIuL2dhbWVBcHBcIjtcbmltcG9ydCB7IFRpbGVNYXAgfSBmcm9tIFwiLi90aWxlTWFwXCI7XG5cbmNvbnN0IHNvY2tldCA9IFNvY2tldElvLmlvKC8qIFRoZSBjbGllbnQgaXMgc2VydmVkIGJ5IHRoZSBzZXJ2ZXIsIHNvIG5vIGRvbWFpbiBuZWVkcyB0IG9iZSBzcGVjaWZpZWQgKi8pO1xuXG5jb25zdCB0YXJnZXRGcHMgPSAxNDQ7XG5jb25zdCBmcmFtZVRpbWUgPSAxIC8gdGFyZ2V0RnBzO1xuY29uc3QgZnJhbWVUaW1lTXMgPSAxMDAwIC8gdGFyZ2V0RnBzO1xuXG5sZXQgc3ByaXRlczogc3RyaW5nW10gPSBbXG4gICAgXCIuLi9hc3NldHMvZmxvb3IucG5nXCIsXG4gICAgXCIuLi9hc3NldHMvd2FsbC5wbmdcIixcbl07XG5cbmxldCB0ZXh0dXJlczogUGl4aS5UZXh0dXJlW10gPSBbXTtcblxuZm9yIChsZXQgaSA9IDA7IGkgPCBzcHJpdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdGV4dHVyZXNbaV0gPSBQaXhpLlRleHR1cmUuZnJvbShzcHJpdGVzW2ldKTtcbn1cblxubGV0IGdhbWVBcHAgPSBuZXcgR2FtZUFwcCgweDAwYTFkYik7XG5nYW1lQXBwLnJlZ2lzdGVyTGlzdGVuZXJzKCk7XG5cbmxldCBtYXAgPSBuZXcgVGlsZU1hcCgpO1xubWFwLnJlZ2lzdGVyTGlzdGVuZXJzKHNvY2tldCk7XG5nYW1lQXBwLnN0YWdlLmFkZENoaWxkKG1hcC5jb250YWluZXIpO1xuXG5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgbWFwLnVwZGF0ZUdmeCh0ZXh0dXJlcyk7XG59LCBmcmFtZVRpbWVNcyk7XG5cbi8qXG5pbXBvcnQgKiBhcyBTb2NrZXRJbyBmcm9tIFwic29ja2V0LmlvLWNsaWVudFwiO1xuaW1wb3J0ICogYXMgUGl4aSBmcm9tIFwicGl4aS5qc1wiO1xuaW1wb3J0IHsgR2FtZUFwcCB9IGZyb20gXCIuL2dhbWVBcHBcIjtcbmltcG9ydCB7XG4gICAgYWRkRW50aXR5LFxuICAgIGNyZWF0ZVdvcmxkLFxuICAgIGRlZmluZUNvbXBvbmVudCxcbiAgICBkZWZpbmVRdWVyeSxcbiAgICBkZWZpbmVTeXN0ZW0sIGVudGVyUXVlcnksXG4gICAgZXhpdFF1ZXJ5LFxuICAgIElXb3JsZCxcbiAgICBwaXBlLFxuICAgIFR5cGVzLFxuICAgIGFkZENvbXBvbmVudCxcbn0gZnJvbSBcImJpdGVjc1wiO1xuKi9cbi8vY29uc3Qgc29ja2V0ID0gU29ja2V0SW8uaW8oLyogVGhlIGNsaWVudCBpcyBzZXJ2ZWQgYnkgdGhlIHNlcnZlciwgc28gbm8gZG9tYWluIG5lZWRzIHRvIGJlIHNwZWNpZmllZCAqLyk7XG4vKlxuY29uc3Qgd29ybGQgPSBjcmVhdGVXb3JsZCgpO1xubGV0IGdhbWVBcHAgPSBuZXcgR2FtZUFwcCgweDAwYTFkYik7XG5nYW1lQXBwLnJlZ2lzdGVyTGlzdGVuZXJzKCk7XG5cbmNvbnN0IHRhcmdldEZwcyA9IDE0NDtcbmNvbnN0IGZyYW1lVGltZSA9IDEgLyB0YXJnZXRGcHM7XG5jb25zdCBmcmFtZVRpbWVNcyA9IDEwMDAvIHRhcmdldEZwcztcblxubGV0IGhlbGRLZXlzOiBzdHJpbmdbXSA9IFtdO1xubGV0IHByZXNzZWRLZXlzOiBzdHJpbmdbXSA9IFtdO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoIWhlbGRLZXlzLmluY2x1ZGVzKGV2ZW50LmtleSkpIHtcbiAgICAgICAgaGVsZEtleXMucHVzaChldmVudC5rZXkpO1xuICAgIH1cbn0pO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgaW5kZXggPSBoZWxkS2V5cy5pbmRleE9mKGV2ZW50LmtleSk7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgaGVsZEtleXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG59KTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIChldmVudCkgPT4ge1xuICAgIGlmICghcHJlc3NlZEtleXMuaW5jbHVkZXMoZXZlbnQua2V5KSkge1xuICAgICAgICBwcmVzc2VkS2V5cy5wdXNoKGV2ZW50LmtleSk7XG4gICAgfVxufSk7XG5cbmNvbnN0IHNwcml0ZVNjYWxlID0gNDtcbmxldCBzcHJpdGVMaXN0OiB7IFtpZDogbnVtYmVyXTogUGl4aS5TcHJpdGUgfSA9IHt9O1xubGV0IHNwcml0ZXM6IHsgW2luZGV4OiBudW1iZXJdOiBzdHJpbmcgfSA9IHtcbiAgICAwOiBcIi4uL2Fzc2V0cy9wbGF5ZXIucG5nXCIsXG59O1xuUGl4aS5zZXR0aW5ncy5TQ0FMRV9NT0RFID0gUGl4aS5TQ0FMRV9NT0RFUy5ORUFSRVNUO1xuXG5jb25zdCBWZWN0b3IyID0geyB4OiBUeXBlcy5mMzIsIHk6IFR5cGVzLmYzMiB9O1xuY29uc3QgU3ByaXRlID0gZGVmaW5lQ29tcG9uZW50KHsgc3ByaXRlSW5kZXg6IFR5cGVzLmkzMiB9KTtcbmNvbnN0IFBvc2l0aW9uID0gZGVmaW5lQ29tcG9uZW50KFZlY3RvcjIpO1xuY29uc3QgUGxheWVyID0gZGVmaW5lQ29tcG9uZW50KCk7XG5jb25zdCBMb2NhbFBsYXllciA9IGRlZmluZUNvbXBvbmVudCgpO1xuY29uc3QgTmV0VHJhY2tlciA9IGRlZmluZUNvbXBvbmVudCh7IG5ldElkOiBUeXBlcy5pMzIgfSk7XG5jb25zdCBTcGVlZCA9IGRlZmluZUNvbXBvbmVudCh7IHNwZWVkOiBUeXBlcy5mMzIgfSk7XG5cbmNvbnN0IHNwcml0ZVF1ZXJ5ID0gZGVmaW5lUXVlcnkoW1Nwcml0ZV0pO1xuY29uc3Qgc3ByaXRlUG9zaXRpb25RdWVyeSA9IGRlZmluZVF1ZXJ5KFtTcHJpdGUsIFBvc2l0aW9uXSk7XG5cbmNvbnN0IHNwcml0ZVBvc2l0aW9uU3lzdGVtID0gZGVmaW5lU3lzdGVtKCh3b3JsZDogSVdvcmxkKTogSVdvcmxkID0+IHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHNwcml0ZVBvc2l0aW9uUXVlcnkod29ybGQpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZWlkID0gZW50aXRpZXNbaV07XG4gICAgICAgIGlmIChzcHJpdGVMaXN0W2VpZF0gPT0gdW5kZWZpbmVkKSBjb250aW51ZTtcblxuICAgICAgICBzcHJpdGVMaXN0W2VpZF0ucG9zaXRpb24ueCA9IFBvc2l0aW9uLnhbZWlkXTtcbiAgICAgICAgc3ByaXRlTGlzdFtlaWRdLnBvc2l0aW9uLnkgPSBQb3NpdGlvbi55W2VpZF07XG4gICAgfVxuICAgIHJldHVybiB3b3JsZDtcbn0pO1xuXG5jb25zdCBzcHJpdGVFeGl0UXVlcnkgPSBleGl0UXVlcnkoc3ByaXRlUXVlcnkpO1xuY29uc3Qgc3ByaXRlRXhpdFN5c3RlbSA9IGRlZmluZVN5c3RlbSgod29ybGQ6IElXb3JsZCk6IElXb3JsZCA9PiB7XG4gICAgY29uc3QgZW50aXRpZXMgPSBzcHJpdGVFeGl0UXVlcnkod29ybGQpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZWlkID0gZW50aXRpZXNbaV07XG4gICAgICAgIGdhbWVBcHAuc3RhZ2UucmVtb3ZlQ2hpbGQoc3ByaXRlTGlzdFtlaWRdKTtcbiAgICAgICAgZGVsZXRlIHNwcml0ZUxpc3RbZWlkXTtcbiAgICB9XG4gICAgcmV0dXJuIHdvcmxkO1xufSk7XG5cbmNvbnN0IHNwcml0ZUVudGVyUXVlcnkgPSBlbnRlclF1ZXJ5KHNwcml0ZVF1ZXJ5KTtcbmNvbnN0IHNwcml0ZUVudGVyU3lzdGVtID0gZGVmaW5lU3lzdGVtKCh3b3JsZDogSVdvcmxkKTogSVdvcmxkID0+IHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHNwcml0ZUVudGVyUXVlcnkod29ybGQpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZWlkID0gZW50aXRpZXNbaV07XG5cbiAgICAgICAgbGV0IHNwcml0ZSA9IFBpeGkuU3ByaXRlLmZyb20oc3ByaXRlc1tTcHJpdGUuc3ByaXRlSW5kZXhbZWlkXV0pO1xuICAgICAgICBzcHJpdGUuc2NhbGUueCA9IHNwcml0ZVNjYWxlO1xuICAgICAgICBzcHJpdGUuc2NhbGUueSA9IHNwcml0ZVNjYWxlO1xuICAgICAgICBzcHJpdGUueCA9IDU7XG4gICAgICAgIHNwcml0ZS55ID0gNTtcbiAgICAgICAgc3ByaXRlTGlzdFtlaWRdID0gc3ByaXRlO1xuXG4gICAgICAgIGdhbWVBcHAuc3RhZ2UuYWRkQ2hpbGQoc3ByaXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIHdvcmxkO1xufSk7XG5cbmNvbnN0IGxvY2FsUGxheWVyTW92ZW1lbnRRdWVyeSA9IGRlZmluZVF1ZXJ5KFtMb2NhbFBsYXllciwgUG9zaXRpb24sIFNwZWVkXSk7XG5jb25zdCBsb2NhbFBsYXllck1vdmVtZW50U3lzdGVtID0gZGVmaW5lU3lzdGVtKCh3b3JsZDogSVdvcmxkKTogSVdvcmxkID0+IHtcbiAgICBjb25zdCBlbnRpdGllcyA9IGxvY2FsUGxheWVyTW92ZW1lbnRRdWVyeSh3b3JsZCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBlaWQgPSBlbnRpdGllc1tpXTtcblxuICAgICAgICBsZXQgbW92ZVggPSAwLCBtb3ZlWSA9IDA7XG5cbiAgICAgICAgaWYgKGhlbGRLZXlzLmluY2x1ZGVzKFwiQXJyb3dMZWZ0XCIpKSAgbW92ZVggLT0gMTtcbiAgICAgICAgaWYgKGhlbGRLZXlzLmluY2x1ZGVzKFwiQXJyb3dSaWdodFwiKSkgbW92ZVggKz0gMTtcbiAgICAgICAgaWYgKGhlbGRLZXlzLmluY2x1ZGVzKFwiQXJyb3dVcFwiKSkgICAgbW92ZVkgLT0gMTtcbiAgICAgICAgaWYgKGhlbGRLZXlzLmluY2x1ZGVzKFwiQXJyb3dEb3duXCIpKSAgbW92ZVkgKz0gMTtcblxuICAgICAgICBsZXQgbW92ZU1hZyA9IE1hdGguc3FydChtb3ZlWCAqIG1vdmVYICsgbW92ZVkgKiBtb3ZlWSk7XG4gICAgICAgIGlmIChtb3ZlTWFnICE9IDApIHtcbiAgICAgICAgICAgIG1vdmVYIC89IG1vdmVNYWc7XG4gICAgICAgICAgICBtb3ZlWSAvPSBtb3ZlTWFnO1xuICAgICAgICB9XG5cbiAgICAgICAgUG9zaXRpb24ueFtlaWRdICs9IG1vdmVYICogU3BlZWQuc3BlZWRbZWlkXSAqIGZyYW1lVGltZTtcbiAgICAgICAgUG9zaXRpb24ueVtlaWRdICs9IG1vdmVZICogU3BlZWQuc3BlZWRbZWlkXSAqIGZyYW1lVGltZTtcbiAgICB9XG4gICAgcmV0dXJuIHdvcmxkO1xufSk7XG5cbmNvbnN0IHBpcGVsaW5lID0gcGlwZShzcHJpdGVQb3NpdGlvblN5c3RlbSwgc3ByaXRlRW50ZXJTeXN0ZW0sIHNwcml0ZUV4aXRTeXN0ZW0sIGxvY2FsUGxheWVyTW92ZW1lbnRTeXN0ZW0pO1xuXG4vLyBSdW4gc3lzdGVtcyBhdCBhIGZpeGVkIGZyYW1lLXJhdGVcbnNldEludGVydmFsKCgpID0+IHtcbiAgICBwaXBlbGluZSh3b3JsZCk7XG4gICAgcHJlc3NlZEtleXMgPSBbXTtcbn0sIGZyYW1lVGltZU1zKTtcblxuY29uc3QgcGxheWVySWQgPSBhZGRFbnRpdHkod29ybGQpO1xuYWRkQ29tcG9uZW50KHdvcmxkLCBTcHJpdGUsIHBsYXllcklkKTtcblNwcml0ZS5zcHJpdGVJbmRleFtwbGF5ZXJJZF0gPSAwO1xuYWRkQ29tcG9uZW50KHdvcmxkLCBQbGF5ZXIsIHBsYXllcklkKTtcbmFkZENvbXBvbmVudCh3b3JsZCwgTG9jYWxQbGF5ZXIsIHBsYXllcklkKTtcbmFkZENvbXBvbmVudCh3b3JsZCwgUG9zaXRpb24sIHBsYXllcklkKTtcbmFkZENvbXBvbmVudCh3b3JsZCwgU3BlZWQsIHBsYXllcklkKTtcblNwZWVkLnNwZWVkW3BsYXllcklkXSA9IDE1MDtcbiovIiwiaW1wb3J0ICogYXMgU29ja2V0SW8gZnJvbSBcInNvY2tldC5pby1jbGllbnRcIjtcbmltcG9ydCAqIGFzIFBpeGkgZnJvbSBcInBpeGkuanNcIjtcblxudHlwZSBUaWxlTWFwSW5mbyA9IHtcbiAgICB3aWR0aDogbnVtYmVyO1xuICAgIGhlaWdodDogbnVtYmVyO1xuICAgIGRlZmF1bHRUaWxlOiBudW1iZXI7XG59XG5cbnR5cGUgVGlsZU1hcERhdGEgPSB7XG4gICAgdGlsZXM6IG51bWJlcltdW107XG59XG5cbmV4cG9ydCBjbGFzcyBUaWxlTWFwIHtcbiAgICBwdWJsaWMgY29udGFpbmVyOiBQaXhpLkNvbnRhaW5lcjtcbiAgICBwcml2YXRlIHJlYWRvbmx5IHRpbGVTaXplOiBudW1iZXI7XG4gICAgcHJpdmF0ZSByZWFkb25seSB0aWxlU3ByaXRlczogUGl4aS5TcHJpdGVbXVtdO1xuICAgIHByaXZhdGUgdGlsZXM6IG51bWJlcltdW107XG4gICAgcHJpdmF0ZSB3aWR0aDogbnVtYmVyO1xuICAgIHByaXZhdGUgaGVpZ2h0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBpbml0aWFsaXplZDogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKHRpbGVTaXplOiBudW1iZXIgPSAxNikge1xuICAgICAgICB0aGlzLnRpbGVzID0gW107XG4gICAgICAgIHRoaXMudGlsZVNwcml0ZXMgPSBbXTtcbiAgICAgICAgdGhpcy53aWR0aCA9IDA7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gMDtcbiAgICAgICAgdGhpcy50aWxlU2l6ZSA9IHRpbGVTaXplO1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IG5ldyBQaXhpLkNvbnRhaW5lcigpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyTGlzdGVuZXJzKHNvY2tldDogU29ja2V0SW8uU29ja2V0KSB7XG4gICAgICAgIHNvY2tldC5vbihcIk1hcEluZm9cIiwgKG1hcEluZm86IFRpbGVNYXBJbmZvKSA9PiB7XG4gICAgICAgICAgICBpZiAobWFwSW5mbyA9PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IG1hcEluZm8ud2lkdGg7XG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IG1hcEluZm8uaGVpZ2h0O1xuXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHRoaXMudGlsZXNbeF0gPSBbXTtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbGVTcHJpdGVzW3hdID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLmhlaWdodDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGlsZXNbeF1beV0gPSBtYXBJbmZvLmRlZmF1bHRUaWxlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbGVTcHJpdGVzW3hdW3ldID0gbmV3IFBpeGkuU3ByaXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmFkZENoaWxkKHRoaXMudGlsZVNwcml0ZXNbeF1beV0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgc29ja2V0Lm9uKFwiTWFwVXBkYXRlXCIsIChtYXBEYXRhOiBUaWxlTWFwRGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudGlsZXMgPSBtYXBEYXRhLnRpbGVzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGVHZngodGV4dHVyZXM6IFBpeGkuVGV4dHVyZVtdKSB7XG4gICAgICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkgcmV0dXJuO1xuXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuaGVpZ2h0OyB5KyspIHtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFRpbGUgPSB0aGlzLnRpbGVTcHJpdGVzW3hdW3ldO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRUaWxlLnRleHR1cmUgPSB0ZXh0dXJlc1t0aGlzLnRpbGVzW3hdW3ldXTtcbiAgICAgICAgICAgICAgICBjdXJyZW50VGlsZS54ID0geCAqIHRoaXMudGlsZVNpemU7XG4gICAgICAgICAgICAgICAgY3VycmVudFRpbGUueSA9IHkgKiB0aGlzLnRpbGVTaXplO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRUaWxlLndpZHRoID0gdGhpcy50aWxlU2l6ZTtcbiAgICAgICAgICAgICAgICBjdXJyZW50VGlsZS5oZWlnaHQgPSB0aGlzLnRpbGVTaXplO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdGxvYWRlZDogZmFsc2UsXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuXHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubm1kID0gKG1vZHVsZSkgPT4ge1xuXHRtb2R1bGUucGF0aHMgPSBbXTtcblx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRyZXR1cm4gbW9kdWxlO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua183ZHJsX2NsaWVudFwiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtfN2RybF9jbGllbnRcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==