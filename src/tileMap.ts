import * as SocketIo from "socket.io-client";
import * as Pixi from "pixi.js";

type TileMapInfo = {
    width: number;
    height: number;
    defaultTile: number;
}

type TileMapData = {
    tiles: number[][];
}

export class TileMap {
    public container: Pixi.Container;
    private readonly tileSize: number;
    private readonly tileSprites: Pixi.Sprite[][];
    private tiles: number[][];
    private width: number;
    private height: number;
    private initialized: boolean;

    constructor(tileSize: number = 16) {
        this.tiles = [];
        this.tileSprites = [];
        this.width = 0;
        this.height = 0;
        this.tileSize = tileSize;
        this.container = new Pixi.Container();
        this.initialized = false;
    }

    public registerListeners(socket: SocketIo.Socket) {
        socket.on("MapInfo", (mapInfo: TileMapInfo) => {
            if (mapInfo == undefined) return;

            this.width = mapInfo.width;
            this.height = mapInfo.height;

            for (let x = 0; x < this.width; x++) {
                this.tiles[x] = [];
                this.tileSprites[x] = [];
                for (let y = 0; y < this.height; y++) {
                    this.tiles[x][y] = mapInfo.defaultTile;
                    this.tileSprites[x][y] = new Pixi.Sprite();
                    this.container.addChild(this.tileSprites[x][y]);
                }

            }

            this.initialized = true;

            socket.on("MapUpdate", (mapData: TileMapData) => {
                this.tiles = mapData.tiles;
            });
        });
    }

    public updateGfx(textures: Pixi.Texture[]) {
        if (!this.initialized) return;

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