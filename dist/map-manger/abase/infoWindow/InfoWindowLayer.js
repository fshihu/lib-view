import {MarkerLayerRenderHtml} from "../marker/MarkerLayerRenderHtml";
import {MarkerViewHtml} from "../marker/MarkerViewHtml";
import {MarkerData} from "../marker/MarkerData";
import {InfoWindowViewNormal} from "./InfoWindowViewNormal";
import {MapManager} from "../MapManager";
import geoTransUtil1 from "../utils/geoTransUtil";

class ModalInfoWindow{
    constructor(el,options) {
        el.className = 'base_info_window_warp_modal '+options.modal_class_name;
        el.style.zIndex = options.modal_z_index;
        document.body.append(el);
        setTimeout(()=>{
            if(el.children.length){
                if(el.children[0].classList){
                    el.children[0].classList.add('in');
                }else{
                    el.children[0].className = 'in';
                }

            }
        },50)
        this.el  = el;
    }
    close(){
        if(this.el){
            if(this.el.children.length){
                if(this.el.children[0].classList){
                    this.el.children[0].classList.remove('in');
                }else{
                    this.el.children[0].className = '';
                }
            }
            setTimeout(()=>{
                this.el.remove();
            },300)
        }
    }
}
export class InfoWindowLayer {
    constructor(map, mapManager) {
        this.map = map;
        this.mapManager = mapManager;
        this.infoWindow = null;
        this.component = null;
    }

    render(infoWindowViewNormal) {
        this.remove();
        if (infoWindowViewNormal instanceof InfoWindowViewNormal) {
            infoWindowViewNormal.setMapObj(this.map);
            infoWindowViewNormal.setCloseFn(()=>{
                this.remove();
            })
            let el = document.createElement('div');
            el.className = 'base_info_window_warp';
            let options = infoWindowViewNormal.getFinalRenderOptions({el,data:infoWindowViewNormal.data});
            let is_vue = options.is_vue;

            if(this.infoWindow){
                this.infoWindow.close();
            }

            if (this.mapManager instanceof MapManager) {

                const component = this.mapManager.getRenderHtml(el, options, is_vue);

                if(options.is_modal){
                    this.renderModalWindow(el,options)
                }else{
                    this.renderInfoWindow(el,options,infoWindowViewNormal)
                }

                this.component = component;

            }
        } else {
            console.log(infoWindowViewNormal, '需要继承 InfoWindowViewNormal')
        }
    }

    remove() {
        this.removeComponent();
        if(this.infoWindow){
            this.infoWindow.close();
        }
    }
    removeComponent() {
        if (this.component) {
            this.component.$destroy();
        }
    }
    renderModalWindow(el,options){
        this.infoWindow = new ModalInfoWindow(el,options);
    }
    renderInfoWindow(el,options,infoWindowViewNormal){
        if(this.mapManager.is_three_3d){
            const infoWindow = new this.mapManager.Xb3DMap.InfoWindow({
                isCustom: true,
                anchor: 'bottom-center',
                closeWhenClickMap: true,
                autoMove:true,
                content:el,
                position: geoTransUtil1.gcj02towgs84(infoWindowViewNormal.data.lng, infoWindowViewNormal.data.lat),
            });
            this.infoWindow = infoWindow;
            infoWindow.component = component;
            const onClose = ()=>{
                infoWindow.close();
                if(infoWindow.component){
                    infoWindow.component.$destroy();
                }
                this.map.off('click',onClose);
            };
            this.map.on('click',onClose);
            this.infoWindow.setMap(this.map);
        }else{
            this.infoWindow = new AMap.InfoWindow({
                isCustom: true,
                anchor: 'bottom-center',
                retainWhenClose:true,
                closeWhenClickMap: true,
                autoMove:false,
                content:el,
                position: this.mapManager.lngLatToMap([infoWindowViewNormal.data.lng, infoWindowViewNormal.data.lat]),

            });
            this.infoWindow.on('close', () => {
                this.removeComponent();
            });


        }

        let width = this.map.getContainer().clientWidth;
        let height = this.map.getContainer().clientHeight;

        let _from_lnglat,_to_lnglat;
        let pixel = [0, 0];
        let pixel2 = [width, height];
        _from_lnglat = this.map.containerToLngLat(pixel);
        _to_lnglat = this.map.containerToLngLat(pixel2);
        let px_lat = (_from_lnglat.lat-_to_lnglat.lat)/height;
        let offest_lat = px_lat * (height/2 - options.pos_bottom);
        let new_center = [infoWindowViewNormal.data.lng,infoWindowViewNormal.data.lat];
        if(this.mapManager.is_three_3d){
            // this.map.flyTo( {
            //     center: new_center,
            // });

            // if(options.autoMove){
            //     this.mapManager.mapObj.setCenter(new_center);
            // }
            // console.log('_fitBoundsByPoint',geoTransUtil1.gcj02towgs84(new_center[0],new_center[1]), [  options.pos_bottom, 0, 0, 0],20);
            // this.mapManager.mapObj._fitBoundsByPoint(geoTransUtil1.gcj02towgs84(new_center[0],new_center[1]), [ options.pos_bottom, 0,0, 0],20);

        }else{
            // let marker1 = new AMap.Marker({
            //     // map: mapManager.mapObj,
            //     position: this.mapManager.lngLatToMap(new_center),
            // });
            // this.mapManager.mapObj.setFitView(
            //     [ marker1],  // 覆盖物数组
            //     false,  // 动画过渡到制定位置
            //     [height-options.pos_bottom, options.pos_bottom, 60, 60],  // 周围边距，上、下、左、右
            //     17,
            // );
        }

        this.infoWindow.open(this.map);
    }

}