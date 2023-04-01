import {MarkerData} from "../marker/MarkerData";
import {PolygonViewNormal} from "./PolygonViewNormal";
import {PolygonData} from "./PolygonData";
import {MarkerHoverLayer} from "../marker/MarkerHoverLayer";
import {MapManager} from "../MapManager";
import geoTransUtil1 from "../utils/geoTransUtil";
import {throttled1} from "../utils/throttled1";
import {MarkerLayerRenderHtml} from "../marker/MarkerLayerRenderHtml";
import {debounce} from "../utils/debounce";

export class PolygonLayerRenderNormal {
    constructor(map, mapManager) {
        this.map = map;
        this.mapManager = mapManager;
        this.markerLayerRenderHtml = new MarkerLayerRenderHtml(map,mapManager);
        this.data_objs = [];
        this.markers = [];
        this.enter_data = null;
        this.polygon_group_3d = [];
        if(this.mapManager.is_three_3d){
        }else{
            this.polygon_group = new AMap.OverlayGroup();
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
        if(this.polygon_group){
            this.polygon_group.clearOverlays();
        }
        if(this.polygon_group_3d){
            this.polygon_group_3d.forEach(polygon =>{
                polygon.setMap(null);
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
            if (item instanceof PolygonData) {
                const {polygonViewNormal} = item;
                if (polygonViewNormal instanceof PolygonViewNormal) {
                    polygonViewNormal.setMapObj(this.map);
                    let options = polygonViewNormal.getFinalRenderOptions({data: item.data});
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

        const customRenderPolygon = this.mapManager.getCustomRenderPolygon();
        this.data_objs = data_objs;
        data_objs.forEach(item => {

            if (item instanceof PolygonData) {
                const {polygonViewNormal} = item;
                if (polygonViewNormal instanceof PolygonViewNormal) {

                    polygonViewNormal.setMapObj(this.map);

                    let options = polygonViewNormal.getFinalRenderOptions({data:item.data});

                    let polygon = null;
                    if(customRenderPolygon){
                        let path84 = item.data.path.map(item => geoTransUtil1.gcj02towgs84(item[0],item[1]));
                        polygon = customRenderPolygon({item,options,path84,map:this.map});
                    }else{
                        if(this.mapManager.is_three_3d){
                            let path84 = item.data.path.map(item => geoTransUtil1.gcj02towgs84(item[0],item[1]));
                            polygon = new this.mapManager.Xb3DMap.Polygon({
                                path: path84,
                                ...options,
                            });
                            polygon.setMap(this.map);
                        }else{
                            polygon = new AMap.Polygon({
                                path: item.data.path.map( item => this.mapManager.lngLatToMap(item)),
                                ...options,
                            });

                        }
                    }


                    const mouseoverPolygon = (e) => {
                        let {hover_marker,remove_default_marker,hover_options} = polygonViewNormal.onMouseover({e,data:item.data});
                        if(hover_options){
                            polygon.setOptions(hover_options);
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
                        mouseoverPolygon(e);
                    },50)

                    polygon.on('mouseenter', (e) => {
                        onMouseenter();
                    });
                    polygon.on('mouseover', (e) => {
                        mouseoverPolygon(e);
                    });
                    polygon.on('mouseout', (e) => {
                        if (this.mapManager instanceof MapManager) {
                            this.mapManager.mouseout(item);
                        }
                        polygon.setOptions(options);

                        this.enter_data = null;
                        this.hideMarker();
                        polygonViewNormal.onMouseout({e,data:item.data});
                    });
                    polygon.on('click', (e) => {
                        this.mapManager.nearMarkerLayer.clear();
                        this.mapManager.markerHoverLayer.remove();
                        let infoWindow = polygonViewNormal.onClick({e,data:item.data});
                        if(this.mapManager instanceof MapManager) {
                            this.mapManager.click(infoWindow);
                        }
                    });
                    if(!this.mapManager.is_three_3d && !customRenderPolygon) {
                        this.polygon_group.addOverlay(polygon);
                    }else{
                        this.polygon_group_3d.push(polygon);
                    }
                } else {
                    console.warn(item, '需要设置渲染对象，通过listToNormalPolygon 参数')
                }

            }

        });
        // this.html_markers_group.setMap(this.map);
        if(!this.mapManager.is_three_3d && !customRenderPolygon) {
            this.map.add(this.polygon_group);
        }
        this.renderMarker(this.data_objs);
    }

}