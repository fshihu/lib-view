import {MarkerViewHtml} from "./MarkerViewHtml";
import {MarkerLayerRenderHtml} from "./MarkerLayerRenderHtml";
import {MarkerData} from "./MarkerData";
import {debounce} from "../utils/debounce";

class ClickMarkerViewHtml extends MarkerViewHtml{
    constructor(size,offset) {
        super();
        this.size = size;
        this.offset = offset;
    }
    getRenderOptions({el, data}) {
        return {
            size: this.size, // 大小
            offset: this.offset, //偏移，相对左上角
            content:'<div class="base_el_marker_hover_event_el" style="width: 100%;height: 100%;;"></div>',//html或vue组件
            props:{},//vue 组件时的prop
        };
    }
}

export class MarkerHoverLayer {
    constructor(map,mapManager) {
        this.map = map;
        this.mapManager = mapManager;
        this.markerLayerRenderHtml = new MarkerLayerRenderHtml(map,mapManager)
        this.clickMarkerLayerRenderHtml = new MarkerLayerRenderHtml(map,mapManager)
        this.data_index = '';
        this.hover_time = 0;
        this.remove_time = 0;
        this.enter_data = false;
        this.debounceRemove = debounce(()=>{
            this.realRemove();
        },300);
    }

    hasMarker(){
        return !!this.data_index;
    }

    render(markerViewHtml,data_index,originalMarkerOption){
        this.hover_time = new Date().getTime();
        this.enter_data = false;
        if(this.data_index == data_index){
            return;
        }
        this.remove(this.data_index);
        this.data_index = data_index;
       if(markerViewHtml instanceof MarkerViewHtml){
           let markerData = MarkerData.createMarker(markerViewHtml.data,{
               render_type:MarkerData.render_html,
               markerViewHtml:markerViewHtml,
           })

            this.markerLayerRenderHtml.render([markerData],{
                is_hover:true,
                onEnter:()=>{
                    this.enter_data = true;
                },
                onOut:()=>{
                    this.enter_data = false;
                    this.remove(this.data_index)
                },
            });
           if(!originalMarkerOption){
               return;
           }
           let clickMarkerData = MarkerData.createMarker(markerViewHtml.data,{
               render_type:MarkerData.render_html,
               markerViewHtml:new ClickMarkerViewHtml(originalMarkerOption.size,originalMarkerOption.offset),
           })

           this.clickMarkerLayerRenderHtml.render([clickMarkerData],{
                is_click:true,
               onEnter:()=>{
                   this.enter_data = true;
               },
               onOut:()=>{
                   this.enter_data = false;
                   this.remove(this.data_index)
               },
                onClick:()=>{
                    this.mapManager.markerLayer.triggerMarkerDataIndex(this.data_index,'click');
                    console.log('click');
                },
            });

        }else{
            console.log(markerViewHtml,'需要继承 MarkerViewHtml')
        }
    }
    realRemove(){
        if(this.enter_data){
            return;
        }
        if(!this.mapManager.mouseoutRemoveHover){
            return;
        }
        if(this.remove_time > this.hover_time){
            this.data_index = '';
            this.markerLayerRenderHtml.remove();
            this.clickMarkerLayerRenderHtml.remove();
        }
    }
    remove(data_index){
        this.remove_time = new Date().getTime();
        this.debounceRemove(data_index);
    }
}