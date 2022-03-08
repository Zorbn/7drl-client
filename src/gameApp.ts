import * as Pixi from "pixi.js";

export class GameApp extends Pixi.Application {
    constructor(backgroundColor: number) {
        super({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor
        });
        document.body.appendChild(this.view);
    }

    public registerListeners() {
        window.addEventListener("resize", () => {
            this.renderer.resize(window.innerWidth, window.innerHeight);
        });
    }
}