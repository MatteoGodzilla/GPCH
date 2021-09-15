import TimeManager from "./TimeManager";
import { Track,ObjTypes } from "./types";

export default class TrackManager{
    timeManager:TimeManager;
    tracks:Track[] = [];
    bpm:Track

    constructor(timeManager:TimeManager){
        //references to other objects
        this.timeManager = timeManager

        this.bpm = {objs:[
            {type:ObjTypes.BPM,time:0,data:120},
            {type:ObjTypes.MEASURE,time:0,data:4},
            {type:ObjTypes.MEASURE,time:4,data:3},
            {type:ObjTypes.BPM,time:4,data:155},
            {type:ObjTypes.MEASURE,time:7,data:4},
        ]}

        let testTrack:Track = {objs:[],color:0xff00ff};
        let testTrack2:Track = {objs:[],color:0xff0000};
        let testTrack3:Track = {objs:[],color:0x0000ff};

        for(let i = 0; i <= 32; i += 4){
            testTrack.objs.push({time:i,type:0});
        }
        
        for(let i = 2; i <= 32; i += 2){
            testTrack2.objs.push({time:i,type:0})
        }

        testTrack3.objs.push({time:0,type:0})
        testTrack3.objs.push({time:4,type:0})
        testTrack3.objs.push({time:7,type:0})
        testTrack3.objs.push({time:11,type:0})

        this.tracks.push(testTrack);
        this.tracks.push(testTrack2);
        this.tracks.push(testTrack3);
    }
}