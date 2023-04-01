import {PolylineData} from "./PolylineData";
import {MarkerLayerRenderCluster} from "../marker/MarkerLayerRenderCluster";
import {MarkerLayerRenderHtml} from "../marker/MarkerLayerRenderHtml";
import {PolylineLayerRenderNormal} from "./PolylineLayerRenderNormal";
import {MapManager} from "../MapManager";

export class PolylineLayer {
    constructor(map,mapManager) {
        this.map = map;
        this.map_normal_data_objs = {};
        this.mapManager = mapManager;
        this.polylineLayerRenderNormal = new PolylineLayerRenderNormal(map,mapManager);
    }
    _addPolyline(data_type,data){
        if(!this.map_normal_data_objs[data_type]){
            this.map_normal_data_objs[data_type] = [];
        }

        if(data instanceof PolylineData){
            let renderType = data.getRenderType();
            if(renderType == PolylineData.render_normal){
                this.map_normal_data_objs[data_type].push(data);
            }
        }


    }
    addPolylines(data_type,list){
        list.forEach(item =>{
            this._addPolyline(data_type,item);
        })
    }
    setPolylines(data_type,list){
        this.map_normal_data_objs[data_type] = [];
        list.forEach(item =>{
            this._addPolyline(data_type,item);
        })
    }
    getAllData(){
        const mergeData = (data_type,data_arr) => {
            data_arr = data_arr.map(item =>{
                return {
                    ...item.data,
                    _data_type:data_type,
                    _data_index:item.data_index
                }
            })
            all_data= [...all_data,...data_arr];

        }
        let all_data = [];
        for(let data_type in this.map_normal_data_objs){
            let data_arr = this.map_normal_data_objs[data_type];
            mergeData(data_type,data_arr);
        }
        return all_data
    }
    render(is_zoom_end = false  ){
        if (this.mapManager instanceof MapManager) {
            this.mapManager.removeHover();
        }
        let normal_data_objs = [];
        Object.keys(this.map_normal_data_objs).forEach(key =>{
            normal_data_objs = [...normal_data_objs,...this.map_normal_data_objs[key]];
        });
        this.polylineLayerRenderNormal.render(normal_data_objs);



    }

}