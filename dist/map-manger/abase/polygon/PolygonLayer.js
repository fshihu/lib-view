import {PolygonData} from "./PolygonData";
import {MarkerLayerRenderCluster} from "../marker/MarkerLayerRenderCluster";
import {MarkerLayerRenderHtml} from "../marker/MarkerLayerRenderHtml";
import {PolygonLayerRenderNormal} from "./PolygonLayerRenderNormal";
import {MapManager} from "../MapManager";

export class PolygonLayer {
    constructor(map,mapManager) {
        this.map = map;
        this.map_normal_data_objs = {};
        this.mapManager = mapManager;
        this.polygonLayerRenderNormal = new PolygonLayerRenderNormal(map,mapManager);
    }
    _addPolygon(data_type,data){
        if(!this.map_normal_data_objs[data_type]){
            this.map_normal_data_objs[data_type] = [];
        }

        if(data instanceof PolygonData){
            let renderType = data.getRenderType();
            if(renderType == PolygonData.render_normal){
                this.map_normal_data_objs[data_type].push(data);
            }
        }


    }
    addPolygons(data_type,list){
        list.forEach(item =>{
            this._addPolygon(data_type,item);
        })
    }
    setPolygons(data_type,list){
        this.map_normal_data_objs[data_type] = [];
        list.forEach(item =>{
            this._addPolygon(data_type,item);
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
        this.polygonLayerRenderNormal.render(normal_data_objs);



    }

}