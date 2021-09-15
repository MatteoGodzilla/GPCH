export interface Track{
    objs:TrackObj[],
    name?:string,
    color?:number
}

export interface TrackObj{
    type?:number,
    time?:number,
    length?:number,
    data?:any
}

export enum ObjTypes{
    BPM,
    MEASURE
}