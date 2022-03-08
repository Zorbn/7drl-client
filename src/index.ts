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

const socket = SocketIo.io(/* The client is served by the server, so no domain needs to be specified */);
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
        if (spriteList[eid] == null) continue;

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