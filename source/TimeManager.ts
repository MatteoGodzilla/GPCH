export default class TimeManager{
    time = 0; //beats
    timeVisible = 16; //beats
    playing = false;

    readonly ZOOM_FACTOR = 0.5

    constructor(){
        window.addEventListener("wheel",(ev) => this.wheel(ev));
        window.addEventListener("keydown",(ev)=> this.kd(ev));
    }

    update(delta:number){
        if(this.playing){
            //convert delta to beats
            this.time += delta * 0.01;
        }
    }

    wheel(ev:WheelEvent){
        //console.log(ev);
        if(ev.shiftKey){
            if(ev.deltaY > 0){
                this.timeVisible += this.ZOOM_FACTOR;
            } else if(ev.deltaY < 0){
                this.timeVisible -= this.ZOOM_FACTOR;
            }
        } else {
            if(ev.deltaY > 0){
                this.time += this.timeVisible/16; //movement is rounded to nearest beat
            } else if(ev.deltaY < 0){
                this.time -= this.timeVisible/16; //movement is rounded to nearest beat
            }
        }
        //clamp
        this.time = Math.max(0,this.time)
    }

    kd(ev:KeyboardEvent){
        //console.log(ev);
        switch(ev.code){
            case "Space": this.playing = !this.playing; break;
            case "Minus": this.timeVisible -= this.ZOOM_FACTOR; break;
            case "Equal": this.timeVisible += this.ZOOM_FACTOR; break;
        }
        this.timeVisible = Math.max(4,this.timeVisible)
    }
}