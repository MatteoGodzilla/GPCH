import * as PIXI from "pixi.js";
import TrackManager from "./TrackEditor";
import TimeManager from "./TimeManager";
import { ObjTypes, TrackObj } from "./types";

export default class TrackRenderer{
    //references to other scripts
    trackMan:TrackManager;
    app:PIXI.Application;
    graphics:PIXI.Graphics;
    container:PIXI.Container;
    timeManager:TimeManager;
    
    //internal data
    textObjs:PIXI.Text[] = [];
    usedTextOBJS = 0;
    tracksVisible = 10;
    trackHeightOffset = 0;
    readonly TEXT_NUM = 50;
    readonly TEXT_HEIGHT = 15;

    constructor(app:PIXI.Application, trackman:TrackManager, timeManager:TimeManager){
        this.app = app;
        this.trackMan = trackman;
        this.timeManager = timeManager;

        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);
        this.graphics = new PIXI.Graphics();
        this.container.addChild(this.graphics);

        for(let i = 0; i < this.TEXT_NUM; i++){
            
        }
    }

    update(){
        const width = this.app.view.width
        const height = this.app.view.height

        //margins (all in pixels)
        const marginleft = 220;
        const marginright = 20;
        const marginup = 20;
        const margindown = 20;

        const visibleWidth = width - (marginleft + marginright);
        const visibleHeight = height - (marginup + margindown);

        const timeIndicator = 1/8
        const textRows = 3;
        const trackHeight = (visibleHeight - this.TEXT_HEIGHT * textRows) / (this.tracksVisible + 1);

        this.graphics.clear();
        this.resetText();

        let tracks = this.trackMan.tracks
        let timeMan = this.timeManager
        let leftTime = timeMan.time - timeMan.timeVisible * timeIndicator
        let rightTime = timeMan.time + timeMan.timeVisible * (1 - timeIndicator)

        let timeToX = (time:number) => {
            let percentage = (time - timeMan.time) / (timeMan.timeVisible);
            return marginleft + visibleWidth * timeIndicator + percentage * visibleWidth;
        }

        //measure indicators
        let start = Math.floor(leftTime)
        let end = Math.ceil(rightTime)

        for(let t = start; t < end; t++){
            let lastMeasureOBJ:TrackObj = {time:0,data:4}; //suppose it's 4/4 by default

            for(let bpm of this.trackMan.bpm.objs){
                if(bpm.type == ObjTypes.MEASURE){
                    if(bpm.time <= t) lastMeasureOBJ = bpm;
                    else if(bpm.time > t) break;
                }
            }

            //i is the time in beats
            if(t>= 0 && leftTime < t && t < rightTime){
                let x = timeToX(t);
                let text = this.getText();

                text.text = t.toString();
                text.position.set(x + 3,marginup); //offset text a bit
                this.usedTextOBJS++;

                if(((t - lastMeasureOBJ.time) % lastMeasureOBJ.data) == 0){
                    //major
                    this.graphics.lineStyle({width:4,color:0xffffff});
                } else {
                    //minor
                    this.graphics.lineStyle({width:1,color:0xffffff});
                }

                this.graphics.moveTo(x,marginup)
                this.graphics.lineTo(x,marginup + visibleHeight)
            }
        }

        //bpm indicators
        for(let bpm of this.trackMan.bpm.objs){
            if(leftTime < bpm.time && bpm.time < rightTime){
                let x = timeToX(bpm.time) + 3;
                let text = this.getText();
                let y = marginup + this.TEXT_HEIGHT * (bpm.type == ObjTypes.BPM ? 1:2)
                text.position.set(x,y);
                text.text = bpm.data;
            }
        }

        //notes
        for(let i = 0; i < this.tracksVisible && i < tracks.length; i++){
            let trackInfo = tracks[i + this.trackHeightOffset];
        
            let baseY = marginup + i * trackHeight + this.TEXT_HEIGHT * textRows
            let baseX = marginleft;

            this.graphics.beginFill(trackInfo.color || 0,0.5)
            this.graphics.lineStyle({width:0})
            this.graphics.drawRect(baseX, baseY, visibleWidth, trackHeight);
            this.graphics.endFill();

            for(let obj of trackInfo.objs){
                if(leftTime < obj.time && obj.time < rightTime){
                    let y = baseY + trackHeight / 2
                    let x = timeToX(obj.time);
    
                    let rectheight = trackHeight * 3 / 4;
                    let rectWidth = rectheight / 3;

                    this.graphics.beginFill(0xffffff,1.0);
                    this.graphics.lineStyle({width:3,color:0x000000})
                    this.graphics.drawRect(x - rectWidth / 2,y - rectheight /2,rectWidth,rectheight)
                    this.graphics.endFill()
                }
            }
        }
        //white border
        this.graphics.lineStyle({width:2,color:0xffffff});
        this.graphics.drawRect(marginleft, marginup, visibleWidth, visibleHeight);

        //time bar
        this.graphics.lineStyle({width:5,color:0x00ff00})
        this.graphics.moveTo(marginleft + visibleWidth * timeIndicator,marginup)
        this.graphics.lineTo(marginleft + visibleWidth * timeIndicator,marginup + visibleHeight)
    }

    getText(){
        let text:PIXI.Text;
        if(this.usedTextOBJS >= this.textObjs.length){
            //create
            text = new PIXI.Text("",{
                fill:"#ffffff",
                fontSize:this.TEXT_HEIGHT
            });
            this.textObjs.push(text);
            this.container.addChild(text);
        } else {
            text = this.textObjs[this.usedTextOBJS]
        }
        this.usedTextOBJS++;
        return text;
    }

    resetText(){
        this.usedTextOBJS = 0; // basically reset
        this.textObjs.forEach(text => text.text = "")
    }
}