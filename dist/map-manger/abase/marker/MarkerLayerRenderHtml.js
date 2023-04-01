import {MarkerViewHtml} from "./MarkerViewHtml";
import {MarkerData} from "./MarkerData";
import {MapManager} from "../MapManager";
import geoTransUtil1 from "../utils/geoTransUtil";


export class MarkerLayerRenderHtml {

    constructor(map, mapManager) {
        this.map = map;
        this.mapManager = mapManager;
        this.html_markers_group_3d = [];
        if(this.mapManager.is_three_3d){
        }else{
            this.html_markers_group = new AMap.OverlayGroup();
        }
        this.components = [];
        this.html_data_objs_map = {};
        this.data_index_map = {};
        this.map_el = {};
    }

    remove() {
        this.html_data_objs_map = {};
        this.data_index_map = {};
        this.map_el = {};
        if(this.html_markers_group){
            this.html_markers_group.clearOverlays();
        }
        if(this.html_markers_group_3d){
            this.html_markers_group_3d.forEach(marker =>{
                marker.remove();
            });
        }

        this.html_markers_group_3d = [];
        this.components.forEach(component => {
            component.$destroy();
        })
        this.components = [];
    }

    triggerMarker(key,type='click',trigger_options){
        let ok = false;
        for(let key in this.html_data_objs_map){
            let item = this.html_data_objs_map[key];

            if(item.data.lng <= 0 || item.data.lat  <= 0 ){
                continue;
            }
            if(item.data.key == key) {
                ok = true;
                this.triggerMarkerItem(type,item,trigger_options);
            }
        }
        return ok;
    }
    triggerMarkerDataIndex(data_index,type='click',trigger_options){
        let ok = false;
        for(let key in this.data_index_map){
            let item = this.data_index_map[key];
            if(item.data.lng <= 0 || item.data.lat  <= 0 ){
                continue ;
            }
            if(data_index == item.data_index){
                ok  = true;
                this.triggerMarkerItem(type,item,trigger_options)
            }
        }
        return ok;
    }

