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
/* harmony import */ var bitecs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bitecs */ "./node_modules/bitecs/dist/index.mjs");




const socket = socket_io_client__WEBPACK_IMPORTED_MODULE_0__.io( /* The client is served by the server, so no domain needs to be specified */);
const world = (0,bitecs__WEBPACK_IMPORTED_MODULE_3__.createWorld)();
let gameApp = new _gameApp__WEBPACK_IMPORTED_MODULE_2__.GameApp(0x00a1db);
gameApp.registerListeners();
const targetFps = 144;
const frameTime = 1 / targetFps;
const frameTimeMs = 1000 / targetFps;
let heldKeys = [];
let pressedKeys = [];
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
let spriteList = {};
let sprites = {
    0: "../assets/player.png",
};
pixi_js__WEBPACK_IMPORTED_MODULE_1__.settings.SCALE_MODE = pixi_js__WEBPACK_IMPORTED_MODULE_1__.SCALE_MODES.NEAREST;
const Vector2 = { x: bitecs__WEBPACK_IMPORTED_MODULE_3__.Types.f32, y: bitecs__WEBPACK_IMPORTED_MODULE_3__.Types.f32 };
const Sprite = (0,bitecs__WEBPACK_IMPORTED_MODULE_3__.defineComponent)({ spriteIndex: bitecs__WEBPACK_IMPORTED_MODULE_3__.Types.i32 });
const Position = (0,bitecs__WEBPACK_IMPORTED_MODULE_3__.defineComponent)(Vector2);
const Player = (0,bitecs__WEBPACK_IMPORTED_MODULE_3__.defineComponent)();
const LocalPlayer = (0,bitecs__WEBPACK_IMPORTED_MODULE_3__.defineComponent)();
const NetTracker = (0,bitecs__WEBPACK_IMPORTED_MODULE_3__.defineComponent)({ netId: bitecs__WEBPACK_IMPORTED_MODULE_3__.Types.i32 });
const Speed = (0,bitecs__WEBPACK_IMPORTED_MODULE_3__.defineComponent)({ speed: bitecs__WEBPACK_IMPORTED_MODULE_3__.Types.f32 });
const spriteQuery = (0,bitecs__WEBPACK_IMPORTED_MODULE_3__.defineQuery)([Sprite]);
const spritePositionQuery = (0,bitecs__WEBPACK_IMPORTED_MODULE_3__.defineQuery)([Sprite, Position]);
const spritePositionSystem = (0,bitecs__WEBPACK_IMPORTED_MODULE_3__.defineSystem)((world) => {
    const entities = spritePositionQuery(world);
    for (let i = 0; i < entities.length; i++) {
        const eid = entities[i];
        if (spriteList[eid] == null)
            continue;
        spriteList[eid].position.x = Position.x[eid];
        spriteList[eid].position.y = Position.y[eid];
    }
    return world;
});
const spriteExitQuery = (0,bitecs__WEBPACK_IMPORTED_MODULE_3__.exitQuery)(spriteQuery);
const spriteExitSystem = (0,bitecs__WEBPACK_IMPORTED_MODULE_3__.defineSystem)((world) => {
    const entities = spriteExitQuery(world);
    for (let i = 0; i < entities.length; i++) {
        const eid = entities[i];
        gameApp.stage.removeChild(spriteList[eid]);
        delete spriteList[eid];
    }
    return world;
});
const spriteEnterQuery = (0,bitecs__WEBPACK_IMPORTED_MODULE_3__.enterQuery)(spriteQuery);
const spriteEnterSystem = (0,bitecs__WEBPACK_IMPORTED_MODULE_3__.defineSystem)((world) => {
    const entities = spriteEnterQuery(world);
    for (let i = 0; i < entities.length; i++) {
        const eid = entities[i];
        let sprite = pixi_js__WEBPACK_IMPORTED_MODULE_1__.Sprite.from(sprites[Sprite.spriteIndex[eid]]);
        sprite.scale.x = spriteScale;
        sprite.scale.y = spriteScale;
        sprite.x = 5;
        sprite.y = 5;
        spriteList[eid] = sprite;
        gameApp.stage.addChild(sprite);
    }
    return world;
});
const localPlayerMovementQuery = (0,bitecs__WEBPACK_IMPORTED_MODULE_3__.defineQuery)([LocalPlayer, Position, Speed]);
const localPlayerMovementSystem = (0,bitecs__WEBPACK_IMPORTED_MODULE_3__.defineSystem)((world) => {
    const entities = localPlayerMovementQuery(world);
    for (let i = 0; i < entities.length; i++) {
        const eid = entities[i];
        let moveX = 0, moveY = 0;
        if (heldKeys.includes("ArrowLeft"))
            moveX -= 1;
        if (heldKeys.includes("ArrowRight"))
            moveX += 1;
        if (heldKeys.includes("ArrowUp"))
            moveY -= 1;
        if (heldKeys.includes("ArrowDown"))
            moveY += 1;
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
const pipeline = (0,bitecs__WEBPACK_IMPORTED_MODULE_3__.pipe)(spritePositionSystem, spriteEnterSystem, spriteExitSystem, localPlayerMovementSystem);
// Run systems at a fixed frame-rate
setInterval(() => {
    pipeline(world);
    pressedKeys = [];
}, frameTimeMs);
const playerId = (0,bitecs__WEBPACK_IMPORTED_MODULE_3__.addEntity)(world);
(0,bitecs__WEBPACK_IMPORTED_MODULE_3__.addComponent)(world, Sprite, playerId);
Sprite.spriteIndex[playerId] = 0;
(0,bitecs__WEBPACK_IMPORTED_MODULE_3__.addComponent)(world, Player, playerId);
(0,bitecs__WEBPACK_IMPORTED_MODULE_3__.addComponent)(world, LocalPlayer, playerId);
(0,bitecs__WEBPACK_IMPORTED_MODULE_3__.addComponent)(world, Position, playerId);
(0,bitecs__WEBPACK_IMPORTED_MODULE_3__.addComponent)(world, Speed, playerId);
Speed.speed[playerId] = 150;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LCJ3ZWJwYWNrOi8vN2RybC1jbGllbnQvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vN2RybC1jbGllbnQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vN2RybC1jbGllbnQvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly83ZHJsLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly83ZHJsLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vN2RybC1jbGllbnQvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly83ZHJsLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLzdkcmwtY2xpZW50L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vN2RybC1jbGllbnQvd2VicGFjay9ydW50aW1lL25vZGUgbW9kdWxlIGRlY29yYXRvciIsIndlYnBhY2s6Ly83ZHJsLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly83ZHJsLWNsaWVudC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovLzdkcmwtY2xpZW50L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly83ZHJsLWNsaWVudC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUGl4aSBmcm9tIFwicGl4aS5qc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVBcHAgZXh0ZW5kcyBQaXhpLkFwcGxpY2F0aW9uIHtcclxuICAgIGNvbnN0cnVjdG9yKGJhY2tncm91bmRDb2xvcjogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIoe1xyXG4gICAgICAgICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0LFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3JcclxuICAgICAgICB9KTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMudmlldyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyTGlzdGVuZXJzKCkge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZXNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgKiBhcyBTb2NrZXRJbyBmcm9tIFwic29ja2V0LmlvLWNsaWVudFwiO1xyXG5pbXBvcnQgKiBhcyBQaXhpIGZyb20gXCJwaXhpLmpzXCI7XHJcbmltcG9ydCB7IEdhbWVBcHAgfSBmcm9tIFwiLi9nYW1lQXBwXCI7XHJcbmltcG9ydCB7XHJcbiAgICBhZGRFbnRpdHksXHJcbiAgICBjcmVhdGVXb3JsZCxcclxuICAgIGRlZmluZUNvbXBvbmVudCxcclxuICAgIGRlZmluZVF1ZXJ5LFxyXG4gICAgZGVmaW5lU3lzdGVtLCBlbnRlclF1ZXJ5LFxyXG4gICAgZXhpdFF1ZXJ5LFxyXG4gICAgSVdvcmxkLFxyXG4gICAgcGlwZSxcclxuICAgIFR5cGVzLFxyXG4gICAgYWRkQ29tcG9uZW50LFxyXG59IGZyb20gXCJiaXRlY3NcIjtcclxuXHJcbmNvbnN0IHNvY2tldCA9IFNvY2tldElvLmlvKC8qIFRoZSBjbGllbnQgaXMgc2VydmVkIGJ5IHRoZSBzZXJ2ZXIsIHNvIG5vIGRvbWFpbiBuZWVkcyB0byBiZSBzcGVjaWZpZWQgKi8pO1xyXG5jb25zdCB3b3JsZCA9IGNyZWF0ZVdvcmxkKCk7XHJcbmxldCBnYW1lQXBwID0gbmV3IEdhbWVBcHAoMHgwMGExZGIpO1xyXG5nYW1lQXBwLnJlZ2lzdGVyTGlzdGVuZXJzKCk7XHJcblxyXG5jb25zdCB0YXJnZXRGcHMgPSAxNDQ7XHJcbmNvbnN0IGZyYW1lVGltZSA9IDEgLyB0YXJnZXRGcHM7XHJcbmNvbnN0IGZyYW1lVGltZU1zID0gMTAwMC8gdGFyZ2V0RnBzO1xyXG5cclxubGV0IGhlbGRLZXlzOiBzdHJpbmdbXSA9IFtdO1xyXG5sZXQgcHJlc3NlZEtleXM6IHN0cmluZ1tdID0gW107XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZXZlbnQpID0+IHtcclxuICAgIGlmICghaGVsZEtleXMuaW5jbHVkZXMoZXZlbnQua2V5KSkge1xyXG4gICAgICAgIGhlbGRLZXlzLnB1c2goZXZlbnQua2V5KTtcclxuICAgIH1cclxufSk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCBpbmRleCA9IGhlbGRLZXlzLmluZGV4T2YoZXZlbnQua2V5KTtcclxuICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgaGVsZEtleXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICBpZiAoIXByZXNzZWRLZXlzLmluY2x1ZGVzKGV2ZW50LmtleSkpIHtcclxuICAgICAgICBwcmVzc2VkS2V5cy5wdXNoKGV2ZW50LmtleSk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuY29uc3Qgc3ByaXRlU2NhbGUgPSA0O1xyXG5sZXQgc3ByaXRlTGlzdDogeyBbaWQ6IG51bWJlcl06IFBpeGkuU3ByaXRlIH0gPSB7fTtcclxubGV0IHNwcml0ZXM6IHsgW2luZGV4OiBudW1iZXJdOiBzdHJpbmcgfSA9IHtcclxuICAgIDA6IFwiLi4vYXNzZXRzL3BsYXllci5wbmdcIixcclxufTtcclxuUGl4aS5zZXR0aW5ncy5TQ0FMRV9NT0RFID0gUGl4aS5TQ0FMRV9NT0RFUy5ORUFSRVNUO1xyXG5cclxuY29uc3QgVmVjdG9yMiA9IHsgeDogVHlwZXMuZjMyLCB5OiBUeXBlcy5mMzIgfTtcclxuY29uc3QgU3ByaXRlID0gZGVmaW5lQ29tcG9uZW50KHsgc3ByaXRlSW5kZXg6IFR5cGVzLmkzMiB9KTtcclxuY29uc3QgUG9zaXRpb24gPSBkZWZpbmVDb21wb25lbnQoVmVjdG9yMik7XHJcbmNvbnN0IFBsYXllciA9IGRlZmluZUNvbXBvbmVudCgpO1xyXG5jb25zdCBMb2NhbFBsYXllciA9IGRlZmluZUNvbXBvbmVudCgpO1xyXG5jb25zdCBOZXRUcmFja2VyID0gZGVmaW5lQ29tcG9uZW50KHsgbmV0SWQ6IFR5cGVzLmkzMiB9KTtcclxuY29uc3QgU3BlZWQgPSBkZWZpbmVDb21wb25lbnQoeyBzcGVlZDogVHlwZXMuZjMyIH0pO1xyXG5cclxuY29uc3Qgc3ByaXRlUXVlcnkgPSBkZWZpbmVRdWVyeShbU3ByaXRlXSk7XHJcbmNvbnN0IHNwcml0ZVBvc2l0aW9uUXVlcnkgPSBkZWZpbmVRdWVyeShbU3ByaXRlLCBQb3NpdGlvbl0pO1xyXG5cclxuY29uc3Qgc3ByaXRlUG9zaXRpb25TeXN0ZW0gPSBkZWZpbmVTeXN0ZW0oKHdvcmxkOiBJV29ybGQpOiBJV29ybGQgPT4ge1xyXG4gICAgY29uc3QgZW50aXRpZXMgPSBzcHJpdGVQb3NpdGlvblF1ZXJ5KHdvcmxkKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBlaWQgPSBlbnRpdGllc1tpXTtcclxuICAgICAgICBpZiAoc3ByaXRlTGlzdFtlaWRdID09IG51bGwpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBzcHJpdGVMaXN0W2VpZF0ucG9zaXRpb24ueCA9IFBvc2l0aW9uLnhbZWlkXTtcclxuICAgICAgICBzcHJpdGVMaXN0W2VpZF0ucG9zaXRpb24ueSA9IFBvc2l0aW9uLnlbZWlkXTtcclxuICAgIH1cclxuICAgIHJldHVybiB3b3JsZDtcclxufSk7XHJcblxyXG5jb25zdCBzcHJpdGVFeGl0UXVlcnkgPSBleGl0UXVlcnkoc3ByaXRlUXVlcnkpO1xyXG5jb25zdCBzcHJpdGVFeGl0U3lzdGVtID0gZGVmaW5lU3lzdGVtKCh3b3JsZDogSVdvcmxkKTogSVdvcmxkID0+IHtcclxuICAgIGNvbnN0IGVudGl0aWVzID0gc3ByaXRlRXhpdFF1ZXJ5KHdvcmxkKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBlaWQgPSBlbnRpdGllc1tpXTtcclxuICAgICAgICBnYW1lQXBwLnN0YWdlLnJlbW92ZUNoaWxkKHNwcml0ZUxpc3RbZWlkXSk7XHJcbiAgICAgICAgZGVsZXRlIHNwcml0ZUxpc3RbZWlkXTtcclxuICAgIH1cclxuICAgIHJldHVybiB3b3JsZDtcclxufSk7XHJcblxyXG5jb25zdCBzcHJpdGVFbnRlclF1ZXJ5ID0gZW50ZXJRdWVyeShzcHJpdGVRdWVyeSk7XHJcbmNvbnN0IHNwcml0ZUVudGVyU3lzdGVtID0gZGVmaW5lU3lzdGVtKCh3b3JsZDogSVdvcmxkKTogSVdvcmxkID0+IHtcclxuICAgIGNvbnN0IGVudGl0aWVzID0gc3ByaXRlRW50ZXJRdWVyeSh3b3JsZCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgZWlkID0gZW50aXRpZXNbaV07XHJcblxyXG4gICAgICAgIGxldCBzcHJpdGUgPSBQaXhpLlNwcml0ZS5mcm9tKHNwcml0ZXNbU3ByaXRlLnNwcml0ZUluZGV4W2VpZF1dKTtcclxuICAgICAgICBzcHJpdGUuc2NhbGUueCA9IHNwcml0ZVNjYWxlO1xyXG4gICAgICAgIHNwcml0ZS5zY2FsZS55ID0gc3ByaXRlU2NhbGU7XHJcbiAgICAgICAgc3ByaXRlLnggPSA1O1xyXG4gICAgICAgIHNwcml0ZS55ID0gNTtcclxuICAgICAgICBzcHJpdGVMaXN0W2VpZF0gPSBzcHJpdGU7XHJcblxyXG4gICAgICAgIGdhbWVBcHAuc3RhZ2UuYWRkQ2hpbGQoc3ByaXRlKTtcclxuICAgIH1cclxuICAgIHJldHVybiB3b3JsZDtcclxufSk7XHJcblxyXG5jb25zdCBsb2NhbFBsYXllck1vdmVtZW50UXVlcnkgPSBkZWZpbmVRdWVyeShbTG9jYWxQbGF5ZXIsIFBvc2l0aW9uLCBTcGVlZF0pO1xyXG5jb25zdCBsb2NhbFBsYXllck1vdmVtZW50U3lzdGVtID0gZGVmaW5lU3lzdGVtKCh3b3JsZDogSVdvcmxkKTogSVdvcmxkID0+IHtcclxuICAgIGNvbnN0IGVudGl0aWVzID0gbG9jYWxQbGF5ZXJNb3ZlbWVudFF1ZXJ5KHdvcmxkKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBlaWQgPSBlbnRpdGllc1tpXTtcclxuXHJcbiAgICAgICAgbGV0IG1vdmVYID0gMCwgbW92ZVkgPSAwO1xyXG5cclxuICAgICAgICBpZiAoaGVsZEtleXMuaW5jbHVkZXMoXCJBcnJvd0xlZnRcIikpICBtb3ZlWCAtPSAxO1xyXG4gICAgICAgIGlmIChoZWxkS2V5cy5pbmNsdWRlcyhcIkFycm93UmlnaHRcIikpIG1vdmVYICs9IDE7XHJcbiAgICAgICAgaWYgKGhlbGRLZXlzLmluY2x1ZGVzKFwiQXJyb3dVcFwiKSkgICAgbW92ZVkgLT0gMTtcclxuICAgICAgICBpZiAoaGVsZEtleXMuaW5jbHVkZXMoXCJBcnJvd0Rvd25cIikpICBtb3ZlWSArPSAxO1xyXG5cclxuICAgICAgICBsZXQgbW92ZU1hZyA9IE1hdGguc3FydChtb3ZlWCAqIG1vdmVYICsgbW92ZVkgKiBtb3ZlWSk7XHJcbiAgICAgICAgaWYgKG1vdmVNYWcgIT0gMCkge1xyXG4gICAgICAgICAgICBtb3ZlWCAvPSBtb3ZlTWFnO1xyXG4gICAgICAgICAgICBtb3ZlWSAvPSBtb3ZlTWFnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgUG9zaXRpb24ueFtlaWRdICs9IG1vdmVYICogU3BlZWQuc3BlZWRbZWlkXSAqIGZyYW1lVGltZTtcclxuICAgICAgICBQb3NpdGlvbi55W2VpZF0gKz0gbW92ZVkgKiBTcGVlZC5zcGVlZFtlaWRdICogZnJhbWVUaW1lO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHdvcmxkO1xyXG59KTtcclxuXHJcbmNvbnN0IHBpcGVsaW5lID0gcGlwZShzcHJpdGVQb3NpdGlvblN5c3RlbSwgc3ByaXRlRW50ZXJTeXN0ZW0sIHNwcml0ZUV4aXRTeXN0ZW0sIGxvY2FsUGxheWVyTW92ZW1lbnRTeXN0ZW0pO1xyXG5cclxuLy8gUnVuIHN5c3RlbXMgYXQgYSBmaXhlZCBmcmFtZS1yYXRlXHJcbnNldEludGVydmFsKCgpID0+IHtcclxuICAgIHBpcGVsaW5lKHdvcmxkKTtcclxuICAgIHByZXNzZWRLZXlzID0gW107XHJcbn0sIGZyYW1lVGltZU1zKTtcclxuXHJcbmNvbnN0IHBsYXllcklkID0gYWRkRW50aXR5KHdvcmxkKTtcclxuYWRkQ29tcG9uZW50KHdvcmxkLCBTcHJpdGUsIHBsYXllcklkKTtcclxuU3ByaXRlLnNwcml0ZUluZGV4W3BsYXllcklkXSA9IDA7XHJcbmFkZENvbXBvbmVudCh3b3JsZCwgUGxheWVyLCBwbGF5ZXJJZCk7XHJcbmFkZENvbXBvbmVudCh3b3JsZCwgTG9jYWxQbGF5ZXIsIHBsYXllcklkKTtcclxuYWRkQ29tcG9uZW50KHdvcmxkLCBQb3NpdGlvbiwgcGxheWVySWQpO1xyXG5hZGRDb21wb25lbnQod29ybGQsIFNwZWVkLCBwbGF5ZXJJZCk7XHJcblNwZWVkLnNwZWVkW3BsYXllcklkXSA9IDE1MDsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5tZCA9IChtb2R1bGUpID0+IHtcblx0bW9kdWxlLnBhdGhzID0gW107XG5cdGlmICghbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcblx0cmV0dXJuIG1vZHVsZTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtfN2RybF9jbGllbnRcIl0gPSBzZWxmW1wid2VicGFja0NodW5rXzdkcmxfY2xpZW50XCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=