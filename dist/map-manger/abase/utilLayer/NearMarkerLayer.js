/**
 * 附近的marker，点击的时候计算，需要设置 setRenderOptions 渲染选项
 */
import {MarkerData} from "../marker/MarkerData";
import turf from "turf";
import {MarkerLayerRenderHtml} from "../marker/MarkerLayerRenderHtml";
import {MarkerViewHtml} from "../marker/MarkerViewHtml";
import geoTransUtil1 from "../utils/geoTransUtil";

class NearMarkerViewHtml extends MarkerViewHtml{
    constructor(renderOptionFn,options) {
        super();
        this.renderOptionFn = renderOptionFn;
        this.options = options;
    }

    getRenderOptions({el, data}) {
        let options = this.renderOptionFn({...this.options,el});
        return options;
    }
}
export class NearMarkerLayer {
    constructor(map,mapManager) {
        this.map = map;
        this.mapManager = mapManager;
        this.marker = null;
        this.component = null;
        this.max_dis = 50;
        this.renderOptionFn = null;
        this.markerLayerRenderHtml = new MarkerLayerRenderHtml(map,mapManager);
        this.map.on('click',()=>{
            this.markerLayerRenderHtml.remove();
        })
    }

    /**
     * 设置最大 ， 像素
     * @param dis
     */
    setMaxDis(dis){
       this.max_dis = dis;
    }

    /**
     * 设置渲染选项
     * @param renderOptionFn ({lng,lat,list})=>{ return  {{is_vue:boolean,size: number[], offset: number[], content: string, props: {}}} };
     * @return this
     */
    setRenderOptions(renderOptionFn){
        this.renderOptionFn = renderOptionFn;
        return this;
    }


    /**
     * 计算附近marker，系统内部调用
     * @return {boolean}
     */
    countNearMarker({lng,lat}){
        this.clear();

        const getPx = (lng,lat) => {
            let position = [lng,lat];
            if(!this.mapManager.is_three_3d){
                let lnglat = this.mapManager.lngLatToMap([lng,lat]);
                position = new AMap.LngLat(lnglat[0],lnglat[1]);
            }else{
                position = geoTransUtil1.gcj02towgs84(lng,lat);
            }
            if(this.mapManager.mapObj.lngLatToContainer){
                return  this.mapManager.mapObj.lngLatToContainer(position);
            }
            return  this.mapManager.mapObj.lnglatToContainer(position);
        }
        const twoPointDistance = function (p1,p2){
            let dep = Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
            return dep;
        }

        if(this.renderOptionFn){
            let list = [];
            let data_arr = this.mapManager.markerLayer.getAllData();
            let center_px = getPx(lng,lat);
            data_arr.forEach(data =>{
                if(data.lng > 0 && data.lat > 0){
                    let data_px = getPx(data.lng,data.lat);
                    let nearDis = twoPointDistance(center_px,data_px).toFixed();
                    if(nearDis < this.max_dis  ){
                        data._near_dis = nearDis;
                        list.push(data);

                    }

                }
            })

            if(list.length > 1){
                list = list.sort((v1,v2)=>{
                    return v1._near_dis - v2._near_dis;
                })
                let markerData = MarkerData.createMarker({lng,lat},{
                    render_type:MarkerData.render_html,
                    markerViewHtml:new NearMarkerViewHtml(this.renderOptionFn,{lng,lat,list}),
                })

                this.markerLayerRenderHtml.render([markerData],{no_trigger:true});
                return true;

            }
        }
        return false;
    }
    clear(){
        this.markerLayerRenderHtml.remove();
    }
}