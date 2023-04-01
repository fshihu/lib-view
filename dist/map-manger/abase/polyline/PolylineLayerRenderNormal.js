import {MarkerData} from "../marker/MarkerData";
import {PolylineViewNormal} from "./PolylineViewNormal";
import {PolylineData} from "./PolylineData";
import {MarkerHoverLayer} from "../marker/MarkerHoverLayer";
import {MapManager} from "../MapManager";
import geoTransUtil1 from "../utils/geoTransUtil";
import {throttled1} from "../utils/throttled1";
import {MarkerLayerRenderHtml} from "../marker/MarkerLayerRenderHtml";
import {debounce} from "../utils/debounce";

export class PolylineLayerRenderNormal {
    constructor(map, mapManager) {
        this.map = map;
        this.mapManager = mapManager;
        this.markerLayerRenderHtml = new MarkerLayerRenderHtml(map,mapManager);
        this.data_objs = [];
        this.markers = [];
        this.enter_data = null;
        this.polyline_group_3d = [];
        if(this.mapManager.is_three_3d){
        }else{
            this.polyline_group = new AMap.OverlayGroup();
        }
        const render = debounce(() => {
            this.renderMarker(this.data_objs);
        },500);
        this.map.on('zoomend',()=>{
            render();
        });
        this.map.on('moveend',()=>{
            render();
        });
    }

    remove() {
        if(this.polyline_group){
            this.polyline_group.clearOverlays();
        }
        if(this.polyline_group_3d){
            this.polyline_group_3d.forEach(polyline =>{
                polyline.setMap(null);
            })
        }
        this.markerLayerRenderHtml.remove();
        this.markers = [];
        this.enter_data = null;
    }
    renderMarker(data_objs){
        this.markerLayerRenderHtml.remove();
        let markers = [];
        data_objs.forEach(item => {
            if (item instanceof PolylineData) {
                const {polylineViewNormal} = item;
                if (polylineViewNormal instanceof PolylineViewNormal) {
                    polylineViewNormal.setMapObj(this.map);
                    let options = polylineViewNormal.getFinalRenderOptions({data: item.data});
                    if (options.default_marker) {

                        let markerData = MarkerData.createMarker(options.default_marker.data, {
                            render_type: MarkerData.render_html,
                            markerViewHtml: options.default_marker,
                        });
                        item.marker_data_index = markerData.data_index;
                        markers.push(markerData);
                    }
                }
            }
        });
        this.markers = markers;
        this.markerLayerRenderHtml.render(markers);
        this.hideMarker();
    }
    hideMarker(){
        if(this.enter_data){
            this.markerLayerRenderHtml.setMarkerShow(false,this.enter_data.marker_data_index);
        }else{
            this.markerLayerRenderHtml.setMarkerShow(true);
        }
    }
    render(data_objs) {
        this.remove();

        const customRenderPolyline = this.mapManager.getCustomRenderPolyline();
        this.data_objs = data_objs;
        console.log('data_objs',data_objs);
        data_objs.forEach(item => {

            if (item instanceof PolylineData) {
                const {polylineViewNormal} = item;
                if (polylineViewNormal instanceof PolylineViewNormal) {

                    polylineViewNormal.setMapObj(this.map);

                    let options = polylineViewNormal.getFinalRenderOptions({data:item.data});

                    let polyline = null;
                    if(customRenderPolyline){
                        let path84 = item.data.path.map(item => geoTransUtil1.gcj02towgs84(item[0],item[1]));
                        polyline = customRenderPolyline({item,options,path84,map:this.map});
                    }else{
                        if(this.mapManager.is_three_3d){
                            let path84 = item.data.path.map(item => geoTransUtil1.gcj02towgs84(item[0],item[1]));
                            polyline = new this.mapManager.Xb3DMap.Polyline({
                                path: path84,
                                ...options,
                            });
                            polyline.setMap(this.map);
                        }else{
                            polyline = new AMap.Polyline({
                                path: item.data.path.map( item => this.mapManager.lngLatToMap(item)),
                                ...options,
                            });

                        }
                    }


                    const mouseoverPolyline = (e) => {
                        let {hover_marker,remove_default_marker,hover_options} = polylineViewNormal.onMouseover({e,data:item.data});
                        if(hover_options){
                            polyline.setOptions(hover_options);
                        }
                        if (this.mapManager instanceof MapManager) {
                            this.mapManager.mouseover(hover_marker,item.data_index);
                        }
                        if(remove_default_marker){
                            console.log('remove_default_marker');
                            this.enter_data = item;
                            this.hideMarker();
                        }
                    }
                    const onMouseenter = throttled1((e) => {
                        if(this.mapManager.markerHoverLayer.hasMarker()){//3d需要
                            return;
                        }
                        mouseoverPolyline(e);
                    },50)

                    polyline.on('mouseenter', (e) => {
                        onMouseenter();
                    });
                    polyline.on('mouseover', (e) => {
                        mouseoverPolyline(e);
                    });
                    polyline.on('mouseout', (e) => {
                        if (this.mapManager instanceof MapManager) {
                            this.mapManager.mouseout(item);
                        }
                        polyline.setOptions(options);

                        this.enter_data = null;
                        this.hideMarker();
                        polylineViewNormal.onMouseout({e,data:item.data});
                    });
                    polyline.on('click', (e) => {
                        this.mapManager.nearMarkerLayer.clear();
                        this.mapManager.markerHoverLayer.remove();
                        let infoWindow = polylineViewNormal.onClick({e,data:item.data});
                        if(this.mapManager instanceof MapManager) {
                            this.mapManager.click(infoWindow);
                        }
                    });
                    if(!this.mapManager.is_three_3d && !customRenderPolyline) {
                        this.polyline_group.addOverlay(polyline);
                    }else{
                        this.polyline_group_3d.push(polyline);
                    }
                } else {
                    console.warn(item, '需要设置渲染对象，通过listToNormalPolyline 参数')
                }

            }

        });
        // this.html_markers_group.setMap(this.map);
        if(!this.mapManager.is_three_3d && !customRenderPolyline) {
            this.map.add(this.polyline_group);
        }
        this.renderMarker(this.data_objs);
    }

}