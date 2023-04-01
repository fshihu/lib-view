import {MarkerHoverLayer} from "./marker/MarkerHoverLayer";
import {MarkerLayer} from "./marker/MarkerLayer";
import {PolygonLayer} from "./polygon/PolygonLayer";
import {PolylineLayer} from "./polyline/PolylineLayer";
import {InfoWindowLayer} from "./infoWindow/InfoWindowLayer";
import Vue from "vue";
import {CircleChooseLayer} from "./utilLayer/CircleChooseLayer";
import {NearMarkerLayer} from "./utilLayer/NearMarkerLayer";
import {RegionChooseLayer} from "./utilLayer/RegionChooseLayer";
import geoTransUtil1 from "./utils/geoTransUtil";
import turf from "turf";

/**
 * 地图管理类
 */
export class MapManager {

    constructor(map,{Xb3DMap,is_three_3d,customRenderMassMarksClass,customRenderHtmlMarker,customRenderPolygon,customRenderPolyline}) {
        this.mapObj = map;
        /**
         * 3D 地图类
         * @type {Xb3DMap}
         */
        this.Xb3DMap = Xb3DMap;
        this.is_three_3d = is_three_3d;
        this.customRenderMassMarks = customRenderMassMarksClass;
        this.customRenderHtmlMarker = customRenderHtmlMarker;
        this.customRenderPolygon = customRenderPolygon;
        this.customRenderPolyline = customRenderPolyline;

        /**
         * hover管理类
         * @type {MarkerHoverLayer}
         */
        this.markerHoverLayer = new MarkerHoverLayer(map,this);
        /**
         * infoWindow管理类
         * @type {InfoWindowLayer}
         */
        this.infoWindowLayer = new InfoWindowLayer(map,this);
        /**
         * marker管理类
         * @type {MarkerLayer}
         */
        this.markerLayer = new MarkerLayer(map,this);
        /**
         * polygonLayer 管理类
         * @type {PolygonLayer}
         */
        this.polygonLayer = new PolygonLayer(map,this);
        /**
         * polygonLayer 管理类
         * @type {PolygonLayer}
         */
        this.polylineLayer = new PolylineLayer(map,this);
        /**
         * 圆范围选择管理
         * @type {CircleChooseLayer}
         */
        this.circleChooseLayer = new CircleChooseLayer(map,this);
        /**
         * 附近的marker，点击的时候判断
         * @type {NearMarkerLayer}
         */
        this.nearMarkerLayer = new NearMarkerLayer(map,this);
        /**
         * 框选
         * @type {RegionChooseLayer}
         */
        this.regionChooseLayer = new RegionChooseLayer(map,this);

        /**
         * 鼠标移开，是否移除maker
         * @type {boolean}
         */
        this.mouseoutRemoveHover = true;

        this.maxFitDis = 300;
    }

    /**
     * 设置是否移除
     * @param remove
     */
    setMouseoutRemoveHover(remove){
        this.mouseoutRemoveHover = remove;
    }
    /**
     * 移除 hover marker
     */
    removeHover(){
        this.markerHoverLayer.remove();
        // this.infoWindowLayer.remove();
    }
    /**
     * 移除 infoWindow
     */
    removeInfoWindow(){
        this.infoWindowLayer.remove();
    }
    mouseover(hover_marker,data_index,originalMarkerOption){
        if(hover_marker){
            this.markerHoverLayer.render(hover_marker,data_index,originalMarkerOption)
        }
    }
    setMaxFitDis(dis){
        this.maxFitDis = dis;
    }
    getRenderHtml(el,options,is_vue){

        if(options.size){
            el.style.width = options.size[0]+'px';
            el.style.height = options.size[1]+'px';
        }
        el.addEventListener('wheel',(e)=>{
            e.stopPropagation()
        });
        let component = null;
        if(is_vue){
            component  = new Vue({
                render: h => h(options.content,{props:options.props}),
            }).$mount();
            el.appendChild(component.$el);
        }else{
            el.innerHTML = options.content;
        }
        return component;
    }
    mouseout(markerData){
        this.markerHoverLayer.remove(markerData.data_index)
    }
    click(infoWindow){
        if(infoWindow){
            this.infoWindowLayer.render(infoWindow)
        }
    }

