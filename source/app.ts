import * as PIXI from "pixi.js";
import TimeManager from "./TimeManager";
import TrackManager from "./TrackEditor";
import TrackRenderer from "./TrackRenderer";
import UI from "./ui";

const canvas = <HTMLCanvasElement>document.querySelector("#view");

const app = new PIXI.Application({view:canvas,resizeTo:window,backgroundColor:0x333333});
const timeManager = new TimeManager()
const trackManager = new TrackManager(timeManager);
const trackRenderer = new TrackRenderer(app,trackManager,timeManager);
const ui = new UI(timeManager);

app.ticker.add(delta => {
    timeManager.update(delta);
    trackRenderer.update();
    ui.update();
})