    triggerMarkerItem(type,item,trigger_options ){
        if (item instanceof MarkerData) {
            const {markerViewHtml} = item;
            if (markerViewHtml instanceof MarkerViewHtml) {
                this.triggerItem(markerViewHtml, {el: this.map_el[item.data_index], markerData: item}, type,trigger_options);
            }
        }
    }
    triggerItem(markerViewHtml,{e,el,markerData},type,trigger_options = null){
        if (markerViewHtml instanceof MarkerViewHtml) {
            if (type == 'click') {
                if((!trigger_options || !trigger_options.is_near) && this.mapManager.nearMarkerLayer.countNearMarker(markerData.data)){
                    return;
                }
                this.mapManager.nearMarkerLayer.clear();
                let infoWindow = markerViewHtml.onClick({e, el, data:markerData.data});
                if (this.mapManager instanceof MapManager) {
                    this.mapManager.click(infoWindow);
                }
            }
            if (type == 'mouseout') {
                if (this.mapManager instanceof MapManager) {
                    this.mapManager.mouseout(markerData);
                }

                markerViewHtml.onMouseout({e, el, data:markerData.data});
            }
            if (type == 'mouseover') {
                let hover_marker = markerViewHtml.onMouseover({e, el, data:markerData.data});
                if (this.mapManager instanceof MapManager) {
                    let originalMarkerOption = markerViewHtml.getFinalRenderOptions({ el, data:markerData.data});
                    this.mapManager.mouseover(hover_marker,markerData.data_index,originalMarkerOption);
                }
            }
        }
    }
    setMarkerShow(show,data_index){
        if(this.html_markers_group_3d){
            this.html_markers_group_3d.forEach(marker =>{
                marker.show();
                if(marker._data_index == data_index){
                    if(show){
                        marker.show();
                    }else{
                        marker.hide();
                    }
                }
            })
        }
        if(this.html_markers_group){
            this.html_markers_group.getOverlays().forEach(marker =>{
                marker.show();
                if(marker._data_index == data_index){
                    if(show){
                        marker.show();
                    }else{
                        marker.hide();
                    }
                }
            })
        }
    }
    render(html_data_objs, hover_marker_options) {
        this.remove();
        hover_marker_options = hover_marker_options || {};

        let customRenderHtmlMarker = this.mapManager.getCustomRenderHtmlMarker();


        html_data_objs.forEach(item => {

            if (item instanceof MarkerData) {
                this.html_data_objs_map[item.data.key] = item;
                this.data_index_map[item.data_index] = item;
                if(!item.data.lng || !item.data.lat){
                    return;
                }
                const {markerViewHtml} = item;
                if (markerViewHtml instanceof MarkerViewHtml) {
                    if (this.mapManager instanceof MapManager) {

                        markerViewHtml.setMapObj(this.map);
                        let el = document.createElement('div');
                        let options = markerViewHtml.getFinalRenderOptions({el,data:item.data});
                        let is_vue = options.is_vue;
                        let component = null;
                        let el_cont = document.createElement('div');
                        component = this.mapManager.getRenderHtml(el_cont, options, is_vue);

                        el.style.width = '0px';
                        el.style.height = '0px';
                        el_cont.className = 'base_marker_warp';
                        el_cont.style.position = 'relative';

                        el.appendChild(el_cont);



                        this.map_el[item.data_index] = el;

                        el.className = 'base_el_marker_warp';
                        el.style.pointerEvents = 'auto';
                        el.style.cursor = 'pointer';
                        if(hover_marker_options.no_trigger){
                            el.style.cursor = 'default';
                        }


                        if (hover_marker_options.is_hover) {
                          //  el.style.pointerEvents = 'none';
                        }

                        let {marker,marker_el} = this.renderMarker(el,item,options);

                        if (component) {
                            this.components.push(component);
                        }

                        if (hover_marker_options.is_hover && !this.mapManager.is_three_3d) {
                        //    marker.getContentDom().classList.add('point-none')
                        }

                        marker_el.on('mouseover', (e) => {

                            if(hover_marker_options.no_trigger){
                                return;
                            }
                            if(hover_marker_options.onEnter){//进入移上去的marker
                                hover_marker_options.onEnter();
                                return;

                            }else{
                            }
                            this.triggerItem(markerViewHtml,{e, el, markerData: item},'mouseover');

                        });
                        marker_el.on('mouseout', (e) => {
                            if(hover_marker_options.no_trigger){
                                return;
                            }
                            if(hover_marker_options.onOut){//进入移上去的marker
                                hover_marker_options.onOut();
                                return;

                            }else{
                            }

                            this.triggerItem(markerViewHtml,{e, el, markerData: item},'mouseout');
                        });
                        marker_el.on('click', (e) => {
                            if(hover_marker_options.no_trigger){
                                return;
                            }
                            if(hover_marker_options.is_click){
                                hover_marker_options.onClick();
                                return;
                            }
                            this.triggerItem(markerViewHtml,{e, el, markerData: item},'click');
                        });
                        if(this.mapManager.is_three_3d || customRenderHtmlMarker){
                            this.html_markers_group_3d.push(marker);

                        }else{
                            this.html_markers_group.addOverlay(marker);
                        }
                    }


                } else {
                    console.warn(item, '需要设置渲染对象，通过listToHtmlMarker 参数')
                }

            }

        });
        // this.html_markers_group.setMap(this.map);
        if(this.mapManager.is_three_3d || customRenderHtmlMarker) {
        }else{
            this.map.add(this.html_markers_group);
        }

    }
    renderMarker(el,item,options){
        let marker = null,marker_el = null;

        let customRenderHtmlMarker = this.mapManager.getCustomRenderHtmlMarker();
        if(customRenderHtmlMarker){
            let {marker,marker_el} = customRenderHtmlMarker({el,item,options,map:this.map});
            return {
                marker,
                marker_el,
            }

        }
        if(this.mapManager.is_three_3d){
            marker = new this.mapManager.Xb3DMap.Marker({
                position: geoTransUtil1.gcj02towgs84(item.data.lng, item.data.lat),
                // offset: new AMap.Pixel(-options.offset[0], -options.offset[1]),
                content: el,
            });
            let el_cont = el.querySelector('.base_marker_warp');
            el_cont.style.position = 'absolute';
            el_cont.style.left = -options.offset[0]+'px';
            el_cont.style.top = -options.offset[1]+'px';
            //  el.style.top = (-options.offset[1]+(options.size[1]/2))+'px';
            marker.setMap(this.map);
            marker._data_index = item.data_index ;
            marker_el = el;
            marker_el.on = el.addEventListener;
        }else{
            marker = new AMap.Marker({
                position: this.mapManager.lngLatToMap([item.data.lng, item.data.lat]),
                offset: new AMap.Pixel(-options.offset[0], -options.offset[1]),
                content: el,
            });
            marker._data_index = item.data_index ;
            marker_el = marker;
        }
        return {
            marker,
            marker_el
        }
    }

}