    /**
     * marker需要实现 remove，hide，show
     * @param fn fn(el,item,options)
     */
    setCustomRenderHtmlMarker(fn){
        this.customRenderHtmlMarker = fn;
    }
    getCustomRenderHtmlMarker(){
        return this.customRenderHtmlMarker;
    }
    /**
     * massMarksClass(map) 需要实现
     * on('click',{e.data}) on('mousemove',{e.data}) <br>
     * clear(),setData,setStyle
     * @param massMarksClass
     */
    setCustomRenderMassMarks(massMarksClass){
        this.customRenderMassMarks = massMarksClass;
    }
    getCustomRenderMassMarks(){
        return this.customRenderMassMarks;
    }
    getCustomRenderPolygon(){
        return this.customRenderPolygon;
    }
    getCustomRenderPolyline(){
        return this.customRenderPolyline;
    }
    getCameraPos(){
        let center = this.mapObj.getCenter();
        return {
            center: [center.lng,center.lat],
            rotation: this.mapObj.getRotation(),
            zoom: this.mapObj.getZoom(),
            pitch: this.mapObj.getPitch(),
        }
    }
    /**
     *
     * @param options {center:[],zoom:15,pitch:27,rotation：1.4}
     * <br />
     * 示例：<br />
     *   {
     *              center: [100.74790698736541, 26.687964987784724],
     *              zoom: 15.297986626793138,
     *              pitch: 27,
     *              rotation: 1.4736842105263232,
     *      }
     */
    flyTo(options){
        this.mapObj.flyTo(options);
    }

    lngLatToMap(lngLat){
        return this.layerServer.toMapLayer(lngLat[0],lngLat[1]);
    }
    lngLatToGaoDe(lngLat){
        return this.layerServer.toGaode(lngLat[0],lngLat[1]);
    }
    /**
     *
     * @param options {{padding:[],fit_list:[]}}
     * <br />
     * padding:[100, 450, 60, 450] 设置上右下左
     * <br />
     * fit_list:[[112,33], [112,33], ]
     */
    fitView(options={}){
        let default_options = {
            padding:[100, 450, 60, 450],
            fit_list:[],
        }
        options = {...default_options,...options};

        let fit_list = options.fit_list;


        if(!fit_list.length && this.is_three_3d){
            this.markerLayer.getAllData().forEach(data =>{
                fit_list.push([data.lng,data.lat]);
            })

            this.polygonLayer.getAllData().forEach(data =>{
                fit_list.push(...data.path);
            })
            this.polygonLayer.getAllData().forEach(data =>{
                fit_list.push(...data.path);
            })
        }


        let objs = null;
        if(fit_list.length){

            let min_pos = null;
            let max_pos = null;
            let lng_list = [];
            let lat_list = [];
            fit_list.forEach(item =>{
                lng_list.push(item[0]);
                lat_list.push(item[1]);

            })
            max_pos = [Math.max(...lng_list),Math.max(...lat_list)];
            min_pos = [Math.min(...lng_list),Math.min(...lat_list)];

            let path = [min_pos,[min_pos[0],max_pos[1]],max_pos,[max_pos[0],min_pos[1]]];
      //      path = [[82.44081677135236,30.459389912429064],[82.4403427630031,43.81210183368501],[104.18992799655474,43.81163643721236],[104.19071320616311,30.45918551769319]];
            if(this.is_three_3d){
                let polygon = new this.Xb3DMap.Polygon({
                    path: [path.map(item => geoTransUtil1.gcj02towgs84(item[0],item[1]))],
                });
                objs = polygon;
            }else{
                let polygon = new AMap.Polygon({
                    path: path.map(item => this.lngLatToMap(item)),
                })
                objs = [polygon];
            }


        }
        if(this.is_three_3d && !objs) {
            console.log('fitView no data');
            return;
        }
        if(this.is_three_3d){
            let _from = turf.point(objs.path[0][0]);
            let _to = turf.point(objs.path[0][2]);
            let options = "kilometers";
            let _distance = turf.distance(_from, _to, options);
            if(_distance >= this.maxFitDis){
                console.warn('fitView is big '+this.maxFitDis+' -to ',_distance);
                return;
            }
        }
        let avoid = [options.padding[0],options.padding[2],options.padding[1],options.padding[3]];
        console.log('fitView',objs,'avoid',avoid);
        this.mapObj.setFitView(objs, false, avoid);
    }
}