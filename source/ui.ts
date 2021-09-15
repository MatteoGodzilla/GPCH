import TimeManager from "./TimeManager";

export default class UI{
    //reference to other objs
    timeManager:TimeManager;
    
    constructor(timeManager:TimeManager){
        //set references
        this.timeManager = timeManager;
        
        //time indicator
        let time = <HTMLInputElement>document.querySelector("#timeInput");
        time.addEventListener("change",() => {
            timeManager.time = Number(time.value);
        })

        //
        let timeVisible = <HTMLInputElement>document.querySelector("#timeVisibleInput");
        timeVisible.addEventListener("change",() => {
            timeManager.timeVisible = Number(timeVisible.value);
        })
    }

    update(){
        let time = <HTMLInputElement>document.querySelector("#timeInput");
        this.sync(time,this.timeManager.time.toString());
        
        let timeVisible = <HTMLInputElement>document.querySelector("#timeVisibleInput");
        this.sync(timeVisible,this.timeManager.timeVisible.toString());
    }

    sync(elm:HTMLInputElement,value:string){
        if(document.activeElement != elm && elm.value != value) elm.value = value;
    }
}